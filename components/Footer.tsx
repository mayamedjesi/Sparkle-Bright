export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerLogo">
        Sparkle<span>Bright</span>
      </div>
      <div className="footerCopy">
        © {new Date().getFullYear()} SparkleBright. All rights reserved.
      </div>
      <div className="footerTagline">Canada-Wide · Municipal Lighting</div>
    </footer>
  );
}
