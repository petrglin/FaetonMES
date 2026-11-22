import type { ConnectionRouting } from "./process-geometry";

/** Первый согласованный фрагмент. Последующие этапы добавляются сюда. */
export const processModuleIds = [
  "order-entry", "engineering-configurator", "custom-design",
  "product-specifications", "cnc-programs", "production", "purchasing", "planning", "warehouse", "packaging", "shipping", "equipment-monitoring", "service-orders",
];

export const processConnections: (ConnectionRouting & {from: string; to: string; path: string; kind?: "integration"})[] = [
  { from: "order-entry", to: "engineering-configurator", path: "M268 332.5C303 332.5 303 252 338 252" },
  { from: "order-entry", to: "custom-design", path: "M268 332.5C303 332.5 303 413 338 413" },
  { from: "order-entry", to: "product-specifications", path: "M268 332.5C408 332.5 408 252 548 252" },
  { from: "engineering-configurator", to: "product-specifications", path: "M478 252H548" },
  { from: "product-specifications", to: "cnc-programs", path: "M618 309.4 V355.6", vertical: true },
  { from: "engineering-configurator", to: "cnc-programs", path: "M478 252C513 252 513 413 548 413" },
  { from: "custom-design", to: "engineering-configurator", path: "M408 355.6V309.4", vertical: true },
  { from: "product-specifications", to: "production", path: "M688 252C723 252 723 413 758 413" },
  { from: "cnc-programs", to: "production", path: "M688 413H758" },
  { from: "product-specifications", to: "purchasing", path: "M688 252H758" },
  { from: "purchasing", to: "production", path: "M828 309.4V355.6", vertical: true },
  { from: "production", to: "planning", path: "M828 470.4V516.6", vertical: true },
  { from: "product-specifications", to: "warehouse", path: "M688 252C723 252 723 91 758 91" },
  { from: "warehouse", to: "purchasing", path: "M828 148.4V194.6", vertical: true },
  { from: "warehouse", to: "production", path: "M898 91C920.4 91 942.8 91 942.8 107.8L942.8 396.2C942.8 413 920.4 413 898 413", detour: "right" },
  { from: "production", to: "packaging", path: "M898 413H968" },
  { from: "packaging", to: "shipping", path: "M1108 413H1178" },
  { from: "planning", to: "production", path: "M758 574C735.6 574 713.2 574 713.2 557.2L713.2 429.8C713.2 413 735.6 413 758 413", detour: "left" },
  { from: "planning", to: "packaging", path: "M898 574C931.6 574 931.6 574 931.6 557.2L931.6 504C931.6 487.2 931.6 487.2 948.4 487.2H1021.2C1038 487.2 1038 487.2 1038 470.4", toBottom: true, bottomLane: .12 },
  { from: "planning", to: "shipping", path: "M898 574C931.6 574 931.6 574 931.6 557.2L931.6 518C931.6 501.2 931.6 501.2 948.4 501.2H1231.2C1248 501.2 1248 501.2 1248 470.4", toBottom: true, bottomLane: .22 },
  { from: "equipment-monitoring", to: "production", path: "M968 574C933 574 933 413 898 413", fromSide: "left", toSide: "right" },
  { from: "production", to: "service-orders", path: "M898 413C931.6 413 931.6 413 931.6 396.2L931.6 343C931.6 326.2 931.6 326.2 948.4 326.2H1021.2C1038 326.2 1038 326.2 1038 309.4", toBottom: true, bottomLane: .12 },
  { from: "external:design-faeton.png", to: "order-entry", path: "M163.12 239 C163.12 257.05 198 257.05 198 275.1", vertical: true, kind: "integration" },
  { from: "external:bitrix24.png", to: "order-entry", path: "M243.856 239 C243.856 257.05 198 257.05 198 275.1", vertical: true, kind: "integration" },
  { from: "external:3cad.webp", to: "product-specifications", path: "M558 135.8 C558 165.2 618 165.2 618 194.6", vertical: true, kind: "integration" },
  { from: "external:bazis.webp", to: "product-specifications", path: "M618 135.8 V194.6", vertical: true, kind: "integration" },
  { from: "external:imos.png", to: "product-specifications", path: "M682.48 135.8 C682.48 165.2 618 165.2 618 194.6", vertical: true, kind: "integration" },
  { from: "external:cutrite.png", to: "production", path: "M640.4 520.128 C699.2 520.128 699.2 413 758 413", kind: "integration" },
  { from: "external:hpo.jpeg", to: "production", path: "M640.4 587.4 C699.2 587.4 699.2 413 758 413", kind: "integration" },
  { from: "external:1c.svg", to: "warehouse", path: "M828 -1.65 V33.6", vertical: true, kind: "integration" },
  { from: "external:1c.svg", to: "purchasing", path: "M828 -1.65 V194.6", vertical: true, kind: "integration" },
  { from: "external:1c.svg", to: "production", path: "M828 -1.65 V355.6", vertical: true, kind: "integration" },
  { from: "external:easyorder-crm-transparent.png", to: "order-entry", path: "M198 181.44 V275.1", vertical: true, kind: "integration" },
];
