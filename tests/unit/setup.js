// Test setup - Chrome API mocks
import { vi } from 'vitest';

// Mock chrome.storage.sync
const mockStorage = new Map();

global.chrome = {
  storage: {
    sync: {
      get: vi.fn((keys) => {
        return new Promise((resolve) => {
          if (keys === null || keys === undefined) {
            resolve(Object.fromEntries(mockStorage));
          } else if (Array.isArray(keys)) {
            const result = {};
            for (const key of keys) {
              if (mockStorage.has(key)) {
                result[key] = mockStorage.get(key);
              }
            }
            resolve(result);
          } else if (typeof keys === 'string') {
            const result = {};
            if (mockStorage.has(keys)) {
              result[keys] = mockStorage.get(keys);
            }
            resolve(result);
          } else {
            resolve({});
          }
        });
      }),
      set: vi.fn((items) => {
        return new Promise((resolve) => {
          for (const [key, value] of Object.entries(items)) {
            mockStorage.set(key, value);
          }
          resolve();
        });
      }),
      remove: vi.fn((keys) => {
        return new Promise((resolve) => {
          const keysArray = Array.isArray(keys) ? keys : [keys];
          for (const key of keysArray) {
            mockStorage.delete(key);
          }
          resolve();
        });
      }),
      clear: vi.fn(() => {
        return new Promise((resolve) => {
          mockStorage.clear();
          resolve();
        });
      }),
      getBytesInUse: vi.fn(() => {
        return new Promise((resolve) => {
          resolve(mockStorage.size * 100); // Approximate
        });
      }),
      QUOTA_BYTES: 102400,
    },
    onChanged: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
  },
  runtime: {
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    onInstalled: {
      addListener: vi.fn(),
    },
    sendMessage: vi.fn(),
    openOptionsPage: vi.fn(),
  },
  action: {
    setIcon: vi.fn(() => Promise.resolve()),
    setBadgeText: vi.fn(() => Promise.resolve()),
    setBadgeBackgroundColor: vi.fn(() => Promise.resolve()),
  },
  tabs: {
    query: vi.fn(() => Promise.resolve([])),
    sendMessage: vi.fn(() => Promise.resolve()),
    create: vi.fn(() => Promise.resolve()),
  },
  commands: {
    onCommand: {
      addListener: vi.fn(),
    },
  },
};

// Helper to clear mock storage between tests
export function clearMockStorage() {
  mockStorage.clear();
  vi.clearAllMocks();
}

// Helper to set mock storage values
export function setMockStorage(items) {
  for (const [key, value] of Object.entries(items)) {
    mockStorage.set(key, value);
  }
}

// Helper to get current mock storage
export function getMockStorage() {
  return Object.fromEntries(mockStorage);
}
