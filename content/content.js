/**
 * YouTube Notebook LLM Helper - Content Script
 * Adds selection checkboxes to YouTube video thumbnails
 * 
 * Key learnings from research:
 * 1. MutationObserver handles dynamic content
 * 2. Attach checkboxes inside thumbnail containers to avoid drift
 */

(function () {
    'use strict';

    const SCRIPT_VERSION = 'v6';
    if (window.__ytNotebookHelperVersion === SCRIPT_VERSION) {
        console.log('YT Notebook Helper: already active, skipping duplicate load');
        return;
    }

    // Try to clean up a previous instance if it exposed a cleanup hook
    if (window.__ytNotebookHelperState?.cleanup) {
        try {
            window.__ytNotebookHelperState.cleanup();
        } catch {
            // Ignore cleanup errors from older versions
        }
    }

    window.__ytNotebookHelperVersion = SCRIPT_VERSION;

    // Clean up any stale checkboxes from a previous inject
    document.querySelectorAll('.yt-notebook-checkbox').forEach(cb => cb.remove());

    console.log('%c YT Notebook Helper: Content script loaded (v4) ',
        'background: #3ea6ff; color: black; font-size: 14px; padding: 4px;');

    // ================== STATE ==================
    const selectedUrls = new Set();
    const checkboxMap = new WeakMap(); // thumbnail element -> checkbox element
    const processedThumbnails = new WeakSet();

    // Visual system (shared by inline styles + optional CSS)
    const ACCENT = '#7df8c6';
    const ACCENT_HOVER = '#9bfad8';
    const BASE_BG = 'rgba(5, 12, 22, 0.86)';
    const BORDER_IDLE = 'rgba(255, 255, 255, 0.55)';

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
        checkbox.style.boxShadow = isSelected
            ? '0 10px 24px rgba(125, 248, 198, 0.3)'
            : '0 8px 18px rgba(0, 0, 0, 0.35)';
        const checkmark = checkbox.querySelector('svg');
        if (checkmark) {
            checkmark.style.stroke = isSelected ? '#06121f' : '#ffffff';
            checkmark.style.display = isSelected ? 'block' : 'none';
        }
    }

    function pickLockupThumbnailAnchor(lockup) {
        if (!lockup) return null;
        const preferred =
            lockup.querySelector('a#thumbnail') ||
            Array.from(lockup.querySelectorAll('a[href]')).find(a =>
                a.querySelector('ytd-thumbnail, yt-image, img')
            );
        return preferred || null;
    }

    function getMountElementFromAnchor(anchor) {
        if (!anchor) return null;

        const thumbnail = anchor.closest('ytd-thumbnail') || anchor.querySelector('ytd-thumbnail');
        if (thumbnail) return thumbnail;

        const lockup = anchor.closest('yt-lockup-view-model');
        if (lockup) {
            const lockupThumb = lockup.querySelector('ytd-thumbnail');
            if (lockupThumb) return lockupThumb;
            return lockup;
        }

        return anchor;
    }

    // ================== CHECKBOX CREATION ==================

    function createCheckbox(thumbnailElement, videoUrl) {
        // Skip if already processed
        if (processedThumbnails.has(thumbnailElement)) return null;
        processedThumbnails.add(thumbnailElement);

        const finalUrl = cleanUrl(videoUrl);

        // Create checkbox container
        const checkbox = document.createElement('div');
        checkbox.className = 'yt-notebook-checkbox';
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
            console.log('YT Helper: Selection toggled', currentUrl, 'Total:', selectedUrls.size);
        }, true);

        // Store reference for updates
        checkboxMap.set(thumbnailElement, checkbox);

        // Ensure container is a positioning context
        const computed = window.getComputedStyle(thumbnailElement);
        if (computed.position === 'static') {
            thumbnailElement.style.position = 'relative';
        }

        // Append inside the thumbnail to avoid floating on virtualized scroll
        thumbnailElement.appendChild(checkbox);

        return checkbox;
    }

    // ================== POSITIONING ==================

    function updateCheckboxPosition(thumbnailElement, checkbox) {
        // If the thumbnail was removed from DOM, clean up the checkbox to avoid ghosts
        if (!document.body.contains(thumbnailElement)) {
            checkboxMap.delete(thumbnailElement);
            checkbox.remove();
            return;
        }

        // Ensure the parent is a positioning context
        const computed = window.getComputedStyle(thumbnailElement);
        if (computed.position === 'static') {
            thumbnailElement.style.position = 'relative';
        }

        checkbox.style.display = 'flex';
    }

    // ================== SCANNING ==================

    function scanForVideos() {
        // Use a#thumbnail for classic layouts and a dedicated pass for new lockup view model.
        const selectors = [
            'a#thumbnail',
            'ytd-reel-item-renderer a#thumbnail',
            'ytd-rich-grid-slim-media a#thumbnail',
            'ytd-grid-video-renderer a#thumbnail',
            'ytd-video-renderer a#thumbnail',
            'ytd-compact-video-renderer a#thumbnail'
        ];

        let newCount = 0;

        // Pass 1: New YouTube 2024 lockup model
        document.querySelectorAll('yt-lockup-view-model').forEach(lockup => {
            const anchor = pickLockupThumbnailAnchor(lockup);
            if (!anchor) return;
            const url = anchor.href;
            if (!isValidVideoUrl(url)) return;

            const positioningElement = getMountElementFromAnchor(anchor);
            if (!positioningElement) return;
            if (processedThumbnails.has(positioningElement)) {
                const checkbox = checkboxMap.get(positioningElement);
                if (checkbox) {
                    checkbox.dataset.url = cleanUrl(url);
                    applyCheckboxVisualState(checkbox, selectedUrls.has(checkbox.dataset.url));
                    updateCheckboxPosition(positioningElement, checkbox);
                }
                return;
            }

            const checkbox = createCheckbox(positioningElement, url);
            if (checkbox) newCount++;
        });

        selectors.forEach(selector => {
            const anchors = document.querySelectorAll(selector);

            anchors.forEach(anchor => {
                if (anchor.closest('yt-lockup-view-model')) return;
                const url = anchor.href;
                if (!isValidVideoUrl(url)) return;

                const positioningElement = getMountElementFromAnchor(anchor);
                if (!positioningElement) return;

                // Skip already processed
                if (processedThumbnails.has(positioningElement)) {
                    // Just update position for existing
                    const checkbox = checkboxMap.get(positioningElement);
                    if (checkbox) {
                        checkbox.dataset.url = cleanUrl(url);
                        applyCheckboxVisualState(checkbox, selectedUrls.has(checkbox.dataset.url));
                        updateCheckboxPosition(positioningElement, checkbox);
                    }
                    return;
                }

                const checkbox = createCheckbox(positioningElement, url);
                if (checkbox) newCount++;
            });
        });

        if (newCount > 0) {
            const total = document.querySelectorAll('.yt-notebook-checkbox').length;
            console.log('YT Helper: Created', newCount, 'new checkboxes. Total:', total);
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
        console.log('YT Helper: Message received:', request.action);

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
                    document.querySelectorAll('.yt-notebook-checkbox').forEach(cb => {
                        cb.style.background = BASE_BG;
                        cb.style.borderColor = BORDER_IDLE;
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
                    document.querySelectorAll('.yt-notebook-checkbox').forEach(cb => {
                        const url = cb.dataset.url;
                        if (url && cb.style.display !== 'none') {
                            selectedUrls.add(url);
                            cb.style.background = ACCENT;
                            cb.style.borderColor = ACCENT;
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
            console.error('YT Helper: Error:', error);
            sendResponse({ error: error.message });
        }

        return true;
    });

    // ================== INITIALIZATION ==================

    function init() {
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Periodic scan to catch virtualized updates where nodes are reused
        const periodicScan = setInterval(scanForVideos, 1500);

        // Initial scan
        scanForVideos();

        // Delayed scans for dynamic content
        setTimeout(scanForVideos, 1000);
        setTimeout(scanForVideos, 3000);
        setTimeout(scanForVideos, 5000);

        window.__ytNotebookHelperState = {
            cleanup() {
                observer.disconnect();
                clearInterval(periodicScan);
                document.querySelectorAll('.yt-notebook-checkbox').forEach(cb => cb.remove());
            }
        };

        console.log('YT Helper: Initialized successfully');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
