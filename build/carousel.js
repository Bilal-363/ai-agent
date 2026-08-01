#!/usr/bin/env node
'use strict';

/**
 * Launch carousel — 8 slides, 1080x1350 (4:5).
 *
 *   node build/carousel.js
 *
 * Framework C, "Hack List": a contrarian stat opens, the problem is named, each
 * numbered fix re-earns the swipe, and a synthesis closes. Chosen because this is
 * a first post from an unknown brand — nobody is here for our results, so the hook
 * has to be a fact about the reader's business, not a claim about ours.
 *
 * Two rules from the framework drive the whole design:
 *
 *   1. ONE visual template. The first version had five different looks (photo,
 *      white, navy, gradient, logo wall) and read as five unrelated posts. Every
 *      slide now shares the same navy base, the same chrome, and the same type
 *      scale — only the content changes.
 *   2. Legible at thumbnail size. Nothing below 32px at 1080 wide; the old 23px
 *      kicker disappeared entirely in a feed preview.
 *
 * Higgsfield supplies photography only — image models garble text, and a carousel
 * is mostly text, so every word here is composed in HTML and rendered by Chrome.
 *
 * SAFETY: writes only to assets/brand/carousel/.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'brand', 'carousel');
const SRC = path.join(__dirname, 'carousel-src');

const fileUrl = (p) => 'file:///' + p.replace(/\\/g, '/').replace(/ /g, '%20');
const photo = (n) => fileUrl(path.join(SRC, n + '.png'));
const asset = (rel) => fileUrl(path.join(ROOT, rel));
const MARK = fileUrl(path.join(__dirname, 'logo-src', 'mark-hi.png'));

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p));
if (!CHROME) { console.error('Chrome not found.'); process.exit(1); }

const PORT = 9510;
const W = 1080, H = 1350;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const EHR = ['epic', 'athenahealth', 'eclinicalworks', 'dentrix', 'nexhealth', 'open-dental'];

/* ------------------------------------------------------------------ slides */

const SLIDES = [
  { type: 'hero', img: 'desk-empty',
    big: '67%', unit: '',
    h: 'of callers hang up before anyone answers.',
    p: 'They don\'t leave a voicemail. They don\'t call back.',
    swipe: true },

  { type: 'statement', img: 'desk-busy',
    kicker: 'Where they go',
    h: 'They call the practice <em>down the road.</em>',
    p: 'And that practice answers. The call you missed at 12:40 becomes someone else\'s new patient.' },

  { type: 'rows',
    kicker: 'The arithmetic',
    h: 'Miss 150 calls a month?',
    rows: [
      ['~30', 'were prospective new patients'],
      ['~15', 'booked somewhere else'],
      ['$9k+', 'in production, gone. Monthly.'],
    ],
    note: 'Illustrative, at a $600 new-patient value.' },

  { type: 'statement', img: 'casey',
    kicker: 'The fix',
    h: 'Meet Casey. Answers in <em>under two seconds.</em>',
    p: 'Your AI receptionist. Nights, weekends, lunch breaks, and the Monday-morning rush.' },

  { type: 'checklist',
    kicker: 'What Casey does',
    h: 'The whole front desk.',
    items: [
      'Books appointments into your EHR',
      'Verifies insurance on the call',
      'Takes refill requests',
      'Fills cancellations from your waitlist',
      'Transfers anything urgent to a human',
    ] },

  { type: 'grid',
    kicker: 'Month one',
    h: 'What actually changes.',
    stats: [['94%', 'calls answered'], ['3×', 'more bookings'],
            ['<2s', 'to pick up'], ['20+', 'languages']] },

  { type: 'logos',
    kicker: 'The obvious question',
    h: 'It writes into <em>your</em> system.',
    p: 'The appointment lands in your schedule before the call ends.' },

  { type: 'cta', img: 'calm',
    h: 'Every patient heard.',
    p: 'Hear Casey handle a real call — unedited.',
    url: 'vocryn.com' },
];

/* --------------------------------------------------------------- rendering */

function slideHtml(s, i, total) {
  const n = i + 1;
  const hasPhoto = !!s.img;

  // Photo slides put the image in the lower band behind a heavy scrim; text always
  // occupies the top. Same geometry on every slide so the template never shifts.
  const bgLayer = hasPhoto
    ? `<div class="photo" style="background-image:url('${photo(s.img)}')"></div>
       <div class="scrim"></div>`
    : '';

  let body = '';
  if (s.type === 'hero') {
    body = `<div class="hero">
      <div class="big">${s.big}</div>
      <h1>${s.h}</h1>
      <p class="sub">${s.p}</p>
    </div>`;
  } else if (s.type === 'statement' || s.type === 'cta') {
    body = `<h1>${s.h}</h1><p class="sub">${s.p}</p>
      ${s.url ? `<div class="cta">${s.url}</div>` : ''}`;
  } else if (s.type === 'rows') {
    body = `<h1>${s.h}</h1>
      <div class="rows">${s.rows.map(([a, b], r) => `<div class="row${r === 2 ? ' row--hot' : ''}">
        <span class="row__a">${a}</span><span class="row__b">${b}</span></div>`).join('')}</div>
      <p class="note">${s.note}</p>`;
  } else if (s.type === 'checklist') {
    body = `<h1>${s.h}</h1>
      <ul class="check">${s.items.map((t) => `<li><span class="tick">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4"
          stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </span><span>${t}</span></li>`).join('')}</ul>`;
  } else if (s.type === 'grid') {
    body = `<h1>${s.h}</h1>
      <div class="grid">${s.stats.map(([a, b]) => `<div class="cell">
        <span class="cell__a">${a}</span><span class="cell__b">${b}</span></div>`).join('')}</div>`;
  } else if (s.type === 'logos') {
    body = `<h1>${s.h}</h1>
      <div class="logos">${EHR.map((l) => `<div class="logo">
        <img src="${asset('assets/img/logos/' + l + '.webp')}" alt=""></div>`).join('')}</div>
      <p class="sub sub--sm">${s.p}</p>`;
  }

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px;overflow:hidden}
  body{position:relative;color:#fff;font-family:'Plus Jakarta Sans',system-ui,sans-serif;
    -webkit-font-smoothing:antialiased;
    background:radial-gradient(120% 80% at 15% 0%,#1E2A7A 0%,transparent 55%),
      linear-gradient(165deg,#0B1030 0%,#141A4E 55%,#1A1140 100%)}

  /* Photo lives in the lower band; the scrim keeps type legible above it. */
  .photo{position:absolute;inset:0;background-size:cover;background-position:center 42%}
  /* Top band stays dark enough for the headline; the middle clears so the
     photograph is visible; the foot darkens again for the footer row. */
  .scrim{position:absolute;inset:0;background:
    linear-gradient(180deg,rgba(9,13,40,.94) 0%,rgba(9,13,40,.88) 26%,
      rgba(9,13,40,.62) 44%,rgba(9,13,40,.28) 62%,rgba(9,13,40,.34) 82%,
      rgba(9,13,40,.72) 100%)}

  .wrap{position:absolute;inset:0;padding:84px;display:flex;flex-direction:column}
  .body{display:flex;flex-direction:column;align-items:flex-start;
    ${hasPhoto ? '' : 'margin-block:auto'}}

  /* ---- shared chrome, identical on every slide ---- */
  .bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:64px}
  .brand{display:flex;align-items:center;gap:15px}
  .brand img{width:86px;height:auto;display:block}
  .brand span{font-weight:800;font-size:32px;letter-spacing:-.02em}
  .brand b{color:#FF9A3D;font-weight:800}
  .count{font-weight:800;font-size:30px;color:rgba(255,255,255,.55);letter-spacing:.04em}

  .kicker{display:inline-flex;align-items:center;gap:14px;font-weight:800;font-size:32px;
    letter-spacing:.09em;text-transform:uppercase;color:#FF9A3D;margin-bottom:26px}
  .kicker::before{content:'';width:52px;height:5px;border-radius:3px;background:#FF9A3D}

  h1{font-weight:800;font-size:82px;line-height:1.08;letter-spacing:-.038em;text-wrap:balance}
  h1 em{font-style:normal;color:#FF9A3D}
  .sub{margin-top:30px;font-weight:600;font-size:38px;line-height:1.4;
    color:rgba(255,255,255,.78);max-width:20ch}
  .sub--sm{font-size:34px;max-width:100%;margin-top:34px}
  .note{margin-top:44px;font-weight:600;font-size:28px;color:rgba(255,255,255,.45)}

  /* ---- hero: the number is the whole slide ---- */
  .hero .big{font-weight:800;font-size:340px;line-height:.86;letter-spacing:-.06em;
    color:#FF8A2B;margin-bottom:22px}
  .hero h1{font-size:64px;max-width:16ch}
  .hero .sub{font-size:34px;margin-top:26px}

  /* ---- rows ---- */
  .rows{margin-top:64px;display:grid;gap:0}
  .row{display:flex;align-items:baseline;gap:32px;padding:34px 0;
    border-top:2px solid rgba(255,255,255,.14)}
  .row:last-child{border-bottom:2px solid rgba(255,255,255,.14)}
  .row__a{font-weight:800;font-size:82px;letter-spacing:-.045em;min-width:250px;line-height:1}
  .row__b{font-weight:600;font-size:34px;color:rgba(255,255,255,.78);line-height:1.3}
  .row--hot .row__a{color:#FF8A2B}
  .row--hot .row__b{color:#fff}

  /* ---- checklist ---- */
  .check{margin-top:56px;display:grid;gap:34px;list-style:none}
  .check li{display:flex;gap:26px;align-items:center;font-weight:700;font-size:40px;
    line-height:1.25}
  .tick{width:60px;height:60px;flex:none;display:grid;place-items:center;border-radius:50%;
    background:#FF8A2B;color:#0B1030}
  .tick svg{width:30px;height:30px}

  /* ---- stat grid ---- */
  .grid{margin-top:64px;display:grid;grid-template-columns:1fr 1fr;gap:26px}
  .cell{background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.13);
    border-radius:30px;padding:38px 34px;display:flex;flex-direction:column;gap:10px}
  .cell__a{font-weight:800;font-size:104px;line-height:.95;letter-spacing:-.05em;color:#FF9A3D}
  .cell__b{font-weight:700;font-size:31px;color:rgba(255,255,255,.82)}

  /* ---- logo wall ---- */
  .logos{margin-top:56px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .logo{background:#fff;border-radius:24px;height:150px;display:grid;place-items:center;
    padding:24px}
  .logo img{max-width:100%;max-height:72px;object-fit:contain;mix-blend-mode:multiply}

  /* ---- CTA ---- */
  .cta{margin-top:44px;align-self:flex-start;background:#FF8A2B;color:#0B1030;
    font-weight:800;font-size:46px;padding:30px 56px;border-radius:999px;
    letter-spacing:-.02em;box-shadow:0 20px 50px -18px rgba(255,138,43,.75)}

  /* ---- swipe + footer ---- */
  .foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between}
  .swipe{display:inline-flex;align-items:center;gap:16px;font-weight:800;font-size:32px;
    background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.22);
    padding:20px 34px;border-radius:999px}
  .swipe i{display:block;width:38px;height:3px;background:#fff;position:relative}
  .swipe i::after{content:'';position:absolute;right:0;top:-7px;width:16px;height:16px;
    border-top:3px solid #fff;border-right:3px solid #fff;transform:rotate(45deg)}
  .dots{display:flex;gap:11px}
  .dot{width:13px;height:13px;border-radius:50%;background:rgba(255,255,255,.28)}
  .dot.on{background:#FF8A2B;width:38px;border-radius:7px}
  .site{font-weight:800;font-size:30px;color:rgba(255,255,255,.55)}
</style></head><body>
  ${bgLayer}
  <div class="wrap">
    <div class="bar">
      <div class="brand"><img src="${MARK}" alt=""><span>VOCRYN <b>Ai</b></span></div>
      <div class="count">${String(n).padStart(2, '0')}/${total}</div>
    </div>

    <div class="body">
      ${s.kicker ? `<span class="kicker">${s.kicker}</span>` : ''}
      ${body}
    </div>

    <div class="foot">
      ${s.swipe ? '<div class="swipe">Swipe <i></i></div>' : `<span class="site">vocryn.com</span>`}
      <div class="dots">${Array.from({ length: total },
        (_, d) => `<span class="dot${d === i ? ' on' : ''}"></span>`).join('')}</div>
    </div>
  </div>
</body></html>`;
}

let ws, msgId = 0, session;
const pending = new Map();
const send = (m, p = {}, s = session) => {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method: m, params: p, ...(s ? { sessionId: s } : {}) }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
};

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vocryn-car-'));
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
      const p = pending.get(m.id); pending.delete(m.id);
      m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
    }
  });
  const { targetInfos } = await send('Target.getTargets', {}, null);
  ({ sessionId: session } = await send('Target.attachToTarget',
    { targetId: targetInfos.find((t) => t.type === 'page').targetId, flatten: true }, null));
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',
    { width: W, height: H, deviceScaleFactor: 1, mobile: false });

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(SRC, { recursive: true });

  console.log('\n  Vocryn Ai — launch carousel  1080x1350\n');
  for (let i = 0; i < SLIDES.length; i++) {
    const tmp = path.join(SRC, '_slide.html');
    fs.writeFileSync(tmp, slideHtml(SLIDES[i], i, SLIDES.length));
    await send('Page.navigate', { url: fileUrl(tmp) + '?i=' + i });
    await sleep(260);
    // Wait on fonts AND image decode; a fixed sleep shipped blank slides before.
    await send('Runtime.evaluate', {
      expression: `Promise.all([
        document.fonts.ready,
        ...[...document.images].map(im => im.complete && im.naturalWidth
          ? Promise.resolve()
          : new Promise(r => { im.onload = r; im.onerror = r; setTimeout(r, 6000); })),
      ]).then(() => new Promise(r => setTimeout(r, 220)))`,
      awaitPromise: true,
    });
    const bad = await send('Runtime.evaluate', {
      expression: `[...document.images].filter(im => !im.naturalWidth).length`,
      returnByValue: true,
    });
    if (bad.result.value > 0) throw new Error(`slide ${i + 1}: image failed to load`);

    const r = await send('Page.captureScreenshot', { format: 'png' });
    const f = `slide-${String(i + 1).padStart(2, '0')}.png`;
    fs.writeFileSync(path.join(OUT, f), Buffer.from(r.data, 'base64'));
    console.log(`  ${f}  ${String((fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0))
      .padStart(5)} KB   ${SLIDES[i].type}`);
  }
  console.log(`\n  ${SLIDES.length} slides -> assets/brand/carousel/\n`);

  ws.close(); chrome.kill(); process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
