import { SectionHeading } from "../ui/SectionHeading";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";

export function About() {
  return (
    <section id="about" className="section-padding bg-white/40" aria-labelledby="about-heading">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            headingId="about-heading"
            title="About Kneaded with Love"
            subtitle="A home kitchen filled with warmth, patience, and the smell of fresh bread."
            align="left"
          />
          <p className="font-body text-base leading-relaxed text-warm-gray/90 sm:text-lg">
            Kneaded with Love is a home-based bakery created with a passion for
            fresh, comforting, homemade baked goods. From naturally leavened
            sourdough to sweet treats, every item is made in small batches with
            care, patience, and love.
          </p>
          <p className="mt-4 font-body text-base leading-relaxed text-warm-gray/90 sm:text-lg">
            As a mom and wife baking from home, I pour the same love into every
            loaf and tray that I do for my own family — so your table feels just
            as cared for.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Small batches", "Made to order", "Local pickup"].map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-light-lavender/70 bg-cream px-4 py-3 text-center font-body text-sm font-semibold text-deep-blue"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <ImagePlaceholder
          alt="Warm home bakery kitchen scene"
          label="Our kitchen"
          className="aspect-square rounded-3xl lg:aspect-[4/5]"
        />
      </div>
    </section>
  );
}
