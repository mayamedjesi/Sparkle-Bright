const differentiators = [
  {
    number: "01",
    title: "5-Day Replacement Guarantee",
    desc: "If a product fails, we replace it within five business days — no waiting, no negotiating, no excuses.",
  },
  {
    number: "02",
    title: "Western Canada, On the Ground",
    desc: "Our team is local. We don't ship from overseas and hope for the best — we're here, in your province, ready to respond.",
  },
  {
    number: "03",
    title: "Full 1-Year Product Warranty",
    desc: "Every product we supply is covered for a full year. The season doesn't end your protection.",
  },
  {
    number: "04",
    title: "Decade of Civic Experience",
    desc: "Ten-plus years working with municipalities means we understand procurement cycles, public accountability, and what 'done right' means to a city.",
  },
];

export default function Difference() {
  return (
    <div className="differenceSection" id="difference">
      <div className="diffContent">
        <div className="sectionEyebrow">The Difference</div>
        <h2 className="sectionTitle">
          We Show Up When
          <br />
          It Matters Most
        </h2>
        <p className="sectionBody">
          Winter installations are unforgiving. A bulb out on opening night, a
          strand down before the mayor&apos;s photo-op — those are the moments
          that define a vendor relationship.
        </p>

        <div className="diffList">
          {differentiators.map((item) => (
            <div key={item.number} className="diffItem fadeUp">
              <span className="diffNumber">{item.number}</span>
              <div>
                <div className="diffItemTitle">{item.title}</div>
                <p className="diffItemDesc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="diffVisual">
        <div className="goldBar" />
        <p className="diffQuote">
          &ldquo;The measure of a supplier isn&apos;t how they perform when
          everything goes right — it&apos;s how fast they move when it
          doesn&apos;t.&rdquo;
        </p>
        <div className="diffQuoteAttr">SparkleBright Operations Principle</div>
      </div>
    </div>
  );
}
