"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { useQuoteModal } from "./QuoteModalContext";
import { useCart } from "./CartContext";
import { usePathname } from "next/navigation";

// First item ("Introduction") scrolls to top / goes to homepage.
// The rest are the links that used to live directly in the nav bar.
const homeDropdownItems = [
  { label: "Introduction", href: "/", isIntro: true },
  { label: "Popular Products", href: "/#pole-decorations" },
  { label: "Try Me", href: "/#try-on" },
  { label: "Services", href: "/#services" },
  { label: "Why Us", href: "/#difference" },
  { label: "Coverage", href: "/#coverage" },
];

// Top-level tabs after Home — one per product category, linking
// straight to the filtered product gallery.
const categoryNavItems = [
  { label: "Light Pole Decorations", href: "/gallery?category=pole-decorations" },
  { label: "String Lights & RGB", href: "/gallery?category=string-lights" },
  { label: "Dancing Lights", href: "/gallery?category=animated-lighting" },
  { label: "Lighting Structures", href: "/gallery?category=lighting-structures" },
  { label: "City & Airport Letters", href: "/gallery?category=city-letters" },
  { label: "Connecting Accessories", href: "/gallery?category=accessories" },
];

export default function Nav() {
  const [homeOpen, setHomeOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileHomeOpen, setMobileHomeOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const { openModal } = useQuoteModal();
  const { count, openCart } = useCart();
  const pathname = usePathname();

  // If already on the homepage, scroll to top. From any other page, navigate to /.
  const handleHomeClick = useCallback((e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  // Close home dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setHomeOpen(false);
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
    setMobileHomeOpen(false);
  }

  return (
    <>
      <nav className="nav">
        <Link href="/" className="navLogo" onClick={handleHomeClick}>
          Sparkle<span>Bright</span>
        </Link>

        {/* Desktop links */}
        <ul className="navLinks">
          <li className="navDropdownWrap" ref={dropdownRef}>
            <button
              className={`navDropdownTrigger ${homeOpen ? "navDropdownTriggerOpen" : ""}`}
              onClick={() => setHomeOpen((v) => !v)}
              aria-expanded={homeOpen}
            >
              Home
              <svg
                className={`navDropdownChevron ${homeOpen ? "navDropdownChevronOpen" : ""}`}
                width="10" height="10" viewBox="0 0 10 10" fill="none"
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {homeOpen && (
              <div className="navDropdown">
                {homeDropdownItems.map((item, i) => (
                  <a
                    key={item.href + item.label}
                    href={item.href}
                    className={`navDropdownItem ${i === 0 ? "navDropdownItemAll" : ""}`}
                    onClick={(e) => {
                      if (item.isIntro) handleHomeClick(e);
                      setHomeOpen(false);
                    }}
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

          {categoryNavItems.map((item) => (
            <li key={item.href}><a href={item.href}>{item.label}</a></li>
          ))}
        </ul>

        {/* Right-side actions */}
        <div className="navActions">
          <button
            className="navCartBtn"
            onClick={openCart}
            type="button"
            aria-label={`Open cart${count > 0 ? `, ${count} item${count !== 1 ? "s" : ""}` : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 2.5H4L5.2 12H15L17 5H5.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="7" cy="16" r="1.3" fill="currentColor" />
              <circle cx="14" cy="16" r="1.3" fill="currentColor" />
            </svg>
            {count > 0 && <span className="navCartBadge">{count}</span>}
          </button>
          <button className="navCta" onClick={openModal} type="button">Contact Us</button>

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
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobileDrawer ${mobileOpen ? "mobileDrawerOpen" : ""}`} aria-hidden={!mobileOpen}>
        <div className="mobileDrawerInner">
          {/* Home accordion */}
          <div className="mobileNavAccordion">
            <button
              className="mobileNavLink mobileNavAccordionTrigger"
              onClick={() => setMobileHomeOpen((v) => !v)}
            >
              Home
              <svg
                className={`navDropdownChevron ${mobileHomeOpen ? "navDropdownChevronOpen" : ""}`}
                width="12" height="12" viewBox="0 0 10 10" fill="none"
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {mobileHomeOpen && (
              <div className="mobileNavSubLinks">
                {homeDropdownItems.map((item, i) => (
                  <a
                    key={item.href + item.label}
                    href={item.href}
                    className={`mobileNavSubLink ${i === 0 ? "mobileNavSubLinkAll" : ""}`}
                    onClick={(e) => {
                      if (item.isIntro) handleHomeClick(e);
                      closeMobile();
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {categoryNavItems.map((item) => (
            <a key={item.href} href={item.href} className="mobileNavLink" onClick={closeMobile}>
              {item.label}
            </a>
          ))}

          <button className="btnPrimary mobileNavCta" onClick={() => { openModal(); closeMobile(); }} type="button">
            Contact Us
          </button>
        </div>
      </div>
    </>
  );
}
