"use client";

import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { useState, type FormEvent } from "react";
import { sendTelegramSupportMessage } from "@/app/contacts/telegram-action";

export function TelegramSupportButton() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    setPending(true);
    setResult(null);
    try {
      const response = await sendTelegramSupportMessage(new FormData(form));
      setResult(response);
      if (response.ok) form.reset();
    } catch {
      setResult({ ok: false, message: "Не удалось отправить сообщение. Попробуйте ещё раз." });
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label="Написать в Telegram"
        title="Написать в Telegram"
        className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full hover:opacity-75"
      >
        <Image src="/contacts/telegram.svg" alt="" width={24} height={24} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="demo-backdrop" />
        <Dialog.Viewport className="demo-viewport">
          <Dialog.Popup className="demo-popup">
            <Dialog.Close className="demo-close" aria-label="Закрыть форму">×</Dialog.Close>
            <Dialog.Title className="demo-title">Написать в Telegram</Dialog.Title>
            <Dialog.Description className="demo-intro">Сообщение для техподдержки FaetonMES.</Dialog.Description>
            <form className="demo-form" onSubmit={submit}>
              <div className="demo-field-row">
                <label className="demo-field">
                  <span>Ваше имя</span>
                  <input name="name" autoComplete="name" maxLength={100} required />
                </label>
                <label className="demo-field">
                  <span>Компания</span>
                  <input name="company" autoComplete="organization" maxLength={150} required />
                </label>
              </div>
              <label className="demo-field">
                <span>Сообщение</span>
                <textarea name="message" rows={5} maxLength={3000} required />
              </label>
              <label className="demo-field">
                <span>Контакт для ответа (необязательно)</span>
                <input name="contact" placeholder="Email, телефон или @username" maxLength={150} />
              </label>
              <button type="submit" className="demo-button demo-button-primary justify-self-start" disabled={pending}>
                {pending ? "Отправляем…" : "Отправить сообщение"}
              </button>
              <p className="demo-form-status" role="status" data-error={result?.ok === false}>{result?.message}</p>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
