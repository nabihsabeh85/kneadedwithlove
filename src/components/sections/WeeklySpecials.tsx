import { weeklySpecials } from "../../data/gallery";
import { SectionHeading } from "../ui/SectionHeading";

export function WeeklySpecials() {
  return (
    <section
      id="specials"
      className="section-padding"
      aria-labelledby="specials-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="This week"
          headingId="specials-heading"
          title="Weekly Specials"
          subtitle="Small-batch flavors that change often — follow along so you don't miss out."
        />

        <ul className="grid gap-6 md:grid-cols-2">
          {weeklySpecials.map((special) => (
            <li
              key={special.name}
              className="flex flex-col justify-between rounded-3xl border border-soft-blue/30 bg-gradient-to-br from-soft-blue/10 via-white to-light-lavender/40 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 sm:p-8"
            >
              <div>
                <span className="inline-block rounded-full bg-lavender/15 px-3 py-1 font-body text-xs font-bold tracking-wide text-lavender uppercase">
                  Limited batch
                </span>
                <h3 className="mt-4 font-body text-xl font-bold text-deep-blue">{special.name}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-warm-gray/85">
                  {special.description}
                </p>
              </div>
              <p className="mt-6 font-display text-3xl text-deep-blue">{special.price}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
