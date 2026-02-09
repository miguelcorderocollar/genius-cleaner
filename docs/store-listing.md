# Chrome Web Store Listing

This document contains the ready-to-use content for the Chrome Web Store listing.

---

## Name

**Genius Cleaner**

## Short Description (132 characters max)

> Simplify Genius.com by hiding ads, sidebars, and clutter while keeping lyrics and core content.

_Character count: 109_

## Category

**Productivity** (recommended)

## Language

**English**

## Support URL

https://github.com/miguelcorderocollar/genius-cleaner/issues

## Homepage URL

https://genius-cleaner.miguelcorderocollar.com/

---

## Detailed Description

Copy the plain text below into the Chrome Web Store detailed description field:

```txt
Genius Cleaner simplifies your Genius.com experience by removing distractions and clutter while preserving the lyrics and content you care about.

WHY INSTALL GENIUS CLEANER?

Genius.com is a great resource for song lyrics, but the interface can be cluttered with ads, recommendations, and other distractions. Genius Cleaner removes all the noise so you can focus on what matters: the lyrics.

WHAT IT HIDES

Advertisements and Banners
Remove all ads, video ads, banners, and sponsored content that clutter your view.

Recommended Songs
Hide the "You might also like" sidebar that takes up valuable screen space.

Q&A Sections
Remove the questions and answers section below lyrics.

Footer and Sticky Elements
Hide page footers, floating ads, sticky headers, and bottom bars that follow you as you scroll.

Pyong Button
Remove the appreciation button if you don't use it.

Navigation and Social Links
Optionally hide navigation elements and social media links for an even cleaner experience.

WHAT IT KEEPS

Full Song Lyrics
All lyrics with proper formatting and line breaks preserved.

Album Artwork
Cover images and artwork remain visible.

Song and Album Information
Title, artist, release date, and other metadata stay intact.

Tracklists (Optional)
Choose whether to show or hide album track listings.

Annotations (Optional)
Genius annotations can be toggled on or off.

KEY FEATURES

Per-Section Control
Choose exactly what to hide. Keep what you want, remove what you don't. Granular settings for song pages, album pages, and artist pages.

Wide Content Mode
Expand lyrics to use the full page width for easier reading on large screens.

Cleaner Typography
Apply improved fonts and line spacing to lyrics for better readability.

Keyboard Shortcut
Press Ctrl+Shift+K (Cmd+Shift+K on Mac) to toggle the cleaner on or off instantly.

Settings Sync
Your preferences sync across all your Chrome browsers automatically.

PRIVACY FIRST

No data collection. Everything happens locally in your browser. Your settings never leave your device.

No external servers. Genius Cleaner processes everything on your machine. We never see what you're viewing.

No analytics. We don't track your browsing or usage patterns.

Open source. Review our code on GitHub anytime.

PERFECT FOR

- Reading lyrics without distractions
- Focusing on song content
- Customizing your Genius.com experience
- Music lovers who want a cleaner interface
- Anyone who finds Genius.com's UI cluttered

HOW TO USE

1. Install the extension from Chrome Web Store
2. Visit any Genius.com page (song, album, or artist page)
3. Enjoy a cleaner, distraction-free experience
4. Click the extension icon to customize what to hide/show
5. Use Ctrl+Shift+K to quickly toggle the cleaner on or off

For detailed settings, right-click the extension icon and select Options.

OPEN SOURCE

View the source code and contribute: github.com/miguelcorderocollar/genius-cleaner

Questions or feedback? Open an issue on GitHub. We actively respond to user feedback and feature requests.
```

## Character Count

The detailed description above is approximately **2,200 characters** (well within the 16,000 character limit).

---

## Notes for Submission

1. **Screenshots needed**: 3-5 screenshots showing the extension in action
   - Before/after comparison of a Genius.com song page
   - Popup interface
   - Options/settings page
   - Different page types (song, album, artist)
2. **Privacy policy URL**: Host `web/privacy.html` and add the URL
3. **Promotional images**: Optional but recommended for visibility
   - Small promo tile: 440x280px
   - Marquee promo tile: 920x680px
   - Promotional banner: 1200x630px (for Open Graph)

---

## Privacy & Permissions (Chrome Web Store Form)

This section contains the exact text to paste into the Chrome Web Store privacy compliance form.

### Single Purpose Description

```txt
Genius Cleaner simplifies the Genius.com user interface by hiding ads, sidebars, recommendations, and other clutter while preserving song lyrics, album artwork, and core content. Users can customize which elements to hide through granular settings, enabling a distraction-free reading experience focused on lyrics.
```

_Character count: ~320_

---

### Permission Justifications

#### storage Justification

```txt
Used to persist user preferences locally on the device. This includes: which elements to hide/show (ads, recommendations, Q&A sections, footer, etc.), page-specific settings for song/album/artist pages, visual preferences (wide content mode, cleaner typography), and the global enable/disable state. Settings sync across devices via Chrome's built-in sync feature. No data is transmitted to external servers.
```

#### activeTab Justification

```txt
Required to apply CSS classes to the current Genius.com tab based on user settings. When the user visits a Genius.com page, the extension reads the page structure and applies CSS classes to the body element to hide/show elements according to the user's preferences. Access is only granted for the active tab and only on genius.com domains.
```

#### downloads Justification

```txt
This permission is declared but not actively used in the current version. It may be used in future versions for exporting settings or other user-initiated download features. Currently, no download functionality is implemented.
```

#### Host Permission Justification (genius.com)

```txt
The extension requires host permission for *://*.genius.com/* because it modifies the appearance of Genius.com pages by hiding elements based on user preferences. The content script injects CSS classes into the page DOM to control visibility of ads, sidebars, recommendations, and other UI elements. Without this permission, the extension could not fulfill its core purpose of cleaning up the Genius.com interface.
```

---

### Remote Code

**Selection:** No, I am not using remote code

**Justification:**

```txt
Genius Cleaner does not use any remote code. All JavaScript and CSS are bundled locally within the extension package. There are no external script references, no dynamic imports from CDNs, and no use of eval() or similar runtime code execution. The extension is fully self-contained and operates entirely offline after installation.
```

---

### Data Usage

**Checkboxes:** Leave ALL checkboxes UNCHECKED

Genius Cleaner does not collect any of the listed data types:

- ❌ Personally identifiable information
- ❌ Health information
- ❌ Financial and payment information
- ❌ Authentication information
- ❌ Personal communications
- ❌ Location
- ❌ Web history
- ❌ User activity
- ❌ Website content

**Certifications:** CHECK ALL THREE:

- ✅ I do not sell or transfer user data to third parties, outside of the approved use cases
- ✅ I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- ✅ I do not use or transfer user data to determine creditworthiness or for lending purposes

---

### Privacy Policy URL

```
https://genius-cleaner.miguelcorderocollar.com/privacy.html
```

---

### Testing Instructions

```txt
No setup required. Install the extension and navigate to any Genius.com page (song, album, or artist page). The extension will automatically apply your settings to hide clutter. Click the extension icon in the toolbar to access the popup and toggle settings. Right-click the extension icon and select Options for detailed settings. Test the keyboard shortcut Ctrl+Shift+K (Cmd+Shift+K on Mac) to toggle the cleaner on/off. Verify that lyrics and core content remain visible while ads, recommendations, and other clutter are hidden.
```

_Character count: ~550_
