# Genius Cleaner Agent Instructions

You are the Genius Cleaner Agent, an expert in Chrome Extension development (Manifest V3) and CSS-based UI manipulation.

## Mission

Maintain and extend the Genius Cleaner extension, which simplifies the Genius.com UI by hiding clutter while preserving core content (lyrics, tracklists, artist info).

## Core Directives

1. **Test-First Development:** Never refactor or add features without verifying behavior through tests (Vitest).
2. **Modular Architecture:** Split files larger than 300 lines. Use shared modules in `extension/shared/`.
3. **Chrome Extension Expertise:** Follow security and performance best practices for Manifest V3.
4. **CSS Selector Strategy:** Use partial class matching (`[class*="ClassName"]`) since Genius uses hashed class names.
5. **Git Safety:** NEVER commit changes unless the user explicitly asks you to.

## Project Structure

```
genius-cleaner/
├── extension/           # Chrome extension source
│   ├── content.js       # Applies CSS classes based on settings
│   ├── background.js    # Service worker for icon/messaging
│   ├── popup/           # Popup UI modules
│   ├── options/         # Options page modules
│   ├── shared/          # Defaults, storage utilities
│   └── styles/          # CSS rules for hiding elements
├── tests/unit/          # Vitest unit tests
├── scripts/             # Build and utility scripts
└── web/                 # Promotional website
```

## Development Workflows

### Build & Watch

```bash
pnpm run build         # Development build
pnpm run build:prod    # Production build (minified)
pnpm run watch         # Auto-rebuild on changes
```

### Testing

```bash
pnpm test              # Run tests in watch mode
pnpm run test:run      # Run tests once
pnpm run test:coverage # Run with coverage report
```

### Linting & Formatting

```bash
pnpm run lint          # Check for linting issues
pnpm run lint:fix      # Auto-fix linting issues
pnpm run format        # Format all files with Prettier
pnpm run format:check  # Check formatting without changes
```

### Packaging

```bash
pnpm run package       # Create ZIP for Chrome Web Store
```

## Adding New Hide Rules

When adding new sections to hide:

1. **Add setting to `extension/shared/defaults.js`:**

   ```javascript
   export const DEFAULTS = {
     // ...existing settings
     hideNewSection: true,
   };
   ```

2. **Add label in `SETTING_LABELS`:**

   ```javascript
   hideNewSection: 'Hide New Section',
   ```

3. **Add schema entry:**

   ```javascript
   hideNewSection: 'boolean',
   ```

4. **Add CSS class mapping in `extension/content.js`:**

   ```javascript
   const SETTING_TO_CLASS = {
     // ...existing mappings
     hideNewSection: 'new-section',
   };
   ```

5. **Add CSS rule in `extension/styles/cleaner.css`:**

   ```css
   .gc-hide-new-section [class*='NewSection__Container'] {
     display: none !important;
   }
   ```

6. **Add checkbox in `extension/options.html`:**

   ```html
   <label class="setting-card">
     <div class="setting-info">
       <span class="setting-name">Hide New Section</span>
       <span class="setting-desc">Description here</span>
     </div>
     <input type="checkbox" id="hideNewSection" class="setting-checkbox" />
   </label>
   ```

7. **Add tests in `tests/unit/shared/defaults.test.js`**

## CSS Selector Guidelines

Genius uses React with hashed class names like `StickyNav-desktop__Container-sc-72d92c60-0`.

### Best Practices

1. **Use partial matching:** `[class*="ComponentName__"]`
2. **Target multiple variants:** Include desktop and mobile selectors
3. **Use `!important`:** Override Genius styles reliably
4. **Test on live pages:** Class names may change with updates

### Example Pattern

```css
/* Target all variants of a component */
.gc-hide-section [class*='SectionName__Container'],
.gc-hide-section [class*='SectionName-desktop__'],
.gc-hide-section [class*='SectionName-mobile__'] {
  display: none !important;
}
```

## Pull Request Workflow

When the user says **"create PR"**, automatically:

1. **Check branch & commits:** Run `git branch --show-current`, `git log main..HEAD --oneline`
2. **Generate title:** Use conventional commit format (e.g., `feat:`, `fix:`, `refactor:`)
3. **Generate body:** Create description with changes and testing notes
4. **Create PR:** Run `gh pr create --title "<title>" --body "<body>"`

## Packaging for Chrome Web Store

The packaging script (`scripts/package.js`) prepares the extension:

1. Runs production build automatically
2. Verifies all required files exist
3. Excludes source maps from ZIP
4. Validates manifest.json references
5. Creates versioned ZIP in `packages/` directory

Run `pnpm run package` before submitting to Chrome Web Store.

## Icon Generation

Run `python3 scripts/generate_icons.py` to regenerate icons after design changes.

- Enabled state: Genius yellow (#FFFF64) background, black icon
- Disabled state: Gray (#6B7280) background, white icon
- Sizes: 16px, 48px, 128px

## Debugging Tips

1. **Load unpacked extension:** Go to `chrome://extensions/`, enable Developer mode, load `extension/` folder
2. **View content script logs:** Open DevTools on a Genius page, check Console
3. **Test CSS selectors:** Use DevTools Elements panel to verify selectors match
4. **Check storage:** Run `chrome.storage.sync.get(null, console.log)` in background service worker

## Common Issues

### CSS not applying

- Check if `genius-cleaner-enabled` class is on body
- Verify the setting is enabled in storage
- Use DevTools to test selector on live page

### Icons not updating

- Rebuild with `pnpm run build`
- Regenerate icons with `python3 scripts/generate_icons.py`
- Reload extension in `chrome://extensions/`

### Storage not syncing

- Check for errors in background service worker console
- Verify `storage` permission in manifest.json
