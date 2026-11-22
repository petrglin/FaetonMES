export const navigation = [
  { href: "/", label: "Главная" },
  { href: "/features", label: "MES/ERP" },
  { href: "/design-crm", label: "DESIGN/CRM" },
  { href: "/solutions", label: "Типовые решения" },
  { href: "/implementation", label: "Услуги" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
] as const;

export const footerNavigation = [...navigation, { href: "/pricing", label: "Цены" }] as const;
