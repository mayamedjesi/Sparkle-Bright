"use client";

import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 600;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reading scrollY forces the browser to settle layout, so do it at most
    // once per animation frame rather than on every scroll event.
    let pending = 0;
    function read() {
      pending = 0;
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }
    function handleScroll() {
      if (pending) return;
      pending = requestAnimationFrame(read);
    }
    read();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (pending) cancelAnimationFrame(pending);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      className={`backToTop ${visible ? "backToTopVisible" : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      type="button"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 13V3M8 3L3.5 7.5M8 3L12.5 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="backToTopLabel">Back to Top</span>
    </button>
  );
}
