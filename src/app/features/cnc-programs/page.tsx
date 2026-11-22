import type { Metadata } from "next";
import Link from "next/link";
import { ModuleTitle } from "@/components/module-title";
import { DemoButton } from "@/components/demo-dialog";
import { ModuleScreenshot } from "@/components/module-screenshot";
import { cncProgramsDetails as content } from "@/lib/module-details";

export const metadata: Metadata = { title: `${content.title} — FaetonMES`, description: content.summary };

export default function CncProgramsPage() {
  return (
    <main className="page-shell module-detail">
      <nav className="module-breadcrumb" aria-label="Хлебные крошки">
        <Link href="/features">MES/ERP</Link><span aria-hidden="true">/</span><span>{content.title}</span>
      </nav>
      <header className="module-detail-hero">
        <div><ModuleTitle moduleId="cnc-programs" title={content.title} /><p className="module-detail-summary">{content.summary}</p></div>
        <DemoButton />
      </header>
      <nav className="module-detail-nav" aria-label="На этой странице">
        <a href="#capabilities">Возможности</a><a href="#benefits">Преимущества</a><a href="#results">Практика внедрения</a><a href="#video">Видео</a>
      </nav>
      <section id="capabilities" className="module-detail-section" aria-labelledby="capabilities-title">
        <h2 id="capabilities-title">От геометрии детали к программе станка</h2>
        <p className="module-detail-intro">{content.introduction}</p>
        <div className="module-feature-row">
          <div className="module-feature-copy"><h3>{content.capabilities[0].title}</h3><p>{content.capabilities[0].text}</p></div>
          <ModuleScreenshot src="/screenshots/cnc-postprocessor.svg" caption="Источники данных и настройка выходных форматов для станков" />
        </div>
        <div className="module-feature-row module-feature-row-reverse">
          <div className="module-feature-copy"><h3>{content.capabilities[1].title}</h3><p>{content.capabilities[1].text}</p></div>
          <ModuleScreenshot src="/screenshots/cnc-output.svg" caption="Программы для станков и чертёж детали с размерами" />
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
      <section id="results" className="module-detail-section module-results" aria-labelledby="results-title">
        <h2 id="results-title">Благодаря внедрению клиенты смогли</h2>
        <ul className="module-results-four">
          <li><strong>До 85%</strong><span>ускорить генерирование ЧПУ-программ</span></li>
          <li><strong>В 6–8 раз</strong><span>увеличить производительность соответствующего персонала</span></li>
          <li><strong>Практически до нуля</strong><span>снизить ошибки и связанные с этим потери, что особенно актуально для нестандартных заказов</span></li>
          <li><strong>Без ручного создания</strong><span>уйти от ручного создания ЧПУ-программ на станках</span></li>
        </ul>
      </section>
      <section id="video" className="module-detail-section" aria-labelledby="video-title">
        <h2 id="video-title">Видео модуля</h2>
        <div className="module-video-placeholder">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="5" y="9" width="38" height="30" rx="5" /><path d="M13 9v30m22-30v30M5 19h8M5 29h8m22-10h8m-8 10h8" /></svg>
          <p>Здесь появится видео о создании программ ЧПУ</p><span>Ролик будет добавлен позже</span>
        </div>
      </section>
      <section className="module-detail-cta" aria-label="Демонстрация модуля"><div><h2>Посмотрите модуль в работе</h2><p>Обсудим создание ЧПУ-программ для вашего оборудования.</p></div><DemoButton /></section>
    </main>
  );
}
