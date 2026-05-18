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
    id: "sourdough",
    title: "Sourdough",
    items: [
      {
        name: "Classic Sourdough Loaf",
        description: "Naturally leavened, golden crust, soft and tangy inside.",
        price: "Starting at $10",
        imageAlt: "Classic sourdough loaf",
      },
      {
        name: "Jalapeño Cheddar Sourdough",
        description: "A little heat, melty cheddar, and that perfect sourdough chew.",
        price: "Starting at $12",
        imageAlt: "Jalapeño cheddar sourdough",
      },
      {
        name: "Rosemary Garlic Sourdough",
        description: "Fragrant herbs and roasted garlic in every slice.",
        price: "Starting at $12",
        imageAlt: "Rosemary garlic sourdough",
      },
      {
        name: "Cinnamon Raisin Sourdough",
        description: "Warm cinnamon swirls with plump raisins — breakfast favorite.",
        price: "Starting at $11",
        imageAlt: "Cinnamon raisin sourdough",
      },
    ],
  },
  {
    id: "sweet-bakes",
    title: "Sweet Bakes",
    items: [
      {
        name: "Cookies",
        description: "Buttery, soft-centered cookies — flavors rotate weekly.",
        price: "Starting at $8",
        imageAlt: "Homemade cookies",
      },
      {
        name: "Muffins",
        description: "Fluffy bakery-style muffins baked fresh to order.",
        price: "Starting at $9",
        imageAlt: "Fresh muffins",
      },
      {
        name: "Banana Bread",
        description: "Moist, warmly spiced, and loaded with ripe banana flavor.",
        price: "Starting at $10",
        imageAlt: "Banana bread loaf",
      },
      {
        name: "Cinnamon Rolls",
        description: "Swirled, frosted, and impossibly cozy straight from the oven.",
        price: "Starting at $12",
        imageAlt: "Cinnamon rolls",
      },
    ],
  },
  {
    id: "seasonal",
    title: "Seasonal Specials",
    items: [
      {
        name: "Holiday Bakes",
        description: "Festive treats for gatherings — order early for the season.",
        price: "Starting at $14",
        imageAlt: "Holiday baked goods",
      },
      {
        name: "Limited Weekly Flavors",
        description: "Small-batch surprises — follow us for this week's pick.",
        price: "Starting at $9",
        imageAlt: "Weekly special bake",
      },
      {
        name: "Custom Treat Boxes",
        description: "Curated assortments for gifts, showers, and celebrations.",
        price: "Starting at $28",
        imageAlt: "Custom treat box",
      },
    ],
  },
];
