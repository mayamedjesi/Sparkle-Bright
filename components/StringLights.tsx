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
}

const STRINGS = 6;
const BULBS_PER_STRING = 18;

export default function StringLights() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightsRef = useRef<Light[]>([]);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);

  function initLights(canvas: HTMLCanvasElement) {
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
        });
      }
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
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initLights(canvas);
    }

    resize();
    window.addEventListener("resize", resize);

    function animate() {
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
        const glow = ctx.createRadialGradient(
          l.x, l.y, 0,
          l.x, l.y, l.size * 5
        );
        glow.addColorStop(0, `rgba(${r},${g},${b},${l.alpha * 0.9})`);
        glow.addColorStop(0.4, `rgba(${r},${g},${b},${l.alpha * 0.3})`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(l.x, l.y, l.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(l.x, l.y, l.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${l.alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
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
