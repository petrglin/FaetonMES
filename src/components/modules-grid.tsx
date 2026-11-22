"use client";

import Image from "next/image";
import Link from "next/link";
import { systemModules } from "@/lib/modules";

export function ModulesGrid({ selectedIds = [], onToggle, moduleIds }: { selectedIds?: string[]; onToggle?: (id: string) => void; moduleIds?: string[] }) {
  return (
    <ul className="modules-grid">
      {(moduleIds ? moduleIds.flatMap((id) => systemModules.filter((module) => module.id === id)) : systemModules).map(({ id, title, image, description }) => {
        const content = <>
            <div className="module-art">
              <Image src={image} width={400} height={260} alt="" sizes="(max-width: 599px) 50vw, (max-width: 1023px) 25vw, (max-width: 1279px) 17vw, 10vw" />
            </div>
            <div className="module-content">
              <h3 id={"module-" + id}>{title}</h3>
            </div>
            <div className="module-description" aria-hidden={description ? undefined : true}>
              <p className="module-description-title" aria-hidden="true">{title}</p>
              {description && <p>{description}</p>}
            </div>
        </>;
        return <li key={id} data-module-id={id} className={onToggle ? "module-choice" : undefined} data-selected={onToggle ? selectedIds.includes(id) : undefined}>{["order-entry", "engineering-configurator", "custom-design", "product-specifications", "cnc-programs", "production", "planning", "warehouse", "packaging", "shipping", "equipment-monitoring", "service-orders", "resources", "reports-bi"].includes(id)
          ? <Link className="module-card" href={`/features/${id}`} aria-labelledby={"module-" + id}>{content}</Link>
          : <article className="module-card" aria-labelledby={"module-" + id} tabIndex={0}>{content}</article>
        }{onToggle && <label className="module-picker" title={`Включить модуль «${title}» в расчёт`}><input type="checkbox" aria-label={`Включить модуль «${title}» в расчёт`} checked={selectedIds.includes(id)} onChange={() => onToggle(id)} /></label>}</li>;
      })}
    </ul>
  );
}
