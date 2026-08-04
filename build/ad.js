#!/usr/bin/env node
'use strict';

/**
 * Assembles the "12:40" advertisement — 9:16, ~30s.
 *
 *   node build/ad.js
 *
 * Live footage: three Kling clips in build/video-src/. Everything else — cards,
 * and the text laid over the footage — is rendered here through Chrome.
 *
 * Voiceover is Casey speaking in the first person, generated line by line and
 * laid out on a continuous track. Segment lengths are fixed by what the picture
 * needs; the VO is placed against them and is allowed to run across a cut, which
 * is how a real edit works. An earlier version had a single line of Casey audio
 * and 25 seconds of near-silence.
 *
 * SAFETY: writes only to assets/brand/video/ and build/video-work/.
 */

const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(__dirname, 'video-src');
const VO = path.join(SRC, 'vo');
const WORK = path.join(__dirname, 'video-work');
const OUT = path.join(ROOT, 'assets', 'brand', 'video');

const FFMPEG = 'C:/Users/Arshad Computer Lab/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe';
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p));

const W = 1080, H = 1920, FPS = 30;
const PORT = 9530;
// Seed Audio speaks unhurriedly. A shade over 1.0 tightens it to the picture
// without sounding rushed; anything past ~1.15 starts to read as sped up.
const TEMPO = 1.12;
const LEAD_IN = 1.2;   // let the phone ring alone before the first line
const GAP = 0.35;      // breath between lines

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ff = (args) => execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...args], { stdio: 'pipe' });
const fileUrl = (p) => 'file:///' + p.replace(/\\/g, '/').replace(/ /g, '%20');
const MARK = fileUrl(path.join(__dirname, 'logo-src', 'mark-hi.png'));
const wavSeconds = (p) => (fs.statSync(p).size - 44) / (44100 * 2);

fs.mkdirSync(WORK, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------ layout */

const CSS = `
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px;overflow:hidden}
  body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;
    color:#fff}
  .card{position:absolute;inset:0;padding:120px 96px;display:flex;flex-direction:column;
    background:radial-gradient(120% 70% at 15% 0%,#1E2A7A 0%,transparent 55%),
      linear-gradient(165deg,#0B1030 0%,#141A4E 55%,#1A1140 100%)}
  .overlay{position:absolute;inset:0;padding:120px 96px;display:flex;flex-direction:column;
    background:linear-gradient(180deg,rgba(9,13,40,.88) 0%,rgba(9,13,40,.55) 30%,
      rgba(9,13,40,0) 52%,rgba(9,13,40,0) 68%,rgba(9,13,40,.86) 100%)}
  .brand{display:flex;align-items:center;gap:16px;margin-bottom:auto}
  .brand img{width:96px;height:auto;display:block}
  .brand span{font-weight:800;font-size:36px;letter-spacing:-.02em}
  .brand b{color:#FF9A3D}
  .kicker{display:inline-flex;align-items:center;gap:16px;font-weight:800;font-size:34px;
    letter-spacing:.10em;text-transform:uppercase;color:#FF9A3D;margin-bottom:28px}
  .kicker::before{content:'';width:58px;height:6px;border-radius:3px;background:#FF9A3D}
  h1{font-weight:800;font-size:94px;line-height:1.06;letter-spacing:-.04em;text-wrap:balance}
  h1 em{font-style:normal;color:#FF9A3D}
  .sub{margin-top:26px;font-weight:600;font-size:38px;line-height:1.36;
    color:rgba(255,255,255,.82);max-width:21ch}
  .foot{margin-top:auto}
`;
const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap">`;
const brandRow = `<div class="brand"><img src="${MARK}" alt=""><span>VOCRYN <b>Ai</b></span></div>`;

const overlay = (inner) => `<!doctype html><html><head><meta charset="utf-8">${FONT}
<style>${CSS} body{background:transparent}</style></head><body>
  <div class="overlay">${inner}</div></body></html>`;
const card = (inner) => `<!doctype html><html><head><meta charset="utf-8">${FONT}
<style>${CSS}</style></head><body><div class="card">${inner}</div></body></html>`;

const PAGES = {
  ov_desk: overlay(`${brandRow}
    <div class="foot"><h1>Nobody's answering&nbsp;this.</h1>
      <p class="sub">12:40 on a Tuesday.</p></div>`),

  ov_car: overlay(`${brandRow}
    <div class="foot"><h1><em>67%</em> hang up before anyone answers.</h1></div>`),

  ov_casey: overlay(`${brandRow}
    <div class="foot"><h1>Meet <em>Casey.</em></h1>
      <p class="sub">Answers in under two seconds. Books into athenahealth.</p></div>`),

  card_phone: card(`${brandRow}
    <span class="kicker">So she scrolls</span>
    <h1>She just became <em>someone else's</em> patient.</h1>
    <div style="margin-top:52px;display:grid;gap:18px">
      <div style="display:flex;align-items:center;gap:22px;padding:30px 34px;border-radius:22px;
        background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.14)">
        <span style="width:16px;height:16px;border-radius:50%;background:rgba(255,255,255,.3)"></span>
        <span style="font-weight:700;font-size:36px;color:rgba(255,255,255,.55)">Your clinic
          &middot; no answer</span></div>
      <div style="display:flex;align-items:center;gap:22px;padding:30px 34px;border-radius:22px;
        background:rgba(255,154,61,.16);border:2px solid #FF9A3D">
        <span style="width:16px;height:16px;border-radius:50%;background:#FF9A3D"></span>
        <span style="font-weight:800;font-size:36px">Clinic down the road &middot; answered</span>
      </div></div>
    <div class="foot"></div>`),

  card_math: card(`${brandRow}
    <span class="kicker">The arithmetic</span>
    <h1>150 missed calls a month.</h1>
    <div style="margin-top:56px;display:grid">
      ${[['~30', 'were prospective new patients'],
         ['~15', 'booked somewhere else'],
         ['$9k+', 'in production, gone. Monthly.']].map(([a, b], i) => `
        <div style="display:flex;align-items:baseline;gap:34px;padding:34px 0;
          border-top:2px solid rgba(255,255,255,.14)${i === 2 ? ';border-bottom:2px solid rgba(255,255,255,.14)' : ''}">
          <span style="font-weight:800;font-size:88px;letter-spacing:-.045em;min-width:280px;
            line-height:1;color:${i === 2 ? '#FF8A2B' : '#fff'}">${a}</span>
          <span style="font-weight:600;font-size:36px;line-height:1.3;
            color:${i === 2 ? '#fff' : 'rgba(255,255,255,.78)'}">${b}</span></div>`).join('')}
    </div>
    <p style="margin-top:38px;font-weight:600;font-size:28px;color:rgba(255,255,255,.45)">
      Illustrative, at a $600 new-patient value.</p>
    <div class="foot"></div>`),

  card_trust: card(`${brandRow}
    <span class="kicker">And it's safe to do</span>
    <h1>HIPAA-ready. <em>BAA signed</em> before go-live.</h1>
    <div style="margin-top:50px;display:grid;gap:20px">
      ${['Writes straight into athenahealth',
         'US-based servers, encrypted end to end',
         'Anything urgent goes to a human'].map((t) => `
        <div style="display:flex;gap:24px;align-items:center;font-weight:700;font-size:38px">
          <span style="width:62px;height:62px;flex:none;display:grid;place-items:center;
            border-radius:50%;background:#FF8A2B;color:#0B1030">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor"
              stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6L9 17l-5-5"/></svg></span>
          <span>${t}</span></div>`).join('')}
    </div>
    <div class="foot"></div>`),

  card_end: card(`<div style="margin:auto;display:flex;flex-direction:column;align-items:center;
      text-align:center;gap:44px">
      <img src="${MARK}" style="width:340px;height:auto" alt="">
      <div style="font-weight:800;font-size:76px;letter-spacing:-.03em">VOCRYN
        <span style="color:#FF9A3D">Ai</span></div>
      <div style="font-weight:800;font-size:46px;background:#FF8A2B;color:#0B1030;
        padding:30px 60px;border-radius:999px;letter-spacing:-.02em">vocryn.com</div>
      <div style="font-weight:600;font-size:34px;color:rgba(255,255,255,.66)">
        Hear a real call, unedited</div></div>`),
};

/* Segment lengths are set by what the picture needs. The VO is laid against
   them afterwards and may cross a cut. */
const TIMELINE = [
  { kind: 'clip', src: 'desk.mp4', dur: 3.4, ov: 'ov_desk' },
  { kind: 'clip', src: 'car.mp4', dur: 5.0, ov: 'ov_car' },
  { kind: 'card', src: 'card_phone', dur: 2.6 },
  { kind: 'card', src: 'card_math', dur: 5.6 },
  { kind: 'clip', src: 'casey2.mp4', dur: 8.0, ov: 'ov_casey' },
  { kind: 'card', src: 'card_trust', dur: 3.6 },
  { kind: 'card', src: 'card_end', dur: 2.4 },
];

/* ------------------------------------------------------------- render pages */

let ws, msgId = 0, session, chrome;
const pending = new Map();
const send = (m, p = {}, s = session) => {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method: m, params: p, ...(s ? { sessionId: s } : {}) }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
};

async function renderPages() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vocryn-ad-'));
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

  for (const [name, html] of Object.entries(PAGES)) {
    await send('Emulation.setDefaultBackgroundColorOverride',
      name.startsWith('ov_') ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {});
    const tmp = path.join(WORK, '_p.html');
    fs.writeFileSync(tmp, html);
    await send('Page.navigate', { url: fileUrl(tmp) + '?n=' + name });
    await sleep(240);
    await send('Runtime.evaluate', {
      expression: `Promise.all([document.fonts.ready,
        ...[...document.images].map(i => i.complete && i.naturalWidth ? 0
          : new Promise(r => { i.onload = r; i.onerror = r; setTimeout(r, 5000); }))
      ]).then(() => new Promise(r => setTimeout(r, 180)))`,
      awaitPromise: true,
    });
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(WORK, name + '.png'), Buffer.from(shot.data, 'base64'));
    process.stdout.write('.');
  }
  ws.close(); chrome.kill();
}

/* ------------------------------------------------------------------- build */

function buildSegments() {
  return TIMELINE.map((t, i) => {
    const out = path.join(WORK, `seg${i}.mp4`);
    if (t.kind === 'clip') {
      // Kling returns the START IMAGE's aspect ratio and ignores the requested
      // one, so crop to 9:16 from centre before scaling.
      const chain = `crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',` +
        `scale=${W}:${H}:flags=lanczos,fps=${FPS}`;
      ff(['-i', path.join(SRC, t.src), '-i', path.join(WORK, t.ov + '.png'),
        '-filter_complex', `[0:v]${chain}[v];[v][1:v]overlay=0:0[o]`,
        '-map', '[o]', '-t', String(t.dur), '-an',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', out]);
    } else {
      ff(['-loop', '1', '-i', path.join(WORK, t.src + '.png'), '-t', String(t.dur),
        '-vf', `scale=${Math.round(W * 1.06)}:-1,zoompan=z='min(zoom+0.0004,1.06)':` +
          `d=${Math.round(t.dur * FPS)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':` +
          `s=${W}x${H}:fps=${FPS},fps=${FPS}`,
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', out]);
    }
    process.stdout.write('.');
    return out;
  });
}

function buildAudio(total) {
  // Trim, level and tighten each line, then measure what we actually have.
  const lines = [];
  for (let i = 1; i <= 7; i++) {
    const out = path.join(WORK, `vo${i}.wav`);
    ff(['-i', path.join(VO, `${i}.wav`), '-af',
      'silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB:detection=peak,' +
      'areverse,silenceremove=start_periods=1:start_silence=0.08:start_threshold=-45dB:detection=peak,' +
      `areverse,atempo=${TEMPO},loudnorm=I=-16:TP=-1.5`,
      '-ar', '44100', '-ac', '1', '-c:a', 'pcm_s16le', out]);
    lines.push({ file: out, dur: wavSeconds(out) });
  }

  // Lay them end to end from the lead-in, with a breath between.
  let t = LEAD_IN;
  lines.forEach((l) => { l.at = t; t += l.dur + GAP; });
  const speechEnd = t - GAP;

  // North-American ring cadence, synthesised so nothing licensable is embedded.
  const ring = path.join(WORK, 'ring.wav');
  ff(['-f', 'lavfi', '-i',
    `aevalsrc='(sin(2*PI*440*t)+sin(2*PI*480*t))*0.20*lt(mod(t\\,6)\\,2)*(1-exp(-40*mod(t\\,6)))':s=44100:d=8.4`,
    '-af', 'afade=t=out:st=7.2:d=1.2', '-ac', '1', ring]);

  const inputs = ['-f', 'lavfi', '-i', `anullsrc=r=44100:cl=mono:d=${total}`, '-i', ring];
  lines.forEach((l) => inputs.push('-i', l.file));
  const delays = lines.map((l, i) =>
    `[${i + 2}:a]adelay=${Math.round(l.at * 1000)}[v${i}]`).join(';');
  const mix = lines.map((_, i) => `[v${i}]`).join('');

  const out = path.join(WORK, 'mix.wav');
  ff([...inputs, '-filter_complex',
    `[1:a]adelay=0[r];${delays};[0:a][r]${mix}amix=inputs=${lines.length + 2}:normalize=0[a]`,
    '-map', '[a]', '-t', String(total), '-ac', '2', out]);

  return { out, lines, speechEnd };
}

(async () => {
  console.log('\n  Vocryn Ai — "12:40"\n');
  process.stdout.write('  cards + overlays  ');
  await renderPages();
  console.log('');

  process.stdout.write('  segments          ');
  const segs = buildSegments();
  console.log('');

  const total = TIMELINE.reduce((n, t) => n + t.dur, 0);
  process.stdout.write('  voiceover         ');
  const { out: audio, lines, speechEnd } = buildAudio(total);
  console.log('.');

  process.stdout.write('  assembling        ');
  const list = path.join(WORK, 'list.txt');
  fs.writeFileSync(list, segs.map((s) => `file '${s.replace(/\\/g, '/')}'`).join('\n'));
  const silent = path.join(WORK, 'silent.mp4');
  ff(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);

  const final = path.join(OUT, 'vocryn-casey-30s.mp4');
  ff(['-i', silent, '-i', audio, '-map', '0:v', '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-profile:v', 'high', '-level', '4.1',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
    '-movflags', '+faststart', '-shortest', final]);
  console.log('.\n');

  lines.forEach((l, i) =>
    console.log(`  VO ${i + 1}  ${l.at.toFixed(2)}s → ${(l.at + l.dur).toFixed(2)}s`));
  const mb = (fs.statSync(final).size / 1024 / 1024).toFixed(1);
  console.log(`\n  picture ${total.toFixed(1)}s · speech ends ${speechEnd.toFixed(1)}s` +
    `  ${W}x${H}  ${mb} MB\n  -> assets/brand/video/vocryn-casey-30s.mp4\n`);
})().catch((e) => { console.error(e); try { chrome.kill(); } catch (_) {} process.exit(1); });
