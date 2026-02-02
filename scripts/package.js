import { execSync } from 'child_process';
import { createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';

// Read package.json for version
const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
const version = pkg.version;

console.log(`Packaging Genius Cleaner v${version}...`);

// Run production build first
console.log('\n1. Running production build...');
try {
  execSync('node build.js --production', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed!');
  process.exit(1);
}

// Verify required files exist
console.log('\n2. Verifying required files...');
const requiredFiles = [
  'extension/manifest.json',
  'extension/dist/content.js',
  'extension/dist/popup.js',
  'extension/dist/options.js',
  'extension/popup.html',
  'extension/options.html',
  'extension/popup.css',
  'extension/options.css',
];

const missingFiles = requiredFiles.filter((file) => !existsSync(file));
if (missingFiles.length > 0) {
  console.error('Missing required files:');
  missingFiles.forEach((file) => console.error(`  - ${file}`));
  process.exit(1);
}
console.log('All required files present.');

// Check for source maps (should not be in production)
console.log('\n3. Checking for source maps...');
const distFiles = readdirSync('extension/dist');
const sourceMaps = distFiles.filter((f) => f.endsWith('.map'));
if (sourceMaps.length > 0) {
  console.warn('Warning: Source maps found in dist/ (will be excluded from package):');
  sourceMaps.forEach((f) => console.warn(`  - ${f}`));
}

// Create packages directory
const packagesDir = 'packages';
mkdirSync(packagesDir, { recursive: true });

// Create ZIP file
console.log('\n4. Creating ZIP package...');
const zipName = `genius-cleaner-${version}.zip`;
const zipPath = join(packagesDir, zipName);

// Use system zip command (more reliable)
try {
  // Change to extension directory and create zip
  execSync(`cd extension && zip -r ../${zipPath} . -x "*.map" -x ".DS_Store" -x "*.log"`, {
    stdio: 'pipe',
  });

  // Get file size
  const stats = statSync(zipPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

  console.log(`\nPackage created: ${zipPath}`);
  console.log(`Size: ${sizeMB} MB`);

  if (stats.size > 10 * 1024 * 1024) {
    console.warn('\nWarning: Package exceeds 10MB!');
  }

  console.log('\nPackage is ready for Chrome Web Store upload.');
} catch (error) {
  console.error('Failed to create ZIP:', error.message);
  process.exit(1);
}
