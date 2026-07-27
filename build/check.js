#!/usr/bin/env node
'use strict';

/** Post-build sanity check: dead links, headings, alt text, anchors, schema. */

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const htmlFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
let errors = 0;
let warns = 0;
const err = (m) => { console.log('  ERROR  ' + m); errors++; };
const warn = (m) => { console.log('  warn   ' + m); warns++; };

// Collect every id in every page so cross-page #anchors can be verified.
const idsByFile = {};
for (const f of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  idsByFile[f] = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
}

for (const f of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');

  // exactly one h1
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) err(`${f}: expected 1 <h1>, found ${h1s}`);

  // title + description present
  if (!/<title>[^<]{10,}<\/title>/.test(html)) err(`${f}: missing or short <title>`);
  const desc = html.match(/name="description" content="([^"]*)"/);
  if (!desc) err(`${f}: missing meta description`);
  else if (desc[1].length < 70) warn(`${f}: meta description only ${desc[1].length} chars`);
  else if (desc[1].length > 175) warn(`${f}: meta description ${desc[1].length} chars (long)`);

  // every img needs alt + dimensions
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\salt="/.test(tag)) err(`${f}: <img> without alt — ${tag.slice(0, 80)}`);
    if (!/\swidth="/.test(tag) || !/\sheight="/.test(tag))
      warn(`${f}: <img> without width/height — ${tag.slice(0, 70)}`);
  }

  // internal links resolve
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) {
      if (href.startsWith('#') && href.length > 1) {
        const id = decodeURIComponent(href.slice(1));
        if (!idsByFile[f].has(id)) err(`${f}: anchor ${href} has no matching id`);
      }
      continue;
    }
    const [file, hash] = href.split('#');
    if (!file) continue;
    const target = path.join(ROOT, file);
    if (!fs.existsSync(target)) { err(`${f}: dead link -> ${href}`); continue; }
    if (hash && file.endsWith('.html') && idsByFile[file] && !idsByFile[file].has(hash))
      err(`${f}: dead anchor -> ${href}`);
  }

  // JSON-LD must parse
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { err(`${f}: invalid JSON-LD — ${e.message}`); }
  }

  // aria wiring
  for (const m of html.matchAll(/aria-controls="([^"]+)"/g)) {
    if (!idsByFile[f].has(m[1])) err(`${f}: aria-controls="${m[1]}" has no matching id`);
  }

  // unresolved template leftovers
  if (/\[object Object\]|undefined"|>undefined</.test(html))
    err(`${f}: contains "undefined" or "[object Object]" — template bug`);

  // referenced local assets exist
  for (const m of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) {
    if (!fs.existsSync(path.join(ROOT, m[1]))) err(`${f}: missing asset -> ${m[1]}`);
  }
}

// every page reachable from the home page or the shared footer
const homeHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const linked = new Set([...homeHtml.matchAll(/href="([a-z0-9-]+\.html)/g)].map((m) => m[1]));
for (const f of htmlFiles) {
  if (f === 'index.html' || f === '404.html') continue;
  if (!linked.has(f)) warn(`${f}: not linked from index.html`);
}

console.log(`\n  Checked ${htmlFiles.length} pages · ${errors} errors · ${warns} warnings\n`);
process.exit(errors ? 1 : 0);
