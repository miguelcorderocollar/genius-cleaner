import * as esbuild from 'esbuild';
import { mkdirSync } from 'fs';

console.log('Starting watch mode...');

// Common build options
const commonOptions = {
  bundle: true,
  format: 'iife',
  target: ['chrome88'],
  minify: false,
  sourcemap: true,
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

async function watch() {
  try {
    // Ensure dist directory exists
    mkdirSync('extension/dist', { recursive: true });

    // Create contexts for each build
    const contexts = await Promise.all(
      builds.map((config) =>
        esbuild.context({
          ...commonOptions,
          ...config,
        })
      )
    );

    // Start watching all contexts
    await Promise.all(contexts.map((ctx) => ctx.watch()));

    console.log('Watching for changes...');
    console.log('Press Ctrl+C to stop.');
  } catch (error) {
    console.error('Watch failed:', error);
    process.exit(1);
  }
}

watch();
