const regions = [
  "British Columbia",
  "Alberta",
  "Saskatchewan",
  "Manitoba",
  "Yukon",
  "Northwest Territories",
  "Nunavut",
  "Vancouver",
  "Calgary",
  "Edmonton",
  "Winnipeg",
  "Saskatoon",
  "Kelowna",
  "Victoria",
];

export default function Coverage() {
  return (
    <section className="coverageSection" id="coverage">
      <div className="sectionEyebrow">Service Area</div>
      <h2 className="sectionTitle">
        Cities Across
        <br />
        Western Canada
      </h2>
      <p className="sectionBody">
        From mid-sized municipalities to major metropolitan centres, our team is
        on the ground across every province and territory west of Ontario. Wherever
        your city is, we&apos;re close enough to show up when it matters —
        and committed enough to make it sparkle.
      </p>
      <div className="coverageTags">
        {regions.map((region) => (
          <span key={region} className="coverageTag">
            {region}
          </span>
        ))}
      </div>
    </section>
  );
}
