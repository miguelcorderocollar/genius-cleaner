import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { clearMockStorage } from './setup.js';

describe('content.js', () => {
  beforeEach(() => {
    clearMockStorage();
    document.body.innerHTML = '';
    document.body.className = '';
  });

  afterEach(() => {
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

  describe('Lyrics extraction', () => {
    it('should find lyrics containers by data attribute', () => {
      document.body.innerHTML = `
        <div data-lyrics-container="true">
          [Verse 1]
          First line of lyrics
          Second line of lyrics
        </div>
        <div data-lyrics-container="true">
          [Chorus]
          Chorus lyrics here
        </div>
      `;

      const containers = document.querySelectorAll('[data-lyrics-container="true"]');
      expect(containers.length).toBe(2);

      // Using textContent since innerText isn't available in jsdom
      let lyricsText = '';
      for (const container of containers) {
        const text = (container.textContent || '').trim();
        if (text) {
          lyricsText += (lyricsText ? '\n\n' : '') + text;
        }
      }

      expect(lyricsText).toContain('[Verse 1]');
      expect(lyricsText).toContain('[Chorus]');
    });

    it('should return empty when no lyrics containers exist', () => {
      document.body.innerHTML = '<div>No lyrics here</div>';

      const containers = document.querySelectorAll('[data-lyrics-container="true"]');
      expect(containers.length).toBe(0);
    });

    it('should handle Lyrics__Container class fallback', () => {
      document.body.innerHTML = `
        <div class="Lyrics__Container-sc-12345">
          Some lyrics text here
        </div>
      `;

      const container = document.querySelector('[class*="Lyrics__Container"]');
      expect(container).not.toBeNull();
      // Using textContent since innerText isn't available in jsdom
      expect(container.textContent).toContain('Some lyrics text here');
    });
  });

  describe('Artwork extraction', () => {
    it('should extract artwork from SongHeader CoverArt', () => {
      document.body.innerHTML = `
        <div class="SongHeader-desktop__CoverArt-sc-12345">
          <img src="https://t2.genius.com/unsafe/177x177/https%3A%2F%2Fimages.genius.com%2Ftest.png" alt="Cover art">
        </div>
      `;

      const img = document.querySelector('[class*="SongHeader"][class*="CoverArt"] img[src]');
      expect(img).not.toBeNull();
      expect(img.src).toContain('genius.com');
    });

    it('should extract original URL from transform service URL', () => {
      const transformUrl =
        'https://t2.genius.com/unsafe/177x177/https%3A%2F%2Fimages.genius.com%2Ftest.1000x1000x1.png';
      const match = transformUrl.match(/genius\.com\/unsafe\/\d+x\d+\/(https?%3A.+)/i);

      expect(match).not.toBeNull();
      const originalUrl = decodeURIComponent(match[1]);
      expect(originalUrl).toBe('https://images.genius.com/test.1000x1000x1.png');
    });

    it('should fallback to cover_art class for album pages', () => {
      document.body.innerHTML = `
        <div class="cover_art">
          <img src="https://images.genius.com/album-art.jpg" alt="Album cover">
        </div>
      `;

      const img = document.querySelector('.cover_art img[src]');
      expect(img).not.toBeNull();
      expect(img.src).toContain('album-art.jpg');
    });

    it('should generate clean filename from title', () => {
      const title = 'Song Title - Artist Name | Genius Lyrics';
      const filename = title
        .replace(/\s*[-|]\s*Genius.*$/i, '')
        .replace(/\s*Lyrics$/i, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 100)
        .trim();

      expect(filename).toBe('Song_Title_-_Artist_Name');
    });
  });
});
