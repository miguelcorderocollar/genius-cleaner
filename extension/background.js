// Genius Cleaner Background Service Worker
// Handles icon state, keyboard commands, and message passing

import { getSettings, saveSetting, onSettingsChange } from './shared/storage.js';

// Icon paths
const ICONS = {
  enabled: {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  },
  disabled: {
    16: 'icons/icon16-disabled.png',
    48: 'icons/icon48-disabled.png',
    128: 'icons/icon128-disabled.png',
  },
};

/**
 * Update the extension icon based on enabled state
 * @param {boolean} enabled - Whether the extension is enabled
 */
async function updateIcon(enabled) {
  try {
    const icons = enabled ? ICONS.enabled : ICONS.disabled;
    await chrome.action.setIcon({ path: icons });

    // Update badge
    if (!enabled) {
      await chrome.action.setBadgeText({ text: 'OFF' });
      await chrome.action.setBadgeBackgroundColor({ color: '#6b7280' });
    } else {
      await chrome.action.setBadgeText({ text: '' });
    }
  } catch (error) {
    console.error('Failed to update icon:', error);
  }
}

/**
 * Toggle the global enabled state
 * @returns {Promise<boolean>} New enabled state
 */
async function toggleEnabled() {
  const settings = await getSettings(['globalEnabled']);
  const newState = !settings.globalEnabled;

  await saveSetting('globalEnabled', newState);
  await updateIcon(newState);

  // Notify all Genius tabs to refresh
  const tabs = await chrome.tabs.query({ url: '*://*.genius.com/*' });
  for (const tab of tabs) {
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'refresh' });
    } catch (e) {
      // Tab might not have content script loaded
    }
  }

  return newState;
}

/**
 * Initialize the background service worker
 */
async function init() {
  // Set initial icon state
  const settings = await getSettings(['globalEnabled']);
  await updateIcon(settings.globalEnabled);

  // Listen for storage changes to update icon
  onSettingsChange((changes) => {
    if (changes.globalEnabled) {
      updateIcon(changes.globalEnabled.newValue ?? true);
    }
  });

  console.log('Genius Cleaner background script initialized');
}

// Handle extension install/update
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // First install - open options page
    chrome.tabs.create({ url: 'options.html' });
  }

  await init();
});

// Handle keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-cleaner') {
    await toggleEnabled();
  }
});

// Handle messages from popup/content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggle') {
    toggleEnabled().then((newState) => {
      sendResponse({ enabled: newState });
    });
    return true; // Async response
  }

  if (message.action === 'getStatus') {
    getSettings(['globalEnabled']).then((settings) => {
      sendResponse({ enabled: settings.globalEnabled });
    });
    return true; // Async response
  }
});

// Initialize on service worker start
init();
