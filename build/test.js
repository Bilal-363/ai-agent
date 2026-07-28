#!/usr/bin/env node
'use strict';

/**
 * Functional browser tests over the DevTools Protocol.
 *
 *   node build/test.js
 *
 * Actually clicks things: plays the demo calls and checks the audio advances,
 * opens the mega-menus and drawer, drags the ROI sliders, submits the forms.
 * Also fails the run on any console error or failed network request.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const D = require('./lib/data');
const N_SERVICES = D.services.length;
const N_USECASES = D.useCases.length;
const N_FAQS = D.faqs.length;
const N_FIRST_GROUP = D.useCases.filter(u => u.group === D.useCases[0].group).length;
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p));
if (!CHROME) { console.error('Chrome not found.'); process.exit(1); }

const PORT = 9444;
// TEST_BASE=https://example.com runs the same suite against a live deployment
// instead of the local files, so we verify what visitors actually get.
const BASE = process.env.TEST_BASE ? process.env.TEST_BASE.replace(/\/$/, '') : null;
const url = (f) => BASE
  ? `${BASE}/${f === 'index.html' ? '' : f}`
  : 'file:///' + path.join(ROOT, f).replace(/\\/g, '/').replace(/ /g, '%20');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ws, msgId = 0, session;
const pending = new Map();
const listeners = [];
const send = (method, params = {}, sid = session) => {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method, params, ...(sid ? { sessionId: sid } : {}) }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
};
const on = (m, fn) => listeners.push({ m, fn });

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vocryn-test-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--no-default-browser-check', '--mute-audio',
  '--autoplay-policy=no-user-gesture-required',
  '--allow-file-access-from-files', `--user-data-dir=${profile}`,
  `--remote-debugging-port=${PORT}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore'] });

let pass = 0;
const fails = [];
const ok = (name, cond, detail) => {
  if (cond) { pass++; process.stdout.write('.'); }
  else { fails.push(name + (detail ? ` — ${detail}` : '')); process.stdout.write('X'); }
};

let consoleErrors = [];
let netFails = [];

async function evalIn(expression) {
  const r = await send('Runtime.evaluate', {
    expression: `(async () => { ${expression} })()`,
    awaitPromise: true, returnByValue: true,
  });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' +
    JSON.stringify(r.exceptionDetails.exception && r.exceptionDetails.exception.description || ''));
  return r.result.value;
}

async function goto(page) {
  consoleErrors = []; netFails = [];
  const loaded = new Promise((r) => on('Page.loadEventFired', r));
  await send('Page.navigate', { url: url(page) });
  await Promise.race([loaded, sleep(8000)]);
  await sleep(400);
}

(async () => {
  // connect
  let wsUrl;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      wsUrl = (await r.json()).webSocketDebuggerUrl;
    } catch (e) { await sleep(250); }
  }
  ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true });
    ws.addEventListener('error', rej, { once: true });
  });
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id); pending.delete(m.id);
      m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
    } else if (m.method) listeners.filter((l) => l.m === m.method).forEach((l) => l.fn(m.params));
  });

  const { targetInfos } = await send('Target.getTargets', {}, null);
  const t = targetInfos.find((x) => x.type === 'page');
  ({ sessionId: session } = await send('Target.attachToTarget',
    { targetId: t.targetId, flatten: true }, null));
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');
  await send('Network.enable');

  on('Runtime.consoleAPICalled', (p) => {
    if (p.type === 'error') {
      consoleErrors.push((p.args || []).map((a) => a.value || a.description || '').join(' '));
    }
  });
  on('Runtime.exceptionThrown', (p) => {
    consoleErrors.push(p.exceptionDetails && p.exceptionDetails.text || 'exception');
  });
  on('Network.loadingFailed', (p) => {
    if (p.type !== 'Image' || !/favicon/.test(p.requestId)) netFails.push(p.errorText + ' ' + p.type);
  });

  console.log('\n  DEMO CALL PLAYER');
  await goto('index.html');

  ok('player exists', await evalIn(`return !!document.querySelector('[data-player]')`));
  ok('3 scenario tabs', await evalIn(`return document.querySelectorAll('.player__tab').length`) === 3);
  ok('audio element injected', await evalIn(`return !!document.querySelector('[data-player] audio')`));
  ok('96 waveform bars from real peaks',
    await evalIn(`return document.querySelectorAll('[data-pane]:not([hidden]) [data-fill] .player__bar').length`) === 96);

  // Press play and confirm the audio really advances.
  // Poll for playback progress rather than sampling after a fixed wait: over HTTP
  // the first chunk can take several seconds to buffer, and a fixed 2.2s sleep
  // failed intermittently against the live deployment while passing locally.
  const played = await evalIn(`
    const p = document.querySelector('[data-player]');
    const a = p.querySelector('audio');
    p.querySelector('[data-pane]:not([hidden]) [data-play]').click();
    for (let i = 0; i < 60 && !(a.currentTime > 1.05); i++) {
      await new Promise(r => setTimeout(r, 250));
    }
    return { paused: a.paused, t: a.currentTime, dur: a.duration,
             src: (a.currentSrc||'').split('/').pop(), ready: a.readyState,
             playing: p.classList.contains('is-playing') };
  `);
  ok('audio source loaded', /demo-1\.mp3$/.test(played.src || ''), played.src);
  ok('audio decoded (readyState >= 2)', played.ready >= 2, 'readyState=' + played.ready);
  ok('duration ~39s', Math.abs((played.dur || 0) - 39.16) < 1.5, 'dur=' + played.dur);
  ok('audio is not paused', played.paused === false);
  ok('currentTime advanced past 1s', played.t > 1, 't=' + played.t);
  ok('player marked is-playing', played.playing === true);

  // Poll rather than sample once: over HTTP the audio can stall briefly while
  // buffering, and a single read races the timeupdate event.
  const liveLine = await evalIn(`
    const pane = () => document.querySelector('[data-pane]:not([hidden])');
    const readCur = () => pane().querySelector('[data-cur]').textContent;
    for (let i = 0; i < 25 && readCur() === '0:00'; i++) {
      await new Promise(r => setTimeout(r, 200));
    }
    const el = pane().querySelector('.tline.is-live');
    return { text: el ? el.textContent.trim().slice(0, 40) : null,
             cur: readCur(),
             t: document.querySelector('[data-player] audio').currentTime,
             fill: pane().querySelector('[data-fill]').style.clipPath };
  `);
  ok('a transcript line is highlighted live', !!liveLine.text, JSON.stringify(liveLine.text));
  ok('elapsed time is ticking', liveLine.cur !== '0:00',
    `cur=${liveLine.cur} currentTime=${liveLine.t}`);
  // Computed style reports e.g. "inset(0px 95.6964% 0px 0px)" — the second value is
  // the un-played remainder, so it must have dropped below 100% but not to zero.
  const remain = parseFloat((liveLine.fill || '').split(/\s+/)[1]);
  ok('waveform fill is progressing', remain > 0 && remain < 100, liveLine.fill);

  // Seek by clicking near the end of the waveform.
  const seeked = await evalIn(`
    const p = document.querySelector('[data-player]');
    const a = p.querySelector('audio');
    const s = p.querySelector('[data-pane]:not([hidden]) [data-seek]');
    const r = s.getBoundingClientRect();
    s.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, clientX: r.left + r.width * 0.75, clientY: r.top + r.height/2, pointerId: 1 }));
    await new Promise(r2 => setTimeout(r2, 300));
    return { t: a.currentTime };
  `);
  ok('seek jumped forward', seeked.t > 25, 't=' + seeked.t);

  // Click a transcript line to jump.
  const jumped = await evalIn(`
    const p = document.querySelector('[data-player]');
    const a = p.querySelector('audio');
    const lines = p.querySelectorAll('[data-pane]:not([hidden]) .tline');
    lines[1].click();
    await new Promise(r => setTimeout(r, 250));
    return { t: a.currentTime, want: parseFloat(lines[1].dataset.start) };
  `);
  ok('clicking a transcript line seeks to it',
    Math.abs(jumped.t - jumped.want) < 1.2, `t=${jumped.t} want=${jumped.want}`);

  // Switch scenario tabs.
  const switched = await evalIn(`
    const p = document.querySelector('[data-player]');
    const a = p.querySelector('audio');
    p.querySelectorAll('.player__tab')[2].click();
    await new Promise(r => setTimeout(r, 400));
    const pane = p.querySelector('[data-pane]:not([hidden])');
    return { id: pane.dataset.pane, paused: a.paused,
             lines: pane.querySelectorAll('.tline').length,
             tabSel: p.querySelectorAll('.player__tab')[2].getAttribute('aria-selected') };
  `);
  ok('tab 3 switches the visible pane', switched.id === '3', 'pane=' + switched.id);
  ok('switching tabs pauses playback', switched.paused === true);
  ok('escalation call has 3 turns', switched.lines === 3, 'lines=' + switched.lines);
  ok('tab aria-selected updated', switched.tabSel === 'true');

  // Poll, don't sleep. This was the last audio assertion still waiting a fixed
  // 1.8s, and it flaked on the live deployment at t=0.70 against a 0.8 threshold.
  // Every audio check in this file now waits on actual progress.
  const play3 = await evalIn(`
    const p = document.querySelector('[data-player]');
    const a = p.querySelector('audio');
    p.querySelector('[data-pane]:not([hidden]) [data-play]').click();
    for (let i = 0; i < 60 && !(a.currentTime > 0.85); i++) {
      await new Promise(r => setTimeout(r, 250));
    }
    return { paused: a.paused, t: a.currentTime, src: (a.currentSrc||'').split('/').pop() };
  `);
  ok('third call plays too', play3.paused === false && play3.t > 0.8,
    `paused=${play3.paused} t=${play3.t}`);
  ok('third call uses demo-3.mp3', /demo-3\.mp3$/.test(play3.src || ''), play3.src);

  console.log('\n  CAPABILITY EXPLORER');
  await goto('index.html');
  const capInit = await evalIn(`
    const c = document.querySelector('[data-cap]');
    return { tabs: c.querySelectorAll('[data-cap-tab]').length,
             panes: c.querySelectorAll('[data-cap-pane]').length,
             visible: [...c.querySelectorAll('[data-cap-pane]')].filter(p => !p.hidden).length,
             bubbles: c.querySelector('[data-cap-pane]:not([hidden])')
                       .querySelectorAll('.cbub').length,
             playable: c.querySelectorAll('[data-cap-play]').length };
  `);
  ok(`explorer has ${N_SERVICES} capability tabs`, capInit.tabs === N_SERVICES, 'tabs=' + capInit.tabs);
  ok(`explorer has ${N_SERVICES} panes`, capInit.panes === N_SERVICES, 'panes=' + capInit.panes);
  ok('exactly one pane visible', capInit.visible === 1, 'visible=' + capInit.visible);
  ok('visible pane shows a 2-turn exchange', capInit.bubbles === 2, 'bubbles=' + capInit.bubbles);
  ok('3 capabilities offer real audio', capInit.playable === 3, 'playable=' + capInit.playable);

  const capSwitch = await evalIn(`
    const c = document.querySelector('[data-cap]');
    const tabs = c.querySelectorAll('[data-cap-tab]');
    tabs[4].click();
    await new Promise(r => setTimeout(r, 250));
    const pane = c.querySelector('[data-cap-pane]:not([hidden])');
    return { slug: pane.dataset.capPane, sel: tabs[4].getAttribute('aria-selected'),
             firstSel: tabs[0].getAttribute('aria-selected'),
             title: pane.querySelector('.cap__h').textContent.trim() };
  `);
  ok('clicking a tab switches the pane', capSwitch.slug === 'reminders-recalls', capSwitch.slug);
  ok('new tab is aria-selected', capSwitch.sel === 'true');
  ok('previous tab is deselected', capSwitch.firstSel === 'false');
  ok('pane title matches the tab', capSwitch.title === 'Patient Reminders & Recalls', capSwitch.title);

  const capKeys = await evalIn(`
    const tabs = document.querySelectorAll('[data-cap-tab]');
    tabs[4].focus();
    tabs[4].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await new Promise(r => setTimeout(r, 200));
    return document.querySelector('[data-cap-pane]:not([hidden])').dataset.capPane;
  `);
  ok('arrow keys move between tabs', capKeys === 'sms-followups', 'landed on ' + capKeys);

  // "Hear this call" must hand off to the real player and actually start audio.
  const handoff = await evalIn(`
    const c = document.querySelector('[data-cap]');
    c.querySelectorAll('[data-cap-tab]')[8].click();      // Call Routing -> demo 3
    await new Promise(r => setTimeout(r, 200));
    c.querySelector('[data-cap-pane]:not([hidden]) [data-cap-play]').click();
    const p = document.querySelector('[data-player]');
    const a = p.querySelector('audio');
    // Same reason as above — wait for real progress, not a fixed sleep.
    for (let i = 0; i < 60 && !(a.currentTime > 0.6); i++) {
      await new Promise(r => setTimeout(r, 250));
    }
    return { pane: p.querySelector('[data-pane]:not([hidden])').dataset.pane,
             src: (a.currentSrc || '').split('/').pop(),
             paused: a.paused, t: a.currentTime };
  `);
  ok('handoff selects the matching player tab', handoff.pane === '3', 'pane=' + handoff.pane);
  ok('handoff loads demo-3.mp3', /demo-3\.mp3$/.test(handoff.src || ''), handoff.src);
  ok('handoff starts playback', handoff.paused === false && handoff.t > 0.5,
    `paused=${handoff.paused} t=${handoff.t}`);

  console.log('\n  BRAND');
  const brand = await evalIn(`
    const cs = getComputedStyle(document.documentElement);
    const marks = [...document.querySelectorAll('img.logo__svg')];
    const first = marks[0];
    const box = first ? first.getBoundingClientRect() : { width: 0, height: 0 };
    // Wait for decode so naturalWidth is meaningful.
    if (first && !first.complete) {
      await new Promise(r => { first.onload = r; first.onerror = r; setTimeout(r, 3000); });
    }
    return { marks: marks.length,
             src: first ? first.getAttribute('src') : null,
             loaded: first ? first.naturalWidth : 0,
             natH: first ? first.naturalHeight : 0,
             w: Math.round(box.width), h: Math.round(box.height),
             alt: first ? first.getAttribute('alt') : null,
             leftoverSvg: document.querySelectorAll('.logo__sprite, #vocrynMark').length,
             brand: cs.getPropertyValue('--brand-600').trim(),
             accent: cs.getPropertyValue('--accent-500').trim(),
             violet: cs.getPropertyValue('--violet-600').trim() };
  `);
  ok('two brand marks on the page (header + footer)', brand.marks === 2, 'marks=' + brand.marks);
  ok('mark points at the rendered webp', /logo-mark\.webp$/.test(brand.src || ''), brand.src);
  ok('mark image actually decoded', brand.loaded > 400, 'naturalWidth=' + brand.loaded);
  ok('mark exported well above display size', brand.loaded >= brand.w * 4,
    `${brand.loaded}px source for ${brand.w}px display`);
  ok('mark aspect is the wide ribbon (~2.07)',
    Math.abs(brand.loaded / brand.natH - 2.07) < 0.12,
    `${brand.loaded}x${brand.natH}`);
  ok('header mark renders at a visible size', brand.w > 40 && brand.h > 18,
    `${brand.w}x${brand.h}`);
  ok('mark is decorative (empty alt, wordmark carries the name)', brand.alt === '', `alt=${brand.alt}`);
  ok('old SVG sprite fully removed', brand.leftoverSvg === 0, 'leftover=' + brand.leftoverSvg);
  ok('palette is blue', brand.brand.toUpperCase() === '#3A49CE', brand.brand);
  ok('palette has orange', brand.accent.toUpperCase() === '#FF8125', brand.accent);
  ok('palette has purple', brand.violet.toUpperCase() === '#7C3AED', brand.violet);

  console.log('\n  HERO & EHR DIAGRAM');
  await send('Emulation.setDeviceMetricsOverride',
    { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await goto('index.html');

  // Assert the outcome (one line, not clipped) across the whole desktop range
  // rather than which CSS property produced it. An earlier version checked
  // white-space === 'nowrap' and failed even when the headline was correctly on
  // one line: `white-space` is a shorthand in current browsers, and text-wrap set
  // on headings elsewhere changes how it serialises.
  const HERO_WIDTHS = [1180, 1280, 1440, 1680, 1920];
  const heroLines = [];
  for (const w of HERO_WIDTHS) {
    await send('Emulation.setDeviceMetricsOverride',
      { width: w, height: 900, deviceScaleFactor: 1, mobile: false });
    await sleep(220);
    heroLines.push(await evalIn(`
      const h = document.querySelector('.hero__h');
      const cs = getComputedStyle(h);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.04;
      return { w: innerWidth,
               lines: Math.round(h.getBoundingClientRect().height / lh),
               clipped: h.scrollWidth > h.clientWidth + 1 };
    `));
  }
  const multi = heroLines.filter((r) => r.lines !== 1);
  const clipped = heroLines.filter((r) => r.clipped);
  ok('hero headline is one line at every desktop width',
    multi.length === 0, multi.map((r) => `${r.w}px=${r.lines} lines`).join(', '));
  ok('hero headline is never clipped',
    clipped.length === 0, clipped.map((r) => r.w + 'px').join(', '));

  await send('Emulation.setDeviceMetricsOverride',
    { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await sleep(200);
  const hero = await evalIn(`
    return { word: document.querySelector('.logo__text').textContent.trim(),
             text: document.querySelector('.hero__h').textContent.trim() };
  `);
  ok('wordmark reads "Vocryn Ai" with a space', hero.word === 'Vocryn Ai', `"${hero.word}"`);
  ok('headline is the short single-line version',
    hero.text === "Your clinic's AI receptionist.", `"${hero.text}"`);

  const ehr = await evalIn(`
    const d = document.querySelector('.ehr');
    const items = [...d.querySelectorAll('.ehr__item')];
    const wires = [...d.querySelectorAll('.ehr__wires path')];
    const svg = d.querySelector('.ehr__wires').getBoundingClientRect();
    const hub = d.querySelector('.ehr__hub').getBoundingClientRect();
    // Each wire should start at its chip's vertical centre; the SVG y box is 0-100
    // stretched over the same height, so compare in fractions.
    const drift = items.map((el, i) => {
      const r = el.getBoundingClientRect();
      const chipFrac = (r.top + r.height / 2 - svg.top) / svg.height;
      const wireFrac = parseFloat(wires[i].getAttribute('d').split(' ')[1]) / 100;
      return Math.abs(chipFrac - wireFrac);
    });
    return { chips: items.length, wires: wires.length,
             maxDrift: Math.max(...drift),
             hubMark: !!d.querySelector('.ehr__hubMark'),
             // Negative margin should pull the wires under the hub.
             reaches: svg.right >= hub.left,
             svgW: getComputedStyle(d.querySelector('.ehr__wires')).width,
             svgRight: Math.round(svg.right), hubLeft: Math.round(hub.left) };
  `);
  ok('EHR diagram lists 4 systems', ehr.chips === 4, 'chips=' + ehr.chips);
  ok('one wire per system', ehr.wires === ehr.chips, `${ehr.wires} wires / ${ehr.chips} chips`);
  ok('wires start on the chip centres', ehr.maxDrift < 0.03,
    'max drift ' + (ehr.maxDrift * 100).toFixed(1) + '% of height');
  ok('wires reach the hub', ehr.reaches === true,
    `svg.right=${ehr.svgRight} hub.left=${ehr.hubLeft} computedWidth=${ehr.svgW}`);
  ok('hub carries the brand mark', ehr.hubMark === true);

  console.log('\n  NAVIGATION');
  await goto('index.html');
  const mega = await evalIn(`
    const it = document.querySelector('[data-mega="services"]');
    it.dispatchEvent(new MouseEvent('mouseenter'));
    const panel = it.querySelector('.mega');
    // 110ms open delay plus a 220ms visibility transition; a fixed 350ms wait sat
    // right on that boundary and flaked over the network. Poll instead.
    for (let i = 0; i < 40 && getComputedStyle(panel).visibility !== 'visible'; i++) {
      await new Promise(r => setTimeout(r, 100));
    }
    return { open: it.classList.contains('is-open'),
             expanded: it.querySelector('.nav__link--trigger').getAttribute('aria-expanded'),
             items: panel.querySelectorAll('.mega__item').length,
             visible: getComputedStyle(panel).visibility };
  `);
  ok('services mega-menu opens on hover', mega.open === true);
  ok('mega-menu is actually visible', mega.visible === 'visible', mega.visible);
  ok(`all ${N_SERVICES} services shown at once`, mega.items === N_SERVICES, 'items=' + mega.items);
  ok('trigger aria-expanded=true', mega.expanded === 'true');

  const megaUC = await evalIn(`
    const it = document.querySelector('[data-mega="useCases"]');
    it.dispatchEvent(new MouseEvent('mouseenter'));
    // Same open delay as the services panel — wait on the state, not the clock.
    for (let i = 0; i < 40 && !it.classList.contains('is-open'); i++) {
      await new Promise(r => setTimeout(r, 100));
    }
    return { items: it.querySelectorAll('.mega__item').length,
             groups: it.querySelectorAll('.mega__group').length,
             servicesClosed: !document.querySelector('[data-mega="services"]').classList.contains('is-open') };
  `);
  ok(`all ${N_USECASES} use cases shown at once`, megaUC.items === N_USECASES, 'items=' + megaUC.items);
  ok('use cases split into 2 groups', megaUC.groups === 2, 'groups=' + megaUC.groups);
  ok('opening one menu closes the other', megaUC.servicesClosed === true);

  const drawer = await evalIn(`
    document.getElementById('burger').click();
    await new Promise(r => setTimeout(r, 300));
    const d = document.getElementById('drawer');
    const top = parseFloat(d.style.top || '0');
    const hdrBottom = document.getElementById('hdr').getBoundingClientRect().bottom;
    d.querySelector('.drawer__accBtn').click();
    await new Promise(r => setTimeout(r, 200));
    const panel = document.getElementById('dr-services');
    return { open: !d.hidden, top, hdrBottom,
             accOpen: !panel.hidden, subs: panel.querySelectorAll('.drawer__sub').length,
             locked: getComputedStyle(document.body).overflow };
  `);
  ok('mobile drawer opens', drawer.open === true);
  ok('drawer sits below the header', Math.abs(drawer.top - drawer.hdrBottom) < 3,
    `top=${drawer.top} hdr=${drawer.hdrBottom}`);
  ok('drawer accordion expands', drawer.accOpen === true);
  ok(`drawer shows all ${N_SERVICES} services`, drawer.subs === N_SERVICES, 'subs=' + drawer.subs);
  ok('body scroll locked while open', drawer.locked === 'hidden', drawer.locked);

  const esc = await evalIn(`
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise(r => setTimeout(r, 250));
    return { closed: document.getElementById('drawer').hidden,
             unlocked: getComputedStyle(document.body).overflow };
  `);
  ok('Escape closes the drawer', esc.closed === true);
  ok('scroll unlocked after close', esc.unlocked !== 'hidden', esc.unlocked);

  console.log('\n  THEME');
  const theme = await evalIn(`
    const before = document.documentElement.dataset.theme;
    document.querySelector('.hdr .js-theme').click();
    await new Promise(r => setTimeout(r, 150));
    const after = document.documentElement.dataset.theme;
    const bg = getComputedStyle(document.body).backgroundColor;
    return { before, after, bg, stored: localStorage.getItem('vocryn-theme') };
  `);
  ok('theme toggle flips the theme', theme.before !== theme.after,
    `${theme.before} -> ${theme.after}`);
  ok('theme persisted to localStorage', theme.stored === theme.after);

  const white = await evalIn(`
    document.documentElement.dataset.theme = 'light';
    await new Promise(r => setTimeout(r, 80));
    return getComputedStyle(document.body).backgroundColor;
  `);
  ok('light theme background is pure white', white === 'rgb(255, 255, 255)', white);

  console.log('\n  ROI CALCULATOR');
  await goto('roi-calculator.html');
  const roi = await evalIn(`
    const set = (id, v) => {
      const el = document.getElementById(id);
      el.value = v; el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    set('roiCalls', 2000); set('roiMissed', 30); set('roiValue', 400); set('roiFee', 899);
    await new Promise(r => setTimeout(r, 150));
    return {
      calls: document.getElementById('outCalls').textContent,
      missedCount: document.getElementById('outMissedCount').textContent,
      recovered: document.getElementById('outRecovered').textContent,
      revenue: document.getElementById('outRevenue').textContent,
      net: document.getElementById('outNet').textContent,
      hours: document.getElementById('outHours').textContent,
      roi: document.getElementById('outRoi').textContent,
    };
  `);
  ok('slider readout updates', roi.calls === '2,000', roi.calls);
  ok('missed count computed', roi.missedCount === '600', roi.missedCount);
  ok('recovered appointments computed', roi.recovered === '85', roi.recovered);
  ok('revenue computed', roi.revenue === '$34,000', roi.revenue);
  ok('net computed', roi.net === '$33,101', roi.net);
  ok('staff hours computed', /hrs$/.test(roi.hours), roi.hours);
  ok('ROI percentage computed', /^\+\d+%$/.test(roi.roi), roi.roi);

  console.log('\n  FORMS');
  // The qualification form moved to /contact; /demo embeds the booking calendar.
  await goto('contact.html');
  const form = await evalIn(`
    const f = document.querySelector('form[data-validate]');
    f.querySelector('button[type=submit]').click();
    await new Promise(r => setTimeout(r, 150));
    const bad = f.querySelectorAll('.fld.is-bad').length;
    const sent = f.classList.contains('is-sent');
    return { bad, sent };
  `);
  ok('empty submit is blocked', form.sent === false);
  ok('invalid fields are flagged', form.bad > 0, 'flagged=' + form.bad);

  const filled = await evalIn(`
    const f = document.querySelector('form[data-validate]');
    const v = { dName:'Jordan Patel', dEmail:'jordan@practice.com', dPhone:'5551234567',
                dPractice:'Lakeview Dental' };
    for (const [id, val] of Object.entries(v)) {
      const el = document.getElementById(id);
      el.value = val; el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    document.getElementById('dType').value = 'Dental practice';
    document.getElementById('dLocations').value = '1';
    document.getElementById('dSystem').value = 'Dentrix';
    f.querySelector('input[type=checkbox]').checked = true;
    f.querySelector('button[type=submit]').click();
    await new Promise(r => setTimeout(r, 250));
    return { sent: f.classList.contains('is-sent'),
             okVisible: getComputedStyle(f.querySelector('.form__ok')).display };
  `);
  ok('valid submit shows the success state', filled.sent === true);
  ok('success panel becomes visible', filled.okVisible !== 'none', filled.okVisible);

  await goto('demo.html');
  const cal = await evalIn(`
    const fr = document.querySelector('.cal__frame');
    return { hasFrame: !!fr,
             src: fr ? fr.getAttribute('src') : null,
             lazy: fr ? fr.getAttribute('loading') : null,
             titled: !!(fr && fr.getAttribute('title')),
             h: fr ? Math.round(fr.getBoundingClientRect().height) : 0,
             forms: document.querySelectorAll('form[data-validate]').length,
             fallback: !!document.querySelector('.cal__fallback a[href^="tel:"]') };
  `);
  ok('demo page embeds the booking calendar', cal.hasFrame === true);
  ok('calendar points at the live booking widget',
    /leadconnectorhq\.com\/widget\/booking\//.test(cal.src || ''), cal.src);
  ok('calendar iframe is lazy and titled',
    cal.lazy === 'lazy' && cal.titled === true, `loading=${cal.lazy} titled=${cal.titled}`);
  ok('calendar has real height', cal.h > 400, 'height=' + cal.h);
  ok('demo page no longer carries the form', cal.forms === 0, 'forms=' + cal.forms);
  ok('calendar offers a phone fallback', cal.fallback === true);

  console.log('\n  FILTERS & ACCORDIONS');
  await goto('faq.html');
  const faq = await evalIn(`
    const all = document.querySelectorAll('[data-filter-target="faq"]').length;
    document.querySelectorAll('[data-filter-group="faq"] .filter')[1].click();
    await new Promise(r => setTimeout(r, 150));
    const shown = [...document.querySelectorAll('[data-filter-target="faq"]')]
      .filter(e => !e.hidden).length;
    const d = [...document.querySelectorAll('.qa')].find(e => !e.hidden);
    d.querySelector('summary').click();
    await new Promise(r => setTimeout(r, 150));
    return { all, shown, open: d.open };
  `);
  ok(`FAQ page has ${N_FAQS} questions`, faq.all === N_FAQS, 'all=' + faq.all);
  ok('category filter narrows the list', faq.shown > 0 && faq.shown < faq.all,
    `${faq.shown}/${faq.all}`);
  ok('FAQ accordion opens', faq.open === true);

  await goto('use-cases.html');
  const uc = await evalIn(`
    document.querySelectorAll('[data-filter-group="uc"] .filter')[1].click();
    await new Promise(r => setTimeout(r, 150));
    const shown = [...document.querySelectorAll('[data-filter-target="uc"]')]
      .filter(e => !e.hidden).length;
    return { shown };
  `);
  ok('use-case filter narrows to the first group', uc.shown === N_FIRST_GROUP,
    `shown=${uc.shown} expected=${N_FIRST_GROUP}`);

  await goto('integrations.html');
  const intg = await evalIn(`
    const s = document.getElementById('intgSearch');
    s.value = 'dentrix'; s.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(r => setTimeout(r, 150));
    const shown = [...document.querySelectorAll('[data-intg]')].filter(e => !e.hidden).length;
    s.value = 'zzzznope'; s.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(r => setTimeout(r, 150));
    const none = document.getElementById('intgEmpty');
    return { shown, emptyShown: !none.hidden };
  `);
  ok('integration search filters', intg.shown === 2, 'shown=' + intg.shown);
  ok('empty state appears for no matches', intg.emptyShown === true);

  console.log('\n  CONSOLE / NETWORK HEALTH');
  const PAGES = ['index.html', 'services.html', 'use-cases.html', 'pricing.html',
    'roi-calculator.html', 'security.html', 'how-it-works.html', 'integrations.html',
    'results.html', 'faq.html', 'demo.html', 'contact.html', 'about.html', 'blog.html',
    'true-cost-of-a-missed-call.html', 'privacy.html', 'terms.html', 'hipaa.html', '404.html'];
  for (const p of PAGES) {
    await goto(p);
    const real = consoleErrors.filter((e) => !/favicon|net::ERR_FILE_NOT_FOUND.*favicon/i.test(e));
    ok(`${p}: no console errors`, real.length === 0, real.slice(0, 2).join(' | '));
  }

  console.log(`\n\n  ${pass} passed, ${fails.length} failed`);
  if (fails.length) {
    console.log('\n  FAILURES:');
    fails.forEach((f) => console.log('   X ' + f));
  }
  ws.close(); chrome.kill();
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error('\n' + e.stack); chrome.kill(); process.exit(1); });
