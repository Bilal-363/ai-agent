# Vocryn AI — website

A complete, production-ready marketing site for Vocryn AI. **21 static pages, no build step
required to deploy, no dependencies to install.**

- **Live-ready output:** plain `.html` files in this folder + `assets/`
- **Total page weight:** ~62 KB CSS + ~17 KB JS + ~35 KB hero image. No frameworks, no CDN calls
  except Google Fonts.
- **Design:** white canvas, indigo-blue primary, orange accent, a slight purple through the
  gradients. Fluid type throughout (every heading, body size and interface label uses `clamp()`).
- **Full dark mode**, remembered per visitor, respecting the OS preference by default.
- **Hover mega-menus** for Services and Use Cases showing all ten items at once, working by hover,
  click, tap, and keyboard.
- **Three fully voiced demo calls** — Casey actually speaks. Waveform doubles as a scrub bar, the
  transcript highlights the line being spoken and is click-to-seek.
- **Sticky mobile action bar** so the phone number, demo and ROI calculator are always one tap away.
- **Capability explorer** after the hero — all ten capabilities as vertical tabs, each showing the
  real exchange, and handing off to the demo player for the three that have audio.

---

## Deploy it

### Netlify (easiest — drag and drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this whole folder onto the page.
3. Done. `netlify.toml` and `_redirects` are already configured with security headers,
   asset caching, and a real 404 page.

### Vercel
```bash
npx vercel --prod
```
When asked for the output directory, use `.` (the current folder).

### Cloudflare Pages
Create a project, connect the repo, then set **Build command:** *(leave empty)* and
**Output directory:** `/`.

### Traditional hosting (cPanel, FTP, S3)
Upload everything except the `build/` folder to your web root. That's it — `build/` is
authoring-only and is never needed at runtime.

### Preview locally
```bash
npx serve .          # or: python -m http.server 8000
```
Opening `index.html` directly with `file://` also works — all paths are relative.

---

## Before you go live — 6 things to change

| # | What | Where |
|---|------|-------|
| 1 | **Point the forms at a real backend.** They currently validate and show a success state but send nothing. | [assets/js/main.js](assets/js/main.js) — section 12 |
| 2 | **Decide about the demo voices.** Three calls ship working, but they are AI-generated and labelled "Casey’s real voice". Re-record if your production Casey sounds different. | See "Demo call audio" below |
| 3 | **Swap the demo page for your real scheduler** (Calendly, HubSpot, Cal.com) if you'd rather not use the form. | [build/pages/company.js](build/pages/company.js) → `demo` |
| 4 | **Confirm every metric and testimonial.** Illustrative figures are labelled as such — verify or remove them. | [build/lib/data.js](build/lib/data.js) |
| 5 | **Have counsel review the legal pages.** They are a solid, honest starting point, not legal advice. | `privacy.html`, `terms.html`, `hipaa.html` |
| 6 | **Check pricing.** `$399` / `$899` are placeholders taken from a sensible market position. | [build/lib/data.js](build/lib/data.js) → `pricing` |

### Wiring up the forms
The submit handler is one function. Replace the success block with a real POST:

```js
// assets/js/main.js — inside the submit handler, replacing form.classList.add('is-sent')
const res = await fetch('https://your-endpoint.example/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(Object.fromEntries(new FormData(form))),
});
if (res.ok) form.classList.add('is-sent');
```

Zero-backend options that work with the existing markup: Netlify Forms (add
`netlify` to the `<form>` tag), Formspree, Basin, or Web3Forms.

### Demo call audio

Three calls ship working: emergency booking (0:39), prescription refill (0:38), and escalation to
a human (0:21). They are in `assets/audio/` and total 677 KB, loaded only when someone presses play.

They were produced by [build/audio.js](build/audio.js), which per line trims silence, applies a
250–3600 Hz telephone band-pass so it sounds like a real call, normalises loudness, and joins the
turns with a 0.34 s pause. It also writes [build/lib/demo-calls.json](build/lib/demo-calls.json) —
the per-line cue times that drive the transcript highlighting, and 96 waveform peaks read straight
off the PCM so the bars are the actual audio, not decoration.

**To change the scripts or re-record:** edit the `SCENARIOS` array in `build/audio.js`, put one
WAV per line in `build/audio-src/` named `s<scenario>-<line>.wav`, then:

```bash
node build/audio.js     # rebuild mp3s + cue times + peaks
node build/build.js     # regenerate the pages that embed them
```

Everything downstream — durations, tab labels, transcript, seek — is derived, so nothing else
needs touching. Real recordings of your own Casey will work exactly the same way.

**Note on honesty:** the player says "Casey's real voice". These are AI voices (Higgsfield
`seed_audio`, presets Emily / Marcus / Harper) reading scripts we wrote — true in the sense that
it is synthesised speech rather than an actor, but if your production Casey sounds materially
different, either re-record or soften that line in
[build/lib/components.js](build/lib/components.js).

---

## Editing content

**All copy lives in one file: [build/lib/data.js](build/lib/data.js).** Change it there and
regenerate — you never edit HTML by hand, so the header, footer, nav menus, and schema stay in sync
across all 21 pages.

```bash
node build/build.js     # regenerate every page  (needs Node 18+)
node build/check.js     # dead links, headings, alt text, JSON-LD, anchors
node build/shots.js     # screenshot every page × 6 widths × 2 themes, flag overflow
node build/test.js      # 98 functional browser assertions (drives real clicks)
node build/capture.js   # component screenshots, incl. the player mid-playback
node build/a11y.js      # WCAG AA contrast audit, every page, both themes
node build/audio.js     # rebuild the demo call audio

# Run the same functional suite against the deployed site:
TEST_BASE=https://ai-agent-eta-three.vercel.app node build/test.js
```

### Where to change what

| I want to change… | Edit |
|---|---|
| Phone, email, social links, company name | `build/lib/data.js` → `site` |
| Services (the Services mega-menu) | `build/lib/data.js` → `services` |
| Use cases (the Use Cases mega-menu) | `build/lib/data.js` → `useCases` |
| Integrations list | `build/lib/data.js` → `integrations`, `telephony` |
| Pricing tiers and the comparison table | `build/lib/data.js` → `pricing`; table in `build/pages/core.js` |
| FAQs (feeds 5 pages + FAQ schema) | `build/lib/data.js` → `faqs` |
| Stats, testimonials, blog posts | `build/lib/data.js` |
| Colours, type scale, spacing | `assets/css/styles.css` → section 1, Tokens |
| Brand mark | `assets/img/logo-mark.webp` (a render, not vector — re-render to recolour); wordmark and markup in `build/lib/layout.js` → `logoMark` |
| Favicon / touch icon | `build/build.js` (favicon.svg badge); `assets/img/apple-touch-icon.png` |
| Capability explorer samples | `build/lib/data.js` → `samples` |
| Header, footer, nav, mega-menu markup | `build/lib/layout.js` |
| Reusable page sections | `build/lib/components.js` |
| Individual page content | `build/pages/*.js` |
| Icons (all inline SVG) | `build/lib/icons.js` |

Adding a service or use case automatically updates the mega-menu, the mobile drawer, the cards on
the home page, the deep sections, the footer, and the JSON-LD. Nothing else to touch.

---

## What's in here

### Pages (21)
`index` · `services` · `use-cases` · `how-it-works` · `integrations` · `pricing` ·
`roi-calculator` · `security` · `results` · `about` · `contact` · `demo` · `faq` · `blog` ·
3 blog articles · `privacy` · `terms` · `hipaa` · `404`

### Interactive features
Hover mega-menus (keyboard + touch accessible) · mobile drawer with nested accordions and focus
trap · dark mode toggle · scroll reveals · animated stat counters · audio demo player with CSS
waveform · use-case and FAQ filtering · live ROI calculator · integration search · form validation
with inline errors · sticky header with scroll progress · back-to-top · dismissible announcement bar
· copy-phone-to-clipboard.

### SEO & accessibility
Unique title and meta description per page · canonical URLs · Open Graph + Twitter cards ·
JSON-LD (`Organization`, `SoftwareApplication`, `FAQPage`, `HowTo`, `ItemList`, `BlogPosting`,
`BreadcrumbList`) · `sitemap.xml` · `robots.txt` (AI crawlers allowed) · semantic landmarks ·
one `<h1>` per page · skip link · visible focus rings · `aria-expanded` / `aria-current` /
`aria-controls` wiring · alt text on every image · `prefers-reduced-motion` honoured throughout.

### Verified
- `node build/test.js` — **98/98 functional assertions pass**, locally and against the live
  Vercel deployment. Includes proof the audio actually decodes and advances, the transcript
  highlights in sync, seeking works, the capability explorer hands off to the player and starts
  playback, both mega-menus show all ten items, and no page logs a console error.
- `node build/a11y.js` — **0 WCAG AA contrast failures** across 19 pages in both themes.
- `node build/check.js` — **0 errors** across 21 pages
- `node build/shots.js` — **no horizontal overflow** at 360 / 390 / 768 / 1024 / 1440 / 1920 px,
  in both light and dark themes

---

## A note on the compliance copy

The site deliberately says **"HIPAA-ready"** and never "HIPAA certified" — there is no HIPAA
certification body, and claiming one is a credibility risk with exactly the buyers you want.
The security page states plainly what can be evidenced today and what is still in progress.
**Please keep it that way**, and don't upgrade "built to SOC 2 Type II criteria" into a completed
audit unless and until one exists.

Images are AI-generated (Higgsfield, `nano_banana_pro`) and contain no real patients or staff.
Replace them with photography of your own practices when you have it — the markup already ships
responsive `srcset` variants, so just match the existing filenames in `assets/img/`.

### The brand mark

`assets/img/logo-mark.webp` is a **rendered 3D image, not a vector.** Three SVG versions were
built and all read as flat beside the supplied artwork — a glossy twisted ribbon with a waveform
printed on its surface is shading and specular work, which a renderer does and a flat vector does
not.

What that costs you: **the mark no longer recolours with the theme.** If you change the palette,
the mark has to be re-rendered. It ships at 440px for a 56px display slot, so it stays sharp on
any screen, at 23 KB.

Sources are in `build/logo-src/` — the full-resolution cutout and `bbox.json`, the measured alpha
bounding box used to crop it tight. To swap in different artwork: drop a transparent PNG in, crop
it to the mark, export a WebP around 440px wide, and keep the filename.

The favicon is still the SVG badge (waveform bars in the brand gradient) because the full ribbon
turns to mush at 16px. The Apple touch icon is the ribbon on a white background — transparent
touch icons get composited onto black by iOS.
