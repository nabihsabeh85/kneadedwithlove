import { PICKUP_DAYS_SENTENCE } from "../../constants";
import { menuCategories } from "../../data/menu";
import { addItemToOrder } from "../../lib/orderSelection";
import { SectionHeading } from "../ui/SectionHeading";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";
import { Button } from "../ui/Button";

export function Menu() {
  return (
    <section id="menu" className="section-padding" aria-labelledby="menu-heading">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Fresh from the oven"
          headingId="menu-heading"
          title="Choose your favorite"
          subtitle={`Pre-order only. Pickup ${PICKUP_DAYS_SENTENCE} — exact address sent after your order is confirmed.`}
        />

        <div className="space-y-16">
          {menuCategories.map((category) => (
            <div key={category.id}>
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-deep-blue/10 pb-3">
                <h3 className="font-display text-3xl font-bold text-deep-blue sm:text-4xl">
                  {category.title}
                </h3>
                <span className="font-body text-xs font-bold tracking-wide text-lavender uppercase">
                  {category.items.length} choices
                </span>
              </div>
              <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                {category.items.map((item) => (
                  <li
                    key={item.name}
                    className="card-surface group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <ImagePlaceholder
                      alt={item.imageAlt}
                      src={item.imageSrc}
                      label={category.title}
                      className="rounded-none rounded-t-3xl"
                    />
                    <div className="flex flex-1 flex-col p-4 sm:p-6">
                      <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-4">
                        <h4 className="font-body text-base font-bold leading-tight text-deep-blue sm:text-lg">
                          {item.name}
                        </h4>
                        <p className="shrink-0 rounded-full bg-light-lavender/60 px-3 py-1 font-body text-sm font-bold text-lavender">
                          {item.price}
                        </p>
                      </div>
                      <p className="mt-2 flex-1 font-body text-xs leading-relaxed text-warm-gray/85 sm:text-sm">
                        {item.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => addItemToOrder(item.name)}
                        className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full border border-deep-blue/20 px-3 py-2 font-body text-xs font-bold text-deep-blue transition-colors hover:border-lavender hover:bg-light-lavender/40 sm:text-sm"
                        aria-label={`Add ${item.name} to your order`}
                      >
                        Add to order
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl bg-deep-blue px-6 py-7 text-center text-white sm:flex-row sm:px-8 sm:text-left">
          <div>
            <p className="font-display text-2xl font-bold sm:text-3xl">Know what sounds good?</p>
            <p className="mt-1 text-sm text-white/80">Build your order below—we’ll confirm it within 6 hours.</p>
          </div>
          <Button href="#contact" variant="light" className="shrink-0">
            Build My Order
          </Button>
        </div>
      </div>
    </section>
  );
}
