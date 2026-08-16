import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";
import { BRAND, PICKUP_DAYS, PICKUP_DAYS_LABEL } from "../../constants";
import { menuCategories } from "../../data/menu";
import { SectionHeading } from "../ui/SectionHeading";
import { Button } from "../ui/Button";

type FormState = {
  name: string;
  phone: string;
  email: string;
  pickupDay: string;
  message: string;
};

type OrderQuantities = Record<string, number>;

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  pickupDay: "",
  message: "",
};

type SubmitStatus = "idle" | "sending" | "success" | "error";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function Contact() {
  const [form, setForm] = useState<FormState>(initialState);
  const [quantities, setQuantities] = useState<OrderQuantities>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const update =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const setQuantity = (name: string, next: number) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      if (next <= 0) {
        delete updated[name];
      } else {
        updated[name] = Math.min(next, 20);
      }
      return updated;
    });
  };

  const selectedItems = useMemo(
    () =>
      menuCategories
        .flatMap((category) => category.items)
        .filter((item) => quantities[item.name] > 0)
        .map((item) => ({
          name: item.name,
          price: item.price,
          quantity: quantities[item.name],
          lineTotal: item.priceUsd * quantities[item.name],
        })),
    [quantities],
  );

  const orderTotal = selectedItems.reduce((sum, item) => sum + item.lineTotal, 0);

  const buildNotification = (data: FormState) =>
    [
      "New Kneaded with Love order request",
      "",
      `Name: ${data.name}`,
      `Phone / Text: ${data.phone}`,
      `Customer email: ${data.email}`,
      `Pickup day: ${data.pickupDay}`,
      "",
      "Order:",
      ...selectedItems.map(
        (item) =>
          `- ${item.quantity} x ${item.name} (${item.price}) = ${currency.format(item.lineTotal)}`,
      ),
      `Estimated total: ${currency.format(orderTotal)}`,
      "",
      "Message / special requests:",
      data.message.trim() || "(none)",
      "",
      `Submitted from: ${BRAND.website}`,
    ].join("\n");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      setStatus("error");
      setErrorMessage("Please add at least one item to your order.");
      return;
    }

    if (!form.pickupDay) {
      setStatus("error");
      setErrorMessage(`Please choose a pickup day (${PICKUP_DAYS_LABEL}).`);
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    const notification = buildNotification(form);
    const orderSummary = selectedItems
      .map((item) => `${item.quantity} x ${item.name} (${item.price})`)
      .join(", ");

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(BRAND.orderEmail)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `New order request from ${form.name}`,
            _template: "table",
            name: form.name,
            phone: form.phone,
            email: form.email,
            order: orderSummary,
            estimated_total: currency.format(orderTotal),
            pickup_day: form.pickupDay,
            message: form.message.trim() || "(none)",
            _replyto: form.email,
            details: notification,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Form service returned an error");
      }

      setStatus("success");
      setForm(initialState);
      setQuantities({});
    } catch {
      // Fallback: open the customer's mail app with a prefilled message to the bakery
      const subject = encodeURIComponent(`New order request from ${form.name}`);
      const body = encodeURIComponent(notification);
      window.location.href = `mailto:${BRAND.orderEmail}?subject=${subject}&body=${body}`;
      setStatus("success");
      setForm(initialState);
      setQuantities({});
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-light-lavender bg-white/90 px-4 py-3 font-body text-warm-gray placeholder:text-warm-gray/50 transition-colors focus:border-soft-blue focus:outline-none focus:ring-2 focus:ring-soft-blue/30";

  const stepperClass =
    "flex h-9 w-9 items-center justify-center rounded-full border border-light-lavender bg-white font-body text-lg leading-none text-deep-blue transition-colors hover:border-lavender hover:bg-light-lavender/40 disabled:cursor-not-allowed disabled:opacity-40";

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
              <span className="font-bold text-deep-blue">Pickup</span>
              <span>
                {BRAND.location} · {PICKUP_DAYS_LABEL}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-deep-blue">Phone / Text</span>
              <a href={`tel:${BRAND.phoneTel}`} className="hover:text-lavender">
                {BRAND.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-deep-blue">Email</span>
              <a href={`mailto:${BRAND.orderEmail}`} className="hover:text-lavender">
                {BRAND.orderEmail}
              </a>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-deep-blue">Instagram</span>
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lavender"
              >
                {BRAND.instagramHandle}
              </a>
            </li>
          </ul>

          <p className="mt-6 font-body text-sm leading-relaxed text-warm-gray/90">
            {BRAND.pickupNote}
          </p>
          <p className="mt-3 font-body text-xs leading-relaxed text-warm-gray/75">
            {BRAND.cottageFoodNote}
          </p>
        </div>

        <div className="lg:col-span-3">
          {status === "success" && (
            <div
              role="status"
              className="mb-6 rounded-2xl border border-soft-blue/40 bg-soft-blue/10 px-5 py-4 font-body text-deep-blue"
            >
              Thank you! Your order request was sent to {BRAND.orderEmail}. We&apos;ll confirm
              your {PICKUP_DAYS_LABEL} pickup soon.
            </div>
          )}

          {status === "error" && (
            <div
              role="alert"
              className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-body text-deep-blue"
            >
              {errorMessage || "Something went wrong. Please try again or text us directly."}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="card-surface space-y-6 p-6 sm:p-8"
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

            <fieldset>
              <legend className="mb-1.5 block font-body text-sm font-semibold text-deep-blue">
                Choose your items
              </legend>

              <div className="space-y-5">
                {menuCategories.map((category) => (
                  <div key={category.id}>
                    <h4 className="mb-2 font-body text-xs font-bold tracking-wide text-lavender uppercase">
                      {category.title}
                    </h4>
                    <ul className="space-y-2">
                      {category.items.map((item) => {
                        const quantity = quantities[item.name] ?? 0;
                        const selected = quantity > 0;

                        return (
                          <li
                            key={item.name}
                            className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                              selected
                                ? "border-soft-blue bg-soft-blue/10"
                                : "border-light-lavender bg-white/90"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="truncate font-body text-sm font-semibold text-deep-blue">
                                {item.name}
                              </p>
                              <p className="font-body text-xs text-warm-gray/80">{item.price}</p>
                            </div>

                            {selected ? (
                              <div className="flex shrink-0 items-center gap-2">
                                <button
                                  type="button"
                                  className={stepperClass}
                                  onClick={() => setQuantity(item.name, quantity - 1)}
                                  aria-label={`Remove one ${item.name}`}
                                >
                                  −
                                </button>
                                <span
                                  className="w-6 text-center font-body text-sm font-bold text-deep-blue"
                                  aria-live="polite"
                                >
                                  {quantity}
                                </span>
                                <button
                                  type="button"
                                  className={stepperClass}
                                  onClick={() => setQuantity(item.name, quantity + 1)}
                                  aria-label={`Add one more ${item.name}`}
                                  disabled={quantity >= 20}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setQuantity(item.name, 1)}
                                className="shrink-0 rounded-full border border-deep-blue/20 bg-white px-4 py-2 font-body text-sm font-semibold text-deep-blue transition-colors hover:border-lavender hover:bg-light-lavender/40"
                              >
                                Add
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-lavender/30 bg-white/70 px-4 py-3 font-body text-sm text-deep-blue">
                {selectedItems.length === 0 ? (
                  <span className="text-warm-gray/80">No items added yet.</span>
                ) : (
                  <>
                    <ul className="space-y-1">
                      {selectedItems.map((item) => (
                        <li key={item.name} className="flex justify-between gap-3">
                          <span>
                            {item.quantity} × {item.name}
                          </span>
                          <span className="font-semibold">{currency.format(item.lineTotal)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 flex justify-between gap-3 border-t border-lavender/30 pt-2 font-bold">
                      <span>Estimated total</span>
                      <span>{currency.format(orderTotal)}</span>
                    </p>
                  </>
                )}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-1.5 block font-body text-sm font-semibold text-deep-blue">
                Pickup day
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {PICKUP_DAYS.map((day) => (
                  <label
                    key={day}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 font-body transition-colors ${
                      form.pickupDay === day
                        ? "border-soft-blue bg-soft-blue/10 text-deep-blue"
                        : "border-light-lavender bg-white/90 text-warm-gray hover:border-soft-blue/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pickupDay"
                      value={day}
                      required
                      checked={form.pickupDay === day}
                      onChange={update("pickupDay")}
                      className="h-4 w-4 accent-deep-blue"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </fieldset>

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

            <Button
              type="submit"
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Submit Order Request"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
