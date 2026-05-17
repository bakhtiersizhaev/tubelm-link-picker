# Chrome Web Store upload assets

Use these files in the Chrome Web Store Developer Dashboard.

## Recommended upload set

Five required-format screenshots give the store carousel a clear, non-repetitive story without overloading the user. Chrome Web Store allows up to five screenshots, and Google's guidance recommends using the maximum when each image explains a real part of the extension experience.

1. `screenshot-01-hero.png` — **Core promise.** 1280 x 800 PNG. Shows YouTube video cards with TubeLM checkmarks and the popup ready to copy selected links. This should be the first carousel image.
2. `screenshot-02-batch-select.png` — **Batch workflow.** 1280 x 800 PNG. Shows search-result rows, multiple selected sources, and the `Select visible` / copy flow.
3. `screenshot-03-shorts.png` — **Shorts support.** 1280 x 800 PNG. Shows vertical Shorts cards with selected states and the side panel workflow.
4. `screenshot-04-notebooklm-paste.png` — **Destination handoff.** 1280 x 800 PNG. Shows selected YouTube URLs as clean newline sources ready for NotebookLM or AI research notes.
5. `screenshot-05-local-privacy.png` — **Trust and privacy.** 1280 x 800 PNG. Explains the local-only privacy model: website content is processed locally, clipboard is user-triggered, no remote code.
6. `promo-small-440x280.png` — **Required small promotional tile.** 440 x 280 PNG. Brand-led tile for search/category surfaces.
7. `promo-marquee-1400x560.png` — **Optional marquee promotional tile.** 1400 x 560 PNG. Use if the dashboard asks for marquee/feature artwork.

## Production notes

- All current images are English-language, square-corner, no-padding/full-bleed where required, RGB PNGs with no alpha channel.
- The screenshot set uses neutral demo YouTube-style content rather than third-party creator thumbnails, so there are no cookie consent artifacts, account avatars, or copyrighted creator imagery.
- The screenshots are product-faithful hybrid creative exports: image-model composition/background work corrected with deterministic TubeLM UI overlays from the real extension icon, popup, side panel, checkbox states, and copy language.
- `npm run assets:store` can rebuild deterministic fallback/base assets, but the curated PNG files in this folder are the source of truth for Chrome Web Store submission.
- If you later replace them with live browser captures, keep the same story order, filenames, and exact dimensions.
- Do not upload `CREATIVE-PROMPTS.local.md`; it is a local prompt/reference file for image-model editing and is intentionally ignored by git.

## Upload order

1. `screenshot-01-hero.png`
2. `screenshot-02-batch-select.png`
3. `screenshot-03-shorts.png`
4. `screenshot-04-notebooklm-paste.png`
5. `screenshot-05-local-privacy.png`
6. `promo-small-440x280.png`
7. Optional: `promo-marquee-1400x560.png`
