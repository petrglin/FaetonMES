import nodemailer from "nodemailer";
import { systemModules } from "@/lib/modules";
import { buildQuoteText, isEmail, quoteRecipient, type QuoteRequest } from "@/lib/quote-request";

export function getQuoteMailConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM?.trim() || user;
  const port = Number(process.env.SMTP_PORT || "465");
  if (!host || !user || !pass || !from || !isEmail(from) || !Number.isInteger(port) || port < 1 || port > 65535) return null;
  return { host, port, user, pass, from };
}

export async function sendQuoteRequest(request: QuoteRequest, config: NonNullable<ReturnType<typeof getQuoteMailConfig>>) {
  await sendSiteMail(config, {
    to: quoteRecipient,
    replyTo: { name: request.name, address: request.email },
    subject: "FaetonMES — запрос на расчёт стоимости",
    text: buildQuoteText(request, systemModules),
  });
}

export async function sendSiteMail(
  config: NonNullable<ReturnType<typeof getQuoteMailConfig>>,
  mail: { to: string; subject: string; text: string; replyTo?: { name: string; address: string } },
) {
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port !== 465,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  const result = await transport.sendMail({
    from: { name: "FaetonMES", address: config.from },
    ...mail,
  });
  if (!result.accepted.some((address: string | { address: string }) => (typeof address === "string" ? address : address.address).toLowerCase() === mail.to.toLowerCase())) {
    throw new Error("Recipient was not accepted by SMTP server");
  }
}
