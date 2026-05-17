from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'store-assets'
OUT.mkdir(exist_ok=True)

# TubeLM visual system: Research Graphite + Mint.
INK = (18, 20, 23)
GRAPHITE = (31, 41, 55)
PAPER = (244, 246, 248)
WHITE = (255, 255, 255)
MUTED = (101, 113, 126)
SOFT_TEXT = (174, 186, 200)
MINT = (125, 248, 198)
GREEN = (16, 185, 129)
GREEN_DARK = (5, 80, 58)
RED = (255, 0, 51)


def font(size, bold=False):
    candidates = [
        'C:/Windows/Fonts/segoeuib.ttf' if bold else 'C:/Windows/Fonts/segoeui.ttf',
        'C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def text(draw, xy, value, size, fill=INK, bold=False, anchor=None):
    draw.text(xy, value, font=font(size, bold), fill=fill, anchor=anchor)


def wrap_text(draw, xy, value, size, fill=INK, bold=False, max_width=320, line_gap=1.24):
    f = font(size, bold)
    x, y = xy
    words = value.split()
    line = ''
    for word in words:
        candidate = word if not line else f'{line} {word}'
        width = draw.textbbox((0, 0), candidate, font=f)[2]
        if width <= max_width:
            line = candidate
        else:
            if line:
                draw.text((x, y), line, font=f, fill=fill)
                y += int(size * line_gap)
            line = word
    if line:
        draw.text((x, y), line, font=f, fill=fill)
        y += int(size * line_gap)
    return y


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius, fill=fill, outline=outline, width=width)


def shadow(base, box, radius=24, blur=22, offset=(0, 12), color=(0, 0, 0, 45)):
    layer = Image.new('RGBA', base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x0, y0, x1, y1 = box
    dx, dy = offset
    d.rounded_rectangle((x0 + dx, y0 + dy, x1 + dx, y1 + dy), radius, fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(layer)


def gradient(size, top, bottom):
    w, h = size
    image = Image.new('RGBA', size, top + (255,))
    draw = ImageDraw.Draw(image)
    for y in range(h):
        a = y / max(1, h - 1)
        color = tuple(int(top[i] * (1 - a) + bottom[i] * a) for i in range(3))
        draw.line((0, y, w, y), fill=color)
    return image


def radial_glow(base, center, radius, color, alpha=70):
    layer = Image.new('RGBA', base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy = center
    d.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(radius // 3))
    base.alpha_composite(layer)


def paste_icon(base, x, y, size):
    icon = Image.open(ROOT / 'icons' / 'icon-128.png').convert('RGBA').resize((size, size), Image.Resampling.LANCZOS)
    base.alpha_composite(icon, (x, y))


def page_background():
    base = Image.new('RGBA', (1280, 800), (248, 250, 252, 255))
    draw = ImageDraw.Draw(base)
    draw.rectangle((0, 0, 1280, 72), fill=WHITE)
    draw.line((0, 71, 1280, 71), fill=(226, 232, 238), width=1)
    rounded(draw, (24, 18, 56, 50), 8, RED)
    draw.polygon([(38, 29), (38, 41), (48, 35)], fill=WHITE)
    text(draw, (68, 24), 'YouTube', 22, INK, True)
    rounded(draw, (260, 17, 760, 51), 17, (245, 247, 250), (218, 226, 234))
    text(draw, (284, 25), 'Search YouTube for AI research videos', 15, (78, 91, 105))
    for i, label in enumerate(['Home', 'Shorts', 'Subscriptions']):
        x = 30 + i * 112
        rounded(draw, (x, 92, x + 92, 126), 17, WHITE if i else (232, 246, 240), (226, 232, 238))
        text(draw, (x + 18, 101), label, 13, GREEN_DARK if i == 0 else MUTED, True)
    return base


def draw_checkbox(draw, x, y, selected=True, scale=1.0):
    size = int(26 * scale)
    radius = int(8 * scale)
    if selected:
        rounded(draw, (x, y, x + size, y + size), radius, MINT, (6, 18, 31), 2)
        draw.line((x + int(6 * scale), y + int(14 * scale), x + int(12 * scale), y + int(20 * scale), x + int(21 * scale), y + int(7 * scale)), fill=(6, 18, 31), width=max(2, int(3 * scale)))
    else:
        rounded(draw, (x, y, x + size, y + size), radius, (8, 16, 27), (255, 255, 255), 2)


def draw_thumb(draw, box, variant=0, vertical=False):
    x0, y0, x1, y1 = box
    palettes = [
        ((31, 41, 55), (67, 82, 105)),
        ((10, 46, 54), (21, 94, 92)),
        ((43, 39, 76), (80, 70, 140)),
        ((53, 34, 41), (120, 51, 70)),
        ((26, 57, 77), (79, 116, 148)),
        ((45, 52, 54), (81, 99, 93)),
    ]
    top, bottom = palettes[variant % len(palettes)]
    h = y1 - y0
    for yy in range(y0, y1):
        a = (yy - y0) / max(1, h)
        color = tuple(int(top[i] * (1 - a) + bottom[i] * a) for i in range(3))
        draw.line((x0, yy, x1, yy), fill=color)
    for stripe in range(5):
        yy = y0 + 18 + stripe * (28 if vertical else 20)
        draw.line((x0 + 18, yy, x1 - 18, yy + 8), fill=tuple(min(255, c + 34) for c in top), width=2)
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    play = 20 if not vertical else 26
    draw.polygon([(cx - play // 2, cy - play), (cx - play // 2, cy + play), (cx + play, cy)], fill=(255, 255, 255, 228))


def draw_video_card(draw, x, y, w=300, selected=False, title='Video title', url='youtube.com/watch?v=ID', variant=0):
    rounded(draw, (x, y, x + w, y + 168), 18, WHITE, (226, 232, 238))
    rounded(draw, (x + 10, y + 10, x + w - 10, y + 104), 15, (40, 53, 70))
    draw_thumb(draw, (x + 10, y + 10, x + w - 10, y + 104), variant)
    draw_checkbox(draw, x + 22, y + 22, selected)
    text(draw, (x + 14, y + 118), title, 17, INK, True)
    text(draw, (x + 14, y + 144), url, 12, MUTED)


def draw_result_row(draw, x, y, selected=False, title='AI research lecture', variant=0, w=660):
    rounded(draw, (x, y, x + w, y + 118), 18, WHITE, (226, 232, 238))
    rounded(draw, (x + 12, y + 12, x + 190, y + 106), 14, GRAPHITE)
    draw_thumb(draw, (x + 12, y + 12, x + 190, y + 106), variant)
    draw_checkbox(draw, x + 24, y + 24, selected)
    text(draw, (x + 212, y + 20), title, 20, INK, True)
    wrap_text(draw, (x + 212, y + 50), 'Neutral demo content showing how TubeLM overlays selection controls on YouTube videos.', 14, MUTED, max_width=w - 270)
    text(draw, (x + 212, y + 92), 'Clean URL: youtube.com/watch?v=ID', 12, (80, 94, 108))


def draw_popup_panel(base, x, y, count=3, note='Ready to copy clean watch and Shorts URLs.', wide=False, copied=False):
    draw = ImageDraw.Draw(base)
    w = 376 if wide else 360
    h = 478
    shadow(base, (x, y, x + w, y + h), radius=18, blur=24, offset=(0, 14), color=(0, 0, 0, 54))
    rounded(draw, (x, y, x + w, y + h), 18, PAPER, (211, 219, 228))

    paste_icon(base, x + 16, y + 16, 40)
    text(draw, (x + 68, y + 17), 'TubeLM', 15, INK, True)
    text(draw, (x + 68, y + 39), 'YouTube links for NotebookLM', 12, MUTED)
    rounded(draw, (x + w - 88, y + 19, x + w - 16, y + 46), 14, (235, 252, 245), (16, 185, 129))
    draw.ellipse((x + w - 82, y + 29, x + w - 76, y + 35), fill=GREEN_DARK)
    text(draw, (x + w - 62, y + 26), 'Ready', 11, GREEN_DARK, True)

    rounded(draw, (x + 16, y + 76, x + w - 16, y + 176), 16, WHITE, (231, 235, 240))
    text(draw, (x + 32, y + 94), 'Selected', 11, MUTED, True)
    text(draw, (x + w - 70, y + 103), str(count), 34, INK, True)
    wrap_text(draw, (x + 32, y + 122), note, 13, (57, 66, 78), max_width=w - 132)

    cta_fill = (6, 78, 59) if copied else INK
    rounded(draw, (x + 16, y + 194, x + w - 16, y + 264), 12, cta_fill)
    text(draw, (x + w // 2, y + 211), 'Copied!' if copied else f'Copy {count} links', 14, WHITE, True, anchor='ma')
    text(draw, (x + w // 2, y + 234), 'Newline list, ready for NotebookLM', 11, (255, 255, 255, 184), anchor='ma')

    rounded(draw, (x + 16, y + 284, x + (w // 2) - 6, y + 324), 8, WHITE, (225, 231, 237))
    rounded(draw, (x + (w // 2) + 6, y + 284, x + w - 16, y + 324), 8, (244, 246, 248), None)
    text(draw, (x + 46, y + 296), 'Select visible', 13, INK, True)
    text(draw, (x + (w // 2) + 48, y + 296), 'Clear', 13, (57, 66, 78), True)

    draw.line((x + 16, y + 346, x + w - 16, y + 346), fill=(229, 234, 239), width=1)
    text(draw, (x + w // 2, y + 368), 'Thanks for using TubeLM.', 12, MUTED, True, anchor='ma')
    text(draw, (x + w // 2, y + 392), 'By Bakhtier Sizhaev · GitHub · TeleLore', 11, MUTED, anchor='ma')
    rounded(draw, (x + 82, y + 424, x + w - 82, y + 456), 8, (233, 255, 246), None)
    text(draw, (x + w // 2, y + 432), 'Open in side panel', 12, GREEN_DARK, True, anchor='ma')


def draw_side_panel(base, x, y, count=4):
    draw = ImageDraw.Draw(base)
    w, h = 348, 660
    shadow(base, (x, y, x + w, y + h), radius=18, blur=24, offset=(0, 14), color=(0, 0, 0, 50))
    rounded(draw, (x, y, x + w, y + h), 18, PAPER, (211, 219, 228))
    paste_icon(base, x + 20, y + 22, 40)
    text(draw, (x + 72, y + 24), 'TubeLM', 16, INK, True)
    text(draw, (x + 72, y + 48), 'YouTube links for NotebookLM', 12, MUTED)
    rounded(draw, (x + w - 88, y + 25, x + w - 18, y + 51), 13, (235, 252, 245), (16, 185, 129))
    text(draw, (x + w - 62, y + 31), 'Ready', 11, GREEN_DARK, True)

    rounded(draw, (x + 20, y + 96, x + w - 20, y + 202), 16, WHITE, (231, 235, 240))
    text(draw, (x + 40, y + 116), 'Selected', 11, MUTED, True)
    text(draw, (x + w - 78, y + 126), str(count), 40, INK, True)
    wrap_text(draw, (x + 40, y + 146), 'Ready to copy clean watch and Shorts URLs.', 13, (57, 66, 78), max_width=190)

    rounded(draw, (x + 20, y + 230, x + w - 20, y + 304), 12, INK)
    text(draw, (x + w // 2, y + 249), f'Copy {count} links', 15, WHITE, True, anchor='ma')
    text(draw, (x + w // 2, y + 274), 'Newline list, ready for NotebookLM', 11, (255, 255, 255, 184), anchor='ma')

    rounded(draw, (x + 20, y + 330, x + w - 20, y + 426), 16, WHITE, (231, 235, 240))
    wrap_text(draw, (x + 40, y + 352), 'Tick videos on the page, or use Select visible to add a row at a time.', 13, (57, 66, 78), max_width=260)

    rounded(draw, (x + 20, y + 460, x + (w // 2) - 6, y + 500), 8, WHITE, (225, 231, 237))
    rounded(draw, (x + (w // 2) + 6, y + 460, x + w - 20, y + 500), 8, (244, 246, 248), None)
    text(draw, (x + 48, y + 472), 'Select visible', 13, INK, True)
    text(draw, (x + (w // 2) + 52, y + 472), 'Clear', 13, (57, 66, 78), True)

    draw.line((x + 20, y + 534, x + w - 20, y + 534), fill=(229, 234, 239), width=1)
    text(draw, (x + w // 2, y + 558), 'Thanks for using TubeLM.', 12, MUTED, True, anchor='ma')
    text(draw, (x + w // 2, y + 584), 'By Bakhtier Sizhaev · GitHub', 11, MUTED, anchor='ma')


def screenshot_hero():
    base = page_background()
    draw = ImageDraw.Draw(base)
    text(draw, (42, 150), 'AI research videos', 26, INK, True)
    text(draw, (42, 184), 'Select a few sources, then copy clean links in one action.', 16, MUTED)
    titles = ['AI research workflow', 'Lecture to notes', 'Build a source list', 'Video essay sources', 'Notebook study pack', 'Research queue']
    selected = {0, 2, 4}
    for i, title_value in enumerate(titles):
        col, row = i % 3, i // 3
        draw_video_card(draw, 42 + col * 320, 224 + row * 214, 296, i in selected, title_value, 'youtube.com/watch?v=ID', i)
    draw_popup_panel(base, 836, 124, count=3)
    base.convert('RGB').save(OUT / 'screenshot-01-hero.png')


def screenshot_batch_select():
    base = page_background()
    draw = ImageDraw.Draw(base)
    text(draw, (42, 150), 'Search results', 26, INK, True)
    text(draw, (42, 184), 'Use Select visible when you want a whole research row at once.', 16, MUTED)
    rows = ['Long-form interview about AI workflows', 'NotebookLM research sources explained', 'Organizing video notes for a project', 'Clean source list for an AI assistant']
    for i, title_value in enumerate(rows):
        draw_result_row(draw, 42, 224 + i * 132, selected=i in {0, 1, 2}, title=title_value, variant=i)
    draw_popup_panel(base, 824, 154, count=8, note='Newline list, ready to paste', wide=True)
    base.convert('RGB').save(OUT / 'screenshot-02-batch-select.png')


def screenshot_shorts():
    base = page_background()
    draw = ImageDraw.Draw(base)
    text(draw, (42, 150), 'Shorts collection', 26, INK, True)
    text(draw, (42, 184), 'Pick short-form videos the same way: check, count, copy.', 16, MUTED)
    labels = ['Short AI tip', 'Clip source', 'Mini lecture', 'Notebook idea', 'Fast explainer']
    for i, label in enumerate(labels):
        x = 42 + i * 184
        y = 230
        w = 166
        rounded(draw, (x, y, x + w, y + 330), 22, WHITE, (226, 232, 238))
        rounded(draw, (x + 10, y + 10, x + w - 10, y + 264), 18, GRAPHITE)
        draw_thumb(draw, (x + 10, y + 10, x + w - 10, y + 264), i, vertical=True)
        draw_checkbox(draw, x + 22, y + 22, selected=i in {0, 1, 3, 4}, scale=1.05)
        text(draw, (x + 14, y + 284), label, 14, INK, True)
        text(draw, (x + 14, y + 307), 'youtube.com/shorts/ID', 10, MUTED)
    draw_side_panel(base, 914, 104, count=4)
    base.convert('RGB').save(OUT / 'screenshot-03-shorts.png')


def screenshot_notebooklm():
    base = Image.new('RGBA', (1280, 800), (248, 250, 252, 255))
    draw = ImageDraw.Draw(base)
    draw.rectangle((0, 0, 612, 800), fill=(248, 250, 252))
    draw.rectangle((612, 0, 1280, 800), fill=(244, 247, 250))
    draw.line((612, 0, 612, 800), fill=(216, 225, 234), width=1)

    rounded(draw, (28, 24, 584, 64), 20, WHITE, (226, 232, 238))
    rounded(draw, (46, 34, 68, 56), 6, RED)
    draw.polygon([(55, 41), (55, 50), (63, 45)], fill=WHITE)
    text(draw, (82, 36), 'YouTube source queue', 16, INK, True)
    for i, title_value in enumerate(['AI research workflow', 'Lecture notes source', 'Short explainer']):
        draw_result_row(draw, 28, 104 + i * 142, selected=True, title=title_value, variant=i, w=536)
    draw_popup_panel(base, 210, 300, count=3, note='Ready to copy clean watch and Shorts URLs.', copied=True)

    rounded(draw, (654, 24, 1240, 64), 20, WHITE, (226, 232, 238))
    text(draw, (680, 36), 'notebooklm.google.com · Add sources', 15, (78, 91, 105))
    rounded(draw, (676, 112, 1216, 682), 30, WHITE, (218, 226, 234))
    text(draw, (718, 158), 'Paste clean YouTube URLs', 34, INK, True)
    wrap_text(draw, (720, 212), 'TubeLM copies one URL per line, so your source list is ready for NotebookLM or AI research notes.', 18, MUTED, max_width=430)
    rounded(draw, (720, 306, 1172, 500), 22, (248, 250, 252), (221, 228, 235))
    urls = ['https://www.youtube.com/watch?v=...', 'https://www.youtube.com/watch?v=...', 'https://www.youtube.com/shorts/...']
    for i, url in enumerate(urls):
        rounded(draw, (746, 334 + i * 48, 774, 362 + i * 48), 8, MINT, (6, 18, 31), 2)
        text(draw, (794, 338 + i * 48), url, 18, (44, 55, 66))
    rounded(draw, (720, 548, 946, 612), 20, GREEN)
    text(draw, (758, 567), 'Add sources', 23, (3, 31, 22), True)
    text(draw, (972, 570), 'No cleanup needed', 18, GREEN_DARK, True)
    base.convert('RGB').save(OUT / 'screenshot-04-notebooklm-paste.png')


def screenshot_privacy():
    base = gradient((1280, 800), (246, 248, 250), (230, 239, 237))
    draw = ImageDraw.Draw(base)
    draw.rectangle((0, 0, 1280, 78), fill=WHITE)
    draw.line((0, 77, 1280, 77), fill=(226, 232, 238), width=1)
    paste_icon(base, 42, 18, 42)
    text(draw, (96, 23), 'TubeLM Privacy', 24, INK, True)
    text(draw, (860, 30), 'Local processing only', 16, GREEN_DARK, True)

    text(draw, (86, 150), 'No backend. No analytics. No account.', 42, INK, True)
    wrap_text(draw, (88, 214), 'TubeLM reads visible YouTube cards locally so you can choose videos and copy clean links. Selected URLs stay in your browser unless you paste them somewhere yourself.', 22, MUTED, max_width=860)

    cards = [
        ('Website content', 'Processed locally to find video and Shorts links on YouTube pages.'),
        ('Clipboard write', 'Used only after you click Copy selection.'),
        ('Remote code', 'No remote hosted code is loaded or executed.'),
    ]
    for i, (card_title, body) in enumerate(cards):
        x = 86 + i * 376
        y = 358
        shadow(base, (x, y, x + 326, y + 214), radius=26, blur=18, offset=(0, 10), color=(0, 0, 0, 28))
        rounded(draw, (x, y, x + 326, y + 214), 26, WHITE, (218, 226, 234))
        rounded(draw, (x + 28, y + 30, x + 70, y + 72), 13, MINT, (6, 18, 31), 2)
        draw.line((x + 39, y + 52, x + 48, y + 61, x + 64, y + 42), fill=(6, 18, 31), width=4)
        text(draw, (x + 90, y + 34), card_title, 21, INK, True)
        wrap_text(draw, (x + 28, y + 104), body, 17, MUTED, max_width=260)

    rounded(draw, (86, 646, 1194, 714), 24, INK, (55, 71, 88))
    text(draw, (124, 668), 'Privacy disclosure: Website content — Yes, local only.', 20, WHITE, True)
    text(draw, (124, 696), 'Everything else should match the extension behavior and public privacy page.', 14, SOFT_TEXT)
    base.convert('RGB').save(OUT / 'screenshot-05-local-privacy.png')


def promo_small():
    w, h = 440, 280
    base = gradient((w, h), INK, (8, 22, 34))
    radial_glow(base, (310, 48), 150, MINT, 48)
    draw = ImageDraw.Draw(base)
    paste_icon(base, 32, 30, 78)
    text(draw, (126, 36), 'TubeLM', 34, WHITE, True)
    text(draw, (128, 76), 'Link Picker', 17, MINT, True)

    rounded(draw, (300, 42, 404, 118), 18, (28, 38, 52), (72, 92, 110))
    rounded(draw, (316, 60, 390, 102), 10, PAPER, (185, 196, 207))
    draw_checkbox(draw, 326, 68, True, scale=0.82)

    text(draw, (34, 158), 'Pick videos.', 30, WHITE, True)
    text(draw, (34, 196), 'Copy clean links.', 30, WHITE, True)
    text(draw, (36, 242), 'For NotebookLM and AI research notes.', 13, SOFT_TEXT, True)
    base.convert('RGB').save(OUT / 'promo-small-440x280.png')


def promo_marquee():
    w, h = 1400, 560
    base = gradient((w, h), (244, 247, 249), (225, 239, 236))
    radial_glow(base, (1030, 82), 300, MINT, 54)
    draw = ImageDraw.Draw(base)
    paste_icon(base, 72, 68, 86)
    text(draw, (178, 76), 'TubeLM Link Picker', 28, INK, True)
    text(draw, (180, 112), 'Chrome extension for YouTube source collection', 16, MUTED)

    text(draw, (72, 190), 'Pick YouTube videos.', 52, INK, True)
    text(draw, (72, 252), 'Copy clean links.', 52, INK, True)
    wrap_text(draw, (76, 330), 'Select videos or Shorts, then paste newline-ready URLs into NotebookLM or your AI research notes.', 22, MUTED, max_width=520)
    rounded(draw, (76, 432, 318, 490), 19, INK)
    text(draw, (108, 449), 'Built for research notes', 20, WHITE, True)

    shadow(base, (740, 64, 1302, 496), radius=34, blur=26, offset=(0, 18), color=(0, 0, 0, 48))
    rounded(draw, (740, 64, 1302, 496), 34, WHITE, (214, 224, 232))
    rounded(draw, (768, 96, 1274, 148), 24, (248, 250, 252), (226, 232, 238))
    rounded(draw, (792, 110, 820, 136), 8, RED)
    draw.polygon([(802, 117), (802, 130), (814, 123)], fill=WHITE)
    text(draw, (838, 112), 'YouTube source queue', 16, INK, True)
    for i in range(3):
        draw_video_card(draw, 774 + i * 162, 180, 146, selected=i != 1, title=['Video', 'Short', 'Lecture'][i], url='clean URL', variant=i)
    draw_popup_panel(base, 1016, 48, count=2, note='Ready to copy clean URLs.')
    base.convert('RGB').save(OUT / 'promo-marquee-1400x560.png')


def main():
    # Remove old upload screenshots so store-assets remains intentional and CWS-safe.
    for stale in [OUT / 'screenshot-02-search-results.png']:
        stale.unlink(missing_ok=True)

    screenshot_hero()
    screenshot_batch_select()
    screenshot_shorts()
    screenshot_notebooklm()
    screenshot_privacy()
    promo_small()
    promo_marquee()

    for path in sorted(OUT.glob('*.png')):
        image = Image.open(path)
        print(f'{path.relative_to(ROOT).as_posix()} {image.size[0]}x{image.size[1]} {image.mode} {path.stat().st_size} bytes')


if __name__ == '__main__':
    main()
