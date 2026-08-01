#!/usr/bin/env node
'use strict';

/**
 * Builds assets/brand/OPEN-ME.html — a single self-contained page showing every
 * ready-to-post image, so nothing has to be opened one file at a time.
 *
 *   node build/index-page.js
 *
 * Images are inlined as data URIs so the file works by double-clicking it from
 * disk, with no server and no internet. Previews are 620px WebP; the originals
 * stay full size in their folders.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PREVIEW = path.join(__dirname, 'preview');
const OUT = path.join(ROOT, 'assets', 'brand', 'OPEN-ME.html');

const img = (n) =>
  'data:image/webp;base64,' + fs.readFileSync(path.join(PREVIEW, n + '.webp')).toString('base64');

const CAROUSEL = [
  ['01', 'Hook',        'Empty desk, phone unanswered',        '“67% of callers hang up before anyone answers.”'],
  ['02', 'Consequence', 'Receptionist on the phone, patient waiting', '“They call the practice down the road.”'],
  ['03', 'The cost',    'The arithmetic, in money',             '150 missed calls → ~15 booked elsewhere → $9k+'],
  ['04', 'The fix',     'Receptionist wearing a headset',       '“Meet Casey. Answers in under two seconds.”'],
  ['05', 'Substance',   'Five things Casey handles',            'Books · insurance · refills · waitlist · transfers'],
  ['06', 'Proof',       'Four numbers from month one',          '94% · 3× · &lt;2s · 20+ languages'],
  ['07', 'Objection',   'Six real EHR logos',                   '“It writes into your system.”'],
  ['08', 'The ask',     'Staff helping a patient',              '“Every patient heard.” → vocryn.com'],
];

const SINGLES = [
  ['empty-desk-4x5',  'Empty desk, phone unanswered',          '“Nobody’s at the desk. The phone is still ringing.”'],
  ['two-at-once-4x5', 'Receptionist on the phone, patient waiting', '“She can only help one of them.”'],
  ['meet-casey-4x5',  'Receptionist wearing a headset',        '“Your AI receptionist. Never misses a call.”'],
  ['handled-4x5',     'Staff helping a patient calmly',        '“This is a front desk that’s actually handled.”'],
];

const CAPTION = `Your phone is the most expensive thing in your practice.

Not the chair. Not the imaging. The phone — because two thirds of the people who call you hang up after two minutes on hold. They don't leave a voicemail. They call the practice down the road, and that practice answers.

We built Casey for exactly that gap. It answers in under two seconds, books straight into your EHR, verifies insurance while the patient is still on the line, and hands anything urgent to a real person.

Nights, weekends, lunch breaks, and the Monday-morning rush.

Hear it handle a real call, unedited → vocryn.com

#dentalpractice #primarycare #practicemanagement #healthcareAI #frontdesk`;

const card = (src, badge, role, shows, says) => `<figure class="card">
  <img src="${img(src)}" alt="${says.replace(/["“”]/g, '')}" loading="lazy" decoding="async">
  <figcaption>
    <div class="row"><span class="num">${badge}</span><span class="role">${role}</span></div>
    <p class="shows">${shows}</p>
    <p class="says">${says}</p>
  </figcaption>
</figure>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Vocryn Ai — post images</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root{
    --paper:#EEF0F5;--surface:#FFFFFF;--ink:#14161F;--muted:#5A5F73;
    --line:#DBDEE8;--accent:#E85D00;--accent-soft:#FFF1E6;
    --mono:ui-monospace,"Cascadia Mono","SF Mono",Consolas,monospace;
    --sans:"Segoe UI Variable Text","Segoe UI",system-ui,-apple-system,sans-serif;
  }
  @media (prefers-color-scheme:dark){
    :root{--paper:#0F1117;--surface:#171A23;--ink:#EDEFF5;--muted:#9AA0B4;
      --line:#272C39;--accent:#FF8A3D;--accent-soft:#2A1B0E}
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);
    font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
  .page{max-width:1120px;margin:0 auto;padding:clamp(24px,5vw,60px) clamp(18px,4vw,40px) 90px;
    display:flex;flex-direction:column;gap:clamp(34px,5vw,56px)}
  h1{font-size:clamp(27px,4.2vw,42px);line-height:1.1;letter-spacing:-.03em;margin:0;
    font-weight:700;text-wrap:balance}
  h2{font-size:clamp(19px,2.2vw,23px);letter-spacing:-.02em;margin:0 0 6px;font-weight:700}
  p{margin:0;max-width:66ch}
  a{color:var(--accent);text-underline-offset:3px}
  .eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;
    color:var(--accent);margin:0 0 10px}
  .lede{color:var(--muted);margin-top:12px}
  .hint{color:var(--muted);font-size:14.5px;margin-bottom:20px}

  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));
    gap:clamp(16px,2.4vw,26px)}
  .card{margin:0;background:var(--surface);border:1px solid var(--line);border-radius:4px;
    overflow:hidden;display:flex;flex-direction:column}
  .card img{width:100%;height:auto;display:block;border-bottom:1px solid var(--line)}
  figcaption{padding:13px 15px 16px;display:flex;flex-direction:column;gap:6px}
  .row{display:flex;align-items:baseline;gap:9px}
  .num{font-family:var(--mono);font-size:12px;font-weight:700;color:var(--accent);
    background:var(--accent-soft);padding:2px 7px;border-radius:3px;letter-spacing:.05em}
  .role{font-weight:700;font-size:14px}
  .shows{color:var(--muted);font-size:13px;line-height:1.45}
  .says{font-size:13.5px;line-height:1.45;border-left:2px solid var(--accent);padding-left:9px}

  .block{background:var(--surface);border:1px solid var(--line);border-radius:4px;
    padding:clamp(17px,3vw,25px)}
  pre{margin:0;font-family:var(--mono);font-size:13px;line-height:1.7;white-space:pre-wrap;
    word-break:break-word}
  code{font-family:var(--mono);font-size:.9em;background:var(--paper);border:1px solid var(--line);
    border-radius:3px;padding:1px 5px}
  ul.plain{margin:0;padding-left:0;list-style:none;display:flex;flex-direction:column;gap:11px}
  ul.plain li{display:flex;gap:11px;align-items:flex-start}
  ul.plain li::before{content:'';flex:none;width:7px;height:7px;border-radius:50%;
    background:var(--accent);margin-top:9px}
  .warn{border-left:3px solid var(--accent);padding-left:15px;display:flex;
    flex-direction:column;gap:13px}
  button{font:inherit;font-size:13px;font-weight:650;cursor:pointer;color:var(--ink);
    background:var(--paper);border:1px solid var(--line);border-radius:3px;padding:7px 13px;
    margin-top:14px}
  button:hover{border-color:var(--accent);color:var(--accent)}
  button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
  @media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style></head><body>
<div class="page">

  <header>
    <p class="eyebrow">Everything ready to post</p>
    <h1>Vocryn Ai — post images</h1>
    <p class="lede">Every image below already has the headline, the logo and the URL on it.
      The full-size files sit next to this page in their own folders.</p>
  </header>

  <section>
    <h2>1 · Launch carousel — 8 slides</h2>
    <p class="hint">Post all eight together as one carousel, in this order.
      Files: <code>carousel/slide-01.png</code> … <code>slide-08.png</code> · 1080×1350</p>
    <div class="grid">
      ${CAROUSEL.map(([n, role, shows, says]) => card('s' + n, n, role, shows, says)).join('\n      ')}
    </div>
  </section>

  <section>
    <h2>2 · Single posts — 4 images</h2>
    <p class="hint">Standalone posts, one photo each. Use them on the days between carousels.
      Files: <code>single-posts/</code> · each in 1080×1350 and 1080×1080</p>
    <div class="grid">
      ${SINGLES.map(([f, shows, says], i) =>
        card(f, String(i + 1), 'Single post', shows, says)).join('\n      ')}
    </div>
  </section>

  <section>
    <h2>Caption for the carousel</h2>
    <div class="block">
      <pre id="cap">${CAPTION.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>
      <button type="button" id="copy">Copy caption</button>
    </div>
  </section>

  <section>
    <h2>Where the files are</h2>
    <div class="block">
      <ul class="plain">
        <li><code>assets\\brand\\carousel\\</code> — the 8 carousel slides</li>
        <li><code>assets\\brand\\single-posts\\</code> — the 4 single posts, two sizes each</li>
        <li><code>assets\\brand\\social-sized\\</code> — profile pictures and cover banners</li>
        <li><code>assets\\brand\\logo-compact\\</code> — the logo on its own, transparent</li>
      </ul>
      <p style="margin-top:16px;color:var(--muted);font-size:14.5px">All of it is also in the
        repo at <a href="https://github.com/Bilal-363/ai-agent" target="_blank"
        rel="noopener">Bilal-363/ai-agent</a> under <code>assets/brand/</code>.</p>
    </div>
  </section>

  <section>
    <h2>Two things to decide before posting</h2>
    <div class="warn">
      <p><strong>The 67%</strong> is an industry statistic about callers abandoning on hold — not
        a measurement of your own callers. Have a source ready, or soften it to “two thirds”.</p>
      <p><strong>The $9k</strong> is illustrative at a $600 new-patient value, and the slide says
        so. If you know your real number, use it — one you can defend beats a bigger one you
        can't.</p>
    </div>
  </section>

</div>
<script>
  document.getElementById('copy').addEventListener('click', async (e) => {
    const b = e.currentTarget;
    try { await navigator.clipboard.writeText(document.getElementById('cap').textContent);
      b.textContent = 'Copied'; }
    catch { b.textContent = 'Select the text above to copy'; }
    setTimeout(() => { b.textContent = 'Copy caption'; }, 2200);
  });
</script>
</body></html>`;

fs.writeFileSync(OUT, html);
console.log(`OPEN-ME.html -> ${OUT}  (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`);
