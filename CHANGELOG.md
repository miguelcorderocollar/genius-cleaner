# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-02-09

### Added

- **Core Functionality**: Hide ads, sidebars, and clutter on Genius.com while preserving lyrics and core content
- **Per-Section Control**: Granular settings to choose exactly what to hide/show
  - Hide advertisements and banners
  - Hide recommended songs sidebar
  - Hide Q&A sections
  - Hide footer
  - Hide sticky elements and floating ads
  - Hide Pyong button
  - Hide navigation elements
  - Hide social links
  - Hide "About" sections
  - Hide tracklists (optional)
  - Hide annotations (optional)
- **Page-Specific Settings**: Different controls for song pages, album pages, and artist pages
- **Visual Enhancements**:
  - Wide content mode to expand lyrics to full width
  - Cleaner typography with improved fonts and spacing
- **User Interface**:
  - Popup with quick toggle and settings access
  - Comprehensive options page with organized settings
  - Visual feedback for enabled/disabled state
- **Keyboard Shortcut**: `Ctrl+Shift+K` (or `Cmd+Shift+K` on Mac) to toggle cleaner on/off
- **Settings Sync**: Settings sync across devices via Chrome's built-in sync
- **Privacy-First Design**: No data collection, no external servers, no tracking
- **Modular Architecture**: Clean codebase with shared modules and utilities
- **Test Coverage**: Unit tests (Vitest) and E2E tests (Playwright)
- **Build System**: Production-ready build pipeline with esbuild
- **Packaging Script**: Automated Chrome Web Store package generation

### Changed

- Initial release

### Security

- All processing happens locally in the browser
- No data collection or external server communication
- No analytics or tracking
- Open source codebase for transparency
