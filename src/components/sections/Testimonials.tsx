import { GOOGLE_REVIEWS } from "../../constants";
import { testimonials } from "../../data/testimonials";
import { SectionHeading } from "../ui/SectionHeading";
import { Button } from "../ui/Button";
import { Stars } from "../ui/Stars";

export function Testimonials() {
  const hasReviews = testimonials.length > 0;
  const hasGoogleLink = Boolean(
    GOOGLE_REVIEWS.profileUrl || GOOGLE_REVIEWS.writeReviewUrl,
  );

  // Nothing to show at all — better to drop the section than render an empty
  // heading.
  if (!hasReviews && !hasGoogleLink) return null;

  const googleLinks = (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      {GOOGLE_REVIEWS.profileUrl && (
        <Button href={GOOGLE_REVIEWS.profileUrl} variant="outline" external>
          Read all reviews on Google
        </Button>
      )}
      {GOOGLE_REVIEWS.writeReviewUrl && (
        <a
          href={GOOGLE_REVIEWS.writeReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-sm font-semibold text-lavender underline decoration-light-lavender decoration-2 underline-offset-4 hover:text-deep-blue"
        >
          Leave a review
        </a>
      )}
    </div>
  );

  return (
    <section
      id="testimonials"
      className="section-padding"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Kind words"
          headingId="testimonials-heading"
          title="What Customers Say"
          subtitle={
            hasReviews
              ? undefined
              : "Our reviews live on our Google Business Profile — read what customers are saying, or add your own."
          }
        />

        {hasReviews ? (
          <>
            <ul className="grid gap-6 md:grid-cols-3">
              {testimonials.map((item) => (
                <li
                  key={item.name}
                  className="card-surface flex flex-col p-6 sm:p-8"
                >
                  <p className="font-display text-5xl leading-none text-soft-blue/60" aria-hidden>
                    “
                  </p>
                  <blockquote className="mt-2 flex-1 font-body text-base leading-relaxed text-warm-gray/90 italic">
                    {item.quote}
                  </blockquote>
                  <footer className="mt-6 border-t border-light-lavender pt-4">
                    <Stars rating={item.rating} className="mb-2" />
                    <cite className="not-italic">
                      <span className="block font-body font-bold text-deep-blue">{item.name}</span>
                      <span className="font-body text-sm text-lavender">{item.detail}</span>
                    </cite>
                  </footer>
                </li>
              ))}
            </ul>
            {hasGoogleLink && <div className="mt-10 sm:mt-12">{googleLinks}</div>}
          </>
        ) : (
          <div className="card-surface mx-auto max-w-xl p-8 text-center sm:p-10">
            {googleLinks}
          </div>
        )}
      </div>
    </section>
  );
}
