# Chrome Web Store - Listing texts

Copy/paste-ready texts for the Chrome Web Store Developer Dashboard at
<https://chrome.google.com/webstore/devconsole>.

These texts match the current manifest (`version 1.0.2`, MV3) and the privacy
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
| Repository description | `Copy multiple YouTube links into NotebookLM and AI research notes.` |
| Repository topics | `notebooklm`, `youtube`, `chrome-extension`, `browser-extension`, `youtube-links`, `youtube-shorts`, `clean-urls`, `batch-copy`, `research-tool`, `ai-notes`, `llm-tools`, `clipboard`, `productivity` |

## 2. Single purpose statement

> TubeLM Link Picker has a single purpose: it lets you select multiple YouTube
> videos and Shorts inside `youtube.com` and copy their clean URLs to the
> clipboard in one click, so you can paste them into NotebookLM or other AI
> research tools.

## 3. Short description (132 chars max)

> Copy multiple YouTube links at once. Select videos or Shorts, then paste clean URLs into NotebookLM or AI notes.

Character count: 112.

## 4. Detailed description (up to 16,000 chars)

> **TubeLM Link Picker** is a small Chrome extension for people who collect
> YouTube videos as sources for NotebookLM, AI research notes, study projects,
> content planning, or client research. It is useful for YouTube to NotebookLM
> workflows where you need a clean list of video URLs instead of copying links
> one by one. If you have ever opened a YouTube search page, channel, playlist,
> or Shorts grid and thought, "I need to copy several video links, not one by
> one," TubeLM is built for that workflow.
>
> Instead of copying YouTube URLs manually, cleaning tracking parameters, and
> pasting links into NotebookLM or another notes tool one at a time, you can
> select the videos directly on YouTube and copy a clean newline-separated list
> to your clipboard.
>
> **When TubeLM helps**
>
> - You need to copy multiple YouTube links at once from search results, a
>   channel, or a playlist.
> - You are building a source list for NotebookLM, AI summaries, research notes,
>   study material, or a content brief.
> - You want to collect YouTube Shorts links together with regular video links.
> - You need clean YouTube URLs without extra tracking parameters like `&pp=`,
>   `&list=`, or `&t=`.
> - You want a simple way to bulk copy YouTube video links without leaving the
>   browser or using an external web service.
>
> **How it works**
>
> Open YouTube and browse as usual. TubeLM adds a small checkbox to video cards
> on supported YouTube pages. Tick the videos or Shorts you want, open the popup
> or side panel, and press **Copy selection**. The extension copies only the
> selected links, formatted as one URL per line, ready to paste into NotebookLM,
> ChatGPT, Claude, Gemini, Obsidian, Notion, a research document, or any tool
> that accepts a list of links.
>
> **What it does not do**
>
> TubeLM does not download videos, create transcripts, read comments, read your
> YouTube account, or send selected links to a server. It is only a local link
> picker and clean URL copier for YouTube pages.
>
> **Privacy**
>
> Everything happens locally in your browser. TubeLM processes the visible
> YouTube page only to find video cards and copy the URLs you explicitly select.
> It does not transmit page content, browsing data, selected links, analytics,
> or personal information to the developer. There is no account, no backend, no
> telemetry, and no remote code.
>
> **Source availability**
>
> Source code is publicly available for personal evaluation, security review,
> compatibility review, and educational reading:
> <https://github.com/bakhtiersizhaev/tubelm-link-picker>
>
> Made by Bakhtier Sizhaev. Thanks for using TubeLM - if it saves you time,
> please star the repository on GitHub. TubeLM Link Picker is proprietary
> software. Copying, redistribution, modification, rebranding, resale,
> extension-store submission, or derivative products require prior written
> permission from Bakhtier Sizhaev.
>
> _TubeLM Link Picker is an independent project and is not
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
| `en` | Copy multiple YouTube links at once. Select videos or Shorts, then paste clean URLs into NotebookLM or AI notes. |
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

> See `CWS-MOCKUP-GUIDE.md` for the image assets. The recommended
> upload set is already prepared in `store-assets/`:
> `screenshot-01-hero.png`, `screenshot-02-batch-select.png`,
> `screenshot-03-shorts.png`, `screenshot-04-notebooklm-paste.png`,
> `screenshot-05-local-privacy.png`, `promo-small-440x280.png`, and optional
> `promo-marquee-1400x560.png`.
>
> Current verified upload package: `build/tubelm-link-picker-cws-v1.0.2.zip`
> with SHA-256 `056ef7ecb8c6cc205f22a0d7ad1047de23a234e43d3788ef52095d5b2e801406`.
