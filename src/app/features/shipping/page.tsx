import type { Metadata } from "next";
import Link from "next/link";
import { ModuleTitle } from "@/components/module-title";
import { DemoButton } from "@/components/demo-dialog";
import { ModuleScreenshot } from "@/components/module-screenshot";
import { shippingDetails as content } from "@/lib/module-details";

export const metadata: Metadata = { title: `${content.title} — FaetonMES`, description: content.summary };

export default function ShippingPage() {
  return (
    <main className="page-shell module-detail">
      <nav className="module-breadcrumb" aria-label="Хлебные крошки">
        <Link href="/features">MES/ERP</Link><span aria-hidden="true">/</span><span>{content.title}</span>
      </nav>
      <header className="module-detail-hero">
        <div><ModuleTitle moduleId="shipping" title={content.title} /><p className="module-detail-summary">{content.summary}</p></div>
        <DemoButton />
      </header>
      <nav className="module-detail-nav" aria-label="На этой странице">
        <a href="#capabilities">Возможности</a><a href="#benefits">Преимущества</a><a href="#video">Видео</a>
      </nav>
      <section id="capabilities" className="module-detail-section" aria-labelledby="capabilities-title">
        <h2 id="capabilities-title">От склада готовой продукции до загрузки в транспорт</h2>
        <p className="module-detail-intro">{content.introduction}</p>
        <div className="module-feature-row">
          <div className="module-feature-copy"><h3>{content.capabilities[0].title}</h3><p>{content.capabilities[0].text}</p></div>
          <ModuleScreenshot src="/screenshots/shipping-loading.svg" caption="Контрольная точка загрузки: упаковки, их местоположение и статус" />
        </div>
        <div className="module-feature-row module-feature-row-reverse">
          <div className="module-feature-copy"><h3>{content.capabilities[1].title}</h3><p>{content.capabilities[1].text}</p></div>
          <ModuleScreenshot src="/screenshots/shipping-containers.svg" caption="Ручной контейнер: несколько упаковок в одном объекте для сканирования" />
        </div>
        <div className="module-feature-notes">{content.capabilities.slice(2).map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>
      <section id="benefits" className="module-detail-section" aria-labelledby="benefits-title">
        <h2 id="benefits-title">Преимущества для предприятия</h2>
        <div className="module-benefit-grid module-benefit-grid-pairs">{content.benefits.map((item) => (
          <article key={item.title}>
            <div className="module-benefit-heading">
              <span className="module-benefit-mark" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><path d="m5 12 4 4L19 6" /></svg></span>
              <h3>{item.title}</h3>
            </div>
            <ul className="module-benefit-points">{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </article>
        ))}</div>
      </section>
      <section id="video" className="module-detail-section" aria-labelledby="video-title">
        <h2 id="video-title">Видео модуля</h2>
        <div className="module-video-placeholder">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="5" y="9" width="38" height="30" rx="5" /><path d="M13 9v30m22-30v30M5 19h8M5 29h8m22-10h8m-8 10h8" /></svg>
          <p>Здесь появится видео об отгрузке</p><span>Ролик будет добавлен позже</span>
        </div>
      </section>
      <section className="module-detail-cta" aria-label="Демонстрация модуля"><div><h2>Посмотрите модуль в работе</h2><p>Обсудим подготовку отправлений и контроль загрузки на вашем предприятии.</p></div><DemoButton /></section>
    </main>
  );
}
