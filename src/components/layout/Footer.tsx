import type { ReactNode } from "react";
import { BRAND } from "../../constants";
import { Logo } from "../Logo";

function SocialIcon({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-light-lavender bg-white/80 text-deep-blue transition-all hover:border-lavender hover:bg-light-lavender/50 hover:text-lavender"
    >
      {children}
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-light-lavender/80 bg-white/50">
      <div className="section-padding mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Logo size="lg" />
            <p className="max-w-xs font-body text-sm text-warm-gray/90">
              {BRAND.tagline}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-end">
            <div className="flex items-center gap-2">
              <SocialIcon label="Instagram" href={BRAND.instagram}>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </SocialIcon>
              <SocialIcon label="Facebook" href={BRAND.facebook}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v8h4v-8h3.1l.9-4H13V9c0-.6.4-1 1-1Z" />
                </svg>
              </SocialIcon>
            </div>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-lavender hover:text-deep-blue"
            >
              {BRAND.instagramHandle}
            </a>
            <a
              href={`tel:${BRAND.phoneTel}`}
              className="font-body text-sm text-warm-gray/80 hover:text-deep-blue"
            >
              {BRAND.phone}
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="font-body text-sm text-warm-gray/80 hover:text-deep-blue"
            >
              {BRAND.email}
            </a>
            <p className="max-w-xs font-body text-xs leading-relaxed text-warm-gray/70 sm:text-right">
              {BRAND.cottageFoodNote}
            </p>
            <p className="font-body text-sm text-warm-gray/80">
              © {year} {BRAND.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
