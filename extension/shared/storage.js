// Storage utilities for chrome.storage.sync
// Follows ExtractMD patterns with space optimization

import { DEFAULTS, SETTING_SCHEMA } from './defaults.js';

/**
 * Get settings from storage with defaults applied
 * @param {string|string[]|null} keys - Specific keys to get, or null for all
 * @returns {Promise<object>} Settings object with defaults applied
 */
export async function getSettings(keys = null) {
  const keysToGet = keys ? (Array.isArray(keys) ? keys : [keys]) : Object.keys(DEFAULTS);

  // Build default values for requested keys
  const defaultsForKeys = {};
  for (const key of keysToGet) {
    if (key in DEFAULTS) {
      defaultsForKeys[key] = DEFAULTS[key];
    }
  }

  try {
    const stored = await chrome.storage.sync.get(keysToGet);

    // Merge with defaults
    const result = { ...defaultsForKeys };
    for (const key of keysToGet) {
      if (key in stored) {
        result[key] = stored[key];
      }
    }

    return result;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return defaultsForKeys;
  }
}

/**
 * Save a single setting to storage
 * Optimizes storage by removing values that match defaults
 * @param {string} key - Setting key
 * @param {*} value - Setting value
 * @returns {Promise<boolean>} Success status
 */
export async function saveSetting(key, value) {
  try {
    // If value matches default, remove from storage to save space
    if (key in DEFAULTS && value === DEFAULTS[key]) {
      await chrome.storage.sync.remove(key);
    } else {
      await chrome.storage.sync.set({ [key]: value });
    }
    return true;
  } catch (error) {
    console.error('Failed to save setting:', error);
    return false;
  }
}

/**
 * Save multiple settings at once
 * @param {object} settings - Object with key-value pairs
 * @returns {Promise<boolean>} Success status
 */
export async function saveSettings(settings) {
  try {
    const toSet = {};
    const toRemove = [];

    for (const [key, value] of Object.entries(settings)) {
      if (key in DEFAULTS && value === DEFAULTS[key]) {
        toRemove.push(key);
      } else {
        toSet[key] = value;
      }
    }

    // Batch operations
    const operations = [];
    if (Object.keys(toSet).length > 0) {
      operations.push(chrome.storage.sync.set(toSet));
    }
    if (toRemove.length > 0) {
      operations.push(chrome.storage.sync.remove(toRemove));
    }

    await Promise.all(operations);
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
}

/**
 * Reset all settings to defaults
 * @returns {Promise<boolean>} Success status
 */
export async function resetSettings() {
  try {
    await chrome.storage.sync.clear();
    return true;
  } catch (error) {
    console.error('Failed to reset settings:', error);
    return false;
  }
}

/**
 * Export all settings for backup
 * @returns {Promise<object>} All settings
 */
export async function exportSettings() {
  return await getSettings();
}

/**
 * Import settings from backup
 * @param {object} settings - Settings to import
 * @returns {Promise<{success: boolean, imported: number, skipped: number}>}
 */
export async function importSettings(settings) {
  let imported = 0;
  let skipped = 0;

  const validSettings = {};

  for (const [key, value] of Object.entries(settings)) {
    if (key in SETTING_SCHEMA) {
      const expectedType = SETTING_SCHEMA[key];
      if (typeof value === expectedType) {
        validSettings[key] = value;
        imported++;
      } else {
        skipped++;
      }
    } else {
      skipped++;
    }
  }

  const success = await saveSettings(validSettings);
  return { success, imported, skipped };
}

/**
 * Listen for storage changes
 * @param {function} callback - Called with (changes, areaName)
 * @returns {function} Unsubscribe function
 */
export function onSettingsChange(callback) {
  const listener = (changes, areaName) => {
    if (areaName === 'sync') {
      callback(changes);
    }
  };

  chrome.storage.onChanged.addListener(listener);

  // Return unsubscribe function
  return () => {
    chrome.storage.onChanged.removeListener(listener);
  };
}

/**
 * Get storage usage info
 * @returns {Promise<{bytesUsed: number, bytesTotal: number, percentage: number}>}
 */
export async function getStorageUsage() {
  try {
    const bytesUsed = await chrome.storage.sync.getBytesInUse();
    const bytesTotal = chrome.storage.sync.QUOTA_BYTES || 102400; // 100KB default
    const percentage = Math.round((bytesUsed / bytesTotal) * 100);

    return { bytesUsed, bytesTotal, percentage };
  } catch (error) {
    console.error('Failed to get storage usage:', error);
    return { bytesUsed: 0, bytesTotal: 102400, percentage: 0 };
  }
}
