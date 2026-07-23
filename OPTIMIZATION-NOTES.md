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
