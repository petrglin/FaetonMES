import { DemoButton } from "@/components/demo-dialog";
import Image from "next/image";
import { DesignGallery } from "@/components/design-gallery";
import { ScreenshotPreview } from "@/components/screenshot-preview";
import { designGalleryImages } from "@/lib/design-gallery-images";
import { ProductVideo } from "@/components/product-video";

function DesignPanorama({ id, caption, autoRotate = false }: { id: string; caption: string; autoRotate?: boolean }) {
  const query = new URLSearchParams({ "autorotate.enabled": String(autoRotate) });
  if (autoRotate) query.set("autorotate.waittime", "0.5");

  return (
    <figure className="crm-screenshot">
      <iframe
        src={`https://panorama.2020.net/permanentview/${id}/?${query}`}
        title={`${caption} в Design`}
        loading="lazy"
        allowFullScreen
        className="block aspect-video min-h-[260px] w-full"
      />
      <figcaption className="pt-3">{caption}</figcaption>
    </figure>
  );
}

const designVideos = [
  { id: "design-live", title: "2020 Design Live", duration: "1:00", muted: true },
  { id: "design-countertops", title: "Мастер столешниц в 2020 Design", duration: "5:40", muted: false },
  { id: "design-kitchen-styles", title: "Глобальные стили кухни в 2020 Design", duration: "1:37", muted: false },
] as const;

export function DesignContent() {
  return (
    <article className="design-product">
      <header className="crm-hero">
        <div>
          <h2 className="design-product-heading">
            <Image src="/integrations/logos/design-faeton-symbol.webp" alt="" width={64} height={64} />
            Design
          </h2>
          <p>Design помогает создавать дизайн-проекты, принимать заказы в точках продаж и готовить документацию для клиента. После согласования заказ можно передать на фабрику в FaetonMES, где система управляет производственными и вспомогательными процессами.</p>
        </div>
        <DemoButton />
      </header>
      <DesignGallery images={designGalleryImages} />
      <div className="crm-split-row">
        <section className="crm-feature-copy self-start">
          <h3>Проектирование и визуализация</h3>
          <p>В Design можно планировать кухни, ванные комнаты и другие помещения, показывать клиентам фотореалистичные изображения и панорамы на 360°. Рендер помогает оценить проект перед покупкой. Ссылку на панораму можно открыть в браузере или на мобильном устройстве и отправить другим людям.</p>
        </section>
        <DesignPanorama id="5cve5ejoh0wsxmqnyyyhfw" caption="Панорама интерьера 360°" />
      </div>
      <div className="crm-split-row">
        <section className="crm-feature-copy self-start">
          <h3>От салона до фабрики</h3>
          <p>Design и FaetonMES можно использовать самостоятельно или вместе. При совместной работе согласованный заказ передаётся из салона на фабрику. FaetonMES автоматически формирует производственную спецификацию и, в зависимости от потребностей предприятия, поддерживает конструирование, планирование, отслеживание изготовления, управление заказами, запасами, складами и активами, отгрузку, сбор данных со станков, мониторинг и работу сервисных бригад.</p>
          <p>Связка охватывает путь от конфигурирования и приёма заказа до отгрузки, установки и обслуживания. При внедрении мы интегрируем решение с программами, которые уже выполняют нужные функции на предприятии, например с 1С и CRM-системами.</p>
        </section>
        <DesignPanorama id="8gxwayguuch2etgrtghbq" caption="Панорама Traditional 24x24" autoRotate />
      </div>
      <div className="crm-feature-grid design-benefits-grid">
        <section className="crm-feature-card"><div className="crm-feature-copy">
          <h3>Экономьте время</h3>
          <p>Инструменты планировки и позиционирования ускоряют компоновку. Покажите несколько вариантов проекта, получите точную автоматическую спецификацию и оформите заказ в электронном виде.</p>
        </div></section>
        <section className="crm-feature-card"><div className="crm-feature-copy">
          <h3>Увеличивайте продажи</h3>
          <p>Визуализация помогает покупателям увидеть будущий интерьер, сравнить варианты и быстрее принять решение.</p>
        </div></section>
        <section className="crm-feature-card"><div className="crm-feature-copy">
          <h3>Привлекайте новых клиентов</h3>
          <p>Покупатели могут делиться изображениями проекта с друзьями и семьёй, знакомя их с вашей работой.</p>
        </div></section>
      </div>
      <section className="crm-section">
        <h2>Видео примеры</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {designVideos.map(({ id, title, duration, muted }) => (
            <ProductVideo
              key={id}
              src={`/videos/${id}.mp4`}
              poster={`/videos/${id}-poster.jpg`}
              title={title}
              caption={title}
              duration={duration}
              muted={muted}
            />
          ))}
        </div>
      </section>
    </article>
  );
}

export function VirtualPlannerContent() {
  return (
    <article className="design-product">
      <header className="crm-hero">
        <div>
          <h2 className="design-product-heading">
            <Image src="/integrations/logos/virtual-planner.webp" alt="" width={64} height={64} />
            FaetonPlanner
          </h2>
          <p>FaetonPlanner — онлайн-приложение для 3D-планирования помещений. Покупатель подбирает мебель для своего пространства дома или в магазине. Производители и продавцы могут использовать планировщик для привлечения покупателей, сокращения цикла продаж и работы консультантов с клиентами.</p>
        </div>
        <DemoButton />
      </header>
      <div className="crm-split-row">
        <section className="crm-feature-copy">
          <h3>Подбор мебели и проектирование</h3>
          <p>Покупатель создаёт проект самостоятельно или вместе с консультантом, используя товары из вашего каталога и сопутствующие позиции. Можно проверить, подходит ли мебель по форме и размерам комнаты, добавить готовые группы предметов и посмотреть, как открываются дверцы и ящики или раскладывается мебель.</p>
        </section>
        <figure className="crm-screenshot design-product-screenshot">
          <ScreenshotPreview
            src="/virtual-planner/final/planner-interface-1.png"
            width={2504}
            height={1788}
            caption="Интерфейс 3D-планировщика"
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          <figcaption>Интерфейс 3D-планировщика</figcaption>
        </figure>
      </div>
      <div className="crm-split-row">
        <section className="crm-feature-copy">
          <h3>Реалистичная визуализация и покупка</h3>
          <p>В проект можно добавить мебель, сантехнику, электрику, бытовую технику и аксессуары. Стиль фасадов или ручек можно изменить для одного предмета или всего проекта. Планировщик за секунды формирует изображение с освещением и материалами поверхностей.</p>
          <p>Готовым проектом можно поделиться с близкими, продолжить работу на терминале в магазине, показать его консультанту или перейти к покупке онлайн.</p>
        </section>
        <figure className="crm-screenshot design-product-screenshot">
          <ScreenshotPreview
            src="/virtual-planner/final/planner-interface-2.png"
            width={1750}
            height={899}
            caption="3D-визуализация интерьера"
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          <figcaption>3D-визуализация интерьера</figcaption>
        </figure>
      </div>
      <section className="crm-section" aria-labelledby="planner-render-heading">
        <h2 id="planner-render-heading">Полноэкранная визуализация проекта</h2>
        <figure className="crm-screenshot design-product-screenshot">
          <ScreenshotPreview
            src="/virtual-planner/final/planner-interface-3.png"
            width={1586}
            height={992}
            caption="Визуализация гостиной в RoomPlanner"
            sizes="(max-width: 1279px) 100vw, 1280px"
          />
          <figcaption>Визуализация гостиной в RoomPlanner</figcaption>
        </figure>
      </section>
      <section className="crm-section">
        <h2>Инструменты для продавцов</h2>
        <div className="crm-feature-grid">
          <section className="crm-feature-card"><div className="crm-feature-copy">
            <h3>Аналитика</h3>
            <p>Продавцы видят, какие товары, материалы и варианты отделки покупатели просматривают или выбирают. Эти данные помогают планировать маркетинговые активности, менять порядок товаров и подбирать сочетания для показа.</p>
          </div></section>
          <section className="crm-feature-card"><div className="crm-feature-copy">
            <h3>Умная реклама</h3>
            <p>Планировщик показывает рекламу и сведения о товарах с учётом того, что покупатель смотрел или добавлял в проект. Можно выводить условия гарантии, инструкции, информацию об энергопотреблении и другие характеристики.</p>
          </div></section>
          <section className="crm-feature-card"><div className="crm-feature-copy">
            <h3>Дополнительные и перекрёстные продажи</h3>
            <p>Во время проектирования система может автоматически предлагать похожие, альтернативные и сопутствующие товары на основе выбора покупателя.</p>
          </div></section>
        </div>
      </section>
    </article>
  );
}

export function PartDesignerContent() {
  return (
    <article className="design-product">
      <header className="crm-hero">
        <div>
          <h2 className="design-product-heading">
            <Image className="part-designer-heading-logo" src="/crm/part-designer/logo.png" alt="" width={240} height={221} sizes="72px" />
            Part Designer
          </h2>
          <p>Part Designer — инструмент для онлайн-проектирования и заказа мебельных деталей. В браузере заказчик может настроить отдельную деталь и сразу увидеть на чертеже её параметры, присадку и обработки. Сервис дополняет наши инструменты приёма заказов, в которых покупатель выбирает и настраивает готовые изделия из каталога.</p>
        </div>
        <DemoButton />
      </header>
      <section className="design-product-video" aria-labelledby="part-designer-video-heading">
        <h3 id="part-designer-video-heading">Part Designer в работе</h3>
        <ProductVideo
          src="/videos/part-designer-v1.mp4"
          poster="/videos/part-designer-poster.jpg"
          title="Демонстрация работы Part Designer"
          caption="Онлайн-проектирование мебельных деталей в Part Designer"
          duration="4 мин 32 сек"
        />
      </section>
      <div className="crm-split-row">
        <section className="crm-feature-copy">
          <h3>От чертежа до отгрузки</h3>
          <p>Part Designer разработан как часть FaetonMES. Система автоматически формирует производственную спецификацию по заказу, группирует детали в партии для оптимизации раскроя, проверяет доступность материалов и фурнитуры и создаёт программы ЧПУ.</p>
          <p>В FaetonMES также можно планировать и запускать заказы в производство, отслеживать операции, контролировать качество, упаковку, хранение и отгрузку.</p>
        </section>
        <figure className="crm-screenshot design-product-screenshot">
          <ScreenshotPreview
            src="/crm/part-designer/interface-updated.svg"
            width={1300}
            height={820}
            caption="Проектирование мебельной детали в Part Designer"
            alt="Интерфейс Part Designer с чертежом мебельной детали"
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          <figcaption>Проектирование мебельной детали в Part Designer</figcaption>
        </figure>
      </div>
      <div className="crm-feature-grid">
        <section className="crm-feature-card"><div className="crm-feature-copy">
          <h3>Преимущества для заказчика</h3>
          <ul className="crm-points">
            <li>Понятное оформление заказа с отображением параметров детали, присадки и обработок на чертеже.</li>
            <li>Доступ к материалам и обработкам в соответствии с правами группы пользователей.</li>
            <li>Сохранение заказов в базе FaetonMES и возможность распечатать их.</li>
            <li>Упорядоченное взаимодействие с производителем.</li>
          </ul>
        </div></section>
        <section className="crm-feature-card"><div className="crm-feature-copy">
          <h3>Преимущества для производителя</h3>
          <ul className="crm-points">
            <li>Единый формат входящих заказов и интеграция с FaetonMES.</li>
            <li>Общая база материалов, групп присадки и обработок.</li>
            <li>Управление заказами, их хранение и аналитика в одной системе.</li>
            <li>Возможность принимать заказы онлайн и обслуживать более широкий круг клиентов.</li>
          </ul>
        </div></section>
      </div>
    </article>
  );
}
