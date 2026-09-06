import { BRAND, PICKUP_DAYS_LABEL, PICKUP_DAYS_SENTENCE } from "../../constants";
import { SectionHeading } from "../ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Build your order",
    description: "Choose your loaves and cookies in the order form below.",
  },
  {
    number: "02",
    title: "We confirm the details",
    description: `We’ll reply within 6 hours to confirm your ${PICKUP_DAYS_LABEL} pickup.`,
  },
  {
    number: "03",
    title: "Pick up & enjoy",
    description: `We’ll send the ${BRAND.location} address. Pay by Zelle, Venmo, or at pickup.`,
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

        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="card-surface relative flex flex-col p-7"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-light-lavender font-body text-sm font-bold text-lavender">
                {step.number}
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-deep-blue">{step.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-warm-gray/85">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-10 rounded-2xl border border-lavender/30 bg-white/70 px-6 py-4 text-center font-body text-sm leading-relaxed text-deep-blue sm:text-base">
          <strong className="font-bold">Pre-order only.</strong> Pickup days are{" "}
          <strong>{PICKUP_DAYS_SENTENCE}</strong>. Exact pickup address sent after your order is
          confirmed. Pay with <strong>Zelle</strong>, <strong>Venmo</strong>, or at pickup.
          Please allow at least <strong>24–48 hours</strong> when possible.
        </p>
        <p className="mt-4 text-center font-body text-xs leading-relaxed text-warm-gray/75">
          {BRAND.cottageFoodNote}
        </p>
      </div>
    </section>
  );
}
