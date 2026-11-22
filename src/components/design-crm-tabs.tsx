"use client";

import { Tabs } from "@base-ui/react/tabs";
import type { ReactNode } from "react";

type DesignCrmTabsProps = {
  children: ReactNode;
  design: ReactNode;
  partDesigner: ReactNode;
  virtualPlanner: ReactNode;
  initialProduct: "crm" | "design" | "part-designer" | "virtual-planner";
};

export function DesignCrmTabs({ children, design, partDesigner, virtualPlanner, initialProduct }: DesignCrmTabsProps) {
  return (
    <Tabs.Root defaultValue={initialProduct} className="design-crm-tabs">
      <Tabs.List className="design-crm-tab-list" aria-label="Программные продукты">
        <Tabs.Tab value="crm">EasyOrder CRM</Tabs.Tab>
        <Tabs.Tab value="design">Design</Tabs.Tab>
        <Tabs.Tab value="part-designer">Part Designer</Tabs.Tab>
        <Tabs.Tab value="virtual-planner">FaetonPlanner</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="crm">{children}</Tabs.Panel>
      <Tabs.Panel value="design">{design}</Tabs.Panel>
      <Tabs.Panel value="part-designer">{partDesigner}</Tabs.Panel>
      <Tabs.Panel value="virtual-planner">{virtualPlanner}</Tabs.Panel>
    </Tabs.Root>
  );
}
