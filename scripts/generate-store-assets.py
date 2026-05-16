from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path('store-assets')
OUT.mkdir(exist_ok=True)

INK = (18, 20, 23)
MINT = (125, 248, 198)
PAPER = (244, 246, 248)
WHITE = (255, 255, 255)
RED = (255, 0, 51)


def font(size, bold=False):
    candidates = [
        'C:/Windows/Fonts/segoeuib.ttf' if bold else 'C:/Windows/Fonts/segoeui.ttf',
        'C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf',
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius, fill=fill, outline=outline, width=width)


def draw_tubelm_logo(draw, x, y, size=76):
    rounded(draw, (x, y, x + size, y + size), 18, INK)
    draw.rounded_rectangle((x + 16, y + 20, x + size - 16, y + size - 22), 10, outline=MINT, width=5)
    draw.polygon(
        [
            (x + size * 0.45, y + size * 0.38),
            (x + size * 0.45, y + size * 0.62),
            (x + size * 0.66, y + size * 0.50),
        ],
        fill=WHITE,
    )
    draw.ellipse((x + size - 21, y + size - 21, x + size - 11, y + size - 11), fill=RED)


def promo_tile():
    image = Image.new('RGBA', (440, 280), INK + (255,))
    draw = ImageDraw.Draw(image)
    for y in range(280):
        a = y / 280
        color = (int(18 - 7 * a), int(20 + 2 * a), int(23 + 17 * a))
        draw.line((0, y, 440, y), fill=color)

    draw_tubelm_logo(draw, 32, 30, 76)
    draw.text((126, 35), 'TubeLM', fill=WHITE, font=font(34, True))
    draw.text((128, 74), 'Link Picker', fill=MINT, font=font(17, True))

    rounded(draw, (300, 42, 404, 116), 18, (28, 38, 52), outline=(72, 92, 110))
    rounded(draw, (315, 58, 389, 101), 10, PAPER, outline=(185, 196, 207))
    rounded(draw, (324, 66, 348, 90), 7, MINT, outline=(6, 18, 31), width=2)
    draw.line((330, 79, 337, 85, 346, 70), fill=(6, 18, 31), width=3)

    draw.text((34, 164), 'Pick videos.', fill=WHITE, font=font(30, True))
    draw.text((34, 202), 'Copy clean links.', fill=WHITE, font=font(30, True))
    draw.text((36, 244), 'For NotebookLM and AI research notes.', fill=(174, 186, 200), font=font(13, True))

    output = OUT / 'promo-small-440x280.png'
    image.convert('RGB').save(output)
    return output


def main():
    # Required CWS screenshots are real browser captures and must not be generated here.
    # This script only regenerates the small promotional tile.
    output = promo_tile()
    image = Image.open(output)
    print(f'{output.as_posix()} {image.size[0]}x{image.size[1]} {image.mode} {output.stat().st_size} bytes')


if __name__ == '__main__':
    main()
