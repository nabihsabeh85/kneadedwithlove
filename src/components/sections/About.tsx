import { productImageSrc } from "../../constants";
import { SectionHeading } from "../ui/SectionHeading";

const ingredients = ["Organic flour", "Water", "Kosher salt", "A live starter"];

export function About() {
  return (
    <section id="about" className="section-padding bg-white/40" aria-labelledby="about-heading">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            headingId="about-heading"
            eyebrow="About"
            title="Hi, I'm Veronica."
            subtitle="I'm a wife, a mom of three, and a teacher, and this bakery started in my own kitchen because of a question I couldn't stop asking."
            align="left"
          />
          <div className="space-y-4 font-body text-base leading-relaxed text-warm-gray/90 sm:text-lg">
            <p>
              Every time our family traveled overseas, we ate bread with every meal
              and felt fine. Nobody was bloated. Nobody felt heavy afterward. Back
              home, the same bread on the same table left us uncomfortable. The
              difference bothered me enough to go looking for an answer.
            </p>
            <p>
              What I found changed how I feed my family. Most bread on grocery
              shelves is made fast, with preservatives, dough conditioners, and a
              list of ingredients I couldn't pronounce, let alone explain to my
              kids. None of those things are there to nourish anyone. They're there
              so bread survives weeks on a shelf.
            </p>
            <p>
              Everything I read pointed toward sourdough. The long, slow
              fermentation breaks down gluten and phytic acid, which is why so many
              people who react to regular bread have an easier time with sourdough.
              Fermentation lowers the glycemic impact, so blood sugar doesn't spike
              the way store bread makes happen. And the process unlocks nutrients
              already in the flour so your body absorbs more of them.
            </p>
            <p>
              Then there's the part I love most. Real sourdough needs four things.
              Nothing else. No preservatives, no conditioners, no fillers. Four
              ingredients and time.
            </p>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ingredients.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-light-lavender/70 bg-cream px-3 py-3 text-center font-body text-sm font-semibold text-deep-blue"
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-warm-gray/90 sm:text-lg">
            <p>
              So I started baking. First for my husband and our three kids, at my
              own counter, testing loaves until I had one I felt good putting on
              our table. Then friends started asking. Then their friends.
            </p>
            <p>
              Kneaded with Love grew out of that. Every loaf is still made by hand
              in small batches, in the same kitchen where I started, with the same
              four ingredients I trust enough to feed my own family.
            </p>
            <p>I'd love to bake for your family too.</p>
          </div>
        </div>
        <div className="relative lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-[2.5rem] bg-cream shadow-card">
            <img
              src={productImageSrc("veronica.jpg")}
              alt="Veronica holding a freshly baked sourdough loaf in her kitchen"
              width={768}
              height={1024}
              loading="lazy"
              decoding="async"
              className="aspect-[3/4] h-full w-full object-cover object-top"
            />
          </div>
          <p className="absolute right-5 bottom-5 rounded-full bg-white/95 px-4 py-2 font-body text-xs font-bold tracking-wide text-deep-blue uppercase shadow-soft">
            Four ingredients · Time
          </p>
        </div>
      </div>
    </section>
  );
}
