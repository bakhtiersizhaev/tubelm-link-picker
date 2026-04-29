<p align="center">
  <img src="docs/assets/tubelm-github-banner.svg" alt="TubeLM Link Picker - batch copy YouTube URLs for NotebookLM" width="100%">
</p>

<h1 align="center">TubeLM Link Picker</h1>

<p align="center">
  <strong>Batch-select YouTube videos and Shorts, copy clean URLs, and paste them into NotebookLM or any AI research notebook.</strong>
</p>

<p align="center">
  <a href="https://bakhtiersizhaev.github.io/urltube/">GitHub Pages</a>
  |
  <a href="https://notebooklm.google.com/">NotebookLM</a>
  |
  <a href="#install">Install</a>
  |
  <a href="#privacy">Privacy</a>
</p>

## What It Is

TubeLM Link Picker is a lightweight Chrome extension for collecting YouTube links in bulk.

Open a YouTube channel, playlist, search results page, feed, or Shorts grid. TubeLM adds clean checkboxes to video thumbnails, lets you select the videos you need, and copies a newline-separated list of canonical YouTube URLs to your clipboard.

The main workflow is simple: pick videos on YouTube, copy the links, then paste them into NotebookLM as sources.

## Why It Exists

NotebookLM can work with YouTube sources, but collecting many video URLs by hand is slow. TubeLM removes the repetitive part: no opening each video, no copying one URL at a time, no cleaning tracking parameters before import.

## Features

- Select multiple YouTube videos and Shorts directly on the page.
- Copy clean `youtube.com/watch?v=...` and `youtube.com/shorts/...` URLs.
- Use **Select visible** to grab all loaded videos in the current view.
- Works on channel pages, playlists, search results, home feeds, related videos, and Shorts surfaces.
- Keeps everything local in your browser. No backend, no account, no analytics.
- Designed for NotebookLM, LLM notes, research workflows, study plans, content curation, and knowledge bases.

## Install

1. Download or clone this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select this project folder.
6. Open YouTube and pin **TubeLM** if you want faster access.

## Usage

1. Open a YouTube page with videos.
2. Use the checkboxes on video thumbnails to select the videos you need.
3. Open the extension popup.
4. Click **Copy URLs**.
5. Paste the newline-separated list into NotebookLM, notes, docs, or another AI workflow.

## Naming

The original working name was **URLTube**. The product name is now **TubeLM Link Picker**:

- **TubeLM** is short, memorable, and distinct enough to brand.
- **Link Picker** says what the extension actually does.
- The README, manifest, page title, and descriptions still include the important search phrases: YouTube links, NotebookLM, Chrome extension, batch copy, Shorts, playlists, channels, and research workflow.

## SEO Positioning

Primary phrase:

`YouTube link picker for NotebookLM`

Secondary phrases:

- batch copy YouTube URLs
- YouTube links for NotebookLM
- NotebookLM YouTube source helper
- Chrome extension for YouTube research
- copy YouTube Shorts links
- collect YouTube video links
- AI research notes from YouTube

Suggested GitHub topics:

`notebooklm`, `youtube`, `chrome-extension`, `browser-extension`, `youtube-links`, `shorts`, `research-tool`, `ai-notes`, `llm-tools`, `knowledge-base`, `clipboard`, `productivity`

## Privacy

TubeLM runs locally in your browser. It does not send YouTube links, page data, selections, or clipboard contents to any server. Clipboard access is used only when you click the copy button.

## Roadmap

- Optional auto-scroll collection mode for long channel and playlist pages.
- Export selected links as Markdown, CSV, or plain text.
- Saved selection sets per tab.
- Chrome Web Store listing assets and screenshots.
- Localization files for the extension popup.

## Other Languages

### Русский

TubeLM Link Picker - это расширение Chrome, которое помогает быстро выбрать несколько роликов или Shorts на YouTube, скопировать чистые ссылки и вставить их в NotebookLM. Оно полезно для исследований, конспектов, баз знаний, обучения и работы с LLM.

### 中文

TubeLM Link Picker 是一个轻量级 Chrome 扩展，可在 YouTube 页面上批量选择视频或 Shorts，并复制干净的 URL 列表，方便导入 NotebookLM、AI 笔记和研究工作流。

### Español

TubeLM Link Picker es una extensión ligera de Chrome para seleccionar varios videos o Shorts de YouTube, copiar URLs limpias y pegarlas en NotebookLM, notas de IA o flujos de investigación.

## Disclaimer

TubeLM Link Picker is an independent open-source project. It is not affiliated with Google, YouTube, or NotebookLM.
