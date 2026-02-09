# Genius Cleaner

<div align="center">
  <img src="extension/images/logo.svg" alt="Genius Cleaner Logo" width="128"/>
</div>

<div align="center">
  <p>A Chrome extension that simplifies Genius.com UI by hiding ads, sidebars, and clutter while preserving lyrics and core content.</p>
</div>

## Features

### What It Hides

- **Advertisements** - All ads, banners, and sponsored content
- **Recommended Songs** - "You might also like" sidebar
- **Q&A Section** - Questions and answers section
- **Footer** - Page footer
- **Sticky Elements** - Floating ads and sticky bars
- **Pyong Button** - The appreciation button
- **And more...** - Configurable per page type

### What It Keeps

- **Lyrics** - Full song lyrics with formatting
- **Album Art** - Cover images
- **Song/Album Info** - Title, artist, release date
- **Tracklists** - Album track listings (optional)
- **Annotations** - Genius annotations (optional)

### Core Features

- **Global Toggle** - Enable/disable with one click
- **Per-Section Control** - Choose exactly what to hide
- **Wide Content Mode** - Expand lyrics to full width
- **Cleaner Typography** - Improved font and spacing
- **Keyboard Shortcut** - `Ctrl+Shift+K` to toggle
- **Settings Sync** - Settings sync across devices

## Installation

### From Chrome Web Store

1. Visit the [Chrome Web Store page](#) (coming soon)
2. Click "Add to Chrome"
3. Visit any Genius.com page

### From Source (Development)

1. Clone the repository:

   ```bash
   git clone https://github.com/user/genius-cleaner.git
   cd genius-cleaner
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build the extension:

   ```bash
   pnpm run build
   ```

4. Load in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/` folder

## Usage

### Quick Actions (Popup)

Click the extension icon in your browser toolbar to access:

- **Global Toggle** - Enable/disable the cleaner
- **Quick Settings** - Toggle common options
- **All Settings** - Open the full settings page

### Settings Page

Right-click the extension icon and select "Options" to access:

- **Common Elements** - Ads, navigation, footer, sticky elements
- **Song Pages** - Recommendations, Q&A, about section, etc.
- **Album Pages** - Other albums, sidebar
- **Artist Pages** - Sidebar, social links
- **Visual Tweaks** - Wide content, cleaner typography

### Keyboard Shortcut

Press `Ctrl+Shift+K` (or `Cmd+Shift+K` on Mac) to toggle the cleaner on/off.

## Development

### Prerequisites

- Node.js 18+
- pnpm 10+
- Python 3.8+ (for icon generation)

### Commands

```bash
# Install dependencies
pnpm install

# Development build (with sourcemaps)
pnpm run build

# Production build (minified)
pnpm run build:prod

# Watch mode (auto-rebuild)
pnpm run watch

# Run tests
pnpm test

# Run tests once
pnpm run test:run

# Run tests with coverage
pnpm run test:coverage

# Lint code
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Format code
pnpm run format

# Package for Chrome Web Store
pnpm run package

# Generate icons
python3 scripts/generate_icons.py
```

### Project Structure

```
genius-cleaner/
├── extension/              # Chrome extension source
│   ├── content.js          # Applies CSS classes based on settings
│   ├── background.js       # Service worker
│   ├── manifest.json       # Extension manifest
│   ├── popup/              # Popup UI
│   ├── options/            # Settings page
│   ├── shared/             # Shared modules
│   │   ├── defaults.js     # Default settings
│   │   ├── storage.js      # Storage utilities
│   │   └── theme.css       # Theme variables
│   ├── styles/             # CSS rules
│   │   └── cleaner.css     # Hide rules
│   └── icons/              # Extension icons
├── tests/unit/             # Unit tests
├── scripts/                # Build scripts
│   ├── generate_icons.py   # Icon generator
│   ├── package.js          # Packaging script
│   └── watch.js            # Watch mode
├── web/                    # Promotional website
└── docs/                   # Documentation
```

## Architecture

### How It Works

1. **Content Script** (`content.js`) runs on Genius.com pages
2. **Loads Settings** from `chrome.storage.sync`
3. **Applies CSS Classes** to `<body>` based on settings
4. **CSS Rules** (`cleaner.css`) hide elements matching those classes

### CSS Strategy

Genius uses React with hashed class names (e.g., `StickyNav-desktop__Container-sc-72d92c60-0`). We use partial class matching to target elements reliably:

```css
.gc-hide-ads [class*='dfp_unit'] {
  display: none !important;
}
```

### Settings Storage

Settings are stored in `chrome.storage.sync` for cross-device sync. Values matching defaults are not stored to optimize storage space.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Submit a pull request

See [AGENTS.md](AGENTS.md) for development guidelines.

## Privacy

Genius Cleaner:

- **Does NOT collect any data**
- **Does NOT send data to external servers**
- **Does NOT track usage or analytics**
- **Only runs on Genius.com**
- **Settings sync via Chrome's built-in sync**

See [Privacy Policy](web/privacy.html) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Credits

- Icon design inspired by the Genius brand colors
- Built with modern Chrome Extension Manifest V3
- Testing with Vitest
- Bundling with esbuild
