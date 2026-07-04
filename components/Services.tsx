const services = [
  {
    name: "Municipal Streetscapes",
    desc: "We transform city centres, main streets, and public squares into winter destinations worth travelling to. We design and supply the displays — and coordinate with your local crews who put them up — so your team gets a turnkey look without the overseas guesswork.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4L4 14V26L20 36L36 26V14L20 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "Commercial Properties",
    desc: "Hotels, shopping centres, and office towers that sparkle don't just attract foot traffic — they become landmarks. We design displays that match your brand and make your property the one people remember.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="18" width="32" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 18L20 6L36 18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="15" y="26" width="10" height="10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "Airport Terminals",
    desc: "The first impression travellers get of your city is often the airport. Our terminal displays meet strict safety standards, deploy fast, and keep sparkling under round-the-clock traffic.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 36L20 8L32 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 26H28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "Seasonal Programming",
    desc: "Annual contracts covering design refresh, secure off-season storage, proactive maintenance, and 5-day emergency replacement — so your city sparkles every season without your team lifting a finger.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 10V20L27 27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Custom Structures",
    desc: "Arches, canopies, feature trees, and signature walk-through displays. When a city wants a truly iconic moment — something that ends up on every visitor's camera roll — our fabrication team builds it from scratch.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 32L34 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 32V20C10 16 14 12 20 12C26 12 30 16 30 20V32" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 12V6M15 8L20 6L25 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "LED Retrofit",
    desc: "Aging incandescent displays drain city budgets and dim city spirits. We replace tired systems with energy-efficient LED, and most retrofits pay back within two seasons through lower operating costs — while looking better than ever.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 20H34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="20" r="3" fill="currentColor" opacity="0.4" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
        <circle cx="28" cy="20" r="3" fill="currentColor" opacity="0.4" />
        <path d="M12 20V10M20 20V8M28 20V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section className="servicesSection" id="services">
      <div className="servicesHeader">
        <div className="sectionEyebrow">What We Do</div>
        <h2 className="sectionTitle">
          Every Service
          <br />
          Designed to Sparkle
        </h2>
        <p className="sectionBody">
          Making Cities Sparkle! isn&apos;t a tagline — it&apos;s the brief we
          give every project. From a single commercial property to an entire
          downtown core, we handle the design and supply so your city&apos;s own
          crews can bring it to life on the ground.
        </p>
      </div>
      <div className="servicesGrid">
        {services.map((service) => (
          <div key={service.name} className="serviceCard fadeUp">
            <div className="serviceIcon" aria-hidden="true">
              {service.icon}
            </div>
            <div className="serviceName">{service.name}</div>
            <p className="serviceDesc">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
