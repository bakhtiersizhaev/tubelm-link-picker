# Chrome Web Store - Listing texts

Copy/paste-ready texts for the Chrome Web Store Developer Dashboard at
<https://chrome.google.com/webstore/devconsole>.

These texts match the current manifest (`version 1.0.0`, MV3) and the privacy
policy at <https://bakhtiersizhaev.github.io/tubelm-link-picker/privacy.html>.

---

## 1. Store listing - basic info

| Field | Value |
| --- | --- |
| Name | `TubeLM Link Picker` |
| Short name (in-Chrome) | `TubeLM` |
| Category | `Productivity` (primary) - secondary: `Workflow & Planning Tools` if available |
| Language | English (United States) - primary. Add Russian, Chinese, Spanish later via `_locales/`. |
| Visibility | Public |
| Distribution | All regions |

## 2. Single purpose statement

> TubeLM Link Picker has a single purpose: it lets you select multiple YouTube
> videos and Shorts inside `youtube.com` and copy their clean URLs to the
> clipboard in one click, so you can paste them into NotebookLM or other AI
> research tools.

## 3. Short description (132 chars max)

> Pick YouTube videos and Shorts with checkboxes, then copy clean URLs in one
> click. Built for NotebookLM and AI research notes.

Character count: 131.

## 4. Detailed description (up to 16,000 chars)

> **TubeLM Link Picker** turns YouTube into a multi-select source for your AI
> research notebooks. Open any YouTube page - a channel, a playlist, search
> results, or the Shorts grid - and a small checkbox appears on every video
> card. Tick the videos you want, click **Copy**, and the extension drops a
> clean newline-separated list of canonical `https://www.youtube.com/watch?v=...`
> URLs (or `https://www.youtube.com/shorts/...` for Shorts) straight into your
> clipboard. Paste them into NotebookLM, ChatGPT, Claude, Gemini, Obsidian, or
> any other tool that accepts a list of sources.
>
> **Why it exists**
>
> NotebookLM lets you turn YouTube videos into chat-ready research notebooks,
> but you can only add sources one at a time. TubeLM removes that friction: you
> curate the list visually on YouTube, then bulk-paste into NotebookLM in a few
> seconds.
>
> **Features**
>
> - Works on channel pages, playlists, search results, and the Shorts grid.
> - Adds a non-intrusive checkbox to each video tile - no overlay covering the
>   thumbnail.
> - "Select visible" and "Clear" buttons in the popup for fast curation.
> - Live selection counter shows how many videos are currently picked.
> - Outputs canonical, tracking-free URLs (no `&pp=`, no `&list=`, no `&t=`).
> - Handles Shorts as `youtube.com/shorts/<id>` so NotebookLM accepts them.
> - 100% local: nothing is uploaded, no analytics, no account, no login.
> - Free and open source under the MIT license.
>
> **How to use**
>
> 1. Install TubeLM and pin it next to your address bar.
> 2. Go to any YouTube channel, playlist, search results page, or
>    `youtube.com/shorts`.
> 3. Tick the checkboxes on the videos you want.
> 4. Click the TubeLM icon and press **Copy selection**.
> 5. Paste into NotebookLM, your notes app, or any chat with an AI model.
>
> **Privacy**
>
> TubeLM does not collect, store, or transmit any data. It runs entirely in
> your browser, only on `youtube.com`. Permissions are limited to the active
> YouTube tab, script injection inside that tab, and writing to your clipboard.
> Full policy: <https://bakhtiersizhaev.github.io/tubelm-link-picker/privacy.html>.
>
> **Open source**
>
> Source code, issues, and discussions:
> <https://github.com/bakhtiersizhaev/tubelm-link-picker>
>
> **Companion project**
>
> If you also import Telegram chats into NotebookLM, try
> [TeleLore](https://telelore.vercel.app/) - a free web app by the same author
> that turns Telegram Desktop `result.json` exports into clean Markdown chunks
> ready for NotebookLM.
>
> Made by Bakhtier Sizhaev. Thanks for using TubeLM - if it saves you time,
> please star the repository on GitHub.
>
> _TubeLM Link Picker is an independent open-source project and is not
> affiliated with, endorsed by, or sponsored by YouTube, Google, or NotebookLM._

## 5. Permission justifications (Developer Dashboard)

Chrome Web Store now requires a one-line justification for every requested
permission. Paste these into the "Privacy practices" tab.

| Permission | Justification |
| --- | --- |
| `activeTab` | Read the URL of the YouTube tab the user is on and inject the picker UI into that tab only when the user clicks the extension. |
| `scripting` | Inject the content script that draws checkboxes on YouTube video tiles and reads video IDs from the page DOM. |
| `clipboardWrite` | Write the user-selected list of YouTube URLs into the clipboard when the user presses "Copy selection". |
| `host_permissions: https://*.youtube.com/*` | The extension only works on YouTube. Host permission is restricted to the YouTube domain so the script never runs anywhere else. |

> **Remote code use:** `No, I am not using remote code.`
>
> **Data usage disclosures:** select *none* for every category (Personally
> identifiable information, Health information, Financial and payment
> information, Authentication information, Personal communications, Location,
> Web history, User activity, Website content).
>
> Then tick all three certification checkboxes:
> - I do not sell or transfer user data to third parties, except in approved use cases.
> - I do not use or transfer user data for purposes unrelated to my item's single purpose.
> - I do not use or transfer user data to determine creditworthiness or for lending purposes.

## 6. URLs to enter in the dashboard

| Field | Value |
| --- | --- |
| Homepage URL | `https://github.com/bakhtiersizhaev/tubelm-link-picker` |
| Support URL | `https://github.com/bakhtiersizhaev/tubelm-link-picker/issues` |
| Privacy Policy URL | `https://bakhtiersizhaev.github.io/tubelm-link-picker/privacy.html` |

> Make sure GitHub Pages is enabled in repo settings (Settings -> Pages ->
> "Deploy from branch" -> `main` / `/docs`) so that `privacy.html` is publicly
> reachable. The CWS reviewer must be able to open the URL anonymously.

## 7. Account setup checklist (Developer Dashboard)

1. Pay the one-time US $5 developer registration fee.
2. Complete identity verification (Google requires a government ID for new
   developers in 2024+).
3. Verify the contact email - this becomes visible to users in the listing.
4. Enable two-factor authentication on the Google account.
5. Upload the signed `.zip` from `tubelm-link-picker/` (everything in the repo
   root except `docs/`, `LICENSE`, `README.md`, `CWS-*.md`, and `.git*`).

> Tip: zip the extension from a clean checkout to avoid shipping editor swap
> files or `.DS_Store`.

## 8. What to upload as the package

Include in the `.zip`:

- `manifest.json`
- `popup/` (popup.html, popup.css, popup.js)
- `content/` (content.js, styles.css)
- `icons/icon-16.png`, `icon-32.png`, `icon-48.png`, `icon-128.png`

Exclude from the `.zip`:

- `docs/` (this is the website, not part of the extension)
- `README.md`, `LICENSE`, `CWS-*.md`
- `.git/`, `.gitignore`, `.github/`
- `icons/icon.svg` (optional - the source SVG is not used by Chrome at runtime;
  keep it out to reduce the upload size, but it is harmless if shipped)

## 9. Russian translation (для дашборда, если включите ru локаль)

**Краткое описание (132):**

> Выберите видео и Shorts на YouTube галочками и скопируйте чистые ссылки одной
> кнопкой - готовые для NotebookLM и ИИ-заметок.

**Подробное описание (фрагмент):**

> **TubeLM Link Picker** превращает YouTube в источник для ваших ИИ-заметок.
> Откройте канал, плейлист, поиск или сетку Shorts - на каждом видео появится
> чекбокс. Отметьте нужные, нажмите **Copy**, и расширение положит в буфер
> обмена чистые ссылки `https://www.youtube.com/watch?v=...` через перенос
> строки. Вставьте их в NotebookLM, ChatGPT, Claude, Gemini, Obsidian или любой
> другой инструмент, который принимает список источников.
>
> **Приватность:** ничего не отправляется на сервер, нет аналитики, нет
> аккаунта. Расширение работает только на `youtube.com`. Полная политика:
> <https://bakhtiersizhaev.github.io/tubelm-link-picker/privacy.html>.
>
> Сделано Bakhtier Sizhaev. Спасибо, что используете TubeLM - если он экономит
> вам время, поставьте звезду на GitHub.

---

> See `CWS-MOCKUP-GUIDE.md` for the image assets you still need to produce
> (screenshots, promo tiles, optional marquee).
