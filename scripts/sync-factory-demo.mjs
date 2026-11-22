import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const destination = path.resolve("vendor/factory-demo");
const source = process.env.FACTORY_DEMO_SOURCE_DIR
  ? path.resolve(process.env.FACTORY_DEMO_SOURCE_DIR)
  : destination;

// Validate first so a missing source cannot silently publish a stale snapshot.
const html = await readFile(path.join(source, "factory-demo.html"));
await readFile(path.join(source, "resources/factory-locales.js"));
if (source !== destination) {
  await mkdir(destination, { recursive: true });
  await cp(path.join(source, "resources"), path.join(destination, "resources"), { recursive: true });
  await writeFile(path.join(destination, "factory-demo.html"), html);
}
console.log("Virtual factory snapshot ready.");
