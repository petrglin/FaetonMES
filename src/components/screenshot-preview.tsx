"use client";

import { Dialog } from "@base-ui/react/dialog";
import Image from "next/image";

type ScreenshotPreviewProps = {
  src: string;
  width: number;
  height: number;
  caption: string;
  alt?: string;
  sizes: string;
  preload?: boolean;
  fullScreen?: boolean;
  triggerTabIndex?: number;
};

export function ScreenshotPreview({ src, width, height, caption, alt = caption, sizes, preload, fullScreen, triggerTabIndex }: ScreenshotPreviewProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="screenshot-preview-trigger" tabIndex={triggerTabIndex} aria-label={`${caption} — увеличить`}>
        <Image src={src} width={width} height={height} alt={alt} sizes={sizes} preload={preload} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="demo-backdrop" />
        <Dialog.Viewport className="demo-viewport screenshot-preview-viewport" data-full-screen={fullScreen || undefined}>
          <Dialog.Popup className="screenshot-preview-popup">
            <Dialog.Title className="sr-only">{caption}</Dialog.Title>
            <Dialog.Close className="screenshot-preview-close" aria-label="Закрыть изображение">×</Dialog.Close>
            <Image className="screenshot-preview-image" src={src} width={width} height={height} alt={alt} unoptimized />
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
