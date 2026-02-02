// Popup settings management
import { getSettings, saveSetting, onSettingsChange } from '../shared/storage.js';

// Quick settings shown in popup
const QUICK_SETTINGS = [
  'globalEnabled',
  'hideAds',
  'hideRecommendedSongs',
  'hideQASection',
  'hideFooter',
  'wideContent',
];

/**
 * Update the UI based on current settings
 * @param {object} settings - Current settings
 */
function updateUI(settings) {
  // Update global enabled state
  const globalToggle = document.getElementById('globalEnabled');
  if (globalToggle) {
    globalToggle.checked = settings.globalEnabled;
  }

  // Update status bar
  const statusBar = document.getElementById('status-bar');
  const statusText = document.getElementById('status-text');
  if (statusBar && statusText) {
    if (settings.globalEnabled) {
      statusBar.className = 'status-bar status-enabled';
      statusText.textContent = 'Active on Genius.com';
      document.body.classList.remove('disabled');
    } else {
      statusBar.className = 'status-bar status-disabled';
      statusText.textContent = 'Disabled';
      document.body.classList.add('disabled');
    }
  }

  // Update quick settings checkboxes
  for (const key of QUICK_SETTINGS) {
    if (key === 'globalEnabled') continue;
    const checkbox = document.getElementById(key);
    if (checkbox) {
      checkbox.checked = settings[key];
    }
  }
}

/**
 * Handle setting change
 * @param {string} key - Setting key
 * @param {boolean} value - New value
 */
async function handleSettingChange(key, value) {
  await saveSetting(key, value);

  // Notify content scripts to refresh
  const tabs = await chrome.tabs.query({ url: '*://*.genius.com/*' });
  for (const tab of tabs) {
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'refresh' });
    } catch (e) {
      // Tab might not have content script loaded
    }
  }
}

/**
 * Initialize popup settings
 */
export async function initSettings() {
  // Load current settings
  const settings = await getSettings(QUICK_SETTINGS);
  updateUI(settings);

  // Bind global toggle
  const globalToggle = document.getElementById('globalEnabled');
  if (globalToggle) {
    globalToggle.addEventListener('change', async (e) => {
      await handleSettingChange('globalEnabled', e.target.checked);
      const newSettings = await getSettings(QUICK_SETTINGS);
      updateUI(newSettings);
    });
  }

  // Bind quick settings checkboxes
  for (const key of QUICK_SETTINGS) {
    if (key === 'globalEnabled') continue;
    const checkbox = document.getElementById(key);
    if (checkbox) {
      checkbox.addEventListener('change', async (e) => {
        await handleSettingChange(key, e.target.checked);
      });
    }
  }

  // Listen for external changes
  onSettingsChange(async () => {
    const newSettings = await getSettings(QUICK_SETTINGS);
    updateUI(newSettings);
  });
}
