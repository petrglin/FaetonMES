import { ScreenshotPreview } from "@/components/screenshot-preview";
import { easyOrderScreenshots } from "@/lib/easyorder";

export function CrmScreenshot({ name, caption, priority = false }: { name: keyof typeof easyOrderScreenshots; caption: string; priority?: boolean }) {
  const screenshot = easyOrderScreenshots[name];
  return (
    <figure className="crm-screenshot">
      <ScreenshotPreview
        {...screenshot}
        caption={caption}
        sizes={priority ? "(max-width: 1279px) 100vw, 1224px" : "(max-width: 767px) 100vw, 50vw"}
        preload={priority}
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
