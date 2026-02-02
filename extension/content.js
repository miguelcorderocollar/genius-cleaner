// Genius Cleaner Content Script
// Applies CSS classes based on user settings to hide/show page elements

import { getSettings, onSettingsChange } from './shared/storage.js';
import { DEFAULTS } from './shared/defaults.js';

// CSS class prefix for our styles
const CLASS_PREFIX = 'gc-hide-';

// Mapping of settings to CSS classes
const SETTING_TO_CLASS = {
  hideAds: 'ads',
  hideNavigation: 'nav',
  hideFooter: 'footer',
  hideStickyElements: 'sticky',
  hideRecommendedSongs: 'recommended',
  hideQASection: 'qa',
  hideAboutSection: 'about',
  hideAlbumTracklist: 'tracklist',
  hidePyongButton: 'pyong',
  hideAnnotationHighlights: 'annotations',
  hideCreditsSection: 'credits',
  hideOtherAlbums: 'other-albums',
  hideAlbumSidebar: 'album-sidebar',
  hideArtistSidebar: 'artist-sidebar',
  hideArtistSocialLinks: 'social-links',
  wideContent: 'wide',
  cleanerTypography: 'typography',
};

/**
 * Apply settings by adding/removing CSS classes on the document body
 * @param {object} settings - Current settings object
 */
function applySettings(settings) {
  const body = document.body;

  if (!body) {
    // Body not ready yet, wait for it
    return;
  }

  // Check if globally enabled
  if (!settings.globalEnabled) {
    // Remove all our classes and the enabled marker
    body.classList.remove('genius-cleaner-enabled');
    for (const className of Object.values(SETTING_TO_CLASS)) {
      body.classList.remove(CLASS_PREFIX + className);
    }
    return;
  }

  // Add enabled marker
  body.classList.add('genius-cleaner-enabled');

  // Apply each setting
  for (const [setting, className] of Object.entries(SETTING_TO_CLASS)) {
    const fullClassName = CLASS_PREFIX + className;
    const shouldHide = settings[setting];

    // For 'wide' and 'typography', the setting enables the class
    // For 'hide*' settings, true means add the hide class
    if (shouldHide) {
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

    // Apply settings immediately
    applySettings(settings);

    // Listen for setting changes
    onSettingsChange((changes) => {
      // Rebuild settings from changes
      const newSettings = { ...settings };
      for (const [key, { newValue }] of Object.entries(changes)) {
        if (key in DEFAULTS) {
          newSettings[key] = newValue !== undefined ? newValue : DEFAULTS[key];
        }
      }
      applySettings(newSettings);
    });

    // Re-apply when body is ready (in case we ran too early)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        applySettings(settings);
      });
    }

    // Listen for messages from popup/background
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === 'getStatus') {
        sendResponse({ enabled: settings.globalEnabled });
      } else if (message.action === 'toggle') {
        settings.globalEnabled = !settings.globalEnabled;
        applySettings(settings);
        sendResponse({ enabled: settings.globalEnabled });
      } else if (message.action === 'refresh') {
        // Reload settings and reapply
        getSettings().then((newSettings) => {
          Object.assign(settings, newSettings);
          applySettings(settings);
          sendResponse({ success: true });
        });
        return true; // Async response
      }
    });

    console.log('Genius Cleaner initialized');
  } catch (error) {
    console.error('Genius Cleaner initialization failed:', error);
  }
}

// Start initialization
init();
