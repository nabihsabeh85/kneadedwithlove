type WatercolorBackgroundProps = {
  className?: string;
};

export function WatercolorBackground({ className = "" }: WatercolorBackgroundProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-soft-blue/25 blur-3xl" />
      <div className="absolute top-1/4 -right-16 h-80 w-80 rounded-full bg-lavender/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-light-lavender/50 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-soft-blue/15 blur-2xl" />
    </div>
  );
}
