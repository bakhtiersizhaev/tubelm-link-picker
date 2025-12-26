document.addEventListener('DOMContentLoaded', () => {
    const copySelectedBtn = document.getElementById('copySelectedBtn');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const clearBtn = document.getElementById('clearBtn');
    const tabStatus = document.getElementById('tabStatus');
    const statCount = document.getElementById('statCount');
    const statNote = document.getElementById('statNote');
    const copyLabel = document.getElementById('copyLabel');
    const copyHint = document.getElementById('copyHint');

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
        tabStatus.dataset.intent = 'error';
        copySelectedBtn.disabled = true;
        selectAllBtn.disabled = true;
        clearBtn.disabled = true;
        statCount.textContent = '—';

        if (reason === 'not_youtube') {
            tabStatus.textContent = 'Open a YouTube tab';
            statNote.textContent = 'Head to youtube.com, then reopen this popup to start selecting.';
        } else {
            tabStatus.textContent = 'Helper can’t reach this tab';
            statNote.textContent = 'Reload the tab or try again on a standard YouTube page.';
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

            tabStatus.dataset.intent = 'ok';
            tabStatus.textContent = 'Watching this YouTube tab';
            selectAllBtn.disabled = false;
            clearBtn.disabled = false;
            copySelectedBtn.disabled = count === 0;

            statCount.textContent = count;
            statNote.textContent = count === 0
                ? 'Use on-video checkboxes or “Select visible” to add items.'
                : 'Ready to copy. Clean watch/shorts URLs only.';

            copyLabel.textContent = count > 0 ? `Copy ${count} ${count === 1 ? 'URL' : 'URLs'}` : 'Copy selection';
            copyHint.textContent = count > 5 ? 'Creates a newline list for NotebookLM' : 'Copies clean YouTube links';
        }
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
                copyLabel.textContent = 'Copied!';
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
