"use client";

import { useEffect, useRef } from "react";

interface Light {
  x: number;
  y: number;
  color: [number, number, number];
  baseAlpha: number;
  alpha: number;
  phase: number;
  speed: number;
  size: number;
  /** Built once per light instead of per frame — see the animate loop. */
  glow: CanvasGradient | null;
}

const STRINGS = 6;
const BULBS_PER_STRING = 18;

export default function StringLights() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightsRef = useRef<Light[]>([]);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);

  function initLights(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const lights: Light[] = [];
    const w = canvas.width;
    const h = canvas.height;

    for (let s = 0; s < STRINGS; s++) {
      const yBase = (s + 0.5) * ((h * 0.7) / STRINGS) + h * 0.08;
      const amplitude = 18 + Math.random() * 14;
      const phaseShift = Math.random() * Math.PI * 2;

      for (let b = 0; b < BULBS_PER_STRING; b++) {
        const t = b / (BULBS_PER_STRING - 1);
        const x = w * 0.05 + t * w * 0.9;
        const droopFactor = 4 * t * (1 - t);
        const y =
          yBase +
          amplitude * droopFactor * 2 +
          Math.sin(t * Math.PI * 3 + phaseShift) * 8;
        // Warm palette: amber, gold, warm white, soft orange
        const rand = Math.random();
        const color: [number, number, number] =
          rand < 0.4  ? [255, 179, 71]  :  // amber --ice
          rand < 0.7  ? [255, 209, 102] :  // gold
          rand < 0.88 ? [255, 235, 180] :  // warm white
                        [255, 140, 40];    // deep orange accent
        lights.push({
          x,
          y,
          color,
          baseAlpha: 0.3 + Math.random() * 0.5,
          alpha: 0,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 1.2,
          size: 2.5 + Math.random() * 2,
          glow: null,
        });
      }
    }
    // Build each light's radial gradient once. The stops use fixed alphas and
    // per-frame brightness is applied via ctx.globalAlpha, which multiplies —
    // mathematically identical to rebuilding the gradient with scaled stops,
    // but without allocating a CanvasGradient per light per frame.
    for (const l of lights) {
      const [r, g, b] = l.color;
      const grad = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.size * 5);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},0.3)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      l.glow = grad;
    }

    lightsRef.current = lights;
  }

  function drawWire(ctx: CanvasRenderingContext2D, lights: Light[]) {
    ctx.strokeStyle = "rgba(255,179,71,0.08)";
    ctx.lineWidth = 1;
    for (let s = 0; s < STRINGS; s++) {
      const start = s * BULBS_PER_STRING;
      ctx.beginPath();
      for (let b = 0; b < BULBS_PER_STRING; b++) {
        const l = lights[start + b];
        if (b === 0) ctx.moveTo(l.x, l.y);
        else ctx.lineTo(l.x, l.y);
      }
      ctx.stroke();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas || !ctx) return;
      // Read both geometry values BEFORE writing either. Interleaving them
      // (read offsetWidth -> write canvas.width -> read offsetHeight)
      // invalidates layout between the reads and forces a second reflow.
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      initLights(canvas, ctx);
    }

    // Coalesce resize bursts into one reflow per frame.
    let resizePending = 0;
    function onResize() {
      if (resizePending) return;
      resizePending = requestAnimationFrame(() => {
        resizePending = 0;
        resize();
      });
    }

    resize();
    window.addEventListener("resize", onResize);

    // Visitors who ask for reduced motion get a single static frame.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Only animate while the canvas is actually on screen. Without this the
    // loop keeps rendering 108 lights every frame for the whole session, even
    // once the visitor has scrolled well past it.
    let onScreen = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = entry.isIntersecting;
        if (nowVisible === onScreen) return;
        onScreen = nowVisible;
        if (onScreen && !reducedMotion) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(rafRef.current);
        }
      },
      { rootMargin: "100px" },
    );
    io.observe(canvas);

    function drawFrame() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameRef.current++;

      const lights = lightsRef.current;
      drawWire(ctx, lights);

      const now = frameRef.current * 0.016;
      for (const l of lights) {
        l.alpha = l.baseAlpha + Math.sin(now * l.speed + l.phase) * 0.35;
        l.alpha = Math.max(0.05, Math.min(1, l.alpha));

        const [r, g, b] = l.color;

        ctx.globalAlpha = l.alpha;

        if (l.glow) {
          ctx.beginPath();
          ctx.arc(l.x, l.y, l.size * 5, 0, Math.PI * 2);
          ctx.fillStyle = l.glow;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(l.x, l.y, l.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();

        ctx.globalAlpha = 1;
      }

    }

    function animate() {
      drawFrame();
      rafRef.current = requestAnimationFrame(animate);
    }

    if (reducedMotion) {
      drawFrame();
    } else {
      animate();
    }

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      if (resizePending) cancelAnimationFrame(resizePending);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="lightsCanvas"
      aria-hidden="true"
    />
  );
}
