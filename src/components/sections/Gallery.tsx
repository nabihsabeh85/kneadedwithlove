import { galleryItems } from "../../data/gallery";
import { SectionHeading } from "../ui/SectionHeading";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";

export function Gallery() {
  return (
    <section
      id="gallery"
      className="section-padding bg-light-lavender/20"
      aria-labelledby="gallery-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="@kneadedwithlove"
          headingId="gallery-heading"
          title="From Our Kitchen"
          subtitle="A peek at recent bakes — swap these placeholders with your own Instagram photos anytime."
        />

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {galleryItems.map((item, index) => (
            <li
              key={item.alt}
              className={`overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.02] ${
                index === 0 ? "col-span-2 row-span-2 md:col-span-1 md:row-span-1" : ""
              }`}
            >
              <ImagePlaceholder
                alt={item.alt}
                label={item.label}
                className={`aspect-square ${index === 0 ? "md:aspect-[4/5]" : ""}`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
