export type FeaturedProduct = {
  name: string;
  description: string;
  price: string;
  imageAlt: string;
};

export const featuredProducts: FeaturedProduct[] = [
  {
    name: "Classic Country",
    description:
      "Our signature loaf — organic flour, water, kosher salt, and live starter.",
    price: "$12",
    imageAlt: "Featured classic country sourdough loaf",
  },
  {
    name: "Za'atar",
    description: "Wild thyme, sesame, and sumac in a fragrant, savory loaf.",
    price: "$16",
    imageAlt: "Featured za'atar sourdough loaf",
  },
  {
    name: "Dark Chocolate Chip Sourdough Cookies",
    description: "Four soft sourdough cookies packed with dark chocolate.",
    price: "4 for $10",
    imageAlt: "Featured dark chocolate chip sourdough cookies",
  },
];
