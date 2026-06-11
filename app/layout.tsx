import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { QuoteModalProvider } from "@/components/QuoteModalContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SparkleBright — Municipal & Decorative Lighting",
  description:
    "High-quality Christmas lighting for cities, airports, commercial properties, and public spaces across Western Canada.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <QuoteModalProvider>{children}</QuoteModalProvider>
      </body>
    </html>
  );
}
