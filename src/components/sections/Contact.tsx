import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import {
  BRAND,
  PAYMENT,
  PAYMENT_METHODS,
  PICKUP_DAYS,
  PICKUP_DAYS_LABEL,
  paymentDestination,
  type PaymentMethodId,
} from "../../constants";
import { menuCategories } from "../../data/menu";
import { getOrderIntakeUrl, submitOrder } from "../../lib/orderIntake";
import { ADD_ORDER_ITEM_EVENT } from "../../lib/orderSelection";
import { SectionHeading } from "../ui/SectionHeading";
import { Button } from "../ui/Button";

type FormState = {
  name: string;
  phone: string;
  email: string;
  pickupDay: string;
  paymentMethod: PaymentMethodId | "";
  message: string;
};

type OrderQuantities = Record<string, number>;

const ORDERABLE_ITEM_NAMES = new Set(
  menuCategories.flatMap((category) => category.items.map((item) => item.name)),
);

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  pickupDay: "",
  paymentMethod: "",
  message: "",
};

type SubmitStatus = "idle" | "sending" | "success" | "error";

const ORDER_RECEIVED_PARAM = "order-received";

function customerConfirmation(paymentMethod: PaymentMethodId | "") {
  const paymentNote =
    paymentMethod === "zelle"
      ? `You chose Zelle. After we confirm, please send payment to ${paymentDestination("zelle")} (${PAYMENT.zelleName}).`
      : paymentMethod === "venmo"
        ? `You chose Venmo. After we confirm, please send payment to ${paymentDestination("venmo")}.`
        : paymentMethod === "pickup"
          ? "You chose to pay at pickup. Cash, Zelle, or Venmo are all welcome then."
          : "You can pay by Zelle, Venmo, or at pickup once we confirm.";

  return `Thank you for your order request from Kneaded with Love!

We received your order and will contact you within 6 hours to confirm your pickup date.

${paymentNote}

We cannot wait to bake something sweet and special for you!

Kneaded with Love
${BRAND.phone}
${BRAND.instagramHandle}`;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function Contact() {
  const [form, setForm] = useState<FormState>(initialState);
  const [quantities, setQuantities] = useState<OrderQuantities>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  // Set only once the order backend confirms it sent the confirmation email, so
  // the success dialog never promises mail we cannot account for.
  const [confirmationEmail, setConfirmationEmail] = useState("");

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

  useEffect(() => {
    const addMenuItem = (event: Event) => {
      const name = (event as CustomEvent<string>).detail;
      if (!ORDERABLE_ITEM_NAMES.has(name)) return;

      setQuantities((current) => ({
        ...current,
        [name]: Math.min((current[name] ?? 0) + 1, 20),
      }));
    };

    window.addEventListener(ADD_ORDER_ITEM_EVENT, addMenuItem);
    return () => window.removeEventListener(ADD_ORDER_ITEM_EVENT, addMenuItem);
  }, []);

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
      `Payment: ${
        data.paymentMethod
          ? PAYMENT_METHODS.find((method) => method.id === data.paymentMethod)?.label
          : "(not selected)"
      }`,
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.email.trim()
    ) {
      e.preventDefault();
      setStatus("error");
      setErrorMessage("Please complete every required field.");
      return;
    }

    if (selectedItems.length === 0) {
      e.preventDefault();
      setStatus("error");
      setErrorMessage("Please add at least one item to your order.");
      return;
    }

    if (!form.pickupDay) {
      e.preventDefault();
      setStatus("error");
      setErrorMessage(`Please choose a pickup day (${PICKUP_DAYS_LABEL}).`);
      return;
    }

    if (!form.paymentMethod) {
      e.preventDefault();
      setStatus("error");
      setErrorMessage("Please choose how you'd like to pay (Zelle, Venmo, or at pickup).");
      return;
    }

    const intakeUrl = getOrderIntakeUrl();
    if (!intakeUrl) {
      // No order backend configured: fall through to the native FormSubmit POST,
      // which notifies the bakery but cannot confirm the customer email.
      setStatus("sending");
      setErrorMessage("");
      return;
    }

    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const honeypot = String(new FormData(e.currentTarget).get("company") || "");
    const email = form.email.trim();

    try {
      await submitOrder(intakeUrl, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email,
        pickupDay: form.pickupDay,
        paymentMethod: form.paymentMethod,
        items: selectedItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
        message: form.message.trim(),
        honeypot,
        source: BRAND.website,
      });
      setConfirmationEmail(email);
      setStatus("success");
      setForm(initialState);
      setQuantities({});
    } catch (error) {
      console.error("Order submission failed", error);
      setStatus("error");
      setErrorMessage(
        `We could not submit your order. Please try again, or text us at ${BRAND.phone}.`,
      );
    }
  };

  // FormSubmit fallback only: it redirects back with this flag after posting.
  // Nothing here confirms a customer email, so confirmationEmail stays empty.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get(ORDER_RECEIVED_PARAM) !== "1") return;

    setStatus("success");
    params.delete(ORDER_RECEIVED_PARAM);
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}#contact`,
    );
  }, []);

  const inputClass =
    "w-full rounded-2xl border border-light-lavender bg-white/90 px-4 py-3 font-body text-warm-gray placeholder:text-warm-gray/50 transition-colors focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/40";

  const stepperClass =
    "flex h-9 w-9 items-center justify-center rounded-full border border-light-lavender bg-white font-body text-lg leading-none text-deep-blue transition-colors hover:border-lavender hover:bg-light-lavender/40 disabled:cursor-not-allowed disabled:opacity-40";

  const dismissDialog = () => {
    setStatus("idle");
  };

  return (
    <section
      id="contact"
      className="section-padding bg-gradient-to-b from-cream to-light-lavender/25"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:col-span-2 lg:self-start">
          <SectionHeading
            eyebrow="Ready when you are"
            headingId="contact-heading"
            title="Build your order"
            subtitle="Choose your bakes and pickup preference. Nothing is charged until your order is confirmed."
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
              <span className="font-bold text-deep-blue">Pay</span>
              <span>
                Zelle to {BRAND.phone}, Venmo @{PAYMENT.venmoUsername}, or pay at pickup
              </span>
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
            <li className="flex gap-3">
              <span className="font-bold text-deep-blue">Facebook</span>
              <a
                href={BRAND.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lavender"
              >
                Kneaded with Love
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
          {status === "error" && (
            <div
              role="alert"
              className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-body text-deep-blue"
            >
              {errorMessage || "Something went wrong. Please try again or text us directly."}
            </div>
          )}

          <form
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
            action={
              getOrderIntakeUrl()
                ? undefined
                : `https://formsubmit.co/${BRAND.orderEmail}`
            }
            method="POST"
            className="relative card-surface space-y-6 p-6 sm:p-8"
          >
            <input
              type="hidden"
              name="_next"
              value={`${BRAND.website}/?${ORDER_RECEIVED_PARAM}=1`}
            />
            <input
              type="hidden"
              name="_subject"
              value={`New order request from ${form.name || "Customer"}`}
            />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_autoresponse" value={customerConfirmation(form.paymentMethod)} />
            <input type="hidden" name="_honey" value="" />
            <label className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              Company
              <input type="text" name="company" tabIndex={-1} autoComplete="off" />
            </label>
            <input
              type="hidden"
              name="order"
              value={selectedItems
                .map((item) => `${item.quantity} x ${item.name} (${item.price})`)
                .join(", ")}
            />
            <input
              type="hidden"
              name="estimated_total"
              value={currency.format(orderTotal)}
            />
            <input type="hidden" name="pickup_day" value={form.pickupDay} />
            <input type="hidden" name="payment_method" value={form.paymentMethod} />
            <input type="hidden" name="details" value={buildNotification(form)} />
            <div>
              <p className="font-body text-xs font-bold tracking-[0.18em] text-lavender uppercase">
                Step 1 of 4
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold text-deep-blue">
                Your details
              </h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block font-body text-sm font-semibold text-deep-blue">
                  Name <span aria-hidden="true">*</span>
                </span>
                <input
                  type="text"
                  name="name"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={update("name")}
                  className={inputClass}
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-body text-sm font-semibold text-deep-blue">
                  Phone number <span aria-hidden="true">*</span>
                </span>
                <input
                  type="tel"
                  name="phone"
                  required
                  minLength={7}
                  value={form.phone}
                  onChange={update("phone")}
                  className={inputClass}
                  autoComplete="tel"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block font-body text-sm font-semibold text-deep-blue">
                Email <span aria-hidden="true">*</span>
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
              <legend className="mb-4 block">
                <span className="block font-body text-xs font-bold tracking-[0.18em] text-lavender uppercase">
                  Step 2 of 4
                </span>
                <span className="mt-1 block font-display text-2xl font-bold text-deep-blue">
                  Choose your bakes <span aria-hidden="true">*</span>
                </span>
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
              <legend className="mb-4 block">
                <span className="block font-body text-xs font-bold tracking-[0.18em] text-lavender uppercase">
                  Step 3 of 4
                </span>
                <span className="mt-1 block font-display text-2xl font-bold text-deep-blue">
                  Choose a pickup day <span aria-hidden="true">*</span>
                </span>
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

            <fieldset>
              <legend className="mb-4 block">
                <span className="block font-body text-xs font-bold tracking-[0.18em] text-lavender uppercase">
                  Step 4 of 4
                </span>
                <span className="mt-1 block font-display text-2xl font-bold text-deep-blue">
                  Payment preference <span aria-hidden="true">*</span>
                </span>
              </legend>
              <div className="grid gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 font-body transition-colors ${
                      form.paymentMethod === method.id
                        ? "border-soft-blue bg-soft-blue/10 text-deep-blue"
                        : "border-light-lavender bg-white/90 text-warm-gray hover:border-soft-blue/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      required
                      checked={form.paymentMethod === method.id}
                      onChange={update("paymentMethod")}
                      className="mt-1 h-4 w-4 accent-deep-blue"
                    />
                    <span>
                      <span className="block font-semibold text-deep-blue">{method.label}</span>
                      <span className="mt-0.5 block text-sm text-warm-gray/85">
                        {method.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {form.paymentMethod === "zelle" || form.paymentMethod === "venmo" ? (
                <PaymentDetails method={form.paymentMethod} />
              ) : null}
            </fieldset>

            <label className="block">
              <span className="mb-1.5 block font-body text-sm font-semibold text-deep-blue">
                Special request <span className="font-normal text-warm-gray/65">(optional)</span>
              </span>
              <textarea
                name="message"
                rows={4}
                value={form.message}
                onChange={update("message")}
                className={`${inputClass} resize-y`}
                placeholder="Allergies, gift notes, or anything else we should know"
              />
            </label>

            <Button
              type="submit"
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Send My Order Request"}
            </Button>
          </form>
        </div>
      </div>

      {status === "success" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-deep-blue/55 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              dismissDialog();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              dismissDialog();
              return;
            }
            if (event.key !== "Tab") return;

            const focusable = Array.from(
              event.currentTarget.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
              ),
            );
            const first = focusable[0];
            const last = focusable.at(-1);
            if (!first || !last) return;

            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-confirmation-title"
            aria-describedby="order-confirmation-message"
            className="w-full max-w-md rounded-3xl border border-light-lavender bg-cream p-7 text-center shadow-2xl sm:p-9"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lavender/15 text-2xl">
              💜
            </div>
            <h3
              id="order-confirmation-title"
              className="mt-4 font-display text-3xl text-deep-blue"
            >
              Order Request Received!
            </h3>
            <p
              id="order-confirmation-message"
              className="mt-3 font-body leading-relaxed text-warm-gray"
            >
              {confirmationEmail ? (
                <>
                  Thank you! We emailed your order details to{" "}
                  <strong className="text-deep-blue">{confirmationEmail}</strong> and will
                  contact you within <strong className="text-deep-blue">6 hours</strong> to
                  confirm your pickup date. You can pay by Zelle, Venmo, or at pickup.
                </>
              ) : (
                <>
                  Thank you! We have your request and will contact you within{" "}
                  <strong className="text-deep-blue">6 hours</strong> to confirm your pickup
                  date. You can pay by Zelle, Venmo, or at pickup.
                </>
              )}
            </p>
            {confirmationEmail ? (
              <p className="mt-3 font-body text-sm text-warm-gray/85">
                No email within a few minutes? Check your spam folder, or text us at{" "}
                <a href={`tel:${BRAND.phoneTel}`} className="font-semibold text-deep-blue">
                  {BRAND.phone}
                </a>
                .
              </p>
            ) : null}
            <p className="mt-3 font-body text-sm italic text-lavender">
              We can&apos;t wait to bake something sweet and special for you!
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-6 w-full"
              onClick={dismissDialog}
              autoFocus
            >
              Sweet, thank you!
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function PaymentDetails({ method }: { method: Extract<PaymentMethodId, "zelle" | "venmo"> }) {
  const [copied, setCopied] = useState(false);
  const destination = paymentDestination(method);
  const venmoUrl = PAYMENT.venmoUsername
    ? `https://venmo.com/u/${PAYMENT.venmoUsername}`
    : undefined;

  const copyDestination = async () => {
    try {
      await navigator.clipboard.writeText(destination);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-3 rounded-2xl border border-lavender/30 bg-white/70 px-4 py-3 font-body text-sm text-deep-blue">
      <p className="font-semibold">
        {method === "zelle" ? "Zelle" : "Venmo"}: {destination}
        {method === "zelle" ? ` · ${PAYMENT.zelleName}` : ""}
      </p>
      <p className="mt-1 text-warm-gray/85">
        Please wait until we confirm your order before sending payment.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            void copyDestination();
          }}
          className="rounded-full border border-deep-blue/20 bg-white px-4 py-2 font-semibold text-deep-blue transition-colors hover:border-lavender hover:bg-light-lavender/40"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        {method === "venmo" && venmoUrl ? (
          <a
            href={venmoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-deep-blue/20 bg-white px-4 py-2 font-semibold text-deep-blue transition-colors hover:border-lavender hover:bg-light-lavender/40"
          >
            Open Venmo
          </a>
        ) : null}
      </div>
    </div>
  );
}
