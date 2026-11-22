"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ProcessConnections } from "@/components/process-connections";
import { ProcessExternalPrograms } from "@/components/process-external-programs";
import { ModulesGrid } from "@/components/modules-grid";
import { processModuleIds } from "@/lib/business-process";

export function HomeModules() {
  const [graph, setGraph] = useState(false);
  const [connectionsReady, setConnectionsReady] = useState(false);
  const [moving, setMoving] = useState(true);
  const [showIntegrations, setShowIntegrations] = useState(true);
  const section = useRef<HTMLElement>(null);
  const processViewport = useRef<HTMLDivElement>(null);
  const previousRects = useRef(new Map<string, DOMRect>());
  const animations = useRef<Animation[]>([]);
  function changeView(next: boolean) {
    if (next === graph) return;
    animations.current.forEach((animation) => animation.cancel());
    setConnectionsReady(false);
    previousRects.current = new Map(Array.from(section.current?.querySelectorAll<HTMLElement>("[data-module-id]") ?? []).map((node) => [node.dataset.moduleId!, node.getBoundingClientRect()]));
    setGraph(next);
  }
  useLayoutEffect(() => {
    if (!graph || !processViewport.current) return;
    const viewport = processViewport.current;
    const workspace = viewport.querySelector<HTMLElement>(".process-workspace");
    if (!workspace) return;
    function center() {
      if (window.matchMedia("(max-width: 767px)").matches) {
        viewport.scrollLeft = 0;
        return;
      }
      const nodes = Array.from(workspace!.querySelectorAll<HTMLElement>("[data-module-id], [data-external-program]"));
      if (!nodes.length) return;
      // Use layout positions so hovering, drifting and the entrance animation do not move the viewport.
      const edges = nodes.map((node) => {
        const canvas = node.closest<HTMLElement>(".process-canvas");
        const left = node.offsetLeft + (canvas?.offsetLeft ?? 0);
        return {left, right: left + node.offsetWidth};
      });
      const midpoint = (Math.min(...edges.map((edge) => edge.left)) + Math.max(...edges.map((edge) => edge.right))) / 2;
      viewport.scrollLeft = Math.max(0, Math.min(viewport.scrollWidth - viewport.clientWidth, midpoint - viewport.clientWidth / 2));
    }
    center();
    const observer = new ResizeObserver(center);
    observer.observe(viewport);
    observer.observe(workspace);
    return () => observer.disconnect();
  }, [graph]);
  useLayoutEffect(() => {
    if (!graph || !moving || !processViewport.current || !window.matchMedia("(max-width: 767px)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const viewport = processViewport.current;
    let frame = 0;
    let previous = 0;
    const speed = 18; // px/sec: slow enough to read while the diagram travels.
    const animate = (time: number) => {
      if (previous) {
        const limit = viewport.scrollWidth - viewport.clientWidth;
        if (limit > 0) {
          viewport.scrollLeft += speed * Math.min((time - previous) / 1000, 0.05);
          if (viewport.scrollLeft >= limit - 1) viewport.scrollLeft = 0;
        }
      }
      previous = time;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [graph, moving]);
  useLayoutEffect(() => {
    if (!previousRects.current.size) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    animations.current = Array.from(section.current?.querySelectorAll<HTMLElement>("[data-module-id]") ?? []).map((node) => {
      const before = previousRects.current.get(node.dataset.moduleId!);
      const after = node.getBoundingClientRect();
      const from = before && !reduced
        ? { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${before.width / after.width}, ${before.height / after.height})`, opacity: 1 }
        : { transform: "none", opacity: 0 };
      return node.animate([from, {transform: "none", opacity: 1}], {duration: reduced ? 160 : (graph ? 840 : 280), easing: "cubic-bezier(0.77, 0, 0.175, 1)"});
    });
    previousRects.current.clear();
    let active = true;
    // Follow actual animation completion, including slowed playback, rather than a timer.
    if (graph) {
      void Promise.all(animations.current.map((animation) => animation.finished))
        .then(() => { if (active) setConnectionsReady(true); })
        .catch(() => { /* A cancelled transition must not reveal connections. */ });
    }
    return () => {
      active = false;
      animations.current.forEach((animation) => animation.cancel());
    };
  }, [graph]);
  return (
    <section ref={section} className="modules-section" aria-labelledby="modules-heading">
      <div className="modules-heading-row">
        <h2 id="modules-heading"><button className="modules-view-button" aria-pressed={!graph} aria-controls="home-modules-view" onClick={() => changeView(false)}>Возможности MES/ERP</button></h2>
        <button className="business-process-link" aria-pressed={graph} aria-controls="home-modules-view" onClick={() => changeView(!graph)}>Бизнес-процесс</button>
      </div>
      <div id="home-modules-view">
        {graph ? <div className="business-process-view" data-moving={moving}>
          <div className="process-toolbar">
            <button className="process-integration-toggle" aria-expanded={showIntegrations} aria-controls="process-external-programs" onClick={() => setShowIntegrations((value) => !value)}>{showIntegrations ? "Скрыть интеграции" : "Показать интеграции"}</button>
            <button className="process-motion-toggle" aria-pressed={!moving} onClick={() => setMoving((value) => !value)}>{moving ? "Приостановить анимацию" : "Продолжить анимацию"}</button>
          </div>
          <div ref={processViewport} className="process-scroll" tabIndex={0} role="region" aria-label="Схема бизнес-процесса. На небольшом экране прокрутите по горизонтали.">
            <div className="process-workspace" data-show-integrations={showIntegrations}>
              <aside className="process-caption" aria-label="О схеме бизнес-процесса">
                <p>Здесь представлена принципиальная схема бизнес-процесса движения данных через модули системы <strong>FaetonMES</strong> с учётом интеграции с различными внешними приложениями.</p>
                <p>Схема является иллюстративной и показывает основные связи между модулями и внешними системами.</p>
              </aside>
              {connectionsReady && <ProcessConnections moving={moving} showIntegrations={showIntegrations} />}
              <ProcessExternalPrograms visible={showIntegrations} />
              <div className="process-canvas">
                <ModulesGrid moduleIds={processModuleIds} />
              </div>
            </div>
          </div>
        </div> : <ModulesGrid />}
      </div>
    </section>
  );
}
