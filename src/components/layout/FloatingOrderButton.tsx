import { useEffect, useState } from "react";

export function FloatingOrderButton() {
  const [orderFormVisible, setOrderFormVisible] = useState(false);

  useEffect(() => {
    const orderForm = document.querySelector("#contact");
    if (!orderForm) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOrderFormVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(orderForm);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href="#contact"
      className={`fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full bg-deep-blue px-5 py-3.5 font-body text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.03] hover:bg-deep-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-blue md:hidden ${
        orderFormVisible ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
      }`}
      aria-label="Order now — go to contact form"
      aria-hidden={orderFormVisible}
      tabIndex={orderFormVisible ? -1 : undefined}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" d="M3 8h18M3 12h12M3 16h8" />
      </svg>
      Order Now
    </a>
  );
}
