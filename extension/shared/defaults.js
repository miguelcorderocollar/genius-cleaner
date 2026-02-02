// Centralized defaults - single source of truth for all settings
// Used by popup, options, content scripts, and storage module

export const DEFAULTS = {
  // Global
  globalEnabled: true,

  // Common sections (apply to all page types)
  hideAds: true,
  hideNavigation: false,
  hideFooter: true,
  hideStickyElements: true,

  // Song/Lyrics page sections
  hideRecommendedSongs: true,
  hideQASection: true,
  hideAboutSection: false,
  hideAlbumTracklist: false,
  hidePyongButton: true,
  hideAnnotationHighlights: false,
  hideCreditsSection: false,

  // Album page sections
  hideOtherAlbums: false,
  hideAlbumSidebar: true,

  // Artist page sections
  hideArtistSidebar: true,
  hideArtistSocialLinks: false,

  // Visual tweaks
  wideContent: true,
  cleanerTypography: false,
};

// Setting categories for UI organization
export const SETTING_CATEGORIES = {
  global: {
    label: 'Global',
    settings: ['globalEnabled'],
  },
  common: {
    label: 'Common Elements',
    description: 'Elements that appear on all page types',
    settings: ['hideAds', 'hideNavigation', 'hideFooter', 'hideStickyElements'],
  },
  song: {
    label: 'Song Pages',
    description: 'Elements specific to lyrics/song pages',
    settings: [
      'hideRecommendedSongs',
      'hideQASection',
      'hideAboutSection',
      'hideAlbumTracklist',
      'hidePyongButton',
      'hideAnnotationHighlights',
      'hideCreditsSection',
    ],
  },
  album: {
    label: 'Album Pages',
    description: 'Elements specific to album pages',
    settings: ['hideOtherAlbums', 'hideAlbumSidebar'],
  },
  artist: {
    label: 'Artist Pages',
    description: 'Elements specific to artist pages',
    settings: ['hideArtistSidebar', 'hideArtistSocialLinks'],
  },
  visual: {
    label: 'Visual Tweaks',
    description: 'Layout and typography adjustments',
    settings: ['wideContent', 'cleanerTypography'],
  },
};

// Human-readable labels for settings
export const SETTING_LABELS = {
  globalEnabled: 'Enable Genius Cleaner',
  hideAds: 'Hide Advertisements',
  hideNavigation: 'Hide Navigation Bar',
  hideFooter: 'Hide Footer',
  hideStickyElements: 'Hide Sticky Elements',
  hideRecommendedSongs: 'Hide "You Might Also Like"',
  hideQASection: 'Hide Q&A Section',
  hideAboutSection: 'Hide About Section',
  hideAlbumTracklist: 'Hide Album Tracklist (on song pages)',
  hidePyongButton: 'Hide Pyong Button',
  hideAnnotationHighlights: 'Hide Annotation Highlights',
  hideCreditsSection: 'Hide Credits Section',
  hideOtherAlbums: 'Hide Other Albums',
  hideAlbumSidebar: 'Hide Album Sidebar',
  hideArtistSidebar: 'Hide Artist Sidebar',
  hideArtistSocialLinks: 'Hide Social Links',
  wideContent: 'Wide Content Mode',
  cleanerTypography: 'Cleaner Typography',
};

// Schema for validation during import
export const SETTING_SCHEMA = {
  globalEnabled: 'boolean',
  hideAds: 'boolean',
  hideNavigation: 'boolean',
  hideFooter: 'boolean',
  hideStickyElements: 'boolean',
  hideRecommendedSongs: 'boolean',
  hideQASection: 'boolean',
  hideAboutSection: 'boolean',
  hideAlbumTracklist: 'boolean',
  hidePyongButton: 'boolean',
  hideAnnotationHighlights: 'boolean',
  hideCreditsSection: 'boolean',
  hideOtherAlbums: 'boolean',
  hideAlbumSidebar: 'boolean',
  hideArtistSidebar: 'boolean',
  hideArtistSocialLinks: 'boolean',
  wideContent: 'boolean',
  cleanerTypography: 'boolean',
};
