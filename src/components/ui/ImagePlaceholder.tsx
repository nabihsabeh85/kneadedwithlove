type ImagePlaceholderProps = {
  alt: string;
  label?: string;
  src?: string;
  className?: string;
};

/**
 * Square frame keeps every bake the same size across the site. Product photos
 * carry the brand caption near the bottom edge, so they are never cropped.
 */
const FRAME = "relative aspect-square overflow-hidden rounded-2xl";

export function ImagePlaceholder({
  alt,
  label,
  src,
  className = "",
}: ImagePlaceholderProps) {
  if (src) {
    return (
      <div className={`${FRAME} bg-cream ${className}`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`${FRAME} flex items-center justify-center bg-gradient-to-br from-light-lavender via-soft-blue/20 to-lavender/20 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(142,166,221,0.35),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(123,78,166,0.25),transparent_50%)]" />
      <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
        <span className="text-3xl opacity-70" aria-hidden>
          🥖
        </span>
        {label && (
          <span className="font-body text-xs font-semibold tracking-wide text-deep-blue/70 uppercase">
            {label}
          </span>
        )}
        <span className="sr-only">{alt}</span>
      </div>
    </div>
  );
}
