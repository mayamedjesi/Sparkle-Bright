import Link from "next/link";
import StringLights from "./StringLights";

export default function Hero() {
  return (
    <div className="hero">
      <StringLights />

      {/* City silhouette SVG */}
      <svg
        className="heroCity"
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax meet"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="#4FC3F7"
          d="
            M0,320 L0,240 L30,240 L30,200 L50,200 L50,180 L70,180 L70,200 L90,200 L90,160
            L110,160 L110,120 L115,100 L120,120 L120,160 L140,160 L140,200 L160,200
            L160,140 L175,140 L175,120 L180,100 L185,120 L185,140 L200,140
            L200,220 L220,220 L220,180 L230,160 L240,180 L240,220 L260,220
            L260,200 L270,200 L270,240 L290,240 L290,180 L300,160 L310,150 L310,120
            L315,80 L320,120 L320,150 L330,160 L330,200 L340,200 L340,240 L360,240
            L360,200 L380,200 L380,170 L390,170 L390,140 L400,130 L410,140 L410,170
            L420,170 L420,200 L440,200 L440,230 L460,230 L460,180 L470,160
            L480,160 L480,100 L485,60 L490,100 L490,160 L500,160 L500,200 L510,200
            L510,230 L530,230 L530,200 L550,200 L550,160 L560,140 L570,160 L570,200
            L590,200 L590,240 L610,240 L610,190 L620,170 L630,170 L630,140 L640,120
            L645,90 L650,120 L650,140 L660,140 L660,180 L670,200 L670,240 L690,240
            L690,210 L700,190 L710,210 L710,240 L730,240 L730,200 L740,180 L750,180
            L750,160 L760,140 L770,160 L770,200 L780,200 L780,240 L800,240
            L800,200 L810,200 L810,170 L820,150 L830,170 L830,200 L840,200 L840,240
            L860,240 L860,200 L870,180 L880,160 L885,120 L890,160 L890,200 L900,200
            L900,230 L920,230 L920,190 L930,170 L940,190 L940,230 L960,230
            L960,200 L970,200 L970,170 L980,150 L985,100 L990,150 L990,200 L1000,200
            L1000,230 L1020,230 L1020,200 L1040,200 L1040,170 L1050,150 L1060,170
            L1060,200 L1080,200 L1080,230 L1100,230 L1100,190 L1110,180 L1120,180
            L1120,160 L1130,140 L1140,160 L1140,200 L1150,200 L1150,230 L1170,230
            L1170,200 L1180,200 L1180,170 L1190,150 L1200,170 L1200,220 L1220,220
            L1220,190 L1230,180 L1240,180 L1240,220 L1260,220 L1260,200 L1280,200
            L1280,180 L1290,160 L1300,140 L1305,100 L1310,140 L1310,180 L1320,200
            L1320,220 L1340,220 L1340,200 L1360,200 L1360,240 L1380,240 L1380,200
            L1400,200 L1400,240 L1440,240 L1440,320 Z
          "
        />
      </svg>

      <div className="heroEyebrow">
        Municipal · Commercial · Seasonal Displays
      </div>

      <h1 className="heroTitle">
        Lighting Cities,
        <br />
        <em>One Season</em>
        <br />
        at a Time
      </h1>

      <p className="heroSubtitle">
        High-quality decorative lighting for municipalities, airports, and
        commercial districts — built for Canadian winters, designed to impress.
      </p>

      <div className="heroActions">
        <a className="btnPrimary" href="#contact">
          Request a Quote
        </a>
        <a className="btnGhost" href="#services">
          Our Services
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 8H13M13 8L9 4M13 8L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <div className="scrollHint" aria-hidden="true">
        <div className="scrollLine" />
        Scroll
      </div>
    </div>
  );
}
