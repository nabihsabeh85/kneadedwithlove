/** Available local pickup days — change here to update the whole site */
export const PICKUP_DAYS = ["Thursday", "Sunday"] as const;

/** e.g. "Thursday or Sunday" */
export const PICKUP_DAYS_LABEL = PICKUP_DAYS.join(" or ");

/** e.g. "Thursday and Sunday" */
export const PICKUP_DAYS_SENTENCE = PICKUP_DAYS.join(" and ");

export const BRAND = {
  name: "Kneaded with Love",
  tagline: "Homemade sourdough & baked goods",
  email: "hello@kneadedwithlove.com",
  phone: "(917) 671-7674",
  phoneTel: "9176717674",
  location: "West Boca Raton",
  pickupNote: `Pre-order only. Pickup days are ${PICKUP_DAYS_SENTENCE}. Exact pickup address sent after your order is confirmed.`,
  cottageFoodNote:
    "Made in a cottage food operation that is not subject to Florida’s food safety regulations.",
  instagramHandle: "@kneadedwithlovefl",
  instagram: "https://instagram.com/kneadedwithlovefl",
  facebook: "https://www.facebook.com/profile.php?id=61593836247255",
  website: "https://kneadedwithlove.com",
  /** Order form notifications are sent here */
  orderEmail: "hello@kneadedwithlove.com",
} as const;

/**
 * Google Business Profile review links. Both are optional — while a value is
 * empty its button is hidden, so the Reviews section never links nowhere.
 *
 * The easiest way to fill these in is with the profile's Place ID:
 *   profileUrl:     https://search.google.com/local/reviews?placeid=PLACE_ID
 *   writeReviewUrl: https://search.google.com/local/writereview?placeid=PLACE_ID
 *
 * A share link from the Google Business Profile dashboard (`g.page/...`) works
 * for writeReviewUrl too.
 */
export const GOOGLE_REVIEWS: {
  profileUrl: string;
  writeReviewUrl: string;
} = {
  profileUrl:
    "https://search.google.com/local/reviews?placeid=ChIJL1mqIhEZ2YgRrq_Gwkx7Ni0",
  writeReviewUrl:
    "https://search.google.com/local/writereview?placeid=ChIJL1mqIhEZ2YgRrq_Gwkx7Ni0",
};

export const PAYMENT_METHOD_IDS = ["zelle", "venmo", "pickup"] as const;
export type PaymentMethodId = (typeof PAYMENT_METHOD_IDS)[number];

/**
 * Payment destinations shown on the order form.
 * Zelle uses the public phone. Venmo uses venmoUsername (no @).
 */
export const PAYMENT = {
  zelleName: BRAND.name,
  zelleRecipient: BRAND.phone,
  venmoUsername: "veronica-sabeh",
} as const;

export function paymentDestination(method: PaymentMethodId): string {
  if (method === "zelle") return PAYMENT.zelleRecipient;
  if (method === "venmo") {
    return PAYMENT.venmoUsername ? `@${PAYMENT.venmoUsername}` : BRAND.phone;
  }
  return "Pay at pickup";
}

export const PAYMENT_METHODS: ReadonlyArray<{
  id: PaymentMethodId;
  label: string;
  description: string;
}> = [
  {
    id: "zelle",
    label: "Zelle",
    description: `Send to ${PAYMENT.zelleRecipient} after we confirm your order.`,
  },
  {
    id: "venmo",
    label: "Venmo",
    description: PAYMENT.venmoUsername
      ? `Send to @${PAYMENT.venmoUsername} after we confirm your order.`
      : `Send to ${BRAND.phone} after we confirm your order.`,
  },
  {
    id: "pickup",
    label: "Pay at pickup",
    description: "Cash, Zelle, or Venmo when you pick up.",
  },
];

export const NAV_LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#order", label: "How to Order" },
  { href: "#about", label: "Our Story" },
  { href: "#testimonials", label: "Reviews" },
] as const;

/** Brand logo at public/images/logo.png */
export const LOGO_SRC = `${import.meta.env.BASE_URL}images/logo.png`;

/** Product photos served from public/images */
export function productImageSrc(filename: string): string {
  return `${import.meta.env.BASE_URL}images/${filename}`;
}
