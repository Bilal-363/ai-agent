#!/usr/bin/env node
'use strict';

/**
 * WCAG 2.2 contrast audit across every page in both themes.
 *
 *   node build/a11y.js
 *
 * Written after a real bug: brand teal used as a text colour looked fine on the
 * white canvas and became near-invisible in dark mode. Eyeballing screenshots
 * caught one instance; this catches all of them.
 *
 * For every element with its own visible text it resolves the effective
 * background (walking ancestors, compositing alpha), computes the contrast ratio,
 * and applies the AA threshold for that text size: 3.0 for large text
 * (>=24px, or >=18.66px bold), 4.5 otherwise.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p));

const PORT = 9466;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fileUrl = (p) => 'file:///' + path.join(ROOT, p).replace(/\\/g, '/').replace(/ /g, '%20');

let ws, msgId = 0, session;
const pending = new Map();
const listeners = [];
const send = (m, p = {}, s = session) => {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method: m, params: p, ...(s ? { sessionId: s } : {}) }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
};

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vocryn-a11y-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--allow-file-access-from-files', `--user-data-dir=${profile}`,
  `--remote-debugging-port=${PORT}`, 'about:blank',
], { stdio: 'ignore' });

const PAGES = ['index.html', 'services.html', 'use-cases.html', 'pricing.html',
  'roi-calculator.html', 'security.html', 'how-it-works.html', 'integrations.html',
  'results.html', 'faq.html', 'demo.html', 'contact.html', 'about.html', 'blog.html',
  'true-cost-of-a-missed-call.html', 'privacy.html', 'terms.html', 'hipaa.html', '404.html'];

const AUDIT = `(() => {
  const parse = (s) => {
    const m = (s || '').match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => ({            // composite fg (with alpha) onto bg
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  // Effective background behind an element: first opaque ancestor colour, with
  // any semi-transparent layers above it composited back down.
  const bgOf = (el) => {
    const stack = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return { unknown: true };
      const c = parse(cs.backgroundColor);
      if (!c || c.a === 0) continue;
      stack.push(c);
      if (c.a === 1) break;
    }
    if (!stack.length) return { r: 255, g: 255, b: 255, a: 1 };
    let base = stack[stack.length - 1];
    if (base.a < 1) base = over(base, { r: 255, g: 255, b: 255, a: 1 });
    for (let i = stack.length - 2; i >= 0; i--) base = over(stack[i], base);
    return base;
  };

  const hasOwnText = (el) => {
    for (const n of el.childNodes) {
      if (n.nodeType === 3 && n.textContent.trim().length > 1) return true;
    }
    return false;
  };

  const out = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    if (!hasOwnText(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.15) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;

    const fg = parse(cs.color);
    if (!fg || fg.a < 0.15) continue;          // transparent text = gradient clip
    if (cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)') continue;

    const bg = bgOf(el);
    if (bg.unknown) continue;                   // text over a photo — not measurable here
    const eff = fg.a < 1 ? over(fg, bg) : fg;
    const r = ratio(eff, bg);

    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    if (r + 0.02 < need) {
      const key = el.className + '|' + Math.round(r * 10);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        sel: el.tagName.toLowerCase() + (el.className ? '.' +
          String(el.className).trim().split(/\\s+/).slice(0, 2).join('.') : ''),
        text: el.textContent.trim().slice(0, 38),
        ratio: Math.round(r * 100) / 100, need,
        size: Math.round(size), weight,
      });
    }
  }
  return JSON.stringify(out);
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
    } else if (m.method) listeners.filter((l) => l.m === m.method).forEach((l) => l.fn(m.params));
  });

  const { targetInfos } = await send('Target.getTargets', {}, null);
  ({ sessionId: session } = await send('Target.attachToTarget',
    { targetId: targetInfos.find((t) => t.type === 'page').targetId, flatten: true }, null));
  await send('Page.enable');
  await send('Runtime.enable');
  listeners.push({ m: 'Page.loadEventFired', fn: () => {} });

  await send('Emulation.setDeviceMetricsOverride',
    { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  const problems = [];
  for (const theme of ['light', 'dark']) {
    await send('Emulation.setEmulatedMedia',
      { features: [{ name: 'prefers-color-scheme', value: theme }] });
    for (const page of PAGES) {
      await send('Page.navigate', { url: fileUrl(page) });
      await sleep(750);
      // Reveal everything, and open one FAQ so its body text gets measured too.
      await send('Runtime.evaluate', {
        expression: `(() => { try { localStorage.clear(); } catch(e){}
          document.documentElement.dataset.theme='${theme}';
          document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));
          const d=document.querySelector('details'); if(d) d.open=true;
          const a=document.getElementById('announce'); if(a) a.hidden=false;
          const m=document.querySelector('#mcta'); if(m) m.classList.add('is-up'); })()`,
      });
      await sleep(180);
      const r = await send('Runtime.evaluate', { expression: AUDIT, returnByValue: true });
      const found = JSON.parse(r.result.value);
      found.forEach((f) => problems.push({ page, theme, ...f }));
      process.stdout.write(found.length ? 'X' : '.');
    }
    process.stdout.write(' ');
  }

  console.log('');
  if (!problems.length) {
    console.log(`\n  Contrast: all measurable text passes WCAG AA across ` +
      `${PAGES.length} pages in both themes.\n`);
  } else {
    // Collapse duplicates that repeat on every page (shared header/footer).
    const byKey = new Map();
    for (const p of problems) {
      const k = `${p.theme}|${p.sel}|${p.ratio}`;
      if (!byKey.has(k)) byKey.set(k, { ...p, pages: [] });
      byKey.get(k).pages.push(p.page);
    }
    console.log(`\n  CONTRAST FAILURES (${byKey.size} distinct):\n`);
    [...byKey.values()].sort((a, b) => a.ratio - b.ratio).forEach((p) => {
      console.log(`  [${p.theme}] ${p.sel}`);
      console.log(`      ${p.ratio}:1 (needs ${p.need}:1)  ${p.size}px/${p.weight}  ` +
        `"${p.text}"`);
      console.log(`      ${p.pages.length === PAGES.length ? 'all pages' :
        p.pages.slice(0, 4).join(', ') + (p.pages.length > 4 ? ` +${p.pages.length - 4}` : '')}`);
    });
    console.log('');
  }

  ws.close(); chrome.kill();
  process.exit(problems.length ? 1 : 0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
