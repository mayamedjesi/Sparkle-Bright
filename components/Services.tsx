const services = [
  {
    name: "Municipal Streetscapes",
    desc: "Transform city centres, main streets, and public squares into winter destinations. We handle everything from design to installation and seasonal storage.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4L4 14V26L20 36L36 26V14L20 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "Commercial Properties",
    desc: "Hotels, shopping centres, and office towers. We design installations that align with your brand and keep your property prominent through the holiday season.",
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
    desc: "High-traffic environments with strict timelines. Our airport-grade installs are built for safety compliance, rapid deployment, and round-the-clock visibility.",
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
    desc: "Annual contracts that include design refresh, storage, maintenance, and emergency response — so your team has one less thing to manage each year.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 10V20L27 27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Custom Structures",
    desc: "Arches, canopies, feature trees, and signature installations. Our fabrication team brings original concepts to life for signature civic moments.",
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
    desc: "Replace aging incandescent and fluorescent displays with energy-efficient LED systems. Most retrofits pay back within two seasons through reduced energy costs.",
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
          Built for Scale,
          <br />
          Designed to Endure
        </h2>
        <p className="sectionBody">
          From downtown main streets to international airports, we deliver
          lighting installations that withstand the harshest Canadian winters
          while creating memorable civic experiences.
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
