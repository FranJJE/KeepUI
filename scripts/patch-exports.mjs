/**
 * patch-exports.mjs
 *
 * Adds CSS asset entries to the `exports` field of dist/keep-ui/package.json
 * after ng-packagr has generated it. ng-packagr only adds JS entry points;
 * CSS files must be registered manually so that bundlers (esbuild, webpack)
 * can resolve @import '@keepui/ui/styles' correctly using the "style"
 * export condition.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = resolve(__dirname, '../dist/keep-ui/package.json');

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

const cssExports = {
  // @import '@keepui/ui/styles'  →  styles/index.css
  './styles': {
    style: './styles/index.css',
    default: './styles/index.css',
  },
  // @import '@keepui/ui/styles/index.css'
  './styles/index.css': {
    style: './styles/index.css',
    default: './styles/index.css',
  },
  // @import '@keepui/ui/styles/themes.css'
  './styles/themes.css': {
    style: './styles/themes.css',
    default: './styles/themes.css',
  },
  // @import '@keepui/ui/styles/prebuilt.css'
  './styles/prebuilt.css': {
    style: './styles/prebuilt.css',
    default: './styles/prebuilt.css',
  },
};

pkg.exports = { ...pkg.exports, ...cssExports };

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

console.log('✅  CSS exports patched in dist/keep-ui/package.json');
console.log('   Added entries:', Object.keys(cssExports).join(', '));

