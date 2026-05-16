document.addEventListener('DOMContentLoaded', () => {
    const copySelectedBtn = document.getElementById('copySelectedBtn');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const clearBtn = document.getElementById('clearBtn');
    const tabStatus = document.getElementById('tabStatus');
    const statCount = document.getElementById('statCount');
    const statNote = document.getElementById('statNote');
    const copyLabel = document.getElementById('copyLabel');
    const copyHint = document.getElementById('copyHint');
    const hasExtensionApi = typeof chrome !== 'undefined' && !!chrome.tabs && !!chrome.runtime;
    const hasI18n = typeof chrome !== 'undefined' && !!chrome.i18n && typeof chrome.i18n.getMessage === 'function';

    const RTL_LOCALES = new Set(['ar', 'he', 'fa', 'ur']);

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
            return fallback.replace('$1', String(substitution)).replace('$count$', String(substitution));
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
        const lang = hasI18n ? chrome.i18n.getUILanguage() : (document.documentElement.lang || 'en');
        const root = lang.split('-')[0].toLowerCase();
        document.documentElement.lang = lang;
        document.documentElement.dir = RTL_LOCALES.has(root) ? 'rtl' : 'ltr';
    }

    function setStatus(intent, key) {
        tabStatus.dataset.intent = intent;
        tabStatus.textContent = t(key);
    }

    function setCount(count) {
        statCount.textContent = String(count);
        statCount.dataset.zero = count === 0 ? 'true' : 'false';
    }

    // Helper to query active tab
    async function getActiveTab() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return tab;
    }

    // Helper to check if URL is a YouTube page
    function isYouTubePage(url) {
        if (!url) return false;
        try {
            const u = new URL(url);
            return u.hostname.includes('youtube.com');
        } catch {
            return false;
        }
    }

    // Helper to send message to content script
    async function sendMessageToContent(message) {
        const tab = await getActiveTab();
        if (!tab?.id) return { error: 'no_tab' };

        if (!isYouTubePage(tab.url)) {
            return { error: 'not_youtube' };
        }

        try {
            return await chrome.tabs.sendMessage(tab.id, message);
        } catch (err) {
            // Fallback: attempt to inject the content script if it is missing
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

                await new Promise(r => setTimeout(r, 300));
                return await chrome.tabs.sendMessage(tab.id, message);
            } catch {
                return { error: 'injection_failed' };
            }
        }
    }

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

    // Update UI based on selection status
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

    // Localise static strings and apply text direction before any logic runs.
    applyLocaleDirection();
    applyStaticTranslations();

    if (!hasExtensionApi) {
        // Dev preview (file:// or an unrelated context). Keep the layout populated
        // with the localised defaults that applyStaticTranslations() already wrote
        // and leave the action buttons disabled. No misleading "install from
        // chrome://extensions" copy is shown anywhere.
        copySelectedBtn.disabled = true;
        selectAllBtn.disabled = true;
        clearBtn.disabled = true;
        setStatus('neutral', 'statusChecking');
        return;
    }

    // 1. Copy Action
    copySelectedBtn.addEventListener('click', async () => {
        const response = await sendMessageToContent({ action: 'getSelectedUrls' });
        if (response && Array.isArray(response.urls) && response.urls.length > 0) {
            const textToCopy = response.urls.join('\n'); // Newline separated
            try {
                await navigator.clipboard.writeText(textToCopy);

                // Visual feedback
                copySelectedBtn.classList.add('copied');
                const originalLabel = copyLabel.textContent;
                copyLabel.textContent = t('copied');
                setTimeout(() => {
                    copySelectedBtn.classList.remove('copied');
                    copyLabel.textContent = originalLabel;
                }, 1400);
            } catch (err) {
                console.error('Failed to copy', err);
            }
        }
    });

    // 2. Select All Visible Action
    selectAllBtn.addEventListener('click', async () => {
        await sendMessageToContent({ action: 'selectAllVisible' });
        updateStatus();
    });

    // 3. Clear Action
    clearBtn.addEventListener('click', async () => {
        await sendMessageToContent({ action: 'clearSelection' });
        updateStatus();
    });

    // Initial check
    updateStatus();

    // Poll for updates (in case user clicks checkboxes on page while popup is open)
    setInterval(updateStatus, 1000);
});
