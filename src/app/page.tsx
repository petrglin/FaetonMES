import Image from "next/image";
import { DemoActions } from "@/components/demo-actions";
import { HomeModules } from "@/components/home-modules";
import { introduction, benefits } from "@/lib/home-content";

export default function Home() {
  return (
    <main className="page-shell home-page">
      <div className="hero">
        <div>
          <div className="hero-title-row">
            <h1>MES-система для управления<br /><span>деревообрабатывающими и мебельными предприятиями</span></h1>
            <DemoActions />
          </div>
          <div className="hero-description hero-introduction">
            {introduction.map((paragraph) => (
              <p key={paragraph}>
                {paragraph.split(/(FaetonMES|Smart Manufacturing|Industry 4\.0)/g).map((part, index) => (
                  index % 2 === 1 ? <span key={index} className="text-[var(--brand-blue)]">{part}</span> : part
                ))}
              </p>
            ))}
          </div>
        </div>
        <div className="logo-panel">
          <Image src="/brand/faeton-logo.png" width={1242} height={1068} alt="Логотип FaetonMES" sizes="(max-width: 479px) 250px, 288px" preload />
        </div>
      </div>
      <ul className="benefits-list" aria-label="Преимущества FaetonMES">
        {benefits.map(({ title, text }) => (
          <li key={title}>
            <p><strong>{title}</strong> – {text}</p>
          </li>
        ))}
      </ul>
      <HomeModules />
    </main>
  );
}
