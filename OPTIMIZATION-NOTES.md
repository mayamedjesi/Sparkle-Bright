# Asset Optimization Notes

## Results

| | Before | After | Change |
|---|---|---|---|
| `public/` total | 484 MB | 56 MB | **-88%** |
| Gallery page images (desktop) | 318.5 MB | 18.8 MB | **-94%** |
| Gallery page images (mobile) | 318.5 MB | 6.7 MB | **-98%** |
| Hero video (1080p) | 23.4 MB | 9.4 MB | **-60%** |
| Hero video (mobile 720p) | 23.4 MB | 4.8 MB | **-80%** |

## What changed

**1. All raster assets converted to WebP (quality 82).**
203 PNG/JPG files became WebP at identical dimensions — 320 MB down to 29 MB.
These are dark, softly-shaded renders, so they compress extremely well with
essentially no visible difference. The 50 files already in WebP were left alone;
they were fine.

**2. Responsive thumbnails.**
Each image now also ships at 480w and 960w. Product cards render roughly 350 CSS
pixels wide, but were downloading full 1122x1402 originals. `lib/responsiveImage.ts`
builds accurate `srcset`/`sizes` from `lib/imageDimensions.ts` (auto-generated),
so the grid pulls a ~30-90 KB thumbnail and the full-size file is only fetched
when the lightbox opens.

**3. Hero video re-encoded.**
The original was 1920x1080 at 9.5 Mbps (23.4 MB). This footage is genuinely
expensive to compress — falling snow over dense bokeh lights is close to the
worst case for inter-frame prediction, since thousands of high-contrast specks
move independently every frame. Simply lowering the bitrate destroys exactly
the detail that makes the shot work.

Final settings: **full 1920x1080**, H.264 CRF 23, `aq-mode=3` with tuned
psy-rd and deblocking so bits go to the dark areas where banding shows, audio
stripped, `+faststart` for progressive playback. The loop is trimmed from 19.5s
to 10s — the shot is continuous with no scene cuts, so a shorter loop is
visually identical frame-for-frame and cuts the file roughly in half. That is
the only lever here that costs no quality at all.

A 720p variant at the same CRF is served to phones and small viewports.

| | Size | SSIM vs original |
|---|---|---|
| Original | 23.4 MB | — |
| `hero.mp4` (1080p, 10s) | 9.4 MB | 0.991 |
| `hero-720.mp4` (720p, 10s) | 4.8 MB | 0.977 |

SSIM above ~0.99 is where differences stop being visible in normal viewing.

`components/HeroVideo.tsx` attaches the source on the client, so phones never
download the 1080p file. It also skips the video entirely for visitors with
`prefers-reduced-motion` set or a metered/slow connection — the poster alone
works fine as a hero background. `preload="none"` plus the poster means the
hero paints instantly and the video streams in behind it.

I also tested VP9/WebM — it came out *larger* than H.264 on this footage, so no
`<source>` fallback was added.

**4. Dead assets removed from `public/`.**
- `_unused-assets/` (155 MB) — 72 files nothing referenced, including a 12 MB
  `lights.svg`, unused catalogue "series" images, and the default Next.js SVGs.
- `_superseded-originals/` (301 MB) — the PNG/JPG sources now replaced by WebP.
  Notably 50 of these were already dead before this pass: someone had converted
  them to WebP and updated the references, but left the PNGs behind.

These files are *not* included in this archive (your original zip still has
them). Full inventories are in `REMOVED-unreferenced.txt` and
`REMOVED-superseded-originals.txt` if you want to restore any of them.

**5. Loading hints.** Added `loading="lazy"` and `decoding="async"` to grid and
cart images (the gallery grid had no lazy loading at all).

## Deliberately left alone

`FaceAlignSection` loads the full-size template into a canvas for chroma-key
compositing, so its placeholder `<img>` still points at the full-size file — that
way both share one cache entry instead of downloading two sizes.

## Suggested next step

The site uses plain `<img>` throughout. Migrating to `next/image` would give you
automatic format negotiation (AVIF), on-demand resizing, and blur placeholders
without maintaining the thumbnail files by hand. The `responsiveImage()` helper is
a drop-in stopgap that gets most of the benefit with no build-pipeline changes.

## Regenerating

`optimize_images.py` (included) reruns the conversion. Point `PUB` at `public/`
and give it a list of filenames.

---

## Follow-up: forced reflow & the animation loop

Chasing a 35 ms forced-reflow warning turned up something larger in
`StringLights`.

**The reflow itself** was in the canvas resize handler:

```js
canvas.width  = canvas.offsetWidth;   // read, then write
canvas.height = canvas.offsetHeight;  // write above invalidated layout -> second reflow
```

Reading both dimensions before writing either collapses that to one layout
pass. The `resize` listener is also rAF-coalesced now, so dragging a window
edge no longer triggers a reflow plus a full `initLights()` per event.

**The bigger find:** the animation loop was calling `createRadialGradient()`
once per light per frame — 6 strings x 18 bulbs = 108 gradient objects every
frame, ~6,500 allocations per second, for the entire session. The gradients are
now built once in `initLights()` and per-frame brightness is applied with
`ctx.globalAlpha`. That is mathematically identical, since `globalAlpha`
multiplies source alpha: a stop of `rgba(r,g,b,0.9)` drawn at `globalAlpha = A`
produces exactly the `0.9 * A` the old code baked into the stop. The animation
looks the same.

The loop also ran forever regardless of whether the canvas was on screen. It is
now gated behind an `IntersectionObserver` and skipped entirely for visitors
with `prefers-reduced-motion` set, who get one static frame instead.

`BackToTop` read `window.scrollY` on every scroll event; that read is now
rAF-throttled.

Worth being clear: the 35 ms reflow was never the real cost here. The
per-frame gradient allocation was, and it does not show up in that particular
Lighthouse insight at all.

---

## Follow-up: LCP element render delay (2,540 ms)

The LCP element is `<p class="heroSubtitle">` — text, not an image — with the
whole 2,540 ms sitting in **element render delay** and 0 ms in TTFB. That means
the markup was there and the browser could not paint it. Ruled out first:

- The hero is server-rendered, not client-gated.
- It does not use `.fadeUp`, so no reveal animation is holding it back.
- Render-blocking CSS accounts for ~150 ms of it, not 2,500.

**The cause is main-thread blocking.** `FaceAlignSection` mounts on the
homepage and, as soon as its template image loaded, ran `buildMaskedTemplate()`
synchronously: `getImageData` over a 1122x1402 image, a green-bounds detection
pass, a full per-pixel loop (~6.3M array operations), then `putImageData`. On a
throttled mobile CPU that is comfortably long enough to swallow the hero paint
— and it ran for every visitor, including the overwhelming majority who never
open the camera.

That work is now in `ensureMaskedTemplate()`, called from `startCamera()`. The
mount path only records the image's natural dimensions, which is all the layout
needs. The mask is built once, on first camera open, and cached per template.

### Also found: the fonts are downloaded but almost entirely unused

`layout.tsx` loads **10 font files** — Playfair Display at 3 weights x 2 styles,
Inter at 4 weights — and `next/font` preloads all of them.

But `next/font` registers a hashed family name and exposes it via a CSS
variable. Of the 22 `font-family` declarations in `globals.css`, only **3** use
`var(--font-playfair)` / `var(--font-inter)`, and all three are in the cart
drawer. The other 19 — including `body` — ask for the literal names `'Inter'`
and `'Playfair Display'`, which are never registered:

```css
body { font-family: 'Inter', sans-serif; }        /* falls back to system sans */
.heroTitle { font-family: 'Playfair Display', serif; }  /* falls back to system serif */
```

So the site renders in system fallback fonts everywhere except the cart, while
still paying to preload 10 font files on the critical path.

Two ways to resolve it, and they point in opposite directions, so it is worth
deciding deliberately:

1. **You want the fonts.** Change those 19 declarations to
   `var(--font-inter)` / `var(--font-playfair)`. The site will change
   appearance — this is what it was always meant to look like. Trim the weight
   list to what is actually used.
2. **You are happy with how it looks now.** Remove the `next/font` imports
   entirely and set an explicit system font stack. Ten fewer files on the
   critical path and no visual change at all.

I have not changed this either way, since it is a design decision rather than a
performance one.

---

## Follow-up: unused JavaScript on the homepage

The homepage was shipping the **entire 219-product catalogue** to the browser
and rendering 36 of it.

`lib/products.ts` is 86 KB raw / ~19 KB gzipped. Two client components on the
homepage imported it:

- `Products.tsx` imported `categories`, then sliced to 6 per category **in the
  browser** — so 183 unused products rode along.
- `FaceAlignSection.tsx` imported the whole catalogue to read a single string:
  `categories.find(c => c.id === "lighting-structures").seeAllUrl`.

Because both are `"use client"`, the catalogue was bundled into the client
chunks — and it appeared in *two* separate chunks, once per route entry point.

The slicing now happens on the server. `lib/products.ts` gained
`featuredCategories(limit)` and `categoryUrl(id)`; `app/page.tsx` (a server
component) calls them and passes the result down as props. `Products.tsx` and
`FaceAlignSection.tsx` no longer import the catalogue at runtime at all —
`Products.tsx` keeps only an `import type`, which is erased at build.

Measured on a production build, homepage only:

| | JS | HTML | Total |
|---|---|---|---|
| Before | 210.3 KB | 15.7 KB | 226.0 KB gzip |
| After | 194.8 KB | 21.1 KB | 215.9 KB gzip |
| Net | **-15.5 KB** | +5.5 KB | **-10.0 KB gzip** |

The HTML grows because the 36 products that *are* rendered now travel in the
RSC payload instead of the JS bundle. That is a good trade: JS has to be parsed
and executed, streamed HTML does not. It is also one fewer chunk request.

Rendered output is unchanged — same 6 categories, same product cards, same
face-align link target. The gallery route still imports the full catalogue,
which is correct, since it genuinely searches all 219.

---

## Follow-up: accessibility tree

Both reported failures were real bugs, not audit noise. Verified with
axe-core 4.12.1 — the same engine Lighthouse runs.

**1. `<aside role="dialog">` on the cart drawer.** `<aside>` carries an
implicit `complementary` role, and `dialog` is not an allowed override for it.
Now a `<div role="dialog">`.

**2. `aria-hidden` on the mobile drawer while its links stayed focusable.**
This was the more serious of the two. At mobile widths `.mobileDrawer` is
`display: block` and only the inner panel is translated off-screen, so every
link inside stayed in the tab order. Keyboard users tabbed through an
invisible menu. `aria-hidden` hides content from screen readers but does
nothing about focus, which is exactly the mismatch the rule catches.

Both drawers now use `inert` while closed, which removes the subtree from the
tab order *and* the accessibility tree. The cart drawer had the same latent
problem — off-screen but fully focusable, and advertising `aria-modal="true"`
even when shut — so it got the same treatment despite only the role being
flagged.

### Also fixed while in there

A full axe scan of the built pages turned up two more:

- **No `main` landmark anywhere.** 172 nodes sat outside any landmark. Content
  is now wrapped in `<main>` on both routes, with `Nav` and `Footer` left
  outside as their own landmarks.
- **Heading levels skipped** — the homepage went H1 → H3 → H4. Product
  category headings are now `h2` and product names `h3`; the gallery's product
  names moved from `h3` to `h2` under its `h1`. All the CSS is class-based
  (no bare `h3 {}` selectors), so this is purely semantic — nothing moves
  visually.

Homepage now reports **0 axe violations**. One caveat: the gallery renders its
grid client-side, so its static HTML contains only the Suspense fallback and
axe cannot verify it without a browser. Those changes are correct in the source
but unverified by the scan above.
