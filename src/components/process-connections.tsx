"use client";

import { useId, useLayoutEffect, useRef } from "react";
import { processConnections } from "@/lib/business-process";
import { systemModules } from "@/lib/modules";
import { externalPrograms } from "@/lib/external-programs";

import { connectionPath, incomingPortOffsets, type CardPose } from "@/lib/process-geometry";
import { createProcessPointerMotion } from "@/lib/process-pointer-motion";

const nodeLabel = (id: string) => systemModules.find((module) => module.id === id)?.title ?? externalPrograms.find((program) => `external:${program.file}` === id)?.name ?? id;

const pulseLayers = [
  {r: 1.2, opacity: .18, lag: .16}, {r: 1.7, opacity: .32, lag: .1},
  {r: 2.1, opacity: .55, lag: .05}, {r: 9, opacity: .08, lag: 0},
  {r: 5.5, opacity: .2, lag: 0}, {r: 3, opacity: 1, lag: 0},
];

export function ProcessConnections({ moving, showIntegrations }: { moving: boolean; showIntegrations: boolean }) {
  // Keep geometry, ports and SMIL timelines stable when integrations are hidden.
  const connections = processConnections;
  const id = useId().replace(/:/g, "");
  const svg = useRef<SVGSVGElement>(null);
  useLayoutEffect(() => {
    const canvas = svg.current?.parentElement;
    if (!canvas || !svg.current) return;
    const cards = Array.from(canvas.querySelectorAll<HTMLElement>("[data-module-id], [data-external-program]")).map((node) => ({
      id: node.dataset.moduleId ?? `external:${node.dataset.externalProgram}`, node, card: node.querySelector<HTMLElement>(".module-card, [data-pointer-surface]")!,
    }));
    const paths = connections.map((_, index) => canvas.querySelector<SVGPathElement>(`[id="${id}-edge-${index}"]`));
    const pointerMotion = createProcessPointerMotion(canvas.closest<HTMLElement>(".process-workspace") ?? canvas, moving);
    let frame = 0;
    function update(time: number) {
      // Apply pointer movement first so every arrow follows it in the same frame.
      pointerMotion.update(time);
      const bounds = canvas!.getBoundingClientRect();
      // Read all layout/transform data before writing the SVG paths.
      const poses = new Map<string, CardPose>(cards.map(({id, node, card}) => {
        const rect = card.getBoundingClientRect();
        const parentMatrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
        const cardStyle = getComputedStyle(card);
        const matrix = parentMatrix.multiply(new DOMMatrixReadOnly(cardStyle.transform));
        return [id, {x: rect.left + rect.width / 2 - bounds.left, y: rect.top + rect.height / 2 - bounds.top,
          width: parseFloat(cardStyle.width), height: parseFloat(cardStyle.height), a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d}];
      }));
      const offsets = incomingPortOffsets(poses, connections);
      connections.forEach((connection, index) => {
        const from = poses.get(connection.from);
        const to = poses.get(connection.to);
        if (from && to) paths[index]?.setAttribute("d", connectionPath(from, to, {...connection, toOffset: offsets[index], angledArrival: true}));
      });
      frame = requestAnimationFrame(update);
    }
    update(performance.now());
    return () => { cancelAnimationFrame(frame); pointerMotion.destroy(); };
  }, [moving, connections, id]);

  function renderEdges(foreground: boolean) {
    const entries = connections.map((connection, index) => ({...connection, index})).filter(({from}) => (from === "external:1c.svg") === foreground);
    return <>
      {entries.map(({from, to, path, kind, index}) => <path className="process-edge" data-kind={kind} aria-hidden={kind === "integration" && !showIntegrations ? true : undefined} id={`${id}-edge-${index}`} key={`${from}-${to}`} d={path} markerEnd={`url(#${id}-arrow-${kind ?? "default"})`}>
        <title>{nodeLabel(from)} → {nodeLabel(to)}</title>
      </path>)}
      {moving && <g className="process-flow" aria-hidden="true">
        {entries.map(({from, to, kind, index}) => <g key={`${from}-${to}`} data-kind={kind}>
          {pulseLayers.map(({r, opacity, lag}, part) => <circle key={part} r={r * .7} fill="currentColor" opacity={opacity}>
            <animateMotion dur="3.6s" begin={`${-index * .45 + lag}s`} repeatCount="indefinite" calcMode="paced"><mpath href={`#${id}-edge-${index}`} /></animateMotion>
          </circle>)}
          <circle r=".75" fill="white"><animateMotion dur="3.6s" begin={`${-index * .45}s`} repeatCount="indefinite" calcMode="paced"><mpath href={`#${id}-edge-${index}`} /></animateMotion></circle>
        </g>)}
      </g>}
    </>;
  }

  return <>
    <svg ref={svg} className="process-connections" viewBox="0 0 1346 665" role="img" aria-label="Связи между модулями">
      <defs>{["default", "integration"].map((kind) => <marker key={kind} id={`${id}-arrow-${kind}`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7.2" markerHeight="7.2" markerUnits="userSpaceOnUse" orient="auto">
        <path d="M0 0 L10 5 L0 10 Z" fill={kind === "integration" ? "#20d33b" : "currentColor"} />
      </marker>)}</defs>
      {renderEdges(false)}
    </svg>
    <svg className="process-connections process-connections-foreground" viewBox="0 0 1346 665" role="img" aria-label="Связи 1С" aria-hidden={!showIntegrations}>
      {renderEdges(true)}
    </svg>
  </>;
}
