import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsBand from "@/components/StatsBand";
import Services from "@/components/Services";
import Products from "@/components/Products";
import FaceAlignSection from "@/components/FaceAlignSection";
import Difference from "@/components/Difference";
import Coverage from "@/components/Coverage";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { featuredCategories, categoryUrl } from "@/lib/products";

const PRODUCTS_PER_CATEGORY = 6;

export default function Home() {
  // Sliced here, on the server, so the browser never receives the full catalogue.
  const featured = featuredCategories(PRODUCTS_PER_CATEGORY);

  return (
    <>
      <ScrollReveal />
      <Nav />
      {/* <main> gives the page a `main` landmark. Without one, every section
          below sits outside any landmark, which leaves screen readers and
          agents no top-level structure to navigate by. Nav and Footer stay
          outside — they are their own landmarks. */}
      <main>
        <Hero />
        <Products categories={featured} />
        <FaceAlignSection seeAllUrl={categoryUrl("lighting-structures")} />
        <StatsBand />
        <Services />
        <Difference />
        <Coverage />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
