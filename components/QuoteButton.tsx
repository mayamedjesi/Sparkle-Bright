"use client";

import { useQuoteModal } from "./QuoteModalContext";

interface QuoteButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function QuoteButton({ className = "btnPrimary", children = "Contact Us" }: QuoteButtonProps) {
  const { openModal } = useQuoteModal();
  return (
    <button className={className} onClick={openModal} type="button">
      {children}
    </button>
  );
}
