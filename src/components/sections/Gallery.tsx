import { BRAND } from "../../constants";
import { Logo } from "../Logo";

/** Keeps the original #gallery anchor so older links still land somewhere useful */
export function Gallery() {
  return (
    <section
      id="gallery"
      className="section-padding bg-light-lavender/20"
      aria-labelledby="follow-heading"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl border border-light-lavender/70 bg-white px-6 py-10 text-center shadow-card sm:px-10 sm:py-12">
        <Logo size="lg" />

        <div>
          <p className="font-body text-xs font-bold tracking-[0.2em] text-lavender uppercase sm:text-sm">
            Follow along
          </p>
          <h2
            id="follow-heading"
            className="mt-3 font-display text-4xl font-bold leading-none tracking-[-0.025em] text-deep-blue sm:text-5xl"
          >
            See what&apos;s baking this week
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-warm-gray/90 sm:text-lg">
            New loaves, seasonal flavors, and pickup-day reminders go up on
            Instagram and Facebook first.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-lavender px-6 py-3 font-body text-sm font-bold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-lavender/90 sm:text-base"
          >
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
            {BRAND.instagramHandle}
          </a>
          <a
            href={BRAND.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-deep-blue/20 bg-white px-6 py-3 font-body text-sm font-bold text-deep-blue transition-all duration-300 hover:border-lavender hover:bg-light-lavender/40 sm:text-base"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
            </svg>
            Facebook
          </a>
        </div>
      </div>
    </section>
  );
}
