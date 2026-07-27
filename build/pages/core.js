'use strict';

const { icon } = require('../lib/icons');
const { u, esc } = require('../lib/layout');
const C = require('../lib/components');
const D = require('../lib/data');
const { site } = D;

const IMG = (name, alt, cls = 'deep__img') => `<img class="${cls}" src="assets/img/${name}.webp"
  srcset="assets/img/${name}-sm.webp 700w, assets/img/${name}.webp 1200w"
  sizes="(max-width: 1024px) 90vw, 44vw" width="1200" height="800" loading="lazy" alt="${esc(alt)}">`;

/* ------------------------------------------------------------- services */

const services = {
  slug: 'services',
  title: 'Services — everything a great front desk does',
  desc: 'Ten things Casey handles end to end: EHR booking, insurance verification, refill triage, rescheduling, reminders, intake, and after-hours cover.',
  active: 'services',
  body: `
${C.phero({
    eyebrow: `${D.services.length} services, one assistant`,
    h: 'Everything a great front desk does — <span class="grad">on every single call.</span>',
    lead: 'Casey does not hand you a to-do list. Each of these runs end to end, with a human escalation path whenever it should not.',
    trail: [{ label: 'Services' }],
    extra: `<div class="pillrow" style="margin-top:1.75rem">
    ${D.services.map((s) => `<a class="chip chip--solid" href="#${s.slug}">${icon(s.icon)} ${esc(s.title)}</a>`).join('')}
  </div>`,
  })}

<section class="sec sec--tight">
  <div class="wrap">
    ${D.services
      .map(
        (s, i) => `<div class="deep${i % 2 ? ' deep--flip' : ''} reveal" id="${s.slug}">
      <div>
        <span class="deep__ico">${icon(s.icon)}</span>
        <h2 class="deep__h">${esc(s.title)}</h2>
        <p class="deep__lead">${esc(s.lead)}</p>
        ${C.ticks(s.bullets)}
      </div>
      <div class="deep__panel">
        <p class="eyebrow eyebrow--accent">${icon('trending-up')} Typical impact</p>
        <p class="price__v" style="margin:1.15rem 0 .5rem">${esc(s.stat.value)}</p>
        <p class="price__b">${esc(s.stat.label)}</p>
        <div class="deep__out">${icon('sparkles')}
          <span>${esc(s.short)}</span>
        </div>
        <div class="btnrow" style="margin-top:1.5rem">
          <a class="btn btn--primary btn--sm" href="${u('/demo.html')}">See it in a demo ${icon('arrow-right')}</a>
        </div>
      </div>
    </div>`
      )
      .join('')}
  </div>
</section>

${C.statBand({ title: 'What all ten add up to' })}
${C.ctaSplit()}`,
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Vocryn AI services',
      itemListElement: D.services.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.title,
        description: s.short,
        url: `${site.url}/services.html#${s.slug}`,
      })),
    },
  ],
};

/* ------------------------------------------------------------ use cases */

const useCases = {
  slug: 'use-cases',
  title: 'Use cases — by practice type and by problem',
  desc: 'How Casey works for dental practices, primary care, groups, DSOs and FQHCs — and for front desk relief, missed calls, no-shows and reactivation.',
  active: 'useCases',
  body: `
${C.phero({
    eyebrow: `${D.useCases.length} use cases`,
    h: 'Built for the way <span class="grad">your practice actually runs.</span>',
    lead: 'Pick the shape of your practice, or the problem keeping your practice manager up at night. Both routes lead somewhere useful.',
    trail: [{ label: 'Use cases' }],
    extra: `<div class="pillrow" style="margin-top:1.75rem">
    ${D.useCases.map((c) => `<a class="chip chip--solid" href="#${c.slug}">${icon(c.icon)} ${esc(c.title)}</a>`).join('')}
  </div>`,
  })}

<section class="sec sec--tight">
  <div class="wrap">
    ${D.useCases
      .map(
        (c, i) => `<div class="deep${i % 2 ? ' deep--flip' : ''} reveal" id="${c.slug}">
      <div>
        <p class="eyebrow">${icon(c.icon)} ${esc(c.group)}</p>
        <h2 class="deep__h" style="margin-top:1.1rem">${esc(c.title)}</h2>
        <p class="deep__lead">${esc(c.lead)}</p>
        ${C.ticks(c.bullets)}
        <div class="deep__out">${icon('trending-up')}<span><strong>Typical outcome:</strong> ${esc(c.outcome)}</span></div>
      </div>
      <div>${IMG(c.img, `${c.title} — ${c.short}`)}</div>
    </div>`
      )
      .join('')}
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    ${C.shead({ eyebrow: 'Compare at a glance', eyebrowIcon: 'target', h: 'All ten, side by side.' })}
    ${C.useCaseCards()}
  </div>
</section>

${C.ctaSplit()}`,
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Vocryn AI use cases',
      itemListElement: D.useCases.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.title,
        description: c.short,
        url: `${site.url}/use-cases.html#${c.slug}`,
      })),
    },
  ],
};

/* --------------------------------------------------------- how it works */

const howItWorks = {
  slug: 'how-it-works',
  title: 'How it works — live in 10 business days',
  desc: 'Discovery call, system connection, training on your practice, then go live in overflow mode and expand. About two hours of your team’s time in total.',
  active: '/how-it-works.html',
  body: `
${C.phero({
    eyebrow: 'Onboarding',
    h: 'Live in ten business days. <span class="grad">Two hours of your time.</span>',
    lead: 'We do the configuration work. You review the conversation flows and sign off before a single patient hears Casey speak.',
    trail: [{ label: 'How it works' }],
  })}

<section class="sec sec--tight">
  <div class="wrap">${C.stepsSection()}</div>
</section>

<section class="sec sec--alt">
  <div class="wrap split">
    <div class="reveal">
      <p class="eyebrow">${icon('workflow')} What happens on a call</p>
      <h2 class="h2" style="margin:1.1rem 0 .95rem">Six steps, about ninety seconds.</h2>
      <p class="lead">Every call follows the same shape, and every step is visible to you afterwards in
        the transcript.</p>
      <div class="mt2">${C.ticks([
        'A patient dials your existing number and Casey answers in under two seconds',
        'Casey identifies itself and asks how it can help',
        'It works out the intent — booking, refill, insurance, or something else',
        'It reads your live availability and rules, then acts',
        'It writes the outcome into your EHR or practice management system',
        'It confirms by SMS, or transfers to your team if that is the right ending',
      ])}</div>
    </div>
    <div class="deep__panel reveal reveal-d2">
      <p class="eyebrow eyebrow--accent">${icon('clock')} Effort split</p>
      <div class="mt2" style="display:grid;gap:1.25rem">
        <div>
          <div class="rng__top"><span class="rng__lbl">Your team</span><span class="rng__val">~2 hrs</span></div>
          <div style="height:.45rem;border-radius:999px;background:var(--brand-100);overflow:hidden">
            <div style="width:8%;height:100%;background:var(--accent-500)"></div>
          </div>
          <p class="rng__hint">One discovery call, one sign-off session, one dashboard walkthrough.</p>
        </div>
        <div>
          <div class="rng__top"><span class="rng__lbl">Our team</span><span class="rng__val">~25 hrs</span></div>
          <div style="height:.45rem;border-radius:999px;background:var(--brand-100);overflow:hidden">
            <div style="width:100%;height:100%;background:var(--brand-600)"></div>
          </div>
          <p class="rng__hint">Integration, scripting, testing, tuning, and go-live monitoring.</p>
        </div>
      </div>
      <div class="deep__out">${icon('check')}<span>Nothing changes for your staff. Same software, same
        phone number, same workflow — Casey just picks up the calls they cannot.</span></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'Rollout',
      eyebrowIcon: 'gauge',
      h: 'Start in overflow mode. Expand when you trust it.',
      lead: 'Nobody should hand their whole phone line to software on day one, and we would not ask you to.',
    })}
    <div class="grid g3">
      <div class="card reveal">
        <span class="card__ico">${icon('phone-missed')}</span>
        <h3 class="card__h">Week 1 — Overflow only</h3>
        <p class="card__p">Casey picks up only what your team cannot: the third simultaneous caller, the
          lunch hour, after five. Everything else rings as it always has.</p>
      </div>
      <div class="card reveal reveal-d1">
        <span class="card__ico">${icon('moon')}</span>
        <h3 class="card__h">Weeks 2–3 — Add after hours</h3>
        <p class="card__p">Evenings, weekends, and holidays go to Casey. This is usually where practices
          see the first clear jump in bookings.</p>
      </div>
      <div class="card reveal reveal-d2">
        <span class="card__ico">${icon('headset')}</span>
        <h3 class="card__h">Week 4+ — Answer-all</h3>
        <p class="card__p">Casey takes the main line, with your team on warm transfer for anything it
          should not handle. Many practices stay in overflow mode by choice — both are fine.</p>
      </div>
    </div>
  </div>
</section>

${C.statBand({ title: 'Where practices land after ninety days' })}
${C.ctaSplit()}`,
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to launch Casey at your clinic',
      totalTime: 'P10D',
      step: D.steps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.title,
        text: s.body,
      })),
    },
  ],
};

/* --------------------------------------------------------- integrations */

const integrations = {
  slug: 'integrations',
  title: 'Integrations — Epic, Dentrix, athenahealth and more',
  desc: 'Two-way access to Epic, athenahealth, eClinicalWorks, NextGen, Practice Fusion, Dentrix, Dentrix Ascend, NexHealth, Curve Dental and Open Dental.',
  active: '/integrations.html',
  body: `
${C.phero({
    eyebrow: `${D.integrations.length} EHR & PMS integrations`,
    h: 'It writes into your system, <span class="grad">not a spreadsheet.</span>',
    lead: 'A booking is only real when it lands in your schedule. Casey reads your live availability and writes confirmed appointments back — respecting provider, operatory, and appointment-type rules.',
    trail: [{ label: 'Integrations' }],
  })}

<section class="sec sec--tight">
  <div class="wrap">${C.integrationsWall({ search: true })}</div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'Read and write',
      eyebrowIcon: 'database',
      h: 'What "integrated" actually means here.',
      lead: 'A lot of products in this category can read your calendar. Far fewer can write to it correctly.',
    })}
    <div class="grid g2">
      <div class="deep__panel reveal">
        <p class="eyebrow">${icon('search')} Casey reads</p>
        <div class="mt2">${C.ticks([
          'Live provider and operatory availability',
          'Appointment types and their real durations',
          'Existing patient charts and contact details',
          'Current medication lists for refill requests',
          'Insurance and plan details already on file',
          'Recall and overdue-patient lists',
        ])}</div>
      </div>
      <div class="deep__panel reveal reveal-d2">
        <p class="eyebrow eyebrow--accent">${icon('plus')} Casey writes</p>
        <div class="mt2">${C.ticks([
          'Confirmed appointments, respecting all scheduling rules',
          'Reschedules and cancellations with reason codes',
          'New patient charts with demographics and insurance',
          'Structured telephone encounter notes',
          'Refill requests routed to the provider queue',
          'Updated contact details and communication preferences',
        ])}</div>
      </div>
    </div>
    <div class="deep__panel reveal mt3" style="text-align:center">
      <p class="h4">Using something not on this list?</p>
      <p class="price__b mt1">We add integrations regularly, and we will tell you honestly whether yours
        is a two-week job or a two-month one.</p>
      <div class="btnrow" style="justify-content:center;margin-top:1.5rem">
        <a class="btn btn--primary" href="${u('/contact.html')}">Ask about your system ${icon('arrow-right')}</a>
      </div>
    </div>
  </div>
</section>

${C.ctaSplit()}`,
};

/* -------------------------------------------------------------- pricing */

const pricing = {
  slug: 'pricing',
  title: 'Pricing — one fixed monthly cost',
  desc: 'Starter from $399/mo, Practice from $899/mo, custom pricing for groups and DSOs. No per-seat charges, no per-minute surprises, month to month.',
  active: '/pricing.html',
  body: `
${C.phero({
    eyebrow: 'Pricing',
    h: 'One fixed monthly cost. <span class="grad">No per-minute surprises.</span>',
    lead: 'Priced by call volume and the features you need — never by headcount. Zero turnover, zero retraining, zero sick days.',
    trail: [{ label: 'Pricing' }],
  })}

<section class="sec sec--tight">
  <div class="wrap">
    ${C.pricingCards()}
    <div class="incl">
      ${D.pricingIncludes.map((f) => `<div class="tick">${icon('check')}<span>${esc(f)}</span></div>`).join('')}
    </div>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'Compare',
      eyebrowIcon: 'sliders',
      h: 'What the plans actually differ on.',
    })}
    <div class="deep__panel reveal" style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;min-width:34rem;font-size:var(--t-sm)">
        <thead>
          <tr style="text-align:left">
            <th style="padding:.85rem;border-bottom:2px solid var(--line-2);font-family:var(--font-d)">Capability</th>
            ${D.pricing.map((p) => `<th style="padding:.85rem;border-bottom:2px solid var(--line-2);font-family:var(--font-d);text-align:center">${esc(p.name)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${[
            ['Monthly call allowance', '500', '2,000', 'Unlimited'],
            ['Appointment booking & rescheduling', 'yes', 'yes', 'yes'],
            ['SMS confirmations & reminders', 'yes', 'yes', 'yes'],
            ['After-hours & overflow cover', 'yes', 'yes', 'yes'],
            ['EHR / PMS integrations', '1', '1', 'Multiple'],
            ['Insurance verification', 'no', 'yes', 'yes'],
            ['New patient intake to chart', 'no', 'yes', 'yes'],
            ['Refill triage & routing', 'no', 'yes', 'yes'],
            ['Outbound recall & waitlist backfill', 'no', 'yes', 'yes'],
            ['Clinical documentation', 'no', 'yes', 'yes'],
            ['20+ languages', 'no', 'yes', 'yes'],
            ['Locations included', '1', '1', 'Unlimited'],
            ['Portfolio reporting', 'no', 'no', 'yes'],
            ['99.9% uptime SLA', 'no', 'no', 'yes'],
            ['Named account manager', 'no', 'no', 'yes'],
          ]
            .map(
              (row) => `<tr>
            <td style="padding:.8rem;border-bottom:1px solid var(--line);font-weight:600;color:var(--ink)">${esc(row[0])}</td>
            ${row
              .slice(1)
              .map((v) => {
                const cell =
                  v === 'yes'
                    ? `<span style="color:var(--brand-600)">${icon('check')}</span>`
                    : v === 'no'
                    ? '<span style="color:var(--ink-4)">—</span>'
                    : `<span style="font-weight:700;color:var(--ink)">${esc(v)}</span>`;
                return `<td style="padding:.8rem;border-bottom:1px solid var(--line);text-align:center">${cell}</td>`;
              })
              .join('')}
          </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'Payback',
      eyebrowIcon: 'dollar-sign',
      h: 'Most practices are net positive inside month one.',
      lead: 'Run your own numbers rather than taking ours.',
    })}
    ${C.roiCalculator()}
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    ${C.shead({ eyebrow: 'Pricing FAQ', eyebrowIcon: 'book-open', h: 'The commercial questions.' })}
    <div class="faq" data-accordion-single>
      ${D.faqs
        .filter((f) => f.cat === 'Commercial')
        .map(
          (f, i) => `<details class="qa" id="pq${i + 1}">
        <summary><span>${esc(f.q)}</span><span class="qa__ico">${icon('plus')}</span></summary>
        <div class="qa__a">${esc(f.a)}</div>
      </details>`
        )
        .join('')}
    </div>
  </div>
</section>`,
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: D.faqs
        .filter((f) => f.cat === 'Commercial')
        .map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    },
  ],
};

/* ------------------------------------------------------ roi calculator */

const roi = {
  slug: 'roi-calculator',
  title: 'ROI calculator — what are your missed calls costing?',
  desc: 'Four sliders and honest assumptions. Estimate recovered appointments, recovered revenue, staff hours returned, and net monthly gain from an AI receptionist.',
  body: `
${C.phero({
    eyebrow: 'ROI calculator',
    h: 'What are your missed calls <span class="grad">actually costing you?</span>',
    lead: 'Move four sliders. No email gate, no lead form, no "request your report". The assumptions are written out underneath so you can argue with them.',
    trail: [{ label: 'ROI calculator' }],
  })}

<section class="sec sec--tight">
  <div class="wrap">${C.roiCalculator()}</div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'Method',
      eyebrowIcon: 'book-open',
      h: 'How we got to those numbers.',
      lead: 'Every ROI calculator is a set of assumptions wearing a suit. Here are ours.',
    })}
    <div class="grid g2">
      <div class="deep__panel reveal">
        <h3 class="h4">What we assume</h3>
        <div class="mt2">${C.ticks([
          'About 30% of missed calls carry appointment intent — the rest are questions, billing, and admin',
          'Only half of those are permanently lost; we assume the other half ring back',
          'Casey answers 94% of the calls that currently go unanswered',
          'Casey handles roughly 70% of your total call volume',
          'An average handled call takes about 3.5 minutes of staff time',
          'Appointment value is your production per visit, not lifetime value',
        ])}</div>
      </div>
      <div class="deep__panel reveal reveal-d2">
        <h3 class="h4">What we deliberately leave out</h3>
        <div class="mt2">${C.ticks([
          'Lifetime value of a recovered new patient — usually far higher',
          'Revenue from cancelled slots refilled off the waitlist',
          'Hygiene recall you are not currently working at all',
          'Reduced overtime and agency cover for front desk gaps',
          'The cost of front desk turnover and retraining',
        ])}</div>
        <div class="deep__out">${icon('sparkles')}<span>In other words, the estimate is deliberately
          conservative. The upside is usually on the other side of these omissions.</span></div>
      </div>
    </div>
  </div>
</section>

${C.ctaSplit()}`,
};

/* ------------------------------------------------------------- security */

const security = {
  slug: 'security',
  title: 'Security & compliance — HIPAA-ready, BAA included',
  desc: 'TLS 1.3 and AES-256 encryption, US-based infrastructure, zero-retention options, role-based access control, full audit trails, and a signed BAA before go-live.',
  active: '/security.html',
  body: `
${C.phero({
    eyebrow: 'Security & compliance',
    h: 'Boring where it counts. <span class="grad">Specific where it matters.</span>',
    lead: 'HIPAA has no certification programme, so we will not show you a badge. Here are the specifics your compliance reviewer will actually ask about.',
    trail: [{ label: 'Security' }],
    extra: `<div class="pillrow" style="margin-top:1.75rem">
      ${D.trustBadges.map((b) => `<span class="chip chip--solid">${icon(b.icon)} ${esc(b.label)}</span>`).join('')}
    </div>`,
  })}

<section class="sec sec--tight">
  <div class="wrap">${C.securityGrid()}</div>
</section>

<section class="sec sec--alt">
  <div class="wrap split">
    <div class="reveal">${IMG('security', 'An abstract representation of layered data protection', 'deep__img')}</div>
    <div class="reveal reveal-d2">
      <p class="eyebrow eyebrow--accent">${icon('eye-off')} Straight answers</p>
      <h2 class="h2" style="margin:1.1rem 0 .95rem">The three questions worth asking any vendor.</h2>
      <div class="mt2" style="display:grid;gap:1.5rem">
        <div>
          <p class="dl__t">Is our data used to train AI models?</p>
          <p class="dl__d">No. Your patient data is never used to train shared or third-party models.
            It serves your practice and nothing else, and that commitment is in the contract rather
            than in a sales email.</p>
        </div>
        <div>
          <p class="dl__t">How long is data retained, and can we change it?</p>
          <p class="dl__d">You choose. Retention is configurable down to a zero-retention mode where
            audio is discarded at the end of the call and only the structured outcome written to the
            chart is kept.</p>
        </div>
        <div>
          <p class="dl__t">Who internally can access our recordings?</p>
          <p class="dl__d">Named roles under least-privilege access, with every access event written to
            an audit log you can request at any time. No offshore personnel have access.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'What we do not claim',
      eyebrowIcon: 'shield-check',
      h: 'Being straight about our posture.',
      lead: 'Overstating compliance is common in this category. We would rather you trusted the parts we can prove.',
    })}
    <div class="grid g2">
      <div class="deep__panel reveal">
        <h3 class="h4" style="color:var(--brand-600)">What we can evidence today</h3>
        <div class="mt2">${C.ticks([
          'A signed Business Associate Agreement before any patient call',
          'TLS 1.3 in transit and AES-256 at rest, with managed key rotation',
          'US-only processing and storage, with no offshore access',
          'Role-based access control with SSO available',
          'Complete, exportable audit trails',
          'Configurable retention including a zero-retention mode',
          'Redundant regions with automatic failover and a fallback to your phone system',
        ])}</div>
      </div>
      <div class="deep__panel reveal reveal-d2">
        <h3 class="h4" style="color:var(--accent-600)">What we will not pretend</h3>
        <div class="mt2" style="display:grid;gap:1.15rem;font-size:var(--t-sm);color:var(--ink-3)">
          <p><strong style="color:var(--ink)">We are not "HIPAA certified."</strong> Nobody is. HHS runs
            no certification programme, so any vendor claiming the badge is either careless or hoping
            you will not check. Ask us for the BAA and the security documentation instead.</p>
          <p><strong style="color:var(--ink)">Our SOC 2 Type II is in progress.</strong> Our controls
            are built to those criteria and we will share our current posture and documentation under
            NDA. We will tell you exactly where we are rather than imply a finished audit.</p>
          <p><strong style="color:var(--ink)">Compliance is shared.</strong> Your Notice of Privacy
            Practices, your state's call-recording consent rules, and your own risk analysis stay
            yours. We will help you with all three, but we cannot own them.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    ${C.shead({ eyebrow: 'Security FAQ', eyebrowIcon: 'lock', h: 'Compliance questions in full.' })}
    <div class="faq" data-accordion-single>
      ${D.faqs
        .filter((f) => f.cat === 'Security')
        .map(
          (f, i) => `<details class="qa" id="sq${i + 1}">
        <summary><span>${esc(f.q)}</span><span class="qa__ico">${icon('plus')}</span></summary>
        <div class="qa__a">${esc(f.a)}</div>
      </details>`
        )
        .join('')}
    </div>
    <div class="deep__panel reveal mt3" style="text-align:center;max-width:40rem;margin-inline:auto">
      <p class="h4">Need our security package for a review?</p>
      <p class="price__b mt1">We will send the BAA template, data-flow documentation, and our current
        security posture — usually the same working day.</p>
      <div class="btnrow" style="justify-content:center;margin-top:1.5rem">
        <a class="btn btn--primary" href="${u('/contact.html')}">Request the security package ${icon('arrow-right')}</a>
      </div>
    </div>
  </div>
</section>`,
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: D.faqs
        .filter((f) => f.cat === 'Security')
        .map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    },
  ],
};

/* -------------------------------------------------------------- results */

const results = {
  slug: 'results',
  title: 'Results — what changes in the first month',
  desc: '87% fewer missed calls, 3.2× more appointments booked, and two hours of admin time back per staff member per day. Case studies from dental and primary care practices.',
  active: '/results.html',
  body: `
${C.phero({
    eyebrow: 'Results',
    h: 'What actually changes <span class="grad">in the first month.</span>',
    lead: 'Aggregate numbers across participating dental and primary care practices, plus the detail behind three of them.',
    trail: [{ label: 'Results' }],
  })}

${C.statBand()}

<section class="sec">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'Case studies',
      eyebrowIcon: 'star',
      h: 'Three practices, three different problems.',
    })}

    <div class="deep reveal">
      <div>
        <p class="eyebrow">${icon('stethoscope')} Primary care · Chicago</p>
        <h2 class="deep__h" style="margin-top:1.1rem">Lakeview Primary Care</h2>
        <p class="deep__lead">A three-provider practice losing eight to ten calls a day to a front desk
          that was permanently double-booked between the phone and the check-in queue.</p>
        <div class="mt2">${C.ticks([
          'Missed calls fell from 8–10 a day to zero within three weeks',
          'Bookings up 41% against the prior quarter',
          'Refill requests now arrive with the medication list already attached',
          'Front desk staff report the job is materially less stressful',
        ])}</div>
        <figure class="quote mt3">
          <span class="quote__ico">${icon('quote')}</span>
          <blockquote class="quote__t">We went from 8–10 missed calls a day to zero, and bookings are up
            41%. My front desk finally gets to look after the patient standing in front of them instead
            of apologising to the phone.</blockquote>
          <figcaption class="quote__foot">
            <span class="quote__av" aria-hidden="true">PM</span>
            <span><span class="quote__n">Dr. Priya Mehta</span>
              <span class="quote__r">Lakeview Primary Care, Chicago</span>
              <span class="quote__v">${icon('check')} Named customer</span></span>
            <span class="quote__m">+41%</span>
          </figcaption>
        </figure>
      </div>
      <div>${IMG('primary-care', 'A bright modern primary care consultation room')}</div>
    </div>

    <div class="deep deep--flip reveal">
      <div>
        <p class="eyebrow">${icon('building')} Dental group · Texas</p>
        <h2 class="deep__h" style="margin-top:1.1rem">Four-location dental group</h2>
        <p class="deep__lead">Monday mornings were triage. Call volume spiked to three times the daily
          average in the first ninety minutes, and every location handled it differently.</p>
        <div class="mt2">${C.ticks([
          '87% fewer missed calls across all four locations',
          'The Monday spike absorbed with no queue at any site',
          'One consistent patient experience, centrally configured',
          'Around two hours of team time in total to launch',
        ])}</div>
        <div class="deep__out">${icon('trending-up')}<span><strong>Illustrative result.</strong> Aggregated
          from a participating group that asked not to be named.</span></div>
      </div>
      <div>${IMG('multi-location', 'A calm multi-location medical group front office')}</div>
    </div>

    <div class="deep reveal">
      <div>
        <p class="eyebrow">${icon('tooth')} Dental practice · Arizona</p>
        <h2 class="deep__h" style="margin-top:1.1rem">Single-location dental practice</h2>
        <p class="deep__lead">The hygiene recall list was the job that never got done. Nobody had a spare
          hour to work it, so it quietly grew for two years.</p>
        <div class="mt2">${C.ticks([
          'Recall list worked automatically every week',
          'Around 22 additional recall appointments a month',
          '41% of late cancellations refilled from the waitlist the same day',
          'No-show rate held under 5% for reminded patients',
        ])}</div>
        <div class="deep__out">${icon('trending-up')}<span><strong>Illustrative result.</strong> Aggregated
          from a participating practice that asked not to be named.</span></div>
      </div>
      <div>${IMG('dental-practice', 'A pristine modern dental practice treatment room')}</div>
    </div>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    ${C.shead({ eyebrow: 'In their words', eyebrowIcon: 'quote', h: 'What practice managers tell us.' })}
    ${C.testimonials()}
    <p class="intg__none">Metrics reflect aggregate and illustrative results from participating
      practices and are not a guarantee of outcomes. We will model your own call data on the demo.</p>
  </div>
</section>

${C.ctaSplit()}`,
};

module.exports = { services, useCases, howItWorks, integrations, pricing, roi, security, results };
