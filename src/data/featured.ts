export type FeaturedProduct = {
  name: string;
  description: string;
  price: string;
  imageAlt: string;
};

export const featuredProducts: FeaturedProduct[] = [
  {
    name: "Classic Sourdough",
    description:
      "Our signature loaf — slow-fermented, crusty outside, tender and tangy within.",
    price: "Starting at $10",
    imageAlt: "Featured classic sourdough loaf",
  },
  {
    name: "Cinnamon Rolls",
    description:
      "Soft spirals with brown butter cinnamon filling and a sweet glaze on top.",
    price: "Starting at $12",
    imageAlt: "Featured cinnamon rolls",
  },
  {
    name: "Custom Treat Box",
    description:
      "A handpicked mix of cookies, muffins, and seasonal favorites — made to gift.",
    price: "Starting at $28",
    imageAlt: "Featured custom treat box",
  },
];
