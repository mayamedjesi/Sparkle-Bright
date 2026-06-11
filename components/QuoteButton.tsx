"use client";

import { useQuoteModal } from "./QuoteModalContext";

interface QuoteButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function QuoteButton({ className = "btnPrimary", children = "Request a Quote" }: QuoteButtonProps) {
  const { openModal } = useQuoteModal();
  return (
    <button className={className} onClick={openModal} type="button">
      {children}
    </button>
  );
}
