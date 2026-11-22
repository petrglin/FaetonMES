"use server";

import { getQuoteMailConfig, sendSiteMail } from "@/lib/quote-mail";

export async function requestCallback(form: FormData) {
  const name = form.get("name");
  const phone = form.get("phone");
  const comment = form.get("comment");
  if (typeof name !== "string" || !name.trim() || name.length > 100 || /[\r\n\0]/.test(name)) {
    return { ok: false, message: "Укажите ваше имя." };
  }
  if (typeof phone !== "string" || phone.length > 30 || !/^[+\d(). -]+$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, ""))) {
    return { ok: false, message: "Проверьте номер телефона." };
  }
  if (typeof comment !== "string" || comment.length > 500 || comment.includes("\0")) {
    return { ok: false, message: "Комментарий должен содержать не более 500 символов." };
  }

  const to = "info@faetonmes.ru";
  const subject = "FaetonMES — просьба перезвонить";
  const text = [`Имя: ${name.trim()}`, `Телефон: ${phone.trim()}`, comment.trim()].filter(Boolean).join("\r\n");
  const emailLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  const config = getQuoteMailConfig();
  if (!config) return { ok: false, message: "Отправка с сайта пока недоступна.", emailLink };

  try {
    await sendSiteMail(config, { to, subject, text });
    return { ok: true, message: "Заявка отправлена. Мы перезвоним вам по указанному номеру." };
  } catch {
    return { ok: false, message: "Не удалось отправить заявку. Попробуйте ещё раз или отправьте письмо.", emailLink };
  }
}
