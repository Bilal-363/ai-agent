#!/usr/bin/env node
'use strict';

/**
 * "Writes to the Chart" — 40s, 9:16.
 *
 *   node build/ad2.js
 *
 * The structural mirror of "12:40". That film ended on an empty desk to prove
 * nobody was there; this one ends on a filled schedule slot to prove the work
 * landed.
 *
 * The hero is the SCREEN, not a face, so the centre of the film is a twenty-second
 * animated EHR scene rather than footage. It is rendered frame by frame: the page
 * is loaded once and a progress value 0..1 is pushed in before each capture, which
 * is both far faster than re-navigating and deterministic — the same frame number
 * always produces the same pixels.
 *
 * Generated video is reused from the first film; nothing new was generated for
 * this one except the voiceover.
 *
 * The schedule is a NEUTRAL mock, deliberately not any vendor's real UI, and is
 * labelled as a demo practice on screen.
 *
 * SAFETY: writes only to assets/brand/video/ and build/video2-work/.
 */

const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const CLIPS = path.join(__dirname, 'video-src');
const VO = path.join(__dirname, 'video2-src', 'vo');
const WORK = path.join(__dirname, 'video2-work');
const OUT = path.join(ROOT, 'assets', 'brand', 'video');

const FFMPEG = 'C:/Users/Arshad Computer Lab/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe';
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p));

const W = 1080, H = 1920, FPS = 30;
const PORT = 9540;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ff = (a) => execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...a], { stdio: 'pipe' });
const fileUrl = (p) => 'file:///' + p.replace(/\\/g, '/').replace(/ /g, '%20');
const MARK = fileUrl(path.join(__dirname, 'logo-src', 'mark-hi.png'));
const wavSec = (p) => (fs.statSync(p).size - 44) / (44100 * 2);

fs.mkdirSync(WORK, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

/* --------------------------------------------------------------- the film */

const SEGMENTS = [
  { id: 'split', kind: 'frames', dur: 4.0 },
  { id: 'writes', kind: 'frames', dur: 4.0 },
  { id: 'answer', kind: 'clip', src: 'casey2.mp4', dur: 5.0, ss: 0 },
  { id: 'ui', kind: 'frames', dur: 20.0 },
  { id: 'still', kind: 'clip', src: 'casey2.mp4', dur: 4.0, ss: 4 },
  { id: 'end', kind: 'frames', dur: 3.0 },
];

/* Shared chrome. The logo bar is on EVERY frame of the film, including over the
   UI scene and the live footage — the previous film only carried it on some. */
const CHROME_CSS = `
  .bar{position:absolute;top:56px;left:64px;right:64px;display:flex;align-items:center;
    justify-content:space-between;z-index:40}
  .bar .lk{display:flex;align-items:center;gap:14px}
  .bar img{width:78px;height:auto;display:block}
  .bar .wm{font-weight:800;font-size:30px;letter-spacing:-.02em;color:#fff}
  .bar .wm b{color:#FF9A3D}
  .bar .site{font-weight:800;font-size:26px;color:rgba(255,255,255,.62)}
`;
const barHtml = `<div class="bar"><div class="lk"><img src="${MARK}" alt="">
  <span class="wm">VOCRYN <b>Ai</b></span></div>
  <span class="site">vocryn.com</span></div>`;

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap">`;

const BASE = `
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px;overflow:hidden}
  body{position:relative;color:#fff;font-family:'Plus Jakarta Sans',system-ui,sans-serif;
    -webkit-font-smoothing:antialiased;
    background:radial-gradient(120% 70% at 15% 0%,#1E2A7A 0%,transparent 55%),
      linear-gradient(165deg,#0B1030 0%,#141A4E 55%,#1A1140 100%)}
  h1{font-weight:800;font-size:88px;line-height:1.06;letter-spacing:-.04em;text-wrap:balance}
  h1 em{font-style:normal;color:#FF9A3D}
  ${CHROME_CSS}
`;

/* Each page exposes window.setP(p) so the renderer can drive it frame by frame. */

const PAGE_split = `<!doctype html><html><head><meta charset="utf-8">${FONT}<style>${BASE}
  .panes{position:absolute;inset:200px 64px 300px;display:grid;grid-template-rows:1fr 1fr;gap:26px}
  .pane{border-radius:32px;padding:56px;display:flex;flex-direction:column;justify-content:center;
    border:2px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);
    transform:translateX(var(--dx,0));opacity:var(--op,0)}
  .pane.bad{border-color:rgba(255,255,255,.16)}
  .pane.good{border-color:#FF9A3D;background:rgba(255,154,61,.14)}
  .tag{font-weight:800;font-size:28px;letter-spacing:.10em;text-transform:uppercase;
    color:rgba(255,255,255,.5);margin-bottom:20px}
  .pane.good .tag{color:#FF9A3D}
  .txt{font-weight:800;font-size:62px;line-height:1.1;letter-spacing:-.03em}
  .note{margin-top:22px;font-weight:600;font-size:32px;color:rgba(255,255,255,.66)}
  h1{position:absolute;left:64px;right:64px;bottom:140px;font-size:66px;opacity:var(--h,0)}
</style></head><body>${barHtml}
  <div class="panes">
    <div class="pane bad" id="a"><div class="tag">Most AI receptionists</div>
      <div class="txt">"I'll take a message."</div>
      <div class="note">Someone still has to type it in.</div></div>
    <div class="pane good" id="b"><div class="tag">Casey</div>
      <div class="txt">Writes to the chart.</div>
      <div class="note">Before the call ends.</div></div>
  </div>
  <h1 id="h">Most AI receptionists <em>take a message.</em></h1>
<script>
  const ease = t => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  window.setP = (p) => {
    const a = document.getElementById('a'), b = document.getElementById('b');
    const ta = ease(p / 0.30), tb = ease((p - 0.34) / 0.30);
    a.style.setProperty('--dx', ((1 - ta) * -140).toFixed(1) + 'px');
    a.style.setProperty('--op', ta.toFixed(3));
    b.style.setProperty('--dx', ((1 - tb) * 140).toFixed(1) + 'px');
    b.style.setProperty('--op', Math.max(0, tb).toFixed(3));
    document.getElementById('h').style.setProperty('--h', ease((p - 0.70) / 0.25).toFixed(3));
  };
  window.setP(0);
</script></body></html>`;

const PAGE_writes = `<!doctype html><html><head><meta charset="utf-8">${FONT}<style>${BASE}
  .mid{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;
    padding:0 72px}
  h1{font-size:106px;opacity:var(--h,0);transform:translateY(var(--hy,40px))}
  .sub{margin-top:34px;font-weight:600;font-size:40px;line-height:1.38;
    color:rgba(255,255,255,.80);max-width:20ch;opacity:var(--s,0)}
  .pulse{position:absolute;left:50%;top:50%;width:var(--r,0px);height:var(--r,0px);
    margin:calc(var(--r,0px)/-2) 0 0 calc(var(--r,0px)/-2);border-radius:50%;
    border:3px solid rgba(255,154,61,var(--pa,0));pointer-events:none}
</style></head><body>${barHtml}
  <div class="pulse" id="p1"></div>
  <div class="mid"><h1 id="h">This one <em>writes to the chart.</em></h1>
    <p class="sub" id="s">Straight into your EHR, while the patient is still talking.</p></div>
<script>
  const ease = t => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  window.setP = (p) => {
    const h = ease(p / 0.34);
    const el = document.getElementById('h');
    el.style.setProperty('--h', h.toFixed(3));
    el.style.setProperty('--hy', ((1 - h) * 40).toFixed(1) + 'px');
    document.getElementById('s').style.setProperty('--s', ease((p - 0.38) / 0.30).toFixed(3));
    const t = (p % 0.5) / 0.5;
    const pl = document.getElementById('p1');
    pl.style.setProperty('--r', (t * 1500).toFixed(0) + 'px');
    pl.style.setProperty('--pa', ((1 - t) * 0.30).toFixed(3));
  };
  window.setP(0);
</script></body></html>`;

/* The twenty-second scene. One continuous screen that evolves — a neutral clinic
   schedule, deliberately not any vendor's real interface. */
const PAGE_ui = `<!doctype html><html><head><meta charset="utf-8">${FONT}<style>${BASE}
  body{background:linear-gradient(170deg,#0B1030,#101743 60%,#161046)}
  .scene{position:absolute;inset:0;display:flex;flex-direction:column;
    padding:172px 52px 60px;transform:scale(var(--z,1));transform-origin:50% 46%}
  .call{border-radius:28px;border:2px solid rgba(255,154,61,.5);
    background:linear-gradient(120deg,rgba(255,154,61,.16),rgba(255,154,61,.06));
    padding:26px 30px;display:flex;align-items:center;gap:20px;margin-bottom:22px}
  .dot{width:18px;height:18px;border-radius:50%;background:#FF8A2B;flex:none;
    opacity:var(--blink,1)}
  .call .who{font-weight:800;font-size:34px}
  .call .st{font-weight:600;font-size:26px;color:rgba(255,255,255,.7);margin-top:4px}
  .timer{margin-left:auto;font-weight:800;font-size:44px;letter-spacing:-.02em;
    font-variant-numeric:tabular-nums;color:#FF9A3D}

  .panel{flex:1;border-radius:30px;background:rgba(255,255,255,.055);
    border:2px solid rgba(255,255,255,.13);padding:28px 26px;display:flex;
    flex-direction:column;overflow:hidden}
  .ph{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:22px}
  .ph .t{font-weight:800;font-size:34px}
  .ph .d{font-weight:600;font-size:26px;color:rgba(255,255,255,.55)}

  .rowline{display:flex;align-items:center;gap:18px;padding:20px 18px;border-radius:18px;
    margin-bottom:12px;background:rgba(255,255,255,.04);
    border:2px solid transparent;opacity:var(--o,1)}
  .rowline .k{font-weight:700;font-size:28px;color:rgba(255,255,255,.55);min-width:210px}
  .rowline .v{font-weight:800;font-size:30px}
  .rowline .ok{margin-left:auto;font-weight:800;font-size:24px;color:#3DDC97;
    opacity:var(--ok,0)}

  .slots{margin-top:6px;display:grid;gap:11px}
  .slot{display:flex;align-items:center;gap:18px;padding:19px 20px;border-radius:16px;
    background:rgba(255,255,255,.045);border:2px solid transparent}
  .slot .tm{font-weight:800;font-size:29px;min-width:150px;font-variant-numeric:tabular-nums}
  .slot .lbl{font-weight:600;font-size:27px;color:rgba(255,255,255,.5)}
  .slot.open{border-color:rgba(61,220,151,var(--openb,0))}
  .slot.open .lbl{color:rgba(61,220,151,var(--opent,.5))}
  .slot.target{border-color:rgba(255,154,61,var(--tb,0));
    background:rgba(255,154,61,var(--tbg,0.045))}

  .tile{margin-left:auto;display:flex;align-items:center;gap:12px;padding:12px 20px;
    border-radius:12px;background:#FF8A2B;color:#0B1030;font-weight:800;font-size:25px;
    transform:translateY(var(--ty,-260px)) scale(var(--ts,.9));opacity:var(--to,0)}

  /* Sits BELOW the slots, in the panel's empty space. Centred vertically it landed
     squarely on the appointment tile and hid the one moment the film exists for. */
  .stamp{position:absolute;left:50%;top:63%;transform:translate(-50%,-50%) scale(var(--ss,.7));
    padding:26px 46px;border-radius:999px;background:#3DDC97;color:#06281A;
    font-weight:800;font-size:44px;opacity:var(--so,0);z-index:30;white-space:nowrap;
    box-shadow:0 18px 44px -14px rgba(61,220,151,.6)}

  .cap{position:absolute;left:52px;right:52px;bottom:132px;font-weight:800;font-size:52px;
    letter-spacing:-.03em;opacity:var(--co,0);transform:translateY(var(--cy,20px));z-index:35;
    text-shadow:0 6px 30px rgba(11,16,48,.9)}
  .cap em{font-style:normal;color:#FF9A3D}
  .disc{position:absolute;left:52px;right:52px;bottom:64px;font-weight:600;font-size:23px;
    color:rgba(255,255,255,.42);z-index:35}
</style></head><body>${barHtml}
  <div class="scene" id="scene">
    <div class="call"><span class="dot" id="dot"></span>
      <span><span class="who">Incoming call</span>
        <span class="st" id="st">Casey answering…</span></span>
      <span class="timer" id="timer">0:01</span></div>

    <div class="panel">
      <div class="ph"><span class="t">Schedule</span><span class="d">Tuesday</span></div>
      <div class="rowline" id="r1"><span class="k">Caller ID</span>
        <span class="v">(555) 018-4420</span><span class="ok" id="ok1">matched</span></div>
      <div class="rowline" id="r2"><span class="k">Patient</span>
        <span class="v">J. Alvarez · DOB 04/17/81</span><span class="ok" id="ok2">verified</span></div>
      <div class="rowline" id="r3"><span class="k">Insurance</span>
        <span class="v">Delta · active</span><span class="ok" id="ok3">eligible</span></div>

      <div class="slots">
        <div class="slot" id="s1"><span class="tm">1:40 PM</span><span class="lbl">Booked</span></div>
        <div class="slot open" id="s2"><span class="tm">2:20 PM</span><span class="lbl">Open</span></div>
        <div class="slot open target" id="s3"><span class="tm">2:40 PM</span>
          <span class="lbl" id="s3l">Open</span>
          <span class="tile" id="tile">J. Alvarez · New patient</span></div>
        <div class="slot" id="s4"><span class="tm">3:00 PM</span><span class="lbl">Booked</span></div>
      </div>
    </div>
  </div>

  <div class="stamp" id="stamp">Written to chart</div>
  <p class="cap" id="cap"></p>
  <p class="disc">Demo practice · illustrative schedule, not a real patient</p>
<script>
  const ease = t => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  const clamp = t => Math.min(1, Math.max(0, t));
  const CAPS = [
    [0.02, 0.24, 'Patient matched from <em>caller ID.</em>'],
    [0.27, 0.24, 'Live availability, <em>read off your schedule.</em>'],
    [0.52, 0.22, 'Insurance <em>verified on the call.</em>'],
    [0.76, 0.24, 'And the appointment <em>lands in the slot.</em>'],
  ];
  window.setP = (p) => {
    // Call timer runs 0:01 -> 1:12 across the scene.
    const secs = Math.round(1 + p * 71);
    document.getElementById('timer').textContent =
      Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
    document.getElementById('dot').style.setProperty('--blink',
      (0.45 + 0.55 * Math.abs(Math.sin(p * 34))).toFixed(3));
    document.getElementById('scene').style.setProperty('--z', (1 + p * 0.05).toFixed(4));

    document.getElementById('ok1').style.setProperty('--ok', ease((p - 0.06) / 0.08).toFixed(3));
    document.getElementById('ok2').style.setProperty('--ok', ease((p - 0.13) / 0.08).toFixed(3));
    document.getElementById('ok3').style.setProperty('--ok', ease((p - 0.58) / 0.09).toFixed(3));

    // Availability sweep.
    const av = ease((p - 0.30) / 0.16);
    document.getElementById('s2').style.setProperty('--openb', (av * 0.85).toFixed(3));
    document.getElementById('s2').style.setProperty('--opent', (0.5 + av * 0.5).toFixed(3));
    document.getElementById('s3').style.setProperty('--openb', (av * 0.85).toFixed(3));

    // The target slot lights, then the tile drops into it.
    const tg = ease((p - 0.72) / 0.10);
    document.getElementById('s3').style.setProperty('--tb', tg.toFixed(3));
    document.getElementById('s3').style.setProperty('--tbg', (0.045 + tg * 0.16).toFixed(3));
    const dr = ease((p - 0.78) / 0.13);
    const tile = document.getElementById('tile');
    tile.style.setProperty('--ty', ((1 - dr) * -260).toFixed(1) + 'px');
    tile.style.setProperty('--ts', (0.9 + dr * 0.1).toFixed(3));
    tile.style.setProperty('--to', dr.toFixed(3));
    if (dr > 0.9) document.getElementById('s3l').textContent = 'Booked';

    const sp = clamp((p - 0.86) / 0.07), sf = clamp((p - 0.965) / 0.035);
    const st = document.getElementById('stamp');
    st.style.setProperty('--so', (ease(sp) * (1 - sf)).toFixed(3));
    st.style.setProperty('--ss', (0.7 + ease(sp) * 0.3).toFixed(3));
    document.getElementById('st').textContent = p > 0.80 ? 'Booked · still on the call'
      : p > 0.5 ? 'Checking eligibility…' : 'Casey answering…';

    let html = '', o = 0, y = 20;
    for (const [s, d, t] of CAPS) {
      if (p >= s && p < s + d) {
        html = t; const l = (p - s) / d;
        o = Math.min(ease(l / 0.18), ease((1 - l) / 0.18)); y = (1 - ease(l / 0.18)) * 20;
      }
    }
    const cap = document.getElementById('cap');
    cap.innerHTML = html;
    cap.style.setProperty('--co', o.toFixed(3));
    cap.style.setProperty('--cy', y.toFixed(1) + 'px');
  };
  window.setP(0);
</script></body></html>`;

/* End card. The top bar's URL is hidden here — it appeared alongside the CTA pill,
   so vocryn.com read twice on the same frame and looked like a mistake. The CTA
   also says what to DO; an address on its own is not a call to action. */
const PAGE_end = `<!doctype html><html><head><meta charset="utf-8">${FONT}<style>${BASE}
  .bar .site{display:none}
  .mid{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:30px;text-align:center;padding:0 64px;
    transform:scale(var(--z,1))}
  .mid img{width:290px;height:auto;opacity:var(--o1,0)}
  .wordmark{font-weight:800;font-size:78px;letter-spacing:-.03em;opacity:var(--o1,0);
    line-height:1}
  .wordmark span{color:#FF9A3D}
  .kick{font-weight:700;font-size:38px;line-height:1.3;color:rgba(255,255,255,.82);
    opacity:var(--o1,0);max-width:20ch;margin-top:-8px}
  .cta{margin-top:14px;display:flex;flex-direction:column;align-items:center;gap:16px;
    opacity:var(--o2,0);transform:translateY(var(--cy,26px))}
  .cta .go{font-weight:800;font-size:52px;background:#FF8A2B;color:#0B1030;
    padding:34px 74px;border-radius:999px;letter-spacing:-.02em;
    box-shadow:0 22px 56px -18px rgba(255,138,43,.8)}
  .cta .url{font-weight:800;font-size:44px;letter-spacing:-.01em;color:#fff}
  .cta .url b{color:#FF9A3D;font-weight:800}
</style></head><body>${barHtml}
  <div class="mid" id="m">
    <img src="${MARK}" alt="">
    <div class="wordmark">VOCRYN <span>Ai</span></div>
    <p class="kick">Hear it book a real appointment &mdash; unedited.</p>
    <div class="cta" id="c">
      <span class="go">Book a demo</span>
      <span class="url">vocryn<b>.com</b></span>
    </div>
  </div>
<script>
  const ease = t => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  window.setP = (p) => {
    const m = document.getElementById('m'), c = document.getElementById('c');
    m.style.setProperty('--o1', ease(p / 0.28).toFixed(3));
    m.style.setProperty('--z', (1 + p * 0.03).toFixed(4));
    const o2 = ease((p - 0.22) / 0.30);
    c.style.setProperty('--o2', o2.toFixed(3));
    c.style.setProperty('--cy', ((1 - o2) * 26).toFixed(1) + 'px');
  };
  window.setP(0);
</script></body></html>`;

/* Transparent logo bar composited over the live-footage segments. */
const PAGE_baronly = `<!doctype html><html><head><meta charset="utf-8">${FONT}<style>${BASE}
  body{background:transparent}
  .cap{position:absolute;left:64px;right:64px;bottom:150px;font-weight:800;font-size:74px;
    letter-spacing:-.035em;text-shadow:0 8px 40px rgba(9,13,40,.95)}
  .cap em{font-style:normal;color:#FF9A3D}
  .scrim{position:absolute;inset:0;background:linear-gradient(180deg,
    rgba(9,13,40,.82) 0%,rgba(9,13,40,.30) 26%,rgba(9,13,40,0) 46%,
    rgba(9,13,40,.30) 74%,rgba(9,13,40,.86) 100%)}
</style></head><body><div class="scrim"></div>${barHtml}
  <p class="cap">__CAP__</p></body></html>`;

const PAGES = { split: PAGE_split, writes: PAGE_writes, ui: PAGE_ui, end: PAGE_end };

/* ------------------------------------------------------------- rendering */

let ws, msgId = 0, session, chrome;
const pending = new Map();
const send = (m, p = {}, s = session) => {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method: m, params: p, ...(s ? { sessionId: s } : {}) }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
};

async function connect() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vocryn-ad2-'));
  chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--force-color-profile=srgb', '--font-render-hinting=none',
    '--allow-file-access-from-files',
    `--user-data-dir=${profile}`, `--remote-debugging-port=${PORT}`, 'about:blank',
  ], { stdio: 'ignore' });

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
}

async function loadPage(html, transparent) {
  await send('Emulation.setDefaultBackgroundColorOverride',
    transparent ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {});
  const tmp = path.join(WORK, '_p.html');
  fs.writeFileSync(tmp, html);
  await send('Page.navigate', { url: fileUrl(tmp) + '?t=' + Date.now() });
  await sleep(300);
  await send('Runtime.evaluate', {
    expression: `Promise.all([document.fonts.ready,
      ...[...document.images].map(i => i.complete && i.naturalWidth ? 0
        : new Promise(r => { i.onload = r; i.onerror = r; setTimeout(r, 5000); }))
    ]).then(() => new Promise(r => setTimeout(r, 200)))`,
    awaitPromise: true,
  });
}

/** Render an animated page to a numbered PNG sequence. */
async function renderFrames(id, html, dur) {
  const dir = path.join(WORK, id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  await loadPage(html, false);
  const n = Math.round(dur * FPS);
  for (let f = 0; f < n; f++) {
    // Drive the page rather than re-navigating: same pixels for the same frame,
    // and roughly ten times faster.
    await send('Runtime.evaluate', { expression: `window.setP(${(f / (n - 1)).toFixed(5)})` });
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(dir, String(f).padStart(4, '0') + '.png'),
      Buffer.from(shot.data, 'base64'));
    if (f % 30 === 0) process.stdout.write('.');
  }
  const out = path.join(WORK, id + '.mp4');
  ff(['-framerate', String(FPS), '-i', path.join(dir, '%04d.png'),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', out]);
  fs.rmSync(dir, { recursive: true, force: true });
  return out;
}

async function renderOverlay(id, cap) {
  await loadPage(PAGE_baronly.replace('__CAP__', cap), true);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const p = path.join(WORK, id + '-ov.png');
  fs.writeFileSync(p, Buffer.from(shot.data, 'base64'));
  return p;
}

/* ----------------------------------------------------------------- audio */

function buildAudio(total) {
  const lines = [];
  for (let i = 1; i <= 8; i++) {
    const src = path.join(VO, `t${i}.wav`);
    lines.push({ file: src, dur: wavSec(src) });
  }
  // Casey's real greeting, over the "answered" segment.
  const casey = path.join(WORK, 'casey.wav');
  ff(['-i', path.join(ROOT, 'assets', 'audio', 'demo-1.mp3'), '-ss', '0', '-t', '4.6',
    '-af', 'afade=t=in:st=0:d=0.12,afade=t=out:st=4.2:d=0.4,volume=1.5',
    '-ar', '44100', '-ac', '1', casey]);

  // Cue each line to the beat it belongs to.
  // Line 8 is cued at 36.6 rather than 37.4: the replacement copy runs 3.15s, and
  // any later would push the last word past the end of the picture.
  const at = [0.5, 4.4, 13.4, 18.4, 23.4, 28.6, 33.2, 36.6];
  lines.forEach((l, i) => { l.at = at[i]; });

  // Cues are hand-placed against the picture, but line lengths come from the
  // generator and shift whenever the copy changes. Line 7 once ran long and
  // collided with line 8, so two voices spoke over each other for over a second.
  // Push any late line clear of the one before it, and say so rather than
  // shipping it silently.
  const MIN_GAP = 0.18;
  for (let i = 1; i < lines.length; i++) {
    const prevEnd = lines[i - 1].at + lines[i - 1].dur;
    if (lines[i].at < prevEnd + MIN_GAP) {
      const moved = +(prevEnd + MIN_GAP).toFixed(2);
      console.log(`\n  ! VO ${i + 1} overlapped VO ${i} — moved ${lines[i].at}s -> ${moved}s`);
      lines[i].at = moved;
    }
  }
  const last = lines[lines.length - 1];
  if (last.at + last.dur > total) {
    console.log(`  ! VO ${lines.length} runs past the picture by ` +
      `${(last.at + last.dur - total).toFixed(2)}s — shorten the copy`);
  }

  const inputs = ['-f', 'lavfi', '-i', `anullsrc=r=44100:cl=mono:d=${total}`, '-i', casey];
  lines.forEach((l) => inputs.push('-i', l.file));
  const delays = lines.map((l, i) =>
    `[${i + 2}:a]adelay=${Math.round(l.at * 1000)}[v${i}]`).join(';');
  const mix = lines.map((_, i) => `[v${i}]`).join('');
  const out = path.join(WORK, 'mix.wav');
  ff([...inputs, '-filter_complex',
    `[1:a]adelay=8600[c];${delays};[0:a][c]${mix}amix=inputs=${lines.length + 2}:normalize=0[a]`,
    '-map', '[a]', '-t', String(total), '-ac', '2', out]);
  return { out, lines };
}

/* ------------------------------------------------------------------ main */

(async () => {
  console.log('\n  Vocryn Ai — "Writes to the Chart"  40s\n');
  await connect();

  const parts = [];
  for (const s of SEGMENTS) {
    process.stdout.write(`  ${s.id.padEnd(8)}`);
    if (s.kind === 'frames') {
      parts.push(await renderFrames(s.id, PAGES[s.id], s.dur));
    } else {
      const cap = s.id === 'answer'
        ? 'Answered in <em>1.8 seconds.</em>'
        : 'She\'s <em>still on the phone.</em>';
      const ov = await renderOverlay(s.id, cap);
      const out = path.join(WORK, s.id + '.mp4');
      ff(['-ss', String(s.ss), '-i', path.join(CLIPS, s.src), '-i', ov,
        '-filter_complex',
        `[0:v]crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale=${W}:${H}:flags=lanczos,` +
        `fps=${FPS}[v];[v][1:v]overlay=0:0[o]`,
        '-map', '[o]', '-t', String(s.dur), '-an',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', out]);
      parts.push(out);
    }
    console.log(' ok');
  }
  ws.close(); chrome.kill();

  const total = SEGMENTS.reduce((n, s) => n + s.dur, 0);
  process.stdout.write('  audio    ');
  const { out: audio } = buildAudio(total);
  console.log('ok');

  process.stdout.write('  mux      ');
  const list = path.join(WORK, 'list.txt');
  fs.writeFileSync(list, parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
  const silent = path.join(WORK, 'silent.mp4');
  ff(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);

  const final = path.join(OUT, 'vocryn-writes-to-chart-40s.mp4');
  ff(['-i', silent, '-i', audio, '-map', '0:v', '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-profile:v', 'high', '-level', '4.1',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
    '-movflags', '+faststart', '-shortest', final]);
  console.log('ok');

  console.log(`\n  ${total}s  ${W}x${H}  ` +
    `${(fs.statSync(final).size / 1024 / 1024).toFixed(1)} MB` +
    `\n  -> assets/brand/video/vocryn-writes-to-chart-40s.mp4\n`);
})().catch((e) => { console.error(e); try { chrome.kill(); } catch (_) {} process.exit(1); });
