import { Logo } from "../Logo";
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
      <div className="section-padding relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="mb-3 font-body text-sm font-semibold tracking-widest text-lavender uppercase">
            Home-based bakery · West Boca
          </p>
          <h1
            id="hero-heading"
            className="font-display text-5xl leading-tight text-deep-blue sm:text-6xl lg:text-7xl"
          >
            Freshly Baked with Love
          </h1>
          <p className="mx-auto mt-5 max-w-lg font-body text-lg leading-relaxed text-warm-gray/90 lg:mx-0">
            Homemade sourdough, sweet treats, and baked goods made fresh in small
            batches.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <Button href="#menu" variant="primary">
              View Menu
            </Button>
            <Button href="#contact" variant="outline">
              Place an Order
            </Button>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-full bg-gradient-to-br from-soft-blue/30 via-light-lavender/60 to-lavender/30 blur-2xl"
              aria-hidden
            />
            <Logo size="xl" className="relative" />
          </div>
        </div>
      </div>
    </section>
  );
}
