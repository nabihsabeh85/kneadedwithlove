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
export const testimonials: Testimonial[] = [];
