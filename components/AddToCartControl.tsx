"use client";

import { useState } from "react";
import { useCart } from "./CartContext";

interface AddToCartControlProps {
  name: string;
  image: string;
  category: string;
}

export default function AddToCartControl({ name, image, category }: AddToCartControlProps) {
  const { addItem, openCart } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Stop the card's outer click/navigation from firing
  const stop = (e: React.MouseEvent | React.KeyboardEvent) => e.stopPropagation();

  function changeQty(delta: number) {
    setQty((q) => Math.max(1, q + delta));
  }

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    addItem({ name, image, category }, qty);
    setJustAdded(true);
    setQty(1);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <div className="cartControl" onClick={stop} onKeyDown={stop}>
      <div className="qtyStepper" onClick={stop}>
        <button
          type="button"
          className="qtyBtn"
          onClick={(e) => { stop(e); changeQty(-1); }}
          aria-label={`Decrease quantity of ${name}`}
          disabled={qty <= 1}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 6H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <input
          type="number"
          className="qtyInput"
          value={qty}
          min={1}
          onClick={stop}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            setQty(Number.isNaN(v) ? 1 : Math.max(1, v));
          }}
          aria-label={`Quantity of ${name}`}
        />
        <button
          type="button"
          className="qtyBtn"
          onClick={(e) => { stop(e); changeQty(1); }}
          aria-label={`Increase quantity of ${name}`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2.5V9.5M2.5 6H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        className={`addToCartBtn ${justAdded ? "addToCartBtnAdded" : ""}`}
        onClick={handleAdd}
      >
        {justAdded ? (
          <>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M3 8L7 12L13 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Added
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M1.5 1.5H3L4 9.5H12.5L14 4H4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="5.5" cy="13" r="1" fill="currentColor" />
              <circle cx="11.5" cy="13" r="1" fill="currentColor" />
            </svg>
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
