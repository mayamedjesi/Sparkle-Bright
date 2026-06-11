const categories = [
  {
    id: "pole-decorations",
    name: "Light Pole Decorations",
    description:
      "Durable, weather-rated pole-mount displays built to survive Canadian winters. Available in single- and double-sided configurations.",
    seeAllUrl: "#",
    products: [
      {
        name: "Classic Snowflake Pole Mount",
        desc: "Powder-coated aluminum frame with warm-white LED fill. 24\" diameter, IP65-rated.",
        tag: "Best Seller",
        url: "#",
        image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&h=400&fit=crop",
      },	
      {
        name: "Wreath & Bow Display",
        desc: "Traditional double-sided wreath with ribbon bow. Pre-wired for quick pole bracket attachment.",
        tag: "Most Popular",
        url: "#",
        image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&h=400&fit=crop",
      },
      {
        name: "Star Burst Topper",
        desc: "Eight-point starburst in brushed aluminum with multi-colour LED option. Standard 4\" pipe mounts.",
        tag: null,
        url: "#",
        image: "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=600&h=400&fit=crop",
      },
      {
        name: "Candy Cane Pole Wrap",
        desc: "Spiral LED strip wrap kit fits poles 3\"–6\" diameter. 8 ft coverage per kit, IP67.",
        tag: null,
        url: "#",
        image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=600&h=400&fit=crop",
      },
    ],
  },
  {
    id: "string-lights",
    name: "String Lights & RGB",
    description:
      "Commercial-grade string lights engineered for heavy seasonal use. Full RGB colour control available across the entire range.",
    seeAllUrl: "#",
    products: [
      {
        name: "Pro Series C9 LED String",
        desc: "Heavy-duty 18 AWG SPT-2 wire with faceted C9 bulbs. 25 ft runs, stackable to 300 ft.",
        tag: "Best Seller",
        url: "#",
        image: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=600&h=400&fit=crop",
      },
      {
        name: "Globe String Light — 2\"",
        desc: "Shatterproof polycarbonate globes on black wire. Warm white 2700K. Rated for –40°C.",
        tag: null,
        url: "#",
        image: "https://images.unsplash.com/photo-1606070028456-e93c89c84b13?w=600&h=400&fit=crop",
      },
      {
        name: "RGBW Smart Pixel String",
        desc: "Individually addressable WS2812B pixels. DMX or Wi-Fi control. 50 ft per run.",
        tag: "New",
        url: "#",
        image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop",
      },
      {
        name: "Icicle Drop Light — 120 LED",
        desc: "Variable-length drop strands (6\"–18\") on a 10 ft header wire. Clear or warm white.",
        tag: null,
        url: "#",
        image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&h=400&fit=crop",
      },
    ],
  },
  {
    id: "animated-lighting",
    name: "Animated Lighting",
    description:
      "Programmed sequences and motion effects that bring installations to life. From simple twinkle to full DMX show control.",
    seeAllUrl: "#",
    products: [
      {
        name: "Chase Controller — 8 Channel",
        desc: "8-channel DMX chase controller with 32 built-in programs. Drives up to 2,000W per channel.",
        tag: "Best Seller",
        url: "#",
        image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&h=400&fit=crop",
      },
      {
        name: "Pixel Tree — 12 ft RGB",
        desc: "360° spiral pixel tree, 1,200 addressable nodes. Ships with pre-loaded holiday sequences.",
        tag: "Featured",
        url: "#",
        image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=600&h=400&fit=crop",
      },
      {
        name: "LED Meteor Shower Tube",
        desc: "Falling-snow LED tube, 23\". Clusters of 10 create a cascading curtain effect. IP65.",
        tag: null,
        url: "#",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop",
      },
      {
        name: "Programmable Flood Wash",
        desc: "RGBW 50W flood with 180° beam spread. App-controlled colour mixing and group sync.",
        tag: "New",
        url: "#",
        image: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&h=400&fit=crop",
      },
    ],
  },
  {
    id: "city-letters",
    name: "City & Airport Letters",
    description:
      "Large-format illuminated letters and signage for high-visibility civic and terminal installations. Custom sizing available.",
    seeAllUrl: "#",
    products: [
      {
        name: "Marquee Block Letter — 36\"",
        desc: "Powder-coated steel casing, warm-white LED fill. Front-lit with optional halo backlight.",
        tag: "Most Popular",
        url: "#",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      },
      {
        name: "Backlit Channel Letter — 24\"",
        desc: "Acrylic face with LED module array. Uniform illumination, no hot spots. Interior or covered exterior.",
        tag: null,
        url: "#",
        image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop",
      },
      {
        name: "Festive Word Set — NOEL",
        desc: "4-letter pre-fabricated set, 18\" height. Warm white LED. Ground spikes and hardware included.",
        tag: "Best Seller",
        url: "#",
        image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=600&h=400&fit=crop",
      },
      {
        name: "Custom Airport Wordmark",
        desc: "Bespoke large-format letters up to 72\". Structural steel, aviation-rated finish, UL-listed LEDs.",
        tag: "Custom",
        url: "#",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop",
      },
    ],
  },
  {
    id: "accessories",
    name: "Connecting Accessories",
    description:
      "Everything needed to complete, extend, and protect your installation — from weatherproof connectors to heavy-duty timers.",
    seeAllUrl: "#",
    products: [
      {
        name: "SPT-1 / SPT-2 Quick Connect",
        desc: "Vampire-style quick-connect clips for 18–22 AWG SPT wire. 10-pack. Rated 10A/125V. UL listed.",
        tag: "Essential",
        url: "#",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
      },
      {
        name: "Outdoor Extension Cord — 25 ft",
        desc: "16/3 SJTW heavy-duty outdoor extension, lighted end, –40°C rated. 15A, 125V, UL listed.",
        tag: "Best Seller",
        url: "#",
        image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&h=400&fit=crop",
      },
      {
        name: "Heavy-Duty Mechanical Timer",
        desc: "24-hour mechanical outlet timer, 2-outlet, 15A. Grounded, weatherproof housing.",
        tag: null,
        url: "#",
        image: "https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=600&h=400&fit=crop",
      },
      {
        name: "Waterproof Wire Connector Kit",
        desc: "Gel-filled twist connectors for outdoor wire splices. 50-pack, fits 14–22 AWG.",
        tag: null,
        url: "#",
        image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop",
      },
    ],
  },
];

function TagBadge({ tag }: { tag: string }) {
  const isNew = tag === "New";
  const isCustom = tag === "Custom";
  return (
    <span
      className={`productTag ${isNew ? "productTagNew" : ""} ${isCustom ? "productTagCustom" : ""}`}
    >
      {tag}
    </span>
  );
}

export default function Products() {
  return (
    <section className="productsSection" id="products">
      <div className="productsHeader">
        <div className="sectionEyebrow">Our Products</div>
        <h2 className="sectionTitle">
          Sourced for Scale,
          <br />
          Ready to Deploy
        </h2>
        <p className="sectionBody">
          Every product in our range is tested for Canadian winter conditions —
          rated to –40°C, UL-listed, and backed by our 1-year warranty.
        </p>
      </div>

      {categories.map((cat, catIdx) => (
        <div key={cat.id} className="productCategory" id={cat.id}>
          <div className="productCategoryHeader">
            <div className="productCategoryMeta">
              <span className="productCategoryNumber">0{catIdx + 1}</span>
              <div>
                <h3 className="productCategoryName">{cat.name}</h3>
                <p className="productCategoryDesc">{cat.description}</p>
              </div>
            </div>
            <a className="btnSeeAll" href={cat.seeAllUrl}>
              See all {cat.name}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="productGrid">
            {cat.products.map((product) => (
              <div key={product.name} className="productCard fadeUp">
                <div className="productImageWrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="productImage"
                    loading="lazy"
                  />
                  <div className="productImageOverlay" />
                  {product.tag && (
                    <div className="productTagFloat">
                      <TagBadge tag={product.tag} />
                    </div>
                  )}
                </div>
                <div className="productCardBody">
                  <div className="productCardTop">
                    <h4 className="productName">{product.name}</h4>
                    <p className="productDesc">{product.desc}</p>
                  </div>
                  <a className="productLink" href={product.url}>
                    View Listing
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
