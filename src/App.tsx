import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { FloatingOrderButton } from "./components/layout/FloatingOrderButton";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Menu } from "./components/sections/Menu";
import { HowToOrder } from "./components/sections/HowToOrder";
import { FeaturedProducts } from "./components/sections/FeaturedProducts";
import { WeeklySpecials } from "./components/sections/WeeklySpecials";
import { Gallery } from "./components/sections/Gallery";
import { Testimonials } from "./components/sections/Testimonials";
import { Contact } from "./components/sections/Contact";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-deep-blue focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Menu />
        <HowToOrder />
        <FeaturedProducts />
        <WeeklySpecials />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingOrderButton />
    </>
  );
}
