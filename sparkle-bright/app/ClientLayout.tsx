"use client";


import { useState } from "react";


export default function ClientLayout({

  children,

}: {

  children: React.ReactNode;

}) {

  const [open, setOpen] = useState(false);


  return (

    <div style={pageWrapper}>
    	<header style={headerStyle}>
	  <div style={logoStyle}>
	    Sparkle Bright
	  </div>

	  <nav style={navStyle}>
		  <a href="/" style={navLink}>Home</a>
		  <a href="/light-pole-decorations" style={navLink}>Light Poles</a>
		  <a href="/string-lights-rgb" style={navLink}>String & RGB</a>
		  <a href="/animated-lighting" style={navLink}>Animated Lighting</a>
		  <a href="/city-airport-letters" style={navLink}>Letters</a>
		  <a href="/connecting-accessories" style={navLink}>Accessories</a>

		  <a href="/quote" style={ctaLink}>Request Quote</a>
	  </nav>
	</header>
	
	<main style={mainStyle}>{children}</main>

	<footer style={footerStyle}>

	  <div style={footerGrid}>

	    <div>
	      <h3>Sparkle Bright</h3>
	      <p style={{ opacity: 0.8 }}>
		Municipal & decorative lighting solutions for cities, airports, and commercial projects.
	      </p>
	    </div>

	    <div>
	      <h4>Contact</h4>
	      <p>Saskatoon: 306-400-9913</p>
	      <p>Calgary: 587-612-5674</p>
	    </div>

	    <div>
	      <h4>Location</h4>
	      <p>407 45th ST. West</p>
	      <p>Saskatoon, SK</p>
	    </div>

	    <div>
	      <h4>Quick Links</h4>
	      <p><a href="/quote">Request Quote</a></p>
	      <p><a href="/light-pole-decorations">Products</a></p>
	      <p><a href="/contact">Contact</a></p>
	    </div>

	  </div>

	  <div style={bottomBar}>
	    <p>
	      © {new Date().getFullYear()} Sparkle Bright. Bulk municipal orders eligible for 30% discount.
	    </p>
	  </div>

	</footer>
     </div>

  );

}

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem 2rem",
  backgroundColor: "#0a0f1e",
  color: "white",
  borderBottom: "1px solid #eee",
};

const footerStyle: React.CSSProperties = {
  backgroundColor: "#0a0f1e",
  color: "white",
  padding: "3rem 2rem 1rem",
};

const footerGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "2rem",
  maxWidth: "1800px",
  margin: "0 auto 2rem auto",
};

const footerGrid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "2rem",
  backgroundColor: "red",
  marginBottom: "2rem",
};

const bottomBar: React.CSSProperties = {
  borderTop: "1px solid #333",
  paddingTop: "1rem",
  fontSize: "0.85rem",
  opacity: 0.7,
  textAlign: "center",
};

const navLink: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  padding: "0.4rem 0.6rem",
  borderRadius: "6px",
  transition: "all 0.2s ease",
};

const topRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "1rem",
  alignItems: "center",
};

const logoStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "1.2rem",
};

const menuButton: React.CSSProperties = {
  fontSize: "1.5rem",
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "none", // hidden on desktop
};

const navStyle: React.CSSProperties = {
  display: "flex",
  color: "white",
  gap: "1rem",
  padding: "0 1rem 1rem",
  flexWrap: "wrap",
  alignItems: "center",
};

const mobileMenu: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  padding: "1rem",
  borderTop: "1px solid #eee",
};

const ctaLink: React.CSSProperties = {
  textDecoration: "none",
  backgroundColor: "#111",
  color: "#fff",
  padding: "0.5rem 0.8rem",
  borderRadius: "6px",
  marginLeft: "0.5rem",
};

const mainStyle: React.CSSProperties = {
  flex: 1,
};


const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
};

