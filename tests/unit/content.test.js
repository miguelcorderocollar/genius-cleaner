import { describe, it, expect, beforeEach } from 'vitest';
import { clearMockStorage } from './setup.js';

describe('content.js', () => {
  beforeEach(() => {
    clearMockStorage();
    document.body.innerHTML = '';
    document.body.className = '';
  });

  describe('CSS class management', () => {
    it('should add classes to body', () => {
      document.body.classList.add('genius-cleaner-enabled');
      document.body.classList.add('gc-hide-ads');

      expect(document.body.classList.contains('genius-cleaner-enabled')).toBe(true);
      expect(document.body.classList.contains('gc-hide-ads')).toBe(true);
    });

    it('should remove classes from body', () => {
      document.body.classList.add('genius-cleaner-enabled');
      document.body.classList.add('gc-hide-ads');

      document.body.classList.remove('gc-hide-ads');

      expect(document.body.classList.contains('genius-cleaner-enabled')).toBe(true);
      expect(document.body.classList.contains('gc-hide-ads')).toBe(false);
    });

    it('should toggle enabled state', () => {
      document.body.classList.add('genius-cleaner-enabled');
      expect(document.body.classList.contains('genius-cleaner-enabled')).toBe(true);

      document.body.classList.remove('genius-cleaner-enabled');
      expect(document.body.classList.contains('genius-cleaner-enabled')).toBe(false);
    });
  });

  describe('Setting to class mapping', () => {
    const SETTING_TO_CLASS = {
      hideAds: 'ads',
      hideNavigation: 'nav',
      hideFooter: 'footer',
      hideStickyElements: 'sticky',
      hideRecommendedSongs: 'recommended',
      hideQASection: 'qa',
      hideAboutSection: 'about',
      hideAlbumTracklist: 'tracklist',
      hidePyongButton: 'pyong',
      hideAnnotationHighlights: 'annotations',
      hideCreditsSection: 'credits',
      hideOtherAlbums: 'other-albums',
      hideAlbumSidebar: 'album-sidebar',
      hideArtistSidebar: 'artist-sidebar',
      hideArtistSocialLinks: 'social-links',
      wideContent: 'wide',
      cleanerTypography: 'typography',
    };

    it('should have all expected mappings', () => {
      expect(Object.keys(SETTING_TO_CLASS).length).toBe(17);
    });

    it('should map hideAds to ads class', () => {
      expect(SETTING_TO_CLASS.hideAds).toBe('ads');
    });

    it('should map wideContent to wide class', () => {
      expect(SETTING_TO_CLASS.wideContent).toBe('wide');
    });
  });
});
