"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const productDropdownItems = [
  { label: "All Products", href: "#products" },
  { label: "Light Pole Decorations", href: "#pole-decorations" },
  { label: "String Lights & RGB", href: "#string-lights" },
  { label: "Animated Lighting", href: "#animated-lighting" },
  { label: "City & Airport Letters", href: "#city-letters" },
  { label: "Connecting Accessories", href: "#accessories" },
];

const allNavItems = [
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#difference" },
  { label: "Coverage", href: "#coverage" },
];

export default function Nav() {
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close products dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function closeMobile() {
    setMobileOpen(false);
    setMobileProductsOpen(false);
  }

  return (
    <>
      <nav className="nav">
        <Link href="/" className="navLogo">
          Sparkle<span>Bright</span>
        </Link>

        {/* Desktop links */}
        <ul className="navLinks">
          <li><a href="#services">Services</a></li>

          <li className="navDropdownWrap" ref={dropdownRef}>
            <button
              className={`navDropdownTrigger ${productsOpen ? "navDropdownTriggerOpen" : ""}`}
              onClick={() => setProductsOpen((v) => !v)}
              aria-expanded={productsOpen}
            >
              Products
              <svg
                className={`navDropdownChevron ${productsOpen ? "navDropdownChevronOpen" : ""}`}
                width="10" height="10" viewBox="0 0 10 10" fill="none"
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {productsOpen && (
              <div className="navDropdown">
                {productDropdownItems.map((item, i) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`navDropdownItem ${i === 0 ? "navDropdownItemAll" : ""}`}
                    onClick={() => setProductsOpen(false)}
                  >
                    {i === 0 && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <rect x="1" y="1" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
                        <rect x="7" y="1" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
                        <rect x="1" y="7" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
                        <rect x="7" y="7" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
                      </svg>
                    )}
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </li>

          <li><a href="#difference">Why Us</a></li>
          <li><a href="#coverage">Coverage</a></li>
        </ul>

        {/* Desktop CTA */}
        <a className="navCta navCtaDesktop" href="#contact">Request a Quote</a>

        {/* Hamburger button (mobile only) */}
        <button
          className={`hamburger ${mobileOpen ? "hamburgerOpen" : ""}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className="hamburgerLine" />
          <span className="hamburgerLine" />
          <span className="hamburgerLine" />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobileDrawer ${mobileOpen ? "mobileDrawerOpen" : ""}`} aria-hidden={!mobileOpen}>
        <div className="mobileDrawerInner">
          <a href="#services" className="mobileNavLink" onClick={closeMobile}>Services</a>

          {/* Products accordion */}
          <div className="mobileNavAccordion">
            <button
              className="mobileNavLink mobileNavAccordionTrigger"
              onClick={() => setMobileProductsOpen((v) => !v)}
            >
              Products
              <svg
                className={`navDropdownChevron ${mobileProductsOpen ? "navDropdownChevronOpen" : ""}`}
                width="12" height="12" viewBox="0 0 10 10" fill="none"
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {mobileProductsOpen && (
              <div className="mobileNavSubLinks">
                {productDropdownItems.map((item, i) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`mobileNavSubLink ${i === 0 ? "mobileNavSubLinkAll" : ""}`}
                    onClick={closeMobile}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="#difference" className="mobileNavLink" onClick={closeMobile}>Why Us</a>
          <a href="#coverage" className="mobileNavLink" onClick={closeMobile}>Coverage</a>

          <a href="#contact" className="btnPrimary mobileNavCta" onClick={closeMobile}>
            Request a Quote
          </a>
        </div>
      </div>
    </>
  );
}
