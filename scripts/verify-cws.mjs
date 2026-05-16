#!/usr/bin/env node
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(readText(relativePath));
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const fail = (message) => {
  throw new Error(message);
};

const EXPECTED_RUNTIME_FILES = Object.freeze([
  'manifest.json',
  '_locales/ar/messages.json',
  '_locales/bn/messages.json',
  '_locales/en/messages.json',
  '_locales/es/messages.json',
  '_locales/fr/messages.json',
  '_locales/hi/messages.json',
  '_locales/pt_BR/messages.json',
  '_locales/ru/messages.json',
  '_locales/ur/messages.json',
  '_locales/zh_CN/messages.json',
  'content/content.js',
  'content/styles.css',
  'icons/icon-16.png',
  'icons/icon-32.png',
  'icons/icon-48.png',
  'icons/icon-128.png',
  'popup/popup.css',
  'popup/popup.html',
  'popup/popup.js',
  'sidepanel/sidepanel.html',
].sort());

const RUNTIME_DIRS = Object.freeze(['_locales', 'popup', 'content', 'sidepanel']);
const EXPECTED_PERMISSIONS = Object.freeze(['activeTab', 'scripting', 'clipboardWrite', 'sidePanel']);
const EXPECTED_HOST_PERMISSIONS = Object.freeze(['https://*.youtube.com/*']);
const EXPECTED_STORE_ASSETS = Object.freeze([
  { path: 'store-assets/screenshot-01-hero.png', width: 1280, height: 800, maxBytes: 16 * 1024 * 1024 },
  { path: 'store-assets/screenshot-02-search-results.png', width: 1280, height: 800, maxBytes: 16 * 1024 * 1024 },
  { path: 'store-assets/promo-small-440x280.png', width: 440, height: 280, maxBytes: 16 * 1024 * 1024 },
]);

function assertYouTubeHost(hostname) {
  return hostname === 'youtube.com' || hostname.endsWith('.youtube.com');
}

function assertYouTubeUrl(url) {
  try {
    const parsed = new URL(url);
    return assertYouTubeHost(parsed.hostname);
  } catch {
    return false;
  }
}

function assertContains(text, needle, label) {
  if (!text.includes(needle)) fail(`${label} missing ${JSON.stringify(needle)}`);
}

function assertNotContains(text, needle, label) {
  if (text.includes(needle)) fail(`${label} must not contain ${JSON.stringify(needle)}`);
}

function assertCodePattern(relativePath, pattern, label) {
  const text = readText(relativePath);
  if (!pattern.test(text)) fail(`${relativePath} missing code pattern for ${label}`);
}

function walk(dir, visit) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, visit);
    if (entry.isFile()) visit(full);
  }
}

function listActualRuntimeDirFiles() {
  const files = [];
  for (const dir of RUNTIME_DIRS) {
    walk(path.join(root, dir), (file) => files.push(path.relative(root, file).replaceAll(path.sep, '/')));
  }
  files.push('icons/icon-16.png', 'icons/icon-32.png', 'icons/icon-48.png', 'icons/icon-128.png');
  return [...new Set(files)].sort();
}

function readPngInfo(relativePath) {
  const filePath = path.join(root, relativePath);
  const buffer = fs.readFileSync(filePath);
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.deepEqual(buffer.subarray(0, 8), pngSignature, `${relativePath} must be a PNG file`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    colorType: buffer.readUInt8(25),
    bytes: buffer.length,
  };
}

function crc32(buffer) {
  let crc = ~0;
  for (let i = 0; i < buffer.length; i += 1) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (~crc) >>> 0;
}

function dosDateTime(date) {
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

function createZip(outputPath, files) {
  const chunks = [];
  const central = [];
  let offset = 0;
  const timestamp = dosDateTime(new Date(2026, 0, 1, 0, 0, 0));

  for (const relativePath of files) {
    const name = Buffer.from(relativePath.replaceAll('\\', '/'));
    const input = fs.readFileSync(path.join(root, relativePath));
    const compressed = zlib.deflateRawSync(input, { level: 9 });
    const crc = crc32(input);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(timestamp.time, 10);
    local.writeUInt16LE(timestamp.date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(input.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, name, compressed);

    const headerOffset = offset;
    offset += local.length + name.length + compressed.length;

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0x0800, 8);
    cd.writeUInt16LE(8, 10);
    cd.writeUInt16LE(timestamp.time, 12);
    cd.writeUInt16LE(timestamp.date, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(compressed.length, 20);
    cd.writeUInt32LE(input.length, 24);
    cd.writeUInt16LE(name.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(headerOffset, 42);
    central.push(cd, name);
  }

  const centralSize = central.reduce((sum, part) => sum + part.length, 0);
  const centralOffset = offset;
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(centralOffset, 16);
  end.writeUInt16LE(0, 20);
  fs.writeFileSync(outputPath, Buffer.concat([...chunks, ...central, end]));
}

function readZipEntries(buffer) {
  const entries = [];
  let index = 0;
  while (index < buffer.length - 4) {
    if (buffer.readUInt32LE(index) === 0x02014b50) {
      const nameLength = buffer.readUInt16LE(index + 28);
      const extraLength = buffer.readUInt16LE(index + 30);
      const commentLength = buffer.readUInt16LE(index + 32);
      entries.push(buffer.slice(index + 46, index + 46 + nameLength).toString('utf8'));
      index += 46 + nameLength + extraLength + commentLength;
      continue;
    }
    index += 1;
  }
  return entries.sort();
}

function assertExactManifest(manifest) {
  assert.equal(manifest.manifest_version, 3, 'manifest_version must be MV3');
  assert.equal(manifest.version, '1.0.2', 'manifest version must match CWS release');
  assert.equal(manifest.default_locale, 'en', 'default_locale must be en');
  assert.deepEqual(manifest.permissions, EXPECTED_PERMISSIONS, 'manifest permissions must match CWS disclosure exactly');
  assert.deepEqual(manifest.host_permissions, EXPECTED_HOST_PERMISSIONS, 'host permissions must stay YouTube-only');
  assert.equal(manifest.side_panel?.default_path, 'sidepanel/sidepanel.html', 'side panel path must match package allowlist');
  assert.equal(manifest.action?.default_popup, 'popup/popup.html', 'popup path must match package allowlist');

  assert.equal(manifest.content_scripts?.length, 1, 'manifest should declare one content script entry');
  const [contentScript] = manifest.content_scripts;
  assert.deepEqual(contentScript.matches, EXPECTED_HOST_PERMISSIONS, 'content script must run only on YouTube pages');
  assert.deepEqual(contentScript.js, ['content/content.js'], 'content script JS must match package allowlist');
  assert.deepEqual(contentScript.css, ['content/styles.css'], 'content script CSS must match package allowlist');
  assert.equal(contentScript.run_at, 'document_end', 'content script run_at must be explicit');
}

function main() {
  const manifest = readJson('manifest.json');
  assertExactManifest(manifest);

  for (const file of EXPECTED_RUNTIME_FILES) {
    assert.ok(exists(file), `runtime file missing: ${file}`);
  }

  const expectedDirFiles = EXPECTED_RUNTIME_FILES.filter((file) => file !== 'manifest.json').sort();
  const actualDirFiles = listActualRuntimeDirFiles();
  assert.deepEqual(actualDirFiles, expectedDirFiles, 'runtime directories contain unexpected files; update verifier intentionally before packaging them');

  const disallowedRuntimeEntries = EXPECTED_RUNTIME_FILES.filter((file) => (
    file.startsWith('.git') ||
    file.startsWith('.gsd') ||
    file.startsWith('.bg-shell') ||
    file.startsWith('docs/') ||
    file.startsWith('build/') ||
    file.startsWith('scripts/') ||
    ['README.md', 'LICENSE', 'CWS-LISTING.md', 'CWS-MOCKUP-GUIDE.md', '.gitignore', 'icons/icon.svg'].includes(file)
  ));
  assert.deepEqual(disallowedRuntimeEntries, [], 'runtime package allowlist must not include docs/source/agent/verifier files');

  assert.equal(assertYouTubeUrl('https://www.youtube.com/watch?v=abc'), true, 'www.youtube.com should be accepted');
  assert.equal(assertYouTubeUrl('https://m.youtube.com/shorts/abc'), true, 'm.youtube.com should be accepted');
  assert.equal(assertYouTubeUrl('https://youtube.com.evil.example/watch?v=abc'), false, 'lookalike youtube.com host must be rejected');
  assert.equal(assertYouTubeUrl('https://notyoutube.com/watch?v=abc'), false, 'non-YouTube host must be rejected');

  assertCodePattern('popup/popup.js', /hostname === 'youtube\.com'[^\n]+hostname\.endsWith\('\.youtube\.com'\)/s, 'strict YouTube hostname check');
  assertCodePattern('content/content.js', /isYouTubeHost\(u\.hostname\)/, 'content script host validation');
  assertNotContains(readText('popup/popup.js'), "hostname.includes('youtube.com')", 'popup host check');

  const listing = readText('CWS-LISTING.md');
  assertContains(listing, '`sidePanel`', 'CWS-LISTING permission table');
  assertContains(listing, '`_locales/`', 'CWS-LISTING package include list');
  assertContains(listing, '`sidepanel/`', 'CWS-LISTING package include list');
  assertContains(listing, 'content script is declared in the manifest and runs only on matching YouTube pages', 'CWS-LISTING activeTab/scripting accuracy');
  assertContains(listing, 'Website content: Yes', 'CWS-LISTING privacy disclosure guidance');
  assertContains(listing, 'No, I am not using remote code.', 'CWS-LISTING remote code answer');

  const privacy = readText('docs/privacy.html');
  assertContains(privacy, '<code>sidePanel</code>', 'privacy permission list');
  assertContains(privacy, 'processes website content locally', 'privacy local website-content handling');
  assertContains(privacy, 'does not transmit', 'privacy no transfer claim');

  const imageGuide = readText('CWS-MOCKUP-GUIDE.md');
  assertContains(imageGuide, 'Square corners, no padding, full bleed', 'screenshot hard rule');
  assertContains(imageGuide, 'Do not composite required screenshots into marketing frames', 'screenshot hard rule');
  assertContains(imageGuide, 'Marketing composites belong in promotional tiles', 'screenshot vs promo distinction');
  assertContains(imageGuide, 'store-assets/screenshot-01-hero.png', 'required screenshot asset list');
  assertContains(imageGuide, 'store-assets/screenshot-02-search-results.png', 'required screenshot asset list');
  assertContains(imageGuide, 'store-assets/promo-small-440x280.png', 'required promo asset list');
  assertNotContains(imageGuide, 'store-assets/screenshot-03-notebooklm.png', 'optional mockups must not be listed as upload assets');
  assertNotContains(imageGuide, 'Composite each screenshot into the 1280x800 template in Figma', 'outdated screenshot production step');
  assertNotContains(imageGuide, 'synthetic mockup for screenshot #1', 'required screenshots must not be synthetic mockups');

  const assetsReadme = readText('store-assets/README.md');
  assertContains(assetsReadme, '.tubelm-checkbox` count was 25', 'store asset capture provenance');
  assertContains(assetsReadme, '.tubelm-checkbox` count was 33', 'store asset capture provenance');
  assertContains(assetsReadme, 'Do not upload generated mockups as required CWS screenshots', 'store asset mockup guard');

  const expectedStoreFiles = [...EXPECTED_STORE_ASSETS.map((asset) => asset.path), 'store-assets/README.md'].sort();
  const actualStoreFiles = fs.readdirSync(path.join(root, 'store-assets'), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `store-assets/${entry.name}`)
    .sort();
  assert.deepEqual(actualStoreFiles, expectedStoreFiles, 'store-assets must contain only upload-ready assets plus README provenance');

  const assetGenerator = readText('scripts/generate-store-assets.py');
  assertNotContains(assetGenerator, 'screenshot-01-hero.png', 'asset generator must not overwrite live screenshots');
  assertNotContains(assetGenerator, 'screenshot-02-search-results.png', 'asset generator must not overwrite live screenshots');

  for (const asset of EXPECTED_STORE_ASSETS) {
    assert.ok(exists(asset.path), `store asset missing: ${asset.path}`);
    const info = readPngInfo(asset.path);
    assert.equal(info.width, asset.width, `${asset.path} width must be ${asset.width}`);
    assert.equal(info.height, asset.height, `${asset.path} height must be ${asset.height}`);
    assert.equal(info.colorType, 2, `${asset.path} must be RGB PNG with no alpha transparency`);
    assert.ok(info.bytes <= asset.maxBytes, `${asset.path} exceeds Chrome Web Store size limit`);
  }

  const zipPath = path.join(root, 'build', 'tubelm-link-picker-cws-v1.0.2.zip');
  fs.mkdirSync(path.dirname(zipPath), { recursive: true });
  createZip(zipPath, EXPECTED_RUNTIME_FILES);
  const zipBuffer = fs.readFileSync(zipPath);
  const entries = readZipEntries(zipBuffer);
  assert.deepEqual(entries, EXPECTED_RUNTIME_FILES, 'generated CWS ZIP must contain exactly the runtime allowlist');
  const hash = crypto.createHash('sha256').update(zipBuffer).digest('hex');
  console.log(JSON.stringify({
    ok: true,
    runtimeFiles: EXPECTED_RUNTIME_FILES.length,
    storeAssets: EXPECTED_STORE_ASSETS.map((asset) => asset.path),
    zipPath: path.relative(root, zipPath).replaceAll(path.sep, '/'),
    zipBytes: zipBuffer.length,
    zipSha256: hash,
  }, null, 2));
}

main();
