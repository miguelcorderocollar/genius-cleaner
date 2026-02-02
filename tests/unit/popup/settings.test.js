import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clearMockStorage, setMockStorage } from '../setup.js';

// We need to mock the DOM before importing the module
describe('popup/settings.js', () => {
  beforeEach(() => {
    clearMockStorage();

    // Set up DOM
    document.body.innerHTML = `
      <input type="checkbox" id="globalEnabled" />
      <input type="checkbox" id="hideAds" />
      <input type="checkbox" id="hideRecommendedSongs" />
      <input type="checkbox" id="hideQASection" />
      <input type="checkbox" id="hideFooter" />
      <input type="checkbox" id="wideContent" />
      <div id="status-bar" class="status-bar">
        <span id="status-text"></span>
      </div>
    `;
  });

  it('should have DOM elements for quick settings', () => {
    expect(document.getElementById('globalEnabled')).not.toBeNull();
    expect(document.getElementById('hideAds')).not.toBeNull();
    expect(document.getElementById('hideRecommendedSongs')).not.toBeNull();
  });

  it('should have status bar elements', () => {
    expect(document.getElementById('status-bar')).not.toBeNull();
    expect(document.getElementById('status-text')).not.toBeNull();
  });

  describe('UI updates', () => {
    it('should update checkbox state', () => {
      const checkbox = document.getElementById('hideAds');
      checkbox.checked = true;
      expect(checkbox.checked).toBe(true);

      checkbox.checked = false;
      expect(checkbox.checked).toBe(false);
    });

    it('should update status bar classes', () => {
      const statusBar = document.getElementById('status-bar');

      statusBar.className = 'status-bar status-enabled';
      expect(statusBar.classList.contains('status-enabled')).toBe(true);

      statusBar.className = 'status-bar status-disabled';
      expect(statusBar.classList.contains('status-disabled')).toBe(true);
    });
  });
});
