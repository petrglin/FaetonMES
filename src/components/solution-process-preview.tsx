"use client";

import { useEffect, useRef } from "react";
import { connectionPath, type CardPose, type ConnectionRouting } from "@/lib/process-geometry";

const stageScale = 1.32;
const stageWidth = 58 * stageScale;
const stageHeight = 46 * stageScale;
const previewWidth = 574;
const arrowRouting = { endGap: 1.8, angledArrival: true };

type Stage = {
  id: string;
  x: number;
  y: number;
  lines: string[];
  icon?: string;
};

type Edge = ConnectionRouting & { id: string; from: string; to: string; kind: "integration" | "internal" };

const kitchenStages: Stage[] = [
  { x: 196, y: 42, id: "order-entry", lines: ["Обработка заказа", "на фабрике"] },
  { x: 292, y: 25, id: "engineering-configurator", lines: ["Инженерный", "конфигуратор"] },
  { x: 285, y: 106, id: "custom-design", lines: ["Индивидуальное", "проектирование"] },
  { x: 391, y: 46, id: "cnc-programs", lines: ["Создание", "файлов ЧПУ"] },
  { x: 489, y: 30, id: "production", lines: ["Управление", "производством"] },
  { x: 481, y: 109, id: "shipping", lines: ["Отгрузка"] },
];

const kitchenLogos = [
  { id: "design", file: "design-faeton.png", x: 3, y: 16, width: 63, height: 31.5 },
  { id: "3cad", file: "3cad.webp", x: 42, y: 60, width: 24, height: 24 },
  { id: "bazis", file: "bazis.webp", x: 42, y: 106, width: 24, height: 24 },
  { id: "easyorder", file: "easyorder-crm-transparent.png", x: 97, y: 55, width: 81, height: 34 },
  { id: "1c", file: "1c.svg", x: 510.28, y: 1, width: 34, height: 16 },
];

const kitchenEdges: Edge[] = [
  { id: "design", from: "design", to: "easyorder", kind: "integration", toOffset: -.55 },
  { id: "3cad", from: "3cad", to: "easyorder", kind: "integration" },
  { id: "bazis", from: "bazis", to: "easyorder", kind: "integration", toOffset: .55 },
  { id: "easyorder-to-order", from: "easyorder", to: "order-entry", kind: "integration" },
  { id: "1c-to-production", from: "1c", to: "production", kind: "integration", vertical: true, fromOffset: -.24, toOffset: -.11 },
  { id: "production-to-1c", from: "production", to: "1c", kind: "integration", vertical: true, fromOffset: .11, toOffset: .24 },
  { id: "order-to-configurator", from: "order-entry", to: "engineering-configurator", kind: "internal", fromOffset: -.35 },
  { id: "order-to-design", from: "order-entry", to: "custom-design", kind: "internal", fromOffset: .35 },
  { id: "design-to-configurator", from: "custom-design", to: "engineering-configurator", kind: "internal", vertical: true },
  { id: "configurator-to-cnc", from: "engineering-configurator", to: "cnc-programs", kind: "internal" },
  { id: "cnc-to-production", from: "cnc-programs", to: "production", kind: "internal" },
  { id: "production-to-shipping", from: "production", to: "shipping", kind: "internal", vertical: true },
];

const retailStages: Stage[] = [
  { x: 34, y: 80, id: "virtual-planner", lines: ["Виртуальный", "планировщик"] },
  { x: 173, y: 80, id: "easyorder", lines: ["Продавец", "мебели"] },
  { x: 316, y: 7, id: "factory-1", icon: "production", lines: ["Фабрика 1", "Управление", "производством"] },
  { x: 339, y: 80, id: "factory-2", icon: "production", lines: ["Фабрика 2", "Управление", "производством"] },
  { x: 325, y: 153, id: "factory-3", icon: "production", lines: ["Фабрика 3", "Управление", "производством"] },
  { x: 464, y: 80, id: "shipping", lines: ["Отгрузка"] },
];

const retailEdges: Edge[] = [
  { id: "planner-to-crm", from: "virtual-planner", to: "easyorder", kind: "integration" },
  { id: "crm-to-factory-1", from: "easyorder", to: "factory-1", kind: "integration", fromOffset: -.46 },
  { id: "crm-to-factory-2", from: "easyorder", to: "factory-2", kind: "integration" },
  { id: "crm-to-factory-3", from: "easyorder", to: "factory-3", kind: "integration", fromOffset: .46 },
  { id: "factory-1-to-shipping", from: "factory-1", to: "shipping", kind: "internal", toOffset: -.46 },
  { id: "factory-2-to-shipping", from: "factory-2", to: "shipping", kind: "internal" },
  { id: "factory-3-to-shipping", from: "factory-3", to: "shipping", kind: "internal", toOffset: .46 },
];

const serialStages: Stage[] = [
  { x: 6, y: 110, id: "virtual-planner", lines: ["Виртуальный", "планировщик"] },
  { x: 101, y: 110, id: "order-entry", lines: ["Ввод заказов"] },
  { x: 196, y: 110, id: "product-specifications", lines: ["Спецификации", "изделий"] },
  { x: 196, y: 211, id: "cnc-programs", lines: ["Создание", "программ ЧПУ"] },
  { x: 294, y: 110, id: "production", lines: ["Управление", "производством"] },
  { x: 294, y: 9, id: "planning", lines: ["Сводное", "планирование"] },
  { x: 393, y: 110, id: "warehouse", lines: ["Управление", "складом"] },
  { x: 393, y: 9, id: "packaging", lines: ["Упаковка"] },
  { x: 294, y: 211, id: "equipment-monitoring", lines: ["Мониторинг", "оборудования"] },
  { x: 491, y: 110, id: "shipping", lines: ["Отгрузка"] },
];

const serialLogos = [
  { id: "1c", file: "1c.svg", x: 122, y: 41, width: 34, height: 16 },
];

const serialEdges: Edge[] = [
  { id: "planner-to-orders", from: "virtual-planner", to: "order-entry", kind: "integration" },
  { id: "1c-to-orders", from: "1c", to: "order-entry", kind: "integration", vertical: true },
  { id: "orders-to-specifications", from: "order-entry", to: "product-specifications", kind: "internal" },
  { id: "specifications-to-cnc", from: "product-specifications", to: "cnc-programs", kind: "internal", vertical: true },
  { id: "specifications-to-production", from: "product-specifications", to: "production", kind: "internal", toOffset: -.32 },
  { id: "cnc-to-production", from: "cnc-programs", to: "production", kind: "internal", toOffset: .36 },
  { id: "production-to-planning", from: "production", to: "planning", kind: "internal", vertical: true },
  { id: "production-to-warehouse", from: "production", to: "warehouse", kind: "internal", fromOffset: -.08, toOffset: -.08 },
  { id: "warehouse-to-production", from: "warehouse", to: "production", kind: "internal", fromSide: "left", toSide: "right", fromOffset: .46, toOffset: .46 },
  { id: "production-to-packaging", from: "production", to: "packaging", kind: "internal", fromOffset: -.56 },
  { id: "production-to-monitoring", from: "production", to: "equipment-monitoring", kind: "internal", vertical: true },
  { id: "packaging-to-shipping", from: "packaging", to: "shipping", kind: "internal", toSide: "top" },
  { id: "warehouse-to-shipping", from: "warehouse", to: "shipping", kind: "internal" },
  { id: "packaging-to-warehouse", from: "packaging", to: "warehouse", kind: "internal", vertical: true },
];

const countertopsLogos = [
  ...kitchenLogos.filter(({ id }) => id !== "3cad" && id !== "bazis"),
  { id: "part-designer", file: "part-designer.png", x: 34, y: 98, width: 32, height: 32 },
];

const countertopsEdges: Edge[] = [
  ...kitchenEdges.filter(({ from }) => from !== "3cad" && from !== "bazis"),
  { id: "part-designer-to-crm", from: "part-designer", to: "easyorder", kind: "integration", toOffset: .55 },
];

const customPartsLogos = [
  ...countertopsLogos.filter(({ id }) => id !== "design" && id !== "part-designer"),
  { id: "part-designer", file: "part-designer.png", x: 34, y: 56, width: 32, height: 32 },
];

const customPartsEdges: Edge[] = [
  ...countertopsEdges.filter(({ from, to }) => from !== "design"
    && from !== "part-designer" && from !== "custom-design" && to !== "custom-design"
    && !(from === "order-entry" && to === "engineering-configurator")),
  { id: "part-designer-to-crm", from: "part-designer", to: "easyorder", kind: "integration" },
  { id: "order-to-configurator", from: "order-entry", to: "engineering-configurator", kind: "internal" },
];

const doorsLogos = [
  ...countertopsLogos,
  { id: "3cad", file: "3cad.webp", x: 42, y: 60, width: 24, height: 24 },
  { id: "virtual-planner", file: "virtual-planner.webp", x: 38, y: 143, width: 24, height: 24 },
];

const doorsStages: Stage[] = [
  ...kitchenStages,
  { x: 590, y: 30, id: "planning", lines: ["Сводное", "планирование"] },
];

const doorsEdges: Edge[] = [
  ...countertopsEdges,
  { id: "3cad-to-crm", from: "3cad", to: "easyorder", kind: "integration" },
  { id: "planner-to-crm", from: "virtual-planner", to: "easyorder", kind: "integration", toSide: "bottom" },
  { id: "production-to-planning", from: "production", to: "planning", kind: "internal", fromOffset: -.25, toOffset: -.25 },
  { id: "planning-to-production", from: "planning", to: "production", kind: "internal", fromSide: "left", toSide: "right", fromOffset: .25, toOffset: .25 },
];

const kitchenPreview = {
  stages: kitchenStages,
  logos: kitchenLogos,
  logoPoses: getLogoPoses(kitchenLogos),
  edges: kitchenEdges,
  height: 176,
};

const productionFlowLabel = "Затем заказ поступает на обработку на фабрике и в инженерный конфигуратор напрямую или через индивидуальное проектирование. Далее идут создание файлов ЧПУ, управление производством и отгрузка. Управление производством обменивается данными с 1С в обе стороны.";

const previews = {
  "custom-kitchens": {
    ...kitchenPreview,
    label: `Бизнес-процесс индивидуальных кухонь. 2020 Design, 3CAD и БАЗИС-Мебельщик передают данные в EasyOrder CRM. ${productionFlowLabel}`,
  },
  countertops: {
    ...kitchenPreview,
    logos: countertopsLogos,
    logoPoses: getLogoPoses(countertopsLogos),
    edges: countertopsEdges,
    label: `Бизнес-процесс изготовления и продажи столешниц, панелей и фасадов. 2020 Design и Part Designer передают данные в EasyOrder CRM. ${productionFlowLabel}`,
  },
  "custom-parts": {
    ...kitchenPreview,
    stages: kitchenStages.filter(({ id }) => id !== "custom-design"),
    logos: customPartsLogos,
    logoPoses: getLogoPoses(customPartsLogos),
    edges: customPartsEdges,
    label: "Бизнес-процесс производства деталей под заказ. Part Designer передаёт данные в EasyOrder CRM. Затем заказ поступает на обработку на фабрике и в инженерный конфигуратор. Далее идут создание файлов ЧПУ, управление производством и отгрузка. Управление производством обменивается данными с 1С в обе стороны.",
  },
  "interior-doors": {
    ...kitchenPreview,
    stages: doorsStages,
    logos: doorsLogos,
    logoPoses: getLogoPoses(doorsLogos),
    edges: doorsEdges,
    width: 684,
    height: 190,
    label: `Бизнес-процесс производства и продажи межкомнатных дверей. 2020 Design, Part Designer, 3CAD и FaetonPlanner передают данные в EasyOrder CRM. ${productionFlowLabel} Управление производством обменивается данными со сводным планированием в обе стороны.`,
  },
  "online-retail": {
    stages: retailStages,
    logos: [],
    logoPoses: {},
    edges: retailEdges,
    height: 220,
    label: "Бизнес-процесс онлайн-ритейла мебели. FaetonPlanner передаёт заказ продавцу мебели в EasyOrder CRM. Из CRM заказ может поступить в управление производством на одну из трёх фабрик. Каждая фабрика передаёт заказ на отгрузку.",
  },
  "serial-furniture": {
    stages: serialStages,
    logos: serialLogos,
    logoPoses: getLogoPoses(serialLogos),
    edges: serialEdges,
    height: 280,
    label: "Бизнес-процесс серийного производства мебели. FaetonPlanner и 1С передают данные во ввод заказов. Из заказа формируются спецификации изделий, на основе которых создаются программы ЧПУ. Спецификации и программы ЧПУ поступают в управление производством. Оно передаёт данные в сводное планирование, упаковку и мониторинг оборудования, а также обменивается данными со складом в обе стороны. Упаковка передаёт данные на склад и в отгрузку. Склад также передаёт данные в отгрузку.",
  },
};

export type SolutionProcess = keyof typeof previews;

function stageGeometry(stage: Stage, index: number, time?: number) {
  const phase = time === undefined ? 0 : time * (.85 + index * .11) + index * 1.7;
  const dx = time === undefined ? 0 : Math.sin(phase) * (.42 + (index % 3) * .06);
  const dy = time === undefined ? 0 : Math.cos(phase) * (.62 + (index % 2) * .09);
  const x = stage.x + dx;
  const y = stage.y + dy;
  const pose: CardPose = {
    x: x + stageWidth / 2, y: y + stageHeight / 2,
    width: stageWidth, height: stageHeight, a: 1, b: 0, c: 0, d: 1,
  };
  const transform = `translate(${x} ${y}) scale(${stageScale})`;
  return { pose, transform };
}

function getLogoPoses(logos: typeof kitchenLogos): Record<string, CardPose> {
  return Object.fromEntries(
    logos.map(({ id, x, y, width, height }) => [id, { x: x + width / 2, y: y + height / 2, width, height, a: 1, b: 0, c: 0, d: 1 }]),
  );
}

export function SolutionProcessPreview({ solution }: { solution: SolutionProcess }) {
  const preview = previews[solution];
  const { stages, logos, logoPoses, edges, height, label } = preview;
  const width = "width" in preview ? preview.width : previewWidth;
  const initialPoses = {
    ...logoPoses,
    ...Object.fromEntries(stages.map((stage, index) => [stage.id, stageGeometry(stage, index).pose])),
  };
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const stageElements = stages.map(({ id }) => element.querySelector(`[data-preview-stage="${id}"]`));
    const edgeElements = edges.map(({ id }) => element.querySelector(`#${solution}-edge-${id}`));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    function draw(time?: number) {
      const poses = { ...logoPoses };
      stages.forEach((stage, index) => {
        const { pose, transform } = stageGeometry(stage, index, time);
        poses[stage.id] = pose;
        stageElements[index]?.setAttribute("transform", transform);
      });
      edges.forEach((edge, index) => {
        edgeElements[index]?.setAttribute("d", connectionPath(poses[edge.from], poses[edge.to], { ...edge, ...arrowRouting }));
      });
    }

    function tick(time: number) {
      draw(time / 1000);
      frame = requestAnimationFrame(tick);
    }

    function syncMotion() {
      cancelAnimationFrame(frame);
      if (reducedMotion.matches || !element?.getClientRects().length) {
        draw();
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    const observer = new ResizeObserver(syncMotion);
    observer.observe(element);
    reducedMotion.addEventListener("change", syncMotion);
    syncMotion();
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", syncMotion);
      cancelAnimationFrame(frame);
    };
  }, [edges, logoPoses, solution, stages]);

  return (
    <svg
      ref={svg}
      className="solution-process"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
    >
      {logos.map(({ id, file, x, y, width, height }) => {
        const inset = id === "easyorder" ? 4 : 0;
        return (
          <g key={id}>
            <image href={`/integrations/logos/${file}`} x={x + inset} y={y + inset} width={width - 2 * inset} height={height - 2 * inset} />
            {id === "virtual-planner" && (
              <text x={x + width / 2} y={y + height + 8} textAnchor="middle" fill="var(--heading-color)" fontSize="7" fontWeight="600">
                <tspan x={x + width / 2}>Виртуальный</tspan>
                <tspan x={x + width / 2} dy="8.5">планировщик</tspan>
              </text>
            )}
          </g>
        );
      })}
      {stages.map((stage, index) => (
        <g key={stage.id} data-preview-stage={stage.id} transform={stageGeometry(stage, index).transform}>
          <rect width="58" height="46" rx="5" fill="white" stroke="var(--line)" />
          {stage.id === "virtual-planner" ? (
            <image href="/integrations/logos/virtual-planner.webp" x="17.5" y="1.5" width="23" height="23" />
          ) : stage.id === "easyorder" ? (
            <image href="/integrations/logos/easyorder-crm-transparent.png" x="4" y="4" width="50" height="18" />
          ) : (
            <image href={`/modules/${stage.icon ?? stage.id}.svg`} x="8" y="1" width="42" height="25" />
          )}
          <path d="M0 26h58" stroke="var(--line)" />
          <text x="29" y={stage.lines.length === 3 ? 32.5 : stage.lines.length === 2 ? 34.5 : 39} textAnchor="middle" fill="var(--heading-color)" fontSize="7" fontWeight="600">
            {stage.lines.map((line, index) => (
              <tspan
                key={line}
                x="29"
                dy={index === 0 ? 0 : stage.lines.length === 3 ? 6 : 8.5}
                fontSize={stage.lines.length === 3 && index > 0 ? 5.8 : undefined}
              >
                {line}
              </tspan>
            ))}
          </text>
        </g>
      ))}
      {edges.map((edge) => (
        <path key={edge.id} id={`${solution}-edge-${edge.id}`} className="process-edge" data-kind={edge.kind}
          d={connectionPath(initialPoses[edge.from], initialPoses[edge.to], { ...edge, ...arrowRouting })} />
      ))}
      <g className="process-flow" aria-hidden="true">
        {edges.map(({ id, kind }, index) => (
          <g key={id} data-kind={kind}>
            {[{ radius: 3.6, opacity: 0.18 }, { radius: 1.65, opacity: 1 }, { radius: 0.6, opacity: 1 }].map(({ radius, opacity }, layer) => (
              <circle key={radius} r={radius} fill={layer === 2 ? "white" : "currentColor"} opacity="0">
                <animate attributeName="opacity" dur="3s" begin={`${-index * 0.5}s`} repeatCount="indefinite" values={`0;${opacity};${opacity};0;0`} keyTimes="0;0.12;0.55;0.78;1" />
                <animateMotion dur="3s" begin={`${-index * 0.5}s`} repeatCount="indefinite" calcMode="paced">
                  <mpath href={`#${solution}-edge-${id}`} />
                </animateMotion>
              </circle>
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}
