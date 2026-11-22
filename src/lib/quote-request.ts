export const quoteRecipient = "olvenn@mail.ru";
export const implementationOptions = ["Своими силами после обучения", "Полностью при помощи интегратора", "Совместное внедрение"] as const;
export const userCountOptions = ["2-3", "3-5", "5-10", "15", "40"] as const;
export const cncCountOptions = ["2-3", "3-5", "5-10", "15", "30"] as const;

export type QuoteRequest = {
  name: string;
  company: string;
  email: string;
  phone: string;
  userCount?: string;
  cncCount?: string;
  implementation: string;
  comment: string;
  moduleIds: string[];
};

export function isEmail(value: string) {
  return value.length <= 254 && /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(value);
}

export function parseQuoteRequest(input: unknown, allowedModuleIds: readonly string[]): QuoteRequest | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return null;
  const data = input as Record<string, unknown>;
  const text = (key: string, limit: number, required = false) => {
    const value = data[key];
    if (value === undefined && !required) return "";
    if (typeof value !== "string" || value.length > limit || value.includes("\0")) return null;
    if (key !== "comment" && /[\r\n]/.test(value)) return null;
    const trimmed = value.trim();
    return required && !trimmed ? null : trimmed;
  };
  const name = text("name", 100, true);
  const company = text("company", 150, true);
  const email = text("email", 254, true);
  const phone = text("phone", 30);
  const userCount = text("userCount", 10);
  const cncCount = text("cncCount", 10);
  const implementation = text("implementation", 100, true);
  const comment = text("comment", 2000);
  if (name === null || company === null || email === null || phone === null || implementation === null || comment === null) return null;
  if (userCount === null || cncCount === null) return null;
  if (userCount && !userCountOptions.some(option => option === userCount)) return null;
  if (cncCount && !cncCountOptions.some(option => option === cncCount)) return null;
  if (!isEmail(email) || !implementationOptions.some((option) => option === implementation)) return null;
  if (!Array.isArray(data.moduleIds) || !data.moduleIds.length || data.moduleIds.length > allowedModuleIds.length) return null;
  if (!data.moduleIds.every((id) => typeof id === "string" && allowedModuleIds.includes(id))) return null;
  const moduleIds = [...new Set(data.moduleIds as string[])];
  return {
    name, company, email, phone, implementation, comment, moduleIds,
    ...(userCount && { userCount }),
    ...(cncCount && { cncCount }),
  };
}

export function buildQuoteText(request: QuoteRequest, modules: readonly { id: string; title: string }[], date = new Date()) {
  const selectedModules = modules.filter(({ id }) => request.moduleIds.includes(id));
  return [
    "FaetonMES — запрос на расчёт стоимости",
    `Дата: ${date.toLocaleDateString("ru-RU", { timeZone: "Europe/Moscow" })}`,
    "",
    `Имя: ${request.name}`,
    `Компания: ${request.company}`,
    `Email: ${request.email}`,
    `Телефон: ${request.phone || "не указан"}`,
    `Количество пользователей системы: ${request.userCount || "не указано"}`,
    `Количество станков ЧПУ: ${request.cncCount || "не указано"}`,
    `Внедрение: ${request.implementation}`,
    "",
    "Выбранные модули:",
    ...selectedModules.map(({ title }, index) => `${index + 1}. ${title}`),
    "",
    `Комментарий: ${request.comment || "нет"}`,
  ].join("\r\n");
}
