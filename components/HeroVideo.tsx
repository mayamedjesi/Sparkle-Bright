"use client";

import { useEffect, useRef } from "react";

/**
 * Background video for the hero.
 *
 * The source is attached on the client rather than baked into the markup, so a
 * phone on cellular never pulls the 1080p file. The `poster` renders
 * immediately either way, so there is no blank frame while this resolves.
 *
 * Skips the video entirely when the visitor has asked for reduced motion or
 * their browser reports a metered/slow connection — the poster alone is a
 * perfectly good hero background.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // `connection` is non-standard and absent in Safari/Firefox, hence the cast.
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return;

    // Small viewports and low-DPR screens can't resolve 1080p anyway.
    const wantsHd =
      window.matchMedia("(min-width: 900px)").matches &&
      window.innerWidth * (window.devicePixelRatio || 1) >= 1280;

    video.src = wantsHd ? "/hero.mp4" : "/hero-720.mp4";
    // autoPlay is unreliable when src is attached after mount, so nudge it.
    video.play().catch(() => {
      // Autoplay blocked or tab backgrounded — the poster stays visible.
    });
  }, []);

  return (
    <video
      ref={videoRef}
      className="heroBgVideo"
      poster="/hero-poster.webp"
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}
