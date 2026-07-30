#!/usr/bin/env node
'use strict';

/**
 * Compact logo generator — the mark with VOCRYN Ai directly beneath, cropped
 * tight to the ink.
 *
 *   node build/logo.js
 *
 * Separate from build/brand.js on purpose: that one produces padded, per-platform
 * social assets and must not be touched. This one produces the logo file itself,
 * with no tagline and no surrounding air, so it can be dropped into a header,
 * an invoice or a slide without the user having to crop it first.
 *
 * The crop comes from the rendered element's own bounding box via the CDP screenshot
 * `clip`, not from guessed padding — so it is exact regardless of font metrics.
 *
 * Output: assets/brand/logo-compact/
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'brand', 'logo-compact');
const MARK_B64 = fs.readFileSync(path.join(__dirname, 'logo-src', 'mark-hi.b64.txt'), 'utf8').trim();

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p));
if (!CHROME) { console.error('Chrome not found.'); process.exit(1); }

const PORT = 9488;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const THEMES = {
  transparent: { bg: 'transparent', word: '#0B1030', ai: '#B24C04' },
  'transparent-white': { bg: 'transparent', word: '#FFFFFF', ai: '#FF9D5C' },
  light: { bg: '#FFFFFF', word: '#0B1030', ai: '#B24C04' },
  dark: { bg: '#0B1030', word: '#FFFFFF', ai: '#FF9D5C' },
  brand: { bg: 'linear-gradient(140deg,#3A49CE,#7C3AED 55%,#FF8125)', word: '#FFFFFF', ai: '#FFE2CC' },
};

/**
 * @param theme    key of THEMES
 * @param markW    rendered width of the ribbon, px
 * @param pad      breathing room baked into the file. 0 for transparent —
 *                 anything else and every future use inherits padding it cannot remove.
 * @param layout   'stacked' | 'horizontal'
 */
function page({ theme, markW, pad, layout, fit = true }) {
  const t = THEMES[theme];
  // Tuned by eye against the ribbon: the wordmark reads as belonging to the mark
  // at ~26% of its width, and the gap wants to be small — the mark already carries
  // internal air at its top and bottom.
  const wordSize = Math.round(markW * (layout === 'horizontal' ? 0.30 : 0.26));
  const gap = Math.round(markW * (layout === 'horizontal' ? 0.075 : 0.035));

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&display=swap">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{background:transparent}
  body{display:inline-block;padding:${pad}px;
    font-family:'Plus Jakarta Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  #lk{display:flex;align-items:center;gap:${gap}px;background:${t.bg};
    flex-direction:${layout === 'horizontal' ? 'row' : 'column'};
    ${pad ? `padding:${Math.round(markW * 0.10)}px ${Math.round(markW * 0.12)}px;
      border-radius:${Math.round(markW * 0.06)}px;` : ''}}
  #lk img{width:${markW}px;height:auto;display:block}
  /* line-height 1 and a matched cap-height trim stop the text box adding slack
     above and below the letters, which is what makes a lockup look loose. */
  .word{font-weight:800;font-size:${wordSize}px;line-height:1;letter-spacing:-.022em;
    color:${t.word};white-space:nowrap;display:block}
  .word b{color:${t.ai};font-weight:800}
</style></head><body>
  <div id="lk">
    <img src="data:image/png;base64,${MARK_B64}" alt="">
    <span class="word">VOCRYN <b>Ai</b></span>
  </div>
  <script>
    document.fonts.ready.then(() => {
      const img = document.querySelector('#lk img');
      const word = document.querySelector('.word');
      const target = img.getBoundingClientRect().width;
      const now = word.getBoundingClientRect().width;
      if (${fit} && now > 0) {
        const size = parseFloat(getComputedStyle(word).fontSize);
        word.style.fontSize = (size * target / now) + 'px';
      }
      document.documentElement.dataset.fitted = '1';
    });
  </script>
</body></html>`;
}

let ws, msgId = 0, session;
const pending = new Map();
const send = (m, p = {}, s = session) => {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method: m, params: p, ...(s ? { sessionId: s } : {}) }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
};

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vocryn-logo-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--force-color-profile=srgb', '--font-render-hinting=none',
  `--user-data-dir=${profile}`, `--remote-debugging-port=${PORT}`, 'about:blank',
], { stdio: 'ignore' });

async function render(file, opts) {
  await send('Emulation.setDeviceMetricsOverride',
    { width: 2400, height: 1800, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setDefaultBackgroundColorOverride',
    { color: { r: 0, g: 0, b: 0, a: 0 } });
  await send('Page.navigate', {
    url: 'data:text/html;charset=utf-8,' + encodeURIComponent(page(opts)),
  });
  await sleep(300);
  await send('Runtime.evaluate', {
    expression: `document.fonts.ready.then(() => new Promise(r => {
      const t = setInterval(() => {
        if (document.documentElement.dataset.fitted) { clearInterval(t); setTimeout(r, 140); }
      }, 40);
    }))`,
    awaitPromise: true,
  });
  // Crop to the element's own box rather than a guessed canvas.
  const { result } = await send('Runtime.evaluate', {
    expression: `(() => { const r = document.getElementById('lk').getBoundingClientRect();
      return JSON.stringify({ x: r.x, y: r.y, width: r.width, height: r.height }); })()`,
    returnByValue: true,
  });
  const box = JSON.parse(result.value);
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: box.x, y: box.y, width: box.width, height: box.height, scale: 1 },
    captureBeyondViewport: true,
  });
  const dest = path.join(OUT, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(shot.data, 'base64'));
  return { w: Math.round(box.width), h: Math.round(box.height), bytes: fs.statSync(dest).size };
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
  console.log('\n  Vocryn Ai — compact logo\n');

  const rows = [];
  const go = async (file, opts) => {
    const r = await render(file, opts);
    rows.push([file, `${r.w}x${r.h}`, `${(r.bytes / 1024).toFixed(0)} KB`]);
  };

  // Transparent, zero padding: the actual logo file.
  for (const w of [1600, 800, 400]) {
    await go(`vocryn-ai-logo-${w}.png`, { theme: 'transparent', markW: w, pad: 0, layout: 'stacked' });
  }
  // White wordmark, still transparent — for dark backgrounds.
  for (const w of [1600, 800]) {
    await go(`vocryn-ai-logo-white-${w}.png`,
      { theme: 'transparent-white', markW: w, pad: 0, layout: 'stacked' });
  }

  // Same lockup with a background, for placing on photos or coloured slides.
  for (const theme of ['light', 'dark', 'brand']) {
    await go(`vocryn-ai-logo-${theme}-1200.png`, { theme, markW: 1200, pad: 40, layout: 'stacked' });
  }

  // Horizontal, for anywhere height is tight.
  await go('vocryn-ai-logo-horizontal-1200.png',
    { theme: 'transparent', markW: 1200, pad: 0, layout: 'horizontal' });

  const pad = (s, n) => String(s).padEnd(n);
  rows.forEach(([f, d, b]) => console.log(`  ${pad(f, 40)} ${pad(d, 12)} ${b}`));
  console.log(`\n  ${rows.length} files -> assets/brand/logo-compact/\n`);

  ws.close(); chrome.kill(); process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
