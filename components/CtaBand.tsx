import QuoteButton from "./QuoteButton";

export default function CtaBand() {
  return (
    <div className="ctaBand" id="contact">
      <div className="sectionEyebrow" style={{ justifyContent: "center" }}>
        Get Started
      </div>
      <h2 className="ctaBandTitle">
        Let&apos;s Make Your
        <br />
        City Sparkle
      </h2>
      <p className="ctaBandBody">
        Tell us your city, your vision, and your timeline — we&apos;ll send back
        a proposal within 48 hours. Every great seasonal display starts with
        a single conversation.
      </p>
      <QuoteButton />
      <p className="bulkDiscount">
        <span className="bulkDiscountBadge">30% off</span>
        Bulk municipal orders are eligible for a 30% discount.
      </p>
    </div>
  );
}
