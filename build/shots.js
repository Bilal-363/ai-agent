#!/usr/bin/env node
'use strict';

/**
 * Visual QA harness. Drives headless Chrome over the DevTools Protocol so we get
 * true device-metric emulation (Chrome's --window-size is clamped on Windows and
 * silently crops instead of resizing the viewport).
 *
 *   node build/shots.js <outputDir>
 *
 * Captures each page at several widths in both themes, opens the mega-menus and
 * the mobile drawer, and reports any horizontal overflow it finds.
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
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));
if (!CHROME) { console.error('No Chrome/Edge found.'); process.exit(1); }

const PORT = 9333;
const url = (f) => 'file:///' + path.join(ROOT, f).replace(/\\/g, '/').replace(/ /g, '%20');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* --------------------------------------------------------------- CDP client */

let ws, msgId = 0;
const pending = new Map();
const listeners = [];

function send(method, params = {}, sessionId) {
  const id = ++msgId;
  const payload = { id, method, params };
  if (sessionId) payload.sessionId = sessionId;
  ws.send(JSON.stringify(payload));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

function onEvent(method, fn) { listeners.push({ method, fn }); }

async function connect(wsUrl) {
  ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true });
    ws.addEventListener('error', rej, { once: true });
  });
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : resolve(m.result);
    } else if (m.method) {
      listeners.filter((l) => l.method === m.method).forEach((l) => l.fn(m.params));
    }
  });
}

/* ------------------------------------------------------------------ launch */

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vocryn-chrome-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--no-default-browser-check', '--disable-extensions', '--mute-audio',
  '--allow-file-access-from-files', `--user-data-dir=${profile}`,
  `--remote-debugging-port=${PORT}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

async function targetWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      return (await r.json()).webSocketDebuggerUrl;
    } catch (e) { await sleep(250); }
  }
  throw new Error('Chrome DevTools endpoint never came up.');
}

/* ------------------------------------------------------------------- shots */

const VIEWPORTS = [
  { name: '360', w: 360, h: 780, mobile: true },
  { name: '390', w: 390, h: 844, mobile: true },
  { name: '768', w: 768, h: 1024, mobile: true },
  { name: '1024', w: 1024, h: 800, mobile: false },
  { name: '1440', w: 1440, h: 900, mobile: false },
  { name: '1920', w: 1920, h: 1080, mobile: false },
];

const PAGES = process.env.SHOT_PAGES
  ? process.env.SHOT_PAGES.split(',')
  : ['index', 'services', 'use-cases', 'pricing', 'roi-calculator', 'security',
     'how-it-works', 'integrations', 'results', 'faq', 'demo', 'contact', 'about',
     'blog', 'true-cost-of-a-missed-call', 'privacy', '404'];

const overflow = [];
let session;

async function setup(vp, theme) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: vp.w, height: vp.h, deviceScaleFactor: 1, mobile: vp.mobile,
  }, session);
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: theme }],
  }, session);
  await send('Emulation.setTouchEmulationEnabled', { enabled: vp.mobile }, session);
}

async function go(page) {
  const loaded = new Promise((res) => onEvent('Page.loadEventFired', res));
  await send('Page.navigate', { url: url(page + '.html') }, session);
  await Promise.race([loaded, sleep(6000)]);
  // Clear the stored theme so the emulated media query wins, then reveal
  // everything so a static screenshot shows the settled page.
  await send('Runtime.evaluate', {
    expression: `(() => {
      try { localStorage.clear(); } catch (e) {}
      const t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = t;
      document.querySelectorAll('.reveal').forEach(e => e.classList.add('in'));
      document.querySelectorAll('[data-count]').forEach(e => {
        const v = parseFloat(e.dataset.count);
        const s = e.dataset.dec === '1' ? v.toFixed(1) : Math.round(v).toLocaleString('en-US');
        e.textContent = (e.dataset.pre || '') + s + (e.dataset.suf || '');
      });
      const a = document.getElementById('announce'); if (a) a.hidden = false;
      return 1;
    })()`, awaitPromise: false,
  }, session);
  await sleep(320);
}

async function checkOverflow(page, vp, theme) {
  const r = await send('Runtime.evaluate', {
    expression: `(() => {
      const de = document.documentElement;
      const vw = de.clientWidth;
      const bad = [];
      // An element wider than the viewport is only a bug if nothing above it
      // clips or scrolls — marquees and scrollable tables are intentional.
      const clipped = (el) => {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const ox = getComputedStyle(p).overflowX;
          if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') return true;
        }
        return false;
      };
      if (de.scrollWidth > vw + 1) {
        for (const el of document.querySelectorAll('body *')) {
          const b = el.getBoundingClientRect();
          if (b.width === 0) continue;
          if (b.right > vw + 2 || b.left < -2) {
            const cs = getComputedStyle(el);
            if (cs.position === 'fixed' || cs.visibility === 'hidden') continue;
            if (clipped(el)) continue;
            bad.push(el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0]
              + ' [' + Math.round(b.left) + '..' + Math.round(b.right) + ']');
            if (bad.length > 5) break;
          }
        }
      }
      return JSON.stringify({ scrollWidth: de.scrollWidth, vw, bad });
    })()`, returnByValue: true,
  }, session);
  const d = JSON.parse(r.result.value);
  if (d.scrollWidth > d.vw + 1) {
    overflow.push(`${page} @${vp.name}/${theme}: scrollWidth ${d.scrollWidth} > ${d.vw} — ${d.bad.join(' | ')}`);
  }
}

async function shoot(file, fullPage) {
  const r = await send('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: !!fullPage, optimizeForSpeed: false,
  }, session);
  fs.writeFileSync(path.join(OUT, file), Buffer.from(r.data, 'base64'));
}

(async () => {
  await connect(await targetWsUrl());
  const { targetInfos } = await send('Target.getTargets');
  const target = targetInfos.find((t) => t.type === 'page');
  ({ sessionId: session } = await send('Target.attachToTarget', {
    targetId: target.targetId, flatten: true,
  }));
  await send('Page.enable', {}, session);
  await send('Runtime.enable', {}, session);
  await send('DOM.enable', {}, session);

  // 1. Overflow sweep — every page, every width, both themes.
  for (const page of PAGES) {
    for (const vp of VIEWPORTS) {
      for (const theme of ['light', 'dark']) {
        await setup(vp, theme);
        await go(page);
        await checkOverflow(page, vp, theme);
      }
    }
    process.stdout.write('.');
  }
  console.log('');

  // 2. Hero + full-page captures of the pages that matter most.
  const KEY = ['index', 'services', 'use-cases', 'pricing', 'roi-calculator', 'security', 'faq', 'demo'];
  for (const theme of ['light', 'dark']) {
    for (const vp of [{ name: '1440', w: 1440, h: 900, mobile: false },
                      { name: '390', w: 390, h: 844, mobile: true }]) {
      await setup(vp, theme);
      for (const page of KEY) {
        await go(page);
        await shoot(`${page}-${vp.name}-${theme}.png`, false);
      }
    }
  }

  // 3. Mega-menus open, by real hover.
  await setup({ name: '1440', w: 1440, h: 900, mobile: false }, 'light');
  await go('index');
  for (const [key, file] of [['services', 'mega-services.png'], ['useCases', 'mega-usecases.png']]) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('[data-mega="${key}"]');
        el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
        return el.className;
      })()`, returnByValue: true,
    }, session);
    await sleep(500);
    await shoot(file, false);
  }

  // 4. Mobile drawer, open and with an accordion expanded.
  await setup({ name: '390', w: 390, h: 844, mobile: true }, 'light');
  await go('index');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('burger').click();
      setTimeout(() => document.querySelector('.drawer__accBtn').click(), 120); 1`,
  }, session);
  await sleep(700);
  await shoot('drawer-390.png', false);

  console.log(`\n  Screenshots -> ${OUT}`);
  if (overflow.length) {
    console.log(`\n  HORIZONTAL OVERFLOW (${overflow.length}):`);
    overflow.forEach((o) => console.log('   ' + o));
  } else {
    console.log('\n  No horizontal overflow at any width, in either theme.');
  }

  ws.close();
  chrome.kill();
  process.exit(overflow.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  chrome.kill();
  process.exit(1);
});
