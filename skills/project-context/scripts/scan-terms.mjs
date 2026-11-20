// Scan text files for project- or vendor-specific terms.
// Usage: node scan-terms.mjs <file-or-dir> --terms=projectname,vendor,product
// Exit 1 when any term is found (word-boundary, case-insensitive).

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const target = path.resolve(argv.find((a) => !a.startsWith('--')) || '.');
const termArg = (argv.find((a) => a.startsWith('--terms=')) || '').slice('--terms='.length);
const terms = termArg.split(',').map((t) => t.trim()).filter(Boolean);

if (!terms.length) {
  console.error('usage: node scan-terms.mjs <file-or-dir> --terms=term1,term2');
  process.exit(2);
}

const SKIP_DIRS = new Set(['node_modules', 'vendor', '.git', 'dist', 'build', 'target', 'venv', '.venv', '__pycache__']);
const TEXT = /\.(md|mdx|txt|ya?ml|json|toml|mjs|js|ts|php|py)$/i;

const files = [];
(function walk(p) {
  const stat = fs.statSync(p);
  if (stat.isFile()) {
    if (TEXT.test(p)) files.push(p);
    return;
  }
  for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    walk(path.join(p, entry.name));
  }
})(target);

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const patterns = terms.map((t) => ({
  term: t,
  re: new RegExp(`(?<![\\p{L}\\p{N}_])${escape(t)}(?![\\p{L}\\p{N}_])`, 'giu'),
}));

let hits = 0;
for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const { term, re } of patterns) {
      re.lastIndex = 0;
      if (re.test(line)) {
        hits += 1;
        console.log(`${path.relative(process.cwd(), file)}:${i + 1}: [${term}] ${line.trim()}`);
      }
    }
  });
}

console.log(`\nfiles: ${files.length}  terms: ${terms.length}  hits: ${hits}`);
process.exit(hits ? 1 : 0);
