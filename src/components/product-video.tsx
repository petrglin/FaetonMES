type ProductVideoProps = {
  src: string;
  poster: string;
  title: string;
  caption: string;
  duration: string;
  muted?: boolean;
};

export function ProductVideo({ src, poster, title, caption, duration, muted = true }: ProductVideoProps) {
  return (
    <figure className="product-video">
      <video
        controls
        playsInline
        muted={muted}
        preload="none"
        poster={poster}
        width={1920}
        height={1080}
        aria-label={title}
      >
        <source src={src} type="video/mp4" />
        Ваш браузер не поддерживает встроенное видео. <a href={src} download>Скачать видео</a>.
      </video>
      <figcaption><span>{caption}</span><span className="product-video-duration">{duration}</span></figcaption>
    </figure>
  );
}
