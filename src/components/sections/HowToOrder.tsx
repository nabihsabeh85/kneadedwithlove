import { SectionHeading } from "../ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Browse the menu",
    description: "Pick your favorites from sourdough, sweet bakes, and seasonal specials.",
  },
  {
    number: "02",
    title: "Send us your order request",
    description: "Fill out the form below or message us on Instagram with what you'd like.",
  },
  {
    number: "03",
    title: "Confirm pickup date and time",
    description: "We'll confirm availability and your West Boca pickup window.",
  },
  {
    number: "04",
    title: "Enjoy fresh homemade bakes",
    description: "Pick up warm, beautiful bakes made just for you and your family.",
  },
];

export function HowToOrder() {
  return (
    <section
      id="order"
      className="section-padding bg-gradient-to-b from-light-lavender/30 to-cream"
      aria-labelledby="order-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Simple & personal"
          headingId="order-heading"
          title="How to Order"
          subtitle="Ordering is easy — we're a small home bakery, so every order gets personal attention."
        />

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.number}
              className="card-surface flex flex-col p-6 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="font-display text-4xl text-soft-blue">{step.number}</span>
              <h3 className="mt-3 font-body text-lg font-bold text-deep-blue">{step.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-warm-gray/85">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-10 rounded-2xl border border-lavender/30 bg-white/70 px-6 py-4 text-center font-body text-sm leading-relaxed text-deep-blue sm:text-base">
          <strong className="font-bold">Please note:</strong> Orders are made fresh, so please
          allow at least <strong>24–48 hours</strong> when possible.
        </p>
      </div>
    </section>
  );
}
