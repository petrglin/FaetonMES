"use server";

export async function sendTelegramSupportMessage(form: FormData) {
  const name = form.get("name");
  const company = form.get("company");
  const message = form.get("message");
  const contact = form.get("contact");
  if (typeof name !== "string" || !name.trim() || name.length > 100 || /[\r\n\0]/.test(name)) {
    return { ok: false, message: "Укажите ваше имя." };
  }
  if (typeof company !== "string" || !company.trim() || company.length > 150 || /[\r\n\0]/.test(company)) {
    return { ok: false, message: "Укажите название компании." };
  }
  if (typeof message !== "string" || !message.trim() || message.length > 3000 || message.includes("\0")) {
    return { ok: false, message: "Введите сообщение длиной до 3000 символов." };
  }
  if (typeof contact !== "string" || contact.length > 150 || /[\r\n\0]/.test(contact)) {
    return { ok: false, message: "Проверьте контакт для ответа." };
  }

  const token = process.env.TELEGRAM_SUPPORT_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_SUPPORT_CHAT_ID?.trim();
  if (!token || !/^\d+:[\w-]+$/.test(token) || !chatId || !/^\d+$/.test(chatId)) {
    return { ok: false, message: "Отправка в Telegram пока не подключена." };
  }

  const details = [
    `Имя: ${name.trim()}`,
    `Компания: ${company.trim()}`,
    contact.trim() && `Контакт для ответа: ${contact.trim()}`,
  ].filter(Boolean).join("\n");
  const text = ["Сообщение с сайта FaetonMES", details, message.trim()].join("\n\n");
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, link_preview_options: { is_disabled: true } }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    const result = await response.json();
    if (response.ok && result.ok === true) return { ok: true, message: "Сообщение отправлено." };
  } catch {
    // Keep the message in the form if Telegram is unavailable.
  }
  return { ok: false, message: "Не удалось отправить сообщение. Попробуйте ещё раз." };
}
