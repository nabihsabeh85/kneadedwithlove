import { PICKUP_DAYS_LABEL, productImageSrc } from "../../constants";
import { Button } from "../ui/Button";
import { WatercolorBackground } from "../ui/WatercolorBackground";

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <WatercolorBackground />
      <div className="relative mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:px-12 lg:py-24">
        <div className="text-center lg:text-left">
          <p className="mb-4 font-body text-xs font-bold tracking-[0.2em] text-lavender uppercase sm:text-sm">
            Small-batch bakery · West Boca Raton
          </p>
          <h1
            id="hero-heading"
            className="font-display text-5xl font-bold leading-[0.96] tracking-[-0.03em] text-deep-blue sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            Sourdough made slowly, shared warmly.
          </h1>
          <div className="mx-auto mt-6 max-w-xl space-y-4 font-body text-base leading-relaxed text-warm-gray/90 sm:text-lg lg:mx-0">
            <p>Hi, I'm Veronica. I'm a wife, a mom of three, and a teacher.</p>
            <p>
              This bakery started at my own kitchen counter, when I got tired of
              feeding my family bread full of preservatives and ingredients nobody
              needs. Real sourdough asks for four things: organic flour, water,
              kosher salt, and a live starter. The slow fermentation makes bread
              easier to digest and gentler on blood sugar, the way bread used to
              be made.
            </p>
            <p>
              I baked for my husband and kids first. Then friends started asking.
              Now I'd love to bake for your family too.
            </p>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button href="#menu" variant="primary">
              Explore the Menu
            </Button>
            <Button href="#contact" variant="outline">
              Start an Order
            </Button>
          </div>
          <ul
            className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-3 border-t border-deep-blue/10 pt-6 text-sm font-semibold text-deep-blue lg:mx-0 lg:justify-start"
            aria-label="Bakery details"
          >
            <li>Made to order</li>
            <li>Organic flour</li>
            <li>{PICKUP_DAYS_LABEL} pickup</li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div
            className="absolute -inset-5 rotate-3 rounded-[2.75rem] bg-light-lavender/80"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-[2.5rem] border-8 border-white bg-white shadow-2xl">
            <img
              src={productImageSrc("veronica.jpg")}
              alt="Veronica holding a freshly baked sourdough loaf in her kitchen"
              width={768}
              height={1024}
              fetchPriority="high"
              className="aspect-[3/4] h-full w-full object-cover object-top"
            />
          </div>
          <div className="absolute -bottom-5 left-1/2 w-[82%] -translate-x-1/2 rounded-2xl border border-light-lavender bg-white/95 px-5 py-3 text-center shadow-soft backdrop-blur sm:left-6 sm:w-auto sm:translate-x-0 sm:text-left">
            <p className="font-script text-2xl leading-none text-lavender">Baked with love</p>
            <p className="mt-1 text-xs font-bold tracking-wide text-deep-blue uppercase">
              Fresh for every pickup
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
