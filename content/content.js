/**
 * TubeLM Link Picker - Content Script
 * Adds selection checkboxes to YouTube video thumbnails
 * 
 * Key learnings from research:
 * 1. MutationObserver handles dynamic content
 * 2. Attach checkboxes inside thumbnail containers to avoid drift
 */

(function () {
    'use strict';

    const SCRIPT_VERSION = 'v8';
    if (window.__tubeLmLinkPickerVersion === SCRIPT_VERSION) {
        console.log('TubeLM Link Picker: already active, skipping duplicate load');
        return;
    }

    // Try to clean up a previous instance if it exposed a cleanup hook
    if (window.__tubeLmLinkPickerState?.cleanup) {
        try {
            window.__tubeLmLinkPickerState.cleanup();
        } catch {
            // Ignore cleanup errors from older versions
        }
    }

    window.__tubeLmLinkPickerVersion = SCRIPT_VERSION;

    // Clean up any stale checkboxes/overlays from a previous inject
    document.querySelectorAll('.tubelm-checkbox, .yt-notebook-checkbox').forEach(cb => cb.remove());
    document.getElementById('tubelm-overlay')?.remove();
    document.getElementById('yt-notebook-overlay')?.remove();

    console.log('%c TubeLM Link Picker: Content script loaded (v8) ',
        'background: #10b981; color: black; font-size: 14px; padding: 4px;');

    // ================== STATE ==================
    const selectedUrls = new Set();
    const checkboxMap = new Map(); // card element -> checkbox element
    const overlayRoot = document.createElement('div');

    // Visual system (shared by inline styles + optional CSS)
    const ACCENT = '#7df8c6';
    const ACCENT_HOVER = '#9bfad8';
    const BASE_BG = 'rgba(5, 12, 22, 0.86)';
    const BORDER_IDLE = 'rgba(255, 255, 255, 0.55)';

    overlayRoot.id = 'tubelm-overlay';
    overlayRoot.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 1500;
        pointer-events: none;
    `;

    // ================== UTILITIES ==================

    function isValidVideoUrl(url) {
        if (!url) return false;
        try {
            const u = new URL(url);
            if (u.pathname === '/watch' && u.searchParams.has('v')) return true;
            if (u.pathname.startsWith('/shorts/') && u.pathname.length > 8) return true;
            return false;
        } catch {
            return false;
        }
    }

    function cleanUrl(url) {
        try {
            const u = new URL(url);
            const v = u.searchParams.get('v');
            if (v) return `https://www.youtube.com/watch?v=${v}`;
            if (u.pathname.startsWith('/shorts/')) {
                const shortId = u.pathname.split('/shorts/')[1]?.split('/')[0]?.split('?')[0];
                if (shortId) return `https://www.youtube.com/shorts/${shortId}`;
            }
            return u.href;
        } catch {
            return url;
        }
    }

    function applyCheckboxVisualState(checkbox, isSelected) {
        if (!checkbox) return;
        checkbox.style.background = isSelected ? ACCENT : BASE_BG;
        checkbox.style.borderColor = isSelected ? ACCENT : BORDER_IDLE;
        checkbox.setAttribute('aria-pressed', String(isSelected));
        checkbox.setAttribute(
            'aria-label',
            isSelected ? 'Remove YouTube URL from TubeLM selection' : 'Add YouTube URL to TubeLM selection'
        );
        checkbox.style.boxShadow = isSelected
            ? '0 10px 24px rgba(125, 248, 198, 0.3)'
            : '0 8px 18px rgba(0, 0, 0, 0.35)';
        const checkmark = checkbox.querySelector('svg');
        if (checkmark) {
            checkmark.style.stroke = isSelected ? '#06121f' : '#ffffff';
            checkmark.style.display = isSelected ? 'block' : 'none';
        }
    }

    function ensureOverlayMounted() {
        if (!document.body.contains(overlayRoot)) {
            document.body.appendChild(overlayRoot);
        }
    }

    function findVideoAnchor(card) {
        if (!card) return null;
        const preferred = card.querySelector('a#thumbnail');
        if (preferred && isValidVideoUrl(preferred.href)) return preferred;

        const candidates = Array.from(card.querySelectorAll('a[href]'))
            .filter(a => isValidVideoUrl(a.href));
        if (candidates.length === 0) return null;

        const rich = candidates.find(a => a.querySelector('ytd-thumbnail, yt-image, img'));
        return rich || candidates[0];
    }

    // ================== CHECKBOX CREATION ==================

    function createCheckbox(cardElement, videoUrl) {
        if (!cardElement || checkboxMap.has(cardElement)) return null;

        const finalUrl = cleanUrl(videoUrl);

        // Create checkbox container
        const checkbox = document.createElement('button');
        checkbox.type = 'button';
        checkbox.className = 'tubelm-checkbox';
        checkbox.dataset.url = finalUrl;

        // CRITICAL: Use position:fixed and append to BODY
        // This completely bypasses YouTube's overflow:hidden
        checkbox.style.cssText = `
            position: absolute;
            z-index: 999;
            top: 8px;
            left: 8px;
            width: 26px;
            height: 26px;
            padding: 0;
            background: ${BASE_BG};
            border: 2px solid ${BORDER_IDLE};
            border-radius: 8px;
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(4px);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.15s ease, background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease;
            pointer-events: auto;
            appearance: none;
        `;

        // Checkmark SVG
        checkbox.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" 
                 stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                 style="display: none; pointer-events: none;">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;

        const getCurrentUrl = () => checkbox.dataset.url || finalUrl;

        // State management
        const updateVisualState = () => {
            const isSelected = selectedUrls.has(getCurrentUrl());
            applyCheckboxVisualState(checkbox, isSelected);
        };

        // Initialize state
        updateVisualState();

        // Hover effects
        checkbox.addEventListener('mouseenter', () => {
            checkbox.style.transform = 'translateY(-1px) scale(1.05)';
            checkbox.style.background = selectedUrls.has(getCurrentUrl()) ? ACCENT_HOVER : 'rgba(125, 248, 198, 0.25)';
            checkbox.style.borderColor = selectedUrls.has(getCurrentUrl()) ? ACCENT_HOVER : ACCENT;
            checkbox.style.boxShadow = '0 12px 26px rgba(125, 248, 198, 0.24)';
        });

        checkbox.addEventListener('mouseleave', () => {
            checkbox.style.transform = 'scale(1)';
            updateVisualState();
        });

        // Click handler
        checkbox.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const currentUrl = getCurrentUrl();
            if (selectedUrls.has(currentUrl)) {
                selectedUrls.delete(currentUrl);
            } else {
                selectedUrls.add(currentUrl);
            }
            updateVisualState();
            console.log('TubeLM: Selection toggled', currentUrl, 'Total:', selectedUrls.size);
        }, true);

        // Store reference for updates
        checkboxMap.set(cardElement, checkbox);

        // Mount to overlay so hover previews do not remove the checkbox
        ensureOverlayMounted();
        overlayRoot.appendChild(checkbox);

        // Initial positioning relative to anchor
        updateCheckboxPosition(cardElement, checkbox);

        return checkbox;
    }

    // ================== POSITIONING ==================

    function updateCheckboxPosition(cardElement, checkbox) {
        if (!cardElement || !cardElement.isConnected) {
            checkbox?.remove();
            checkboxMap.delete(cardElement);
            return;
        }

        const rect = cardElement.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            checkbox.style.display = 'none';
            return;
        }

        // Hide when far off-screen to reduce clutter
        if (rect.bottom < -120 || rect.top > window.innerHeight + 120 ||
            rect.right < -120 || rect.left > window.innerWidth + 120) {
            checkbox.style.display = 'none';
            return;
        }

        checkbox.style.display = 'flex';
        checkbox.style.top = `${rect.top + 8}px`;
        checkbox.style.left = `${rect.left + 8}px`;
    }

    function updateAllPositions() {
        checkboxMap.forEach((checkbox, card) => {
            updateCheckboxPosition(card, checkbox);
        });
    }

    // ================== SCANNING ==================

    function scanForVideos() {
        const cardSelectors = [
            'yt-lockup-view-model',
            'ytd-rich-item-renderer',
            'ytd-grid-video-renderer',
            'ytd-video-renderer',
            'ytd-compact-video-renderer',
            'ytd-rich-grid-slim-media',
            'ytd-reel-item-renderer',
            'ytd-reel-video-renderer',
            'ytd-shorts',
            'ytm-shorts-lockup-view-model'
        ];

        let newCount = 0;

        document.querySelectorAll(cardSelectors.join(',')).forEach(card => {
            const anchor = findVideoAnchor(card);
            if (!anchor) return;
            const url = anchor.href;
            if (!isValidVideoUrl(url)) return;

            if (checkboxMap.has(card)) {
                const checkbox = checkboxMap.get(card);
                if (checkbox) {
                    checkbox.dataset.url = cleanUrl(url);
                    applyCheckboxVisualState(checkbox, selectedUrls.has(checkbox.dataset.url));
                    updateCheckboxPosition(card, checkbox);
                }
                return;
            }

            const checkbox = createCheckbox(card, url);
            if (checkbox) newCount++;
        });

        if (newCount > 0) {
            const total = document.querySelectorAll('.tubelm-checkbox').length;
            console.log('TubeLM: Created', newCount, 'new checkboxes. Total:', total);
        }
    }

    // ================== OBSERVER ==================

    let scanTimeout = null;
    function scheduleScan() {
        if (scanTimeout) return;
        scanTimeout = setTimeout(() => {
            scanForVideos();
            scanTimeout = null;
        }, 300);
    }

    const observer = new MutationObserver(mutations => {
        let shouldScan = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldScan = true;
                break;
            }
        }
        if (shouldScan) scheduleScan();
    });

    // ================== MESSAGING ==================

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('TubeLM: Message received:', request.action);

        try {
            switch (request.action) {
                case 'getSelectionCount':
                    sendResponse({ count: selectedUrls.size });
                    break;

                case 'getSelectedUrls':
                    sendResponse({ urls: Array.from(selectedUrls) });
                    break;

                case 'clearSelection':
                    selectedUrls.clear();
                    document.querySelectorAll('.tubelm-checkbox').forEach(cb => {
                        cb.style.background = BASE_BG;
                        cb.style.borderColor = BORDER_IDLE;
                        cb.setAttribute('aria-pressed', 'false');
                        cb.setAttribute('aria-label', 'Add YouTube URL to TubeLM selection');
                        cb.style.boxShadow = '0 8px 18px rgba(0, 0, 0, 0.35)';
                        const svg = cb.querySelector('svg');
                        if (svg) {
                            svg.style.display = 'none';
                            svg.style.stroke = '#ffffff';
                        }
                    });
                    sendResponse({ status: 'ok' });
                    break;

                case 'selectAllVisible':
                    scanForVideos();
                    document.querySelectorAll('.tubelm-checkbox').forEach(cb => {
                        const url = cb.dataset.url;
                        if (url && cb.style.display !== 'none') {
                            selectedUrls.add(url);
                            cb.style.background = ACCENT;
                            cb.style.borderColor = ACCENT;
                            cb.setAttribute('aria-pressed', 'true');
                            cb.setAttribute('aria-label', 'Remove YouTube URL from TubeLM selection');
                            cb.style.boxShadow = '0 10px 24px rgba(125, 248, 198, 0.3)';
                            const svg = cb.querySelector('svg');
                            if (svg) {
                                svg.style.display = 'block';
                                svg.style.stroke = '#06121f';
                            }
                        }
                    });
                    sendResponse({ count: selectedUrls.size });
                    break;

                default:
                    sendResponse({ error: 'Unknown action' });
            }
        } catch (error) {
            console.error('TubeLM: Error:', error);
            sendResponse({ error: error.message });
        }

        return true;
    });

    // ================== INITIALIZATION ==================

    function init() {
        ensureOverlayMounted();

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Periodic scan to catch virtualized updates where nodes are reused
        const periodicScan = setInterval(scanForVideos, 1500);

        // Keep overlay positions synced even during hover previews
        let positionRaf = null;
        const positionLoop = () => {
            updateAllPositions();
            positionRaf = requestAnimationFrame(positionLoop);
        };
        positionRaf = requestAnimationFrame(positionLoop);

        // Initial scan
        scanForVideos();

        // Delayed scans for dynamic content
        setTimeout(scanForVideos, 1000);
        setTimeout(scanForVideos, 3000);
        setTimeout(scanForVideos, 5000);

        window.__tubeLmLinkPickerState = {
            cleanup() {
                observer.disconnect();
                clearInterval(periodicScan);
                if (positionRaf) cancelAnimationFrame(positionRaf);
                overlayRoot.remove();
                document.querySelectorAll('.tubelm-checkbox').forEach(cb => cb.remove());
            }
        };

        console.log('TubeLM: Initialized successfully');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
