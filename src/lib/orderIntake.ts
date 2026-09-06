export type OrderItemPayload = {
  name: string;
  quantity: number;
};

/**
 * Only the fields the Apps Script validates. Email bodies and totals are
 * composed server-side, so nothing here is trusted for display or pricing.
 */
export type OrderIntakePayload = {
  name: string;
  phone: string;
  email: string;
  pickupDay: string;
  paymentMethod: string;
  items: OrderItemPayload[];
  message: string;
  honeypot: string;
  source: string;
};

export function getOrderIntakeUrl(): string | undefined {
  const url = import.meta.env.VITE_ORDER_INTAKE_URL?.trim();
  return url || undefined;
}

/**
 * Thrown when we know the order did not go through, so the form can tell the
 * customer to try again instead of implying a confirmation email is coming.
 */
export class OrderIntakeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderIntakeError";
  }
}

/**
 * Posts the order and confirms the script actually accepted it.
 *
 * `text/plain` keeps this a CORS-safelisted request, which avoids the preflight
 * that Apps Script cannot answer, while still letting us read the JSON reply
 * after the mandatory redirect to script.googleusercontent.com.
 */
export async function submitOrder(
  url: string,
  payload: OrderIntakePayload,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new OrderIntakeError("We could not reach the order system.");
  }

  if (!response.ok) {
    throw new OrderIntakeError(`Order system returned ${response.status}.`);
  }

  let result: { ok?: boolean; error?: string };
  try {
    result = (await response.json()) as { ok?: boolean; error?: string };
  } catch {
    throw new OrderIntakeError("Order system returned an unreadable response.");
  }

  if (result.ok !== true) {
    throw new OrderIntakeError(result.error || "Order system rejected the request.");
  }
}
