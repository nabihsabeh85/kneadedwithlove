import { menuCategories } from "../../data/menu";
import { SectionHeading } from "../ui/SectionHeading";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";

export function Menu() {
  return (
    <section id="menu" className="section-padding" aria-labelledby="menu-heading">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Our Bakes"
          headingId="menu-heading"
          title="Menu"
          subtitle="Fresh flavors rotating with the season — message us for today's availability."
        />

        <div className="space-y-14">
          {menuCategories.map((category) => (
            <div key={category.id}>
              <h3 className="mb-6 font-display text-3xl text-lavender sm:text-4xl">
                {category.title}
              </h3>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                {category.items.map((item) => (
                  <li
                    key={item.name}
                    className="card-surface group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <ImagePlaceholder
                      alt={item.imageAlt}
                      label={category.title}
                      className="aspect-[16/10] rounded-none rounded-t-3xl"
                    />
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h4 className="font-body text-lg font-bold text-deep-blue">
                        {item.name}
                      </h4>
                      <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-warm-gray/85">
                        {item.description}
                      </p>
                      <p className="mt-4 font-body text-sm font-bold text-lavender">
                        {item.price}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
