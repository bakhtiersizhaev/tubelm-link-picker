# Chrome Web Store Photoshop template kit

These PNG files are editable visual templates for Photoshop. They are separate from the already verified upload assets in `store-assets/`.

Public listing:
<https://chromewebstore.google.com/detail/bfbhaomnjgcnijknlhgdldidboijodfa?utm_source=item-share-cb>

Official Chrome Web Store image requirements checked on 2026-05-17 from Chrome for Developers:

- Store icon: `128 x 128` px, required.
- Screenshots: at least `1`, up to `5`, `1280 x 800` px or `640 x 400` px, PNG/JPEG, square corners, no padding, full bleed.
- Small promotional tile: `440 x 280` px, required, PNG/JPEG, no transparency.
- Marquee promotional tile: `1400 x 560` px, optional, PNG/JPEG, no transparency.
- Promo video: optional YouTube video URL. The dashboard does not upload a video-thumbnail PNG directly.

## Upload order and files

| Order | File | Size | Dashboard slot | Required? | Photoshop action |
| --- | --- | --- | --- | --- | --- |
| 00 | `00-store-icon-current-128x128.png` | 128 x 128 | Store icon | Required | Use as preview/reference. The real icon is already inside the extension ZIP. |
| 01 | `01-screenshot-hero-template-1280x800.png` | 1280 x 800 | Screenshot 1 | Required/recommended | Replace the mock YouTube area with a real YouTube screenshot showing TubeLM checkboxes and popup. Remove guide/footer text before final export. |
| 02 | `02-screenshot-batch-select-template-1280x800.png` | 1280 x 800 | Screenshot 2 | Optional but recommended | Use for the batch-selection story or replace with a real search-results/browser screenshot. Remove guide/footer text before final export. |
| 03 | `03-screenshot-shorts-template-1280x800.png` | 1280 x 800 | Screenshot 3 | Optional but recommended | Use for the Shorts-support story or replace with a real Shorts/browser screenshot. Remove guide/footer text before final export. |
| 04 | `04-screenshot-notebooklm-paste-template-1280x800.png` | 1280 x 800 | Screenshot 4 | Optional | Replace with a real browser capture showing copied links pasted into NotebookLM or another notes tool. Remove guide/footer text before final export. |
| 05 | `05-screenshot-privacy-local-template-1280x800.png` | 1280 x 800 | Screenshot 5 | Optional | Use only if it remains a real product/browser capture. Avoid pure marketing infographic as the only screenshot. |
| 06 | `06-small-promo-tile-440x280.png` | 440 x 280 | Small promo tile | Required | Can be uploaded after text/brand polish. Keep it simple and readable at small size. |
| 07 | `07-marquee-promo-tile-1400x560.png` | 1400 x 560 | Marquee promo tile | Optional | Recommended if you want the listing to look more complete and feature-ready. |
| 08 | `08-optional-video-thumbnail-1280x720.png` | 1280 x 720 | Promo video thumbnail reference | Optional | Use as a thumbnail if you create a YouTube demo video. CWS expects the video URL, not this PNG. |
| 00 | `00-cws-asset-map-1600x1200.png` | 1600 x 1200 | Internal guide | No | Open this first to see the asset map and upload order. Do not upload to CWS. |

## Important screenshot rule

Do not upload the screenshot templates as-is. Chrome expects screenshots to show the actual extension experience. Final screenshot exports should be real full-bleed browser/product captures with square corners and no padding.

Good final screenshot examples:

- YouTube search results with TubeLM checkboxes visible and selected.
- TubeLM popup open with selected count and Copy selection button.
- Side panel open while YouTube video cards are visible.
- NotebookLM add-sources dialog with copied YouTube URLs pasted, if you can capture it cleanly.

Avoid:

- marketing frames around screenshots;
- fake browser chrome as the only screenshot;
- huge text banners in required screenshot slots;
- claims like `#1`, `Editor's Choice`, `official`, `fastest`, or fake ratings;
- YouTube/Google/NotebookLM logos used as if TubeLM is affiliated with them.

## Recommended Photoshop workflow

1. Open `00-cws-asset-map-1600x1200.png` to understand the full set.
2. Open each template PNG you want to use.
3. Place your real screenshot as a new layer.
4. Match the screenshot to the canvas size. For CWS screenshot slots, final export should fill the full 1280 x 800 canvas.
5. Remove any guide badges, footer notes, and placeholder text before export.
6. Export as PNG, sRGB, no transparency for screenshots and promo tiles.
7. Keep final screenshots under 16 MB each.
8. Upload final edited files, not the internal asset map.

## Existing verified assets

The current upload-ready asset set is in `store-assets/`:

- `store-assets/screenshot-01-hero.png`
- `store-assets/screenshot-02-batch-select.png`
- `store-assets/screenshot-03-shorts.png`
- `store-assets/screenshot-04-notebooklm-paste.png`
- `store-assets/screenshot-05-local-privacy.png`
- `store-assets/promo-small-440x280.png`
- `store-assets/promo-marquee-1400x560.png`

Use the templates in this folder only if you want to create alternative custom artwork before submitting.
