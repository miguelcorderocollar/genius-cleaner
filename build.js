import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const isProduction = process.argv.includes('--production');

console.log(`Building in ${isProduction ? 'production' : 'development'} mode...`);

// Common build options
const commonOptions = {
  bundle: true,
  format: 'iife',
  target: ['chrome88'],
  minify: isProduction,
  sourcemap: !isProduction,
};

// Build configurations
const builds = [
  {
    entryPoints: ['extension/content.js'],
    outfile: 'extension/dist/content.js',
  },
  {
    entryPoints: ['extension/popup/index.js'],
    outfile: 'extension/dist/popup.js',
  },
  {
    entryPoints: ['extension/options/index.js'],
    outfile: 'extension/dist/options.js',
  },
];

async function build() {
  try {
    // Ensure dist directory exists
    mkdirSync('extension/dist', { recursive: true });

    // Run all builds in parallel
    await Promise.all(
      builds.map((config) =>
        esbuild.build({
          ...commonOptions,
          ...config,
        })
      )
    );

    console.log('Build completed successfully!');

    // Copy CSS files to dist
    const cssFiles = [{ src: 'extension/styles/cleaner.css', dest: 'extension/dist/cleaner.css' }];

    for (const { src, dest } of cssFiles) {
      try {
        const css = readFileSync(src, 'utf-8');
        mkdirSync(dirname(dest), { recursive: true });
        writeFileSync(dest, css);
        console.log(`Copied ${src} -> ${dest}`);
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
        console.log(`Skipping ${src} (file not found)`);
      }
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
