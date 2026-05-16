# TubeLM - Image Asset Guide for the Chrome Web Store

This document is for **Bakhtier**. You said you will produce the screenshots
and promo tiles manually - this guide gives you the exact specs, what to put
in each frame, and a critique of the current SVG icon so you know what to fix
before exporting.

All numbers below match the Chrome Web Store Developer Dashboard requirements
as of May 2026.

---

## 1. TL;DR - what you need to produce

| Asset | Required? | Size (px) | Format | File size limit |
| --- | --- | --- | --- | --- |
| Store icon | yes - already shipped at 128 | 128 x 128 | PNG (24-bit, alpha ok) | 1 MB |
| In-extension icons | yes - shipped 16/32/48/128 | as named | PNG | 1 MB each |
| Screenshots | **at least 1, up to 5** | 1280 x 800 **or** 640 x 400 | PNG or JPEG | 16 MB each |
| Small promotional tile | **required** | 440 x 280 | PNG or JPEG (no transparency) | 16 MB |
| Marquee promotional tile | optional but recommended for featuring | 1400 x 560 | PNG or JPEG (no transparency) | 16 MB |
| Privacy policy URL | **required** (already prepared) | n/a | URL | n/a |

> Source: Chrome Web Store Developer Dashboard, "Store listing" tab. As of 2025,
> Google deprecated the large (920x680) and marquee tile is the only large
> promo asset. The "small tile" is still mandatory.

**Hard rules from Google:**

- No transparency on promo tiles (they will appear on white or dark surfaces).
- No text larger than ~30% of the image area in promo tiles.
- Screenshots must show the extension actually doing something - not just
  marketing copy on a colored background. Reviewers reject "ad-only"
  screenshots.
- Your developer name (`Bakhtier Sizhaev`) must be visible in the listing -
  this is filled in via the developer account, not via the images.
- No fake UI, no fake metrics ("10M users" etc.), no fake awards.

---

## 2. Brand kit (extracted from the existing repo)

Use these exact values so the store assets match the in-extension UI.

### Colors

| Role | Hex | Where it's used |
| --- | --- | --- |
| Ink (primary text / dark surface) | `#121417` | popup background, hero text |
| Paper | `#f4f6f8` | popup background, landing page |
| Accent green | `#10b981` | "copy" success state, CTAs |
| Accent green strong | `#0f8f69` | hover, dark-on-light text |
| Mint highlight | `#7df8c6` | icon stroke, glow |
| YouTube red | `#ff0033` | subtle YT cue (icon underline in popup logo) |
| Muted | `#65717e` | secondary text |
| Border | `rgba(18, 20, 23, 0.12)` | dividers |
| Soft panel | `#eef2f4` | secondary buttons |

### Typography

- Primary: **Inter** (system fallback: `SF Pro Display`, `Segoe UI`,
  `system-ui`).
- Headlines: weight 800, letter-spacing 0.
- Body: weight 400-500.
- Captions in promo tiles: weight 700, all-caps **only** for short eyebrow
  labels.

### Voice

- Direct and product-led. No emojis. No marketing fluff.
- Short verbs: "Pick", "Copy", "Paste".
- Anchor every message to NotebookLM or AI research workflow.

---

## 3. Icon critique (`icons/icon.svg`)

The existing icon is a 512x512 viewBox with two overlapping rounded rectangles
(mint stroke `#7df8c6`, weight 36) over a navy gradient, with a small white
play triangle in the middle. It reads as "two cards stacked" + "play" = "pick
multiple videos". Conceptually strong.

### What works

- Color palette matches the in-extension UI (navy ink + mint accent).
- The "two stacked rectangles" metaphor maps directly to the single purpose of
  the extension: select multiple videos.
- The corner radius (112 on 480 inner = 23%) feels modern and won't get
  awkwardly cropped by Chrome's own rounded-corner mask.
- Vector source means you can re-export at any size.

### What to fix before final export

1. **Stroke is too thin for 16-32 px.** Stroke width 36 on a 512 canvas is
   ~7%. After downscaling to 16 px, the strokes become ~1.1 px - barely
   visible, blurs on subpixel boundaries. **Bump to 56-64** for the 16/32
   exports (you can keep the 128 export at 36-44 for elegance).
2. **The two rectangles overlap, and the overlap region creates an ambiguous
   blob at 16 px.** Two options:
   - Increase the offset between them from `(82, 52)` to about `(120, 80)` so
     they read as two cards even when tiny.
   - Or ship a separate **small-icon SVG** (a single rectangle with a play
     triangle, no overlap) used only for 16 and 32 px.
3. **The play triangle is too small.** `polygon 240,220 332,256 240,292` =
   ~92 px wide on a 512 canvas (~18%). At 16 px this becomes a 3 px dot.
   Bring it up to ~26-30% of the canvas, or drop it entirely from the small
   variant.
4. **No safe padding.** Chrome renders the 128 icon inside a slightly inset
   mask. Your art currently goes from 32 to 480 (16 px padding each side on
   512, or ~4 px on 128). Google recommends **96 x 96 of art inside 128 x 128**
   (16 px transparent padding each side). Crop the outer `rect` to
   `x=64 y=64 width=384 height=384` for the 128 export to be safe.
5. **No transparent background.** Right now the rounded navy rectangle fills
   the entire canvas; that's fine because the rectangle itself is rounded. But
   make sure the area **outside** the rounded rectangle is transparent in the
   exported PNG (this script in this PR already does it via cairosvg - if you
   re-render manually in Figma/Affinity, double-check the export checkbox
   "Background: transparent" is on).
6. **Optional: add a 1 px stroke ring around the rounded rectangle.** On
   light backgrounds (toolbar in light theme) the navy navy looks great; on
   dark backgrounds it can disappear. A `#ffffff14` inner stroke fixes it.

### A "ready-to-tune" small-icon SVG (drop into `icons/icon-small.svg`)

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1223"/>
      <stop offset="100%" stop-color="#10243a"/>
    </linearGradient>
  </defs>
  <rect x="16" y="16" width="96" height="96" rx="22" fill="url(#bg)"/>
  <rect x="32" y="40" width="64" height="48" rx="14" fill="none" stroke="#7df8c6" stroke-width="9"/>
  <polygon points="54,52 80,64 54,76" fill="#f5f8ff"/>
</svg>
```

Use this for the 16 and 32 px PNGs, keep the existing `icon.svg` for 48/128.

### Recommended export workflow

1. Open `icons/icon.svg` in Figma / Affinity Designer / Inkscape.
2. Apply the fixes from points 1-5 above.
3. Export PNG at 16, 32, 48, 128 - **with transparent background** and
   **no anti-alias compression** (use PNG-24, not PNG-8).
4. Replace the four `icons/icon-*.png` files in this repo.

> The script `python3 -c "import cairosvg; cairosvg.svg2png(...)"` is fine for
> the first pass (this PR uses it), but a hand-tuned 16 px PNG always looks
> better than an automatic downscale.

---

## 4. Screenshots (1280 x 800)

The Chrome Web Store displays screenshots in a carousel on the listing page
and the first one is the **only** image most users see in search results
inside the store. Treat the first screenshot as your real cover.

### Layout grammar (use across all 5)

```
+-------------------------------------------------------------+
|  [Eyebrow label - 12 px, uppercase, mint]                  |
|  [Headline - 56-64 px, weight 800, ink color]              |
|  [Sub-headline - 22 px, weight 500, muted]                 |
|                                                             |
|        +------------------------------+                     |
|        |                              |                     |
|        |   Real product screenshot    |                     |
|        |   (YouTube page + popup)     |                     |
|        |                              |                     |
|        +------------------------------+                     |
|                                                             |
|  [Footer brand strip: TubeLM mark + "by Bakhtier Sizhaev"] |
+-------------------------------------------------------------+
```

- Outer canvas: **1280 x 800**, background `#f4f6f8` (paper) or pure white.
- Safe inner area: **1120 x 720** (80 px gutter each side).
- Real screenshot inset: ~1000 x 540, with a 1 px `rgba(18,20,23,0.12)`
  border and 24-32 px shadow (`0 24px 80px rgba(30,39,50,0.15)`).
- Tilt: 0 degrees. Do not rotate the product. Chrome reviewers prefer flat,
  honest captures.
- Headline copy max 8 words. Sub-headline max 14 words.

### What each of the 5 frames should show

1. **Hero - "Pick videos, copy clean links"**
   Eyebrow: `Chrome extension for NotebookLM`
   Headline: `Pick YouTube videos. Copy clean links.`
   Sub: `Tick the videos you want, paste a clean list anywhere.`
   Screenshot: a YouTube channel page (e.g. a tech channel with 4-5 visible
   tiles) where 3 tiles have a green check overlay and the TubeLM popup is
   open in the top-right showing "Copy 3 URLs" enabled. **This is your cover.**

2. **Works on Shorts**
   Eyebrow: `Shorts supported`
   Headline: `Shorts grid? Same flow.`
   Sub: `Shorts are exported as youtube.com/shorts/ID so NotebookLM accepts them.`
   Screenshot: youtube.com/shorts grid view with checkboxes on 5 thumbnails.

3. **One-click paste into NotebookLM**
   Eyebrow: `Built for NotebookLM`
   Headline: `Paste the list straight into NotebookLM.`
   Sub: `Newline-separated URLs - exactly the format NotebookLM expects.`
   Screenshot: split capture: TubeLM popup on the left showing "Copy 18
   URLs", NotebookLM "Add sources" dialog on the right with the URLs pasted
   in. (You can do this as two side-by-side product crops on one 1280x800
   canvas.)

4. **Privacy-first**
   Eyebrow: `No tracking, no accounts`
   Headline: `Local-only. No data leaves your browser.`
   Sub: `Runs only on youtube.com. No analytics. Open source under MIT.`
   Visual: a clean infographic - 4 ticked items in a 2x2 grid:
   `No backend`, `No telemetry`, `No login`, `Open source`. Background pure
   white, ticks in `#10b981`. Use small icons (lock, eye-off, github, mit).

5. **Curation flow**
   Eyebrow: `Selection that scales`
   Headline: `Select visible. Clear. Repeat.`
   Sub: `Two helper buttons let you build a 50-link list without losing your place.`
   Screenshot: zoom in on the TubeLM popup with the buttons highlighted (a
   thin dashed `#10b981` ring around "Select visible" and "Clear").

### Capture tips

- Take real captures on a 16:10 monitor (or 1920x1200 zoomed to 75%) so the
  YouTube layout matches the 1280x800 export aspect.
- Hide your YouTube account avatar - either use a fresh logged-out window or
  blur the top-right corner.
- Use a neutral channel for the demo (educational / public-domain content).
  Do **not** use copyrighted thumbnails of specific creators without consent.
- The cursor should not be in the frame unless you intentionally place it on
  the "Copy" button.

### File output

- PNG-24, sRGB color profile.
- No EXIF data.
- Filename suggestion: `screenshot-01-hero.png` ... `screenshot-05-curation.png`.
- Keep each file under 4 MB (the 16 MB cap is generous but smaller uploads
  faster).

---

## 5. Small promotional tile (440 x 280) - **required**

This appears next to your name in store search results and the "More from
this developer" section. It is the **second-most-seen** image after the icon.

### Layout

```
+------------------------------------------+
| [TubeLM icon]   TubeLM                  |
|                 Link Picker             |
|                                          |
|  Pick YouTube videos.                    |
|  Copy clean links.                       |
+------------------------------------------+
```

- Canvas: **440 x 280**, no transparency.
- Background: solid `#121417` (ink) or a subtle vertical gradient
  `#121417 -> #0b1628`.
- Icon: render `icon-128.png` at 88 x 88 on a 16 px rounded background panel,
  positioned top-left at (32, 28). Pair it with the wordmark "TubeLM" weight
  800, 30 px, `#ffffff`, and a subtitle "Link Picker" weight 500, 16 px,
  `#7df8c6`.
- Strapline (bottom-left, weight 700, 22 px, `#ffffff`):
  `Pick YouTube videos. Copy clean links.`
- Subline (under it, weight 500, 13 px, `#9aa5b1`):
  `For NotebookLM and AI research notes.`
- Right side: a small inline product preview (a stylized YouTube tile with a
  green checkmark, ~150 x 100, with the same shadow as in the docs hero
  preview).

### Hard rules

- Do **not** use text larger than 30% of the canvas area.
- Do **not** include URLs or hashtags inside the image.
- Do **not** include browser chrome (no fake Chrome address bars - reviewers
  flag these as misleading).
- Save as PNG-24 (preferred) or JPEG quality 90+. No transparency.

---

## 6. Marquee promotional tile (1400 x 560) - optional

This is what Google uses if they ever feature TubeLM on the homepage
collections ("Editor's picks", "New & Notable"). It is optional but it is the
only way to get featured, so produce one.

### Layout

```
+------------------------------------------------------------------------------+
|                                                                              |
|  [Eyebrow]                                  [Big product mockup -            |
|   CHROME EXTENSION                            YouTube page with checkboxes   |
|                                               + TubeLM popup overlay]        |
|  [Headline]                                                                  |
|   YouTube links                                                              |
|   for NotebookLM.                                                            |
|                                                                              |
|  [Sub]                                                                       |
|   Select videos and Shorts on YouTube,                                       |
|   copy clean URLs in one click.                                              |
|                                                                              |
|  [Brand strip]   TubeLM Link Picker - by Bakhtier Sizhaev                    |
|                                                                              |
+------------------------------------------------------------------------------+
```

- Canvas: **1400 x 560**, no transparency.
- Background: paper `#f4f6f8`, with a soft radial glow `#7df8c6 @ 6% opacity`
  centered at (1100, 280).
- Left column (60% width): copy block.
- Right column (40% width): product mockup with a strong shadow.
- Headline: 80 px, weight 800, ink color, max 2 lines.
- Sub: 22 px, weight 500, color `#39424e`, max 2 lines.
- Brand strip at bottom-left: 14 px, weight 700, ink color.
- Optional: place a faint `★` mark next to "by Bakhtier Sizhaev" as a hint
  toward "open source - star us" - but keep it discreet, no big "Star on
  GitHub" CTA in the tile itself (Google sometimes rejects external CTAs in
  marquee tiles).

---

## 7. Common pitfalls that get listings rejected in 2026

These are the rejection reasons that come up most often in the Chrome Web
Store review forum and the developer documentation:

1. **Screenshot doesn't show the actual extension UI.** Make at least the
   first screenshot a real capture, not a marketing illustration.
2. **Promo tile has text inside the icon.** Don't put the word "TubeLM" on
   top of the icon - the icon must read on its own.
3. **Privacy policy URL returns 404 or shows a generic template.** Use the
   page in this PR (`docs/privacy.html`) and make sure GitHub Pages is on.
4. **Permission justifications missing or generic.** Use the exact
   permission-by-permission justifications from `CWS-LISTING.md`.
5. **Mismatched name between manifest and listing.** Manifest says
   `TubeLM Link Picker`; the dashboard "name" field must match exactly.
6. **Trademark issues.** Do not put a literal YouTube logo in the icon or
   promo tile. A red dot (`#ff0033`) or a generic play triangle is fine - the
   YouTube logo itself is trademarked.
7. **Screenshots show third-party content without consent.** Avoid showing
   identifiable creators' thumbnails. Use generic / educational content or
   blur thumbnails.
8. **Promo tile transparency.** PNG with alpha will be auto-flattened on a
   background you cannot control. Always flatten yourself.

---

## 8. Suggested production order

1. Fix the icon SVG (points 1-5 in section 3).
2. Re-export the 4 PNGs.
3. Capture 5 screenshots from a real YouTube session.
4. Composite each screenshot into the 1280x800 template in Figma.
5. Build the small promo tile (440x280).
6. Build the marquee tile (1400x560).
7. Run all assets through <https://tinypng.com> or `oxipng -o 4` to compress.
8. Upload everything in the Developer Dashboard.

Estimated time if you already have Figma/Affinity templates: **3-4 hours**.

---

## 9. Files in this repo that already help you

- `popup/popup.html` + `popup/popup.css` - the real popup, use as the source
  capture for the screenshots.
- `_locales/<lang>/messages.json` - all UI strings, one file per shipped
  language (see section 10). When you capture a localised screenshot, set
  Chrome's UI language via `chrome://settings/languages` before reloading the
  unpacked extension.
- `docs/index.html` - the marketing landing page already has a stylized
  "popup preview" component (lines 484-519) that you can screenshot directly
  if you want a synthetic mockup for screenshot #1.
- `icons/icon.svg` - the master vector source.
- `docs/privacy.html` - the privacy policy URL for the listing.
- `CWS-LISTING.md` - all texts for the dashboard, including localised short
  descriptions per language (section 9).

---

## 10. Popup UI is fully localised - capture per language

The popup ships translations for ten languages. Status pill, helper text,
button labels, copy hint, thanks line, and credits prefix all come from
`_locales/<lang>/messages.json`. The HTML inline defaults are English so the
extension still renders correctly if Chrome reports an unsupported locale.

| Folder | Language | Notes |
| --- | --- | --- |
| `_locales/en` | English (default) | Source of truth - keys defined with `description` annotations. |
| `_locales/ru` | Русский | Conversational tone, "Скопировать ($count$)" sidesteps Russian plural agreement. |
| `_locales/zh_CN` | 简体中文 | Mixed-script copy ("YouTube", "NotebookLM" stay in Latin). |
| `_locales/hi` | हिन्दी | Devanagari; native review recommended. |
| `_locales/es` | Español (neutral) | No region-specific vocabulary. |
| `_locales/fr` | Français | "Veille" used for "research". |
| `_locales/ar` | العربية | MSA; `dir="rtl"` set automatically by `popup.js`. Native review recommended. |
| `_locales/bn` | বাংলা | Native review recommended. |
| `_locales/pt_BR` | Português (BR) | "vídeo" with accent. |
| `_locales/ur` | اردو | `dir="rtl"` set automatically. Native review recommended. |

### How to capture a localised screenshot

1. `chrome://settings/languages` -> add the target language -> move it to the
   top of the list (Chrome uses the topmost listed language as the UI
   language).
2. Restart Chrome.
3. Reload the unpacked extension at `chrome://extensions`.
4. Open YouTube and the popup - status pill, buttons, helper text should
   render in the chosen language. RTL locales (`ar`, `ur`) should mirror the
   layout horizontally.
5. Capture the popup with whatever tool you prefer
   (DevTools "Capture node screenshot" works well at exactly 336 px wide).

### Best languages to feature in store screenshots

Google's listing accepts up to 5 screenshots per locale. If you only have
time to localise screenshots for a subset, prioritise the languages you
expect the highest install rate from: **en, ru, zh_CN, es, pt_BR**. The
other five share the same layout so the English screenshots are still a
reasonable fallback if you don't ship a per-language set.

> The translations in `hi`, `bn`, `ur`, `ar` were written by the author with
> dictionary support, **not** as a native speaker. Please ask a native
> reviewer before submitting localised store listings in those languages.

---

Made by Bakhtier Sizhaev. When you upload to the store, ping the GitHub repo
- I'll keep the privacy policy and the listing texts in sync as the extension
evolves.
