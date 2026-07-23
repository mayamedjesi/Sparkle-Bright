#!/usr/bin/env python3
"""Convert all in-use raster assets to WebP and emit responsive thumbnails."""
import os, sys, json
from PIL import Image

PUB = "/home/claude/site/Sparkle-Bright/public"
REF = [l.strip() for l in open("/tmp/referenced.txt") if l.strip()]
THUMB_WIDTHS = [480, 960]
Q_FULL, Q_THUMB = 82, 78

os.chdir(PUB)
report = []
skipped = []

for fname in sorted(REF):
    if not os.path.exists(fname):
        continue
    stem, ext = os.path.splitext(fname)
    ext = ext.lower()
    if ext not in (".png", ".jpg", ".jpeg", ".webp"):
        continue

    orig_size = os.path.getsize(fname)
    im = Image.open(fname)
    # Preserve alpha only where it is actually used
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        if im.getchannel("A").getextrema()[0] == 255:
            im = im.convert("RGB")
    else:
        im = im.convert("RGB")

    target = stem + ".webp"
    new_size = orig_size

    if ext == ".webp":
        # Already WebP and already small — keep as the "full" asset untouched.
        pass
    else:
        im.save(target, "WEBP", quality=Q_FULL, method=6)
        new_size = os.path.getsize(target)
        if new_size >= orig_size:
            os.remove(target)
            skipped.append(fname)
            continue

    # Responsive thumbnails
    for w in THUMB_WIDTHS:
        if im.width <= w:
            continue
        h = round(im.height * w / im.width)
        th = im.resize((w, h), Image.LANCZOS)
        th.save(f"{stem}-{w}w.webp", "WEBP", quality=Q_THUMB, method=6)

    report.append({"src": fname, "out": target, "orig": orig_size,
                   "new": new_size, "dims": list(im.size)})

json.dump(report, open("/tmp/img_report.json", "w"))
o = sum(r["orig"] for r in report)
n = sum(r["new"] for r in report)
thumbs = sum(os.path.getsize(f) for f in os.listdir(".") if "-480w.webp" in f or "-960w.webp" in f)
print(f"processed        : {len(report)} files")
print(f"skipped (no gain): {len(skipped)}")
print(f"full-size before : {o/1e6:8.1f} MB")
print(f"full-size after  : {n/1e6:8.1f} MB   ({100*n/o:.1f}%)")
print(f"thumbnails added : {thumbs/1e6:8.1f} MB")
print(f"net              : {(o-n-thumbs)/1e6:8.1f} MB saved")
