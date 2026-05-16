# Chrome Web Store - Listing texts

Copy/paste-ready texts for the Chrome Web Store Developer Dashboard at
<https://chrome.google.com/webstore/devconsole>.

These texts match the current manifest (`version 1.0.1`, MV3) and the privacy
policy at <https://bakhtiersizhaev.github.io/tubelm-link-picker/privacy.html>.

---

## 1. Store listing - basic info

| Field | Value |
| --- | --- |
| Name | `TubeLM Link Picker` (sourced from `_locales/en/messages.json -> appFullName`) |
| Short name (in-Chrome) | `TubeLM` (sourced from `_locales/en/messages.json -> appShortName`) |
| Category | `Productivity` (primary) - secondary: `Workflow & Planning Tools` if available |
| Default language | English (United States) |
| Translated UI | The popup ships translations for: English (en, default), Russian (ru), Simplified Chinese (zh_CN), Hindi (hi), Spanish (es), French (fr), Arabic (ar, RTL), Bengali (bn), Brazilian Portuguese (pt_BR), Urdu (ur, RTL). Chrome auto-picks the matching `_locales/<lang>/messages.json` based on the user's browser language. |
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
> TubeLM processes the current YouTube page locally so it can find video cards
> and copy only the URLs you explicitly select. It does not transmit data to the
> developer, does not use a backend, does not run analytics, and does not sell
> or share data. Permissions are limited to YouTube pages, the active tab, local
> script/CSS execution, optional Chrome side panel display, and writing to your
> clipboard. Full policy:
> <https://bakhtiersizhaev.github.io/tubelm-link-picker/privacy.html>.
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
| `activeTab` | Read/check the currently active tab so the popup and side panel can confirm the user is on YouTube and communicate with the local picker UI. |
| `scripting` | Support fallback injection of the local content script/CSS if a YouTube tab was opened before the extension was ready. The main content script is declared in the manifest and runs only on matching YouTube pages. |
| `clipboardWrite` | Write the user-selected list of YouTube URLs into the clipboard when the user presses "Copy selection". |
| `sidePanel` | Open the same local TubeLM controls in Chrome's side panel so users can keep the picker visible while selecting YouTube videos. |
| `host_permissions: https://*.youtube.com/*` | The extension only works on YouTube. Host permission is restricted to the YouTube domain so the script never runs anywhere else. |

> **Remote code use:** `No, I am not using remote code.`
>
> **Data usage disclosures:** answer the dashboard conservatively and keep it
> consistent with the privacy policy:
>
> - Personally identifiable information: No
> - Health information: No
> - Financial and payment information: No
> - Authentication information: No
> - Personal communications: No
> - Location: No
> - Web history: No
> - User activity: No
> - Website content: Yes — processed locally on YouTube pages only, never
>   transmitted, stored on a server, sold, or shared. This is the visible
>   YouTube page content needed to identify video cards and copy only the URLs
>   selected by the user.
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
5. Upload the signed `.zip` built from the explicit allowlist in section 8.
   Do not zip the whole repo root; local worktrees can contain `.gsd/`,
   `.bg-shell/`, build artifacts, editor files, and other non-extension files.

> Tip: zip the extension from a clean checkout to avoid shipping editor swap
> files or `.DS_Store`.

## 8. What to upload as the package

Include in the `.zip` exactly:

- `manifest.json`
- `_locales/` (required by `default_locale` and `__MSG_*` manifest strings)
- `popup/` (popup.html, popup.css, popup.js)
- `content/` (content.js, styles.css)
- `sidepanel/` (required by `side_panel.default_path`)
- `icons/icon-16.png`, `icon-32.png`, `icon-48.png`, `icon-128.png`

Do **not** zip the repository root. Build the package from this explicit
allowlist so local agent files, docs, source-only assets, and generated
artifacts cannot slip into the upload.

Exclude from the `.zip`:

- `docs/` (this is the website, not part of the extension)
- `README.md`, `LICENSE`, `CWS-*.md`
- `.git/`, `.gitignore`, `.github/`
- `icons/icon.svg` (optional - the source SVG is not used by Chrome at runtime;
  keep it out to reduce the upload size, but it is harmless if shipped)

## 9. Localised store-listing copy (optional, paste per language in dashboard)

The popup ships localised UI for ten languages out of the box (see section 1).
The Chrome Web Store also lets you localise the store listing itself — short
description and detailed description — independently from `_locales/`. Below are
ready-to-paste short descriptions matching the in-popup tagline for each
shipped language. You can paste these in the dashboard's "Add language" dialog.

Each one is under 132 characters.

| Lang | Short description |
| --- | --- |
| `en` | Pick YouTube videos and Shorts with checkboxes, then copy clean URLs in one click. Built for NotebookLM and AI research notes. |
| `ru` | Отмечайте видео и Shorts на YouTube галочками и копируйте чистые ссылки одной кнопкой — для NotebookLM и ИИ-заметок. |
| `zh_CN` | 在 YouTube 上勾选视频和 Shorts,一键复制干净链接,送入 NotebookLM、AI 笔记与研究流程。 |
| `hi` | YouTube वीडियो और Shorts चुनें, साफ़ लिंक एक क्लिक में कॉपी करें — NotebookLM, AI नोट्स और रिसर्च के लिए। |
| `es` | Marca videos y Shorts de YouTube con casillas y copia enlaces limpios en un clic. Para NotebookLM y notas con IA. |
| `fr` | Cochez vidéos et Shorts YouTube, puis copiez des liens propres en un clic. Pour NotebookLM et la veille avec l'IA. |
| `ar` | اختر مقاطع YouTube وShorts بمربعات الاختيار، وانسخ روابطها النظيفة بنقرة واحدة — لـ NotebookLM وملاحظات الذكاء الاصطناعي. |
| `bn` | চেকবক্স দিয়ে YouTube ভিডিও আর Shorts বেছে নিন, এক ক্লিকে পরিষ্কার লিংক কপি করুন — NotebookLM আর AI গবেষণার জন্য। |
| `pt_BR` | Marque vídeos e Shorts do YouTube e copie links limpos em um clique. Feito para o NotebookLM e notas com IA. |
| `ur` | چیک باکسز سے YouTube ویڈیوز اور Shorts منتخب کریں اور ایک کلک میں صاف لنکس کاپی کریں — NotebookLM اور AI نوٹس کے لیے۔ |

> The in-popup UI (status pills, buttons, helper text) is fully translated for
> every language above via `_locales/<lang>/messages.json` and uses
> `chrome.i18n.getMessage()` at runtime. Arabic and Urdu set `dir="rtl"`
> automatically.
>
> Native-speaker review recommended before publishing for `hi`, `bn`, `ur`,
> `ar` — these are not the author's native languages and reviewers may want
> register adjustments.

---

> See `CWS-MOCKUP-GUIDE.md` for the image assets. The mandatory
> upload set is already prepared in `store-assets/`:
> `screenshot-01-hero.png`, `screenshot-02-search-results.png`, and
> `promo-small-440x280.png`.
