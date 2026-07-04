import QuoteButton from "./QuoteButton";

export default function Hero() {
  return (
    <div className="hero">
      {/* Background video */}
      <video
        className="heroBgVideo"
        src="/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className="heroBgOverlay" aria-hidden="true" />

      <div className="heroEyebrow">
        Municipal · Commercial · Seasonal Displays
      </div>

      <h1 className="heroTitle">
        Making Cities
        <br />
        <em>Sparkle!</em>
      </h1>

      <p className="heroSubtitle">
        SparkleBright specializes in the custom design and supply of seasonal
        lighting displays tailored to each community&apos;s unique identity. From
        iconic downtown landmarks to vibrant public gathering spaces, our curated
        lighting displays create memorable, photo-worthy experiences that attract
        visitors, encourage social sharing, and celebrate the unique character of
        your community — a welcoming atmosphere that inspires connection, pride,
        and wonder. Book your consultation today and let us help illuminate your
        community&apos;s story.
      </p>

      <div className="heroActions">
        <QuoteButton />
        <a className="btnGhost" href="/#services">
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
