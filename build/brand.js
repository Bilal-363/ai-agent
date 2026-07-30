#!/usr/bin/env node
'use strict';

/**
 * Brand asset generator.
 *
 *   node build/brand.js
 *
 * Renders the Vocryn Ai lockup (ribbon mark with the wordmark beneath) through
 * headless Chrome and writes a PNG at every size the social platforms ask for.
 *
 * Everything is derived from one source of truth — build/logo-src/mark-hi.png —
 * so changing the mark and re-running regenerates the whole kit consistently.
 *
 * Output: assets/brand/
 *   lockup/   master lockups, incl. transparent
 *   social/   per-platform profile pictures and covers
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'brand');
const MARK_B64 = fs.readFileSync(path.join(__dirname, 'logo-src', 'mark-hi.b64.txt'), 'utf8').trim();

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p));
if (!CHROME) { console.error('Chrome not found.'); process.exit(1); }

const PORT = 9477;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ themes */

const THEMES = {
  light: { bg: '#FFFFFF', word: '#0B1030', ai: '#B24C04', sub: '#666E92' },
  dark: { bg: 'linear-gradient(150deg,#0B1030,#141A4E 55%,#1E1638)', word: '#FFFFFF', ai: '#FF9D5C', sub: '#A3ACCE' },
  brand: { bg: 'linear-gradient(140deg,#3A49CE,#7C3AED 55%,#FF8125)', word: '#FFFFFF', ai: '#FFE2CC', sub: 'rgba(255,255,255,.78)' },
  transparent: { bg: 'transparent', word: '#0B1030', ai: '#B24C04', sub: '#666E92' },
};

/**
 * @param opts.w,h        canvas size
 * @param opts.theme      key of THEMES
 * @param opts.layout     'stacked' | 'horizontal' | 'mark'
 * @param opts.scale      fraction of the canvas the lockup should occupy
 * @param opts.tagline    show the positioning line under the wordmark
 */
function page({ w, h, theme, layout, scale, tagline }) {
  const t = THEMES[theme];
  // Size everything from the smaller axis so a lockup never overflows a banner.
  const base = layout === 'horizontal' ? Math.min(h, w / 3.6) : Math.min(w, h);
  const markW = Math.round(base * scale * (layout === 'horizontal' ? 1.05 : 1));
  const wordSize = Math.round(markW * (layout === 'horizontal' ? 0.30 : 0.225));
  const tagSize = Math.round(wordSize * 0.30);

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${w}px;height:${h}px;overflow:hidden}
  body{background:${t.bg};display:grid;place-items:center;
    font-family:'Plus Jakarta Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .lk{display:flex;align-items:center;
    flex-direction:${layout === 'horizontal' ? 'row' : 'column'};
    gap:${Math.round(markW * (layout === 'horizontal' ? 0.10 : 0.085))}px}
  .lk img{width:${markW}px;height:auto;display:block}
  .word{font-weight:800;font-size:${wordSize}px;line-height:1;letter-spacing:-.02em;
    color:${t.word};white-space:nowrap}
  .word b{color:${t.ai};font-weight:800}
  .tag{margin-top:${Math.round(tagSize * 0.75)}px;font-weight:700;font-size:${tagSize}px;
    letter-spacing:.16em;text-transform:uppercase;color:${t.sub};white-space:nowrap;
    text-align:${layout === 'horizontal' ? 'left' : 'center'}}
</style></head><body>
  <div class="lk">
    <img src="data:image/png;base64,${MARK_B64}" alt="">
    ${layout === 'mark' ? '' : `<div>
      <div class="word">VOCRYN <b>Ai</b></div>
      ${tagline ? `<div class="tag">AI Receptionist for Clinics</div>` : ''}
    </div>`}
  </div>
</body></html>`;
}

/* ------------------------------------------------------------------- sizes */

// Square avatars. Most platforms crop these to a circle, so the lockup is kept
// well inside the inscribed circle.
const SQUARES = [
  ['profile-1024', 1024, 1024, 'master / any platform'],
  ['profile-800-youtube', 800, 800, 'YouTube channel icon'],
  ['profile-500-facebook', 500, 500, 'Facebook page picture'],
  ['profile-500-whatsapp', 500, 500, 'WhatsApp Business'],
  ['profile-400-x', 400, 400, 'X (Twitter) profile'],
  ['profile-320-instagram', 320, 320, 'Instagram profile'],
  ['profile-300-linkedin', 300, 300, 'LinkedIn company logo'],
  ['profile-200-tiktok', 200, 200, 'TikTok profile'],
];

const APP_ICONS = [
  ['app-512', 512, 512, 'PWA maskable / Android'],
  ['app-192', 192, 192, 'PWA'],
  ['app-180-apple', 180, 180, 'Apple touch icon'],
];

// Covers. The lockup sits centre so it survives each platform's safe-area crop.
const COVERS = [
  ['cover-x-1500x500', 1500, 500, 'X (Twitter) header'],
  ['cover-facebook-820x312', 820, 312, 'Facebook page cover'],
  ['cover-linkedin-page-1128x191', 1128, 191, 'LinkedIn page cover'],
  ['cover-linkedin-personal-1584x396', 1584, 396, 'LinkedIn personal cover'],
  ['cover-youtube-2560x1440', 2560, 1440, 'YouTube channel art (safe area centred)'],
  ['share-og-1200x630', 1200, 630, 'Open Graph / link preview'],
];

/* --------------------------------------------------------------- rendering */

let ws, msgId = 0, session;
const pending = new Map();
const send = (m, p = {}, s = session) => {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method: m, params: p, ...(s ? { sessionId: s } : {}) }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
};

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vocryn-brand-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--force-color-profile=srgb', '--font-render-hinting=none',
  `--user-data-dir=${profile}`, `--remote-debugging-port=${PORT}`, 'about:blank',
], { stdio: 'ignore' });

async function shot(file, opts) {
  const { w, h, theme } = opts;
  await send('Emulation.setDeviceMetricsOverride',
    { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  // Transparent output needs the default page background cleared.
  await send('Emulation.setDefaultBackgroundColorOverride',
    theme === 'transparent' ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {});
  await send('Page.navigate', {
    url: 'data:text/html;charset=utf-8,' + encodeURIComponent(page(opts)),
  });
  await sleep(320);
  // Wait for the webfont; otherwise the wordmark renders in a fallback face.
  await send('Runtime.evaluate', {
    expression: 'document.fonts.ready.then(() => new Promise(r => setTimeout(r, 120)))',
    awaitPromise: true,
  });
  const r = await send('Page.captureScreenshot',
    { format: 'png', captureBeyondViewport: false });
  const dest = path.join(OUT, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(r.data, 'base64'));
  return fs.statSync(dest).size;
}

(async () => {
  let wsUrl;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      wsUrl = (await r.json()).webSocketDebuggerUrl;
    } catch (e) { await sleep(250); }
  }
  ws = new WebSocket(wsUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id); pending.delete(m.id);
      m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
    }
  });
  const { targetInfos } = await send('Target.getTargets', {}, null);
  ({ sessionId: session } = await send('Target.attachToTarget',
    { targetId: targetInfos.find((t) => t.type === 'page').targetId, flatten: true }, null));
  await send('Page.enable');
  await send('Runtime.enable');

  fs.rmSync(OUT, { recursive: true, force: true });
  const manifest = [];
  const add = async (file, opts, note) => {
    const bytes = await shot(file, opts);
    manifest.push({ file, w: opts.w, h: opts.h, note });
    process.stdout.write('.');
  };

  console.log('\n  Vocryn Ai brand kit\n');

  // Master lockups, generous canvas, all four themes.
  process.stdout.write('  lockups        ');
  for (const theme of ['light', 'dark', 'brand', 'transparent']) {
    await add(`lockup/lockup-stacked-${theme}.png`,
      { w: 1600, h: 1200, theme, layout: 'stacked', scale: 0.52, tagline: true },
      `stacked lockup, ${theme}`);
    await add(`lockup/lockup-horizontal-${theme}.png`,
      { w: 2000, h: 620, theme, layout: 'horizontal', scale: 0.95, tagline: true },
      `horizontal lockup, ${theme}`);
    await add(`lockup/mark-only-${theme}.png`,
      { w: 1200, h: 1200, theme, layout: 'mark', scale: 0.78 },
      `mark only, ${theme}`);
  }
  console.log('');

  // Profile pictures: light and dark of each.
  process.stdout.write('  profiles       ');
  for (const [name, w, h, note] of SQUARES) {
    for (const theme of ['light', 'brand']) {
      await add(`social/${name}-${theme}.png`,
        { w, h, theme, layout: 'stacked', scale: 0.60, tagline: false }, note);
    }
  }
  console.log('');

  // App icons keep the mark only — a wordmark is unreadable at 48px.
  process.stdout.write('  app icons      ');
  for (const [name, w, h, note] of APP_ICONS) {
    await add(`social/${name}.png`,
      { w, h, theme: 'brand', layout: 'mark', scale: 0.62 }, note);
  }
  console.log('');

  process.stdout.write('  covers         ');
  for (const [name, w, h, note] of COVERS) {
    for (const theme of ['brand', 'light']) {
      const wide = w / h > 2.6;
      await add(`social/${name}-${theme}.png`,
        { w, h, theme, layout: wide ? 'horizontal' : 'stacked',
          scale: wide ? 0.9 : 0.46, tagline: true }, note);
    }
  }
  console.log('\n');

  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

  const total = manifest.reduce((n, m) =>
    n + fs.statSync(path.join(OUT, m.file)).size, 0);
  console.log(`  ${manifest.length} files, ${(total / 1024 / 1024).toFixed(2)} MB -> assets/brand/\n`);

  ws.close(); chrome.kill(); process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
