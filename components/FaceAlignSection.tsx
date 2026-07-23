"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { categories } from "@/lib/products";

const lightingStructuresCategory = categories.find((c) => c.id === "lighting-structures")!;

// Face-board faceProducts — green-fill cutouts for chroma-keying.
// Only the dedicated face board is offered right now.
const faceProducts = [
  {
    name: "Santa & Reindeer",
    desc: "Step inside the display — align your face with Santa or Rudolph.",
    tag: "Featured" as const,
    url: "#",
    image: "/SantaReindeerFaceBoard.webp",
  },
];

type Bounds = { x: number; y: number; w: number; h: number };

// Single source of truth for "is this pixel part of the green mask?" —
// used by both bounding-box detection and the knockout pass so the two
// steps can never disagree on what counts as green.
function isGreenPixel(r: number, g: number, b: number, a: number): boolean {
  return a > 128 && g > 80 && g > r * 1.4 && g > b * 1.4 && g - r > 30 && g - b > 30;
}

// ── Step: Detect green mask -> Compute bounding box ───────────────────────
// Scans pixel data and returns the bounding box of every pixel matching
// the green mask (the face cutout).
function detectGreenBounds(imgData: ImageData, width: number, height: number): Bounds | null {
  const d = imgData.data;
  let minX = width, maxX = 0, minY = height, maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (isGreenPixel(d[i], d[i + 1], d[i + 2], d[i + 3])) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        found = true;
      }
    }
  }

  if (!found) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

// ── Steps: Template -> Detect green mask -> Compute bounding box -> Apply green mask ──
// Runs once per template (on load). Draws the source template, detects the
// green mask and its bounding box, then knocks out every matched pixel so
// the result can simply be overlaid on top of the captured photo.
function buildMaskedTemplate(
  img: HTMLImageElement,
  width: number,
  height: number,
): { canvas: HTMLCanvasElement; bounds: Bounds | null } {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const bounds = detectGreenBounds(imgData, width, height);

  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    if (isGreenPixel(d[i], d[i + 1], d[i + 2], d[i + 3])) {
      d[i + 3] = 0; // apply the mask: knock this pixel out
    }
  }
  ctx.putImageData(imgData, 0, 0);

  return { canvas, bounds };
}

// ── Capture compositor — runs once, when the picture is taken ─────────────
// 1. Black background.
// 2. Draw the resized photo into the (precomputed) bounding box.
// 3. Apply a warm light overlay to the photo, so it blends with the warm
//    string-light glow of the templates instead of looking like a flat,
//    neutral webcam frame.
// 4. Overlay original template — the precomputed masked template, which
//    already has the green mask applied, revealing the photo only through
//    its knocked-out region.
function drawComposite(
  ctx: CanvasRenderingContext2D,
  source: HTMLVideoElement,
  maskedTemplate: HTMLCanvasElement,
  bounds: Bounds | null,
  width: number,
  height: number,
) {
  // 1. Black background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  // 2. Draw resized photo into the box
  if (bounds) {
    const { x, y, w, h } = bounds;

    // Fill the box with the photo, keeping aspect ratio (cover)
    const vw = source.videoWidth  || width;
    const vh = source.videoHeight || height;
    const scale = Math.max(w / vw, h / vh); // cover
    const sw = vw * scale;
    const sh = vh * scale;
    const ox = x + (w - sw) / 2;
    const oy = y + (h - sh) / 2;

    ctx.save();
    // Clip to the box so the photo doesn't bleed outside it
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    // Mirror horizontally around the right edge of the *scaled image's own*
    // rect (ox + sw), not the box's edge (x + w) — those only coincide when
    // there's no horizontal overhang. Since "cover" fit almost always
    // overhangs one axis (e.g. a wide 16:9 webcam feed covering a roughly
    // square cutout), mirroring around the box edge shifts the whole image
    // sideways by half that overhang, which can push it completely outside
    // the clipped box — showing the black background instead of the photo.
    ctx.translate(ox + sw, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(source, 0, oy, sw, sh);
    ctx.restore();

    // 3. Warm light overlay — tints the captured photo so it blends with the
    // warm string-light glow of the templates, instead of looking like a
    // flat, neutral webcam frame. Re-clip to the same box (transform reset
    // by the restore above) so the tint stays within the cutout.
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.fillStyle = "rgba(255, 184, 92, 0.28)";
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillRect(x, y, w, h);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(255, 158, 60, 0.12)";
    ctx.fillRect(x, y, w, h);
    ctx.restore();
  }

  // 4. Overlay original template (mask already applied)
  ctx.drawImage(maskedTemplate, 0, 0, width, height);
}

export default function FaceAlignSection() {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const rafRef      = useRef<number>(0);
  const imgRef      = useRef<HTMLImageElement | null>(null);
  const maskedTemplateRef = useRef<HTMLCanvasElement | null>(null);
  const boundsRef         = useRef<Bounds | null>(null);

  const [cameraOn,    setCameraOn]    = useState(false);
  const [captured,    setCaptured]    = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeIdx,   setActiveIdx]   = useState(0);
  const [imgSize,     setImgSize]     = useState<{ w: number; h: number } | null>(null);
  const [greenBounds, setGreenBounds] = useState<Bounds | null>(null);

  const currentProduct = faceProducts[activeIdx];

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
  }, []);

  // Stop and release the camera stream, without touching anything already
  // drawn on the canvas (used both when cancelling and right after a photo
  // is taken — a photo doesn't need a live camera feed anymore).
  const releaseStream = useCallback(() => {
    stopLoop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, [stopLoop]);

  // Pre-load the product image whenever activeIdx changes, and run the
  // Template -> Detect green mask -> Compute bounding box -> Apply green mask
  // pipeline once up front.
  useEffect(() => {
    if (!currentProduct) return;

    // Switching products invalidates any live preview or captured photo
    // for the previous template.
    releaseStream();
    setCameraOn(false);
    setCaptured(false);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;

      try {
        const { canvas: masked, bounds } = buildMaskedTemplate(img, img.naturalWidth, img.naturalHeight);
        maskedTemplateRef.current = masked;
        boundsRef.current = bounds;
        setGreenBounds(bounds);
      } catch (err) {
        // If this throws (e.g. a tainted canvas from a cross-origin image),
        // log it so the cause is visible in devtools rather than failing silently.
        console.error("FaceAlign: failed to build masked template", err);
        maskedTemplateRef.current = null;
        boundsRef.current = null;
        setGreenBounds(null);
      }

      setImgSize({ w: img.naturalWidth, h: img.naturalHeight });

      // Resize the visible canvas to match the template image
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
    };
    img.onerror = () => {
      imgRef.current = null;
      maskedTemplateRef.current = null;
      boundsRef.current = null;
    };
    img.src = currentProduct.image;
  }, [activeIdx, currentProduct, releaseStream]);

  // Live viewfinder loop — just the plain mirrored camera feed, so the
  // person can align themselves using the on-screen guide ring. No
  // compositing happens here; that only happens once, when the picture
  // is taken.
  const startLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      if (!ctx || !video || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const w = canvas!.width;
      const h = canvas!.height;
      if (w === 0 || h === 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -w, 0, w, h);
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setCaptured(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      // Size canvas to match the product image (not the video resolution)
      const canvas = canvasRef.current!;
      const img = imgRef.current;
      if (img && img.naturalWidth > 0) {
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
      } else {
        canvas.width  = video.videoWidth  || 1024;
        canvas.height = video.videoHeight || 1024;
      }

      setCameraOn(true);
      startLoop();
    } catch {
      setCameraError("Camera access was denied or is unavailable on this device.");
    }
  }, [startLoop]);

  // Cancel out of the live preview entirely, back to the placeholder.
  const stopCamera = useCallback(() => {
    releaseStream();
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setCameraOn(false);
    setCaptured(false);
  }, [releaseStream]);

  // Take the picture: draw the current camera frame, resized, into the
  // bounding box, then overlay the masked template on top — a single,
  // one-time composite rather than a continuous per-frame one. The camera
  // is then released since a live feed isn't needed once the photo is taken.
  const takePicture = useCallback(() => {
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maskedTemplate = maskedTemplateRef.current;
    if (maskedTemplate) {
      drawComposite(ctx, video, maskedTemplate, boundsRef.current, canvas.width, canvas.height);
    } else {
      // Template not ready yet — just freeze the mirrored frame
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    releaseStream();
    setCameraOn(false);
    setCaptured(true);
  }, [releaseStream]);

  const retakePhoto = useCallback(() => {
    setCaptured(false);
    startCamera();
  }, [startCamera]);

  useEffect(() => () => {
    releaseStream();
  }, [releaseStream]);

  const prev = () => setActiveIdx((i) => (i - 1 + faceProducts.length) % faceProducts.length);
  const next = () => setActiveIdx((i) => (i + 1) % faceProducts.length);

  return (
    <section className="faceAlignSection" id="try-on">
      <div className="faceAlignInner">

        {/* Header */}
        <div className="faceAlignHeader">
          <div className="sectionEyebrow">Try It On</div>
          <h2 className="sectionTitle">
            See the Magic<br />Around You
          </h2>
          <p className="sectionBody">
            Open your camera, align your face in the guide, and take a picture
            to see yourself inside one of our Lighting Structures. Select
            &ldquo;View Listing&rdquo; to explore these products.
          </p>
        </div>

        {/* Viewport — sized to match the current product image */}
        <div
          className="faceAlignViewport"
          style={imgSize ? { aspectRatio: `${imgSize.w} / ${imgSize.h}` } : undefined}
        >

          {/* Hidden video element — used as source for canvas compositor.
              Kept off-screen rather than display:none, since some browsers
              (notably iOS Safari) stop decoding frames for display:none
              video elements, which would make drawImage(video) draw nothing. */}
          <video
            ref={videoRef}
            style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
            autoPlay
            playsInline
            muted
          />

          {/* Canvas — shows the live viewfinder, then the captured photo */}
          <canvas
            ref={canvasRef}
            className="faceAlignCanvas"
            style={{ display: (cameraOn || captured) ? "block" : "none" }}
          />

          {/* Placeholder when camera is off and no photo has been taken —
              shows the template image itself as a preview so people can see
              what they're stepping into before opening the camera. */}
          {!cameraOn && !captured && (
            <div className="faceAlignPlaceholder">
              {currentProduct && (
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="faceAlignPlaceholderBg"
                  decoding="async"
                />
              )}
              <div className="faceAlignPlaceholderOverlay" aria-hidden="true" />
              <div className="faceAlignPlaceholderContent">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="4" y="10" width="40" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.8"/>
                  <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="1.5" opacity="0.8"/>
                  <path d="M18 10L20 6H28L30 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                </svg>
                <p className="faceAlignPlaceholderText">
                  {cameraError ?? "Open your camera to step inside the lights"}
                </p>
                {cameraError && (
                  <p className="faceAlignPlaceholderSub">Check your browser permissions and try again.</p>
                )}
              </div>
            </div>
          )}

          {/* Face guide ring — shown only while aligning, before the photo is taken */}
          {cameraOn && !captured && greenBounds && imgSize && (() => {
            const pctX = (greenBounds.x / imgSize.w) * 100;
            const pctY = (greenBounds.y / imgSize.h) * 100;
            const pctW = (greenBounds.w / imgSize.w) * 100;
            const pctH = (greenBounds.h / imgSize.h) * 100;
            return (
              <>
                <div
                  className="faceAlignGuide"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left:   `${pctX}%`,
                    top:    `${pctY}%`,
                    width:  `${pctW}%`,
                    height: `${pctH}%`,
                    inset: "unset",
                  }}
                >
                  <div className="faceAlignRing" style={{ width: "100%", height: "100%" }} />
                </div>
                <span className="faceAlignGuideLabel faceAlignGuideLabelTop" aria-hidden="true">
                  Center your face in the ring
                </span>
              </>
            );
          })()}

          {/* Product name badge */}
          {(cameraOn || captured) && currentProduct && (
            <div className="faceAlignBadge">
              {currentProduct.tag && <span className="faceAlignTag">{currentProduct.tag}</span>}
              <span className="faceAlignProductName">{currentProduct.name}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="faceAlignControls">
          {captured ? (
            <button className="faceAlignCameraBtn faceAlignCameraBtnOn" onClick={retakePhoto}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 8a6 6 0 0110.2-4.2M14 8a6 6 0 01-10.2 4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M12.2 2.2V5h-2.8M3.8 13.8V11h2.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Retake Photo
            </button>
          ) : cameraOn ? (
            <button className="faceAlignCameraBtn faceAlignCameraBtnOn" onClick={takePicture}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="1" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <circle cx="8" cy="9" r="3" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5.5 4L6.5 2.5H9.5L10.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Take Picture
            </button>
          ) : (
            <button className="faceAlignCameraBtn" onClick={startCamera}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="1" y="4" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M11 6.5L15 4.5V11.5L11 9.5V6.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
              Open Camera
            </button>
          )}

          {(cameraOn || captured) && (
            <button type="button" className="galleryClearFilters" onClick={stopCamera}>
              Close
            </button>
          )}

          {faceProducts.length > 1 && (
            <div className="faceAlignNav">
              <button className="faceAlignNavBtn" onClick={prev} aria-label="Previous product">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="faceAlignDots">
                {faceProducts.map((_, i) => (
                  <button key={i} className={`faceAlignDot ${i === activeIdx ? "faceAlignDotActive" : ""}`} onClick={() => setActiveIdx(i)} aria-label={`Product ${i + 1}`} />
                ))}
              </div>
              <button className="faceAlignNavBtn" onClick={next} aria-label="Next product">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {currentProduct && (
            <a className="btnPrimary faceAlignViewBtn" href={lightingStructuresCategory.seeAllUrl}>
              View Listing
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          )}
        </div>

      </div>
    </section>
  );
}
