"use client";

import { useEffect, useRef, useState } from "react";
import { ScreenshotPreview } from "@/components/screenshot-preview";

export type DesignGalleryImage = {
  src: string;
  width: number;
  height: number;
  caption: string;
};

const pixelsPerSecond = 32;

function cycleWidth(track: HTMLUListElement) {
  const first = track.firstElementChild;
  const repeat = track.querySelector("[data-gallery-repeat]");
  return first && repeat ? repeat.getBoundingClientRect().left - first.getBoundingClientRect().left : 0;
}

function moveGallery(track: HTMLUListElement, direction: 1 | -1) {
  const first = track.firstElementChild;
  const next = first?.nextElementSibling;
  if (!first || !next) return;

  const cycle = cycleWidth(track);
  const step = next.getBoundingClientRect().left - first.getBoundingClientRect().left;
  if (cycle && direction === -1 && track.scrollLeft <= 1) track.scrollLeft = cycle;
  if (cycle && track.scrollLeft >= cycle && direction === 1) track.scrollLeft -= cycle;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  track.scrollTo({ left: track.scrollLeft + direction * step, behavior: reducedMotion ? "instant" : "smooth" });
}

export function DesignGallery({ images }: { images: readonly DesignGalleryImage[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const manualUntil = useRef(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || paused || images.length < 2) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let lastTime = 0;
    let fraction = 0;
    let cycle = 0;
    let inView = false;

    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; });
    observer.observe(track);
    const resize = new ResizeObserver(() => { cycle = cycleWidth(track); });
    resize.observe(track);
    cycle = cycleWidth(track);

    const scroll = (time: number) => {
      const elapsed = lastTime ? Math.min(time - lastTime, 50) : 0;
      lastTime = time;

      if (
        cycle && inView && !document.hidden && !reducedMotion.matches && time >= manualUntil.current
        && !track.matches(":hover, :focus-within") && !track.querySelector('[aria-expanded="true"]')
      ) {
        // Native scrolling rounds fractional pixels, so carry them into the next frame.
        fraction += elapsed * pixelsPerSecond / 1000;
        const pixels = Math.floor(fraction);
        if (pixels) {
          const position = track.scrollLeft + pixels;
          track.scrollLeft = position >= cycle ? position % cycle : position;
          fraction -= pixels;
        }
      }
      frame = requestAnimationFrame(scroll);
    };

    frame = requestAnimationFrame(scroll);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
    };
  }, [images.length, paused]);

  function step(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    manualUntil.current = performance.now() + 700;
    moveGallery(track, direction);
  }

  return (
    <section className="crm-section design-gallery" aria-labelledby="design-gallery-heading">
      <div className="design-gallery-header">
        <h2 id="design-gallery-heading">Галерея визуализаций</h2>
        {images.length > 1 && (
          <div className="design-gallery-controls" role="group" aria-label="Управление галереей">
            <button type="button" onClick={() => setPaused(value => !value)}>
              {paused ? "Продолжить прокрутку" : "Остановить прокрутку"}
            </button>
            <button type="button" aria-label="Предыдущее изображение" onClick={() => step(-1)}>←</button>
            <button type="button" aria-label="Следующее изображение" onClick={() => step(1)}>→</button>
          </div>
        )}
      </div>
      {images.length ? (
        <ul
          className="design-gallery-track"
          ref={trackRef}
          onPointerDown={() => { manualUntil.current = performance.now() + 900; }}
          onPointerUp={() => { manualUntil.current = performance.now() + 900; }}
        >
          {images.map(image => (
            <li key={image.src}>
              <ScreenshotPreview {...image} sizes="(max-width: 560px) 54vw, 294px" fullScreen />
            </li>
          ))}
          {images.length > 1 && images.map((image, index) => (
            <li key={`repeat-${image.src}`} aria-hidden="true" data-gallery-repeat={index === 0 || undefined}>
              <ScreenshotPreview {...image} sizes="(max-width: 560px) 54vw, 294px" triggerTabIndex={-1} fullScreen />
            </li>
          ))}
        </ul>
      ) : (
        <p className="design-gallery-empty">Здесь появятся примеры интерьеров и визуализаций, созданных в Design.</p>
      )}
    </section>
  );
}
