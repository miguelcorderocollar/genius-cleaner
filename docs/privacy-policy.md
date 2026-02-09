# Privacy Policy

**Effective Date:** February 2026  
**Last Updated:** February 2026

## Overview

Genius Cleaner is a Chrome browser extension that simplifies the Genius.com user interface by hiding ads, sidebars, and clutter while preserving lyrics and core content. This privacy policy explains how Genius Cleaner handles user data.

## Data Collection

**Genius Cleaner does NOT collect, transmit, or share any personal data.**

### What We Don't Do

- ❌ We do NOT send any data to external servers
- ❌ We do NOT collect personal information
- ❌ We do NOT use analytics or tracking services
- ❌ We do NOT share data with third parties
- ❌ We do NOT monitor your browsing activity
- ❌ We do NOT access content from websites other than Genius.com

### What We Do Store Locally

Genius Cleaner stores the following data **locally in your browser only**:

1. **User Preferences & Settings**
   - Which elements to hide/show (ads, recommendations, Q&A sections, footer, etc.)
   - Page-specific settings for song pages, album pages, and artist pages
   - Visual preferences (wide content mode, cleaner typography)
   - Global enable/disable state

All data is stored using Chrome's built-in `chrome.storage.sync` API, which means:

- Data stays on your device or syncs to your personal Chrome account
- Data is encrypted in transit when syncing between your devices
- Only you have access to your data

## How Genius Cleaner Works

When you use Genius Cleaner:

1. The extension runs only on Genius.com pages (`*://*.genius.com/*`)
2. It applies CSS classes to hide elements based on your preferences
3. All processing happens entirely within your browser
4. **No content is ever sent to external servers**

## Permissions Explained

Genius Cleaner requests the following permissions:

| Permission   | Purpose                                                      |
| ------------ | ------------------------------------------------------------ |
| `storage`    | Save your preferences and settings locally                   |
| `activeTab`  | Apply CSS classes to the current Genius.com tab              |
| `downloads`  | Declared for potential future features (currently unused)    |
| `genius.com` | Modify the appearance of Genius.com pages by hiding elements |

### Why `genius.com` Host Permission?

Genius Cleaner requires host permission for `*://*.genius.com/*` because it modifies the appearance of Genius.com pages by hiding elements based on your preferences. The content script injects CSS classes into the page DOM to control visibility of ads, sidebars, recommendations, and other UI elements.

The extension only processes content when you visit Genius.com pages. It does not automatically access, monitor, or collect any browsing data from other websites.

## Data Retention

- **Settings**: Stored until you uninstall the extension or clear browser data
- **No Usage Statistics**: Genius Cleaner does not track or store usage statistics

## Your Rights

You have full control over your data:

- **View Settings**: All settings are visible in the extension options page
- **Modify Settings**: Change preferences anytime through the popup or options page
- **Delete All Data**: Uninstall the extension to remove all stored data
- **Disable Extension**: Use the global toggle to disable the extension without deleting settings

## Data Security

- All data processing happens locally in your browser
- No data is transmitted over the internet (except Chrome's built-in sync)
- No external servers or databases are used
- The extension source code is open for review

## Children's Privacy

Genius Cleaner does not knowingly collect any personal information from children under 13 years of age. The extension does not collect personal information from any users.

## Changes to This Policy

If we make changes to this privacy policy, we will update the "Last Updated" date at the top of this document. Continued use of Genius Cleaner after changes constitutes acceptance of the updated policy.

## Open Source

Genius Cleaner is open source. You can review the complete source code to verify our privacy practices:

- **Repository**: [GitHub - Genius Cleaner](https://github.com/miguelcorderocollar/genius-cleaner)

## Contact

If you have questions about this privacy policy or Genius Cleaner's data practices, please contact us:

- **GitHub Issues**: [https://github.com/miguelcorderocollar/genius-cleaner/issues](https://github.com/miguelcorderocollar/genius-cleaner/issues)

---

**Summary**: Genius Cleaner processes content entirely in your browser. No personal data is collected, transmitted, or shared. Your settings are stored locally and are fully under your control.
