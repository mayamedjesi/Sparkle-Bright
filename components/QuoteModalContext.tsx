"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface QuoteModalContextValue {
  openModal: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextValue>({ openModal: () => {} });

export function useQuoteModal() {
  return useContext(QuoteModalContext);
}

export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <QuoteModalContext.Provider value={{ openModal: () => setOpen(true) }}>
      {children}
      {/* Dynamically import to avoid SSR issues with the modal */}
      {open && (
        <ModalLoader open={open} onClose={() => setOpen(false)} />
      )}
    </QuoteModalContext.Provider>
  );
}

// Inline loader so we don't need a separate file
import QuoteModal from "./QuoteModal";
function ModalLoader({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <QuoteModal open={open} onClose={onClose} />;
}
