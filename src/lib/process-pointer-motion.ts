/** Small, interruptible spring displacement inside a stable card hit area. */
export function createProcessPointerMotion(canvas: HTMLElement, enabled: boolean) {
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const states = new Map<HTMLElement, {x: number; y: number; vx: number; vy: number; tx: number; ty: number}>();
  let previousTime = performance.now();
  function release() {
    states.forEach((state) => { state.tx = 0; state.ty = 0; });
  }
  function clear() {
    states.forEach((_, card) => card.style.removeProperty("transform"));
    states.clear();
  }
  function move(event: PointerEvent) {
    if (!enabled || !finePointer.matches || reducedMotion.matches || event.pointerType === "touch") return;
    const node = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-module-id], [data-external-program]") : null;
    release();
    if (!node || !canvas.contains(node)) return;
    const card = node.querySelector<HTMLElement>(".module-card, [data-pointer-surface]");
    if (!card) return;
    const bounds = node.getBoundingClientRect();
    const state = states.get(card) ?? {x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0};
    state.tx = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)) * 12;
    state.ty = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)) * 10;
    states.set(card, state);
  }
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerleave", release);
  canvas.addEventListener("pointercancel", release);
  finePointer.addEventListener("change", clear);
  reducedMotion.addEventListener("change", clear);
  window.addEventListener("blur", release);
  return {
    update(time: number) {
      const dt = Math.min(Math.max((time - previousTime) / 1000, 0), .032);
      previousTime = time;
      states.forEach((state, card) => {
        // mass 1, stiffness 100, damping 10; carry velocity as the pointer changes direction.
        state.vx += ((state.tx - state.x) * 100 - state.vx * 10) * dt;
        state.vy += ((state.ty - state.y) * 100 - state.vy * 10) * dt;
        state.x += state.vx * dt;
        state.y += state.vy * dt;
        card.style.transform = `translate(${state.x}px, ${state.y}px)`;
        if (state.tx === 0 && state.ty === 0 && Math.hypot(state.x, state.y, state.vx, state.vy) < .01) {
          card.style.removeProperty("transform");
          states.delete(card);
        }
      });
    },
    destroy() {
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", release);
      canvas.removeEventListener("pointercancel", release);
      finePointer.removeEventListener("change", clear);
      reducedMotion.removeEventListener("change", clear);
      window.removeEventListener("blur", release);
      clear();
    },
  };
}
