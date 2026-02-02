/**
 * CSS Rules E2E Tests
 *
 * Tests that the cleaner.css rules correctly hide elements
 * when the appropriate classes are applied to the body.
 *
 * These tests run against local example HTML files (saved from real Genius pages)
 * to ensure CSS selectors work with the actual website structure.
 *
 * We use local files because Genius.com uses Cloudflare bot protection
 * which blocks headless browsers.
 *
 * Page types tested:
 * - lyrics: Song lyrics page (nav, recommended songs, about, lyrics container)
 * - album: Album page (nav, tracklist, album sidebar, other albums)
 * - artist: Artist page (nav, artist sidebar, social links)
 */

import { test, expect } from '@playwright/test';
import {
  setupPage,
  applyHideClass,
  removeHideClass,
  enableGeniusCleaner,
  disableGeniusCleaner,
  TEST_PAGES,
} from './helpers/css-test-utils.js';

// ============================================================================
// Navigation Tests (applies to all page types)
// ============================================================================

test.describe('Navigation Hiding', () => {
  test('should hide sticky nav on lyrics page', async ({ page }) => {
    await setupPage(page, 'lyrics');

    const nav = page.locator('[class*="StickyNav-desktop__Container"], #sticky-nav').first();
    await expect(nav).toBeVisible();

    await applyHideClass(page, 'gc-hide-nav');
    await expect(nav).toHaveCSS('display', 'none');
  });

  test('should hide sticky nav on album page', async ({ page }) => {
    await setupPage(page, 'album');

    const nav = page.locator('[class*="StickyNav-desktop__Container"], #sticky-nav').first();
    if ((await nav.count()) > 0) {
      await applyHideClass(page, 'gc-hide-nav');
      await expect(nav).toHaveCSS('display', 'none');
    }
  });

  test('should hide sticky nav on artist page', async ({ page }) => {
    await setupPage(page, 'artist');

    const nav = page.locator('[class*="StickyNav-desktop__Container"], #sticky-nav').first();
    if ((await nav.count()) > 0) {
      await applyHideClass(page, 'gc-hide-nav');
      await expect(nav).toHaveCSS('display', 'none');
    }
  });

  test('should show nav when class is removed', async ({ page }) => {
    await setupPage(page, 'lyrics');

    const nav = page.locator('[class*="StickyNav-desktop__Container"], #sticky-nav').first();
    await applyHideClass(page, 'gc-hide-nav');
    await expect(nav).toHaveCSS('display', 'none');

    await removeHideClass(page, 'gc-hide-nav');
    await expect(nav).not.toHaveCSS('display', 'none');
  });
});

// ============================================================================
// Lyrics Page Specific Tests
// ============================================================================

test.describe('Lyrics Page - Recommended Songs', () => {
  test('should hide recommended songs container', async ({ page }) => {
    await setupPage(page, 'lyrics');

    const recommended = page.locator('[class*="RecommendedSongs__Container"]').first();

    if ((await recommended.count()) > 0) {
      await expect(recommended).toBeVisible();
      await applyHideClass(page, 'gc-hide-recommended');
      await expect(recommended).toHaveCSS('display', 'none');
    }
  });
});

test.describe('Lyrics Page - About Section', () => {
  test('should hide about container', async ({ page }) => {
    await setupPage(page, 'lyrics');

    const about = page.locator('[class*="About__Container"]').first();

    if ((await about.count()) > 0) {
      await expect(about).toBeVisible();
      await applyHideClass(page, 'gc-hide-about');
      await expect(about).toHaveCSS('display', 'none');
    }
  });
});

test.describe('Lyrics Page - Wide Content Mode', () => {
  test('should change PageGrid display to block', async ({ page }) => {
    await setupPage(page, 'lyrics');

    const grid = page.locator('[class*="PageGrid-desktop"]').first();

    if ((await grid.count()) > 0) {
      await applyHideClass(page, 'gc-hide-wide');
      await expect(grid).toHaveCSS('display', 'block');
    }
  });

  test('should expand lyrics container width', async ({ page }) => {
    await setupPage(page, 'lyrics');

    const container = page.locator('[class*="Lyrics__Container"]').first();

    if ((await container.count()) > 0) {
      await applyHideClass(page, 'gc-hide-wide');

      const maxWidth = await container.evaluate((el) => {
        return window.getComputedStyle(el).maxWidth;
      });

      // Should be 100% or none (not a fixed pixel value)
      expect(maxWidth === '100%' || maxWidth === 'none').toBeTruthy();
    }
  });
});

test.describe('Lyrics Page - Typography', () => {
  test('should change font family on lyrics container', async ({ page }) => {
    await setupPage(page, 'lyrics');

    const container = page.locator('[data-lyrics-container="true"]').first();

    if ((await container.count()) > 0) {
      await applyHideClass(page, 'gc-hide-typography');

      const fontFamily = await container.evaluate((el) => {
        return window.getComputedStyle(el).fontFamily;
      });

      // Should include system fonts
      expect(fontFamily).toMatch(
        /(-apple-system|BlinkMacSystemFont|Segoe UI|Roboto|Arial|sans-serif)/i
      );
    }
  });
});

test.describe('Lyrics Page - Credits', () => {
  test('should hide credits section', async ({ page }) => {
    await setupPage(page, 'lyrics');

    const credits = page
      .locator('[class*="SongCredits__Container"], [class*="Credits__Container"]')
      .first();

    if ((await credits.count()) > 0) {
      await applyHideClass(page, 'gc-hide-credits');
      await expect(credits).toHaveCSS('display', 'none');
    }
  });
});

// ============================================================================
// Album Page Specific Tests
// ============================================================================

test.describe('Album Page - Tracklist', () => {
  test('should hide album tracklist', async ({ page }) => {
    await setupPage(page, 'album');

    const tracklist = page.locator('[class*="AlbumTracklist__Container"]').first();

    if ((await tracklist.count()) > 0) {
      await applyHideClass(page, 'gc-hide-tracklist');
      await expect(tracklist).toHaveCSS('display', 'none');
    }
  });
});

test.describe('Album Page - Sidebar', () => {
  test('should hide album sidebar', async ({ page }) => {
    await setupPage(page, 'album');

    const sidebar = page.locator('[class*="AlbumPage__Sidebar"]').first();

    if ((await sidebar.count()) > 0) {
      await applyHideClass(page, 'gc-hide-album-sidebar');
      await expect(sidebar).toHaveCSS('display', 'none');
    }
  });
});

test.describe('Album Page - Other Albums', () => {
  test('should hide other albums section', async ({ page }) => {
    await setupPage(page, 'album');

    const otherAlbums = page.locator('[class*="OtherAlbums__Container"]').first();

    if ((await otherAlbums.count()) > 0) {
      await applyHideClass(page, 'gc-hide-other-albums');
      await expect(otherAlbums).toHaveCSS('display', 'none');
    }
  });
});

// ============================================================================
// Artist Page Specific Tests
// ============================================================================

test.describe('Artist Page - Sidebar', () => {
  test('should hide artist sidebar', async ({ page }) => {
    await setupPage(page, 'artist');

    const sidebar = page.locator('[class*="ArtistPage__Sidebar"]').first();

    if ((await sidebar.count()) > 0) {
      await applyHideClass(page, 'gc-hide-artist-sidebar');
      await expect(sidebar).toHaveCSS('display', 'none');
    }
  });
});

test.describe('Artist Page - Social Links', () => {
  test('should hide social links', async ({ page }) => {
    await setupPage(page, 'artist');

    const socialLinks = page
      .locator('[class*="SocialLinks__Container"], [class*="ArtistSocialLinks"]')
      .first();

    if ((await socialLinks.count()) > 0) {
      await applyHideClass(page, 'gc-hide-social-links');
      await expect(socialLinks).toHaveCSS('display', 'none');
    }
  });
});

// ============================================================================
// Simplified Navigation (all pages)
// ============================================================================

test.describe('Simplified Navigation', () => {
  test('should hide right section of nav on lyrics page', async ({ page }) => {
    await setupPage(page, 'lyrics');

    const right = page.locator('[class*="StickyNav-desktop__Right"]').first();

    if ((await right.count()) > 0) {
      await applyHideClass(page, 'gc-hide-simplify-nav');
      await expect(right).toHaveCSS('display', 'none');
    }
  });

  test('should hide search bar', async ({ page }) => {
    await setupPage(page, 'lyrics');

    const search = page.locator('[class*="StickyNavSearch-desktop__"]').first();

    if ((await search.count()) > 0) {
      await applyHideClass(page, 'gc-hide-simplify-nav');
      await expect(search).toHaveCSS('display', 'none');
    }
  });

  test('should hide site links', async ({ page }) => {
    await setupPage(page, 'lyrics');

    const links = page.locator('[class*="StickyNavSiteLinks__"]').first();

    if ((await links.count()) > 0) {
      await applyHideClass(page, 'gc-hide-simplify-nav');
      await expect(links).toHaveCSS('display', 'none');
    }
  });
});

// ============================================================================
// Footer Hiding (all pages)
// ============================================================================

test.describe('Footer Hiding', () => {
  test('should hide footer on lyrics page', async ({ page }) => {
    await setupPage(page, 'lyrics');

    const footer = page
      .locator('[class*="PageFooter-desktop__Container"], [class*="PageFooter__Container"]')
      .first();

    if ((await footer.count()) > 0) {
      await applyHideClass(page, 'gc-hide-footer');
      await expect(footer).toHaveCSS('display', 'none');
    }
  });
});

// ============================================================================
// Toggle Behavior
// ============================================================================

test.describe('Toggle Behavior', () => {
  test('should hide when class is added and show when removed', async ({ page }) => {
    await setupPage(page, 'lyrics');

    const nav = page.locator('[class*="StickyNav-desktop__Container"], #sticky-nav').first();

    // Initially visible (no hide class)
    await expect(nav).toBeVisible();
    await expect(nav).not.toHaveCSS('display', 'none');

    // Add hide class - should be hidden
    await applyHideClass(page, 'gc-hide-nav');
    await expect(nav).toHaveCSS('display', 'none');

    // Remove hide class - should be visible again
    await removeHideClass(page, 'gc-hide-nav');
    await expect(nav).not.toHaveCSS('display', 'none');
  });
});

// ============================================================================
// CSS Selector Pattern Verification
// ============================================================================

test.describe('CSS Selector Patterns', () => {
  test('partial class matching works for hashed class names', async ({ page }) => {
    await setupPage(page, 'lyrics');
    await applyHideClass(page, 'gc-hide-nav');

    // The actual class is something like "StickyNav-desktop__Container-sc-72d92c60-0"
    // Our selector uses [class*="StickyNav-desktop__Container"] to match
    const nav = page.locator('[class*="StickyNav-desktop__Container"]').first();

    if ((await nav.count()) > 0) {
      const actualClass = await nav.getAttribute('class');

      // Verify the element has a hashed class name pattern
      expect(actualClass).toMatch(/StickyNav-desktop__Container/);

      // And it's hidden
      await expect(nav).toHaveCSS('display', 'none');
    }
  });
});
