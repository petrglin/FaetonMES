import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import * as quote from "../src/lib/quote-request.ts";

const modules = [{ id: "production", title: "Управление производством" }];
const payload = { name: "Тест", company: "Компания", email: "test@example.com", phone: "", comment: "Комментарий", implementation: quote.implementationOptions[0], moduleIds: ["production"] };

function loadSource(path, dependencies, env = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  runInNewContext(code, {
    exports, Buffer, Response, URL,
    process: { env },
    console: { error() {} },
    require(name) {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  });
  return exports;
}

function route(sendQuoteRequest, configured = true) {
  return loadSource("../src/app/api/quote/route.ts", {
    "@/lib/modules": { systemModules: modules },
    "@/lib/quote-request": quote,
    "@/lib/quote-mail": { sendQuoteRequest, getQuoteMailConfig: () => configured ? {} : null },
  }).POST;
}

function request(body = payload, headers = {}) {
  return new Request("http://localhost/api/quote", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) });
}

test("API rejects invalid requests without attempting delivery", async () => {
  let attempts = 0;
  const post = route(async () => { attempts++; });
  for (const [req, status] of [
    [request({ ...payload, moduleIds: [] }), 400],
    [request({ ...payload, email: "invalid" }), 400],
    [request("not json"), 400],
    [request(payload, { "Content-Type": "text/plain" }), 415],
    [request(payload, { origin: "https://another.example" }), 403],
    [request("x".repeat(17000)), 413],
  ]) assert.equal((await post(req)).status, status);
  assert.equal(attempts, 0);
});

test("unconfigured or failing SMTP never produces a success response", async () => {
  const unconfigured = await route(async () => { throw new Error("must not send"); }, false)(request());
  assert.equal(unconfigured.status, 503);
  const failed = await route(async () => { throw new Error("mail server refused"); })(request());
  assert.equal(failed.status, 502);
  assert.ok(!(await failed.text()).includes("mail server refused"));
});

test("API waits for SMTP acknowledgement before returning success", async () => {
  let received;
  const response = await route(async (data) => { received = data; })(request());
  assert.equal(response.status, 200);
  assert.equal(received.email, payload.email);
  assert.deepEqual(Array.from(received.moduleIds), ["production"]);
});

test("mail uses configured sender, fixed recipient, reply-to and every request field", async () => {
  let transportOptions;
  let message;
  const mail = loadSource("../src/lib/quote-mail.ts", {
    nodemailer: { createTransport(options) { transportOptions = options; return { async sendMail(data) { message = data; return { accepted: [quote.quoteRecipient] }; } }; } },
    "@/lib/modules": { systemModules: modules },
    "@/lib/quote-request": quote,
  }, { SMTP_HOST: "smtp.example.com", SMTP_USER: "sender@example.com", SMTP_PASSWORD: "test-only", SMTP_PORT: "465" });
  await mail.sendQuoteRequest(payload, mail.getQuoteMailConfig());
  assert.equal(message.to, "olvenn@mail.ru");
  assert.equal(message.from.address, "sender@example.com");
  assert.equal(message.replyTo.address, "test@example.com");
  assert.ok(message.text.includes("Управление производством"));
  assert.ok(message.text.includes(payload.implementation));
  assert.ok(message.text.includes(payload.comment));
  assert.equal(transportOptions.secure, true);
  assert.equal(transportOptions.disableFileAccess, true);
});

test("mail rejects a refused recipient and requires TLS on port 587", async () => {
  let options;
  const mail = loadSource("../src/lib/quote-mail.ts", {
    nodemailer: { createTransport(value) { options = value; return { async sendMail() { return { accepted: [] }; } }; } },
    "@/lib/modules": { systemModules: modules }, "@/lib/quote-request": quote,
  }, { SMTP_HOST: "smtp.example.com", SMTP_USER: "sender@example.com", SMTP_PASSWORD: "test-only", SMTP_PORT: "587" });
  await assert.rejects(mail.sendQuoteRequest(payload, mail.getQuoteMailConfig()));
  assert.equal(options.secure, false);
  assert.equal(options.requireTLS, true);
});
