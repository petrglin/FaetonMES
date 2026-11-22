"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { SolutionProcess } from "@/components/solution-process-preview";

type SolutionProcessState = {
  active: SolutionProcess | null;
  toggle: (id: SolutionProcess) => void;
};

const SolutionProcessContext = createContext<SolutionProcessState | null>(null);

export function SolutionProcessGrid({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SolutionProcess | null>(null);
  const grid = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!active) return;

    function closeOnOutsideClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (
        grid.current?.contains(target)
        && target.closest(".solution-card, .solution-process-toggle, .solution-process-figure, .solution-components")
      ) return;
      setActive(null);
    }

    document.addEventListener("click", closeOnOutsideClick, true);
    return () => document.removeEventListener("click", closeOnOutsideClick, true);
  }, [active]);

  return (
    <SolutionProcessContext.Provider value={{
      active,
      toggle: id => setActive(current => current === id ? null : id),
    }}>
      <ul
        ref={grid}
        className="solutions-grid"
        data-expanded={active !== null || undefined}
        onKeyDown={event => {
          if (event.key === "Escape") setActive(null);
        }}
      >
        {children}
      </ul>
    </SolutionProcessContext.Provider>
  );
}

export function SolutionProcessCard({ id, title, children, preview }: {
  id: SolutionProcess;
  title: string;
  children: ReactNode;
  preview: ReactNode;
}) {
  const state = useContext(SolutionProcessContext);
  const card = useRef<HTMLLIElement>(null);
  const expanded = state?.active === id;
  const controls = `${id}-process-preview`;

  useEffect(() => {
    if (expanded) card.current?.scrollIntoView({ block: "nearest" });
  }, [expanded]);

  if (!state) throw new Error("SolutionProcessCard must be inside SolutionProcessGrid");

  return (
    <>
      <li
        ref={card}
        className="expandable-solution-card"
        data-solution-id={id}
        data-expanded={expanded || undefined}
      >
        <div className="solution-card">{children}</div>
        <button
          type="button"
          className="solution-process-toggle"
          aria-label={`${expanded ? "Свернуть" : "Развернуть"} схему: ${title}`}
          aria-controls={controls}
          aria-expanded={expanded}
          onClick={() => state.toggle(id)}
        />
      </li>
      <li id={controls} className="solution-process-slot" data-expanded={expanded || undefined}>
        {preview}
      </li>
    </>
  );
}
