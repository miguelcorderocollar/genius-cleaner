#!/usr/bin/env python3
"""
Generate Genius Cleaner icons at all required sizes.

The icon features a simplified "clean/broom" design with Genius brand colors.
- Enabled state: Yellow (#FFFF64) background with black icon
- Disabled state: Gray (#6B7280) background with white icon

Requirements:
    pip install pillow cairosvg
"""

import argparse
from pathlib import Path

try:
    import cairosvg
    HAS_CAIROSVG = True
except ImportError:
    HAS_CAIROSVG = False

from PIL import Image, ImageDraw

# Genius brand colors
GENIUS_YELLOW = "#FFFF64"
GENIUS_YELLOW_RGB = (255, 255, 100)
GENIUS_BLACK = "#121212"
GENIUS_BLACK_RGB = (18, 18, 18)

# Disabled state colors
GRAY = "#6B7280"
GRAY_RGB = (107, 114, 128)
WHITE = "#FFFFFF"
WHITE_RGB = (255, 255, 255)

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
ICONS_DIR = PROJECT_ROOT / "extension" / "icons"
IMAGES_DIR = PROJECT_ROOT / "extension" / "images"

SIZES = [16, 48, 128]


def design_cleaner_icon_svg(size: int, bg_color: str, icon_color: str) -> str:
    """
    Create a simplified "minus/clean" icon representing simplification.
    
    Design: Rounded square background with a horizontal line (minus sign)
    representing "removing clutter" or "simplifying".
    
    Args:
        size: Icon size in pixels
        bg_color: Background color (hex string)
        icon_color: Icon stroke color (hex string)
    """
    radius = int(size * 0.2)
    
    # Icon positioning
    padding = size * 0.25
    line_y = size / 2
    line_start_x = padding
    line_end_x = size - padding
    
    # Stroke width scales with size
    stroke = max(2, int(size * 0.12))
    
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">
  <!-- Background rounded square -->
  <rect width="{size}" height="{size}" rx="{radius}" fill="{bg_color}"/>
  
  <!-- Minus/simplify line -->
  <line x1="{line_start_x}" y1="{line_y}" x2="{line_end_x}" y2="{line_y}"
        stroke="{icon_color}" stroke-width="{stroke}" 
        stroke-linecap="round"/>
</svg>'''


def design_cleaner_icon_pillow(size: int, bg_color_rgb: tuple, icon_color_rgb: tuple) -> Image.Image:
    """
    Create the cleaner icon using Pillow (fallback when cairosvg unavailable).
    
    Args:
        size: Icon size in pixels
        bg_color_rgb: Background color as RGB tuple
        icon_color_rgb: Icon color as RGB tuple
    """
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background rounded rectangle
    radius = int(size * 0.2)
    draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=radius, fill=bg_color_rgb)
    
    # Minus line
    padding = size * 0.25
    line_y = size / 2
    stroke = max(2, int(size * 0.12))
    
    # Draw thick line
    draw.line(
        [(padding, line_y), (size - padding, line_y)],
        fill=icon_color_rgb,
        width=stroke
    )
    
    return img


def generate_icon(size: int, output_path: Path, bg_color: str, bg_color_rgb: tuple, 
                  icon_color: str, icon_color_rgb: tuple) -> None:
    """
    Generate icon at specified size.
    
    Args:
        size: Icon size in pixels
        output_path: Where to save the icon
        bg_color: Background color as hex string (for SVG)
        bg_color_rgb: Background color as RGB tuple (for Pillow)
        icon_color: Icon color as hex string (for SVG)
        icon_color_rgb: Icon color as RGB tuple (for Pillow)
    """
    if HAS_CAIROSVG:
        svg_content = design_cleaner_icon_svg(size, bg_color, icon_color)
        png_data = cairosvg.svg2png(bytestring=svg_content.encode('utf-8'))
        with open(output_path, 'wb') as f:
            f.write(png_data)
    else:
        img = design_cleaner_icon_pillow(size, bg_color_rgb, icon_color_rgb)
        img.save(output_path, 'PNG')


def generate_all_icons() -> None:
    """Generate all icon sizes in both enabled and disabled states."""
    print("\n🎨 Generating Genius Cleaner icons...")
    
    ICONS_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    
    # Generate enabled icons (yellow background, black icon)
    print("\n  ✨ Enabled state (Genius Yellow):")
    for size in SIZES:
        output_path = ICONS_DIR / f"icon{size}.png"
        generate_icon(
            size, output_path,
            GENIUS_YELLOW, GENIUS_YELLOW_RGB,
            GENIUS_BLACK, GENIUS_BLACK_RGB
        )
        print(f"    ✓ icon{size}.png")
    
    # Generate disabled icons (gray background, white icon)
    print("\n  ⭕ Disabled state (Gray):")
    for size in SIZES:
        output_path = ICONS_DIR / f"icon{size}-disabled.png"
        generate_icon(
            size, output_path,
            GRAY, GRAY_RGB,
            WHITE, WHITE_RGB
        )
        print(f"    ✓ icon{size}-disabled.png")
    
    # Generate logo.svg (enabled state at 128px)
    print("\n  🎯 Logo:")
    svg_content = design_cleaner_icon_svg(128, GENIUS_YELLOW, GENIUS_BLACK)
    svg_path = IMAGES_DIR / "logo.svg"
    with open(svg_path, 'w') as f:
        f.write(svg_content)
    print(f"    ✓ logo.svg")
    
    # Generate favicon for web
    print("\n  🌐 Web favicon:")
    web_dir = PROJECT_ROOT / "web"
    web_dir.mkdir(parents=True, exist_ok=True)
    favicon_path = web_dir / "favicon.png"
    generate_icon(
        128, favicon_path,
        GENIUS_YELLOW, GENIUS_YELLOW_RGB,
        GENIUS_BLACK, GENIUS_BLACK_RGB
    )
    print(f"    ✓ favicon.png")


def main():
    parser = argparse.ArgumentParser(description='Generate Genius Cleaner icons')
    args = parser.parse_args()
    
    print("=" * 50)
    print("Genius Cleaner Icon Generator")
    print("=" * 50)
    
    if not HAS_CAIROSVG:
        print("⚠️  cairosvg not installed, using Pillow fallback")
        print("   For best quality: pip install cairosvg")
    
    generate_all_icons()
    print(f"\n✅ All icons generated successfully!")


if __name__ == "__main__":
    main()
