/**
 * CSS Test Utilities for Playwright
 *
 * Helper functions to inject the cleaner CSS and test visibility of elements
 * using local example HTML files (saved from real Genius pages).
 *
 * We use local files instead of live pages because Genius.com uses Cloudflare
 * bot protection which blocks headless browsers.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const CSS_PATH = path.join(PROJECT_ROOT, 'extension/styles/cleaner.css');
const EXAMPLES_PATH = path.join(PROJECT_ROOT, 'examples');

/**
 * Example HTML files for testing different page types
 * These are saved copies of real Genius pages
 */
export const TEST_PAGES = {
  // Lyrics page - has nav, recommended songs, about section, lyrics container, etc.
  lyrics: 'song-lyrics.html',
  // Alternative lyrics page
  lyrics2: 'song-lyrics2.html',
  // Album page - has nav, tracklist, album sidebar, other albums section
  album: 'album.html',
  // Artist page - has nav, artist sidebar, social links
  artist: 'artist.html',
  // Alternative artist page
  artist2: 'artist2.html',
};

/**
 * Get the file:// URL for an example HTML file
 * @param {string} filename - The example file name
 * @returns {string} file:// URL
 */
export function getExampleUrl(filename) {
  return `file://${path.join(EXAMPLES_PATH, filename)}`;
}

/**
 * Read the cleaner CSS file contents
 * @returns {string} CSS file contents
 */
export function getCleanerCSS() {
  return fs.readFileSync(CSS_PATH, 'utf-8');
}

/**
 * Inject the cleaner.css into the page
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function injectCleanerCSS(page) {
  const css = getCleanerCSS();
  await page.addStyleTag({ content: css });
}

/**
 * Enable Genius Cleaner by adding the required class to body
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function enableGeniusCleaner(page) {
  await page.evaluate(() => {
    document.body.classList.add('genius-cleaner-enabled');
  });
}

/**
 * Disable Genius Cleaner by removing the enabled class from body
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function disableGeniusCleaner(page) {
  await page.evaluate(() => {
    document.body.classList.remove('genius-cleaner-enabled');
  });
}

/**
 * Apply a hide class to the body
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} className - The class to add (e.g., 'gc-hide-ads')
 */
export async function applyHideClass(page, className) {
  await page.evaluate((cls) => {
    document.body.classList.add(cls);
  }, className);
}

/**
 * Remove a hide class from the body
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} className - The class to remove (e.g., 'gc-hide-ads')
 */
export async function removeHideClass(page, className) {
  await page.evaluate((cls) => {
    document.body.classList.remove(cls);
  }, className);
}

/**
 * Check if an element is hidden (display: none)
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - CSS selector for the element
 * @returns {Promise<boolean>} True if element has display: none
 */
export async function isElementHidden(page, selector) {
  const element = page.locator(selector).first();
  const count = await element.count();
  if (count === 0) {
    return false; // Element doesn't exist
  }
  const display = await element.evaluate((el) => {
    return window.getComputedStyle(el).display;
  });
  return display === 'none';
}

/**
 * Get computed style property of an element
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - CSS selector for the element
 * @param {string} property - CSS property name
 * @returns {Promise<string>} The computed style value
 */
export async function getComputedStyle(page, selector, property) {
  const element = page.locator(selector).first();
  return await element.evaluate((el, prop) => {
    return window.getComputedStyle(el)[prop];
  }, property);
}

/**
 * Setup helper that loads an example HTML page and injects CSS
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} pageType - The page type: 'lyrics', 'lyrics2', 'album', 'artist', 'artist2'
 * @param {Object} options - Setup options
 * @param {boolean} options.enableCleaner - Whether to enable the cleaner (default: true)
 */
export async function setupPage(page, pageType, options = {}) {
  const { enableCleaner = true } = options;

  const filename = TEST_PAGES[pageType];
  if (!filename) {
    throw new Error(
      `Unknown page type: ${pageType}. Use 'lyrics', 'lyrics2', 'album', 'artist', or 'artist2'`
    );
  }

  const url = getExampleUrl(filename);

  // Navigate to local example file
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await injectCleanerCSS(page);

  if (enableCleaner) {
    await enableGeniusCleaner(page);
  }
}

/**
 * Mapping of settings to their CSS classes
 */
export const SETTING_TO_CLASS = {
  hideAds: 'gc-hide-ads',
  hideNavigation: 'gc-hide-nav',
  hideFooter: 'gc-hide-footer',
  hideStickyElements: 'gc-hide-sticky',
  hideRecommendedSongs: 'gc-hide-recommended',
  hideQASection: 'gc-hide-qa',
  hideAboutSection: 'gc-hide-about',
  hideAlbumTracklist: 'gc-hide-tracklist',
  hidePyongButton: 'gc-hide-pyong',
  hideAnnotationHighlights: 'gc-hide-annotations',
  hideCreditsSection: 'gc-hide-credits',
  hideOtherAlbums: 'gc-hide-other-albums',
  hideAlbumSidebar: 'gc-hide-album-sidebar',
  hideArtistSidebar: 'gc-hide-artist-sidebar',
  hideArtistSocialLinks: 'gc-hide-social-links',
  hideCommentsSection: 'gc-hide-comments',
  hideShareButtons: 'gc-hide-share-buttons',
  hideContributorsCard: 'gc-hide-contributors',
  simplifyNavigation: 'gc-hide-simplify-nav',
  wideContent: 'gc-hide-wide',
  cleanerTypography: 'gc-hide-typography',
};

/**
 * CSS selectors for testing each hide rule
 * Maps CSS class to the selector that should be hidden
 */
export const CSS_SELECTORS = {
  'gc-hide-ads': '[class*="dfp_unit"], [class*="Leaderboard__Container"]',
  'gc-hide-nav': '[class*="StickyNav-desktop__Container"], [id="sticky-nav"]',
  'gc-hide-footer': '[class*="PageFooter-desktop__Container"], [class*="PageFooter__Container"]',
  'gc-hide-sticky': '[class*="BottomSticky"], [class*="StickyAd"]',
  'gc-hide-recommended': '[class*="RecommendedSongs__Container"]',
  'gc-hide-qa': '[class*="QuestionList__Container"]',
  'gc-hide-about': '[class*="About__Container"], [class*="SongInfo__Container"]',
  'gc-hide-tracklist': '[class*="AlbumTracklist__Container"]',
  'gc-hide-pyong': '[class*="Pyong__Container"], [class*="SongHeader-desktop__Pyong"]',
  'gc-hide-annotations': '[class*="ReferentFragment"]',
  'gc-hide-credits': '[class*="SongCredits__Container"], [class*="Credits__Container"]',
  'gc-hide-other-albums': '[class*="OtherAlbums__Container"]',
  'gc-hide-album-sidebar': '[class*="AlbumPage__Sidebar"]',
  'gc-hide-artist-sidebar': '[class*="ArtistPage__Sidebar"]',
  'gc-hide-social-links': '[class*="SocialLinks__Container"], [class*="ArtistSocialLinks"]',
  'gc-hide-comments': '[class*="SongCommentsWithAds__"], [class*="Comments__Container"]',
  'gc-hide-share-buttons': '[class*="ShareButtons__Container"]',
  'gc-hide-contributors': '[class*="ContributorsCreditSong__Container"]',
  'gc-hide-simplify-nav':
    '[class*="StickyNav-desktop__Right"], [class*="StickyNavSearch-desktop__"]',
};
