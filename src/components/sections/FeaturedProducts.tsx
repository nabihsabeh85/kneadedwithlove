import { featuredProducts } from "../../data/featured";
import { SectionHeading } from "../ui/SectionHeading";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";

export function FeaturedProducts() {
  return (
    <section
      id="featured"
      className="section-padding bg-white/40"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Customer favorites"
          headingId="featured-heading"
          title="Featured Bakes"
          subtitle="A few beloved staples — perfect for your first order."
        />

        <ul className="grid gap-8 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <li
              key={product.name}
              className="card-surface overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <ImagePlaceholder
                alt={product.imageAlt}
                label="Featured"
                className="aspect-[4/3] rounded-none rounded-t-3xl"
              />
              <div className="p-6">
                <h3 className="font-body text-xl font-bold text-deep-blue">{product.name}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-warm-gray/85">
                  {product.description}
                </p>
                <p className="mt-4 font-body text-sm font-bold text-lavender">{product.price}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
