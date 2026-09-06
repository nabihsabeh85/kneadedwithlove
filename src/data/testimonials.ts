export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
  /** Stars the customer left on Google, out of 5. */
  rating: number;
};

/**
 * Real customer reviews only. The section shows star ratings and links to the
 * Google Business Profile, so a reader takes every entry as a genuine review
 * they could go verify.
 *
 * Copy each one from the Google profile, keeping the reviewer's name as Google
 * shows it (first name + last initial is fine) and the stars they actually
 * left. While this list is empty the section shows the Google links on their
 * own instead of empty cards.
 *
 * {
 *   quote: "Exact review text from Google.",
 *   name: "Reviewer name",
 *   detail: "Google review",
 *   rating: 5,
 * },
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Veronica makes, hands down, the best sourdough I’ve ever had! You can immediately tell how much care and love she puts into every loaf.",
    name: "H. A.",
    detail: "Google review",
    rating: 5,
  },
  {
    quote:
      "I've tried sourdough from bakeries all over South Florida, and Kneaded with Love beats every one of them. The crust is perfect and the inside is so soft.",
    name: "G. S.",
    detail: "Google review",
    rating: 5,
  },
  {
    quote:
      "My family goes through a loaf a week now. Veronica's bread has that fresh-from-a-real-bakery taste, but you can tell it's made with so much more heart.",
    name: "V. C.",
    detail: "Google review",
    rating: 5,
  },
  {
    quote:
      "There's a difference between bread and sourdough made by someone who actually cares. Veronica's loaves are proof of that. Every bite tastes homemade in the best way.",
    name: "J. S.",
    detail: "Google review",
    rating: 5,
  },
];
