import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { embeddedFactoryHtml, factorySourceDirectory, readFactoryAsset } from "../src/lib/factory-source.mjs";

test("development reads the shared source; production uses the portable snapshot", () => {
  const cwd = "/project";
  const env = { NODE_ENV: "development", FACTORY_DEMO_SOURCE_DIR: "/original/factory" };
  assert.equal(factorySourceDirectory(env, cwd), "/original/factory");
  assert.equal(factorySourceDirectory({ ...env, NODE_ENV: "production" }, cwd), "/project/vendor/factory-demo");
  assert.equal(factorySourceDirectory({}, cwd), "/project/vendor/factory-demo");
});

test("source edits are read immediately and unrelated files cannot be served", async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), "factory-source-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "resources"));
  await writeFile(path.join(root, "factory-demo.html"), "first version");
  await writeFile(path.join(root, "resources/factory-locales.js"), "window.locales = {};");
  assert.equal((await readFactoryAsset(["factory-demo.html"], root)).body.toString(), "first version");
  await writeFile(path.join(root, "factory-demo.html"), "updated version");
  assert.equal((await readFactoryAsset(["factory-demo.html"], root)).body.toString(), "updated version");
  assert.equal((await readFactoryAsset(["resources", "factory-locales.js"], root)).contentType, "text/javascript; charset=utf-8");
  for (const parts of [["..", "secret.js"], ["resources", "../secret.js"], ["resources", "a\\b.js"], ["resources", ".env"], ["secret.js"], ["resources", "file.py"]]) {
    assert.equal(await readFactoryAsset(parts, root), null);
  }
  const other = await mkdtemp(path.join(os.tmpdir(), "factory-outside-"));
  t.after(() => rm(other, { recursive: true, force: true }));
  await writeFile(path.join(other, "private.js"), "private");
  await symlink(path.join(other, "private.js"), path.join(root, "resources/escape.js"));
  assert.equal(await readFactoryAsset(["resources", "escape.js"], root), null);
});

test("embedding changes only the shell, retaining factory scripts and sandbox", () => {
  const original = '<head><title>Factory</title></head><body><iframe sandbox="allow-scripts allow-modals"></iframe><script>runFactory()</script></body>';
  const embedded = embeddedFactoryHtml(original);
  assert.ok(embedded.includes("height: 100dvh !important"));
  assert.equal(embedded.replace(/<style id="faeton-website-embed">[\s\S]*?<\/style>/, ""), original);
});
