#!/usr/bin/env node
'use strict';

/**
 * Builds a self-contained preview page for the carousel so the slides can be
 * viewed without opening eight PNGs one at a time.
 *
 *   node build/preview-page.js
 *
 * Images are inlined as data URIs because the Artifact CSP blocks every external
 * host. Previews are 620px WebP (~230 KB total) rather than the 1080px originals,
 * which would make an 8 MB page.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PREVIEW = path.join(__dirname, 'preview');
const OUT = process.argv[2] || path.join(__dirname, 'carousel-preview.html');

const img = (n) =>
  'data:image/webp;base64,' + fs.readFileSync(path.join(PREVIEW, `s${n}.webp`)).toString('base64');

const SLIDES = [
  { n: '01', role: 'Hook',        shows: 'An empty reception desk, phone unanswered',
    says: '“67% of callers hang up before anyone answers.”' },
  { n: '02', role: 'Consequence', shows: 'A receptionist on the phone while a patient waits',
    says: '“They call the practice down the road.”' },
  { n: '03', role: 'The cost',    shows: 'The arithmetic, in money',
    says: '150 missed calls → ~15 booked elsewhere → $9k+ gone' },
  { n: '04', role: 'The fix',     shows: 'A receptionist wearing a headset',
    says: '“Meet Casey. Answers in under two seconds.”' },
  { n: '05', role: 'Substance',   shows: 'Five things Casey handles',
    says: 'Books · verifies insurance · refills · waitlist · transfers' },
  { n: '06', role: 'Proof',       shows: 'Four numbers from month one',
    says: '94% answered · 3× bookings · <2s · 20+ languages' },
  { n: '07', role: 'Objection',   shows: 'Six real EHR logos',
    says: '“It writes into your system.”' },
  { n: '08', role: 'The ask',     shows: 'Staff helping a patient at the counter',
    says: '“Every patient heard.” → vocryn.com' },
];

const CAPTION = `Your phone is the most expensive thing in your practice.

Not the chair. Not the imaging. The phone — because two thirds of the people who call you hang up after two minutes on hold. They don't leave a voicemail. They call the practice down the road, and that practice answers.

We built Casey for exactly that gap. It answers in under two seconds, books straight into your EHR, verifies insurance while the patient is still on the line, and hands anything urgent to a real person.

Nights, weekends, lunch breaks, and the Monday-morning rush.

Hear it handle a real call, unedited → vocryn.com

#dentalpractice #primarycare #practicemanagement #healthcareAI #frontdesk`;

const html = `<title>Vocryn Ai — launch carousel</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  /* Cool neutral ground so the navy-and-orange slides read as the content and the
     page around them stays out of the way. Orange appears only on the sequence
     numbers and links — it belongs to the artwork, not the chrome. */
  :root{
    --paper:#EEF0F5; --surface:#FFFFFF; --ink:#14161F; --muted:#5A5F73;
    --line:#DBDEE8; --accent:#E85D00; --accent-soft:#FFF1E6;
    --mono:ui-monospace,"Cascadia Mono","SF Mono",Consolas,monospace;
    --sans:"Segoe UI Variable Text","Segoe UI",system-ui,-apple-system,"Helvetica Neue",sans-serif;
  }
  @media (prefers-color-scheme:dark){
    :root{--paper:#0F1117;--surface:#171A23;--ink:#EDEFF5;--muted:#9AA0B4;
      --line:#272C39;--accent:#FF8A3D;--accent-soft:#2A1B0E}
  }
  :root[data-theme="dark"]{--paper:#0F1117;--surface:#171A23;--ink:#EDEFF5;--muted:#9AA0B4;
    --line:#272C39;--accent:#FF8A3D;--accent-soft:#2A1B0E}
  :root[data-theme="light"]{--paper:#EEF0F5;--surface:#FFFFFF;--ink:#14161F;--muted:#5A5F73;
    --line:#DBDEE8;--accent:#E85D00;--accent-soft:#FFF1E6}

  *{box-sizing:border-box}
  body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);
    font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
  .page{max-width:1080px;margin:0 auto;padding:clamp(24px,5vw,64px) clamp(18px,4vw,40px) 96px;
    display:flex;flex-direction:column;gap:clamp(36px,5vw,60px)}

  h1{font-size:clamp(28px,4.4vw,44px);line-height:1.1;letter-spacing:-.03em;margin:0;
    text-wrap:balance;font-weight:700}
  h2{font-size:clamp(19px,2.2vw,23px);letter-spacing:-.02em;margin:0 0 14px;font-weight:700}
  p{margin:0;max-width:66ch}
  a{color:var(--accent);text-underline-offset:3px}

  .lede{color:var(--muted);font-size:clamp(16px,1.7vw,18px);margin-top:12px}
  .eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;
    color:var(--accent);margin:0 0 10px}

  .facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1px;
    background:var(--line);border:1px solid var(--line);border-radius:4px;overflow:hidden}
  .fact{background:var(--surface);padding:16px 18px}
  .fact dt{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;
    color:var(--muted);margin:0 0 5px}
  .fact dd{margin:0;font-weight:650;font-size:15px;letter-spacing:-.01em}

  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
    gap:clamp(18px,2.5vw,28px)}
  .card{background:var(--surface);border:1px solid var(--line);border-radius:4px;
    overflow:hidden;display:flex;flex-direction:column}
  .card img{width:100%;height:auto;display:block;border-bottom:1px solid var(--line)}
  .meta{padding:14px 16px 16px;display:flex;flex-direction:column;gap:7px}
  .row{display:flex;align-items:baseline;gap:10px}
  /* The numbers are the swipe order — a real sequence, not decoration. */
  .num{font-family:var(--mono);font-size:12px;font-weight:700;color:var(--accent);
    background:var(--accent-soft);padding:2px 7px;border-radius:3px;letter-spacing:.06em}
  .role{font-weight:700;font-size:14px;letter-spacing:-.01em}
  .shows{color:var(--muted);font-size:13.5px;line-height:1.45}
  .says{font-size:14px;line-height:1.45;border-left:2px solid var(--accent);padding-left:10px}

  .block{background:var(--surface);border:1px solid var(--line);border-radius:4px;
    padding:clamp(18px,3vw,26px)}
  pre{margin:0;font-family:var(--mono);font-size:13px;line-height:1.7;white-space:pre-wrap;
    word-break:break-word;color:var(--ink)}
  code{font-family:var(--mono);font-size:.92em;background:var(--paper);
    border:1px solid var(--line);border-radius:3px;padding:1px 5px}

  ol.steps{margin:0;padding-left:0;list-style:none;counter-reset:s;
    display:flex;flex-direction:column;gap:12px}
  ol.steps li{counter-increment:s;display:flex;gap:12px;align-items:flex-start}
  ol.steps li::before{content:counter(s,decimal-leading-zero);font-family:var(--mono);
    font-size:12px;font-weight:700;color:var(--accent);background:var(--accent-soft);
    padding:2px 7px;border-radius:3px;flex:none;margin-top:2px}

  .warn{border-left:3px solid var(--accent);padding-left:16px;display:flex;
    flex-direction:column;gap:14px}
  .warn p{max-width:70ch}
  .warn strong{font-weight:700}

  button{font:inherit;font-size:13px;font-weight:650;cursor:pointer;color:var(--ink);
    background:var(--paper);border:1px solid var(--line);border-radius:3px;padding:7px 13px;
    margin-top:14px}
  button:hover{border-color:var(--accent);color:var(--accent)}
  button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
  @media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>

<div class="page">

  <header>
    <p class="eyebrow">Ready to post</p>
    <h1>Your launch carousel — 8 slides</h1>
    <p class="lede">Every slide already has the headline, the logo and the swipe dots on it.
      Scroll down to see all eight exactly as they'll appear in the feed.</p>
  </header>

  <dl class="facts">
    <div class="fact"><dt>Format</dt><dd>1080 × 1350 &middot; 4:5 portrait</dd></div>
    <div class="fact"><dt>Post as</dt><dd>One carousel, slides 1–8 in order</dd></div>
    <div class="fact"><dt>Works on</dt><dd>Instagram &middot; LinkedIn &middot; Facebook</dd></div>
    <div class="fact"><dt>Files</dt><dd><code>assets/brand/carousel/</code></dd></div>
  </dl>

  <section>
    <h2>The eight slides</h2>
    <div class="grid">
      ${SLIDES.map((s) => `<figure class="card" style="margin:0">
        <img src="${img(s.n)}" alt="Slide ${s.n}: ${s.says.replace(/"/g, '')}"
          width="620" height="775" loading="lazy" decoding="async">
        <figcaption class="meta">
          <div class="row"><span class="num">${s.n}</span><span class="role">${s.role}</span></div>
          <p class="shows">${s.shows}</p>
          <p class="says">${s.says}</p>
        </figcaption>
      </figure>`).join('\n      ')}
    </div>
  </section>

  <section>
    <h2>Caption</h2>
    <div class="block">
      <pre id="cap">${CAPTION.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>
      <button type="button" id="copy">Copy caption</button>
    </div>
  </section>

  <section>
    <h2>How to post it</h2>
    <div class="block">
      <ol class="steps">
        <li>Open <code>D:\\Ai agents\\vocryn-website\\assets\\brand\\carousel\\</code> —
          or pull the repo from <a href="https://github.com/Bilal-363/ai-agent" target="_blank"
          rel="noopener">Bilal-363/ai-agent</a>.</li>
        <li>Select <code>slide-01.png</code> through <code>slide-08.png</code>. Eight separate
          files — the order of the filenames is the swipe order.</li>
        <li>Create one carousel post and add all eight. Don't crop; they're already 4:5.</li>
        <li>Paste the caption above. It's written as its own hook, so it works even for
          someone who never swipes.</li>
        <li>Post, then reply to every comment for the first hour — early engagement is what
          decides how far it travels.</li>
      </ol>
    </div>
  </section>

  <section>
    <h2>Two things to decide first</h2>
    <div class="warn">
      <p><strong>The 67% on slide 1</strong> is an industry statistic about callers abandoning
        on hold — not a measurement of your own callers. Have a source ready in case someone
        asks in the comments, or soften it to “two thirds of callers”.</p>
      <p><strong>The $9k on slide 3</strong> is illustrative, at a $600 new-patient value, and
        the slide says so. If you know your real number, use that instead — a figure you can
        defend beats a bigger one you can't.</p>
    </div>
  </section>

</div>

<script>
  document.getElementById('copy').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText(document.getElementById('cap').textContent);
      btn.textContent = 'Copied';
    } catch {
      btn.textContent = 'Select the text above to copy';
    }
    setTimeout(() => { btn.textContent = 'Copy caption'; }, 2200);
  });
</script>`;

fs.writeFileSync(OUT, html);
console.log(`preview page -> ${OUT}  (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`);
