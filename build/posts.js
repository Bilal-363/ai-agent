#!/usr/bin/env node
'use strict';

/**
 * Turns the four raw Higgsfield photographs into finished, brandedI post images.
 *
 *   node build/posts.js
 *
 * The photos in build/carousel-src/ are raw output — no text, no logo, nothing.
 * They were only ever backgrounds for the carousel. This makes each one a
 * standalone post: full-bleed photo, logo, a headline written for what that
 * specific photo actually shows, and the URL.
 *
 * Two sizes each, because a single-image post is square as often as it is 4:5.
 *
 * SAFETY: writes only to assets/brand/single-posts/.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'brand', 'single-posts');
const SRC = path.join(__dirname, 'carousel-src');

const fileUrl = (p) => 'file:///' + p.replace(/\\/g, '/').replace(/ /g, '%20');
const MARK = fileUrl(path.join(__dirname, 'logo-src', 'mark-hi.png'));

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p));
if (!CHROME) { console.error('Chrome not found.'); process.exit(1); }

const PORT = 9520;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Headline written for what is actually in each frame — not generic copy pasted
 * over a stock image. The photo and the words have to be about the same thing. */
const POSTS = [
  { file: 'empty-desk', img: 'desk-empty',
    kicker: 'The 12:40 problem',
    h: 'Nobody\'s at the desk. The phone is <em>still ringing.</em>',
    p: 'Casey answers in under two seconds. Lunch breaks, evenings, weekends.' },

  { file: 'two-at-once', img: 'desk-busy',
    kicker: 'Front desk relief',
    h: 'She can only help <em>one of them.</em>',
    p: 'Casey takes the phone so your team can look after the person at the counter.' },

  { file: 'meet-casey', img: 'casey',
    kicker: 'Meet Casey',
    h: 'Your AI receptionist. <em>Never misses a call.</em>',
    p: 'Books into your EHR, verifies insurance, and hands anything urgent to a real person.' },

  { file: 'handled', img: 'calm',
    kicker: 'What changes',
    h: 'This is a front desk that\'s <em>actually handled.</em>',
    p: '94% of calls answered. 3× more bookings. No voicemail, no callback list.' },
];

const SIZES = [
  ['4x5', 1080, 1350],
  ['1x1', 1080, 1080],
];

function html(p, W, H) {
  const square = W === H;
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px;overflow:hidden}
  body{position:relative;color:#fff;font-family:'Plus Jakarta Sans',system-ui,sans-serif;
    -webkit-font-smoothing:antialiased;background:#0B1030}
  .photo{position:absolute;inset:0;background-size:cover;background-position:center 42%;
    background-image:url('${fileUrl(path.join(SRC, p.img + '.png'))}')}
  /* Dark at the top where the type sits, clear through the middle so the
     photograph is doing work, dark again at the foot for the URL. */
  .scrim{position:absolute;inset:0;background:linear-gradient(180deg,
    rgba(9,13,40,.95) 0%,rgba(9,13,40,.88) 28%,rgba(9,13,40,.60) 46%,
    rgba(9,13,40,.24) 64%,rgba(9,13,40,.34) 84%,rgba(9,13,40,.74) 100%)}
  .wrap{position:absolute;inset:0;padding:${square ? 76 : 84}px;
    display:flex;flex-direction:column}

  .bar{display:flex;align-items:center;gap:15px;margin-bottom:${square ? 44 : 58}px}
  .bar img{width:86px;height:auto;display:block}
  .bar span{font-weight:800;font-size:32px;letter-spacing:-.02em}
  .bar b{color:#FF9A3D;font-weight:800}

  .kicker{display:inline-flex;align-items:center;gap:14px;font-weight:800;font-size:31px;
    letter-spacing:.09em;text-transform:uppercase;color:#FF9A3D;margin-bottom:24px}
  .kicker::before{content:'';width:52px;height:5px;border-radius:3px;background:#FF9A3D}

  h1{font-weight:800;font-size:${square ? 76 : 82}px;line-height:1.07;letter-spacing:-.038em;
    text-wrap:balance;max-width:15ch}
  h1 em{font-style:normal;color:#FF9A3D}
  p.sub{margin-top:28px;font-weight:600;font-size:${square ? 34 : 37}px;line-height:1.4;
    color:rgba(255,255,255,.82);max-width:22ch}

  .foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between}
  .url{font-weight:800;font-size:34px;color:#fff;background:rgba(255,255,255,.13);
    border:2px solid rgba(255,255,255,.24);padding:18px 34px;border-radius:999px}
  .tag{font-weight:700;font-size:28px;color:rgba(255,255,255,.62)}
</style></head><body>
  <div class="photo"></div><div class="scrim"></div>
  <div class="wrap">
    <div class="bar"><img src="${MARK}" alt=""><span>VOCRYN <b>Ai</b></span></div>
    <span class="kicker">${p.kicker}</span>
    <h1>${p.h}</h1>
    <p class="sub">${p.p}</p>
    <div class="foot">
      <span class="url">vocryn.com</span>
      <span class="tag">AI receptionist for clinics</span>
    </div>
  </div>
</body></html>`;
}

let ws, msgId = 0, session;
const pending = new Map();
const send = (m, q = {}, s = session) => {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method: m, params: q, ...(s ? { sessionId: s } : {}) }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
};

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vocryn-posts-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--force-color-profile=srgb', '--font-render-hinting=none',
  '--allow-file-access-from-files',
  `--user-data-dir=${profile}`, `--remote-debugging-port=${PORT}`, 'about:blank',
], { stdio: 'ignore' });

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
      const q = pending.get(m.id); pending.delete(m.id);
      m.error ? q.rej(new Error(m.error.message)) : q.res(m.result);
    }
  });
  const { targetInfos } = await send('Target.getTargets', {}, null);
  ({ sessionId: session } = await send('Target.attachToTarget',
    { targetId: targetInfos.find((t) => t.type === 'page').targetId, flatten: true }, null));
  await send('Page.enable');
  await send('Runtime.enable');

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  console.log('\n  Vocryn Ai — single post images\n');
  for (const p of POSTS) {
    for (const [tag, W, H] of SIZES) {
      await send('Emulation.setDeviceMetricsOverride',
        { width: W, height: H, deviceScaleFactor: 1, mobile: false });
      const tmp = path.join(SRC, '_post.html');
      fs.writeFileSync(tmp, html(p, W, H));
      await send('Page.navigate', { url: fileUrl(tmp) + '?v=' + p.file + tag });
      await sleep(260);
      await send('Runtime.evaluate', {
        expression: `Promise.all([document.fonts.ready,
          ...[...document.images].map(im => im.complete && im.naturalWidth ? 0
            : new Promise(r => { im.onload = r; im.onerror = r; setTimeout(r, 6000); })),
        ]).then(() => new Promise(r => setTimeout(r, 200)))`,
        awaitPromise: true,
      });
      // The background photo is a CSS layer, so check it decoded rather than
      // trusting the sleep — a missing photo would render as flat navy.
      const ok = await send('Runtime.evaluate', {
        expression: `new Promise(r => { const i = new Image();
          i.onload = () => r(i.naturalWidth); i.onerror = () => r(0);
          i.src = getComputedStyle(document.querySelector('.photo'))
            .backgroundImage.slice(5, -2); })`,
        awaitPromise: true, returnByValue: true,
      });
      if (!ok.result.value) throw new Error(`${p.file}: background photo failed to load`);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const name = `${p.file}-${tag}.png`;
      fs.writeFileSync(path.join(OUT, name), Buffer.from(shot.data, 'base64'));
      console.log(`  ${name.padEnd(24)} ${W}x${H}  ` +
        `${(fs.statSync(path.join(OUT, name)).size / 1024).toFixed(0)} KB`);
    }
  }
  console.log(`\n  ${POSTS.length * SIZES.length} images -> assets/brand/single-posts/\n`);

  ws.close(); chrome.kill(); process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
