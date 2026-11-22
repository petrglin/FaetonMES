import assert from "node:assert/strict";
import test from "node:test";
import { buildQuoteText, implementationOptions, parseQuoteRequest, quoteRecipient } from "../src/lib/quote-request.ts";

const modules = [{ id: "production", title: "Управление производством" }, { id: "warehouse", title: "Управление Складом" }];
const ids = modules.map(({ id }) => id);
const valid = { name: "Тестовый клиент", company: "Компания", email: "test@example.com", phone: "", comment: "Нужен расчёт", implementation: implementationOptions[1], moduleIds: ids };

test("valid requests preserve contacts, implementation and selected modules", () => {
  assert.deepEqual(parseQuoteRequest(valid, ids), valid);
  for (const implementation of implementationOptions) assert.ok(parseQuoteRequest({ ...valid, implementation }, ids));
});

test("invalid contacts, options and module IDs are rejected", () => {
  for (const changed of [
    { name: " " }, { company: "" }, { email: "bad-address" },
    { email: "test@example.com\r\nBcc:other@example.com" },
    { name: "Name\nInjected header" }, { phone: "1".repeat(31) },
    { implementation: "unknown" }, { moduleIds: [] }, { moduleIds: ["unknown"] },
    { userCount: "30" }, { cncCount: "40" }, { userCount: 15 }, { cncCount: ["2-3"] },
    { moduleIds: "production" }, { comment: "x".repeat(2001) },
  ]) assert.equal(parseQuoteRequest({ ...valid, ...changed }, ids), null);
  for (const input of [null, [], "text", 5]) assert.equal(parseQuoteRequest(input, ids), null);
});

test("formatting includes every selected module and the implementation option", () => {
  const output = buildQuoteText(valid, modules, new Date("2026-11-01T22:00:00Z"));
  assert.match(output, /Дата: 02\.11\.2026/);
  assert.match(output, /Email: test@example\.com/);
  assert.match(output, /Внедрение: Полностью при помощи интегратора/);
  assert.match(output, /1\. Управление производством\r\n2\. Управление Складом/);
  assert.match(output, /Комментарий: Нужен расчёт/);
  assert.equal(quoteRecipient, "olvenn@mail.ru");
});

test("staff and CNC counts are preserved in the parsed request and its email or download text", () => {
  const request = { ...valid, userCount: "40", cncCount: "30" };
  const parsed = parseQuoteRequest(request, ids);
  assert.deepEqual(parsed, request);
  const output = buildQuoteText(parsed, modules);
  assert.match(output, /Количество пользователей системы: 40/);
  assert.match(output, /Количество станков ЧПУ: 30/);
});

test("no modules from outside the requested set are included in the email", () => {
  const output = buildQuoteText({ ...valid, moduleIds: ["warehouse"] }, modules);
  assert.ok(output.includes("1. Управление Складом"));
  assert.ok(!output.includes("Управление производством"));
});
