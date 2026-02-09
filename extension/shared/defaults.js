// Centralized defaults - single source of truth for all settings
// Used by popup, options, content scripts, and storage module

export const DEFAULTS = {
  // Global
  globalEnabled: true,
  hideAll: true, // Master switch - when enabled, hides everything (simplified mode)

  // Common sections (apply to all page types)
  hideAds: true,
  hideNavigation: false,
  simplifyNavigation: true,
  hideFooter: true,
  hideStickyElements: true,
  hideBreadcrumbs: true,
  hideFollowButton: true,

  // Song/Lyrics page sections
  hideLyricsSidebar: true,
  hideLyricsEditForm: true,
  hideQASection: true,
  hideAboutSection: true,
  hideAlbumTracklist: true,
  hidePyongButton: true,
  hideAnnotationHighlights: true,
  hideHighlightTooltip: true,
  hideCreditsSection: true,
  hideComments: true,
  hideShareButtons: true,
  hideContributors: true,

  // Album page sections
  hideOtherAlbums: true,
  hideAlbumSidebar: true,
  hideAlbumLeaderboard: true,

  // Artist page sections
  hideArtistSidebar: true,
  hideArtistSocialLinks: true,
  hideArtistVideoPlayer: true,
  hideArtistLeaderboard: true,
  hideArtistMetadataQuestions: true,
  hideArtistContributions: true,
  hideArtistProfileTabs: true,

  // Visual tweaks
  wideContent: true,
  cleanerTypography: true,
};

// Setting categories for UI organization
export const SETTING_CATEGORIES = {
  global: {
    label: 'Global',
    settings: ['globalEnabled', 'hideAll'],
  },
  common: {
    label: 'Common Elements',
    description: 'Elements that appear on all page types',
    settings: [
      'hideAds',
      'hideNavigation',
      'simplifyNavigation',
      'hideFooter',
      'hideStickyElements',
      'hideBreadcrumbs',
      'hideFollowButton',
    ],
  },
  song: {
    label: 'Song Pages',
    description: 'Elements specific to lyrics/song pages',
    settings: [
      'hideLyricsSidebar',
      'hideLyricsEditForm',
      'hideQASection',
      'hideAboutSection',
      'hideAlbumTracklist',
      'hidePyongButton',
      'hideAnnotationHighlights',
      'hideHighlightTooltip',
      'hideCreditsSection',
      'hideComments',
      'hideShareButtons',
      'hideContributors',
    ],
  },
  album: {
    label: 'Album Pages',
    description: 'Elements specific to album pages',
    settings: ['hideOtherAlbums', 'hideAlbumSidebar', 'hideAlbumLeaderboard'],
  },
  artist: {
    label: 'Artist Pages',
    description: 'Elements specific to artist pages',
    settings: [
      'hideArtistSidebar',
      'hideArtistSocialLinks',
      'hideArtistVideoPlayer',
      'hideArtistLeaderboard',
      'hideArtistMetadataQuestions',
      'hideArtistContributions',
      'hideArtistProfileTabs',
    ],
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
  hideAll: 'Hide All (Simplified Mode)',
  hideAds: 'Hide Advertisements',
  hideNavigation: 'Hide Navigation Bar',
  simplifyNavigation: 'Simplify Navigation Bar',
  hideFooter: 'Hide Footer',
  hideStickyElements: 'Hide Sticky Elements',
  hideBreadcrumbs: 'Hide Breadcrumbs',
  hideFollowButton: 'Hide Follow Button',
  hideLyricsSidebar: 'Hide Lyrics Sidebar',
  hideLyricsEditForm: 'Hide Lyrics Edit Form',
  hideQASection: 'Hide Q&A Section',
  hideAboutSection: 'Hide About Section',
  hideAlbumTracklist: 'Hide Album Tracklist (on song pages)',
  hidePyongButton: 'Hide Pyong Button',
  hideAnnotationHighlights: 'Hide Annotation Highlights',
  hideHighlightTooltip: 'Hide Highlight Tooltip',
  hideCreditsSection: 'Hide Credits Section',
  hideComments: 'Hide Comments Section',
  hideShareButtons: 'Hide Share Buttons',
  hideContributors: 'Hide Contributors Card',
  hideOtherAlbums: 'Hide Other Albums',
  hideAlbumSidebar: 'Hide Album Sidebar',
  hideAlbumLeaderboard: 'Hide Top Scholars',
  hideArtistSidebar: 'Hide Artist Sidebar',
  hideArtistSocialLinks: 'Hide Social Links',
  hideArtistVideoPlayer: 'Hide Video Player',
  hideArtistLeaderboard: 'Hide Top Scholars',
  hideArtistMetadataQuestions: 'Hide Metadata Questions',
  hideArtistContributions: 'Hide Contributions',
  hideArtistProfileTabs: 'Hide Profile Tabs',
  wideContent: 'Wide Content Mode',
  cleanerTypography: 'Cleaner Typography',
};

// Page types the extension supports
export const PAGE_TYPES = {
  LYRICS: 'lyrics',
  ARTIST: 'artist',
  ALBUM: 'album',
  OTHER: 'other',
};

// The supported page types where the extension should apply settings
// (excludes OTHER - homepage, search, etc.)
const SUPPORTED_PAGES = [PAGE_TYPES.LYRICS, PAGE_TYPES.ARTIST, PAGE_TYPES.ALBUM];

// Maps settings to the page types where they should apply
// Settings not listed here are "common" settings that apply to all SUPPORTED pages
export const SETTING_PAGE_TYPES = {
  // Common settings - apply to all supported pages (lyrics, artist, album)
  hideAds: SUPPORTED_PAGES,
  hideNavigation: SUPPORTED_PAGES,
  simplifyNavigation: SUPPORTED_PAGES,
  hideFooter: SUPPORTED_PAGES,
  hideStickyElements: SUPPORTED_PAGES,
  hideBreadcrumbs: SUPPORTED_PAGES,
  hideFollowButton: SUPPORTED_PAGES,

  // Song/Lyrics page only
  hideLyricsSidebar: [PAGE_TYPES.LYRICS],
  hideLyricsEditForm: [PAGE_TYPES.LYRICS],
  hideQASection: [PAGE_TYPES.LYRICS],
  hideAboutSection: [PAGE_TYPES.LYRICS],
  hideAlbumTracklist: [PAGE_TYPES.LYRICS],
  hidePyongButton: [PAGE_TYPES.LYRICS],
  hideAnnotationHighlights: [PAGE_TYPES.LYRICS],
  hideHighlightTooltip: [PAGE_TYPES.LYRICS],
  hideCreditsSection: [PAGE_TYPES.LYRICS],
  hideComments: [PAGE_TYPES.LYRICS],
  hideShareButtons: [PAGE_TYPES.LYRICS],
  hideContributors: [PAGE_TYPES.LYRICS],
  wideContent: [PAGE_TYPES.LYRICS],
  cleanerTypography: [PAGE_TYPES.LYRICS],

  // Album page only
  hideOtherAlbums: [PAGE_TYPES.ALBUM],
  hideAlbumSidebar: [PAGE_TYPES.ALBUM],
  hideAlbumLeaderboard: [PAGE_TYPES.ALBUM],

  // Artist page only
  hideArtistSidebar: [PAGE_TYPES.ARTIST],
  hideArtistSocialLinks: [PAGE_TYPES.ARTIST],
  hideArtistVideoPlayer: [PAGE_TYPES.ARTIST],
  hideArtistLeaderboard: [PAGE_TYPES.ARTIST],
  hideArtistMetadataQuestions: [PAGE_TYPES.ARTIST],
  hideArtistContributions: [PAGE_TYPES.ARTIST],
  hideArtistProfileTabs: [PAGE_TYPES.ARTIST],
};

/**
 * Check if a setting applies to a given page type
 * @param {string} setting - The setting key
 * @param {string} pageType - The current page type
 * @returns {boolean} - Whether the setting should be applied
 */
export function settingAppliesToPage(setting, pageType) {
  // globalEnabled is special - it's handled separately, not as a CSS class
  if (setting === 'globalEnabled') {
    return true;
  }

  const allowedTypes = SETTING_PAGE_TYPES[setting];
  // If not in the mapping, don't apply (all settings should be mapped)
  if (!allowedTypes) {
    return false;
  }
  return allowedTypes.includes(pageType);
}

// Schema for validation during import
export const SETTING_SCHEMA = {
  globalEnabled: 'boolean',
  hideAll: 'boolean',
  hideAds: 'boolean',
  hideNavigation: 'boolean',
  simplifyNavigation: 'boolean',
  hideFooter: 'boolean',
  hideStickyElements: 'boolean',
  hideBreadcrumbs: 'boolean',
  hideFollowButton: 'boolean',
  hideLyricsSidebar: 'boolean',
  hideLyricsEditForm: 'boolean',
  hideQASection: 'boolean',
  hideAboutSection: 'boolean',
  hideAlbumTracklist: 'boolean',
  hidePyongButton: 'boolean',
  hideAnnotationHighlights: 'boolean',
  hideHighlightTooltip: 'boolean',
  hideCreditsSection: 'boolean',
  hideComments: 'boolean',
  hideShareButtons: 'boolean',
  hideContributors: 'boolean',
  hideOtherAlbums: 'boolean',
  hideAlbumSidebar: 'boolean',
  hideAlbumLeaderboard: 'boolean',
  hideArtistSidebar: 'boolean',
  hideArtistSocialLinks: 'boolean',
  hideArtistVideoPlayer: 'boolean',
  hideArtistLeaderboard: 'boolean',
  hideArtistMetadataQuestions: 'boolean',
  hideArtistContributions: 'boolean',
  hideArtistProfileTabs: 'boolean',
  wideContent: 'boolean',
  cleanerTypography: 'boolean',
};
