export const ADD_ORDER_ITEM_EVENT = "kneaded:add-order-item";

export function addItemToOrder(name: string) {
  window.dispatchEvent(
    new CustomEvent<string>(ADD_ORDER_ITEM_EVENT, {
      detail: name,
    }),
  );
  document.querySelector("#contact form")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
