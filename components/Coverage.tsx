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
        Serving All of
        <br />
        Western Canada
      </h2>
      <p className="sectionBody">
        From mid-sized municipalities to major metropolitan centres, we operate
        across every province and territory west of Ontario.
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
