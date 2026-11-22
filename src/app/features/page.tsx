import type { Metadata } from "next";
import Image from "next/image";
import { ModuleConfigurator } from "@/components/module-configurator";
import { IntegrationsAccordion } from "@/components/integrations-accordion";
import { DemoActions } from "@/components/demo-actions";

export const metadata: Metadata = { title: "MES/ERP — FaetonMES" };

export default function Page() {
  return (
    <main className="page-shell mes-erp-page">
      <div className="mes-erp-heading-row">
        <div className="mes-erp-title">
          <Image src="/modules/mes-erp.svg" width={64} height={64} alt="" />
          <h1 className="section-heading">MES/ERP</h1>
        </div>
        <DemoActions />
      </div>
      <section className="modules-section modules-section-inner" aria-label="Модули MES/ERP">
        <div className="hero-description hero-introduction mb-6">
          <p><span className="text-[var(--brand-blue)]">FaetonMES</span> оптимизирует каждый шаг вашей работы, обеспечивая адаптивность, необходимую для того, чтобы добиться успеха на постоянно меняющемся рынке.</p>
          <p>Мы поддерживаем <span className="text-[var(--brand-blue)]">Smart Manufacturing</span> и <span className="text-[var(--brand-blue)]">Industry 4.0</span>.</p>
        </div>
        <ModuleConfigurator />
      </section>
      <section id="integrations" className="integrations-section" aria-labelledby="integrations-heading">
        <div className="integrations-heading-row">
          <Image src="/modules/integrations.svg" width={56} height={56} alt="" />
          <h2 id="integrations-heading">Интеграция с внешними системами</h2>
        </div>
        <IntegrationsAccordion />
      </section>
    </main>
  );
}
