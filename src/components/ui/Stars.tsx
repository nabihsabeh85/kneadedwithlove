const STAR_COUNT = 5;

type StarsProps = {
  /** Rating out of 5. Rounded to the nearest whole star. */
  rating: number;
  className?: string;
};

export function Stars({ rating, className = "" }: StarsProps) {
  const filled = Math.min(STAR_COUNT, Math.max(0, Math.round(rating)));

  return (
    <span
      role="img"
      aria-label={`${filled} out of ${STAR_COUNT} stars`}
      className={`inline-flex items-center gap-0.5 ${className}`}
    >
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <svg
          key={index}
          className={`h-4 w-4 ${index < filled ? "text-lavender" : "text-light-lavender"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2.5l2.94 5.96 6.56.96-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.09 1.12-6.54L2.5 9.42l6.56-.96L12 2.5Z" />
        </svg>
      ))}
    </span>
  );
}
