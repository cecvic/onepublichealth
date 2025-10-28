#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const nativePath = path.join(projectRoot, 'node_modules', 'rollup', 'dist', 'native.js');

if (!fs.existsSync(nativePath)) {
  console.warn('[patch-rollup-native] rollup/dist/native.js not found, skipping patch.');
  process.exit(0);
}

const marker = 'Attempted to fall back to local rollup.js implementation';
let contents = fs.readFileSync(nativePath, 'utf8');

if (contents.includes(marker)) {
  console.log('[patch-rollup-native] patch already applied.');
  process.exit(0);
}

const pattern = /const { parse, parseAsync, xxhashBase64Url, xxhashBase36, xxhashBase16 } = requireWithFriendlyError\([\s\S]*?\);\n/;

if (!pattern.test(contents)) {
  console.warn('[patch-rollup-native] unexpected file contents, skipping patch.');
  process.exit(0);
}

const replacementLines = [
  'let rollupBindings;',
  'try {',
  '\trollupBindings = requireWithFriendlyError(',
  '\t\texistsSync(path.join(__dirname, localName)) ? localName : `@rollup/rollup-${packageBase}`',
  '\t);',
  '} catch (nativeError) {',
  '\ttry {',
  "\t\trollupBindings = require('./rollup.js');",
  '\t} catch (fallbackError) {',
  "\t\tnativeError.message += '\\n\\nAttempted to fall back to local rollup.js implementation, but it could not be loaded: ' + fallbackError.message;",
  '\t\tnativeError.cause = fallbackError;',
  '\t\tthrow nativeError;',
  '\t}',
  "\tnativeError.message += '\\n\\nAttempted to fall back to local rollup.js implementation after the native binary was missing.';",
  '}',
  '',
  'const { parse, parseAsync, xxhashBase64Url, xxhashBase36, xxhashBase16 } = rollupBindings;',
  ''
];

const replacement = replacementLines.join('\n');

contents = contents.replace(pattern, replacement);

fs.writeFileSync(nativePath, contents);

console.log('[patch-rollup-native] applied rollup.js fallback patch.');
