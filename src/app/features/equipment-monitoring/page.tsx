import type { Metadata } from "next";
import Link from "next/link";
import { ModuleTitle } from "@/components/module-title";
import { DemoButton } from "@/components/demo-dialog";
import { ModuleScreenshot } from "@/components/module-screenshot";
import { equipmentMonitoringDetails as content } from "@/lib/module-details";

export const metadata: Metadata = { title: `${content.title} — FaetonMES`, description: content.summary };

export default function EquipmentMonitoringPage() {
  return (
    <main className="page-shell module-detail">
      <nav className="module-breadcrumb" aria-label="Хлебные крошки">
        <Link href="/features">MES/ERP</Link><span aria-hidden="true">/</span><span>{content.title}</span>
      </nav>
      <header className="module-detail-hero">
        <div><ModuleTitle moduleId="equipment-monitoring" title={content.title} /><p className="module-detail-summary">{content.summary}</p></div><DemoButton />
      </header>
      <nav className="module-detail-nav" aria-label="На этой странице">
        <a href="#capabilities">Возможности</a><a href="#benefits">Преимущества</a><a href="#results">Практика внедрения</a><a href="#video">Видео</a>
      </nav>
      <section id="capabilities" className="module-detail-section" aria-labelledby="capabilities-title">
        <h2 id="capabilities-title">Получение данных от оборудования</h2>
        <p className="module-detail-intro">{content.introduction}</p>
        <p className="module-detail-intro">Получение данных от оборудования может осуществляться:</p>
        <ul className="module-benefit-points module-monitoring-sources">{content.sources.map((source) => <li key={source}>{source}</li>)}</ul>
        <div className="module-feature-row">
          <div className="module-feature-copy"><h3>Анализ данных и диаграммы</h3><p>{content.analyticsIntroduction}</p><ul className="module-benefit-points">{content.analytics.map((point) => <li key={point}>{point}</li>)}</ul></div>
          <ModuleScreenshot src="/screenshots/monitoring-dashboard.svg" caption="Состояние оборудования, выработка и показания датчиков" />
        </div>
        <div className="module-feature-row module-feature-row-reverse">
          <div className="module-feature-copy">
            <h3>Сигнализация и оперативное реагирование</h3><p>{content.responseIntroduction}</p>
            <ul className="module-benefit-points">{content.responses.map((point) => <li key={point}>{point}</li>)}</ul>
            <p>{content.responseConclusion}</p>
          </div>
          <ModuleScreenshot src="/screenshots/monitoring-response.svg" caption="Реагирование на сбой оборудования и подключение ресурсов" />
        </div>
      </section>
      <section id="benefits" className="module-detail-section" aria-labelledby="benefits-title">
        <h2 id="benefits-title">Преимущества для предприятия</h2>
        <div className="module-benefit-grid">{content.benefits.map((item) => (
          <article key={item.title}>
            <div className="module-benefit-heading">
              <span className="module-benefit-mark" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><path d="m5 12 4 4L19 6" /></svg></span><h3>{item.title}</h3>
            </div><p>{item.text}</p>
          </article>
        ))}</div>
      </section>
      <section id="results" className="module-detail-section module-results" aria-labelledby="results-title">
        <h2 id="results-title">Плюсы от внедрения</h2>
        <ul>{content.results.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.text}</span></li>)}</ul>
      </section>
      <section id="video" className="module-detail-section" aria-labelledby="video-title">
        <h2 id="video-title">Видео модуля</h2>
        <div className="module-video-placeholder">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="5" y="9" width="38" height="30" rx="5" /><path d="M13 9v30m22-30v30M5 19h8M5 29h8m22-10h8m-8 10h8" /></svg>
          <p>Здесь появится видео о мониторинге оборудования</p><span>Ролик будет добавлен позже</span>
        </div>
      </section>
      <section className="module-detail-cta" aria-label="Демонстрация модуля"><div><h2>Посмотрите модуль в работе</h2><p>Обсудим мониторинг оборудования на вашем предприятии.</p></div><DemoButton /></section>
    </main>
  );
}
