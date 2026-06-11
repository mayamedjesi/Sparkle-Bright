"use client";

import { useEffect, useRef, useState } from "react";

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "sending" | "success" | "error";

export default function QuoteModal({ open, onClose }: QuoteModalProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const backdropRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Lock scroll & trap focus when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://formspree.io/f/xbdeakaz", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, phone, message }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function handleClose() {
    setStatus("idle");
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="modalBackdrop"
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Request a Quote"
    >
      <div className="modalPanel">
        {/* Close button */}
        <button className="modalClose" onClick={handleClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {status === "success" ? (
          <div className="modalSuccess">
            <div className="modalSuccessIcon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="13" stroke="#4FC3F7" strokeWidth="1.5"/>
                <path d="M8 14L12 18L20 10" stroke="#4FC3F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="modalSuccessTitle">Request Sent</h3>
            <p className="modalSuccessBody">
              Thanks! We&apos;ll review your request and get back to you within 48 hours.
            </p>
            <button className="btnPrimary" onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="modalHeader">
              <div className="sectionEyebrow" style={{ marginBottom: "0.75rem" }}>Get in Touch</div>
              <h2 className="modalTitle">Request a Quote</h2>
              <p className="modalSubtitle">
                Tell us about your project and we&apos;ll put together a proposal within 48 hours.
              </p>
            </div>

            <form className="modalForm" onSubmit={handleSubmit} noValidate>
              <div className="formGroup">
                <label className="formLabel" htmlFor="modal-email">Email Address</label>
                <input
                  ref={firstInputRef}
                  id="modal-email"
                  className="formInput"
                  type="email"
                  placeholder="you@city.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "sending"}
                />
              </div>

              <div className="formGroup">
                <label className="formLabel" htmlFor="modal-phone">Phone Number</label>
                <input
                  id="modal-phone"
                  className="formInput"
                  type="tel"
                  placeholder="+1 (780) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={status === "sending"}
                />
              </div>

              <div className="formGroup">
                <label className="formLabel" htmlFor="modal-message">Message</label>
                <textarea
                  id="modal-message"
                  className="formInput formTextarea"
                  placeholder="Tell us about your project — location, scale, timeline..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={status === "sending"}
                  rows={4}
                />
              </div>

              {status === "error" && (
                <p className="formError">
                  Something went wrong. Please try again or email us directly at hello@sparklebright.ca
                </p>
              )}

              <button
                className="btnPrimary formSubmit"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send Request"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
