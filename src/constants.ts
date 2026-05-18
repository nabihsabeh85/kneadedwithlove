export const BRAND = {
  name: "Kneaded with Love",
  tagline: "Homemade sourdough & baked goods",
  email: "hello@kneadedwithlove.com",
  phone: "(555) 123-4567",
  location: "West Boca / Local Pickup",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
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
