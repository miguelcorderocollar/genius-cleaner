import { describe, it, expect } from 'vitest';
import {
  DEFAULTS,
  SETTING_CATEGORIES,
  SETTING_LABELS,
  SETTING_SCHEMA,
} from '../../../extension/shared/defaults.js';

describe('defaults.js', () => {
  describe('DEFAULTS', () => {
    it('should have globalEnabled default to true', () => {
      expect(DEFAULTS.globalEnabled).toBe(true);
    });

    it('should have hideAds default to true', () => {
      expect(DEFAULTS.hideAds).toBe(true);
    });

    it('should have hideNavigation default to false', () => {
      expect(DEFAULTS.hideNavigation).toBe(false);
    });

    it('should have simplifyNavigation default to true', () => {
      expect(DEFAULTS.simplifyNavigation).toBe(true);
    });

    it('should have hideComments default to true', () => {
      expect(DEFAULTS.hideComments).toBe(true);
    });

    it('should have hideShareButtons default to true', () => {
      expect(DEFAULTS.hideShareButtons).toBe(true);
    });

    it('should have hideContributors default to true', () => {
      expect(DEFAULTS.hideContributors).toBe(true);
    });

    // New common settings
    it('should have hideBreadcrumbs default to true', () => {
      expect(DEFAULTS.hideBreadcrumbs).toBe(true);
    });

    it('should have hideFollowButton default to true', () => {
      expect(DEFAULTS.hideFollowButton).toBe(true);
    });

    // New album page settings
    it('should have hideAlbumLeaderboard default to true', () => {
      expect(DEFAULTS.hideAlbumLeaderboard).toBe(true);
    });

    // New artist page settings
    it('should have hideArtistVideoPlayer default to true', () => {
      expect(DEFAULTS.hideArtistVideoPlayer).toBe(true);
    });

    it('should have hideArtistLeaderboard default to true', () => {
      expect(DEFAULTS.hideArtistLeaderboard).toBe(true);
    });

    it('should have hideArtistMetadataQuestions default to true', () => {
      expect(DEFAULTS.hideArtistMetadataQuestions).toBe(true);
    });

    it('should have hideArtistContributions default to true', () => {
      expect(DEFAULTS.hideArtistContributions).toBe(true);
    });

    it('should have hideArtistProfileTabs default to true', () => {
      expect(DEFAULTS.hideArtistProfileTabs).toBe(true);
    });

    it('should have all boolean values', () => {
      for (const [key, value] of Object.entries(DEFAULTS)) {
        expect(typeof value).toBe('boolean');
      }
    });

    it('should have expected number of settings', () => {
      const settingsCount = Object.keys(DEFAULTS).length;
      expect(settingsCount).toBeGreaterThan(10);
      expect(settingsCount).toBeLessThan(50);
    });
  });

  describe('SETTING_CATEGORIES', () => {
    it('should have global category', () => {
      expect(SETTING_CATEGORIES.global).toBeDefined();
      expect(SETTING_CATEGORIES.global.label).toBe('Global');
      expect(SETTING_CATEGORIES.global.settings).toContain('globalEnabled');
    });

    it('should have common category', () => {
      expect(SETTING_CATEGORIES.common).toBeDefined();
      expect(SETTING_CATEGORIES.common.settings).toContain('hideAds');
      expect(SETTING_CATEGORIES.common.settings).toContain('simplifyNavigation');
    });

    it('should have song category', () => {
      expect(SETTING_CATEGORIES.song).toBeDefined();
      expect(SETTING_CATEGORIES.song.settings).toContain('hideLyricsSidebar');
      expect(SETTING_CATEGORIES.song.settings).toContain('hideLyricsEditForm');
      expect(SETTING_CATEGORIES.song.settings).toContain('hideComments');
      expect(SETTING_CATEGORIES.song.settings).toContain('hideShareButtons');
      expect(SETTING_CATEGORIES.song.settings).toContain('hideContributors');
    });

    it('should have album category with leaderboard setting', () => {
      expect(SETTING_CATEGORIES.album).toBeDefined();
      expect(SETTING_CATEGORIES.album.settings).toContain('hideOtherAlbums');
      expect(SETTING_CATEGORIES.album.settings).toContain('hideAlbumSidebar');
      expect(SETTING_CATEGORIES.album.settings).toContain('hideAlbumLeaderboard');
    });

    it('should have artist category with new settings', () => {
      expect(SETTING_CATEGORIES.artist).toBeDefined();
      expect(SETTING_CATEGORIES.artist.settings).toContain('hideArtistSidebar');
      expect(SETTING_CATEGORIES.artist.settings).toContain('hideArtistSocialLinks');
      expect(SETTING_CATEGORIES.artist.settings).toContain('hideArtistVideoPlayer');
      expect(SETTING_CATEGORIES.artist.settings).toContain('hideArtistLeaderboard');
      expect(SETTING_CATEGORIES.artist.settings).toContain('hideArtistMetadataQuestions');
      expect(SETTING_CATEGORIES.artist.settings).toContain('hideArtistContributions');
      expect(SETTING_CATEGORIES.artist.settings).toContain('hideArtistProfileTabs');
    });

    it('should have common category with breadcrumbs and follow button', () => {
      expect(SETTING_CATEGORIES.common.settings).toContain('hideBreadcrumbs');
      expect(SETTING_CATEGORIES.common.settings).toContain('hideFollowButton');
    });

    it('should have visual category', () => {
      expect(SETTING_CATEGORIES.visual).toBeDefined();
      expect(SETTING_CATEGORIES.visual.settings).toContain('wideContent');
    });

    it('should reference only valid settings', () => {
      for (const category of Object.values(SETTING_CATEGORIES)) {
        for (const setting of category.settings) {
          expect(DEFAULTS).toHaveProperty(setting);
        }
      }
    });
  });

  describe('SETTING_LABELS', () => {
    it('should have a label for every default setting', () => {
      for (const key of Object.keys(DEFAULTS)) {
        expect(SETTING_LABELS).toHaveProperty(key);
        expect(typeof SETTING_LABELS[key]).toBe('string');
        expect(SETTING_LABELS[key].length).toBeGreaterThan(0);
      }
    });

    it('should have human-readable labels', () => {
      expect(SETTING_LABELS.globalEnabled).toBe('Enable Genius Cleaner');
      expect(SETTING_LABELS.hideAds).toBe('Hide Advertisements');
    });
  });

  describe('SETTING_SCHEMA', () => {
    it('should have a schema entry for every default setting', () => {
      for (const key of Object.keys(DEFAULTS)) {
        expect(SETTING_SCHEMA).toHaveProperty(key);
      }
    });

    it('should have all boolean types', () => {
      for (const type of Object.values(SETTING_SCHEMA)) {
        expect(type).toBe('boolean');
      }
    });
  });
});
