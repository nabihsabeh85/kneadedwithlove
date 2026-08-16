export const BRAND = {
  name: "Kneaded with Love",
  tagline: "Homemade sourdough & baked goods",
  email: "hello@kneadedwithlove.com",
  phone: "(561) 325-8390",
  phoneTel: "5613258390",
  location: "West Boca Raton",
  pickupNote:
    "Pre-order only. Exact pickup address sent after your order is confirmed.",
  cottageFoodNote:
    "Made in a cottage food operation that is not subject to Florida’s food safety regulations.",
  instagramHandle: "@kneadedwithlovefl",
  instagram: "https://instagram.com/kneadedwithlovefl",
  website: "https://kneadedwithlove.com",
} as const;

export const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#order", label: "How to Order" },
  { href: "#contact", label: "Contact" },
] as const;

/** Brand logo at public/images/logo.png */
export const LOGO_SRC = `${import.meta.env.BASE_URL}images/logo.png`;
