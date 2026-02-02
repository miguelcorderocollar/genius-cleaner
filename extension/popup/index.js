// Popup main entry point
import { initSettings } from './settings.js';
import { initActions } from './actions.js';

/**
 * Detect the current page type based on URL
 * @param {string} url - The current tab URL
 * @returns {{ isGenius: boolean, pageType: 'song' | 'album' | 'artist' | 'other' | null }}
 */
function detectPageType(url) {
  if (!url || !url.includes('genius.com')) {
    return { isGenius: false, pageType: null };
  }

  // Song/lyrics pages typically have format: genius.com/Artist-song-name-lyrics
  if (url.match(/genius\.com\/[^/]+-lyrics$/i) || url.includes('-lyrics?')) {
    return { isGenius: true, pageType: 'song' };
  }

  // Album pages: genius.com/albums/Artist/Album-name
  if (url.includes('/albums/')) {
    return { isGenius: true, pageType: 'album' };
  }

  // Artist pages: genius.com/artists/Artist-name
  if (url.includes('/artists/')) {
    return { isGenius: true, pageType: 'artist' };
  }

  // Other Genius pages (home, search, etc.)
  return { isGenius: true, pageType: 'other' };
}

/**
 * Update UI based on current page context
 * @param {{ isGenius: boolean, pageType: string | null }} pageInfo
 */
function updatePageContext(pageInfo) {
  const toggleContainer = document.getElementById('toggle-container');
  const notGeniusSection = document.getElementById('not-genius-section');
  const actionsSection = document.getElementById('actions-section');
  const copyLyricsBtn = document.getElementById('copyLyricsBtn');
  const downloadArtworkBtn = document.getElementById('downloadArtworkBtn');

  if (!pageInfo.isGenius) {
    // Not on Genius - show message and hide toggle
    if (toggleContainer) toggleContainer.classList.add('hidden');
    if (notGeniusSection) notGeniusSection.classList.remove('hidden');
    if (actionsSection) actionsSection.classList.add('hidden');
    return;
  }

  // On Genius - show toggle, hide "not genius" message
  if (toggleContainer) toggleContainer.classList.remove('hidden');
  if (notGeniusSection) notGeniusSection.classList.add('hidden');

  // Show actions section only if there are available actions
  const showLyrics = pageInfo.pageType === 'song';
  const showArtwork = pageInfo.pageType === 'song' || pageInfo.pageType === 'album';

  if (copyLyricsBtn) {
    if (showLyrics) {
      copyLyricsBtn.classList.remove('hidden');
    } else {
      copyLyricsBtn.classList.add('hidden');
    }
  }

  if (downloadArtworkBtn) {
    if (showArtwork) {
      downloadArtworkBtn.classList.remove('hidden');
    } else {
      downloadArtworkBtn.classList.add('hidden');
    }
  }

  // Show actions section if any action is available
  if (actionsSection) {
    if (showLyrics || showArtwork) {
      actionsSection.classList.remove('hidden');
    } else {
      actionsSection.classList.add('hidden');
    }
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Get current tab to detect page type
  let pageInfo = { isGenius: false, pageType: null };

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      pageInfo = detectPageType(tab.url);
    }
  } catch {
    // If we can't get the tab, assume not on Genius
    pageInfo = { isGenius: false, pageType: null };
  }

  // Update UI based on page context
  updatePageContext(pageInfo);

  // Only initialize settings if on Genius
  if (pageInfo.isGenius) {
    await initSettings();
    initActions();
  }

  // Open Genius button (for non-Genius pages)
  const openGeniusBtn = document.getElementById('openGeniusBtn');
  if (openGeniusBtn) {
    openGeniusBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://genius.com' });
    });
  }

  // Open settings button
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }
});
