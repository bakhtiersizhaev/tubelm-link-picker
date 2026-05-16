/* =========================================================================
   TubeLM — shared controller for popup + side panel.

   The popup and side panel reuse the same HTML structure and the same CSS;
   this script is loaded by both `popup/popup.html` and
   `sidepanel/sidepanel.html`. Mode is read from `body.dataset.mode` so the
   "Open in side panel" button is only shown in popup mode (and only when
   `chrome.sidePanel` is actually available).
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;
  const mode = body.dataset.mode === 'sidepanel' ? 'sidepanel' : 'popup';

  const copySelectedBtn = document.getElementById('copySelectedBtn');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const clearBtn = document.getElementById('clearBtn');
  const tabStatus = document.getElementById('tabStatus');
  const statCount = document.getElementById('statCount');
  const statNote = document.getElementById('statNote');
  const copyLabel = document.getElementById('copyLabel');
  const copyHint = document.getElementById('copyHint');
  const openSidePanelBtn = document.getElementById('openSidePanelBtn');

  const hasChrome = typeof chrome !== 'undefined';
  const hasTabsApi = hasChrome && !!chrome.tabs && !!chrome.runtime;
  const hasI18n = hasChrome && !!chrome.i18n && typeof chrome.i18n.getMessage === 'function';
  const hasSidePanel = hasChrome && !!chrome.sidePanel && typeof chrome.sidePanel.open === 'function';

  const RTL_LOCALES = new Set(['ar', 'he', 'fa', 'ur']);

  /* ---------- i18n helpers ---------------------------------------------- */

  function t(key, substitution) {
    if (hasI18n) {
      const msg = substitution !== undefined
        ? chrome.i18n.getMessage(key, [String(substitution)])
        : chrome.i18n.getMessage(key);
      if (msg) return msg;
    }
    // Fallback used in file:// preview where chrome.i18n is unavailable:
    // read the inline default text from the matching data-i18n element.
    const el = document.querySelector('[data-i18n="' + key + '"]');
    const fallback = el ? el.textContent : key;
    if (substitution !== undefined) {
      return fallback
        .replace('$1', String(substitution))
        .replace('$count$', String(substitution));
    }
    return fallback;
  }

  function applyStaticTranslations() {
    if (!hasI18n) return;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      const value = chrome.i18n.getMessage(key);
      if (value) el.textContent = value;
    });
  }

  function applyLocaleDirection() {
    const lang = hasI18n
      ? chrome.i18n.getUILanguage()
      : (root.lang || 'en');
    const rootLang = lang.split('-')[0].toLowerCase();
    root.lang = lang;
    root.dir = RTL_LOCALES.has(rootLang) ? 'rtl' : 'ltr';
  }

  /* ---------- UI helpers ------------------------------------------------ */

  function setStatus(intent, key) {
    if (!tabStatus) return;
    tabStatus.dataset.intent = intent;
    tabStatus.textContent = t(key);
  }

  function setCount(count) {
    if (!statCount) return;
    statCount.textContent = String(count);
    statCount.dataset.zero = count === 0 ? 'true' : 'false';
  }

  function setSidePanelButtonVisible(visible) {
    if (!openSidePanelBtn) return;
    openSidePanelBtn.hidden = !visible;
  }

  /* ---------- tab + content-script bridge ------------------------------- */

  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  function isYouTubePage(url) {
    if (!url) return false;
    try {
      const u = new URL(url);
      return u.hostname.includes('youtube.com');
    } catch {
      return false;
    }
  }

  async function sendMessageToContent(message) {
    const tab = await getActiveTab();
    if (!tab?.id) return { error: 'no_tab' };
    if (!isYouTubePage(tab.url)) return { error: 'not_youtube' };

    try {
      return await chrome.tabs.sendMessage(tab.id, message);
    } catch {
      try {
        if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) {
          return { error: 'unsupported_page' };
        }
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ['content/styles.css']
        });
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content/content.js']
        });
        await new Promise((r) => setTimeout(r, 300));
        return await chrome.tabs.sendMessage(tab.id, message);
      } catch {
        return { error: 'injection_failed' };
      }
    }
  }

  /* ---------- selection state ------------------------------------------- */

  function setBlockedState(reason) {
    copySelectedBtn.disabled = true;
    selectAllBtn.disabled = true;
    clearBtn.disabled = true;
    setCount(0);
    copyLabel.textContent = t('copyLabelEmpty');
    copyHint.textContent = t('copyHintDefault');

    if (reason === 'not_youtube') {
      setStatus('warn', 'statusNotYouTube');
      statNote.textContent = t('noteOpenYouTube');
    } else {
      setStatus('warn', 'statusUnreachable');
      statNote.textContent = t('noteUnreachable');
    }
  }

  async function updateStatus() {
    const response = await sendMessageToContent({ action: 'getSelectionCount' });

    if (response?.error) {
      setBlockedState(response.error);
      return;
    }

    if (typeof response?.count === 'number') {
      const count = response.count;

      setStatus('ok', 'statusReady');
      selectAllBtn.disabled = false;
      clearBtn.disabled = false;
      copySelectedBtn.disabled = count === 0;

      setCount(count);
      statNote.textContent = count === 0 ? t('noteEmpty') : t('noteReady');

      copyLabel.textContent = count > 0
        ? t('copyLabelCount', count)
        : t('copyLabelEmpty');
      copyHint.textContent = t('copyHintDefault');
    }
  }

  /* ---------- bootstrap ------------------------------------------------- */

  applyLocaleDirection();
  applyStaticTranslations();

  // The "Open in side panel" button is only meaningful inside the popup
  // when the sidePanel API is actually available.
  setSidePanelButtonVisible(mode === 'popup' && hasSidePanel);

  if (openSidePanelBtn) {
    openSidePanelBtn.addEventListener('click', async () => {
      if (!hasSidePanel) return;
      try {
        const tab = await getActiveTab();
        const target = tab?.windowId !== undefined
          ? { windowId: tab.windowId }
          : { tabId: tab?.id };
        // chrome.sidePanel.open must be called from a user gesture, which
        // this click handler is — Chrome will close the popup automatically
        // once the side panel opens.
        await chrome.sidePanel.open(target);
        window.close();
      } catch (err) {
        console.error('Failed to open side panel', err);
      }
    });
  }

  if (!hasTabsApi) {
    // Dev preview (file://) or another non-extension context. Keep the
    // localised default copy in place and leave the action buttons disabled.
    // No misleading "install from chrome://extensions" copy is shown.
    copySelectedBtn.disabled = true;
    selectAllBtn.disabled = true;
    clearBtn.disabled = true;
    setStatus('neutral', 'statusChecking');
    return;
  }

  copySelectedBtn.addEventListener('click', async () => {
    const response = await sendMessageToContent({ action: 'getSelectedUrls' });
    if (response && Array.isArray(response.urls) && response.urls.length > 0) {
      const textToCopy = response.urls.join('\n');
      try {
        await navigator.clipboard.writeText(textToCopy);
        copySelectedBtn.classList.add('is-copied');
        const originalLabel = copyLabel.textContent;
        copyLabel.textContent = t('copied');
        setTimeout(() => {
          copySelectedBtn.classList.remove('is-copied');
          copyLabel.textContent = originalLabel;
        }, 1400);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  });

  selectAllBtn.addEventListener('click', async () => {
    await sendMessageToContent({ action: 'selectAllVisible' });
    updateStatus();
  });

  clearBtn.addEventListener('click', async () => {
    await sendMessageToContent({ action: 'clearSelection' });
    updateStatus();
  });

  updateStatus();
  setInterval(updateStatus, 1000);
});
