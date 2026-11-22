"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useRef, useState } from "react";

const demoHandle = Dialog.createHandle();

export function DemoButton({ variant = "primary" }: { variant?: "primary" | "footer" }) {
  return (
    <Dialog.Trigger handle={demoHandle} className={"demo-button demo-button-" + variant}>
      Запросить демо
    </Dialog.Trigger>
  );
}

export function DemoDialog() {
  const nameRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  return (
    <Dialog.Root handle={demoHandle} onOpenChange={() => setMessage("")}>
      <Dialog.Portal>
        <Dialog.Backdrop className="demo-backdrop" />
        <Dialog.Viewport className="demo-viewport">
          <Dialog.Popup className="demo-popup" initialFocus={(interaction) => interaction === "touch" ? true : nameRef.current}>
            <Dialog.Close className="demo-close" aria-label="Закрыть форму">×</Dialog.Close>
            <p className="demo-kicker">FaetonMES</p>
            <Dialog.Title className="demo-title">Запросить демо</Dialog.Title>
            <Dialog.Description className="demo-intro">Расскажите, как с вами связаться.</Dialog.Description>
            <form className="demo-form" onSubmit={(event) => {
              event.preventDefault();
              setMessage("Данные заполнены. Отправка заявок пока не подключена — информация никуда не отправлена.");
            }}>
              <label className="demo-field">
                <span>Ваше имя</span>
                <input ref={nameRef} name="name" autoComplete="name" placeholder="Имя и фамилия" required maxLength={100} />
              </label>
              <label className="demo-field">
                <span>Компания</span>
                <input name="company" autoComplete="organization" placeholder="Название компании" required maxLength={150} />
              </label>
              <div className="demo-field-row">
                <label className="demo-field">
                  <span>Телефон</span>
                  <input type="tel" name="phone" autoComplete="tel" placeholder="+7 (___) ___-__-__" required minLength={7} maxLength={30} />
                </label>
                <label className="demo-field">
                  <span>Email</span>
                  <input type="email" name="email" autoComplete="email" placeholder="name@company.com" required maxLength={254} />
                </label>
              </div>
              <p className="demo-form-note">Предварительная форма. Отправка заявок пока недоступна.</p>
              <button type="submit" className="demo-button demo-button-primary demo-submit">Запросить демо</button>
              <p className="demo-form-status" role="status">{message}</p>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
