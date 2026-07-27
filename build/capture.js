#!/usr/bin/env node
'use strict';

/**
 * Targeted screenshots of specific components in specific states.
 *
 *   node build/capture.js <outDir>
 *
 * Unlike shots.js (which sweeps every page for overflow), this scrolls to a
 * component, optionally interacts with it, and captures that exact moment —
 * used to eyeball the demo player mid-playback, the mobile action bar, etc.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, '.shots');
fs.mkdirSync(OUT, { recursive: true });

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p));

const PORT = 9455;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fileUrl = (p) => 'file:///' + path.join(ROOT, p).replace(/\\/g, '/').replace(/ /g, '%20');

let ws, msgId = 0, session;
const pending = new Map();
const send = (m, p = {}, s = session) => {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method: m, params: p, ...(s ? { sessionId: s } : {}) }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
};

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vocryn-cap-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--mute-audio', '--autoplay-policy=no-user-gesture-required',
  '--allow-file-access-from-files', `--user-data-dir=${profile}`,
  `--remote-debugging-port=${PORT}`, 'about:blank',
], { stdio: 'ignore' });

const SEL_PLAYER = "document.querySelector('[data-player]')";
const SEL_PLAY = "document.querySelector('[data-pane]:not([hidden]) [data-play]')";

const SHOTS = [
  ['player-1440', 'index.html', 1440, 940, 'light',
    `${SEL_PLAYER}.scrollIntoView({ block: 'center' })`],
  ['player-playing', 'index.html', 1440, 940, 'light',
    `${SEL_PLAYER}.scrollIntoView({ block: 'center' }); ${SEL_PLAY}.click();
     await new Promise(r => setTimeout(r, 9000))`],
  ['player-1440-dark', 'index.html', 1440, 940, 'dark',
    `${SEL_PLAYER}.scrollIntoView({ block: 'center' })`],
  ['player-390', 'index.html', 390, 844, 'light',
    `${SEL_PLAYER}.scrollIntoView({ block: 'start' }); scrollBy(0, -80)`],
  ['langs-1440', 'index.html', 1440, 780, 'light',
    `document.querySelector('.langs').scrollIntoView({ block: 'center' })`],
  ['mcta-390', 'index.html', 390, 844, 'light',
    `scrollTo(0, 1000); await new Promise(r => setTimeout(r, 700))`],
  ['home-white', 'index.html', 1440, 940, 'light', ''],
  ['services-white', 'services.html', 1440, 940, 'light',
    `scrollTo(0, 1150); await new Promise(r => setTimeout(r, 400))`],
  ['pricing-white', 'pricing.html', 1440, 940, 'light',
    `scrollTo(0, 620); await new Promise(r => setTimeout(r, 400))`],
  ['integrations-grid', 'integrations.html', 1440, 940, 'light',
    `document.querySelector('.intg__tel').scrollIntoView({ block: 'end' })`],
  ['integrations-390', 'integrations.html', 390, 844, 'light',
    `document.querySelector('.intg__tel').scrollIntoView({ block: 'end' })`],
  ['cap-1440', 'index.html', 1440, 980, 'light',
    `document.querySelector('[data-cap]').scrollIntoView({ block: 'center' })`],
  ['cap-1440-alt', 'index.html', 1440, 980, 'light',
    `document.querySelectorAll('[data-cap-tab]')[4].click();
     document.querySelector('[data-cap]').scrollIntoView({ block: 'center' })`],
  ['cap-1440-dark', 'index.html', 1440, 980, 'dark',
    `document.querySelector('[data-cap]').scrollIntoView({ block: 'center' })`],
  ['cap-390', 'index.html', 390, 900, 'light',
    `document.querySelector('[data-cap]').scrollIntoView({ block: 'start' }); scrollBy(0, -80)`],
  ['logo-zoom', 'index.html', 640, 220, 'light', ''],
];

const SETTLE = (extra) => `(async () => {
  try { localStorage.clear(); } catch (e) {}
  // The site scrolls smoothly; for a still capture we want the jump to land now.
  document.documentElement.style.scrollBehavior = 'auto';
  document.querySelectorAll('.reveal').forEach(e => e.classList.add('in'));
  document.querySelectorAll('[data-count]').forEach(e => {
    const v = parseFloat(e.dataset.count);
    const s = e.dataset.dec === '1' ? v.toFixed(1) : Math.round(v).toLocaleString('en-US');
    e.textContent = (e.dataset.pre || '') + s + (e.dataset.suf || '');
  });
  const a = document.getElementById('announce'); if (a) a.hidden = false;
  ${extra};
})()`;

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

  for (const [name, page, w, h, theme, js] of SHOTS) {
    await send('Emulation.setDeviceMetricsOverride',
      { width: w, height: h, deviceScaleFactor: 1, mobile: w < 800 });
    await send('Emulation.setEmulatedMedia',
      { features: [{ name: 'prefers-color-scheme', value: theme }] });
    await send('Page.navigate', { url: fileUrl(page) });
    await sleep(1500);
    await send('Runtime.evaluate', {
      expression: `document.documentElement.dataset.theme='${theme}'`,
    });
    await send('Runtime.evaluate', { expression: SETTLE(js), awaitPromise: true });
    await sleep(700);
    const r = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(r.data, 'base64'));
    console.log('  ' + name);
  }

  ws.close(); chrome.kill(); process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
