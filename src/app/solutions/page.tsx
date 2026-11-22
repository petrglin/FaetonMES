import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SolutionProcessPreview, type SolutionProcess } from "@/components/solution-process-preview";
import { SolutionProcessCard, SolutionProcessGrid } from "@/components/solution-process-grid";
import { solutions } from "@/lib/solutions";

export const metadata: Metadata = { title: "Типовые решения — FaetonMES" };

const kitchenComponents: ReadonlyArray<{ title: string; href?: string }> = [
  { title: "2020 Design" },
  { title: "3CAD", href: "/features#integrations" },
  { title: "БАЗИС-Мебельщик", href: "/features#integrations" },
  { title: "EasyOrder CRM", href: "/design-crm" },
  { title: "Ввод заказов", href: "/features/order-entry" },
  { title: "Инженерный конфигуратор", href: "/features/engineering-configurator" },
  { title: "Индивидуальное проектирование", href: "/features/custom-design" },
  { title: "Создание программ ЧПУ", href: "/features/cnc-programs" },
  { title: "Управление производством", href: "/features/production" },
  { title: "Отгрузка", href: "/features/shipping" },
  { title: "1С", href: "/features#integrations" },
];

function ProcessContent({ solution }: { solution: SolutionProcess }) {
  return (
    <>
      <figure className="solution-process-figure">
        <SolutionProcessPreview solution={solution} />
        <figcaption>Здесь представлено логическое увязывание основных блоков комплекса программного обеспечения для данного типового решения.</figcaption>
      </figure>
      {solution === "custom-kitchens" && (
        <section className="solution-components" aria-labelledby="kitchen-components-heading">
          <h2 id="kitchen-components-heading">Компоненты решения</h2>
          <ul>
            {kitchenComponents.map(({ title, href }) => (
              <li key={title}>
                {href ? <Link href={href}>{title}</Link> : <span>{title}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default function Page() {
  return (
    <main className="page-shell solutions-page">
      <h1 className="section-heading">Типовые решения</h1>
      <p className="solutions-intro">
        Мебельные и деревообрабатывающие производства всегда уникальны, и каждая компания, как правило, обладает своими ноу-хау и технологиями. Тем не менее, накопив огромный опыт внедрения различных проектов в разных странах мира, мы смогли сформулировать ряд типовых решений, наборов модулей и функциональностей и обладаем компетенцией по наименее болезненному внедрению их на предприятиях.
      </p>
      <SolutionProcessGrid>
        {solutions.map(({ id, title, photo, description }) => {
          const hasProcess = id === "custom-kitchens"
            || id === "online-retail"
            || id === "countertops"
            || id === "serial-furniture"
            || id === "interior-doors"
            || id === "custom-parts";

          const content = (
            <>
              {photo && (
                <Image
                  className="solution-card-photo"
                  src={photo.src}
                  alt={photo.alt}
                  width={720}
                  height={480}
                  sizes={hasProcess ? "(min-width: 600px) 248.4px, 165.6px" : "(min-width: 600px) 165.6px, 110.4px"}
                />
              )}
              <div className="solution-card-copy">
                <h2>{title}</h2>
                {description && <p className="solution-card-description">{description}</p>}
              </div>
            </>
          );
          if (hasProcess) {
            return (
              <SolutionProcessCard key={id} id={id} title={title} preview={<ProcessContent solution={id} />}>
                {content}
              </SolutionProcessCard>
            );
          }

          return (
            <li key={id} className="solution-card" data-solution-id={id} tabIndex={description ? 0 : undefined}>
              {content}
            </li>
          );
        })}
      </SolutionProcessGrid>
    </main>
  );
}
