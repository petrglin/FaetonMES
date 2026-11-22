"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useState } from "react";
import { ModulesGrid } from "@/components/modules-grid";
import { useModuleSelection } from "@/lib/module-selection";

import { buildQuoteText, cncCountOptions, implementationOptions, quoteRecipient, userCountOptions } from "@/lib/quote-request";

export function ModuleConfigurator() {
  const { selectedIds, selectedModules, toggleModule, clearSelection } = useModuleSelection();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messageIsError, setMessageIsError] = useState(false);
  const count = selectedModules.length;

  return (
    <div className="module-configurator">
      <p className="module-selection-hint">Отметьте галочкой нужные модули, чтобы подготовить запрос на расчёт стоимости. Нажмите на название модуля, чтобы узнать подробнее.</p>
      <ModulesGrid selectedIds={selectedIds} onToggle={toggleModule} />
      <Dialog.Root onOpenChange={() => setMessage("")}>
        <div className="module-selection-bar" hidden={!count} aria-label="Выбор модулей для расчёта">
          <div><p className="module-selection-label">Ваш набор MES/ERP</p><p className="module-selection-count" role="status">Выбрано модулей: <strong>{count}</strong></p></div>
          <div className="module-selection-actions">
            <button type="button" className="module-selection-clear" disabled={!count} onClick={clearSelection}>Сбросить выбор</button>
            <Dialog.Trigger className="demo-button demo-button-primary" disabled={!count}>Запросить расчёт{count ? ` · ${count}` : ""}</Dialog.Trigger>
          </div>
        </div>
        <Dialog.Portal>
          <Dialog.Backdrop className="demo-backdrop" />
          <Dialog.Viewport className="demo-viewport">
            <Dialog.Popup className="demo-popup module-quote-popup">
              <Dialog.Close className="demo-close" aria-label="Закрыть запрос на расчёт">×</Dialog.Close>
              <Dialog.Title className="demo-title">Расчёт стоимости</Dialog.Title>
              <Dialog.Description className="demo-intro">Проверьте состав модулей и укажите контакты для запроса.</Dialog.Description>
              <h3 className="module-quote-heading">Выбранные модули · {count}</h3>
              <ul className="module-quote-list">
                {selectedModules.map(({ id, title }) => <li key={id}><span>{title}</span><button type="button" onClick={() => { toggleModule(id); setMessage(""); }} aria-label={`Убрать модуль «${title}» из расчёта`}>×</button></li>)}
              </ul>
              {!count && <p className="demo-form-note">Выберите хотя бы один модуль, чтобы подготовить запрос.</p>}
              <form className="demo-form" onSubmit={async (event) => {
                event.preventDefault();
                if (!count || sending) return;
                const fields = new FormData(event.currentTarget);
                const payload = {
                  name: String(fields.get("name") || ""),
                  company: String(fields.get("company") || ""),
                  email: String(fields.get("email") || ""),
                  phone: String(fields.get("phone") || ""),
                  userCount: String(fields.get("userCount") || ""),
                  cncCount: String(fields.get("cncCount") || ""),
                  implementation: String(fields.get("implementation") || ""),
                  comment: String(fields.get("comment") || ""),
                  moduleIds: selectedModules.map(({ id }) => id),
                };
                const text = buildQuoteText(payload, selectedModules);
                setMessageIsError(false);
                const submitter = (event.nativeEvent as SubmitEvent).submitter;
                if (submitter instanceof HTMLButtonElement && submitter.value === "download") {
                  const url = URL.createObjectURL(new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" }));
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "FaetonMES-запрос-на-расчёт.txt";
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
                  setMessage(`Запрос подготовлен для скачивания. Его можно отправить на ${quoteRecipient}.`);
                } else {
                  setSending(true);
                  setMessage("Отправляем запрос…");
                  try {
                    const response = await fetch("/api/quote", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    const result: unknown = await response.json();
                    const serverMessage = typeof result === "object" && result !== null && "message" in result && typeof result.message === "string" ? result.message : "Не удалось отправить запрос. Попробуйте позже.";
                    setMessageIsError(!response.ok);
                    setMessage(serverMessage);
                  } catch {
                    setMessageIsError(true);
                    setMessage("Не удалось связаться с сервером. Попробуйте ещё раз или скачайте запрос файлом. Данные формы сохранены в этом окне.");
                  } finally {
                    setSending(false);
                  }
                }
              }}>
                <div className="demo-field-row">
                  <label className="demo-field"><span>Ваше имя</span><input name="name" autoComplete="name" placeholder="Имя и фамилия" required maxLength={100} /></label>
                  <label className="demo-field"><span>Компания</span><input name="company" autoComplete="organization" placeholder="Название компании" required maxLength={150} /></label>
                </div>
                <div className="demo-field-row">
                  <label className="demo-field"><span>Email</span><input name="email" type="email" autoComplete="email" placeholder="name@company.com" required maxLength={254} /></label>
                  <label className="demo-field"><span>Телефон (необязательно)</span><input name="phone" type="tel" autoComplete="tel" placeholder="+7 (___) ___-__-__" maxLength={30} /></label>
                </div>
                <fieldset className="module-implementation">
                  <legend>Сколько человек должны работать с системой?</legend>
                  <div className="module-quote-options">
                    {userCountOptions.map(option => (
                      <label key={option}><input type="radio" name="userCount" value={option} required /><span>{option}</span></label>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="module-implementation">
                  <legend>Сколько у вас ЧПУ станков?</legend>
                  <div className="module-quote-options">
                    {cncCountOptions.map(option => (
                      <label key={option}><input type="radio" name="cncCount" value={option} required /><span>{option}</span></label>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="module-implementation">
                  <legend>Как планируете внедрение?</legend>
                  {implementationOptions.map((option) => (
                    <label key={option}><input type="radio" name="implementation" value={option} required /><span>{option}</span></label>
                  ))}
                </fieldset>
                <label className="demo-field"><span>Комментарий (необязательно)</span><textarea name="comment" rows={3} maxLength={2000} placeholder="Задачи предприятия и пожелания" /></label>
                <button type="submit" name="action" value="email" className="demo-button demo-button-primary demo-submit" disabled={!count || sending}>{sending ? "Отправляем…" : "Отправить на расчёт"}</button>
                <button type="submit" name="action" value="download" className="module-selection-clear" disabled={!count || sending}>Скачать запрос файлом</button>
                <p className="demo-form-status" data-error={messageIsError} role={messageIsError ? "alert" : "status"}>{message}</p>
              </form>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
