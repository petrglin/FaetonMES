import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "О нас — FaetonMES" };

export default function Page() {
  return (
    <main className="page-shell about-page">
      <div className="about-page-background" aria-hidden="true">
        <Image src="/about/faeton-building-retouched.webp" alt="" fill sizes="(max-width: 1279px) 100vw, 1280px" preload />
      </div>
      <article className="about-content">
        <div className="about-title-row">
          <h1 className="section-heading">О нас</h1>
          <Image className="about-company-logo" src="/about/faeton-company-logo-transparent.svg" alt="Фаэтон — объединяя сильнейших" width={640} height={218} sizes="(max-width: 599px) 140px, 210px" />
        </div>
        <p className="about-lead"><strong className="about-name">Компания «Фаэтон»</strong> является компетентным партнером в области технологического проектирования деревообрабатывающих предприятий, поставок современного импортного и отечественного оборудования, программных продуктов, запасных частей, инструментов, материалов для деревообрабатывающей, мебельной промышленности и деревянного домостроения.</p>

        <section className="about-story-section" aria-labelledby="about-history-heading">
          <h2 id="about-history-heading">От оборудования к программным решениям</h2>
        <p>Наша компания основана в 1991 году как сервисная фирма для монтажа и наладки импортного деревообрабатывающего оборудования. С течением времени в спектр оказываемых услуг вошла и поставка оборудования европейских фирм, высококачественного инструмента, клеевых систем, материалов для декоративной облицовки мебели, запасных частей, режущего инструмента. С 2003 года мы также стали осуществлять поставку и внедрение программного обеспечения для автоматизации производства и продаж мебельной индустрии, а также деревянного домостроения.</p>

        </section>

        <section className="about-story-section" aria-labelledby="about-experience-heading">
          <h2 id="about-experience-heading">Международный опыт внедрения</h2>
        <p>В течение более, чем 15 лет компания <span className="about-name">Фаэтон</span> сотрудничала с международной компанией <span className="about-name">20-20 Technologies</span> (позднее <span className="about-name">Cyncly</span>), которая являлась мировым лидером в области ПО для управления мебельным производством. Мы продавали, внедряли и обслуживали ПО для мебельной и деревообрабатывающей промышленности: программные продукты для создания дизайн-проектов и приёма заказов в точках продаж и для онлайн-создания дизайн-проектов и приёма заказов (<span className="about-name">Ideal Spaces</span>, <span className="about-name">3CAD</span>), создания дизайн-проектов и приёма заказов в точках продаж (<span className="about-name">Design</span>), мощную систему управления производством и предприятием (<span className="about-name">Insight</span>), CRM-систему для организации коммуникации между фабрикой и точками продаж <span className="about-name">EasyOrder CRM</span>.</p>
        <p>Мы работаем с клиентами как в России, так и в постсоветских странах, также наши технические специалисты принимали участие в проектах в Европе, США и на других территориях на протяжении многих лет, что позволило накопить бесценный опыт живого внедрения на передовых предприятиях, которые до сих пор являются лидерами рынка и успешно обслуживают свои процессы при помощи решений, обеспеченных нашей командой.</p>

        </section>

        <section className="about-story-section" aria-labelledby="about-development-heading">
          <h2 id="about-development-heading">Собственная разработка и поддержка клиентов</h2>
        <p>В связи с тем, что правительства недружественных государств в последние годы в рамках санкций запретили своим ИТ-компаниям предоставление ПО и услуг российским клиентам, мы приняли решение продолжить поддержку наших клиентов своими силами и разработать программное обеспечение, аналогичное тому, которое мы внедряли ранее, на основе опыта и компетенций, полученных в течение продолжительного сотрудничества с зарубежными разработчиками и внедрения на предприятия различного масштаба.</p>
        <p>Наши технические специалисты и раньше самостоятельно разрабатывали модули и сервисы к системам CAD/MES/ERP, электронные каталоги для систем приёма заказов и визуализации, наполняли мастер-данными производственные системы и настраивали их, поэтому мы смогли полностью сохранить функциональность предоставляемых ранее программных продуктов, в то же время получив возможность более гибко и оперативно реагировать на запросы именно нашего рынка.</p>

        <p className="about-registration">Наше ПО <span className="about-name">FaetonMES</span> зарегистрировано в российском реестре программ для ЭВМ.</p>

        <p>Тем самым мы не только сохранили гигантский опыт и подходы к автоматизации от мирового лидера в области ПО, специализированного для мебельной и деревообрабатывающей отрасли, но и продолжаем развивать возможности наших программных систем в соответствии с запросами рынка!</p>

        </section>

        <section className="about-story-section" aria-labelledby="about-clients-heading">
          <h2 id="about-clients-heading">Нашими клиентами являются</h2>
          <p>За более чем 15 лет мы оптимизировали процессы и внедрили различные решения на таких предприятиях, как <span className="about-name">Зов Мебель</span>, <span className="about-name">Первая мебельная фабрика</span>, <span className="about-name">Лером</span>, мебельная фабрика <span className="about-name">Монтанья</span>, мебельная фабрика <span className="about-name">Embawood</span>, фабрика <span className="about-name">Мебель Москва</span>, <span className="about-name">Slotex</span> и другие.</p>
          <p>В области деревянного домостроения мы спроектировали и оснастили более 20 автоматизированных заводов, среди которых <span className="about-name">ДСК Славянский</span>, <span className="about-name">Стезя</span>, <span className="about-name">ПСП</span>, <span className="about-name">Нодверк</span>, <span className="about-name">Авангард Строй</span>.</p>
        </section>

        <section className="about-products" aria-labelledby="about-products-heading">
          <h2 id="about-products-heading">Сейчас мы представляем следующие программные продукты:</h2>
          <ol>
            <li><Link className="about-name font-semibold underline underline-offset-4" href="/features">FaetonMES/ERP</Link> — система управления производством и ресурсами фабрики</li>
            <li><Link className="about-name font-semibold underline underline-offset-4" href="/design-crm?product=design">Design</Link> — планировка и дизайн мебели</li>
            <li><Link className="about-name font-semibold underline underline-offset-4" href="/design-crm?product=part-designer">Part Designer</Link> — онлайн-проектирование деталей</li>
            <li><Link className="about-name font-semibold underline underline-offset-4" href="/design-crm?product=crm">FaetonCRM</Link> — рабочее место продавца мебели</li>
            <li>
              <Link className="about-name font-semibold underline underline-offset-4" href="/design-crm?product=virtual-planner">Virtual Planner</Link> — онлайн-планировщик мебели
            </li>
          </ol>
        </section>
      </article>
    </main>
  );
}
