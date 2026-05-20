# TubeLM - Chrome Web Store Image Asset Guide

This guide is the current source of truth for TubeLM Chrome Web Store visuals.
It covers the required screenshots, promotional/mockup tiles, upload order, and
safe editing rules for Bakhtier Sizhaev's first Chrome Web Store submission.

Public listing:
<https://chromewebstore.google.com/detail/bfbhaomnjgcnijknlhgdldidboijodfa?utm_source=item-share-cb>

All dimensions below match the Chrome Web Store Developer Dashboard image
requirements verified for this project as of 2026-05-17.

---

## 1. Required and recommended assets

| Asset | Required? | Size | Format | Current file |
| --- | --- | --- | --- | --- |
| Store icon | yes | 128 x 128 | PNG | `icons/icon-128.png` |
| Screenshots | at least 1, up to 5 | 1280 x 800 or 640 x 400 | PNG/JPEG | five files in `store-assets/` |
| Small promotional tile | yes | 440 x 280 | PNG/JPEG, no alpha | `store-assets/promo-small-440x280.png` |
| Marquee promotional tile | optional, recommended | 1400 x 560 | PNG/JPEG, no alpha | `store-assets/promo-marquee-1400x560.png` |

Use the full 5-screenshot set. Google recommends up to the maximum allowed five
when they demonstrate real capabilities, and the first screenshot is the main
conversion image in the listing carousel.

---

## 2. Current upload set and purpose of each image

Upload in this order:

1. `store-assets/screenshot-01-hero.png` — **Core promise.** Shows YouTube video cards with TubeLM checkmarks and the popup ready to copy selected links.
2. `store-assets/screenshot-02-batch-select.png` — **Batch workflow.** Shows multiple selected search-result rows and the `Select visible` / copy workflow.
3. `store-assets/screenshot-03-shorts.png` — **Shorts support.** Shows vertical Shorts-style cards with selected states and the side panel workflow.
4. `store-assets/screenshot-04-notebooklm-paste.png` — **Destination handoff.** Shows clean newline YouTube URLs ready to paste into NotebookLM or AI research notes.
5. `store-assets/screenshot-05-local-privacy.png` — **Trust and privacy.** Explains local processing, user-triggered clipboard write, and no remote code.
6. `store-assets/promo-small-440x280.png` — **Required small promo tile.** Brand-led search/category tile.
7. Optional: `store-assets/promo-marquee-1400x560.png` — **Marquee/feature creative.** Larger brand-and-product mockup for potential Chrome Web Store featuring.

The current upload set is intentionally English-only for first submission. It
uses product-faithful image-model compositions corrected with deterministic
TubeLM UI overlays from the real extension icon, popup, side panel, checkbox
states, and copy language. There are no cookie banners, no logged-in account
avatars, no third-party creator thumbnails, and no fake awards or unsupported
claims.

---

## 3. Hard rules from Google and this project

### Required screenshots

- **Square corners, no padding, full bleed.** Fill the whole 1280 x 800 canvas.
- Screenshots must show the actual extension experience or a product-faithful browser capture.
- Show TubeLM doing the thing users install it for: select YouTube videos/Shorts, count selected links, copy clean URLs, paste into research notes.
- Keep the UI airy. One idea per screenshot.
- Use English UI for the first listing unless creating separate locale-specific screenshot sets.
- Avoid cookie consent banners, sign-in prompts, personal avatars, bookmarks bars, and browser clutter.
- Avoid identifiable third-party creator thumbnails unless you have permission. Neutral demo content is safer.
- Do not composite required screenshots into marketing frames, device frames, tilted cards, large headline gutters, or rounded mockup frames.
- Marketing composites belong in promotional tiles, not screenshot slots.

### Promotional/mockup tiles

- Small tile: exactly 440 x 280.
- Marquee tile: exactly 1400 x 560.
- No alpha/transparency. Export flattened RGB PNG or JPEG.
- Keep text minimal and readable at 50% size.
- Do not use YouTube, Google, Chrome, or NotebookLM logos as if TubeLM is official or affiliated.
- No claims like `#1`, `Editor's Choice`, fake user counts, fake ratings, or guaranteed outcomes.

---

## 4. Visual system

TubeLM uses the **Research Graphite + Mint** identity:

| Role | Hex |
| --- | --- |
| Ink / dark surface | `#121417` |
| Paper | `#f4f6f8` |
| Accent green | `#10b981` |
| Mint highlight | `#7df8c6` |
| YouTube-context red cue | `#ff0033` |
| Muted text | `#65717e` |

Typography should feel like modern product UI: Inter / Segoe UI / system-ui,
strong 700-800 weight for short headlines, readable body text, no decorative
font mixing.

Voice: short verbs and concrete workflow language — **Pick**, **Copy**,
**Paste**, **clean links**, **NotebookLM**, **AI research notes**.

---

## 5. Rebuild commands

Regenerate the deterministic fallback/base assets:

```bash
npm run assets:store
```

Regenerate every script-based visual asset pipeline:

```bash
npm run assets
```

The final polished PNGs in `store-assets/` are the curated upload assets for
submission. They may include image-model backgrounds/compositions plus
deterministic TubeLM UI overlays, so do not assume `npm run assets:store`
recreates the final art direction byte-for-byte.

Verify dimensions, PNG modes, CWS ZIP allowlist, privacy/listing invariants:

```bash
npm run verify:cws
```

The upload ZIP is not supposed to include `store-assets/`; CWS visuals are
uploaded separately in the Developer Dashboard.

---

## 6. Local AI creative prompts

The local prompt file is:

```txt
store-assets/CREATIVE-PROMPTS.local.md
```

It contains detailed English prompts for regenerating or art-directing each
screenshot/mockup with an image model. It is intentionally ignored by git and
must not be uploaded to Chrome Web Store.

---

## 7. If you manually edit later

Before final submission, check every edited image:

- required screenshot files are exactly `1280 x 800`;
- small promo tile is exactly `440 x 280`;
- marquee tile is exactly `1400 x 560`;
- all files are PNG or JPEG, RGB/no alpha for promo tiles;
- no cookie consent, no sign-in popups, no browser personal data;
- English copy is legible at 50% size;
- first screenshot immediately communicates: “select multiple YouTube videos and copy clean links.”

If you replace generated images with live browser captures, keep the same story
order and filenames so the verifier and docs remain aligned.
