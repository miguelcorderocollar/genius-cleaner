import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clearMockStorage, setMockStorage, getMockStorage } from '../setup.js';
import {
  getSettings,
  saveSetting,
  saveSettings,
  resetSettings,
  exportSettings,
  importSettings,
  getStorageUsage,
} from '../../../extension/shared/storage.js';
import { DEFAULTS } from '../../../extension/shared/defaults.js';

describe('storage.js', () => {
  beforeEach(() => {
    clearMockStorage();
  });

  describe('getSettings', () => {
    it('should return defaults when storage is empty', async () => {
      const settings = await getSettings();
      expect(settings.globalEnabled).toBe(DEFAULTS.globalEnabled);
      expect(settings.hideAds).toBe(DEFAULTS.hideAds);
    });

    it('should return stored values when available', async () => {
      setMockStorage({ hideAds: false });
      const settings = await getSettings(['hideAds']);
      expect(settings.hideAds).toBe(false);
    });

    it('should merge stored values with defaults', async () => {
      setMockStorage({ hideAds: false });
      const settings = await getSettings(['hideAds', 'globalEnabled']);
      expect(settings.hideAds).toBe(false);
      expect(settings.globalEnabled).toBe(DEFAULTS.globalEnabled);
    });

    it('should get specific keys when provided as array', async () => {
      const settings = await getSettings(['hideAds', 'hideFooter']);
      expect(settings).toHaveProperty('hideAds');
      expect(settings).toHaveProperty('hideFooter');
      expect(settings).not.toHaveProperty('wideContent');
    });

    it('should get specific key when provided as string', async () => {
      const settings = await getSettings('hideAds');
      expect(settings).toHaveProperty('hideAds');
    });
  });

  describe('saveSetting', () => {
    it('should save a setting to storage', async () => {
      const result = await saveSetting('hideAds', false);
      expect(result).toBe(true);
      expect(chrome.storage.sync.set).toHaveBeenCalled();
    });

    it('should remove setting if value matches default', async () => {
      setMockStorage({ hideAds: false });
      await saveSetting('hideAds', true); // true is the default
      expect(chrome.storage.sync.remove).toHaveBeenCalledWith('hideAds');
    });

    it('should store value if different from default', async () => {
      await saveSetting('hideAds', false);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({ hideAds: false });
    });
  });

  describe('saveSettings', () => {
    it('should save multiple settings at once', async () => {
      const result = await saveSettings({
        hideAds: false,
        hideFooter: false,
      });
      expect(result).toBe(true);
    });

    it('should remove settings that match defaults', async () => {
      await saveSettings({
        hideAds: true, // matches default
        hideFooter: false, // does not match default
      });
      expect(chrome.storage.sync.remove).toHaveBeenCalled();
      expect(chrome.storage.sync.set).toHaveBeenCalled();
    });
  });

  describe('resetSettings', () => {
    it('should clear all storage', async () => {
      setMockStorage({ hideAds: false, hideFooter: false });
      const result = await resetSettings();
      expect(result).toBe(true);
      expect(chrome.storage.sync.clear).toHaveBeenCalled();
    });
  });

  describe('exportSettings', () => {
    it('should export all settings with defaults', async () => {
      const settings = await exportSettings();
      expect(settings).toHaveProperty('globalEnabled');
      expect(settings).toHaveProperty('hideAds');
    });
  });

  describe('importSettings', () => {
    it('should import valid settings', async () => {
      const result = await importSettings({
        hideAds: false,
        hideFooter: false,
      });
      expect(result.success).toBe(true);
      expect(result.imported).toBe(2);
      expect(result.skipped).toBe(0);
    });

    it('should skip invalid settings', async () => {
      const result = await importSettings({
        hideAds: false,
        invalidKey: true,
        anotherInvalid: 'string',
      });
      expect(result.imported).toBe(1);
      expect(result.skipped).toBe(2);
    });

    it('should validate types', async () => {
      const result = await importSettings({
        hideAds: 'not a boolean', // wrong type
      });
      expect(result.imported).toBe(0);
      expect(result.skipped).toBe(1);
    });
  });

  describe('getStorageUsage', () => {
    it('should return storage usage info', async () => {
      const usage = await getStorageUsage();
      expect(usage).toHaveProperty('bytesUsed');
      expect(usage).toHaveProperty('bytesTotal');
      expect(usage).toHaveProperty('percentage');
      expect(typeof usage.percentage).toBe('number');
    });
  });
});
