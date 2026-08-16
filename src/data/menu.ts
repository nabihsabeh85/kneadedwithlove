export type MenuItem = {
  name: string;
  description: string;
  price: string;
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
        imageAlt: "Classic country sourdough loaf",
      },
      {
        name: "Za'atar",
        description: "Made with wild thyme, sesame, and sumac.",
        price: "$16",
        imageAlt: "Za'atar sourdough loaf",
      },
      {
        name: "Olive & Feta",
        description: "Made with feta, Kalamata olives, and oregano.",
        price: "$16",
        imageAlt: "Olive and feta sourdough loaf",
      },
      {
        name: "Everything Bagel",
        description: "Made with sesame, poppy, garlic, and onion.",
        price: "$15",
        imageAlt: "Everything bagel sourdough loaf",
      },
      {
        name: "Chocolate Chip",
        description: "Dark chocolate through a sour crumb.",
        price: "$15",
        imageAlt: "Chocolate chip sourdough loaf",
      },
      {
        name: "Nutella",
        description: "Nutella swirled through every slice.",
        price: "$16",
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
        imageAlt: "Dark chocolate chip sourdough cookies",
      },
      {
        name: "S'mores",
        description: "Four cookies per order — toasted marshmallow and chocolate vibes.",
        price: "4 for $10",
        imageAlt: "S'mores sourdough cookies",
      },
    ],
  },
];
