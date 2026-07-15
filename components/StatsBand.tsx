const stats = [
  { number: "10+", label: "Years Experience" },
  { number: "1 Year", label: "Product Warranty" },
  { number: "5 Days", label: "Replacement Commitment" },
  { number: "100%", label: "Canada-Wide Support" },
];

export default function StatsBand() {
  return (
    <div className="statsBand">
      {stats.map((stat) => (
        <div key={stat.label} className="statItem fadeUp">
          <div className="statNumber">{stat.number}</div>
          <div className="statLabel">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
