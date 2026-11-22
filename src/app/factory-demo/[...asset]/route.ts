import { embeddedFactoryHtml, factoryEntry, readFactoryAsset } from "@/lib/factory-source.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ asset: string[] }> }) {
  const { asset } = await context.params;
  try {
    const file = await readFactoryAsset(asset);
    if (!file) return new Response("Not found", { status: 404 });
    const embedded = asset.join("/") === factoryEntry && new URL(request.url).searchParams.get("embedded") === "1";
    const body = embedded ? embeddedFactoryHtml(file.body.toString("utf8")) : new Uint8Array(file.body);
    return new Response(body, {
      headers: {
        "Content-Type": file.contentType,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT" || code === "ENOTDIR") {
      return new Response("Factory asset not found", { status: 404 });
    }
    console.error("Unable to load virtual factory", code);
    return new Response("Factory temporarily unavailable", { status: 503 });
  }
}
