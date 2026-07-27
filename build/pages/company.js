'use strict';

const { icon } = require('../lib/icons');
const { u, esc } = require('../lib/layout');
const C = require('../lib/components');
const D = require('../lib/data');
const { site } = D;

const IMG = (name, alt) => `<img class="deep__img" src="assets/img/${name}.webp"
  srcset="assets/img/${name}-sm.webp 700w, assets/img/${name}.webp 1200w"
  sizes="(max-width: 1024px) 90vw, 44vw" width="1200" height="800" loading="lazy" alt="${esc(alt)}">`;

/* ---------------------------------------------------------------- about */

const about = {
  slug: 'about',
  title: 'About Vocryn AI',
  desc: 'We built the AI receptionist we wished existed after watching a clinic lose patients to a ringing phone. Honest about what software should not decide.',
  body: `
${C.phero({
    eyebrow: 'About us',
    h: 'We got into this because <span class="grad">a phone kept ringing.</span>',
    lead: 'Vocryn started after watching a three-provider clinic lose a steady trickle of new patients — not to a competitor with better dentistry, but to a competitor who picked up.',
    trail: [{ label: 'About' }],
  })}

<section class="sec sec--tight">
  <div class="wrap split">
    <div class="reveal">${IMG('team', 'The Vocryn AI team working together in a bright office')}</div>
    <div class="reveal reveal-d2">
      <p class="eyebrow">${icon('heart-handshake')} Why we exist</p>
      <h2 class="h2" style="margin:1.1rem 0 .95rem">The front desk was never meant to be a call centre.</h2>
      <p class="lead">Ask any practice manager what breaks first when a clinic gets busy, and they will
        say the phone. Not the clinical work — the phone. It is the one job that cannot be batched,
        cannot wait, and always collides with the patient standing at the desk.</p>
      <p style="margin-top:1.15rem;color:var(--ink-3)">We built Casey to take that specific weight off,
        and we were deliberate about what it should not do. It does not triage clinically, it does not
        give advice, and it never traps a caller who wants a human. Those are not limitations we are
        working around — they are the design.</p>
    </div>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'How we work',
      eyebrowIcon: 'target',
      h: 'Four commitments we will be held to.',
    })}
    <div class="grid g4">
      ${[
        ['users', 'Staff, not replacements', 'We do not sell headcount reduction. Casey takes routine call volume so your team can do the work only people can do. Every practice we have launched still has a front desk.'],
        ['shield-check', 'Honest about compliance', 'We will never claim a certification that does not exist. You get the BAA, the documentation, and a straight answer about where we are on SOC 2.'],
        ['eye-off', 'Your data stays yours', 'Never used to train shared models. US-only processing. You control retention, down to discarding audio the moment a call ends.'],
        ['heart-handshake', 'A human is always reachable', 'Any caller can reach a person at any point. Emergency language transfers immediately. No maze, no gatekeeping, no exceptions.'],
      ]
        .map(
          ([ic, t, b], i) => `<div class="card reveal reveal-d${i + 1}">
        <span class="card__ico">${icon(ic)}</span>
        <h3 class="card__h">${esc(t)}</h3>
        <p class="card__p">${esc(b)}</p>
      </div>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${C.shead({ eyebrow: 'Where we are', eyebrowIcon: 'map-pin', h: 'A small team, deliberately.' })}
    <div class="grid g3">
      <div class="deep__panel reveal">
        <p class="price__v">${site.founded}</p>
        <p class="dl__t mt1">Founded</p>
        <p class="dl__d">Built specifically for dental and primary care, rather than adapted from a
          general-purpose call product.</p>
      </div>
      <div class="deep__panel reveal reveal-d1">
        <p class="price__v">US</p>
        <p class="dl__t mt1">Based and hosted</p>
        <p class="dl__d">All processing and storage stays inside US regions. Remote-first team, no
          offshore data access.</p>
      </div>
      <div class="deep__panel reveal reveal-d2">
        <p class="price__v">20+</p>
        <p class="dl__t mt1">Languages supported</p>
        <p class="dl__d">Because language should never be the reason a patient gives up on calling their
          own clinic.</p>
      </div>
    </div>
  </div>
</section>

${C.ctaSplit()}`,
};

/* -------------------------------------------------------------- contact */

const contact = {
  slug: 'contact',
  title: 'Contact Vocryn AI',
  desc: `Call ${site.phone}, email ${site.email}, or send us a message. We usually reply the same business day.`,
  body: `
${C.phero({
    eyebrow: 'Contact',
    h: 'Talk to a person, <span class="grad">not a form queue.</span>',
    lead: 'Call us, email us, or leave a message below. We reply the same business day in almost every case.',
    trail: [{ label: 'Contact' }],
  })}

<section class="sec sec--tight">
  <div class="wrap split" style="align-items:start">
    <div class="reveal">
      <div class="grid" style="gap:1rem">
        <a class="card card--hov" href="tel:${site.phoneHref}">
          <span class="card__ico">${icon('phone')}</span>
          <h2 class="card__h">${site.phone}</h2>
          <p class="card__p">Monday to Friday, 8am–7pm ET. A person answers — we would look silly
            otherwise.</p>
        </a>
        <a class="card card--hov" href="mailto:${site.email}">
          <span class="card__ico">${icon('mail')}</span>
          <h2 class="card__h">${site.email}</h2>
          <p class="card__p">Best for security packages, BAA requests, and anything your compliance
            reviewer needs.</p>
        </a>
        <a class="card card--hov" href="${u('/demo.html')}">
          <span class="card__ico">${icon('headset')}</span>
          <h2 class="card__h">Book a 20-minute demo</h2>
          <p class="card__p">The fastest route to a real answer. We dial in and you listen to Casey
            handle your awkward questions.</p>
        </a>
      </div>
      <div class="deep__panel mt3">
        <p class="eyebrow">${icon('clock')} Response times</p>
        <div class="mt2">${C.ticks([
          'Sales and demo requests — same business day',
          'Security and BAA requests — usually same business day',
          'Existing customer support — within 4 business hours',
          'Anything urgent on a live account — call us, do not email',
        ])}</div>
      </div>
    </div>

    <form class="form deep__panel reveal reveal-d2" data-validate novalidate>
      <div class="form__body">
        <h2 class="h3">Send us a message</h2>
        <p class="price__b" style="margin-bottom:1.5rem">Tell us what software you use and roughly how
          many calls you get — it makes the first reply far more useful.</p>
        <div class="fld--2">
          <div class="fld">
            <label for="cName">Your name <span>*</span></label>
            <input id="cName" name="name" type="text" required autocomplete="name" placeholder="Jordan Patel">
            <span class="fld__err">Please tell us your name.</span>
          </div>
          <div class="fld">
            <label for="cRole">Your role</label>
            <input id="cRole" name="role" type="text" autocomplete="organization-title" placeholder="Practice manager">
          </div>
        </div>
        <div class="fld--2">
          <div class="fld">
            <label for="cEmail">Work email <span>*</span></label>
            <input id="cEmail" name="email" type="email" required autocomplete="email" placeholder="you@practice.com">
            <span class="fld__err">Please enter a valid email address.</span>
          </div>
          <div class="fld">
            <label for="cPhone">Phone</label>
            <input id="cPhone" name="phone" type="tel" autocomplete="tel" placeholder="(555) 123-4567">
          </div>
        </div>
        <div class="fld--2">
          <div class="fld">
            <label for="cPractice">Practice name <span>*</span></label>
            <input id="cPractice" name="practice" type="text" required placeholder="Lakeview Dental">
            <span class="fld__err">Please tell us your practice name.</span>
          </div>
          <div class="fld">
            <label for="cSystem">EHR or practice management system</label>
            <select id="cSystem" name="system">
              <option value="">Select or skip…</option>
              ${D.integrations.map((i) => `<option>${esc(i.name)}</option>`).join('')}
              <option>Something else</option>
              <option>Not sure</option>
            </select>
          </div>
        </div>
        <div class="fld">
          <label for="cMsg">How can we help? <span>*</span></label>
          <textarea id="cMsg" name="message" required
            placeholder="We miss roughly 30 calls a week and the hygiene recall list has not been worked since spring…"></textarea>
          <span class="fld__err">Please tell us a little about what you need.</span>
        </div>
        <label class="consent">
          <input type="checkbox" name="consent" required>
          <span>I agree to Vocryn contacting me about my enquiry, and I have read the
            <a href="${u('/privacy.html')}">Privacy Policy</a>. Please do not include patient health
            information in this form.</span>
        </label>
        <button class="btn btn--primary btn--block btn--lg" type="submit">Send message ${icon('arrow-right')}</button>
        <p class="fld__hint" style="text-align:center">Or just call ${site.phone} — usually faster.</p>
      </div>
      <div class="form__ok">
        <span class="form__okIco">${icon('check')}</span>
        <h2 class="h3">Message sent.</h2>
        <p class="lead mt1">We will be back to you the same business day. If it is urgent, call
          <a href="tel:${site.phoneHref}">${site.phone}</a>.</p>
      </div>
    </form>
  </div>
</section>`,
};

/* ----------------------------------------------------------------- demo */

const demo = {
  slug: 'demo',
  title: 'Book a demo — see Casey answer a real call',
  desc: 'A 20-minute demo with no slide deck. We dial in, you listen to Casey handle booking, insurance, and an escalation, and you ask it the awkward questions your patients would.',
  body: `
${C.phero({
    eyebrow: '20 minutes, no slide deck',
    h: 'Hear Casey handle <span class="grad">your awkward questions.</span>',
    lead: 'We dial in together, you listen to a live call using your scheduling rules, and you interrupt whenever you like. If it is not right for you, we will say so.',
    trail: [{ label: 'Book a demo' }],
  })}

<section class="sec sec--tight">
  <div class="wrap split" style="align-items:start">
    <div class="reveal">
      <div class="deep__panel">
        <p class="eyebrow">${icon('headset')} What happens in the call</p>
        <div class="mt2" style="display:grid;gap:1.35rem">
          ${[
            ['1', 'Five minutes on your practice', 'Your providers, your systems, and where the phone hurts most right now.'],
            ['2', 'Ten minutes listening to Casey', 'A live call using your appointment types and scheduling rules. Ask it the things patients ask.'],
            ['3', 'Five minutes on your numbers', 'We model your actual call volume rather than showing you a generic ROI slide.'],
          ]
            .map(
              ([n, t, b]) => `<div style="display:flex;gap:1rem;align-items:flex-start">
            <span class="step__n" style="margin:0">${n}</span>
            <span><span class="dl__t">${esc(t)}</span><span class="dl__d">${esc(b)}</span></span>
          </div>`
            )
            .join('')}
        </div>
        <div class="deep__out">${icon('check')}<span>No obligation, no pressure, and no procurement
          gauntlet. If your system is not supported yet, we will tell you on the call.</span></div>
      </div>

      <div class="deep__panel mt3">
        <p class="eyebrow eyebrow--accent">${icon('phone')} Rather just talk now?</p>
        <p class="price__b mt1">Call ${site.phone} between 8am and 7pm ET and someone will pick up.</p>
        <div class="btnrow mt2">
          <a class="btn btn--ghost" href="tel:${site.phoneHref}">${icon('phone')} ${site.phone}</a>
          <button class="btn btn--outline" data-copy="${site.phone}">${icon('copy')} Copy number</button>
        </div>
      </div>

      <div class="pillrow mt3">
        ${D.trustBadges.map((b) => `<span class="chip">${icon(b.icon)} ${esc(b.label)}</span>`).join('')}
      </div>
    </div>

    <form class="form deep__panel reveal reveal-d2" data-validate novalidate>
      <div class="form__body">
        <h2 class="h3">Book your demo</h2>
        <p class="price__b" style="margin-bottom:1.5rem">We will come back with two or three times that
          suit, usually within a couple of hours.</p>
        <div class="fld--2">
          <div class="fld">
            <label for="dName">Your name <span>*</span></label>
            <input id="dName" name="name" type="text" required autocomplete="name" placeholder="Jordan Patel">
            <span class="fld__err">Please tell us your name.</span>
          </div>
          <div class="fld">
            <label for="dEmail">Work email <span>*</span></label>
            <input id="dEmail" name="email" type="email" required autocomplete="email" placeholder="you@practice.com">
            <span class="fld__err">Please enter a valid email address.</span>
          </div>
        </div>
        <div class="fld--2">
          <div class="fld">
            <label for="dPhone">Phone <span>*</span></label>
            <input id="dPhone" name="phone" type="tel" required autocomplete="tel" placeholder="(555) 123-4567">
            <span class="fld__err">We need a number to call you on.</span>
          </div>
          <div class="fld">
            <label for="dPractice">Practice name <span>*</span></label>
            <input id="dPractice" name="practice" type="text" required placeholder="Lakeview Dental">
            <span class="fld__err">Please tell us your practice name.</span>
          </div>
        </div>
        <div class="fld--2">
          <div class="fld">
            <label for="dType">Practice type <span>*</span></label>
            <select id="dType" name="type" required>
              <option value="">Select…</option>
              <option>Dental practice</option>
              <option>Primary care</option>
              <option>Multi-location group</option>
              <option>DSO</option>
              <option>Specialty clinic</option>
              <option>FQHC / community health</option>
              <option>Other</option>
            </select>
            <span class="fld__err">Please choose a practice type.</span>
          </div>
          <div class="fld">
            <label for="dLocations">Locations <span>*</span></label>
            <select id="dLocations" name="locations" required>
              <option value="">Select…</option>
              <option>1</option><option>2–4</option><option>5–14</option><option>15+</option>
            </select>
            <span class="fld__err">Please choose a range.</span>
          </div>
        </div>
        <div class="fld--2">
          <div class="fld">
            <label for="dSystem">EHR / practice management <span>*</span></label>
            <select id="dSystem" name="system" required>
              <option value="">Select…</option>
              ${D.integrations.map((i) => `<option>${esc(i.name)}</option>`).join('')}
              <option>Something else</option>
              <option>Not sure</option>
            </select>
            <span class="fld__err">Please tell us what you use.</span>
          </div>
          <div class="fld">
            <label for="dVolume">Monthly call volume</label>
            <select id="dVolume" name="volume">
              <option value="">Select or skip…</option>
              <option>Under 500</option><option>500–1,000</option>
              <option>1,000–2,500</option><option>2,500+</option><option>No idea</option>
            </select>
          </div>
        </div>
        <div class="fld">
          <label for="dGoal">What would make this a win for you?</label>
          <textarea id="dGoal" name="goal"
            placeholder="Stop losing new-patient calls at lunch, and finally work the hygiene recall list…"></textarea>
          <p class="fld__hint">Optional, but it makes the demo far more useful.</p>
        </div>
        <label class="consent">
          <input type="checkbox" name="consent" required>
          <span>I agree to Vocryn contacting me to arrange a demo, and I have read the
            <a href="${u('/privacy.html')}">Privacy Policy</a>. Please do not include patient health
            information in this form.</span>
        </label>
        <button class="btn btn--accent btn--block btn--lg" type="submit">Request my demo ${icon('arrow-right')}</button>
      </div>
      <div class="form__ok">
        <span class="form__okIco">${icon('check')}</span>
        <h2 class="h3">Request received.</h2>
        <p class="lead mt1">We will email you two or three times that work, usually within a couple of
          hours. If you would rather sort it now, call
          <a href="tel:${site.phoneHref}">${site.phone}</a>.</p>
      </div>
    </form>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    ${C.shead({ eyebrow: 'Before you ask', eyebrowIcon: 'book-open', h: 'The questions we get on every demo.' })}
    <div class="faq" data-accordion-single>
      ${D.faqs
        .filter((f) => f.cat === 'Setup')
        .map(
          (f, i) => `<details class="qa" id="dq${i + 1}">
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
        .filter((f) => f.cat === 'Setup')
        .map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    },
  ],
};

/* ------------------------------------------------------------------ FAQ */

const cats = [...new Set(D.faqs.map((f) => f.cat))];

const faq = {
  slug: 'faq',
  title: 'FAQ — everything practices ask about Casey',
  desc: `${D.faqs.length} straight answers about how Casey handles patients, what setup involves, how HIPAA and security work, and how pricing is structured.`,
  body: `
${C.phero({
    eyebrow: `${D.faqs.length} questions`,
    h: 'Straight answers, <span class="grad">including the awkward ones.</span>',
    lead: 'Grouped by what you are actually worried about. If yours is not here, call us and we will add it.',
    trail: [{ label: 'FAQ' }],
  })}

<section class="sec sec--tight">
  <div class="wrap">
    <div class="filters" data-filter-group="faq" role="group" aria-label="Filter questions">
      <button class="filter is-on" data-filter="all" aria-pressed="true">All ${D.faqs.length}</button>
      ${cats
        .map(
          (c) => `<button class="filter" data-filter="${c.toLowerCase()}" aria-pressed="false">${esc(c)}
        <span class="drawer__accCount">${D.faqs.filter((f) => f.cat === c).length}</span></button>`
        )
        .join('')}
    </div>
    <div class="faq">
      ${D.faqs
        .map(
          (f, i) => `<details class="qa" id="faq${i + 1}" data-filter-target="faq" data-tags="${f.cat.toLowerCase()}">
        <summary><span class="qa__cat">${esc(f.cat)}</span> <span>${esc(f.q)}</span>
          <span class="qa__ico">${icon('plus')}</span></summary>
        <div class="qa__a">${esc(f.a)}</div>
      </details>`
        )
        .join('')}
    </div>
  </div>
</section>

${C.ctaSplit()}`,
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: D.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

/* ----------------------------------------------------------------- blog */

const blog = {
  slug: 'blog',
  title: 'Blog — patient access, practice growth, and compliance',
  desc: 'Practical writing for practice managers on missed-call economics, buying an AI receptionist without getting sold to, and what HIPAA actually requires of a voice AI vendor.',
  body: `
${C.phero({
    eyebrow: 'Blog',
    h: 'Writing for people who <span class="grad">answer the phone.</span>',
    lead: 'No thought leadership. Practical pieces on the economics of patient access, buying software in this category, and the compliance questions worth your time.',
    trail: [{ label: 'Blog' }],
  })}

<section class="sec sec--tight">
  <div class="wrap">
    <div class="posts">
      ${D.posts
        .map(
          (p, i) => `<article class="post reveal reveal-d${(i % 3) + 1}">
        <div class="post__meta">
          <span class="chip chip--solid">${esc(p.cat)}</span>
          <time datetime="${p.date}">${esc(p.dateLabel)}</time>
          <span>·</span><span>${esc(p.read)}</span>
        </div>
        <h2 class="post__h"><a href="${p.slug}.html">${esc(p.title)}</a></h2>
        <p class="post__x">${esc(p.excerpt)}</p>
        <a class="post__go" href="${p.slug}.html">Read the article ${icon('arrow-right')}</a>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>

${C.ctaSplit()}`,
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: `${site.name} Blog`,
      url: `${site.url}/blog.html`,
      blogPost: D.posts.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        datePublished: p.date,
        description: p.excerpt,
        url: `${site.url}/${p.slug}.html`,
        author: { '@type': 'Organization', name: site.name },
      })),
    },
  ],
};

const postPages = D.posts.map((p, idx) => {
  const others = D.posts.filter((o) => o.slug !== p.slug);
  return {
    slug: p.slug,
    title: p.title,
    desc: p.excerpt,
    body: `
<section class="sec sec--tight">
  <div class="wrap article">
    <a class="article__back" href="${u('/blog.html')}">${icon('arrow-right')} All articles</a>
    <div class="article__hero">
      <div class="post__meta" style="margin-bottom:1.15rem">
        <span class="chip chip--solid">${esc(p.cat)}</span>
        <time datetime="${p.date}">${esc(p.dateLabel)}</time>
        <span>·</span><span>${esc(p.read)}</span>
      </div>
      <h1 class="h1">${esc(p.title)}</h1>
      <p class="lead" style="margin-top:1.15rem">${esc(p.excerpt)}</p>
    </div>
    ${p.body.map(([tag, text]) => `<${tag}>${esc(text)}</${tag}>`).join('\n    ')}

    <div class="deep__panel mt3" style="text-align:center">
      <p class="eyebrow">${icon('sliders')} Put a number on it</p>
      <p class="h4 mt1">See what your own missed calls are costing.</p>
      <div class="btnrow" style="justify-content:center;margin-top:1.35rem">
        <a class="btn btn--primary" href="${u('/roi-calculator.html')}">Open the ROI calculator ${icon('arrow-right')}</a>
        <a class="btn btn--ghost" href="${u('/demo.html')}">Book a demo</a>
      </div>
    </div>

    <div class="mt3">
      <h2 style="font-size:var(--t-h3)">Keep reading</h2>
      <div class="posts mt2">
        ${others
          .map(
            (o) => `<article class="post">
          <div class="post__meta"><span class="chip chip--solid">${esc(o.cat)}</span>
            <span>${esc(o.read)}</span></div>
          <h3 class="post__h"><a href="${o.slug}.html">${esc(o.title)}</a></h3>
          <p class="post__x">${esc(o.excerpt)}</p>
          <a class="post__go" href="${o.slug}.html">Read ${icon('arrow-right')}</a>
        </article>`
          )
          .join('')}
      </div>
    </div>
  </div>
</section>`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.excerpt,
        datePublished: p.date,
        dateModified: p.date,
        url: `${site.url}/${p.slug}.html`,
        wordCount: p.body.filter((b) => b[0] === 'p').join(' ').split(/\s+/).length,
        author: { '@type': 'Organization', name: site.name, url: site.url },
        publisher: { '@type': 'Organization', name: site.name, url: site.url },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.url}/${p.slug}.html` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/blog.html` },
          { '@type': 'ListItem', position: 3, name: p.title, item: `${site.url}/${p.slug}.html` },
        ],
      },
    ],
  };
});

/* ---------------------------------------------------------------- legal */

const LEGAL_DATE = 'July 1, 2026';

const legalPage = (slug, title, desc, sections) => ({
  slug,
  title,
  desc,
  body: `
${C.phero({ h: esc(title), trail: [{ label: title }] })}
<section class="sec sec--tight">
  <div class="wrap legal">
    <p class="legal__date">${icon('clock')} Last updated ${LEGAL_DATE}</p>
    ${sections
      .map(([h, ...paras]) => `<h2>${esc(h)}</h2>${paras
        .map((x) =>
          Array.isArray(x) ? `<ul>${x.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>` : `<p>${esc(x)}</p>`
        )
        .join('')}`)
      .join('')}
    <h2>Questions</h2>
    <p>Write to ${site.email} or call ${site.phone}. For anything a compliance reviewer needs, ask for
      our security package and we will usually send it the same business day.</p>
    <p style="font-size:var(--t-xs);color:var(--ink-4);margin-top:2rem">This page is provided for
      information and is not legal advice. Have your own counsel review any agreement before you sign it.</p>
  </div>
</section>`,
});

const privacy = legalPage(
  'privacy',
  'Privacy Policy',
  'How Vocryn AI collects, uses, stores, and protects information — including protected health information handled on behalf of clinics under a Business Associate Agreement.',
  [
    ['Who we are', `Vocryn AI provides administrative call-automation software to healthcare practices. This policy covers the information we collect through our website and through the Casey service. Where we handle protected health information (PHI) on behalf of a clinic, we do so as a business associate under a signed Business Associate Agreement, and that agreement governs.`],
    ['Information we collect', 'Through our website we collect what you choose to give us in a form: your name, work email, phone number, practice name, and the software you use. We also collect basic technical information such as browser type, approximate region, and which pages you viewed.', 'Through the Casey service we process call audio, transcripts, and the information a caller provides to complete an administrative request — for example a name, date of birth, appointment preference, insurance details, or pharmacy. Some of this is PHI.'],
    ['How we use it', 'Website information is used to respond to your enquiry, arrange a demo, and improve our site. Service information is used solely to deliver the service to the clinic that engaged us, and to support and secure that service.', 'We do not sell personal information. We do not use your patient data to train shared or third-party AI models.'],
    ['Legal bases and roles', 'For website enquiries we act as a controller of your business contact details. For call data processed on behalf of a clinic, the clinic is the covered entity and we act as its business associate and processor, acting only on documented instructions.'],
    ['Sharing', 'We share information only with subprocessors necessary to deliver the service — such as cloud hosting, speech recognition, language modelling, and telephony providers — each under contract and, where PHI is involved, under a BAA. A current subprocessor list is available on request.', 'We may disclose information where legally required, or to protect the rights and safety of people or of Vocryn.'],
    ['Storage, location, and retention', 'All processing and storage takes place in United States regions. No personnel outside the United States have access to call recordings or transcripts.', 'Retention is configurable by each clinic, including a zero-retention mode in which audio is discarded at the end of the call and only the structured outcome written to the clinic system is kept. Website enquiry records are kept for up to 24 months unless you ask us to delete them sooner.'],
    ['Security', 'We use TLS 1.3 for data in transit and AES-256 for data at rest, with managed key rotation, role-based least-privilege access, single sign-on where available, and complete audit logging of access and configuration changes.'],
    ['Your rights', 'Depending on where you live, you may have rights to access, correct, delete, or port your personal information, and to object to certain processing. Contact us and we will respond within the timeframe the applicable law requires.', 'If your request concerns PHI held on behalf of a clinic, please contact that clinic. As a business associate we will support them in responding, but we cannot action such requests directly.'],
    ['Cookies', 'We use only what is needed to make the site work and to understand aggregate traffic. We do not run advertising trackers, and we do not sell or share information for cross-context behavioural advertising.'],
    ['Call recording consent', 'Call recording is configured by each clinic. Roughly a dozen US states require all-party consent to record. Clinics are responsible for ensuring their disclosure language meets the requirements of their state, and we provide configurable announcements to support that.'],
    ['Children', 'Our website is not directed to children. Where a clinic uses Casey for paediatric patients, that information is handled as PHI under the clinic’s BAA and its own privacy practices.'],
    ['Changes', 'If we change this policy materially we will update the date above and, for service changes affecting clinics, notify the clinic administrator directly.'],
  ]
);

const terms = legalPage(
  'terms',
  'Terms of Service',
  'The terms governing use of the Vocryn AI website and the Casey service, including plan terms, acceptable use, limits on what Casey does, liability, and cancellation.',
  [
    ['Agreement', 'These terms govern your use of the Vocryn AI website and, together with your order form and Business Associate Agreement, the Casey service. If you are agreeing on behalf of a practice, you confirm you have authority to bind it.'],
    ['The service', 'Casey is administrative call-automation software. It answers inbound calls, schedules and reschedules appointments, captures administrative information, routes requests, and escalates to your staff according to the configuration you approve.'],
    ['What Casey does not do', 'Casey does not provide medical advice, diagnosis, treatment recommendations, or prescriptions, and does not interpret clinical results. It is not a medical device, a telehealth provider, or a pharmacy.', 'Casey is not an emergency service. It is configured to transfer immediately to a live person on emergency language, but you remain responsible for maintaining appropriate emergency and on-call procedures.'],
    ['Your responsibilities', 'You are responsible for the accuracy of your scheduling rules and clinical policies, for reviewing and approving conversation flows before go-live, for your own regulatory obligations including your Notice of Privacy Practices and state recording-consent requirements, and for maintaining appropriate staff coverage for escalated calls.'],
    ['Plans, fees, and volume', 'Fees are as stated on your order form and are billed monthly in advance. Starter and Practice plans are month-to-month. Groups and DSOs may elect an annual term.', 'If you exceed your plan’s call allowance we will not drop calls and we will not bill surprise overages. We will contact you to move you to an appropriate plan.'],
    ['Cancellation', 'Month-to-month plans may be cancelled with 30 days’ written notice. On termination we will export your call data and transcripts on request and then delete them in line with your configured retention and our BAA obligations.'],
    ['Acceptable use', 'You agree not to use the service to make unlawful calls, to contact people who have opted out, to breach telemarketing or consumer-protection rules, to attempt to reverse engineer or disrupt the service, or to represent Casey as a licensed clinician.'],
    ['Uptime and support', 'We target 99.9% monthly availability, contractually committed on Groups and DSO plans. Where availability degrades, calls fall back to your existing phone system.'],
    ['Intellectual property', 'We retain all rights in the service and our software. You retain all rights in your data, your patient information, and your practice content. You grant us only the limited licence needed to operate the service for you.'],
    ['Disclaimers and liability', 'The service is provided as described in your order form. Performance figures published on this website reflect aggregate and illustrative results from participating practices and are not a guarantee of your outcomes.', 'To the maximum extent permitted by law, neither party is liable for indirect, incidental, special, or consequential damages. Our aggregate liability is limited to the fees you paid in the twelve months before the claim, except where such limitation is unenforceable.'],
    ['Changes', 'We may update these terms. Material changes affecting an active subscription will be notified to your administrator at least 30 days in advance.'],
    ['Governing law', 'These terms are governed by the laws of the State of Delaware, without regard to conflict-of-laws rules. Disputes will be brought in the state or federal courts located in Delaware.'],
  ]
);

const hipaa = legalPage(
  'hipaa',
  'HIPAA Notice',
  'How Vocryn AI operates as a HIPAA business associate: BAA scope, safeguards, subprocessors, breach notification, and what HIPAA compliance does and does not mean.',
  [
    ['There is no such thing as HIPAA certification', 'We want to be direct about this, because the phrase is common in our category and it is misleading. The US Department of Health and Human Services does not certify anyone as HIPAA compliant. There is no audit, no badge, and no registry. Compliance is a continuing obligation, not a certificate.', 'So rather than claim a certification that does not exist, this page sets out exactly what we do and what we will put in writing.'],
    ['Our role', 'When a covered entity engages Vocryn, we create, receive, maintain, and transmit protected health information on its behalf. That makes us a business associate under HIPAA, and we sign a Business Associate Agreement with every clinic before any patient call is handled.'],
    ['What the BAA covers', 'Permitted uses and disclosures of PHI; our obligation to implement administrative, physical, and technical safeguards; our obligation to flow equivalent terms down to subcontractors; breach notification timelines; your right to access, amend, and receive an accounting of disclosures; and the return or destruction of PHI on termination.'],
    ['Safeguards we implement', 'Administrative: workforce training, documented policies, least-privilege access reviews, and a designated security contact.', 'Technical: TLS 1.3 in transit, AES-256 at rest, managed key rotation, role-based access control, single sign-on where available, and complete audit logging of access and configuration changes.', 'Physical: US-based data centres operated by providers with independently audited physical security controls. No personnel outside the United States have access to PHI.'],
    ['Minimum necessary', 'Casey requests only the information needed to complete the administrative task at hand. It does not solicit clinical detail beyond a reason for the call, and it does not attempt clinical triage.'],
    ['Subprocessors', 'Delivering voice AI involves downstream processors for cloud hosting, speech recognition, language modelling, and telephony. Each subprocessor that may touch PHI is under a BAA with equivalent obligations. A current list is available on request.'],
    ['Model training', 'Your patient data is never used to train shared or third-party AI models. This is a contractual commitment, not a policy statement we can quietly change.'],
    ['Retention and disposal', 'Each clinic configures retention for call audio and transcripts, including a zero-retention mode in which audio is discarded at the end of the call and only the structured outcome written to the clinic system is retained. On termination, PHI is returned or destroyed as directed.'],
    ['Breach notification', 'We maintain a documented incident-response plan. In the event of a breach of unsecured PHI we notify the affected covered entity without unreasonable delay and within the timeframe set out in the BAA, with the detail required for the clinic to meet its own notification obligations.'],
    ['What stays your responsibility', 'Updating your Notice of Privacy Practices to reflect automated call handling; confirming your state’s call-recording consent requirements; including Vocryn in your own security risk analysis and incident-response plan; and configuring Casey’s escalation rules appropriately for your practice.'],
    ['SOC 2', 'Our controls are built to SOC 2 Type II criteria. We will share our current security documentation and posture under NDA and tell you plainly where we are in that process. We will not imply a completed audit we do not have.'],
    ['Requesting documentation', `Email ${site.email} for the BAA template, data-flow documentation, subprocessor list, and our current security posture. We usually respond the same business day.`],
  ]
);

/* ------------------------------------------------------------------ 404 */

const notFound = {
  slug: '404',
  title: 'Page not found',
  desc: 'That page does not exist. Here are the places most people were looking for.',
  body: `
<section class="wrap nf">
  <p class="nf__n grad">404</p>
  <h1 class="h2" style="margin:.5rem 0 1rem">This page went to voicemail.</h1>
  <p class="lead" style="max-width:34rem;margin-inline:auto">The good news is Casey never does. Try one
    of these instead.</p>
  <div class="btnrow" style="justify-content:center;margin-top:2rem">
    <a class="btn btn--primary btn--lg" href="${u('/index.html')}">Back to home ${icon('arrow-right')}</a>
    <a class="btn btn--ghost btn--lg" href="${u('/demo.html')}">Book a demo</a>
  </div>
  <div class="grid g4 mt3" style="text-align:left">
    ${[
      ['calendar-check', 'Services', 'All ten things Casey handles.', '/services.html'],
      ['target', 'Use cases', 'By practice type or by problem.', '/use-cases.html'],
      ['sliders', 'ROI calculator', 'What are missed calls costing you?', '/roi-calculator.html'],
      ['book-open', 'FAQ', `All ${D.faqs.length} questions answered.`, '/faq.html'],
    ]
      .map(
        ([ic, t, b, href]) => `<a class="card card--hov" href="${u(href)}">
      <span class="card__ico">${icon(ic)}</span>
      <h2 class="card__h">${esc(t)}</h2>
      <p class="card__p">${esc(b)}</p>
      <span class="card__more">Go ${icon('arrow-right')}</span>
    </a>`
      )
      .join('')}
  </div>
</section>`,
};

module.exports = { about, contact, demo, faq, blog, postPages, privacy, terms, hipaa, notFound };
