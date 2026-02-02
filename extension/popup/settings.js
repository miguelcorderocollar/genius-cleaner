// Popup settings management
import { getSettings, saveSetting, onSettingsChange } from '../shared/storage.js';

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

  // Update status bar (only shown when disabled)
  const statusBar = document.getElementById('status-bar');
  if (statusBar) {
    if (settings.globalEnabled) {
      statusBar.classList.add('hidden');
    } else {
      statusBar.classList.remove('hidden');
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
    } catch {
      // Tab might not have content script loaded
    }
  }
}

/**
 * Initialize popup settings
 */
export async function initSettings() {
  // Load current settings
  const settings = await getSettings(['globalEnabled']);
  updateUI(settings);

  // Bind global toggle
  const globalToggle = document.getElementById('globalEnabled');
  if (globalToggle) {
    globalToggle.addEventListener('change', async (e) => {
      await handleSettingChange('globalEnabled', e.target.checked);
      const newSettings = await getSettings(['globalEnabled']);
      updateUI(newSettings);
    });
  }

  // Listen for external changes
  onSettingsChange(async () => {
    const newSettings = await getSettings(['globalEnabled']);
    updateUI(newSettings);
  });
}
