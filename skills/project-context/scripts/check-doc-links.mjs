// Markdown link integrity + reachability checker for project docs.
// Usage: node check-doc-links.mjs [root] [--seed=README.md,AGENTS.md,docs/README.md]
// Exit 1 on broken links or absolute paths; reachability and directory links are warnings.

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const rootArg = argv.find((a) => !a.startsWith('--')) || '.';
const root = path.resolve(rootArg);
const seedArg = (argv.find((a) => a.startsWith('--seed=')) || '').slice('--seed='.length);

const SKIP_DIRS = new Set([
  'node_modules', 'vendor', '.git', 'dist', 'build', 'target',
  'venv', '.venv', '__pycache__', 'dumps', '.agents', '.cursor',
]);

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && /\.md$/i.test(entry.name)) files.push(path.normalize(full));
  }
})(root);

const rel = (p) => path.relative(root, p).replace(/\\/g, '/');
const linkRe = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

const broken = [];
const absolute = [];
const directoryLinks = [];
const adjacency = new Map(files.map((f) => [f, []]));
let internal = 0;

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(linkRe)) {
    const raw = match[1].trim();
    if (/^(https?:|mailto:|tel:|data:)/i.test(raw)) continue;
    if (raw.startsWith('#')) continue;
    internal += 1;

    if (/^[a-zA-Z]:[\\/]/.test(raw) || raw.startsWith('file:///')) {
      absolute.push({ from: rel(file), target: raw });
      continue;
    }

    let clean;
    try {
      clean = decodeURIComponent(raw.split('#')[0]);
    } catch {
      clean = raw.split('#')[0];
    }
    if (!clean) continue;

    const resolved = path.normalize(path.resolve(path.dirname(file), clean));
    let stat;
    try {
      stat = fs.statSync(resolved);
    } catch {
      broken.push({ from: rel(file), target: raw });
      continue;
    }
    if (stat.isDirectory()) {
      // Only warn when the directory actually holds docs: a path link into
      // source/assets is not part of the documentation graph.
      let hasDocs = false;
      try {
        hasDocs = fs.readdirSync(resolved, { withFileTypes: true })
          .some((e) => e.isFile() && /\.md$/i.test(e.name));
      } catch { /* unreadable: treat as a plain path link */ }
      if (hasDocs) directoryLinks.push({ from: rel(file), target: raw });
      continue;
    }
    if (adjacency.has(resolved)) adjacency.get(file).push(resolved);
  }
}

const defaults = ['README.md', 'AGENTS.md', 'docs/README.md', 'docs/CONTEXT.md'];
const requested = seedArg ? seedArg.split(',').map((s) => s.trim()).filter(Boolean) : defaults;
const seeds = requested
  .map((s) => path.normalize(path.join(root, s)))
  .filter((f) => adjacency.has(f));

const seen = new Set(seeds);
const queue = [...seeds];
while (queue.length) {
  for (const next of adjacency.get(queue.shift()) || []) {
    if (!seen.has(next)) {
      seen.add(next);
      queue.push(next);
    }
  }
}
const unreachable = files.filter((f) => !seen.has(f));

const line = (s) => console.log(s);
line(`root: ${root}`);
line(`docs: ${files.length}  internal links: ${internal}`);
line(`broken: ${broken.length}`);
for (const b of broken) line(`  ${b.from} -> ${b.target}`);
line(`absolute paths: ${absolute.length}`);
for (const a of absolute) line(`  ${a.from} -> ${a.target}`);
line(`directory links (link the hub file instead): ${directoryLinks.length}`);
for (const d of directoryLinks.slice(0, 20)) line(`  ${d.from} -> ${d.target}`);
line(`seeds: ${seeds.map(rel).join(', ') || '(none matched)'}`);
line(`unreachable: ${unreachable.length} / ${files.length}`);
for (const u of unreachable.slice(0, 40)) line(`  ${rel(u)}`);

process.exit(broken.length || absolute.length ? 1 : 0);
