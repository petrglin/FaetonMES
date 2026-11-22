export type CardPose = {
  x: number; y: number; width: number; height: number;
  a: number; b: number; c: number; d: number;
};
type Side = "left" | "right" | "top" | "bottom";

/** Midpoint of the actual transformed edge, rather than the axis-aligned bounding box. */
export function edgePort(card: CardPose, side: Side, offset = 0) {
  const dx = side === "left" ? -1 : side === "right" ? 1 : 0;
  const dy = side === "top" ? -1 : side === "bottom" ? 1 : 0;
  const nx = card.a * dx + card.c * dy;
  const ny = card.b * dx + card.d * dy;
  const length = Math.hypot(nx, ny) || 1;
  // Stay on the straight part of a rounded card edge.
  const along = Math.max(-.65, Math.min(.65, offset));
  const localX = dx * card.width / 2 + (dy ? along * card.width / 2 : 0);
  const localY = dy * card.height / 2 + (dx ? along * card.height / 2 : 0);
  return {
    x: card.x + card.a * localX + card.c * localY,
    y: card.y + card.b * localX + card.d * localY,
    nx: nx / length, ny: ny / length,
  };
}

export type ConnectionRouting = { vertical?: boolean; detour?: "left" | "right"; detourGap?: number; bendRadius?: number; toBottom?: boolean; bottomLane?: number; topLane?: number; fromSide?: Side; toSide?: Side; fromOffset?: number; toOffset?: number; endGap?: number; angledArrival?: boolean };

function connectionSides(from: CardPose, to: CardPose, routing: ConnectionRouting): {from: Side; to: Side} {
  if (routing.topLane !== undefined) return {from: "top", to: "top"};
  if (routing.bottomLane !== undefined) return {from: "right", to: "bottom"};
  if (routing.detour) return {from: routing.detour, to: routing.detour};
  const downward = to.y > from.y;
  return {
    from: routing.fromSide ?? (routing.vertical ? (downward ? "bottom" : "top") : "right"),
    to: routing.toSide ?? (routing.toBottom ? "bottom" : routing.vertical ? (downward ? "top" : "bottom") : "left"),
  };
}

/** Give each arrow its own entry port, ordered by the location of its source. */
export function incomingPortOffsets(poses: ReadonlyMap<string, CardPose>, connections: readonly (ConnectionRouting & {from: string; to: string})[]) {
  const groups = new Map<string, {index: number; position: number}[]>();
  connections.forEach((connection, index) => {
    const from = poses.get(connection.from), to = poses.get(connection.to);
    if (!from || !to) return;
    const side = connectionSides(from, to, connection).to;
    const key = `${connection.to}:${side}`;
    const entries = groups.get(key) ?? [];
    entries.push({index, position: side === "top" || side === "bottom" ? from.x : from.y});
    groups.set(key, entries);
  });
  const offsets = connections.map(() => 0);
  groups.forEach((entries) => {
    entries.sort((a, b) => Math.abs(a.position - b.position) > 8 ? a.position - b.position : a.index - b.index);
    const spread = Math.min(.65, (entries.length - 1) * .22);
    entries.forEach(({index}, position) => { offsets[index] = entries.length > 1 ? (position / (entries.length - 1) * 2 - 1) * spread : 0; });
  });
  return offsets;
}

export function connectionPath(from: CardPose, to: CardPose, routing: ConnectionRouting = {}) {
  const {vertical = false, detour, detourGap, bendRadius, bottomLane, topLane, endGap = 0, angledArrival = false} = routing;
  const sides = connectionSides(from, to, routing);
  const start = edgePort(from, sides.from, routing.fromOffset);
  const endPort = edgePort(to, sides.to, routing.toOffset);
  const end = { ...endPort, x: endPort.x + endPort.nx * endGap, y: endPort.y + endPort.ny * endGap };
  if (topLane !== undefined) {
    const size = Math.min(from.width, to.width);
    const laneY = Math.min(start.y, end.y) - size * topLane;
    const turn = size * .08;
    const direction = end.x >= start.x ? 1 : -1;
    return `M${start.x} ${start.y} C${start.x} ${laneY} ${start.x} ${laneY} ${start.x + direction * turn} ${laneY} L${end.x - direction * turn} ${laneY} C${end.x} ${laneY} ${end.x + end.nx * turn} ${end.y + end.ny * turn} ${end.x} ${end.y}`;
  }
  if (bottomLane !== undefined) {
    const size = Math.min(from.width, to.width);
    const laneX = start.x + size * .24;
    const laneY = end.y + size * bottomLane;
    // Broad elliptical bends stay inside the free corridor and meet each straight tangentially.
    const turnX = Math.min(size * .24, Math.abs(end.x - laneX) * .45);
    const turnY = Math.min(size * .32, Math.abs(start.y - laneY) * .45);
    const endHandle = Math.min(turnX, Math.abs(end.y - laneY) * .75);
    return `M${start.x} ${start.y} C${laneX} ${start.y} ${laneX} ${start.y} ${laneX} ${start.y - turnY} L${laneX} ${laneY + turnY} C${laneX} ${laneY} ${laneX} ${laneY} ${laneX + turnX} ${laneY} L${end.x - turnX} ${laneY} C${end.x} ${laneY} ${end.x + end.nx * endHandle} ${end.y + end.ny * endHandle} ${end.x} ${end.y}`;
  }
  if (detour) {
    const size = Math.min(from.width, to.width);
    const handle = size * .16;
    const gap = detourGap ?? size * .32;
    const outside = detour === "right" ? Math.max(start.x, end.x) + gap : Math.min(start.x, end.x) - gap;
    const turn = Math.min(bendRadius ?? size * .28, gap * .9, Math.abs(end.y - start.y) / 3);
    const sign = end.y >= start.y ? 1 : -1;
    return `M${start.x} ${start.y} C${start.x + start.nx * handle} ${start.y + start.ny * handle} ${outside} ${start.y} ${outside} ${start.y + sign * turn} L${outside} ${end.y - sign * turn} C${outside} ${end.y} ${end.x + end.nx * handle} ${end.y + end.ny * handle} ${end.x} ${end.y}`;
  }
  const dx = start.x - end.x;
  const dy = start.y - end.y;
  const distance = Math.max(1, (vertical ? Math.abs(dy) : Math.abs(dx)) / 2);
  let endControlX = end.x + end.nx * distance;
  let endControlY = end.y + end.ny * distance;
  if (angledArrival) {
    // Tilt the final handle toward the source while keeping it outside the destination edge.
    const normal = Math.max(1, dx * end.nx + dy * end.ny);
    const lateral = (dy * end.nx - dx * end.ny) / normal;
    const offset = Math.max(-1.6, Math.min(1.6, lateral)) * distance;
    endControlX -= end.ny * offset;
    endControlY += end.nx * offset;
  }
  return `M${start.x} ${start.y} C${start.x + start.nx * distance} ${start.y + start.ny * distance} ${endControlX} ${endControlY} ${end.x} ${end.y}`;
}
