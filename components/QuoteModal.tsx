"use client";

import { useEffect, useRef, useState } from "react";

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "sending" | "success" | "error";

export default function QuoteModal({ open, onClose }: QuoteModalProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [wantsCall, setWantsCall] = useState(false);
  const [phone, setPhone] = useState("");
  const [wantsCatalogue, setWantsCatalogue] = useState(false);
  const [catalogueEmail, setCatalogueEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const backdropRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const catalogueEmailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuoteOpen(false);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open && quoteOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open, quoteOpen]);

  useEffect(() => {
    if (wantsCall) {
      setTimeout(() => phoneInputRef.current?.focus(), 50);
    }
  }, [wantsCall]);

  useEffect(() => {
    if (wantsCatalogue) {
      setTimeout(() => catalogueEmailInputRef.current?.focus(), 50);
    }
  }, [wantsCatalogue]);

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

  function resetForm() {
    setQuoteOpen(false);
    setName("");
    setMessage("");
    setWantsCall(false);
    setPhone("");
    setWantsCatalogue(false);
    setCatalogueEmail("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://formspree.io/f/xpqevrbp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          requestType: "Quote request",
          name,
          message,
          callbackRequested: wantsCall,
          ...(wantsCall && { phone }),
          catalogueRequested: wantsCatalogue,
          ...(wantsCatalogue && { catalogueEmail }),
        }),
      });

      if (res.ok) {
        setStatus("success");
        resetForm();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function handleClose() {
    setStatus("idle");
    resetForm();
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
        <button className="modalClose" onClick={handleClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="modalSuccess">
            <div className="modalSuccessIcon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="13" stroke="#4FC3F7" strokeWidth="1.5" />
                <path d="M8 14L12 18L20 10" stroke="#4FC3F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="modalSuccessTitle">Request Sent</h3>
            <p className="modalSuccessBody">
              Thanks! We&apos;ll review your request and get back to you within 48 hours. Making Cities Sparkle! — one project at a time.
            </p>
            <button className="btnPrimary" onClick={handleClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="modalHeader">
              <div className="sectionEyebrow" style={{ marginBottom: "0.75rem" }}>Get in Touch</div>
              <h2 className="modalTitle">Contact Us</h2>

              <div className="modalContactSplit">
                <a className="modalCallBtn" href="tel:5876125674">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M3 2C3 1.45 3.45 1 4 1h2.5c.4 0 .75.27.87.65L8.22 4.1c.13.4 0 .84-.32 1.1L6.7 6.3C7.53 8 8 8.47 9.7 9.3l1.1-1.2c.26-.32.7-.45 1.1-.32l2.45.85c.38.12.65.47.65.87V12c0 .55-.45 1-1 1C5.5 13 2 9.5 2 5c0-.55.45-1 1-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
                  </svg>
                  Call Us Now
                  <span className="modalCallNumber">587-612-5674</span>
                </a>

                <span className="modalContactOr">— or —</span>

                <button
                  type="button"
                  className={`modalEmailToggle ${quoteOpen ? "modalEmailToggleActive" : ""}`}
                  onClick={() => setQuoteOpen((v) => !v)}
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M1.5 3.5L8 9L14.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  Request a Quote
                </button>
              </div>
            </div>

            {quoteOpen && (
              <form className="modalForm" onSubmit={handleSubmit} noValidate>
                <div className="formGroup">
                  <label className="formLabel" htmlFor="modal-name">Your Name</label>
                  <input
                    ref={firstInputRef}
                    id="modal-name"
                    className="formInput"
                    type="text"
                    placeholder="Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={status === "sending"}
                  />
                </div>

                <div className="formGroup">
                  <label className="modalCheckboxCard">
                    <input
                      type="checkbox"
                      checked={wantsCall}
                      onChange={(e) => setWantsCall(e.target.checked)}
                      disabled={status === "sending"}
                    />
                    Yes, I want to receive a call
                  </label>
                </div>

                {wantsCall && (
                  <div className="formGroup">
                    <label className="formLabel" htmlFor="modal-phone">Phone Number</label>
                    <input
                      ref={phoneInputRef}
                      id="modal-phone"
                      className="formInput"
                      type="tel"
                      placeholder="587-612-5674"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={status === "sending"}
                    />
                  </div>
                )}

                <div className="formGroup">
                  <label className="modalCheckboxCard">
                    <input
                      type="checkbox"
                      checked={wantsCatalogue}
                      onChange={(e) => setWantsCatalogue(e.target.checked)}
                      disabled={status === "sending"}
                    />
                    I want the product catalogue emailed to me
                  </label>
                </div>

                {wantsCatalogue && (
                  <div className="formGroup">
                    <label className="formLabel" htmlFor="catalogue-email">Email Address</label>
                    <input
                      ref={catalogueEmailInputRef}
                      id="catalogue-email"
                      className="formInput"
                      type="email"
                      placeholder="you@example.com"
                      value={catalogueEmail}
                      onChange={(e) => setCatalogueEmail(e.target.value)}
                      required
                      disabled={status === "sending"}
                    />
                  </div>
                )}

                <div className="formGroup">
                  <label className="formLabel" htmlFor="modal-message">Project Details</label>
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
                  {status === "sending" ? "Sending…" : "Request Quote"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
