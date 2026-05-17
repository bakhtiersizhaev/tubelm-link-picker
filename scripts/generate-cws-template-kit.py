from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'cws-asset-templates'
OUT.mkdir(exist_ok=True)

INK = (18, 20, 23)
DEEP = (9, 14, 24)
GRAPHITE = (31, 41, 55)
PAPER = (244, 246, 248)
SOFT = (230, 236, 242)
WHITE = (255, 255, 255)
MUTED = (101, 113, 126)
MINT = (125, 248, 198)
GREEN = (16, 185, 129)
GREEN_DARK = (5, 80, 58)
RED = (255, 0, 51)
BLUE = (68, 90, 120)
AMBER = (245, 158, 11)


def font(size, bold=False):
    candidates = [
        'C:/Windows/Fonts/segoeuib.ttf' if bold else 'C:/Windows/Fonts/segoeui.ttf',
        'C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf',
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def draw_text(draw, xy, text, size=24, fill=INK, bold=False, max_width=None, line_gap=1.15):
    f = font(size, bold)
    x, y = xy
    if not max_width:
        draw.text((x, y), text, font=f, fill=fill)
        return y + size

    words = text.split()
    line = ''
    for word in words:
        test = word if not line else f'{line} {word}'
        if draw.textbbox((0, 0), test, font=f)[2] <= max_width:
            line = test
        else:
            draw.text((x, y), line, font=f, fill=fill)
            y += int(size * line_gap)
            line = word
    if line:
        draw.text((x, y), line, font=f, fill=fill)
        y += int(size * line_gap)
    return y


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius, fill=fill, outline=outline, width=width)


def shadow(base, box, radius=28, blur=32, offset=(0, 18), color=(0, 0, 0, 55)):
    layer = Image.new('RGBA', base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x0, y0, x1, y1 = box
    dx, dy = offset
    d.rounded_rectangle((x0 + dx, y0 + dy, x1 + dx, y1 + dy), radius, fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(layer)


def gradient(size, top, bottom):
    w, h = size
    img = Image.new('RGB', size, top)
    d = ImageDraw.Draw(img)
    for y in range(h):
        a = y / max(1, h - 1)
        color = tuple(int(top[i] * (1 - a) + bottom[i] * a) for i in range(3))
        d.line((0, y, w, y), fill=color)
    return img.convert('RGBA')


def load_icon(size):
    icon_path = ROOT / 'icons' / 'icon-128.png'
    icon = Image.open(icon_path).convert('RGBA').resize((size, size), Image.LANCZOS)
    return icon


def paste_icon(base, x, y, size):
    icon = load_icon(size)
    base.alpha_composite(icon, (x, y))


def browser_frame(base, box, url='youtube.com/results?search_query=ai+research', dark=False):
    draw = ImageDraw.Draw(base)
    x0, y0, x1, y1 = box
    fill = (255, 255, 255) if not dark else (22, 28, 38)
    top = (247, 249, 251) if not dark else (31, 41, 55)
    border = (211, 219, 228) if not dark else (65, 80, 100)
    shadow(base, box, radius=28, blur=30, offset=(0, 18), color=(0, 0, 0, 45))
    rounded(draw, box, 28, fill, border)
    rounded(draw, (x0, y0, x1, y0 + 64), 28, top, border)
    draw.rectangle((x0, y0 + 32, x1, y0 + 64), fill=top)
    for i, color in enumerate([(238, 88, 88), (241, 190, 74), (83, 196, 114)]):
        draw.ellipse((x0 + 26 + i * 22, y0 + 23, x0 + 38 + i * 22, y0 + 35), fill=color)
    rounded(draw, (x0 + 132, y0 + 16, x1 - 34, y0 + 46), 15, (236, 241, 246) if not dark else (18, 25, 36), (220, 227, 235) if not dark else (55, 69, 89))
    draw.text((x0 + 154, y0 + 22), url, font=font(15), fill=(78, 91, 105) if not dark else (177, 190, 205))


def draw_youtube_grid(base, area, selected=(0, 2, 5), shorts=False):
    draw = ImageDraw.Draw(base)
    x0, y0, x1, y1 = area
    draw.rectangle(area, fill=WHITE)
    draw.text((x0 + 28, y0 + 24), 'Replace with your real YouTube capture', font=font(22, True), fill=INK)
    draw.text((x0 + 28, y0 + 56), 'Keep final screenshot full-bleed, square-corner, no padding.', font=font(15), fill=MUTED)
    cols = 3
    gap = 22
    tile_w = (x1 - x0 - 56 - gap * (cols - 1)) // cols
    tile_h = 132
    start_y = y0 + 102
    labels = ['AI research workflow', 'NotebookLM source', 'Lecture notes', 'Podcast summary', 'Shorts batch', 'Clean URL list']
    for i in range(6):
        col = i % cols
        row = i // cols
        x = x0 + 28 + col * (tile_w + gap)
        y = start_y + row * (tile_h + 76)
        color = [(33, 43, 58), (18, 28, 43), (42, 58, 77), (30, 64, 75), (45, 48, 70), (23, 50, 63)][i]
        rounded(draw, (x, y, x + tile_w, y + tile_h), 18, color)
        for stripe in range(6):
            draw.line((x + 18, y + 20 + stripe * 17, x + tile_w - 18, y + 26 + stripe * 17), fill=tuple(min(255, c + 24) for c in color), width=2)
        draw.polygon([(x + tile_w / 2 - 16, y + tile_h / 2 - 20), (x + tile_w / 2 - 16, y + tile_h / 2 + 20), (x + tile_w / 2 + 23, y + tile_h / 2)], fill=(255, 255, 255, 230))
        if i in selected:
            rounded(draw, (x + 12, y + 12, x + 48, y + 48), 10, MINT, (6, 18, 31), 2)
            draw.line((x + 21, y + 31, x + 30, y + 39, x + 43, y + 21), fill=(6, 18, 31), width=4)
        else:
            rounded(draw, (x + 12, y + 12, x + 48, y + 48), 10, (13, 23, 35), WHITE, 2)
        draw.text((x, y + tile_h + 12), labels[i], font=font(17, True), fill=INK)
        draw.text((x, y + tile_h + 38), 'youtube.com/shorts/ID' if shorts else 'youtube.com/watch?v=ID', font=font(13), fill=MUTED)


def popup_panel(base, box, count=3, title='TubeLM'):
    draw = ImageDraw.Draw(base)
    x0, y0, x1, y1 = box
    shadow(base, box, radius=26, blur=26, offset=(0, 16), color=(0, 0, 0, 70))
    rounded(draw, box, 26, INK, (52, 67, 82))
    paste_icon(base, x0 + 26, y0 + 24, 54)
    draw.text((x0 + 94, y0 + 26), title, font=font(28, True), fill=WHITE)
    draw.text((x0 + 94, y0 + 60), 'YouTube links for NotebookLM', font=font(13), fill=(190, 201, 213))
    rounded(draw, (x1 - 112, y0 + 28, x1 - 28, y0 + 54), 13, (20, 83, 62), (70, 200, 150))
    draw.text((x1 - 94, y0 + 33), 'Ready', font=font(13, True), fill=MINT)
    rounded(draw, (x0 + 26, y0 + 104, x1 - 26, y0 + 212), 22, PAPER, (220, 226, 232))
    draw.text((x0 + 48, y0 + 126), 'Selected', font=font(15, True), fill=MUTED)
    draw.text((x0 + 48, y0 + 148), str(count), font=font(52, True), fill=INK)
    draw.text((x0 + 128, y0 + 162), 'videos ready to copy', font=font(18), fill=(61, 73, 88))
    rounded(draw, (x0 + 26, y0 + 236, x1 - 26, y0 + 326), 22, GREEN)
    draw.text((x0 + 54, y0 + 258), f'Copy {count} URLs', font=font(25, True), fill=(3, 31, 22))
    draw.text((x0 + 54, y0 + 290), 'Newline list, clean and ready', font=font(14), fill=(7, 69, 50))
    rounded(draw, (x0 + 26, y0 + 350, x0 + 182, y0 + 398), 16, (238, 242, 245), (218, 224, 230))
    rounded(draw, (x0 + 198, y0 + 350, x1 - 26, y0 + 398), 16, (238, 242, 245), (218, 224, 230))
    draw.text((x0 + 48, y0 + 364), 'Select visible', font=font(15, True), fill=INK)
    draw.text((x0 + 228, y0 + 364), 'Clear', font=font(15, True), fill=INK)


def guide_badge(draw, text, x, y, w=240):
    rounded(draw, (x, y, x + w, y + 34), 17, (18, 20, 23, 235), (255, 255, 255, 70))
    draw.text((x + 16, y + 8), text, font=font(13, True), fill=WHITE)


def screenshot_template(filename, headline, subline, variant='hero'):
    w, h = 1280, 800
    base = gradient((w, h), (246, 248, 250), (230, 238, 241))
    draw = ImageDraw.Draw(base)
    for x in range(0, w, 40):
        draw.line((x, 0, x, h), fill=(218, 226, 232, 90), width=1)
    for y in range(0, h, 40):
        draw.line((0, y, w, y), fill=(218, 226, 232, 80), width=1)

    if variant in ['hero', 'search', 'shorts']:
        browser_frame(base, (54, 54, 1226, 746), 'youtube.com/results?search_query=ai+research' if variant != 'shorts' else 'youtube.com/shorts')
        draw_youtube_grid(base, (55, 119, 1225, 745), selected=(0, 2, 4) if variant != 'shorts' else (0, 1, 3, 4), shorts=variant == 'shorts')
        popup_panel(base, (820, 116, 1194, 548), count=3 if variant != 'shorts' else 4)
    elif variant == 'sidepanel':
        browser_frame(base, (46, 54, 870, 746), 'youtube.com/channel/demo')
        draw_youtube_grid(base, (47, 119, 869, 745), selected=(0, 3, 5))
        shadow(base, (902, 54, 1236, 746), radius=26, blur=24, offset=(0, 14), color=(0, 0, 0, 55))
        rounded(draw, (902, 54, 1236, 746), 26, INK, (54, 70, 88))
        paste_icon(base, 930, 88, 58)
        draw.text((1002, 92), 'Side panel', font=font(28, True), fill=WHITE)
        draw_text(draw, (930, 162), 'Keep TubeLM visible while you pick videos on YouTube.', 19, (202, 213, 224), max_width=250)
        rounded(draw, (930, 254, 1208, 356), 22, PAPER, (220, 226, 232))
        draw.text((956, 278), 'Selected', font=font(15, True), fill=MUTED)
        draw.text((956, 300), '3', font=font(48, True), fill=INK)
        draw.text((1018, 314), 'links', font=font(20), fill=(61, 73, 88))
        rounded(draw, (930, 390, 1208, 464), 20, GREEN)
        draw.text((958, 414), 'Copy selection', font=font(23, True), fill=(3, 31, 22))
    elif variant == 'notebooklm':
        browser_frame(base, (48, 58, 600, 742), 'youtube.com/results')
        draw_youtube_grid(base, (49, 123, 599, 741), selected=(0, 2, 3))
        browser_frame(base, (650, 58, 1232, 742), 'notebooklm.google.com')
        rounded(draw, (690, 146, 1192, 660), 24, WHITE, (218, 226, 234))
        draw.text((726, 186), 'Paste clean URLs', font=font(38, True), fill=INK)
        draw_text(draw, (728, 240), 'Replace this panel with a real NotebookLM add-sources capture.', 18, MUTED, max_width=390)
        rounded(draw, (728, 310, 1152, 500), 18, (247, 249, 251), (221, 228, 235))
        for i, url in enumerate(['youtube.com/watch?v=...', 'youtube.com/watch?v=...', 'youtube.com/shorts/...']):
            draw.text((758, 344 + i * 44), url, font=font(20), fill=(44, 55, 66))
        rounded(draw, (728, 538, 960, 598), 18, GREEN)
        draw.text((762, 556), 'Add sources', font=font(22, True), fill=(3, 31, 22))
    elif variant == 'privacy':
        browser_frame(base, (54, 58, 1226, 742), 'github.io/tubelm-link-picker/privacy.html')
        x0, y0 = 112, 150
        paste_icon(base, x0, y0, 72)
        draw.text((x0 + 94, y0 + 4), 'Local processing only', font=font(44, True), fill=INK)
        draw_text(draw, (x0 + 96, y0 + 62), 'You select the links. TubeLM copies them locally. No account, no backend, no analytics.', 22, MUTED, max_width=760)
        cards = [('No remote code', 'Runs from the extension package.'), ('No server upload', 'Selected links stay in your browser.'), ('YouTube only', 'Host permission is restricted to YouTube pages.')]
        for i, (t, s) in enumerate(cards):
            x = 112 + i * 360
            y = 364
            shadow(base, (x, y, x + 310, y + 190), radius=24, blur=18, offset=(0, 10), color=(0, 0, 0, 28))
            rounded(draw, (x, y, x + 310, y + 190), 24, WHITE, (218, 226, 234))
            rounded(draw, (x + 26, y + 26, x + 66, y + 66), 12, MINT, (6, 18, 31), 2)
            draw.text((x + 84, y + 30), t, font=font(21, True), fill=INK)
            draw_text(draw, (x + 26, y + 94), s, 17, MUTED, max_width=250)

    draw.rectangle((0, h - 70, w, h), fill=(18, 20, 23, 238))
    paste_icon(base, 36, h - 56, 36)
    draw.text((84, h - 48), headline, font=font(24, True), fill=WHITE)
    draw.text((84, h - 22), subline, font=font(14), fill=(202, 213, 224))
    guide_badge(draw, '1280 x 800 screenshot template', w - 330, 24, 294)
    base.convert('RGB').save(OUT / filename)


def small_promo():
    w, h = 440, 280
    base = gradient((w, h), INK, (8, 22, 34))
    draw = ImageDraw.Draw(base)
    for r, alpha in [(170, 42), (110, 55), (70, 70)]:
        layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        ld.ellipse((250 - r, 42 - r, 250 + r, 42 + r), fill=(125, 248, 198, alpha))
        layer = layer.filter(ImageFilter.GaussianBlur(30))
        base.alpha_composite(layer)
    paste_icon(base, 30, 28, 78)
    draw.text((126, 34), 'TubeLM', font=font(34, True), fill=WHITE)
    draw.text((128, 74), 'Link Picker', font=font(17, True), fill=MINT)
    rounded(draw, (300, 42, 405, 116), 18, (28, 38, 52), (72, 92, 110))
    rounded(draw, (316, 60, 390, 100), 10, PAPER, (185, 196, 207))
    rounded(draw, (326, 68, 350, 92), 7, MINT, (6, 18, 31), 2)
    draw.line((332, 81, 339, 87, 348, 72), fill=(6, 18, 31), width=3)
    draw.text((34, 160), 'Copy multiple', font=font(30, True), fill=WHITE)
    draw.text((34, 197), 'YouTube links.', font=font(30, True), fill=WHITE)
    draw.text((36, 242), 'For NotebookLM and AI research notes.', font=font(13, True), fill=(176, 188, 202))
    base.convert('RGB').save(OUT / '06-small-promo-tile-440x280.png')


def marquee():
    w, h = 1400, 560
    base = gradient((w, h), (244, 246, 248), (226, 238, 236))
    draw = ImageDraw.Draw(base)
    for x in range(0, w, 56):
        draw.line((x, 0, x, h), fill=(210, 220, 225, 80))
    paste_icon(base, 72, 68, 82)
    draw.text((178, 76), 'TubeLM Link Picker', font=font(28, True), fill=INK)
    draw.text((74, 184), 'YouTube links', font=font(82, True), fill=INK)
    draw.text((74, 272), 'for NotebookLM.', font=font(82, True), fill=INK)
    draw_text(draw, (78, 382), 'Select videos and Shorts on YouTube, then copy clean URLs in one click. Local, simple, open source.', 24, (50, 64, 78), max_width=580)
    rounded(draw, (76, 470, 312, 520), 25, INK)
    draw.text((106, 484), 'Copy multiple links', font=font(17, True), fill=WHITE)
    shadow(base, (760, 72, 1324, 486), radius=30, blur=35, offset=(0, 22), color=(0, 0, 0, 60))
    rounded(draw, (760, 72, 1324, 486), 30, WHITE, (208, 218, 228))
    browser_frame(base, (786, 102, 1298, 460), 'youtube.com/results')
    draw_youtube_grid(base, (787, 167, 1297, 459), selected=(0, 2, 4))
    popup_panel(base, (1030, 148, 1280, 432), count=3)
    base.convert('RGB').save(OUT / '07-marquee-promo-tile-1400x560.png')


def video_thumb():
    w, h = 1280, 720
    base = gradient((w, h), DEEP, (14, 30, 44))
    draw = ImageDraw.Draw(base)
    paste_icon(base, 76, 76, 88)
    draw.text((190, 88), 'TubeLM Link Picker', font=font(34, True), fill=WHITE)
    draw.text((78, 224), 'Copy YouTube links', font=font(70, True), fill=WHITE)
    draw.text((78, 302), 'into NotebookLM faster.', font=font(70, True), fill=MINT)
    draw_text(draw, (82, 430), 'Use this as a YouTube promo-video thumbnail if you make an optional CWS video. The dashboard takes a YouTube URL, not this PNG directly.', 23, (202, 213, 224), max_width=620)
    rounded(draw, (78, 585, 300, 642), 28, GREEN)
    draw.text((112, 602), 'Watch demo', font=font(20, True), fill=(3, 31, 22))
    browser_frame(base, (760, 96, 1210, 610), 'youtube.com/results')
    draw_youtube_grid(base, (761, 161, 1209, 609), selected=(0, 1, 3))
    base.convert('RGB').save(OUT / '08-optional-video-thumbnail-1280x720.png')


def icon_preview():
    img = Image.new('RGBA', (128, 128), (0, 0, 0, 0))
    paste_icon(img, 0, 0, 128)
    img.save(OUT / '00-store-icon-current-128x128.png')


def asset_map():
    w, h = 1600, 1200
    base = gradient((w, h), (246, 248, 250), (230, 237, 242))
    draw = ImageDraw.Draw(base)
    draw.text((70, 64), 'Chrome Web Store asset map', font=font(54, True), fill=INK)
    draw_text(draw, (72, 132), 'As of 2026-05-16: icon 128x128, screenshots 1280x800 up to 5, small promo 440x280, marquee promo 1400x560 optional. Promo video is a YouTube URL, not an uploaded image.', 22, MUTED, max_width=1180)
    items = [
        ('00', 'Store icon', '128 x 128', 'Required, usually comes from the package icon.'),
        ('01', 'Hero screenshot', '1280 x 800', 'Required screenshot slot. Replace with real product capture.'),
        ('02', 'Batch select workflow', '1280 x 800', 'Screenshot 2. Show multi-link selection and Select visible.'),
        ('03', 'Shorts support', '1280 x 800', 'Screenshot 3. Show selected Shorts and side panel flow.'),
        ('04', 'NotebookLM paste flow', '1280 x 800', 'Screenshot 4. Show clean URLs pasted as sources.'),
        ('05', 'Privacy/local flow', '1280 x 800', 'Screenshot 5. Build trust with local-only processing.'),
        ('06', 'Small promo tile', '440 x 280', 'Required promotional image.'),
        ('07', 'Marquee promo tile', '1400 x 560', 'Optional but recommended for featuring.'),
        ('08', 'Video thumbnail', '1280 x 720', 'Optional thumbnail for your YouTube demo video.'),
    ]
    x0, y0 = 72, 228
    for idx, (num, name, size, note) in enumerate(items):
        col = idx % 3
        row = idx // 3
        x = x0 + col * 486
        y = y0 + row * 250
        shadow(base, (x, y, x + 420, y + 202), radius=26, blur=18, offset=(0, 12), color=(0, 0, 0, 30))
        rounded(draw, (x, y, x + 420, y + 202), 26, WHITE, (215, 224, 232))
        draw.text((x + 28, y + 24), num, font=font(38, True), fill=GREEN_DARK)
        draw.text((x + 100, y + 32), name, font=font(25, True), fill=INK)
        rounded(draw, (x + 28, y + 84, x + 178, y + 122), 19, (232, 248, 241), (148, 220, 188))
        draw.text((x + 48, y + 94), size, font=font(16, True), fill=GREEN_DARK)
        draw_text(draw, (x + 28, y + 140), note, 15, MUTED, max_width=350)
    base.convert('RGB').save(OUT / '00-cws-asset-map-1600x1200.png')


def main():
    for stale in [
        '02-screenshot-shorts-template-1280x800.png',
        '03-screenshot-notebooklm-paste-template-1280x800.png',
        '04-screenshot-side-panel-template-1280x800.png',
    ]:
        (OUT / stale).unlink(missing_ok=True)

    icon_preview()
    screenshot_template('01-screenshot-hero-template-1280x800.png', '01 Hero: pick videos, copy clean links', 'Replace placeholders with a real YouTube capture + TubeLM popup.', 'hero')
    screenshot_template('02-screenshot-batch-select-template-1280x800.png', '02 Batch: select visible results', 'Show the multi-link workflow without overloading the screen.', 'search')
    screenshot_template('03-screenshot-shorts-template-1280x800.png', '03 Shorts: collect short-form sources', 'Show selected Shorts and side panel mode.', 'shorts')
    screenshot_template('04-screenshot-notebooklm-paste-template-1280x800.png', '04 NotebookLM paste flow', 'Show selected YouTube URLs pasted as sources.', 'notebooklm')
    screenshot_template('05-screenshot-privacy-local-template-1280x800.png', '05 Privacy: local link picking', 'Use for trust messaging, or replace with privacy page capture.', 'privacy')
    small_promo()
    marquee()
    video_thumb()
    asset_map()
    for path in sorted(OUT.glob('*.png')):
        img = Image.open(path)
        print(f'{path.relative_to(ROOT).as_posix()} {img.size[0]}x{img.size[1]} {img.mode} {path.stat().st_size} bytes')


if __name__ == '__main__':
    main()
