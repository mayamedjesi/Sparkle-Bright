"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { thumbnailImage } from "@/lib/responsiveImage";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpqevrbp";

type Status = "idle" | "sending" | "success" | "error";

export default function CartDrawer() {
  const { items, count, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCart();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    // Build a readable summary of the cart for the email body
    const itemLines = items
      .map((i, idx) => `${idx + 1}. ${i.name} (${i.category}) — Qty: ${i.quantity}`)
      .join("\n");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          requestType: "Cart quote request",
          name,
          email,
          ...(phone && { phone }),
          ...(message && { message }),
          totalItems: count,
          cartSummary: itemLines,
          cart: items.map((i) => ({
            product: i.name,
            category: i.category,
            quantity: i.quantity,
          })),
        }),
      });

      if (res.ok) {
        setStatus("success");
        clearCart();
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setShowForm(false);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function handleClose() {
    closeCart();
    // Reset transient UI after the close animation
    window.setTimeout(() => {
      if (status === "success") setStatus("idle");
    }, 300);
  }

  return (
    <>
      <div
        className={`cartOverlay ${isOpen ? "cartOverlayOpen" : ""}`}
        onClick={handleClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`cartDrawer ${isOpen ? "cartDrawerOpen" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Your quote cart"
      >
        <div className="cartHeader">
          <h2 className="cartTitle">
            Your Cart
            {count > 0 && <span className="cartTitleCount">{count}</span>}
          </h2>
          <button className="cartCloseBtn" onClick={handleClose} aria-label="Close cart">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {status === "success" ? (
          <div className="cartSuccess">
            <div className="cartSuccessIcon">
              <svg width="30" height="30" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="13" stroke="#4FC3F7" strokeWidth="1.5" />
                <path d="M8 14L12 18L20 10" stroke="#4FC3F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="cartSuccessTitle">Quote Requested</h3>
            <p className="cartSuccessBody">
              Thanks! We&apos;ve received your product list and will get back to you with a
              tailored quote within 48 hours.
            </p>
            <button className="btnPrimary" onClick={handleClose}>Done</button>
          </div>
        ) : items.length === 0 ? (
          <div className="cartEmpty">
            <svg width="36" height="36" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M1.5 1.5H3L4 9.5H12.5L14 4H4.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="5.5" cy="13" r="1" fill="currentColor" />
              <circle cx="11.5" cy="13" r="1" fill="currentColor" />
            </svg>
            <p className="cartEmptyText">Your cart is empty.</p>
            <p className="cartEmptySub">Add products to build a quote request.</p>
            <button className="btnPrimary" onClick={handleClose}>Browse Products</button>
          </div>
        ) : (
          <>
            <div className="cartItems">
              {items.map((item) => (
                <div className="cartItem" key={item.name}>
                  <img
                    {...thumbnailImage(item.image)}
                    alt={item.name}
                    className="cartItemImg"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="cartItemInfo">
                    <div className="cartItemName">{item.name}</div>
                    <div className="cartItemCat">{item.category}</div>
                    <div className="cartItemControls">
                      <div className="qtyStepper qtyStepperSm">
                        <button
                          type="button"
                          className="qtyBtn"
                          onClick={() => updateQuantity(item.name, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          disabled={item.quantity <= 1}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 6H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          className="qtyInput"
                          value={item.quantity}
                          min={1}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            updateQuantity(item.name, Number.isNaN(v) ? 1 : v);
                          }}
                          aria-label={`Quantity of ${item.name}`}
                        />
                        <button
                          type="button"
                          className="qtyBtn"
                          onClick={() => updateQuantity(item.name, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2.5V9.5M2.5 6H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cartItemRemove"
                        onClick={() => removeItem(item.name)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cartFooter">
              {!showForm ? (
                <>
                  <div className="cartFooterMeta">
                    <span>{count} item{count !== 1 ? "s" : ""}</span>
                    <button className="cartClearBtn" onClick={clearCart}>Clear cart</button>
                  </div>
                  <button className="btnPrimary cartQuoteBtn" onClick={() => setShowForm(true)}>
                    Request a Quote
                  </button>
                </>
              ) : (
                <form className="cartForm" onSubmit={handleSubmit} noValidate>
                  <div className="formGroup">
                    <label className="formLabel" htmlFor="cart-name">Your Name</label>
                    <input
                      id="cart-name"
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
                    <label className="formLabel" htmlFor="cart-email">Email Address</label>
                    <input
                      id="cart-email"
                      className="formInput"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={status === "sending"}
                    />
                  </div>
                  <div className="formGroup">
                    <label className="formLabel" htmlFor="cart-phone">Phone <span className="formOptional">(optional)</span></label>
                    <input
                      id="cart-phone"
                      className="formInput"
                      type="tel"
                      placeholder="587-612-5674"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={status === "sending"}
                    />
                  </div>
                  <div className="formGroup">
                    <label className="formLabel" htmlFor="cart-message">Project Details <span className="formOptional">(optional)</span></label>
                    <textarea
                      id="cart-message"
                      className="formInput formTextarea"
                      placeholder="Location, timeline, project details..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={status === "sending"}
                      rows={3}
                    />
                  </div>

                  {status === "error" && (
                    <p className="formError">
                      Something went wrong. Please try again or email us at hello@sparklebright.ca
                    </p>
                  )}

                  <div className="cartFormActions">
                    <button
                      type="button"
                      className="cartFormBack"
                      onClick={() => setShowForm(false)}
                      disabled={status === "sending"}
                    >
                      Back
                    </button>
                    <button className="btnPrimary cartQuoteBtn" type="submit" disabled={status === "sending"}>
                      {status === "sending" ? "Sending…" : `Send Quote Request (${count})`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
