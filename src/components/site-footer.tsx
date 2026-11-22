import Image from "next/image";
import { DemoActions } from "@/components/demo-actions";
import Link from "next/link";
import { footerNavigation as navigation } from "@/lib/navigation";

const groups = [
  { title: "Продукт", paths: ["/design-crm", "/features", "/solutions", "/pricing", "/implementation"] },
  { title: "Компания", paths: ["/about", "/contacts"] },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="FaetonMES — главная">
              <span className="footer-logo-image"><Image src="/brand/faeton-logo.png" width={44} height={38} alt="" style={{ height: "auto" }} /></span>
              <span>Faeton<span className="footer-mes">MES</span></span>
            </Link>
            <p>MES/ERP система для управления мебельным предприятием.</p>
          </div>
          {groups.map(({ title, paths }) => (
            <nav key={title} aria-label={title + " — ссылки в футере"} className="footer-nav">
              <h2>{title}</h2>
              <ul>
                {paths.map((path) => {
                  const item = navigation.find(({ href }) => href === path)!;
                  return <li key={path}><Link href={path}>{item.label}</Link></li>;
                })}
              </ul>
            </nav>
          ))}
          <div className="footer-contact">
            <h2>Давайте обсудим ваш проект</h2>
            <p>Свяжитесь с нами, чтобы обсудить задачи вашего предприятия.</p>
            <DemoActions variant="footer" />
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getUTCFullYear()} FaetonMES. Все права защищены.</p>
          <a href="#top">Наверх <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  );
}
