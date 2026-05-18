import { type ChangeEvent, type FormEvent, useState } from "react";
import { BRAND } from "../../constants";
import { SectionHeading } from "../ui/SectionHeading";
import { Button } from "../ui/Button";

type FormState = {
  name: string;
  phone: string;
  email: string;
  orderItem: string;
  pickupDate: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  orderItem: "",
  pickupDate: "",
  message: "",
};

export function Contact() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const update =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Order Request from ${form.name || "Customer"}`);
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        `Email: ${form.email}`,
        `Order: ${form.orderItem}`,
        `Preferred Pickup: ${form.pickupDate}`,
        "",
        "Message / Special Requests:",
        form.message,
      ].join("\n"),
    );

    window.location.href = `mailto:${BRAND.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setForm(initialState);
  };

  const inputClass =
    "w-full rounded-2xl border border-light-lavender bg-white/90 px-4 py-3 font-body text-warm-gray placeholder:text-warm-gray/50 transition-colors focus:border-soft-blue focus:outline-none focus:ring-2 focus:ring-soft-blue/30";

  return (
    <section
      id="contact"
      className="section-padding bg-gradient-to-b from-cream to-light-lavender/25"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-2">
          <SectionHeading
            eyebrow="Let's bake for you"
            headingId="contact-heading"
            title="Contact & Order"
            subtitle="Tell us what you'd love — we'll get back to you to confirm details and pickup."
            align="left"
          />

          <ul className="space-y-4 font-body text-sm sm:text-base">
            <li className="flex gap-3">
              <span className="font-bold text-deep-blue">Location</span>
              <span>{BRAND.location}</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-deep-blue">Phone</span>
              <a href={`tel:${BRAND.phone.replace(/\D/g, "")}`} className="hover:text-lavender">
                {BRAND.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-deep-blue">Email</span>
              <a href={`mailto:${BRAND.email}`} className="hover:text-lavender">
                {BRAND.email}
              </a>
            </li>
            <li className="flex gap-4 pt-2">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lavender hover:text-deep-blue"
              >
                Instagram
              </a>
              <a
                href={BRAND.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lavender hover:text-deep-blue"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          {submitted && (
            <div
              role="status"
              className="mb-6 rounded-2xl border border-soft-blue/40 bg-soft-blue/10 px-5 py-4 font-body text-deep-blue"
            >
              Thank you! Your email app should open with your order details. We'll be in touch
              soon.
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="card-surface space-y-5 p-6 sm:p-8"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block font-body text-sm font-semibold text-deep-blue">
                  Name
                </span>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={update("name")}
                  className={inputClass}
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-body text-sm font-semibold text-deep-blue">
                  Phone number
                </span>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={update("phone")}
                  className={inputClass}
                  autoComplete="tel"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block font-body text-sm font-semibold text-deep-blue">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={update("email")}
                className={inputClass}
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block font-body text-sm font-semibold text-deep-blue">
                Order item
              </span>
              <input
                type="text"
                name="orderItem"
                required
                placeholder="e.g. Classic Sourdough + Cinnamon Rolls"
                value={form.orderItem}
                onChange={update("orderItem")}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block font-body text-sm font-semibold text-deep-blue">
                Preferred pickup date
              </span>
              <input
                type="date"
                name="pickupDate"
                value={form.pickupDate}
                onChange={update("pickupDate")}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block font-body text-sm font-semibold text-deep-blue">
                Message / special request
              </span>
              <textarea
                name="message"
                rows={4}
                value={form.message}
                onChange={update("message")}
                className={`${inputClass} resize-y`}
                placeholder="Allergies, quantities, gift notes..."
              />
            </label>

            <Button type="submit" variant="secondary" className="w-full sm:w-auto">
              Submit Order Request
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
