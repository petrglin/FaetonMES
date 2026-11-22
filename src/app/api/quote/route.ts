import { systemModules } from "@/lib/modules";
import { parseQuoteRequest } from "@/lib/quote-request";
import { getQuoteMailConfig, sendQuoteRequest } from "@/lib/quote-mail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const respond = (message: string, status: number) => Response.json({ message }, { status, headers: { "Cache-Control": "no-store" } });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return respond("Запрос с этого сайта не разрешён.", 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return respond("Ожидаются данные формы.", 415);
  const reader = request.body?.getReader();
  if (!reader) return respond("Заполните форму запроса.", 400);
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16384) { await reader.cancel(); return respond("Запрос слишком большой.", 413); }
    chunks.push(value);
  }
  let input: unknown;
  try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { return respond("Не удалось прочитать данные формы.", 400); }
  const data = parseQuoteRequest(input, systemModules.map(({ id }) => id));
  if (!data) return respond("Проверьте контакты, количество пользователей и станков ЧПУ, способ внедрения и выбранные модули.", 400);
  const config = getQuoteMailConfig();
  if (!config) return respond("Отправка писем пока не настроена. Можно скачать запрос файлом и отправить его на olvenn@mail.ru.", 503);
  try {
    await sendQuoteRequest(data, config);
    return respond("Запрос отправлен. Мы свяжемся с вами по указанным контактам.", 200);
  } catch (error) {
    console.error("Quote email failed", error instanceof Error && "code" in error ? String(error.code) : "SMTP_ERROR");
    return respond("Не удалось отправить запрос. Попробуйте позже или скачайте его файлом. Данные формы сохранены в этом окне.", 502);
  }
}
