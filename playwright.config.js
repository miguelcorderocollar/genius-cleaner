import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Use 1 worker in CI for stability, 2 workers locally for speed
  workers: process.env.CI ? 1 : 2,
  reporter: process.env.CI ? 'html' : 'list',
  // Timeout for loading local HTML files
  timeout: 30000,
  expect: {
    timeout: 10000,
  },

  use: {
    trace: 'on-first-retry',
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});
