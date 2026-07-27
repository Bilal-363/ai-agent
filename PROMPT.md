# MASTER BUILD PROMPT — Vocryn AI Website

> Paste this whole file into Claude (Fable 5) to rebuild, extend, or restyle the site.
> It is the single source of truth for brand, content, architecture, and acceptance criteria.

---

## 1. THE ASK

Build a **production-ready, deploy-today marketing website** for **Vocryn AI** — a HIPAA-ready
AI voice receptionist ("Casey") for dental and primary-care clinics.

Benchmarks:
- **talkie.ai** — the design north star. Simple, calm, generous whitespace, one idea per screen,
  no visual noise. *Copy the restraint, not the layout.*
- **confido.health** — the content/depth benchmark. Named agents, deep use-case library,
  integrations wall, ROI calculator, FAQ, testimonials, funding/social proof.

Deliver **Talkie's calm surface over Confido's depth of substance.**

Non-negotiables the client stated verbatim:
1. Responsive website **and responsive text** (fluid type, no fixed px headlines).
2. **Services → hover reveals all** (full mega-menu, every service visible at once).
3. **Use Cases → hover reveals all** (full mega-menu, every use case visible at once).
4. "Add as much as you can" — this is a complete site, not a landing page.
5. **Ready to go** — no build step required to deploy. Static output, drag-and-drop hostable.

---

## 2. BRAND FACTS (do not invent, do not contradict)

| Field | Value |
|---|---|
| Company | Vocryn AI |
| Product / persona | **Casey** — the AI receptionist |
| Positioning | AI Front Desk for Dental & Primary Care Clinics |
| Hero promise | Your Clinic's HIPAA-Ready AI Receptionist. Every Patient Heard. Every Appointment Booked. |
| Phone | 1-571-703-4510 |
| Email | care@vocryn.com |
| Demo path | `/demo` (was `/calendar`) |
| Socials | TikTok @vocrynai · YouTube @Vocrynai · X @Vocrynai |

### Proof points (use these exact numbers)
- 94% of calls answered
- 3× more bookings
- < 2s response time
- 99.3% intent accuracy
- 24/7 always on
- 99.9% uptime SLA
- 20+ languages
- Live counters: 24,847 calls answered · 18,203 bookings · 94.2% positive
- First-month results: 87% fewer missed calls · 3.2× more appointments booked
- Problem stat: **67% of callers hang up after 2 minutes on hold**

### Compliance language — CAREFUL
Say **"HIPAA-ready"**, **"SOC 2 aware"**, **"HIPAA-aware design"**.
**Never** claim formal HIPAA certification (no such thing) or a completed SOC 2 audit.
Safe to state: TLS 1.3 in transit, AES-256 at rest, role-based access control, full audit logs,
US-based servers, zero data-retention option, BAA available, real-time human escalation.
Add the disclaimer: *Casey does not provide medical advice, diagnosis, or prescriptions.*

### Testimonial (the only real one — mark any others as illustrative)
> "We went from 8–10 missed calls a day to zero, and bookings are up 41%."
> — **Dr. Priya Mehta**, Lakeview Primary Care, Chicago

---

## 3. INFORMATION ARCHITECTURE

### Services (10) — these populate the Services mega-menu
1. AI Appointment Booking — writes straight into the EHR
2. Insurance Verification — eligibility and benefits on the call
3. Prescription Refill Requests — triage and route to the provider
4. Rescheduling & Cancellations — plus automatic waitlist backfill
5. Patient Reminders & Recalls — outbound confirmations and hygiene recall
6. SMS Confirmations & Follow-ups
7. New Patient Intake — creates the chart over the phone
8. Clinical Documentation — structured telephone encounters
9. Call Routing & Escalation — warm transfer to a human in seconds
10. After-Hours & Overflow Coverage

### Use Cases (10) — these populate the Use Cases mega-menu
By practice type: Dental Practices · Primary Care · Multi-Location Groups · DSOs ·
Specialty Clinics · FQHCs & Community Health
By job to be done: Front Desk Relief · Missed-Call Recovery · No-Show Reduction ·
Patient Reactivation

### Integrations (10 real ones — no logos you don't have rights to; use styled wordmarks)
**Medical EHR:** Epic · athenahealth · eClinicalWorks · NextGen Healthcare · Practice Fusion
**Dental PMS:** Dentrix · Dentrix Ascend · NexHealth · Curve Dental · Open Dental

### Pages to build
| Page | Purpose |
|---|---|
`index.html` | Home — the full story in one scroll
`services.html` | All 10 services, deep sections, anchor targets
`use-cases.html` | All 10 use cases, filterable
`how-it-works.html` | 4-step onboarding + architecture diagram
`integrations.html` | Searchable integrations wall
`pricing.html` | 3 tiers + comparison table + ROI teaser
`roi-calculator.html` | Live interactive savings calculator
`security.html` | HIPAA / SOC 2 / data handling
`results.html` | Case studies + metrics
`about.html` | Story, mission, team
`contact.html` | Form + phone + email
`demo.html` | Booking page with qualification form
`faq.html` | 20+ Q&As, accordion, FAQPage schema
`blog.html` + 3 posts | Content marketing seed
`privacy.html` `terms.html` `hipaa.html` | Legal
`404.html` | Branded not-found

---

## 4. DESIGN SYSTEM

**Direction:** *Clinical calm with human warmth.* Cream canvas instead of stark white,
deep teal for trust, coral for action. Rounded, generous, never clinical-cold.

```
--ink        #0B1F1E   text, dark sections
--ink-soft   #3D5654   body copy
--brand-700  #0B5D57   deep teal, headings on light
--brand-600  #0F766E   primary teal
--brand-400  #2DD4BF   bright teal, accents/glow
--brand-50   #E6F5F2   tinted surfaces
--accent-500 #FF6B4A   coral — CTAs only, use sparingly
--accent-50  #FFF1ED
--cream      #FDFBF7   page background
--surface    #FFFFFF   cards
--line       #E7E2D9   borders
```

- **Type:** Plus Jakarta Sans (headings, 600–800) + Inter (body, 400–500). Google Fonts, preconnected.
- **Fluid type:** every size via `clamp()`. Hero `clamp(2.5rem, 6vw, 5rem)`. Body `clamp(1rem, 0.4vw + 0.9rem, 1.125rem)`. No fixed-px headings anywhere.
- **Radius:** 12 / 20 / 32px scale, pills for buttons.
- **Shadows:** soft, teal-tinted, layered — never grey/black boxes.
- **Spacing:** 4px base scale; sections `clamp(4rem, 10vw, 8rem)` vertical.
- **Motion:** 200–400ms `cubic-bezier(.16,1,.3,1)`. Scroll-reveal via IntersectionObserver.
  **All motion must respect `prefers-reduced-motion`.**
- **Dark mode:** full support via `[data-theme]` + `prefers-color-scheme`, with a header toggle
  that persists to `localStorage`.

### The mega-menus (the client's #1 request)
- Trigger on **hover on desktop** (pointer: fine) **and click/tap on touch + keyboard focus**.
- Show **every** service / use case at once — no scrolling inside the panel, no "see more".
- Layout: 2–3 columns of items, each with icon + title + one-line description, plus a
  featured promo card in the last column.
- 120ms open delay, 200ms close grace period so the pointer can cross the gap.
- Full keyboard support: Tab in, Arrow keys between items, Escape closes and returns focus.
- Mobile: the same content becomes an accordion inside the drawer menu.

---

## 5. HOMEPAGE SECTION ORDER

1. Announcement bar — dismissible, remembers dismissal
2. Sticky header — logo, nav with the two mega-menus, theme toggle, phone, "Book a Demo"
3. **Hero** — headline, subhead, dual CTA, live counters, trust badges, product visual
4. Integration logo marquee — "Writes directly into your EHR"
5. **Problem** — the 67% hang-up stat, cost of a missed call
6. **Meet Casey** — persona intro + inline audio-demo player with animated waveform
7. **Services grid** — all 10, hover-lift cards
8. **How it works** — 4 steps, connected timeline
9. **Use cases** — filterable tabs
10. **Results** — big metrics + Dr. Mehta testimonial
11. **Integrations wall**
12. **Security & compliance** — badges + plain-language bullets
13. **ROI calculator teaser** — 2 sliders, live number
14. **Pricing preview** — 3 cards
15. **FAQ accordion** — 8 on home, rest on `/faq`
16. **Final CTA** — dark teal band
17. **Footer** — 5 columns, socials, legal, disclaimer

---

## 6. INTERACTIONS TO IMPLEMENT (vanilla JS, no framework)

- Hover/focus mega-menus with delay + grace, keyboard nav, ARIA
- Mobile drawer with nested accordions, focus trap, scroll lock
- Theme toggle, persisted
- Scroll-reveal animations (IntersectionObserver)
- Animated count-up on the stat counters, fires once on view
- Audio demo player with a CSS/canvas waveform (works with no audio file present)
- Use-case filter tabs
- FAQ accordion (`<details>`-based, one open at a time optional)
- ROI calculator: sliders → live savings math, no reload
- Integrations search/filter
- Contact + demo forms with inline validation and a success state
- Sticky header shrink on scroll, progress bar
- Back-to-top button
- Announcement bar dismissal in `localStorage`
- Copy-phone-number-to-clipboard affordance

---

## 7. TECHNICAL CONTRACT

- **Output = static HTML/CSS/JS.** No framework, no npm install needed to deploy.
- Authoring may use a **dependency-free Node generator** (`build/build.js`) so the header/footer
  live in one place; it emits plain `.html` files to the project root.
  `node build/build.js` regenerates. Deployment never requires Node.
- One stylesheet (`assets/css/styles.css`), one script (`assets/js/main.js`).
- **SEO:** unique title + meta description per page, canonical, Open Graph + Twitter cards,
  JSON-LD (`Organization`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`), `sitemap.xml`,
  `robots.txt`, semantic landmarks, one `<h1>` per page.
- **A11y target WCAG 2.2 AA:** visible focus rings, skip link, 4.5:1 contrast, labelled controls,
  `aria-expanded` / `aria-current`, alt text on every image, reduced-motion honoured.
- **Performance:** no render-blocking JS, `loading="lazy"` + explicit `width`/`height` on images
  below the fold, `font-display: swap`, system-font fallback stack, CSS under ~60KB.
- **Assets:** inline SVG for all icons and logos. AI-generated raster art only where a photograph
  genuinely helps (hero, Casey persona, clinic scenes). Include `favicon.svg`, `og-image`.
- Include `README.md` with deploy instructions (Netlify / Vercel / Cloudflare Pages / cPanel)
  and a "where to edit what" map.

---

## 8. IMAGE GENERATION (Higgsfield — keep credits low)

Use `nano_banana_pro` at 1k resolution (~2 credits each). **Cap at ~8 images.**
Everything else — icons, logos, diagrams, patterns, avatars — is hand-authored SVG/CSS.

Shot list:
1. Hero — warm modern dental/primary-care reception, soft daylight, teal accents, no faces to the camera
2. Casey persona — friendly professional headshot, approachable, neutral background
3. Dental practice scene
4. Primary care clinic scene
5. Multi-location / group practice scene
6. Security-and-trust abstract
7. Two team/office shots for About
8. OG social share card

Style spine for every prompt: *clean editorial healthcare photography, soft natural light,
cream and deep-teal palette, calm and uncluttered, shallow depth of field, no text, no logos.*

---

## 9. ACCEPTANCE CRITERIA

- [ ] Renders correctly at 320 / 375 / 768 / 1024 / 1440 / 1920px. Zero horizontal scroll at any width.
- [ ] Every text size scales fluidly; nothing is fixed-px.
- [ ] Services hover-menu shows all 10 services simultaneously. Same for Use Cases.
- [ ] Menus work by hover, click, tap, and keyboard, and are screen-reader announced.
- [ ] All 18+ pages exist, are internally linked, and have no dead links.
- [ ] Dark mode is complete — no unstyled or low-contrast panels.
- [ ] ROI calculator and all forms function client-side with no console errors.
- [ ] Lighthouse ≥ 95 on Performance, Accessibility, Best Practices, SEO.
- [ ] Deployable by dragging the folder onto Netlify. Nothing else required.
- [ ] No unsubstantiated compliance claims anywhere in the copy.

---

## 10. TONE OF VOICE

Write for a **practice manager drowning in phone calls**, not for a CTO.
Concrete over clever. "Casey answers in under two seconds" beats "leveraging advanced
conversational AI". Short sentences. Real numbers. Warm, competent, never hypey.
Never say "revolutionary", "cutting-edge", "game-changing", or "seamless synergy".
