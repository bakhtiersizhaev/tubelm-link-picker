#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require('sharp');
} catch {
  sharp = require('D:/Development/Cache/npm_global/node_modules/gsd-pi/node_modules/sharp');
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iconsDir = path.join(root, 'icons');
const docsAssetsDir = path.join(root, 'docs', 'assets');

const COLORS = Object.freeze({
  ink: '#121417',
  deep: '#0B1223',
  navy: '#10243A',
  graphite: '#1F2937',
  paper: '#F4F6F8',
  white: '#F8FAFC',
  muted: '#65717E',
  mint: '#7DF8C6',
  green: '#10B981',
  greenDark: '#064E3B',
  youtube: '#FF0033',
});

function iconSvg({ small = false } = {}) {
  const stroke = small ? 44 : 28;
  const cardX = small ? 116 : 104;
  const cardY = small ? 166 : 150;
  const cardW = small ? 280 : 304;
  const cardH = small ? 214 : 222;
  const cardRx = small ? 72 : 64;
  const checkbox = small ? { x: 306, y: 296, s: 78, r: 22 } : { x: 320, y: 306, s: 72, r: 20 };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-label="TubeLM Link Picker">
  <defs>
    <linearGradient id="bg" x1="72" y1="36" x2="448" y2="476" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${COLORS.deep}"/>
      <stop offset="0.58" stop-color="${COLORS.navy}"/>
      <stop offset="1" stop-color="#07111E"/>
    </linearGradient>
    <radialGradient id="glow" cx="148" cy="122" r="330" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${COLORS.mint}" stop-opacity="0.38"/>
      <stop offset="0.46" stop-color="${COLORS.green}" stop-opacity="0.12"/>
      <stop offset="1" stop-color="${COLORS.green}" stop-opacity="0"/>
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#020617" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect x="32" y="32" width="448" height="448" rx="112" fill="url(#bg)"/>
  <rect x="32" y="32" width="448" height="448" rx="112" fill="url(#glow)"/>
  <rect x="46" y="46" width="420" height="420" rx="100" fill="none" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="2"/>

  <g filter="url(#softShadow)">
    <rect x="144" y="118" width="252" height="184" rx="58" fill="none" stroke="${COLORS.mint}" stroke-opacity="0.42" stroke-width="${stroke}"/>
    <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${cardRx}" fill="${COLORS.white}"/>
    <rect x="${cardX + 34}" y="${cardY + 36}" width="${cardW - 68}" height="${Math.round(cardH * 0.47)}" rx="34" fill="${COLORS.graphite}"/>
    <path d="M${cardX + cardW * 0.47} ${cardY + 72} L${cardX + cardW * 0.47} ${cardY + 122} L${cardX + cardW * 0.66} ${cardY + 97} Z" fill="${COLORS.white}" opacity="0.96"/>
    <rect x="${cardX + 36}" y="${cardY + cardH - 58}" width="${cardW * 0.46}" height="14" rx="7" fill="#CBD5E1"/>
    <rect x="${cardX + 36}" y="${cardY + cardH - 34}" width="${cardW * 0.34}" height="10" rx="5" fill="#E2E8F0"/>
  </g>

  <g>
    <rect x="${checkbox.x}" y="${checkbox.y}" width="${checkbox.s}" height="${checkbox.s}" rx="${checkbox.r}" fill="${COLORS.mint}"/>
    <rect x="${checkbox.x}" y="${checkbox.y}" width="${checkbox.s}" height="${checkbox.s}" rx="${checkbox.r}" fill="none" stroke="#06121F" stroke-opacity="0.28" stroke-width="4"/>
    <path d="M${checkbox.x + 18} ${checkbox.y + 40} L${checkbox.x + 32} ${checkbox.y + 54} L${checkbox.x + 58} ${checkbox.y + 24}" fill="none" stroke="#06121F" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <g opacity="0.96">
    <path d="M160 372 C190 404 244 404 274 372" fill="none" stroke="${COLORS.mint}" stroke-width="18" stroke-linecap="round"/>
    <path d="M238 372 C268 340 322 340 352 372" fill="none" stroke="${COLORS.mint}" stroke-width="18" stroke-linecap="round"/>
  </g>
  <circle cx="398" cy="132" r="18" fill="${COLORS.youtube}"/>
</svg>`;
}

function bannerSvg() {
  const embeddedIcon = Buffer.from(iconSvg()).toString('base64');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">TubeLM Link Picker</title>
  <desc id="desc">Copy multiple YouTube links into NotebookLM and AI research notes.</desc>
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F8FAFC"/>
      <stop offset="1" stop-color="#E7F3EF"/>
    </linearGradient>
    <linearGradient id="deep" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B1223"/>
      <stop offset="1" stop-color="#10243A"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="#1E2732" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#paper)"/>
  <g opacity="0.55" stroke="#121417" stroke-opacity="0.07">
    <path d="M0 540H1200"/><path d="M0 438H1200"/><path d="M0 336H1200"/><path d="M0 234H1200"/><path d="M0 132H1200"/>
    <path d="M156 0V630"/><path d="M396 0V630"/><path d="M636 0V630"/><path d="M876 0V630"/><path d="M1116 0V630"/>
  </g>
  <image href="data:image/svg+xml;base64,${embeddedIcon}" x="82" y="70" width="86" height="86"/>
  <g transform="translate(84 188)">
    <text font-family="Inter, Segoe UI, Arial, sans-serif" font-size="25" font-weight="800" letter-spacing="2" fill="${COLORS.greenDark}">CHROME EXTENSION FOR NOTEBOOKLM</text>
    <text y="88" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="76" font-weight="850" fill="${COLORS.ink}">TubeLM</text>
    <text y="168" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="76" font-weight="850" fill="${COLORS.ink}">Link Picker</text>
    <text y="236" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="30" font-weight="500" fill="#46515F">Copy multiple YouTube links at once</text>
    <text y="278" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="30" font-weight="500" fill="#46515F">for NotebookLM and AI research notes.</text>
  </g>
  <g transform="translate(708 94)" filter="url(#shadow)">
    <rect width="420" height="430" rx="28" fill="#FFFFFF" stroke="#121417" stroke-opacity="0.12"/>
    <rect width="420" height="68" rx="28" fill="url(#deep)"/>
    <rect y="42" width="420" height="26" fill="url(#deep)"/>
    <circle cx="30" cy="32" r="7" fill="${COLORS.youtube}"/>
    <circle cx="54" cy="32" r="7" fill="#FFBE0B"/>
    <circle cx="78" cy="32" r="7" fill="${COLORS.green}"/>
    <text x="114" y="40" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="16" font-weight="750" fill="#FFFFFF">TubeLM selection</text>
    ${[0,1,2].map((i) => {
      const y = 100 + i * 88;
      const titleW = [178, 204, 154][i];
      return `<g transform="translate(28 ${y})">
        <rect width="96" height="60" rx="12" fill="#1F2937"/>
        <path d="M42 19L68 30L42 41Z" fill="#FFFFFF"/>
        <rect x="134" y="10" width="${titleW}" height="14" rx="7" fill="#121417"/>
        <rect x="134" y="40" width="128" height="10" rx="5" fill="#CBD5E1"/>
        <rect x="334" y="15" width="32" height="32" rx="9" fill="${COLORS.mint}"/>
        <path d="M342 31L349 38L360 24" fill="none" stroke="#06121F" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`;
    }).join('')}
    <rect x="28" y="362" width="364" height="42" rx="12" fill="${COLORS.ink}"/>
    <text x="56" y="389" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">Copy 18 clean URLs</text>
    <text x="270" y="389" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="13" font-weight="650" fill="#AEB7C3">newline list</text>
  </g>
</svg>`;
}

async function renderSvgToPng(svg, outputPath, size) {
  await sharp(Buffer.from(svg)).resize(size.width, size.height).png({ compressionLevel: 9 }).toFile(outputPath);
}

async function renderSvgToJpeg(svg, outputPath, size) {
  await sharp(Buffer.from(svg)).resize(size.width, size.height).jpeg({ quality: 92, mozjpeg: true }).toFile(outputPath);
}

async function renderSvgToWebp(svg, outputPath, size) {
  await sharp(Buffer.from(svg)).resize(size.width, size.height).webp({ quality: 92 }).toFile(outputPath);
}

function createIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(entries.length * 16);
  let offset = 6 + dir.length;
  entries.forEach((entry, index) => {
    const base = index * 16;
    dir.writeUInt8(entry.width === 256 ? 0 : entry.width, base);
    dir.writeUInt8(entry.height === 256 ? 0 : entry.height, base + 1);
    dir.writeUInt8(0, base + 2);
    dir.writeUInt8(0, base + 3);
    dir.writeUInt16LE(1, base + 4);
    dir.writeUInt16LE(32, base + 6);
    dir.writeUInt32LE(entry.buffer.length, base + 8);
    dir.writeUInt32LE(offset, base + 12);
    offset += entry.buffer.length;
  });
  return Buffer.concat([header, dir, ...entries.map((entry) => entry.buffer)]);
}

async function main() {
  await fs.mkdir(iconsDir, { recursive: true });
  await fs.mkdir(docsAssetsDir, { recursive: true });

  const master = iconSvg();
  const small = iconSvg({ small: true });
  const banner = bannerSvg();

  await fs.writeFile(path.join(iconsDir, 'icon.svg'), master, 'utf8');
  await fs.writeFile(path.join(iconsDir, 'icon-small.svg'), small, 'utf8');
  await fs.writeFile(path.join(docsAssetsDir, 'favicon.svg'), master, 'utf8');
  await fs.writeFile(path.join(docsAssetsDir, 'tubelm-github-banner.svg'), banner, 'utf8');

  const iconSizes = [16, 32, 48, 128];
  for (const size of iconSizes) {
    const source = size <= 32 ? small : master;
    await renderSvgToPng(source, path.join(iconsDir, `icon-${size}.png`), { width: size, height: size });
  }

  await renderSvgToPng(master, path.join(docsAssetsDir, 'favicon-16.png'), { width: 16, height: 16 });
  await renderSvgToPng(master, path.join(docsAssetsDir, 'favicon-32.png'), { width: 32, height: 32 });
  await renderSvgToPng(master, path.join(docsAssetsDir, 'apple-touch-icon.png'), { width: 180, height: 180 });
  await renderSvgToWebp(master, path.join(docsAssetsDir, 'brand-icon-512.webp'), { width: 512, height: 512 });

  const icoEntries = [];
  for (const size of [16, 32, 48]) {
    const source = size <= 32 ? small : master;
    const buffer = await sharp(Buffer.from(source)).resize(size, size).png().toBuffer();
    icoEntries.push({ width: size, height: size, buffer });
  }
  await fs.writeFile(path.join(docsAssetsDir, 'favicon.ico'), createIco(icoEntries));

  await renderSvgToPng(banner, path.join(docsAssetsDir, 'tubelm-github-banner.png'), { width: 1200, height: 630 });
  await renderSvgToJpeg(banner, path.join(docsAssetsDir, 'tubelm-github-banner.jpg'), { width: 1200, height: 630 });
  await renderSvgToWebp(banner, path.join(docsAssetsDir, 'tubelm-github-banner.webp'), { width: 1200, height: 630 });

  const outputs = [
    'icons/icon.svg', 'icons/icon-small.svg',
    ...iconSizes.map((size) => `icons/icon-${size}.png`),
    'docs/assets/favicon.svg', 'docs/assets/favicon.ico', 'docs/assets/favicon-16.png', 'docs/assets/favicon-32.png',
    'docs/assets/apple-touch-icon.png', 'docs/assets/brand-icon-512.webp',
    'docs/assets/tubelm-github-banner.svg', 'docs/assets/tubelm-github-banner.png',
    'docs/assets/tubelm-github-banner.jpg', 'docs/assets/tubelm-github-banner.webp',
  ];
  for (const relative of outputs) {
    const file = path.join(root, relative);
    const stat = await fs.stat(file);
    console.log(`${relative} ${stat.size} bytes`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
