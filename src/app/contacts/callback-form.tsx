"use client";

import { useState, type FormEvent } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { requestCallback } from "./callback-action";

export function CallbackForm() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; emailLink?: string } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setResult(null);
    try {
      const response = await requestCallback(data);
      setResult(response);
      if (response.ok) form.reset();
    } catch {
      setResult({ ok: false, message: "Не удалось отправить заявку. Попробуйте ещё раз." });
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="demo-button demo-button-primary">Перезвоните мне</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="demo-backdrop" />
        <Dialog.Viewport className="demo-viewport">
          <Dialog.Popup className="demo-popup">
            <Dialog.Close className="demo-close" aria-label="Закрыть форму">×</Dialog.Close>
            <Dialog.Title className="demo-title">Перезвоните мне</Dialog.Title>
            <Dialog.Description className="demo-intro">Оставьте имя и телефон для обратного звонка.</Dialog.Description>
            <form className="demo-form" onSubmit={submit}>
              <div className="demo-field-row">
                <label className="demo-field">
                  <span>Ваше имя</span>
                  <input name="name" autoComplete="name" maxLength={100} required />
                </label>
                <label className="demo-field">
                  <span>Телефон для обратного звонка</span>
                  <input name="phone" type="tel" autoComplete="tel" placeholder="+7 (___) ___-__-__" minLength={7} maxLength={30} required />
                </label>
              </div>
              <label className="demo-field">
                <span>Комментарий или удобное время для звонка (необязательно)</span>
                <textarea name="comment" rows={3} maxLength={500} />
              </label>
              <button type="submit" className="demo-button demo-button-primary justify-self-start" disabled={pending}>
                {pending ? "Отправляем…" : "Заказать звонок"}
              </button>
              <p className="demo-form-status" role="status" data-error={result?.ok === false}>
                {result?.message}
                {result?.emailLink && <> <a className="underline" href={result.emailLink}>Отправить по почте</a></>}
              </p>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
