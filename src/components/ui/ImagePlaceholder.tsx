type ImagePlaceholderProps = {
  alt: string;
  label?: string;
  className?: string;
};

export function ImagePlaceholder({
  alt,
  label,
  className = "",
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-light-lavender via-soft-blue/20 to-lavender/20 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(125,175,232,0.35),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(155,106,205,0.25),transparent_50%)]" />
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
