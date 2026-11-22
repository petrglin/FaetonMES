"use client";

import { useState } from "react";
import { ThinkingOrb, type OrbState } from "thinking-orbs";

const states: { state: OrbState; label: string; description: string }[] = [
  { state: "working", label: "Обработка", description: "Выполнение задачи" },
  { state: "searching", label: "Поиск", description: "Поиск заказов и документов" },
  { state: "solving", label: "Расчёт", description: "Планирование производства" },
  { state: "listening", label: "Прослушивание", description: "Голосовой ввод" },
  { state: "connecting", label: "Соединение", description: "Связь с ERP и оборудованием" },
  { state: "weaving", label: "Объединение", description: "Сбор данных из источников" },
  { state: "composing", label: "Подготовка", description: "Формирование отчёта" },
  { state: "breathing", label: "Ожидание", description: "Помощник готов к работе" },
  { state: "shaping", label: "Формирование", description: "Создание структуры изделия" },
];

export function OrbsShowcase() {
  const [selected, setSelected] = useState<OrbState>("working");
  const [paused, setPaused] = useState(false);
  const [dark, setDark] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [assistant, setAssistant] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [sync, setSync] = useState(false);
  const active = states.find((item) => item.state === selected)!;
  const theme = dark ? "dark" : "light";
  const color = dark ? "#a8cfff" : "#0059bd";
  const orb = (state: OrbState, size: 20 | 64 = 64) => <ThinkingOrb state={state} size={size} theme={theme} color={color} speed={speed} paused={paused} aria-label={states.find((item) => item.state === state)?.label} />;

  return (
    <div className={"orbs-showcase" + (dark ? " orbs-dark" : "")}>
      <header className="orbs-heading">
        <p className="orbs-caption">Лаборатория интерфейса · FaetonMES</p>
        <h1>Thinking Orbs</h1>
        <p>Живые индикаторы поиска, расчётов и обработки данных. Выберите анимацию и попробуйте её в примерах ниже.</p>
        <p className="orbs-disclaimer">Демонстрация интерфейса: помощник, расчёты и интеграции здесь имитируются.</p>
      </header>
      <section className="orbs-playground" aria-label="Настройки анимации">
        <div className="orbs-active">{orb(selected)}<div><h2>{active.label}</h2><p>{active.description}</p></div></div>
        <div className="orbs-controls">
          <button className="orbs-control" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Продолжить анимацию" : "Пауза анимации"}</button>
          <button className="orbs-control" onClick={() => setDark(!dark)} aria-pressed={dark}>Тёмная тема</button>
          <label>Скорость <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))}><option value={0.5}>0,5×</option><option value={1}>1×</option><option value={1.5}>1,5×</option></select></label>
        </div>
      </section>
      <div className="orbs-states" aria-label="Варианты анимаций">
        {states.map((item) => <button key={item.state} className="orbs-state" onClick={() => setSelected(item.state)} aria-pressed={selected === item.state}>
          {orb(item.state)}<strong>{item.label}</strong><span>{item.state}</span>
        </button>)}
      </div>
      <section className="orbs-examples" aria-labelledby="orbs-examples-title">
        <h2 id="orbs-examples-title">Три сценария для FaetonMES</h2>
        <div className="orbs-example-grid">
          <article className="orbs-example">
            <p className="orbs-caption">01 · Помощник</p><h3>Ответы рядом с задачей</h3>
            <div className="orbs-message">Какие заказы нужно отгрузить сегодня?</div>
            <div className="orbs-status" role="status">{orb(assistant ? "searching" : "breathing", 20)}<span>{assistant ? "Ищу заказы для отгрузки…" : "Помощник готов к вопросу"}</span></div>
            <p>Небольшой индикатор внутри чата или строки поиска.</p>
            <button className="orbs-control" onClick={() => setAssistant(!assistant)}>{assistant ? "Сбросить пример" : "Показать поиск"}</button>
          </article>
          <article className="orbs-example">
            <p className="orbs-caption">02 · Планирование</p><h3>Расчёт производственного плана</h3>
            <div className="orbs-process">{orb(planning ? "solving" : "shaping")}<span role="status">{planning ? "Рассчитываем загрузку участков…" : "План готов к пересчёту"}</span></div>
            <p>Индикатор работы рядом с понятным описанием процесса.</p>
            <button className="orbs-control" onClick={() => setPlanning(!planning)}>{planning ? "Сбросить пример" : "Показать расчёт"}</button>
          </article>
          <article className="orbs-example">
            <p className="orbs-caption">03 · Интеграции</p><h3>Обмен данными с ERP</h3>
            <div className="orbs-process">{orb(sync ? "connecting" : "weaving")}<span role="status">{sync ? "Устанавливаем соединение…" : "Данные готовы к обмену"}</span></div>
            <p>Визуальный статус подключения к внешним системам.</p>
            <button className="orbs-control" onClick={() => setSync(!sync)}>{sync ? "Сбросить пример" : "Показать соединение"}</button>
          </article>
        </div>
      </section>
      <p className="orbs-source">Компонент <a href="https://github.com/jakubantalik/thinking-orbs" target="_blank" rel="noreferrer">Thinking Orbs · Jakub Antalik</a>. Анимации автоматически учитывают настройку уменьшения движения.</p>
    </div>
  );
}
