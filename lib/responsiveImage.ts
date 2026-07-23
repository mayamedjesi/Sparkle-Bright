import { imageDimensions } from "./imageDimensions";

/** Thumbnail widths emitted alongside every full-size WebP in /public. */
const THUMB_WIDTHS = [480, 960];

export interface ResponsiveImageProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
}

/**
 * Builds srcset/sizes/width/height for an image in /public.
 *
 * Every product image ships as three files: `Name-480w.webp`, `Name-960w.webp`
 * and the full-size `Name.webp`. Grid cards only ever render a few hundred CSS
 * pixels wide, so this lets the browser pull a ~30-90 KB thumbnail instead of
 * the full-size asset, which is reserved for the lightbox.
 *
 * `sizes` defaults to the product/gallery grid: 4 columns on desktop, 2 on
 * tablet and mobile.
 */
export function responsiveImage(
  src: string,
  sizes = "(max-width: 1100px) 50vw, 25vw",
): ResponsiveImageProps {
  const dims = imageDimensions[src];

  // Unknown or non-WebP asset (e.g. an SVG): pass through untouched.
  if (!dims || !src.endsWith(".webp")) {
    return { src };
  }

  const [width, height] = dims;
  const stem = src.slice(0, -".webp".length);

  const candidates = THUMB_WIDTHS.filter((w) => w < width).map(
    (w) => `${stem}-${w}w.webp ${w}w`,
  );
  candidates.push(`${src} ${width}w`);

  return { src, srcSet: candidates.join(", "), sizes, width, height };
}

/**
 * Smallest available variant — for tiny fixed-size thumbnails such as the
 * cart drawer rows, where even the 960w file is far more than is needed.
 */
export function thumbnailImage(src: string): ResponsiveImageProps {
  const dims = imageDimensions[src];
  if (!dims || !src.endsWith(".webp")) return { src };
  const stem = src.slice(0, -".webp".length);
  const [width, height] = dims;
  return width > 480
    ? { src: `${stem}-480w.webp`, width: 480, height: Math.round((height * 480) / width) }
    : { src, width, height };
}
