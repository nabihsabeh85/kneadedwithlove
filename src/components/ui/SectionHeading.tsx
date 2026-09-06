type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  headingId?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  headingId,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-10 max-w-2xl sm:mb-12 ${alignClass}`}>
      {eyebrow && (
        <p className="mb-3 font-body text-xs font-bold tracking-[0.2em] text-lavender uppercase sm:text-sm">
          {eyebrow}
        </p>
      )}
      <h2
        id={headingId}
        className="font-display text-4xl font-bold leading-none tracking-[-0.025em] text-deep-blue sm:text-5xl lg:text-6xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 font-body text-base leading-relaxed text-warm-gray/90 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
