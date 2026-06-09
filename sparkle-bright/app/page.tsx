import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsBand from "@/components/StatsBand";
import Services from "@/components/Services";
import Difference from "@/components/Difference";
import Coverage from "@/components/Coverage";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Nav />
      <Hero />
      <StatsBand />
      <Services />
      <Difference />
      <Coverage />
      <CtaBand />
      <Footer />
    </>
  );
}
