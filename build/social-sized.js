#!/usr/bin/env node
'use strict';

/**
 * Social-media sizes of the compact logo, on a gradient panel and on white.
 *
 *   node build/social-sized.js
 *
 * SAFETY: this writes to assets/brand/social-sized/ and nowhere else. It never
 * deletes or regenerates anything in ../social/, ../lockup/ or ../logo-compact/.
 * (An earlier generator cleared all of assets/brand and destroyed sibling folders;
 * that must not happen again.)
 *
 * Two deliberate changes from the earlier panels:
 *
 * 1. The "Ai" is a real orange, as asked. On white that is straightforward.
 * 2. On the gradient it is not, because the old gradient ran blue -> violet ->
 *    orange and put its orange corner exactly where the wordmark sits — an orange
 *    "Ai" there would vanish into the background. So the panel gradient now stays
 *    blue -> violet, and the orange belongs to the type alone. That is what makes
 *    it read as orange rather than as a slightly warmer patch of background.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'brand', 'social-sized');
const MARK_B64 = fs.readFileSync(path.join(__dirname, 'logo-src', 'mark-hi.b64.txt'), 'utf8').trim();

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p));
if (!CHROME) { console.error('Chrome not found.'); process.exit(1); }

const PORT = 9499;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const THEMES = {
  // Blue -> violet only. No orange in the background, so the orange type carries it.
  gradient: { bg: 'linear-gradient(142deg,#2F3DC4 0%,#4B3FD4 45%,#7C3AED 100%)',
    word: '#FFFFFF', ai: '#FF9A3D' },
  white: { bg: '#FFFFFF', word: '#0B1030', ai: '#FF6A00' },
};

function page({ w, h, theme, layout }) {
  const t = THEMES[theme];
  // Fit the lockup to the canvas: square canvases get a stacked lockup, wide
  // banners a horizontal one, each sized off whichever axis constrains it.
  const markW = layout === 'horizontal'
    ? Math.round(Math.min(w * 0.34, h * 1.15))
    : Math.round(Math.min(w * 0.62, h * 0.60));
  const wordSize = Math.round(markW * 0.26);
  const gap = Math.round(markW * (layout === 'horizontal' ? 0.09 : 0.05));

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&display=swap">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${w}px;height:${h}px;overflow:hidden}
  body{background:${t.bg};display:grid;place-items:center;
    font-family:'Plus Jakarta Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .lk{display:flex;align-items:center;gap:${gap}px;
    flex-direction:${layout === 'horizontal' ? 'row' : 'column'}}
  .lk img{width:${markW}px;height:auto;display:block}
  .word{font-weight:800;font-size:${wordSize}px;line-height:1;letter-spacing:-.022em;
    color:${t.word};white-space:nowrap;display:block}
  .word b{color:${t.ai};font-weight:800}
</style></head><body>
  <div class="lk">
    <img src="data:image/png;base64,${MARK_B64}" alt="">
    <span class="word">VOCRYN <b>Ai</b></span>
  </div>
  <script>
    // Match the wordmark's width to the mark's so the lockup squares up.
    document.fonts.ready.then(() => {
      const img = document.querySelector('.lk img');
      const word = document.querySelector('.word');
      if ('${layout}' === 'stacked') {
        const target = img.getBoundingClientRect().width;
        const now = word.getBoundingClientRect().width;
        if (now > 0) {
          const size = parseFloat(getComputedStyle(word).fontSize);
          word.style.fontSize = (size * target / now) + 'px';
        }
      }
      document.documentElement.dataset.fitted = '1';
    });
  </script>
</body></html>`;
}

const SQUARES = [
  ['profile-1024', 1024, 1024, 'master / any platform'],
  ['profile-800-youtube', 800, 800, 'YouTube channel icon'],
  ['profile-500-facebook', 500, 500, 'Facebook page'],
  ['profile-500-whatsapp', 500, 500, 'WhatsApp Business'],
  ['profile-400-x', 400, 400, 'X (Twitter)'],
  ['profile-320-instagram', 320, 320, 'Instagram'],
  ['profile-300-linkedin', 300, 300, 'LinkedIn company logo'],
  ['profile-200-tiktok', 200, 200, 'TikTok'],
];

const POSTS = [
  ['post-square-1080', 1080, 1080, 'Instagram / Facebook square post'],
  ['post-portrait-1080x1350', 1080, 1350, 'Instagram portrait post'],
  ['post-story-1080x1920', 1080, 1920, 'Story / Reel / TikTok'],
];

const COVERS = [
  ['cover-x-1500x500', 1500, 500, 'X header'],
  ['cover-facebook-820x312', 820, 312, 'Facebook page cover'],
  ['cover-linkedin-page-1128x191', 1128, 191, 'LinkedIn page cover'],
  ['cover-linkedin-personal-1584x396', 1584, 396, 'LinkedIn personal cover'],
  ['cover-youtube-2560x1440', 2560, 1440, 'YouTube channel art'],
  ['share-og-1200x630', 1200, 630, 'Open Graph / link preview'],
];

let ws, msgId = 0, session;
const pending = new Map();
const send = (m, p = {}, s = session) => {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method: m, params: p, ...(s ? { sessionId: s } : {}) }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
};

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vocryn-ss-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--force-color-profile=srgb', '--font-render-hinting=none',
  `--user-data-dir=${profile}`, `--remote-debugging-port=${PORT}`, 'about:blank',
], { stdio: 'ignore' });

async function shot(file, opts) {
  await send('Emulation.setDeviceMetricsOverride',
    { width: opts.w, height: opts.h, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', {
    url: 'data:text/html;charset=utf-8,' + encodeURIComponent(page(opts)),
  });
  await sleep(280);
  await send('Runtime.evaluate', {
    expression: `document.fonts.ready.then(() => new Promise(r => {
      const t = setInterval(() => {
        if (document.documentElement.dataset.fitted) { clearInterval(t); setTimeout(r, 120); }
      }, 40);
    }))`,
    awaitPromise: true,
  });
  const r = await send('Page.captureScreenshot', { format: 'png' });
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

  // Only ever clear our own folder.
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  console.log('\n  Vocryn Ai — social sizes (orange Ai)\n');
  let n = 0;
  const run = async (list, layout, label) => {
    process.stdout.write(`  ${label.padEnd(14)}`);
    for (const [name, w, h] of list) {
      for (const theme of ['gradient', 'white']) {
        await shot(`${theme}/${name}.png`, { w, h, theme, layout });
        n++; process.stdout.write('.');
      }
    }
    console.log('');
  };

  await run(SQUARES, 'stacked', 'profiles');
  await run(POSTS, 'stacked', 'posts');
  await run(COVERS, 'horizontal', 'covers');

  const bytes = fs.readdirSync(OUT, { recursive: true })
    .filter((f) => String(f).endsWith('.png'))
    .reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0);
  console.log(`\n  ${n} files, ${(bytes / 1024 / 1024).toFixed(1)} MB -> assets/brand/social-sized/`);
  console.log('  (gradient/ and white/ — nothing else in assets/brand was touched)\n');

  ws.close(); chrome.kill(); process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
