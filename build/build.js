#!/usr/bin/env node
'use strict';

/**
 * Vocryn AI static site generator. Zero dependencies.
 *
 *   node build/build.js
 *
 * Reads content from build/lib/data.js, renders every page through
 * build/lib/layout.js, and writes plain .html files to the project root
 * alongside sitemap.xml, robots.txt, the manifest and the favicon.
 * Deployment never needs Node — only these emitted static files.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const { page } = require('./lib/layout');
const D = require('./lib/data');
const { site } = D;

const home = require('./pages/home');
const core = require('./pages/core');
const co = require('./pages/company');

const pages = [
  home,
  core.services,
  core.useCases,
  core.howItWorks,
  core.integrations,
  core.pricing,
  core.roi,
  core.security,
  core.results,
  co.about,
  co.contact,
  co.demo,
  co.faq,
  co.blog,
  ...co.postPages,
  co.privacy,
  co.terms,
  co.hipaa,
  co.notFound,
];

/* ------------------------------------------------------------------ write */

const write = (rel, content) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  return Buffer.byteLength(content, 'utf8');
};

let total = 0;
const written = [];

for (const p of pages) {
  const html = page(p);
  const bytes = write(`${p.slug}.html`, html);
  total += bytes;
  written.push([`${p.slug}.html`, bytes]);
}

/* --------------------------------------------------------------- favicon */

// The full lemniscate turns to mush at 16px, so the favicon is a filled badge
// carrying the same waveform and the same blue -> purple -> orange gradient.
write(
  'favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <rect width="40" height="40" rx="11" fill="url(#g)"/>
  <path d="M9 21.5v-3M14 25v-10M20 28.5v-17M26 25v-10M31 21.5v-3"
        stroke="#fff" stroke-width="2.8" stroke-linecap="round"/>
  <defs><linearGradient id="g" x1="0" y1="0" x2="40" y2="40">
    <stop stop-color="#3A49CE"/><stop offset=".55" stop-color="#7C3AED"/>
    <stop offset="1" stop-color="#FF8125"/>
  </linearGradient></defs>
</svg>`
);

/* -------------------------------------------------------------- manifest */

write(
  'manifest.webmanifest',
  JSON.stringify(
    {
      name: `${site.name} — AI Receptionist for Clinics`,
      short_name: 'Vocryn AI',
      description: site.tagline,
      start_url: '/',
      display: 'standalone',
      background_color: '#FFFFFF',
      theme_color: '#3A49CE',
      icons: [
        { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: '/assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    null,
    2
  )
);

/* ---------------------------------------------------------------- robots */

write(
  'robots.txt',
  `# ${site.name}
User-agent: *
Allow: /
Disallow: /404.html

# AI crawlers are welcome — we would rather be quoted accurately.
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /

Sitemap: ${site.url}/sitemap.xml
`
);

/* --------------------------------------------------------------- sitemap */

const PRIORITY = {
  index: '1.0',
  services: '0.9',
  'use-cases': '0.9',
  pricing: '0.9',
  demo: '0.9',
  'how-it-works': '0.8',
  integrations: '0.8',
  security: '0.8',
  results: '0.8',
  'roi-calculator': '0.8',
  faq: '0.7',
  blog: '0.7',
  about: '0.6',
  contact: '0.6',
};
const TODAY = '2026-07-27';

const urls = pages
  .filter((p) => p.slug !== '404')
  .map((p) => {
    const loc = p.slug === 'index' ? `${site.url}/` : `${site.url}/${p.slug}.html`;
    const pr = PRIORITY[p.slug] || '0.5';
    const freq = pr >= '0.8' ? 'weekly' : 'monthly';
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${pr}</priority>
  </url>`;
  })
  .join('\n');

write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
);

/* -------------------------------------------------------- host configs */

write(
  '_redirects',
  `# Netlify — pretty URLs and a real 404
/home            /index.html      301
/calendar        /demo.html       301
/book-a-demo     /demo.html       301
/services/*      /services.html   301
/use-cases/*     /use-cases.html  301
/*               /404.html        404
`
);

write(
  'netlify.toml',
  `[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
`
);

/* ---------------------------------------------------------------- report */

const kb = (b) => (b / 1024).toFixed(1) + ' KB';
console.log(`\n  Vocryn AI — built ${written.length} pages\n`);
written
  .sort((a, b) => b[1] - a[1])
  .forEach(([f, b]) => console.log(`  ${f.padEnd(34)} ${kb(b).padStart(9)}`));
console.log(`\n  ${'HTML total'.padEnd(34)} ${kb(total).padStart(9)}`);
console.log('  + favicon.svg, manifest.webmanifest, robots.txt, sitemap.xml, _redirects, netlify.toml\n');
