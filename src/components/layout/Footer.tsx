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

          <div className="flex flex-col items-center gap-4 sm:items-end">
            <div className="flex gap-3">
              <SocialIcon label="Instagram" href={BRAND.instagram}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.3.5.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.4.4 1.1.5 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.5 2.3-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.4.2-1.1.4-2.3.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.3-.5-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.4-.4-1.1-.5-2.3-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-1.9.5-2.3.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .4-.2 1.1-.4 2.3-.5 1.3-.1 1.7-.1 4.9-.1zm0-2.2C8.7 0 8.3 0 7 0 5.7.1 4.7.3 3.9.6 3 .9 2.2 1.4 1.4 2.2.6 3 .1 3.8-.2 4.7-.5 5.5-.8 6.5-1 7.8-1 9.1-1.2 10.5-1.2 11.9-1.2 15.3v.1c0 3.4 0 3.8.1 5.1.1 1.3.3 2.3.6 3.1.3.9.8 1.7 1.6 2.5.8.8 1.6 1.3 2.5 1.6.8.3 1.8.5 3.1.6 1.3.1 1.7.1 5.1.1s3.8 0 5.1-.1c1.3-.1 2.3-.3 3.1-.6.9-.3 1.7-.8 2.5-1.6.8-.8 1.3-1.6 1.6-2.5.3-.8.5-1.8.6-3.1.1-1.3.1-1.7.1-5.1s0-3.8-.1-5.1c-.1-1.3-.3-2.3-.6-3.1-.3-.9-.8-1.7-1.6-2.5-.8-.8-1.6-1.3-2.5-1.6-.8-.3-1.8-.5-3.1-.6C15.7 0 15.3 0 12 0z" />
                  <path d="M12 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.5a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="Facebook" href={BRAND.facebook}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M24 12.1c0-6.6-5.4-12-12-12S0 5.5 0 12.1c0 6 4.4 11 10.1 11.9v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.8v2.2h3.4l-.5 3.5h-2.9v8.4C19.6 23.1 24 18.1 24 12.1z" />
                </svg>
              </SocialIcon>
            </div>
            <p className="font-body text-sm text-warm-gray/80">
              © {year} {BRAND.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
