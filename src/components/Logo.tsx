import { useState } from "react";
import { BRAND, LOGO_SRC } from "../constants";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: "h-12 w-12",
  md: "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]",
  lg: "h-24 w-24 sm:h-28 sm:w-28",
  xl: "h-44 w-44 sm:h-52 sm:w-52 lg:h-60 lg:w-60",
};

function LogoFallback({ size }: { size: LogoProps["size"] }) {
  return (
    <div
      className={`${sizes[size ?? "md"]} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-soft-blue/40 via-light-lavender to-lavender/30 font-display text-lg text-deep-blue shadow-soft ring-2 ring-light-lavender/80 sm:text-xl`}
      aria-hidden
    >
      ♥
    </div>
  );
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <a
      href="#home"
      className={`group inline-flex shrink-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-blue ${className}`}
      aria-label={`${BRAND.name} — back to home`}
    >
      {imageError ? (
        <LogoFallback size={size} />
      ) : (
        <img
          src={LOGO_SRC}
          alt={`${BRAND.name} — homemade sourdough and baked goods`}
          width={240}
          height={240}
          onError={() => setImageError(true)}
          className={`${sizes[size]} rounded-full object-contain shadow-soft transition-transform duration-300 group-hover:scale-[1.02]`}
        />
      )}
    </a>
  );
}
