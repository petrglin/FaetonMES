import Image from "next/image";
import { DemoButton } from "@/components/demo-dialog";
import { CrmScreenshot } from "@/components/crm-screenshot";
import { easyOrderFeatures } from "@/lib/easyorder";

export function EasyOrderContent() {
  return (
    <article className="easyorder-content">
      <header className="crm-hero">
        <div>
          <h2 className="design-product-heading">
            <Image src="/integrations/logos/easyordercrm-icon.webp" alt="" width={64} height={64} />
            EasyOrderCRM
          </h2>
          <p>Специализированная CRM-система для продаж мебели, дверей, индивидуальных домов и комплектующих. Единое рабочее пространство менеджера в салоне, дилера и отдела приёма заказов на предприятии.</p>
          <ul className="crm-tags" aria-label="О продукте"><li>Мебель, двери и дома</li><li>Веб-интерфейс</li><li>Дилерские сети</li></ul>
        </div>
        <DemoButton />
      </header>
      <CrmScreenshot name="dashboard" caption="Настраиваемый рабочий стол: статистика продаж, задачи и уведомления" priority />
      <nav className="module-detail-nav" aria-label="Возможности EasyOrder CRM"><a href="#crm-sales">Продажи и заказы</a><a href="#crm-network">Дилеры и коммуникации</a><a href="#crm-analytics">Мониторинг эффективности</a><a href="#crm-integrations">Интеграции</a></nav>

      <section className="crm-section" aria-labelledby="crm-process-heading">
        <h2 id="crm-process-heading">Единое пространство продаж мебели, дверей и домов</h2>
        <p className="crm-section-intro">EasyOrder — SaaS CRM-система для продаж мебели, дверей и индивидуальных домов. Она организует работу всех уровней сбыта: от менеджера в магазине до производственного предприятия, включая разветвлённые дилерские сети. Решение работает самостоятельно или в связке с системами 2020.</p>
        <ol className="crm-process-flow">{["Приём заказа", "Проверка и обработка", "Передача на фабрику", "Производство и отгрузка"].map((step) => <li key={step}>{step}</li>)}</ol>
      </section>

      <section id="crm-sales" className="crm-section" aria-labelledby="crm-sales-heading">
        <h2 id="crm-sales-heading">От первого обращения до выполнения заказа</h2>
        <div className="crm-feature-grid">{easyOrderFeatures.map((feature) => (
          <section className="crm-feature-card" key={feature.title}>
            <div className="crm-feature-copy"><h3>{feature.title}</h3><p>{feature.text}</p></div>
            <CrmScreenshot name={feature.screenshot} caption={feature.caption} />
          </section>
        ))}</div>
      </section>

      <section id="crm-network" className="crm-section" aria-labelledby="crm-network-heading">
        <h2 id="crm-network-heading">Дилерская сеть и общение по заказам</h2>
        <div className="crm-split-row">
          <div className="crm-feature-copy">
            <h3>Согласованная работа всех участников</h3>
            <p>Единый веб-портал для дилеров не требует установки дополнительного программного или аппаратного обеспечения на их стороне. Пространство настраивается под пользователя.</p>
            <ul className="crm-points">
              <li>Менеджеры, магазины, дилеры и фабрика работают в общем информационном поле.</li>
              <li>Отдельные заказы точек продаж объединяются в агрегированные заказы дилера на фабрику.</li>
              <li>Фабрика и дилеры управляют подчинённой структурой сбыта, создают точки продаж, пользователей и назначают права.</li>
              <li>Живой чат, обмен файлами и двунаправленные сообщения, в том числе на уровне отдельных позиций заказа.</li>
              <li>Категории, права доступа, длительность и периодичность уведомлений настраиваются.</li>
            </ul>
          </div>
          <CrmScreenshot name="chat" caption="Общение между фабрикой и участниками сети продаж" />
        </div>
        <div className="crm-network-levels" aria-label="Уровни сети продаж"><span>Фабрика</span><span>Дилер</span><span>Магазин</span><span>Менеджер</span></div>
      </section>

      <section id="crm-analytics" className="crm-section" aria-labelledby="crm-analytics-heading">
        <h2 id="crm-analytics-heading">Мониторинг эффективности в магазинах</h2>
        <p className="crm-section-intro">От точки продаж к конкретному сотруднику: просчёты, заказы, отказы, претензии, проведённые сделки и время работы. Последние и неассоциированные просчёты доступны в том же рабочем пространстве.</p>
        <ul className="crm-monitoring-highlights"><li>Детали по точке продаж</li><li>Показатели и сделки сотрудника</li><li>Контроль последних просчётов</li></ul>
        <div className="crm-monitoring-overview"><CrmScreenshot name="store-efficiency-dashboard" caption="Демонстрационный экран мониторинга: точка продаж, сотрудники и детали работы менеджера" /></div>
        <h3 className="crm-statistics-heading">Детальная статистика продаж</h3>
        <p className="crm-section-intro">Воронки, графики и таблицы показывают, сколько лидов стали клиентами, а замеров — заказами. Можно анализировать оборот за период, эффективность салонов с учётом площади и числа сотрудников, рабочее время и показатели отдельных менеджеров. По любому узлу сети формируются отчёты для печати.</p>
        <div className="crm-analytics-grid">
          <CrmScreenshot name="network-statistics" caption="Сводные показатели узла сети продаж" />
          <CrmScreenshot name="store-statistics" caption="Эффективность салона по месяцам" />
          <CrmScreenshot name="manager-statistics" caption="Показатели отдельных менеджеров" />
        </div>
      </section>

      <section id="crm-integrations" className="crm-section" aria-labelledby="crm-integrations-heading">
        <h2 id="crm-integrations-heading">Связь проектирования, продаж и производства</h2>
        <div className="crm-split-row">
          <div className="crm-feature-copy" style={{ gridColumn: "1 / -1" }}>
            <h3>Интеграция с 2020 Design</h3>
            <p>Работа с клиентом может начинаться в Design или EasyOrder CRM. Заказы из графической системы напрямую попадают в CRM и проверяются по версиям каталога и прайс-листов.</p>
            <ul className="crm-points">
              <li>KIT-файлы открываются из CRM в Design, редактируются и снова сохраняются в облаке.</li>
              <li>Заказ можно создать без KIT-файла, а замерщики могут прикрепить файлы проведённых замеров.</li>
              <li>Каталоги Design, цены и отчёты обновляются во всех точках продаж.</li>
            </ul>
          </div>
        </div>
        <div className="crm-split-row crm-split-row-reverse">
          <div className="crm-feature-copy">
            <h3>Бизнес-процесс и интеграция с 2020 inSight</h3>
            <p>В основе EasyOrder CRM — настраиваемый бизнес-процесс жизненного цикла клиентского заказа. Его можно адаптировать к бизнес-модели и синхронизировать с процессами фабрики в ERP. Для inSight предусмотрена нативная связь.</p>
            <ul className="crm-points">
              <li>После заданного этапа заказ отправляется в inSight; дальнейшие изменения синхронизируются между системами.</li>
              <li>Статусы сообщают точкам продаж, принят ли заказ в работу, произведён или отгружен. Их видимость определяется правами доступа.</li>
              <li>Изменения возможны в CRM и inSight с уведомлением дилера или магазина. Проверка цены в inSight передаётся обратно в CRM.</li>
              <li>Синхронизируются данные дилеров и магазинов; при отправке заказа на фабрику проверяются версии каталогов.</li>
            </ul>
          </div>
          <CrmScreenshot name="workflow" caption="Настройка бизнес-процесса клиентского заказа" />
        </div>
      </section>

      <section className="crm-cta" aria-label="Демонстрация EasyOrder CRM">
        <div><h2>Посмотрите EasyOrder CRM в работе</h2><p>Обсудим приём заказов, работу салонов и взаимодействие с фабрикой.</p></div><DemoButton />
      </section>
      <p className="crm-source-note">Демонстрационные экраны EasyOrder CRM пересобраны в едином стиле по материалам презентации и вашему макету мониторинга эффективности. Нажмите на изображение, чтобы рассмотреть его в исходном размере.</p>
    </article>
  );
}
