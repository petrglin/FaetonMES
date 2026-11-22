import type { Metadata } from "next";
import Link from "next/link";
import { ModuleTitle } from "@/components/module-title";
import { DemoButton } from "@/components/demo-dialog";
import { ModuleScreenshot } from "@/components/module-screenshot";
import { productionDetails as content } from "@/lib/module-details";
import { ProductionKitting } from "@/components/production-kitting";
import { ProductVideo } from "@/components/product-video";

export const metadata: Metadata = { title: `${content.title} — FaetonMES`, description: content.summary };

export default function ProductionPage() {
  return (
    <main className="page-shell module-detail">
      <nav className="module-breadcrumb" aria-label="Хлебные крошки"><Link href="/features">MES/ERP</Link><span aria-hidden="true">/</span><span>{content.title}</span></nav>
      <header className="module-detail-hero">
        <div><ModuleTitle moduleId="production" title={content.title} /><p className="module-detail-summary">{content.summary}</p></div><DemoButton />
      </header>
      <nav className="module-detail-nav" aria-label="На этой странице"><a href="#capabilities">Возможности</a><a href="#functions">Цеховые функции</a><a href="#kitting">Комплектация</a><a href="#results">Практика внедрения</a><a href="#video">Видео</a></nav>
      <section id="capabilities" className="module-detail-section" aria-labelledby="capabilities-title">
        <h2 id="capabilities-title">Управление выполнением производственных операций</h2>
        <p className="module-detail-intro">{content.introduction}</p>
        <div className="module-feature-row">
          <div className="module-feature-copy"><h3>{content.capabilities[0].title}</h3><p>{content.capabilities[0].text}</p></div>
          <ModuleScreenshot src="/screenshots/production-batches.svg" caption="Партии изготовления, запуск в производство и рабочие наряды" />
        </div>
        <div className="module-feature-row module-feature-row-reverse">
          <div className="module-feature-copy"><h3>{content.capabilities[1].title}</h3><p>{content.capabilities[1].text}</p></div>
          <ModuleScreenshot src="/screenshots/production-checkpoint.svg" caption="Контрольная точка: задания оператору и данные детали" />
        </div>
      </section>
      <section id="functions" className="module-detail-section" aria-labelledby="functions-title">
        <h2 id="functions-title">Операции непосредственно в цехе</h2>
        <p className="module-detail-intro">{content.scope}</p>
        <ul className="module-benefit-points module-production-functions">{content.functions.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <ProductionKitting />
      <section id="results" className="module-detail-section module-results" aria-labelledby="results-title">
        <h2 id="results-title">Плюсы от внедрения</h2>
        <ul className="module-results-four">{content.results.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.text}</span></li>)}</ul>
      </section>
      <section id="video" className="module-detail-section" aria-labelledby="video-title">
        <h2 id="video-title">Видео модуля</h2>
        <ProductVideo
          src="/videos/production-packing-branded.mp4"
          poster="/videos/production-packing-poster.jpg"
          title="Видео модуля управления производством: упаковка"
          caption="Формирование упаковок в производственном процессе"
          duration="2 мин"
        />
      </section>
      <section className="module-detail-cta" aria-label="Демонстрация модуля"><div><h2>Посмотрите модуль в работе</h2><p>Обсудим управление производством на вашем предприятии.</p></div><DemoButton /></section>
    </main>
  );
}
