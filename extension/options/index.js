// Options page main entry point
import { initSettings } from './settings.js';

// Initialize options page when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  await initSettings();
});
