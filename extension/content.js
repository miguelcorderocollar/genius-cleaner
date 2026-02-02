// Genius Cleaner Content Script
// Applies CSS classes based on user settings to hide/show page elements

import { getSettings, onSettingsChange } from './shared/storage.js';
import { DEFAULTS, PAGE_TYPES, settingAppliesToPage } from './shared/defaults.js';

// CSS class prefix for our styles
const CLASS_PREFIX = 'gc-hide-';

// Page type class prefix
const PAGE_TYPE_CLASS_PREFIX = 'gc-page-';

/**
 * Detect the current page type based on URL
 * @returns {string} - One of PAGE_TYPES values
 */
function detectPageType() {
  const path = window.location.pathname;

  // Lyrics pages end with "-lyrics" (e.g., /Mata-bede-prezydentem-lyrics)
  if (path.endsWith('-lyrics')) {
    return PAGE_TYPES.LYRICS;
  }

  // Artist pages start with /artists/ (e.g., /artists/Mata)
  if (path.startsWith('/artists/')) {
    return PAGE_TYPES.ARTIST;
  }

  // Album pages start with /albums/ (e.g., /albums/Mata/Mata2040)
  if (path.startsWith('/albums/')) {
    return PAGE_TYPES.ALBUM;
  }

  return PAGE_TYPES.OTHER;
}

// Mapping of settings to CSS classes
const SETTING_TO_CLASS = {
  hideAds: 'ads',
  hideNavigation: 'nav',
  simplifyNavigation: 'simplify-nav',
  hideFooter: 'footer',
  hideStickyElements: 'sticky',
  hideBreadcrumbs: 'breadcrumbs',
  hideFollowButton: 'follow-button',
  hideLyricsSidebar: 'lyrics-sidebar',
  hideLyricsEditForm: 'lyrics-edit',
  hideQASection: 'qa',
  hideAboutSection: 'about',
  hideAlbumTracklist: 'tracklist',
  hidePyongButton: 'pyong',
  hideAnnotationHighlights: 'annotations',
  hideCreditsSection: 'credits',
  hideComments: 'comments',
  hideShareButtons: 'share-buttons',
  hideContributors: 'contributors',
  hideOtherAlbums: 'other-albums',
  hideAlbumSidebar: 'album-sidebar',
  hideAlbumLeaderboard: 'album-leaderboard',
  hideArtistSidebar: 'artist-sidebar',
  hideArtistSocialLinks: 'social-links',
  hideArtistVideoPlayer: 'artist-video',
  hideArtistLeaderboard: 'artist-leaderboard',
  hideArtistMetadataQuestions: 'artist-questions',
  hideArtistContributions: 'artist-contributions',
  hideArtistProfileTabs: 'artist-tabs',
  wideContent: 'wide',
  cleanerTypography: 'typography',
};

/**
 * Extract lyrics text from the page
 * @returns {{ success: boolean, lyrics?: string, error?: string }}
 */
function extractLyrics() {
  try {
    // Find lyrics containers - Genius uses data-lyrics-container attribute
    const lyricsContainers = document.querySelectorAll('[data-lyrics-container="true"]');

    if (lyricsContainers.length === 0) {
      // Try alternative selectors for older page layouts
      const altContainer = document.querySelector('[class*="Lyrics__Container"]');
      if (!altContainer) {
        return { success: false, error: 'No lyrics found on this page' };
      }
      const text = altContainer.innerText.trim();
      if (!text) {
        return { success: false, error: 'Lyrics container is empty' };
      }
      return { success: true, lyrics: text };
    }

    // Combine text from all lyrics containers
    let lyricsText = '';
    for (const container of lyricsContainers) {
      const text = container.innerText.trim();
      if (text) {
        lyricsText += (lyricsText ? '\n\n' : '') + text;
      }
    }

    if (!lyricsText) {
      return { success: false, error: 'No lyrics text found' };
    }

    // Get song title and artist for header
    const titleEl = document.querySelector(
      '[class*="SongHeader"][class*="Title"] span, h1[class*="Title"]'
    );
    const artistEl = document.querySelector(
      '[class*="SongHeader"][class*="Artist"] a, [class*="HeaderArtistAndTracklistdesktop"] a'
    );

    let header = '';
    if (titleEl || artistEl) {
      const title = titleEl?.innerText?.trim() || '';
      const artist = artistEl?.innerText?.trim() || '';
      if (title && artist) {
        header = `${title} - ${artist}\n\n`;
      } else if (title) {
        header = `${title}\n\n`;
      }
    }

    return { success: true, lyrics: header + lyricsText };
  } catch (error) {
    console.error('Error extracting lyrics:', error);
    return { success: false, error: 'Failed to extract lyrics' };
  }
}

/**
 * Extract artwork URL from the page
 * @returns {{ success: boolean, artworkUrl?: string, filename?: string, error?: string }}
 */
function extractArtwork() {
  try {
    // Try song page cover art first
    let artworkImg = document.querySelector('[class*="SongHeader"][class*="CoverArt"] img[src]');

    // Try album page cover art
    if (!artworkImg) {
      artworkImg = document.querySelector(
        '[class*="album_cover"] img[src], .cover_art img[src], [class*="CoverArt"] img[src]'
      );
    }

    // Try artist page image
    if (!artworkImg) {
      artworkImg = document.querySelector(
        '[class*="ProfileHeader"] img[src], .profile_header img[src]'
      );
    }

    if (!artworkImg) {
      return { success: false, error: 'No artwork found on this page' };
    }

    let artworkUrl = artworkImg.src;

    // Genius uses a transform service - try to get the original high-res image
    // URL format: https://t2.genius.com/unsafe/WxH/https%3A%2F%2Fimages.genius.com%2F...
    const transformMatch = artworkUrl.match(/genius\.com\/unsafe\/\d+x\d+\/(https?%3A.+)/i);
    if (transformMatch) {
      // Decode the original URL and get full resolution
      artworkUrl = decodeURIComponent(transformMatch[1]);
    }

    // Generate filename from page title or use default
    let filename = 'artwork';
    const titleEl = document.querySelector(
      '[class*="SongHeader"][class*="Title"] span, h1[class*="Title"], title'
    );
    if (titleEl) {
      // Clean up the title for use as filename
      filename =
        (titleEl.innerText || titleEl.textContent || '')
          .replace(/\s*[-|]\s*Genius.*$/i, '') // Remove "- Genius" suffix
          .replace(/\s*Lyrics$/i, '') // Remove "Lyrics" suffix
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '_') // Replace spaces with underscores
          .substring(0, 100) // Limit length
          .trim() || 'artwork';
    }

    // Determine file extension from URL
    const extMatch = artworkUrl.match(/\.(png|jpg|jpeg|webp|gif)/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
    filename = `${filename}.${ext}`;

    return { success: true, artworkUrl, filename };
  } catch (error) {
    console.error('Error extracting artwork:', error);
    return { success: false, error: 'Failed to extract artwork' };
  }
}

/**
 * Apply settings by adding/removing CSS classes on the document body
 * @param {object} settings - Current settings object
 * @param {string} [pageType] - Optional page type override (defaults to detecting from URL)
 */
function applySettings(settings, pageType) {
  const body = document.body;

  if (!body) {
    // Body not ready yet, wait for it
    return;
  }

  // Detect page type if not provided
  const currentPageType = pageType || detectPageType();

  // Check if globally enabled
  if (!settings.globalEnabled) {
    // Remove all our classes and the enabled marker
    body.classList.remove('genius-cleaner-enabled');
    // Remove page type classes
    for (const type of Object.values(PAGE_TYPES)) {
      body.classList.remove(PAGE_TYPE_CLASS_PREFIX + type);
    }
    for (const className of Object.values(SETTING_TO_CLASS)) {
      body.classList.remove(CLASS_PREFIX + className);
    }
    return;
  }

  // Add enabled marker
  body.classList.add('genius-cleaner-enabled');

  // Add page type class (remove others first)
  for (const type of Object.values(PAGE_TYPES)) {
    body.classList.remove(PAGE_TYPE_CLASS_PREFIX + type);
  }
  body.classList.add(PAGE_TYPE_CLASS_PREFIX + currentPageType);

  // Check if "Hide All" mode is enabled
  const hideAllMode = settings.hideAll === true;

  // Apply each setting (only if it applies to the current page type)
  for (const [setting, className] of Object.entries(SETTING_TO_CLASS)) {
    const fullClassName = CLASS_PREFIX + className;

    // In "Hide All" mode, apply all hide settings that apply to this page type
    // Otherwise, use the individual setting value
    const settingValue = hideAllMode ? true : settings[setting];
    const shouldApply = settingValue && settingAppliesToPage(setting, currentPageType);

    if (shouldApply) {
      body.classList.add(fullClassName);
    } else {
      body.classList.remove(fullClassName);
    }
  }
}

/**
 * Initialize the content script
 */
async function init() {
  try {
    // Get current settings
    const settings = await getSettings();

    // Track current page type
    let currentPageType = detectPageType();

    // Apply settings immediately
    applySettings(settings, currentPageType);

    // Listen for setting changes
    onSettingsChange((changes) => {
      // Rebuild settings from changes
      const newSettings = { ...settings };
      for (const [key, { newValue }] of Object.entries(changes)) {
        if (key in DEFAULTS) {
          newSettings[key] = newValue !== undefined ? newValue : DEFAULTS[key];
        }
      }
      Object.assign(settings, newSettings);
      applySettings(settings, currentPageType);
    });

    // Re-apply when body is ready (in case we ran too early)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        applySettings(settings, currentPageType);
      });
    }

    // Handle URL changes (Genius uses client-side navigation)
    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', () => {
      currentPageType = detectPageType();
      applySettings(settings, currentPageType);
    });

    // Observe for URL changes via pushState/replaceState
    let lastUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        currentPageType = detectPageType();
        applySettings(settings, currentPageType);
      }
    });
    urlObserver.observe(document.body, { childList: true, subtree: true });

    // Listen for messages from popup/background
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === 'getStatus') {
        sendResponse({ enabled: settings.globalEnabled, pageType: currentPageType });
      } else if (message.action === 'toggle') {
        settings.globalEnabled = !settings.globalEnabled;
        applySettings(settings, currentPageType);
        sendResponse({ enabled: settings.globalEnabled });
      } else if (message.action === 'refresh') {
        // Reload settings and reapply
        getSettings().then((newSettings) => {
          Object.assign(settings, newSettings);
          currentPageType = detectPageType();
          applySettings(settings, currentPageType);
          sendResponse({ success: true });
        });
        return true; // Async response
      } else if (message.action === 'getLyrics') {
        const result = extractLyrics();
        sendResponse(result);
      } else if (message.action === 'getArtwork') {
        const result = extractArtwork();
        sendResponse(result);
      }
    });

    console.log('Genius Cleaner initialized on', currentPageType, 'page');
  } catch (error) {
    console.error('Genius Cleaner initialization failed:', error);
  }
}

// Start initialization
init();
