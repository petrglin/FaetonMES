import type { Metadata } from "next";
import Image from "next/image";
import { DesignCrmTabs } from "@/components/design-crm-tabs";
import { DesignContent, PartDesignerContent, VirtualPlannerContent } from "@/components/design-product-content";
import { EasyOrderContent } from "@/components/easyorder-content";

export const metadata: Metadata = { title: "DESIGN/CRM — EasyOrder CRM — FaetonMES", description: "EasyOrder CRM для продаж мебели, дверей и индивидуальных домов: клиенты, заказы, дилеры, задачи и аналитика." };

export default async function Page({ searchParams }: { searchParams: Promise<{ product?: string | string[] }> }) {
  const { product } = await searchParams;
  const initialProduct = product === "design" || product === "part-designer" || product === "virtual-planner" ? product : "crm";
  return (
    <main className="page-shell design-crm-page">
      <h1 className="section-heading design-product-heading">
        <Image src="/integrations/logos/design-faeton-symbol.webp" alt="" width={64} height={64} />
        DESIGN/CRM
      </h1>
      <div className="design-crm-intro">
        <p>Мы обладаем несколькими современными инструментами для омниканальной продажи мебели, интерьеров, дверей и индивидуальных домов.</p>
        <p>В нашей палитре есть системы передового дизайна и приёма заказов как для офлайн-работы менеджеров и дизайнеров салонов, так и для онлайн-проектирования прямо из дома, в дороге или на терминалах специальных киосков в магазинах. Все заказы, принятые в офлайн- и онлайн-инструментах, обрабатываются в нашей собственной CRM-системе, которая бесшовно интегрирована с FaetonMES.</p>
      </div>
      <DesignCrmTabs key={initialProduct} initialProduct={initialProduct} design={<DesignContent />} partDesigner={<PartDesignerContent />} virtualPlanner={<VirtualPlannerContent />}>
        <EasyOrderContent />
      </DesignCrmTabs>
    </main>
  );
}
