import { testimonials } from "../../data/testimonials";
import { SectionHeading } from "../ui/SectionHeading";

export function Testimonials() {
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
        />

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
                <cite className="not-italic">
                  <span className="block font-body font-bold text-deep-blue">{item.name}</span>
                  <span className="font-body text-sm text-lavender">{item.detail}</span>
                </cite>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
