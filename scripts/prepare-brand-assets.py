#!/usr/bin/env python3
"""Derive the approved raster logo without redrawing or recoloring it (Pillow 11.3)."""
from hashlib import sha256
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'artifacts/branding/firstform-logo-charcoal-v1.png'
SOURCE_SHA256 = '61fc77ea367dc52cd7095d739d858393a6bd59abb79292a6e32a45ea93a3563f'
OUTPUT = ROOT / 'public/branding'


def main():
    if sha256(SOURCE.read_bytes()).hexdigest() != SOURCE_SHA256:
        raise ValueError('Expected the approved charcoal v1 source. Review a new source explicitly.')
    source = Image.open(SOURCE).convert('RGBA')
    # Ignore only the 1/255-alpha specks when finding the outer canvas bounds.
    # Preserve every source pixel inside the crop, including antialiased edges.
    bounds = source.getchannel('A').point(lambda alpha: 255 if alpha > 1 else 0).getbbox()
    cropped = source.crop(bounds)
    logo = Image.new('RGBA', (960, 960))
    logo.alpha_composite(cropped, ((960 - cropped.width) // 2, (960 - cropped.height) // 2))

    # A fixed light backing keeps the favicon and email image legible in dark UI.
    backed = Image.new('RGBA', logo.size)
    ImageDraw.Draw(backed).rounded_rectangle((0, 0, 959, 959), radius=264, fill='#f4f5f7')
    backed.alpha_composite(logo)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for image, size, path in [
        (logo, 256, OUTPUT / 'firstform-logo-charcoal-v1.png'),
        (backed, 32, OUTPUT / 'firstform-favicon-v1.png'),
        (backed, 180, OUTPUT / 'firstform-apple-touch-icon-v1.png'),
        (backed, 256, ROOT / 'public/email-logo.png'),
    ]:
        image.resize((size, size), Image.Resampling.LANCZOS).save(path, optimize=True)
        print(f'{path.relative_to(ROOT)}: {size} × {size} RGBA PNG')
    print(f'Source crop: {bounds}; centered on a 960 × 960 transparent canvas.')


if __name__ == '__main__':
    main()
