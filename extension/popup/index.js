// Popup main entry point
import { initSettings } from './settings.js';

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  await initSettings();

  // Open settings button
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }
});
