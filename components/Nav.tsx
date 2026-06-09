import Link from "next/link";

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="navLogo">
        Sparkle<span>Bright</span>
      </Link>
      <ul className="navLinks">
        <li><a href="#services">Services</a></li>
        <li><a href="#difference">Why Us</a></li>
        <li><a href="#coverage">Coverage</a></li>
      </ul>
      <a className="navCta" href="#contact">Request a Quote</a>
    </nav>
  );
}
