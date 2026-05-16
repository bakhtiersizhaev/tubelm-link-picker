from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = Path('store-assets')
OUT.mkdir(exist_ok=True)

INK = (18, 20, 23)
PAPER = (244, 246, 248)
MUTED = (101, 113, 126)
ACCENT = (16, 185, 129)
MINT = (125, 248, 198)
RED = (255, 0, 51)
WHITE = (255, 255, 255)
W, H = 1280, 800


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


def shadow_card(base, box, radius=24, shadow=(0, 0, 0, 38), blur=22, offset=(0, 14), fill=WHITE, outline=(214, 220, 226)):
    layer = Image.new('RGBA', base.size, (0, 0, 0, 0))
    layer_draw = ImageDraw.Draw(layer)
    x0, y0, x1, y1 = box
    dx, dy = offset
    layer_draw.rounded_rectangle((x0 + dx, y0 + dy, x1 + dx, y1 + dy), radius, fill=shadow)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(layer)
    draw = ImageDraw.Draw(base)
    draw.rounded_rectangle(box, radius, fill=fill, outline=outline, width=1)


def draw_tubelm_logo(draw, x, y, size=54):
    rounded(draw, (x, y, x + size, y + size), 14, INK)
    draw.rounded_rectangle((x + 11, y + 14, x + size - 11, y + size - 16), 8, outline=MINT, width=4)
    draw.polygon(
        [(x + size * 0.45, y + size * 0.38), (x + size * 0.45, y + size * 0.62), (x + size * 0.66, y + size * 0.50)],
        fill=WHITE,
    )
    draw.ellipse((x + size - 15, y + size - 15, x + size - 8, y + size - 8), fill=RED)


def draw_browser_chrome(draw, box, title='youtube.com'):
    x0, y0, x1, y1 = box
    rounded(draw, box, 22, WHITE, outline=(210, 216, 224))
    draw.rounded_rectangle((x0, y0, x1, y0 + 58), 22, fill=(250, 251, 252), outline=(210, 216, 224))
    draw.rectangle((x0, y0 + 28, x1, y0 + 58), fill=(250, 251, 252))
    for index, color in enumerate([(238, 88, 88), (241, 190, 74), (83, 196, 114)]):
        draw.ellipse((x0 + 24 + index * 20, y0 + 21, x0 + 36 + index * 20, y0 + 33), fill=color)
    rounded(draw, (x0 + 125, y0 + 15, x1 - 30, y0 + 42), 14, (239, 243, 247), outline=(225, 230, 236))
    draw.text((x0 + 150, y0 + 20), title, fill=(79, 90, 104), font=font(15))


def draw_youtube_grid(base, area, selected=(0, 2, 4), shorts=False):
    draw = ImageDraw.Draw(base)
    x0, y0, x1, y1 = area
    draw.rectangle((x0, y0, x1, y1), fill=WHITE)
    draw.text((x0 + 24, y0 + 20), 'TubeLM demo on YouTube', fill=INK, font=font(20, True))
    rounded(draw, (x1 - 260, y0 + 16, x1 - 36, y0 + 44), 12, (243, 246, 249), outline=(222, 228, 234))
    draw.text((x1 - 244, y0 + 22), 'Search videos', fill=MUTED, font=font(14))
    cols, gap = 3, 26
    tile_width = (x1 - x0 - 48 - gap * (cols - 1)) // cols
    tile_height = 150
    start_y = y0 + 82
    labels = ['AI research workflow', 'NotebookLM source', 'Chrome extension', 'Long playlist', 'Shorts batch', 'Clean links']
    colors = [(30, 41, 59), (15, 23, 42), (34, 49, 63), (38, 55, 72), (22, 78, 99), (31, 41, 55)]
    for index in range(6):
        col = index % cols
        row = index // cols
        x = x0 + 24 + col * (tile_width + gap)
        y = start_y + row * (tile_height + 74)
        color = colors[index]
        rounded(draw, (x, y, x + tile_width, y + tile_height), 16, color)
        for stripe in range(7):
            yy = y + 18 + stripe * 17
            draw.line((x + 18, yy, x + tile_width - 18, yy + 5), fill=tuple(min(255, c + 25) for c in color), width=2)
        draw.polygon(
            [(x + tile_width / 2 - 18, y + tile_height / 2 - 24), (x + tile_width / 2 - 18, y + tile_height / 2 + 24), (x + tile_width / 2 + 28, y + tile_height / 2)],
            fill=(255, 255, 255, 220),
        )
        if index in selected:
            rounded(draw, (x + 12, y + 12, x + 48, y + 48), 10, MINT, outline=(6, 18, 31), width=2)
            draw.line((x + 21, y + 31, x + 30, y + 39, x + 43, y + 21), fill=(6, 18, 31), width=4, joint='curve')
        else:
            rounded(draw, (x + 12, y + 12, x + 48, y + 48), 10, (6, 18, 31, 190), outline=WHITE, width=2)
        draw.text((x, y + tile_height + 12), labels[index], fill=INK, font=font(18, True))
        draw.text((x, y + tile_height + 38), 'youtube.com/shorts/ID' if shorts else 'youtube.com/watch?v=ID', fill=MUTED, font=font(13))


def draw_popup(base, box, count=3, side=False):
    draw = ImageDraw.Draw(base)
    x0, y0, x1, y1 = box
    shadow_card(base, box, 26, shadow=(0, 0, 0, 60), blur=28, offset=(0, 18), fill=INK, outline=(53, 64, 76))
    draw_tubelm_logo(draw, x0 + 26, y0 + 24, 54)
    draw.text((x0 + 94, y0 + 26), 'TubeLM', fill=WHITE, font=font(28, True))
    draw.text((x0 + 94, y0 + 60), 'YouTube links for NotebookLM', fill=(190, 201, 213), font=font(13))
    rounded(draw, (x1 - 110, y0 + 28, x1 - 26, y0 + 54), 13, (20, 83, 62), outline=(70, 200, 150))
    draw.text((x1 - 92, y0 + 33), 'Ready', fill=MINT, font=font(13, True))
    rounded(draw, (x0 + 26, y0 + 102, x1 - 26, y0 + 214), 22, PAPER, outline=(220, 226, 232))
    draw.text((x0 + 48, y0 + 124), 'Selected', fill=MUTED, font=font(15, True))
    draw.text((x0 + 48, y0 + 148), str(count), fill=INK, font=font(52, True))
    draw.text((x0 + 128, y0 + 160), 'videos ready to copy', fill=(61, 73, 88), font=font(18))
    rounded(draw, (x0 + 26, y0 + 236, x1 - 26, y0 + 326), 22, ACCENT)
    draw.text((x0 + 54, y0 + 257), f'Copy {count} URLs', fill=(3, 31, 22), font=font(25, True))
    draw.text((x0 + 54, y0 + 289), 'Newline list, ready for NotebookLM', fill=(7, 69, 50), font=font(14))
    rounded(draw, (x0 + 26, y0 + 346, x0 + 176, y0 + 394), 16, (238, 242, 245), outline=(218, 224, 230))
    rounded(draw, (x0 + 194, y0 + 346, x1 - 26, y0 + 394), 16, (238, 242, 245), outline=(218, 224, 230))
    draw.text((x0 + 48, y0 + 360), 'Select visible', fill=INK, font=font(15, True))
    draw.text((x0 + 220, y0 + 360), 'Clear', fill=INK, font=font(15, True))
    if side:
        draw.text((x0 + 28, y1 - 45), 'Side panel mode keeps controls visible', fill=(190, 201, 213), font=font(13))


def screenshot_hero():
    image = Image.new('RGBA', (W, H), PAPER + (255,))
    draw = ImageDraw.Draw(image)
    browser = (54, 50, 1226, 750)
    draw_browser_chrome(draw, browser, 'youtube.com/results?search_query=ai+research')
    draw_youtube_grid(image, (browser[0] + 1, browser[1] + 59, browser[2] - 1, browser[3] - 1), selected=(0, 2, 4))
    draw_popup(image, (840, 126, 1192, 560), 3)
    image.convert('RGB').save(OUT / 'screenshot-01-hero.png')


def screenshot_shorts():
    image = Image.new('RGBA', (W, H), PAPER + (255,))
    draw = ImageDraw.Draw(image)
    browser = (54, 50, 1226, 750)
    draw_browser_chrome(draw, browser, 'youtube.com/shorts')
    draw_youtube_grid(image, (browser[0] + 1, browser[1] + 59, browser[2] - 1, browser[3] - 1), selected=(0, 1, 3, 4), shorts=True)
    draw_popup(image, (822, 110, 1192, 560), 4)
    image.convert('RGB').save(OUT / 'screenshot-02-shorts.png')


def screenshot_notebook():
    image = Image.new('RGBA', (W, H), PAPER + (255,))
    draw = ImageDraw.Draw(image)
    draw_browser_chrome(draw, (50, 52, 590, 748), 'youtube.com/channel/demo')
    draw_youtube_grid(image, (51, 111, 589, 747), selected=(0, 2, 3))
    draw_popup(image, (640, 82, 1190, 360), 3)
    shadow_card(image, (640, 400, 1190, 720), 24, fill=WHITE)
    draw.text((670, 430), 'NotebookLM sources', fill=INK, font=font(31, True))
    draw.text((670, 472), 'Paste clean YouTube URLs as sources.', fill=MUTED, font=font(18))
    rounded(draw, (670, 512, 1160, 670), 16, (247, 249, 251), outline=(220, 226, 232))
    urls = ['https://www.youtube.com/watch?v=AI001', 'https://www.youtube.com/watch?v=AI002', 'https://www.youtube.com/shorts/AI003']
    for index, url in enumerate(urls):
        draw.text((696, 536 + index * 36), url, fill=(43, 54, 66), font=font(17))
    image.convert('RGB').save(OUT / 'screenshot-03-notebooklm.png')


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
    image.convert('RGB').save(OUT / 'promo-small-440x280.png')


def main():
    # Do not overwrite verified live YouTube captures if they already exist.
    # The generated hero/shorts images are only fallbacks for local draft work.
    if not (OUT / 'screenshot-01-hero.png').exists():
        screenshot_hero()
    if not (OUT / 'screenshot-02-shorts.png').exists():
        screenshot_shorts()
    screenshot_notebook()
    promo_tile()
    for path in sorted(OUT.glob('*.png')):
        image = Image.open(path)
        print(f'{path.as_posix()} {image.size[0]}x{image.size[1]} {image.mode} {path.stat().st_size} bytes')


if __name__ == '__main__':
    main()
