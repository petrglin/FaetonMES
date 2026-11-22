import { productionDetails } from "@/lib/module-details";
import { ModuleScreenshot } from "@/components/module-screenshot";

export function ProductionKitting() {
  const content = productionDetails.kitting;
  return (
    <section id="kitting" className="module-detail-section" aria-labelledby="kitting-title">
      <h2 id="kitting-title">{content.title}</h2>
      <p className="module-detail-intro">{content.summary}</p>
      <p className="module-kitting-rule">На следующую операцию — только полный комплект</p>
      <div className="module-feature-row">
        <div className="module-feature-copy module-kitting-copy">
          <h3>Рабочее место комплектовщика</h3>
          <p>{content.description}</p><p>{content.screen}</p>
        </div>
        <ModuleScreenshot src="/screenshots/production-kitting.svg" caption="Комплектация: подобранные детали, недостающие компоненты и места хранения" />
      </div>
      <section className="module-kitting-benefits" aria-labelledby="kitting-benefits-title">
        <h3 id="kitting-benefits-title">Преимущества комплектации</h3>
        <div className="module-benefit-grid module-benefit-grid-pairs">{content.benefits.map((item) => (
          <article key={item.title}>
            <div className="module-benefit-heading">
              <span className="module-benefit-mark" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><path d="m5 12 4 4L19 6" /></svg></span>
              <h4>{item.title}</h4>
            </div><p>{item.text}</p>
          </article>
        ))}</div>
      </section>
    </section>
  );
}
