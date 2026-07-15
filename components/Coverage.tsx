const regions = [
  "British Columbia",
  "Alberta",
  "Saskatchewan",
  "Manitoba",
  "Ontario",
  "Quebec",
  "New Brunswick",
  "Nova Scotia",
  "Prince Edward Island",
  "Newfoundland and Labrador",
  "Yukon",
  "Northwest Territories",
  "Nunavut",
  "Vancouver",
  "Calgary",
  "Edmonton",
  "Saskatoon",
  "Regina",
  "Winnipeg",
  "Toronto",
  "Ottawa",
  "Montreal",
  "Quebec City",
  "Halifax",
  "St. John's",
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
        Canada
      </h2>
      <p className="sectionBody">
        From mid-sized municipalities to major metropolitan centres, our team is
        on the ground in every province and territory, coast to coast. Wherever
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
