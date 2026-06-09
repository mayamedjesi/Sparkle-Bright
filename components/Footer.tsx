export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerLogo">
        Sparkle<span>Bright</span>
      </div>
      <div className="footerCopy">
        © {new Date().getFullYear()} SparkleBright. All rights reserved.
      </div>
      <div className="footerTagline">Western Canada · Municipal Lighting</div>
    </footer>
  );
}
