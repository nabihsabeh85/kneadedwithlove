export type MenuItem = {
  name: string;
  description: string;
  /** Display price shown on the menu */
  price: string;
  /** Price charged per unit selected in the order form */
  priceUsd: number;
  imageAlt: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  items: MenuItem[];
};

export const menuCategories: MenuCategory[] = [
  {
    id: "loaves",
    title: "Loaves",
    items: [
      {
        name: "Classic Country",
        description: "Made with organic flour, water, kosher salt, and live starter.",
        price: "$12",
        priceUsd: 12,
        imageAlt: "Classic country sourdough loaf",
      },
      {
        name: "Za'atar",
        description: "Made with wild thyme, sesame, and sumac.",
        price: "$16",
        priceUsd: 16,
        imageAlt: "Za'atar sourdough loaf",
      },
      {
        name: "Olive & Feta",
        description: "Made with feta, Kalamata olives, and oregano.",
        price: "$16",
        priceUsd: 16,
        imageAlt: "Olive and feta sourdough loaf",
      },
      {
        name: "Everything Bagel",
        description: "Made with sesame, poppy, garlic, and onion.",
        price: "$15",
        priceUsd: 15,
        imageAlt: "Everything bagel sourdough loaf",
      },
      {
        name: "Chocolate Chip",
        description: "Dark chocolate through a sour crumb.",
        price: "$15",
        priceUsd: 15,
        imageAlt: "Chocolate chip sourdough loaf",
      },
      {
        name: "Nutella",
        description: "Nutella swirled through every slice.",
        price: "$16",
        priceUsd: 16,
        imageAlt: "Nutella sourdough loaf",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    items: [
      {
        name: "Dark Chocolate Chip Sourdough",
        description: "Four cookies per order — rich dark chocolate in a sourdough cookie.",
        price: "4 for $10",
        priceUsd: 10,
        imageAlt: "Dark chocolate chip sourdough cookies",
      },
      {
        name: "S'mores",
        description: "Four cookies per order — toasted marshmallow and chocolate vibes.",
        price: "4 for $10",
        priceUsd: 10,
        imageAlt: "S'mores sourdough cookies",
      },
    ],
  },
];

/** Flat list of orderable items, used by the order form */
export const orderableItems = menuCategories.flatMap((category) =>
  category.items.map((item) => ({
    name: item.name,
    price: item.price,
    priceUsd: item.priceUsd,
    category: category.title,
  })),
);
