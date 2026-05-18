import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
  children: ReactNode;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-deep-blue text-white hover:bg-deep-blue/90 shadow-soft hover:shadow-lg",
  secondary:
    "bg-lavender text-white hover:bg-lavender/90 shadow-soft hover:shadow-lg",
  outline:
    "border-2 border-deep-blue/20 bg-white/70 text-deep-blue hover:border-lavender hover:bg-light-lavender/40",
};

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-blue sm:px-7 sm:text-base ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = props;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
