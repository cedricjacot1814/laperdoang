#!/usr/bin/env python3
"""Generate Laper Doang brand assets: PWA icons, apple-touch-icon, OG image."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

OUT = "/home/claude/laperdoang/public"
os.makedirs(OUT, exist_ok=True)

GREEN0 = (6, 177, 79)     # #06b14f
GREEN1 = (43, 214, 106)   # #2bd66a
PINK   = (255, 61, 129)   # #ff3d81
WHITE  = (255, 255, 255)

SS = 4  # supersample factor for smooth edges


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def diagonal_gradient(w, h, c0, c1):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    t = (xx + yy) / (w + h - 2)
    arr = np.zeros((h, w, 3), dtype=np.uint8)
    for i in range(3):
        arr[..., i] = (c0[i] + (c1[i] - c0[i]) * t).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


def draw_heart(draw, cx, cy, w, color):
    """Heart centred near (cx, cy), total width w."""
    lr = w / 4.0                  # lobe radius
    ly = cy - lr * 0.55           # lobe centre y
    # two lobes
    draw.ellipse([cx - w / 2, ly - lr, cx, ly + lr], fill=color)
    draw.ellipse([cx, ly - lr, cx + w / 2, ly + lr], fill=color)
    # bottom triangle
    tip_y = cy + w * 0.52
    draw.polygon([(cx - w / 2, ly), (cx + w / 2, ly), (cx, tip_y)], fill=color)


def draw_mark(img, cx, cy, scale, heart_color=PINK):
    """White delivery bag with a heart, centred at (cx, cy). scale = bag width."""
    d = ImageDraw.Draw(img)
    bw = scale
    bh = scale * 1.02
    bx0, by0 = cx - bw / 2, cy - bh / 2 + bh * 0.06
    bx1, by1 = cx + bw / 2, cy + bh / 2 + bh * 0.06
    # handle (upper semicircle, stroked)
    hr = bw * 0.34
    stroke = max(6, int(bw * 0.12))
    d.arc([cx - hr, by0 - hr * 0.92, cx + hr, by0 + hr * 1.08],
          start=180, end=360, fill=WHITE, width=stroke)
    # bag body
    rad = bw * 0.18
    d.rounded_rectangle([bx0, by0, bx1, by1], radius=rad, fill=WHITE)
    # heart on the bag
    draw_heart(d, cx, cy + bh * 0.10, bw * 0.46, heart_color)


def make_icon(size, radius_frac, mark_scale, path, full_bleed=False):
    S = size * SS
    img = diagonal_gradient(S, S, GREEN0, GREEN1).convert("RGBA")
    # rounded mask
    if not full_bleed:
        mask = Image.new("L", (S, S), 0)
        ImageDraw.Draw(mask).rounded_rectangle(
            [0, 0, S - 1, S - 1], radius=int(S * radius_frac), fill=255)
        img.putalpha(mask)
    draw_mark(img, S / 2, S / 2, S * mark_scale)
    img = img.resize((size, size), Image.LANCZOS)
    img.save(path)
    print("wrote", path, f"{size}x{size}")


def make_favicon_svg(path):
    svg = '''<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#06b14f"/>
      <stop offset="1" stop-color="#2bd66a"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="116" fill="url(#g)"/>
  <path d="M198 214 a58 58 0 0 1 116 0" fill="none" stroke="#fff" stroke-width="26" stroke-linecap="round"/>
  <rect x="166" y="206" width="180" height="184" rx="34" fill="#fff"/>
  <path d="M256 360 C244 350 198 322 198 288 C198 271 211 261 226 261 C239 261 250 270 256 281 C262 270 273 261 286 261 C301 261 314 271 314 288 C314 322 268 350 256 360 Z" fill="#ff3d81"/>
</svg>'''
    with open(path, "w") as f:
        f.write(svg)
    print("wrote", path)


def load_font(size, bold=True):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()


def make_og(path):
    W, H = 1200, 630
    S = 2
    img = diagonal_gradient(W * S, H * S, GREEN0, (4, 144, 63)).convert("RGBA")
    d = ImageDraw.Draw(img)

    # subtle decorative circles
    for (cxf, cyf, rf, a) in [(0.86, 0.18, 0.20, 22), (0.78, 0.86, 0.13, 26)]:
        ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
        ImageDraw.Draw(ov).ellipse(
            [(cxf - rf) * W * S, (cyf - rf) * H * S, (cxf + rf) * W * S, (cyf + rf) * H * S],
            fill=(255, 255, 255, a))
        img = Image.alpha_composite(img, ov)
    d = ImageDraw.Draw(img)

    # mark on the right
    draw_mark(img, W * S * 0.83, H * S * 0.50, W * S * 0.20)

    # text on the left
    eyebrow = load_font(int(30 * S))
    title = load_font(int(92 * S))
    tag = load_font(int(40 * S))
    url = load_font(int(30 * S))

    lx = int(82 * S)
    d.text((lx, int(150 * S)), "DELIVERY BUAT DOPAMINE", font=eyebrow,
           fill=(255, 255, 255, 235))
    d.text((lx, int(196 * S)), "Laper Doang", font=title, fill=WHITE)
    d.text((lx, int(348 * S)), "Semua dopamine-nya.", font=tag, fill=(255, 255, 255, 240))
    d.text((lx, int(398 * S)), "Tanpa kalorinya.", font=tag, fill=(255, 255, 255, 240))
    # pill-style url
    ut = "laperdoang.com"
    bbox = d.textbbox((0, 0), ut, font=url)
    uw, uh = bbox[2] - bbox[0], bbox[3] - bbox[1]
    px, py = lx, int(490 * S)
    pad = int(18 * S)
    d.rounded_rectangle([px, py, px + uw + pad * 2, py + uh + pad * 1.7],
                        radius=int(uh), fill=(255, 255, 255, 240))
    d.text((px + pad, py + pad * 0.75), ut, font=url, fill=(4, 144, 63))

    img = img.resize((W, H), Image.LANCZOS).convert("RGB")
    img.save(path, "PNG")
    print("wrote", path, f"{W}x{H}")


# ---- generate everything ----
make_icon(512, 0.227, 0.62, f"{OUT}/icon-512.png")
make_icon(192, 0.227, 0.62, f"{OUT}/icon-192.png")
make_icon(512, 0.0, 0.50, f"{OUT}/icon-512-maskable.png", full_bleed=True)
make_icon(180, 0.0, 0.58, f"{OUT}/apple-touch-icon.png", full_bleed=True)
make_icon(32, 0.20, 0.66, f"{OUT}/favicon-32.png")
make_favicon_svg(f"{OUT}/favicon.svg")
make_og(f"{OUT}/og-image.png")
print("done")
