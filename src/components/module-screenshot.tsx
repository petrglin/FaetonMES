import { ScreenshotPreview } from "@/components/screenshot-preview";

export function ModuleScreenshot({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className="module-screenshot">
      <div className="module-screenshot-label">Иллюстрация интерфейса · заглушка</div>
      <ScreenshotPreview src={src} caption={caption} width={960} height={600} sizes="(max-width: 899px) 100vw, 60vw" />
      <figcaption>{caption}. Схематичная иллюстрация; реальный скриншот будет добавлен позже.</figcaption>
    </figure>
  );
}
