#!/usr/bin/env node
'use strict';

/**
 * Marketing carousel generator — 8 slides at 1080x1350 (4:5).
 *
 *   node build/carousel.js
 *
 * Higgsfield supplies the photography only. Every word, number, logo and layout
 * is composed here and rendered through headless Chrome, because image models
 * garble text and a carousel is mostly text.
 *
 * SAFETY: writes only to assets/brand/carousel/. Touches nothing else.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'brand', 'carousel');
const SRC = path.join(__dirname, 'carousel-src');

// file:// URLs, not data URLs. Referencing the photos inline made the navigation
// URL about 5 MB, which did not finish painting before the screenshot fired.
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

/* ------------------------------------------------------------------ slides */

const EHR = ['epic', 'athenahealth', 'eclinicalworks', 'dentrix', 'nexhealth', 'open-dental'];

const SLIDES = [
  {
    kind: 'photo', img: 'desk-empty', tone: 'dark',
    kicker: 'The front desk problem',
    h: '67% of your callers hang&nbsp;up.',
    p: 'After two minutes on hold. They don\'t leave a voicemail, and they don\'t call back.',
    swipe: true,
  },
  {
    kind: 'photo', img: 'desk-busy', tone: 'dark',
    kicker: 'Where they go',
    h: 'They call the practice down the&nbsp;road.',
    p: 'And that practice answers. The call you missed at 12:40 becomes someone else\'s new patient.',
  },
  {
    kind: 'data',
    kicker: 'The arithmetic',
    h: 'Miss 150 calls a month?',
    rows: [
      ['~30', 'were prospective new patients'],
      ['~15', 'booked somewhere else instead'],
      ['$9,000+', 'in production, gone. Every month.'],
    ],
    note: 'Illustrative, at a $600 new-patient value. Run your own numbers at vocryn.com.',
  },
  {
    kind: 'photo', img: 'casey', tone: 'dark',
    kicker: 'Meet Casey',
    h: 'Your AI receptionist. Answers in under two&nbsp;seconds.',
    p: 'Nights, weekends, lunch breaks, and the Monday-morning rush included.',
  },
  {
    kind: 'list',
    kicker: 'What Casey handles',
    h: 'The whole front desk, on every call.',
    items: [
      ['calendar', 'Books appointments straight into your EHR'],
      ['shield', 'Verifies insurance while the patient is on the line'],
      ['pill', 'Takes refill requests and routes them to the provider'],
      ['refresh', 'Reschedules, and fills the cancellation from your waitlist'],
      ['user', 'Transfers anything urgent to a human in seconds'],
    ],
  },
  {
    kind: 'stats',
    kicker: 'What changes',
    h: 'Month one.',
    stats: [
      ['94%', 'of calls answered'],
      ['3×', 'more bookings'],
      ['<2s', 'to pick up'],
      ['20+', 'languages'],
    ],
  },
  {
    kind: 'logos',
    kicker: 'Native integration',
    h: 'It writes into the system you already&nbsp;use.',
    p: 'Not a spreadsheet. Not a callback list. The appointment lands in your schedule before the call ends.',
  },
  {
    kind: 'photo', img: 'calm', tone: 'brand', cta: true,
    h: 'Every patient heard.',
    p: 'Hear Casey handle a real call — unedited, on the site.',
    url: 'vocryn.com',
  },
];

/* --------------------------------------------------------------- rendering */

const ICONS = {
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  pill: '<path d="M10.5 20.5a6.36 6.36 0 0 1-9-9l7-7a6.36 6.36 0 0 1 9 9z"/><path d="M8.5 8.5l7 7"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>',
  user: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M16 11l2 2 4-4"/>',
};
const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>`;

function slideHtml(s, i, total) {
  const isPhoto = s.kind === 'photo';
  const light = s.kind === 'list' || s.kind === 'logos';

  const bg = isPhoto
    ? `background-image:${s.tone === 'brand'
        ? 'linear-gradient(180deg,rgba(11,16,48,.93) 0%,rgba(11,16,48,.80) 42%,rgba(20,26,78,.34) 72%,rgba(20,26,78,.55) 100%)'
        : 'linear-gradient(180deg,rgba(11,16,48,.94) 0%,rgba(11,16,48,.82) 40%,rgba(11,16,48,.30) 70%,rgba(11,16,48,.20) 100%)'
      },url('${photo(s.img)}');background-size:cover;background-position:center 62%`
    : s.kind === 'data' ? 'background:linear-gradient(160deg,#0B1030,#141A4E 60%,#1E1638)'
    : s.kind === 'stats' ? 'background:linear-gradient(142deg,#2F3DC4,#4B3FD4 45%,#7C3AED)'
    : 'background:#FFFFFF';

  const fg = light ? '#0B1030' : '#FFFFFF';
  const dim = light ? '#4E5679' : 'rgba(255,255,255,.80)';

  let body = '';
  if (s.kind === 'data') {
    body = `<div class="rows">${s.rows.map(([n, t], r) => `<div class="row${r === 2 ? ' row--hit' : ''}">
      <span class="row__n">${n}</span><span class="row__t">${t}</span></div>`).join('')}</div>
      <p class="note">${s.note}</p>`;
  } else if (s.kind === 'list') {
    body = `<ul class="list">${s.items.map(([k, t]) => `<li><span class="ico">${svg(k)}</span>
      <span>${t}</span></li>`).join('')}</ul>`;
  } else if (s.kind === 'stats') {
    body = `<div class="stats">${s.stats.map(([n, t]) => `<div class="stat">
      <span class="stat__n">${n}</span><span class="stat__t">${t}</span></div>`).join('')}</div>`;
  } else if (s.kind === 'logos') {
    body = `<div class="logos">${EHR.map((n) => `<div class="logo">
      <img src="${asset('assets/img/logos/' + n + '.webp')}" alt=""></div>`).join('')}</div>
      <p class="sub">${s.p}</p>`;
  } else if (s.p) {
    body = `<p class="sub">${s.p}</p>`;
  }

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px;overflow:hidden}
  body{${bg};color:${fg};font-family:'Plus Jakarta Sans',system-ui,sans-serif;
    -webkit-font-smoothing:antialiased;display:flex;flex-direction:column;
    justify-content:${s.kind === 'photo' ? 'flex-start' : 'center'};padding:88px;
    ${s.kind === 'photo' ? 'padding-top:196px' : ''}}

  .top{position:absolute;top:70px;left:88px;right:88px;display:flex;
    align-items:center;justify-content:space-between}
  .brand{display:flex;align-items:center;gap:14px}
  .brand img{width:78px;height:auto;display:block}
  .brand span{font-weight:800;font-size:27px;letter-spacing:-.02em}
  .brand b{color:${light ? '#FF6A00' : '#FF9A3D'};font-weight:800}
  .num{font-weight:700;font-size:22px;color:${dim};letter-spacing:.06em}

  .kicker{display:inline-flex;align-self:flex-start;font-weight:700;font-size:23px;
    letter-spacing:.15em;text-transform:uppercase;margin-bottom:30px;
    color:${light ? '#3A49CE' : '#FF9A3D'}}
  h1{font-weight:800;font-size:${s.kind === 'stats' ? 92 : 78}px;line-height:1.06;
    letter-spacing:-.035em;text-wrap:balance}
  .sub{margin-top:30px;font-weight:500;font-size:34px;line-height:1.42;color:${dim};
    max-width:${light ? '100%' : '92%'}}
  .note{margin-top:38px;font-weight:500;font-size:22px;line-height:1.5;
    color:rgba(255,255,255,.55)}

  .rows{margin-top:52px;display:grid;gap:26px}
  .row{display:flex;align-items:baseline;gap:26px;padding-bottom:26px;
    border-bottom:1.5px solid rgba(255,255,255,.14)}
  .row:last-child{border-bottom:0}
  .row__n{font-weight:800;font-size:62px;letter-spacing:-.03em;min-width:230px}
  .row__t{font-weight:500;font-size:30px;color:rgba(255,255,255,.80);line-height:1.35}
  .row--hit .row__n{color:#FF9A3D}
  .row--hit .row__t{color:#fff}

  .list{margin-top:52px;display:grid;gap:30px;list-style:none}
  .list li{display:flex;gap:24px;align-items:flex-start;font-weight:600;
    font-size:33px;line-height:1.38}
  .ico{width:62px;height:62px;flex:none;display:grid;place-items:center;border-radius:16px;
    background:linear-gradient(150deg,#EEF1FF,#E6DCFF);color:#3A49CE}
  .ico svg{width:31px;height:31px}

  .stats{margin-top:60px;display:grid;grid-template-columns:1fr 1fr;gap:44px 30px}
  .stat{display:flex;flex-direction:column;gap:10px}
  .stat__n{font-weight:800;font-size:106px;line-height:1;letter-spacing:-.045em}
  .stat__t{font-weight:600;font-size:28px;color:rgba(255,255,255,.82)}

  .logos{margin-top:50px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px}
  .logo{background:#fff;border:1.5px solid #E5E8F4;border-radius:20px;height:132px;
    display:grid;place-items:center;padding:18px}
  .logo img{max-width:100%;max-height:64px;object-fit:contain;mix-blend-mode:multiply}

  .swipe{position:absolute;bottom:70px;left:88px;display:flex;align-items:center;gap:12px;
    font-weight:700;font-size:25px;color:#fff;background:rgba(11,16,48,.55);
    padding:14px 26px;border-radius:999px;backdrop-filter:blur(6px)}
  .swipe i{display:block;width:34px;height:2px;background:currentColor;position:relative}
  .swipe i::after{content:'';position:absolute;right:0;top:-5px;width:12px;height:12px;
    border-top:2px solid currentColor;border-right:2px solid currentColor;
    transform:rotate(45deg)}

  .cta{margin-top:44px;display:inline-flex;align-self:flex-start;align-items:center;
    gap:14px;background:#FF6A00;color:#fff;font-weight:800;font-size:34px;
    padding:26px 44px;border-radius:999px;letter-spacing:-.01em}
</style></head><body>
  <div class="top">
    <div class="brand"><img src="${MARK}" alt=""><span>VOCRYN <b>Ai</b></span></div>
    <div class="num">${String(i + 1).padStart(2, '0')} / ${total}</div>
  </div>

  ${s.kicker ? `<span class="kicker">${s.kicker}</span>` : ''}
  <h1>${s.h}</h1>
  ${body}
  ${s.cta ? `<span class="cta">${s.url}</span>` : ''}
  ${s.swipe ? '<div class="swipe">Swipe <i></i></div>' : ''}
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

  console.log('\n  Vocryn Ai — launch carousel  (1080x1350)\n');
  for (let i = 0; i < SLIDES.length; i++) {
    const tmp = path.join(SRC, '_slide.html');
    fs.writeFileSync(tmp, slideHtml(SLIDES[i], i, SLIDES.length));
    // Cache-bust so navigating to the same path actually reloads.
    await send('Page.navigate', { url: fileUrl(tmp) + '?i=' + i });
    await sleep(260);
    // Wait for fonts AND every image to finish decoding, or slides capture blank.
    await send('Runtime.evaluate', {
      expression: `Promise.all([
        document.fonts.ready,
        ...[...document.images].map(im => im.complete && im.naturalWidth
          ? Promise.resolve()
          : new Promise(r => { im.onload = r; im.onerror = r; setTimeout(r, 6000); })),
      ]).then(() => new Promise(r => setTimeout(r, 220)))`,
      awaitPromise: true,
    });
    // Fail loudly rather than shipping a slide with a missing photo.
    const imgs = await send('Runtime.evaluate', {
      expression: `[...document.images].filter(im => !im.naturalWidth).length`,
      returnByValue: true,
    });
    if (imgs.result.value > 0) throw new Error(`slide ${i + 1}: ${imgs.result.value} image(s) failed to load`);
    const r = await send('Page.captureScreenshot', { format: 'png' });
    const f = `slide-${String(i + 1).padStart(2, '0')}.png`;
    fs.writeFileSync(path.join(OUT, f), Buffer.from(r.data, 'base64'));
    const kb = (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0);
    console.log(`  ${f}  ${String(kb).padStart(4)} KB   ${SLIDES[i].kind.padEnd(6)} ${
      SLIDES[i].h.replace(/&nbsp;/g, ' ').slice(0, 44)}`);
  }
  console.log(`\n  ${SLIDES.length} slides -> assets/brand/carousel/\n`);

  ws.close(); chrome.kill(); process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
