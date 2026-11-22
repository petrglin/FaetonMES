import { readFile, realpath } from "node:fs/promises";
import path from "node:path";

export const factoryEntry = "factory-demo.html";

/** @param {NodeJS.ProcessEnv} [env] @param {string} [cwd] */
export function factorySourceDirectory(env = process.env, cwd = process.cwd()) {
  // Production always uses the portable snapshot prepared before next build.
  if (env.NODE_ENV !== "production" && env.FACTORY_DEMO_SOURCE_DIR) {
    return path.resolve(cwd, env.FACTORY_DEMO_SOURCE_DIR);
  }
  return path.join(cwd, "vendor", "factory-demo");
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".tsv": "text/tab-separated-values; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};

/** @param {string[]} segments @param {string} [directory] */
export async function readFactoryAsset(segments, directory = factorySourceDirectory()) {
  if (!segments.length || segments.some(part => !part || part.startsWith(".") || /[\\/\0]/.test(part))) {
    return null;
  }
  const relative = segments.join("/");
  const extension = path.extname(relative).toLowerCase();
  const contentType = mimeTypes[/** @type {keyof typeof mimeTypes} */ (extension)];
  if (!contentType || (relative !== factoryEntry && segments[0] !== "resources")) return null;

  const root = await realpath(directory);
  const file = await realpath(path.join(root, ...segments));
  // Do not expose files outside the factory folder, including via symlinks.
  if (!file.startsWith(root + path.sep)) return null;
  return { body: await readFile(file), contentType };
}

/** @param {string} html */
export function embeddedFactoryHtml(html) {
  // The 3D scene loads asynchronously, so fit the camera once its geometry is available.
  const sceneReady = "init3D().then(()=&gt;{if(threeView){threeView.draw();overviewPoints=threeView.fitPoints(perspectiveView);refitOverview();threeView.draw();}});";
  const startInPerspective = `init3D().then(()=&gt;{
    if (!threeView) return;
    showPerspective();
    if (cameraFlight) advanceCamera(Infinity);
    threeView.draw();
    overviewPoints = threeView.fitPoints(true);
    refitOverview();
    threeView.draw();
    root.querySelector(&quot;#fl-rotate&quot;).click();
  });`;
  return html.replaceAll("Видеообзор мини-фабрики", "Видеообзор виртуальной фабрики")
    .replaceAll("Mini-factory video overview", "Virtual factory video overview")
    .replaceAll("Скоро здесь появится видеообзор мини-фабрики.", "Видеообзор виртуальной фабрики скоро появится.")
    .replaceAll("A video overview of the mini-factory will appear here soon.", "A virtual factory video overview will be available soon.")
    .replace(sceneReady, startInPerspective)
    .replace("</head>", `<style id="faeton-website-embed">
    :root { color-scheme: light; background: #f4f7fa; }
    html, body { width: 100%; height: 100%; padding: 0 !important; overflow: hidden; }
    #codex-visualization { width: 100%; height: 100dvh !important; margin: 0; border: 0; }
    @media (max-width: 600px) {
      #furniture-line .fl-toolbar { display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 6px !important; width: 100%; box-sizing: border-box; }
      #furniture-line .fl-brand-control { box-sizing: border-box; width: 100%; min-width: 0; min-height: 38px !important; padding: 6px 8px !important; font-size: clamp(12px, 3.4vw, 14px) !important; line-height: 1.1; justify-content: center; }
      #furniture-line .fl-control-content { gap: 4px; justify-content: center; white-space: nowrap; }
      #furniture-line .fl-control-icon { flex: 0 0 auto; }
    }
    @media (max-width: 360px) {
      #furniture-line .fl-toolbar { gap: 5px !important; }
      #furniture-line .fl-brand-control { min-height: 36px !important; padding-inline: 5px !important; font-size: 11px !important; }
    }
  </style></head>`);
}
