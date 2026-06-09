export default function CtaBand() {
  return (
    <div className="ctaBand" id="contact">
      <div className="sectionEyebrow" style={{ justifyContent: "center" }}>
        Get Started
      </div>
      <h2 className="ctaBandTitle">
        Ready to Light
        <br />
        Your City?
      </h2>
      <p className="ctaBandBody">
        Tell us about your project — location, scale, timeline — and we&apos;ll
        put together a proposal within 48 hours.
      </p>
      <a className="btnPrimary" href="mailto:hello@lumencivic.ca">
        Request a Quote
      </a>
      <p className="bulkDiscount">
        <span className="bulkDiscountBadge">30% off</span>
        Bulk municipal orders are eligible for a 30% discount.
      </p>
    </div>
  );
}
