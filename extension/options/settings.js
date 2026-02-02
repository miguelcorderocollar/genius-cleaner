// Options page settings management
import { getSettings, saveSetting, resetSettings, onSettingsChange } from '../shared/storage.js';
import { DEFAULTS, SETTING_LABELS } from '../shared/defaults.js';

// All settings keys
const ALL_SETTINGS = Object.keys(DEFAULTS);

/**
 * Update the UI based on current settings
 * @param {object} settings - Current settings
 */
function updateUI(settings) {
  // Update all checkboxes
  for (const key of ALL_SETTINGS) {
    const checkbox = document.getElementById(key);
    if (checkbox) {
      checkbox.checked = settings[key];
    }
  }

  // Update disabled state based on global toggle
  if (settings.globalEnabled) {
    document.body.classList.remove('disabled');
  } else {
    document.body.classList.add('disabled');
  }
}

/**
 * Handle setting change
 * @param {string} key - Setting key
 * @param {boolean} value - New value
 */
async function handleSettingChange(key, value) {
  await saveSetting(key, value);

  // Update disabled state if global toggle changed
  if (key === 'globalEnabled') {
    if (value) {
      document.body.classList.remove('disabled');
    } else {
      document.body.classList.add('disabled');
    }
  }

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
 * Handle reset to defaults
 */
async function handleReset() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    await resetSettings();
    const settings = await getSettings();
    updateUI(settings);

    // Notify content scripts
    const tabs = await chrome.tabs.query({ url: '*://*.genius.com/*' });
    for (const tab of tabs) {
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'refresh' });
      } catch (e) {
        // Tab might not have content script loaded
      }
    }
  }
}

/**
 * Initialize options page settings
 */
export async function initSettings() {
  // Load current settings
  const settings = await getSettings();
  updateUI(settings);

  // Bind all checkboxes
  for (const key of ALL_SETTINGS) {
    const checkbox = document.getElementById(key);
    if (checkbox) {
      checkbox.addEventListener('change', async (e) => {
        await handleSettingChange(key, e.target.checked);
      });
    }
  }

  // Bind reset button
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', handleReset);
  }

  // Listen for external changes
  onSettingsChange(async () => {
    const newSettings = await getSettings();
    updateUI(newSettings);
  });
}
