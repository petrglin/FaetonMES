import Image from "next/image";
import { CallbackForm } from "./callback-form";
import { TelegramSupportButton } from "@/components/telegram-support-button";

const companyAddress = "Санкт-Петербург, Автобусная улица, 6В";
const offices = [
  {
    id: "saint-petersburg",
    city: "Санкт-Петербург",
    role: "Головной офис",
    address: "ул. Автобусная, 6В",
    phone: "+7 (812) 320-48-98",
    tel: "+78123204898",
  },
  {
    id: "moscow",
    city: "Москва",
    role: "Московский офис",
    address: "129343, проезд Серебрякова, д. 2, к. 1, офис 17",
    phone: "+7 (495) 640-43-31",
    tel: "+74956404331",
  },
] as const;

const mailboxes = [
  { label: "Почта для сотрудничества", email: "info@faetonmes.ru" },
  { label: "Техническая поддержка", email: "support@faetonmes.ru" },
] as const;

const widgetQuery = new URLSearchParams({
  bbox: "30.2597,60.0247,30.2757,60.0293",
  layer: "mapnik",
  marker: "60.026986,30.267727",
}).toString();

export default function Page() {
  return (
    <main className="page-shell contacts-page">
      <h1 className="section-heading">Контакты</h1>
      <div className="mt-7 grid gap-4 md:grid-cols-2 md:gap-6">
        {offices.map(({ id, city, role, address, phone, tel }) => {
          const mapQuery = new URLSearchParams({ text: `${city}, ${address}` });
          return (
            <section
              key={id}
              aria-labelledby={`office-${id}`}
              className="flex flex-col rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm sm:p-8"
            >
              <p className="text-sm font-medium text-[var(--brand-blue)]">{role}</p>
              <h2 id={`office-${id}`} className="mt-1 text-3xl text-[var(--heading-color)]">{city}</h2>
              <address className="mt-3 flex-1 text-base leading-relaxed text-slate-600 not-italic">{address}</address>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--line)] pt-5">
                <a className="text-lg font-medium text-[var(--brand-blue)] hover:underline" href={`tel:${tel}`}>{phone}</a>
                <a
                  href={`https://yandex.ru/maps/?${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#eaf2fc] px-4 py-2 text-sm text-[var(--brand-blue)] hover:bg-[#dceafb]"
                >
                  Открыть на карте
                </a>
              </div>
            </section>
          );
        })}
      </div>
      <dl className="mt-4 grid gap-4 md:mt-6 md:grid-cols-2 md:gap-6">
        {mailboxes.map(({ label, email }) => (
          <div key={email} className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm sm:p-8">
            <dt className="text-sm font-medium text-[var(--brand-blue)]">{label}</dt>
            <dd className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a className="break-words text-lg font-medium text-[var(--brand-blue)] hover:underline" href={`mailto:${email}`}>
                {email}
              </a>
              {email === "support@faetonmes.ru" && (
                <div className="flex flex-wrap items-center gap-2">
                  <CallbackForm />
                  <TelegramSupportButton />
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <section className="mt-10" aria-labelledby="contacts-map-heading">
        <h2 id="contacts-map-heading" className="mb-4 text-2xl text-[var(--heading-color)]">Адрес головного офиса</h2>
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?${widgetQuery}`}
            title={`Карта проезда — ${companyAddress}`}
            loading="lazy"
            allowFullScreen
            className="block aspect-[2856/1100] w-full rounded-2xl border border-[var(--line)]"
          />
          <Image
            src="/about/faeton-building-retouched.webp"
            width={2856}
            height={1100}
            alt="Здание компании «Фаэтон» в Санкт-Петербурге"
            className="h-auto w-full self-center rounded-2xl"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </section>
    </main>
  );
}
