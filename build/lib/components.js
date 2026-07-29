'use strict';

const { icon } = require('./icons');
const { u, esc } = require('./layout');
const D = require('./data');

/* ------------------------------------------------------------------ atoms */

const crumbs = (trail) => `<nav class="crumbs" aria-label="Breadcrumb">
  <a href="${u('/index.html')}">Home</a>
  ${trail.map((t) => `${icon('chevron-right')}${t.href ? `<a href="${u(t.href)}">${esc(t.label)}</a>` : `<span>${esc(t.label)}</span>`}`).join('')}
</nav>`;

const phero = ({ eyebrow, h, lead, trail, extra = '' }) => `
<section class="phero">
  <div class="wrap phero__in">
    ${trail ? crumbs(trail) : ''}
    ${eyebrow ? `<p class="eyebrow">${icon('sparkles')} ${esc(eyebrow)}</p>` : ''}
    <h1 class="phero__h">${h}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
    ${extra}
  </div>
</section>`;

const shead = ({ eyebrow, eyebrowIcon = 'sparkles', h, lead, center = true }) => `
<div class="shead${center ? ' shead--c' : ''}">
  ${eyebrow ? `<p class="eyebrow">${icon(eyebrowIcon)} ${esc(eyebrow)}</p>` : ''}
  <h2 class="h2">${h}</h2>
  ${lead ? `<p class="lead">${lead}</p>` : ''}
</div>`;

const ticks = (items) =>
  `<ul class="ticks">${items.map((t) => `<li class="tick">${icon('check')}<span>${esc(t)}</span></li>`).join('')}</ul>`;

/* --------------------------------------------------------------- marquee */

function marquee() {
  const names = D.integrations.map((i) => i.name);
  const run = [...names, ...names];
  return `<section class="marq" aria-label="Supported integrations">
  <p class="marq__lbl">Writes directly into the system you already use</p>
  <div class="marq__track">
    ${run.map((n) => `<span class="marq__item">${esc(n)}</span>`).join('')}
  </div>
</section>`;
}

/* ------------------------------------------------------------ stat band */

function statBand({ title, lead } = {}) {
  return `<section class="sec sec--dark">
  <div class="wrap">
    ${title ? `<div class="shead shead--c"><p class="eyebrow eyebrow--light">${icon('trending-up')} By the numbers</p>
      <h2 class="h2">${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>` : ''}
    <div class="statband">
      ${D.keyStats
        .map(
          (s, i) => `<div class="statc reveal reveal-d${i + 1}">
        <span class="statc__ico">${icon(s.icon)}</span>
        <p class="statc__n" data-count="${s.value}" data-dec="${String(s.value).includes('.') ? 1 : 0}"
           data-pre="${s.prefix || ''}" data-suf="${s.suffix}">${s.prefix || ''}0${s.suffix}</p>
        <p class="statc__l">${esc(s.label)}</p>
        <p class="statc__n2">${esc(s.note)}</p>
      </div>`
        )
        .join('')}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------- service cards */

function serviceCards(limit) {
  const list = limit ? D.services.slice(0, limit) : D.services;
  return `<div class="grid g3">
    ${list
      .map(
        (s, i) => `<a class="card card--hov reveal reveal-d${(i % 3) + 1}" href="${u('/services.html')}#${s.slug}">
      <span class="card__ico">${icon(s.icon)}</span>
      <h3 class="card__h">${esc(s.title)}</h3>
      <p class="card__p">${esc(s.short)}</p>
      <div class="card__stat"><b>${esc(s.stat.value)}</b><span>${esc(s.stat.label)}</span></div>
      <span class="card__more">Learn more ${icon('arrow-right')}</span>
    </a>`
      )
      .join('')}
  </div>`;
}

/* --------------------------------------------------------- use-case hue ramp */

/** Hue (0-360) of a #rrggbb, so a card can be washed in its own brand colour. */
const hexHue = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (!d) return 232;
  const h = max === r ? ((g - b) / d + (g < b ? 6 : 0))
          : max === g ? (b - r) / d + 2
          : (r - g) / d + 4;
  return Math.round(h * 60);
};


/**
 * One hue per use case, stepped blue -> magenta -> orange across the list.
 * Shared by the cards below and the deep panels on the use-cases page, so a given
 * use case is the same colour wherever it appears.
 */
const ucHue = (i, total = D.useCases.length) =>
  Math.round(232 + (i / Math.max(1, total - 1)) * 153);

/* ------------------------------------------------------ use case cards */

function useCaseCards() {
  const groups = [...new Set(D.useCases.map((c) => c.group))];
  return `
<div class="filters" data-filter-group="uc" role="group" aria-label="Filter use cases">
  <button class="filter is-on" data-filter="all" aria-pressed="true">All ${D.useCases.length}</button>
  ${groups
    .map(
      (g) => `<button class="filter" data-filter="${g.replace(/\s+/g, '-').toLowerCase()}" aria-pressed="false">${esc(g)}</button>`
    )
    .join('')}
</div>
<div class="grid g3">
  ${D.useCases
    .map(
      (c, i) => `<a class="card card--hov card--tint reveal reveal-d${(i % 3) + 1}"
    href="${u('/use-cases.html')}#${c.slug}" style="--h:${ucHue(i)}"
    data-filter-target="uc" data-tags="${c.group.replace(/\s+/g, '-').toLowerCase()}">
    <span class="card__ico">${icon(c.icon)}</span>
    <h3 class="card__h">${esc(c.title)}</h3>
    <p class="card__p">${esc(c.short)}</p>
    <span class="card__more">See the detail ${icon('arrow-right')}</span>
  </a>`
    )
    .join('')}
</div>`;
}

/* --------------------------------------------------------------- steps */

function stepsSection() {
  return `<div class="steps">
    ${D.steps
      .map(
        (s, i) => `<div class="step step--tint reveal reveal-d${i + 1}"
      style="--h:${ucHue(i, D.steps.length)}">
      <span class="step__ico">${icon(s.icon)}</span>
      <span class="step__n">${s.n}</span>
      <p class="step__time">${esc(s.time)}</p>
      <h3 class="step__t">${esc(s.title)}</h3>
      <p class="step__p">${esc(s.body)}</p>
    </div>`
      )
      .join('')}
  </div>`;
}

/* -------------------------------------------------------- testimonials */

function testimonials() {
  return `<div class="grid g3">
    ${D.testimonials
      .map(
        (t, i) => `<figure class="quote reveal reveal-d${i + 1}">
      <span class="quote__ico">${icon('quote')}</span>
      <blockquote class="quote__t">${esc(t.quote)}</blockquote>
      <figcaption class="quote__foot">
        <span class="quote__av" aria-hidden="true">${esc(t.name.replace(/^Dr\.\s*/, '').split(' ').map((w) => w[0]).join('').slice(0, 2))}</span>
        <span>
          <span class="quote__n">${esc(t.name)}</span>
          <span class="quote__r">${esc(t.role)}</span>
          ${t.verified ? `<span class="quote__v">${icon('check')} Named customer</span>` : ''}
        </span>
        <span class="quote__m">${esc(t.metric)}</span>
      </figcaption>
    </figure>`
      )
      .join('')}
  </div>`;
}

/* --------------------------------------------------------- integrations */

/**
 * The integrations wall lists EHR and practice management systems only — those are
 * the ones that matter, because they are what Casey reads availability from and
 * writes appointments back into. Phone systems used to get a card each, but eight
 * tiles all reading "inbound and outbound call routing" said nothing; they are now
 * a single line under the grid.
 */
function integrationsWall({ search = false, telephonyNote = true } = {}) {
  return `
${search
      ? `<div class="srch">${icon('search')}
    <input type="search" id="intgSearch" placeholder="Search ${D.integrations.length} integrations…"
      aria-label="Search integrations">
  </div>`
      : ''}
<div class="intg">
  ${D.integrations
    .map(
      (i) => `<div class="intg__c intg__c--tint reveal" style="--h:${hexHue(i.tint)}"
    data-intg="${esc(i.name + ' ' + i.category + ' ' + i.note)}">
    <img class="intg__logo" src="assets/img/logos/${i.logo}.webp" alt="${esc(i.name)} logo"
      width="300" height="100" loading="lazy" decoding="async">
    <p class="intg__n">${esc(i.name)}</p>
    <p class="intg__cat">${esc(i.category)}</p>
    <p class="intg__note">${esc(i.note)}</p>
  </div>`
    )
    .join('')}
</div>
${search ? `<p class="intg__none" id="intgEmpty" hidden>No match. We add integrations on request —
  <a href="${u('/contact.html')}">tell us what you use</a>.</p>` : ''}
${telephonyNote
      ? `<p class="intg__tel reveal">${icon('phone')} <span><strong>Your phone system already works.</strong>
  We forward your existing number, so Casey sits behind whatever you use today —
  ${D.telephony.slice(0, -1).join(', ')} and ${D.telephony.slice(-1)} included.</span></p>`
      : ''}`;
}

/* -------------------------------------------------------------- security */

function securityGrid(limit) {
  const list = limit ? D.securityItems.slice(0, limit) : D.securityItems;
  return `<div class="secg">
    ${list
      .map(
        (s, i) => `<div class="secc secc--tint reveal reveal-d${(i % 4) + 1}"
      style="--h:${ucHue(i, list.length)}">
      <span class="secc__ico">${icon(s.icon)}</span>
      <h3 class="secc__t">${esc(s.title)}</h3>
      <p class="secc__p">${esc(s.body)}</p>
    </div>`
      )
      .join('')}
  </div>`;
}

/* --------------------------------------------------------------- pricing */

function pricingCards() {
  return `<div class="price">
    ${D.pricing
      .map(
        (p, i) => `<div class="price__c${p.featured ? ' price__c--hot' : ''} reveal reveal-d${i + 1}">
      ${p.featured ? `<span class="price__tag">${esc(p.tag)}</span>` : ''}
      <div>
        <p class="price__sub">${esc(p.sub)}</p>
        <p class="price__n">${esc(p.name)}</p>
      </div>
      <p class="price__v">${esc(p.price)}${p.unit ? `<span class="price__u">${esc(p.unit)}</span>` : ''}</p>
      <p class="price__b">${esc(p.blurb)}</p>
      <ul class="price__f">
        ${p.features.map((f) => `<li class="tick">${icon('check')}<span>${esc(f)}</span></li>`).join('')}
      </ul>
      <a class="btn ${p.featured ? 'btn--primary' : 'btn--ghost'} btn--block"
         href="${u('/demo.html')}">${esc(p.cta)}</a>
    </div>`
      )
      .join('')}
  </div>`;
}

/* -------------------------------------------------------------- FAQ list */

function faqList(limit, { single = true } = {}) {
  const list = limit ? D.faqs.slice(0, limit) : D.faqs;
  return `<div class="faq"${single ? ' data-accordion-single' : ''}>
    ${list
      .map(
        (f, i) => `<details class="qa" id="q${i + 1}">
      <summary><span class="qa__cat">${esc(f.cat)}</span> <span>${esc(f.q)}</span>
        <span class="qa__ico">${icon('plus')}</span></summary>
      <div class="qa__a">${esc(f.a)}</div>
    </details>`
      )
      .join('')}
  </div>`;
}

/* ------------------------------------------------------- ROI calculator */

function roiCalculator({ compact = false } = {}) {
  return `<div class="roi" id="roi">
  <div class="roi__panel reveal">
    <div class="rng">
      <div class="rng__top"><label class="rng__lbl" for="roiCalls">Inbound patient calls a month</label>
        <span class="rng__val" id="outCalls">900</span></div>
      <input type="range" id="roiCalls" min="100" max="4000" step="50" value="900">
      <p class="rng__hint">Your phone system can usually export this in a couple of clicks.</p>
    </div>
    <div class="rng">
      <div class="rng__top"><label class="rng__lbl" for="roiMissed">Share going unanswered</label>
        <span class="rng__val" id="outMissed">22%</span></div>
      <input type="range" id="roiMissed" min="2" max="60" step="1" value="22">
      <p class="rng__hint">The industry average for a busy single-location practice sits near 20–25%.</p>
    </div>
    <div class="rng">
      <div class="rng__top"><label class="rng__lbl" for="roiValue">Value of one booked appointment</label>
        <span class="rng__val" id="outValue">$320</span></div>
      <input type="range" id="roiValue" min="60" max="1500" step="10" value="320">
      <p class="rng__hint">Use your average production per visit, not lifetime value.</p>
    </div>
    <div class="rng">
      <div class="rng__top"><label class="rng__lbl" for="roiFee">Your Vocryn plan</label>
        <span class="rng__val" id="outFee">$899</span></div>
      <input type="range" id="roiFee" min="399" max="2500" step="50" value="899">
      <p class="rng__hint">Starter from $399, Practice from $899.</p>
    </div>
  </div>

  <div class="roi__out reveal reveal-d2">
    <p class="roi__cap">Estimated net monthly gain</p>
    <p class="roi__big" id="outNet">$0</p>
    <p class="roi__note">After your subscription, from recovered calls alone.</p>
    <div class="roi__rows">
      <div class="roi__row"><span>Calls currently missed</span><b id="outMissedCount">0</b></div>
      <div class="roi__row"><span>Appointments recovered</span><b id="outRecovered">0</b></div>
      <div class="roi__row"><span>Recovered revenue</span><b id="outRevenue">$0</b></div>
      <div class="roi__row"><span>Staff time returned</span><b id="outHours">0 hrs</b></div>
      <div class="roi__row"><span>Return on spend</span><b id="outRoi">0%</b></div>
    </div>
    ${compact ? '' : `<p class="roi__disc">Estimates only, and deliberately conservative. Assumes
      about 30% of missed calls carry appointment intent, only half of those are permanently lost
      (the rest ring back), and Casey answers 94% of what currently goes unanswered. Staff time
      assumes Casey handles roughly 70% of call volume at about 3.5 minutes per call. Your results
      will differ — we will model your actual call data on the demo.</p>`}
  </div>
</div>`;
}

/* ------------------------------------------------- demo call player (real) */

const calls = require('./demo-calls.json');

const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

const bars = (peaks) =>
  peaks.map((p) => `<span class="player__bar" style="height:${p}%"></span>`).join('');

function demoPlayer() {
  return `<div class="player" id="player" data-player>
  <div class="player__tabs" role="tablist" aria-label="Choose a demo call">
    ${calls
      .map(
        (c, i) => `<button class="player__tab" role="tab" id="tab-${c.id}"
      aria-selected="${i === 0}" aria-controls="pane-${c.id}" data-call="${c.id}"
      tabindex="${i === 0 ? 0 : -1}">
      <span class="player__tabTag">${esc(c.tag)} · ${mmss(c.duration)}</span>
      <span>${esc(c.label)}</span>
    </button>`
      )
      .join('')}
  </div>

  <div class="player__body">
    ${calls
      .map(
        (c, i) => `<div class="player__pane" id="pane-${c.id}" role="tabpanel"
      aria-labelledby="tab-${c.id}" data-pane="${c.id}" data-src="${c.src}"
      data-duration="${c.duration}"${i === 0 ? '' : ' hidden'}>
      <p class="player__blurb">${esc(c.blurb)}</p>

      <div class="player__top">
        <button class="player__btn" data-play aria-label="Play the ${esc(c.label.toLowerCase())} call">
          <span class="player__spin" aria-hidden="true"></span>
          ${icon('play', 'icon-play')}${icon('pause', 'icon-pause')}
        </button>
        <div class="player__meta">
          <p class="player__title">${esc(c.label)}</p>
          <p class="player__sub">${icon('mic')} Casey’s real voice · unedited · ${c.cues.length} turns</p>
        </div>
      </div>

      <div class="player__seek" data-seek role="slider" tabindex="0"
           aria-label="Seek within the call" aria-valuemin="0"
           aria-valuemax="${Math.round(c.duration)}" aria-valuenow="0"
           aria-valuetext="0 seconds of ${Math.round(c.duration)}">
        <div class="player__wave" aria-hidden="true">${bars(c.peaks)}</div>
        <div class="player__wave player__wave--fill" data-fill aria-hidden="true">${bars(c.peaks)}</div>
        <span class="player__head" data-head aria-hidden="true"></span>
      </div>
      <div class="player__times">
        <span data-cur>0:00</span><span>${mmss(c.duration)}</span>
      </div>

      <div class="player__transcript" data-transcript>
        ${c.cues
          .map(
            (q) => `<button class="tline tline--${q.who === 'casey' ? 'c' : 'p'}"
          data-start="${q.start}" data-end="${q.end}">
          <span class="tline__who">${q.who === 'casey' ? 'Casey' : 'Caller'}</span>
          <span class="tline__txt">${esc(q.text)}</span>
        </button>`
          )
          .join('')}
      </div>

      <p class="player__outcome">${icon('check')} <span>${esc(c.outcome)}</span></p>
    </div>`
      )
      .join('')}
    <p class="player__err" data-err hidden>That audio could not load. The full transcript is above,
      and you can always <a href="${u('/demo.html')}">book a live demo</a> instead.</p>
  </div>
</div>`;
}

/* -------------------------------------------- capability explorer (tabbed) */

const CHANNEL_LABEL = { voice: 'Voice supported', sms: 'Texting supported' };

/**
 * Integration badge: a tinted monogram tile plus the product name.
 *
 * These are NOT the vendors' logos — we have no licence to reproduce Epic's or
 * athenahealth's marks, and inventing lookalikes would be worse than not trying.
 * Each gets a distinct tint so the row still reads as a set of different
 * products. Drop official SVGs into assets/img/logos/ and swap `lchip__mark` for
 * an <img> if you obtain permission; see the README.
 */
const logoChip = (i, cls = '') => `<span class="lchip${cls ? ' ' + cls : ''}">
  <span class="lchip__mark" style="--tint:${i.tint}" aria-hidden="true">${esc(i.mark)}</span>
  <span class="lchip__name">${esc(i.name)}</span>
</span>`;

/**
 * Vertical tab list of every capability, with a sample exchange, the channels it
 * works on, and — where a real recording exists — a button that jumps to the demo
 * player and plays it. No fake audio controls: the button only appears when there
 * is genuinely something to hear.
 */
function capabilityExplorer() {
  const rows = D.services.map((s) => ({ s, x: D.samples[s.slug] }));

  return `<div class="cap" data-cap>
  <div class="cap__tabs" role="tablist" aria-orientation="vertical"
       aria-label="What Casey handles">
    ${rows
      .map(
        ({ s }, i) => `<button class="cap__tab" role="tab" id="cap-t-${s.slug}"
      aria-controls="cap-p-${s.slug}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"
      data-cap-tab="${s.slug}">
      <span class="cap__tabIco">${icon(s.icon)}</span>
      <span class="cap__tabTxt">${esc(s.title)}</span>
      <span class="cap__tabGo" aria-hidden="true">${icon('chevron-right')}</span>
    </button>`
      )
      .join('')}
  </div>

  <div class="cap__stage">
    ${rows
      .map(
        ({ s, x }, i) => `<div class="cap__pane" role="tabpanel" id="cap-p-${s.slug}"
      aria-labelledby="cap-t-${s.slug}" data-cap-pane="${s.slug}"${i === 0 ? '' : ' hidden'}>

      <div class="cap__chat">
        <div class="cap__chips">
          ${x.channels
            .map((ch) => `<span class="cap__chip">${icon(ch === 'voice' ? 'mic' : 'message-square')}
            ${CHANNEL_LABEL[ch]}</span>`)
            .join('')}
        </div>
        <div class="cap__marks">
          ${D.integrations.slice(0, 4).map((n) => logoChip(n)).join('')}
        </div>

        <div class="cap__bubbles">
          ${x.turns
            .map(
              ([who, text]) => `<div class="cbub cbub--${who}">
            <span class="cbub__who">${who === 'casey' ? 'Casey' : 'Patient'}</span>
            <p>${esc(text)}</p>
          </div>`
            )
            .join('')}
        </div>

        <!-- The exchange only shows what was said. This shows what Casey actually
             did in the system afterwards, which is the part that matters and the
             part a transcript alone never proves. -->
        <div class="cap__trail">
          <p class="cap__trailTop">
            <span>${icon('workflow')} What Casey did</span>
            <span class="cap__meta">${esc(x.meta)}</span>
          </p>
          <ol class="cap__steps">
            ${x.actions
              .map(
                ([ic, text]) => `<li><span class="cap__stepIco">${icon(ic)}</span>
              <span>${esc(text)}</span></li>`
              )
              .join('')}
          </ol>
        </div>

        ${x.call
          ? `<button class="cap__play" data-cap-play="${x.call}">
          <span class="cap__playIco">${icon('play')}</span>
          <span><strong>Hear this call</strong><br>Real recording · plays below</span>
        </button>`
          : `<p class="cap__nocall">${icon(x.outbound ? 'bell' : 'message-square')}
          ${x.outbound ? 'Casey opens this one — outbound call and text.'
            : 'Handled on voice and in the same SMS thread.'}</p>`}
      </div>

      <div class="cap__info">
        <span class="cap__ico">${icon(s.icon)}</span>
        <h3 class="cap__h">${esc(s.title)}</h3>
        <p class="cap__p">${esc(s.lead)}</p>
        <div class="cap__stat"><b>${esc(s.stat.value)}</b><span>${esc(s.stat.label)}</span></div>
        <a class="btn btn--primary btn--sm" href="${u('/services.html')}#${s.slug}">
          Read more ${icon('arrow-right')}</a>
      </div>
    </div>`
      )
      .join('')}
  </div>
</div>`;
}

/* ------------------------------------------------------------- logo wall ---- */

/**
 * Two marquee rows of real vendor logos, split medical / dental, running in
 * opposite directions.
 *
 * These are the same logo files the production site serves, so they are assets the
 * client already uses rather than lookalikes we invented. The row is duplicated in
 * the DOM because a CSS marquee needs two identical halves to loop seamlessly;
 * `aria-hidden` on the copy keeps a screen reader from reading every name twice.
 */
function logoWall() {
  const row = (items, cls) => {
    // Four or five tiles is not enough to span a wide viewport, so each half of the
    // loop repeats the set until it comfortably overflows. The two halves must stay
    // identical for the -50% translate to loop without a jump.
    const reps = Math.max(2, Math.ceil(14 / items.length));
    const tile = (i, first) => `<li class="lw__item"${first ? '' : ' aria-hidden="true"'}>
      <img src="assets/img/logos/${i.logo}.webp" alt="${first ? esc(i.name) : ''}"
        width="300" height="100" loading="lazy" decoding="async"></li>`;
    // Name each product once for a screen reader; every repeat is decorative.
    const half = Array.from({ length: reps }, (_, r) => items.map((i) => tile(i, r === 0)).join('')).join('');
    const dup = half.replace(/alt="[^"]*"/g, 'alt=""')
      .replace(/<li class="lw__item">/g, '<li class="lw__item" aria-hidden="true">');
    return `<div class="lw__row ${cls}"><ul class="lw__track">${half}${dup}</ul></div>`;
  };

  const medical = D.integrations.filter((i) => i.category === 'Medical EHR');
  const dental = D.integrations.filter((i) => i.category === 'Dental PMS');

  return `<div class="lw">
  <div class="lw__stats">
    <span class="lw__stat"><b>${D.integrations.length}+</b> EHR platforms</span>
    <span class="lw__stat lw__stat--on"><b>Real-time</b> bi-directional sync</span>
    <span class="lw__stat"><b>Zero</b> manual data entry</span>
  </div>

  <p class="lw__cat">${icon('plus')} Medical EHR systems</p>
  ${row(medical, 'lw__row--fwd')}

  <p class="lw__cat">${icon('tooth')} Dental practice management</p>
  ${row(dental, 'lw__row--rev')}

  <p class="lw__note">${icon('sparkles')} <span>Don't see yours? Casey integrates with any EHR
    that exposes an API — most are live inside a week, and we will tell you straight if yours
    is not one of them.</span></p>
</div>`;
}

/* --------------------------------------------- EHR integration diagram ---- */

/**
 * Systems on the left, wired across to the Vocryn mark on the right.
 *
 * The connectors are one SVG with a fixed viewBox rather than CSS borders, so the
 * bends stay clean at any width. Hidden below 900px, where the diagram stacks and
 * horizontal wires would point nowhere.
 */
function ehrDiagram(names = D.integrations.slice(0, 4)) {
  const n = names.length;
  // The list uses equal-height rows, so row i's centre sits at a known fraction of
  // the column height. The SVG uses a 0-100 box stretched to the same height
  // (preserveAspectRatio="none"), which makes those fractions line up exactly —
  // an earlier version hard-coded pixel positions and the wires ended in mid-air.
  // non-scaling-stroke keeps the line weight and dash pattern undistorted.
  // Alternate lines run inward and outward at once, because that is literally what
  // the section claims — data read from the EHR and written back to it. Staggered
  // delays stop the four reading as one synchronised bar.
  const wires = names
    .map((_, i) => {
      const y = ((i + 0.5) / n) * 100;
      const bend = i === 0 || i === n - 1 ? 46 : 68; // stagger so lines read apart
      const dir = i % 2 ? ' is-out' : '';
      const delay = (i * 0.38).toFixed(2);
      return `<path class="ehr__wire${dir}" style="animation-delay:${delay}s"
        d="M0 ${y.toFixed(2)} H${bend} V50 H100" vector-effect="non-scaling-stroke"/>`;
    })
    .join('');

  return `<div class="ehr">
  <ul class="ehr__list">
    ${names
      .map(
        (n) => `<li class="ehr__item">
      <span class="ehr__mark" style="--tint:${n.tint}" aria-hidden="true">${esc(n.mark)}</span>
      <span class="ehr__name">${esc(n.name)}</span>
    </li>`
      )
      .join('')}
  </ul>

  <svg class="ehr__wires" viewBox="0 0 100 100" fill="none" aria-hidden="true"
       preserveAspectRatio="none">
    <g stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
       stroke-dasharray="2 9">${wires}</g>
  </svg>

  <div class="ehr__hub">
    <span class="ehr__hubRing" aria-hidden="true"></span>
    <img class="ehr__hubMark" src="assets/img/logo-mark.webp" width="440" height="213"
         alt="Vocryn AI" loading="lazy" decoding="async">
  </div>
</div>`;
}

/* --------------------------------------------------------- languages strip */

const LANGUAGES = [
  ['English', 'EN'], ['Spanish', 'ES'], ['Mandarin', 'ZH'], ['Vietnamese', 'VI'],
  ['Tagalog', 'TL'], ['Arabic', 'AR'], ['Russian', 'RU'], ['Portuguese', 'PT'],
  ['French', 'FR'], ['Korean', 'KO'], ['Haitian Creole', 'HT'], ['Hindi', 'HI'],
  ['Bengali', 'BN'], ['Urdu', 'UR'], ['Polish', 'PL'], ['Italian', 'IT'],
  ['German', 'DE'], ['Japanese', 'JA'], ['Somali', 'SO'], ['Nepali', 'NE'],
  ['Ukrainian', 'UK'], ['Farsi', 'FA'],
];

const languagesStrip = () => `<div class="langs">
  ${LANGUAGES.map(([n, c]) => `<span class="lang"><b>${c}</b> ${esc(n)}</span>`).join('')}
</div>`;

/* --------------------------------------------------------------- CTA band */

const ctaSplit = () => `
<section class="sec sec--tight">
  <div class="wrap">
    <div class="deep__panel reveal" style="text-align:center;max-width:44rem;margin-inline:auto">
      <p class="eyebrow">${icon('headset')} 20-minute demo</p>
      <h2 class="h3" style="margin:1rem 0 .75rem">See Casey answer a call using your scheduling rules.</h2>
      <p class="lead" style="font-size:var(--t-sm)">No slide deck. We dial in, you listen, and you
        ask it the awkward questions your patients would.</p>
      <div class="btnrow" style="justify-content:center;margin-top:1.5rem">
        <a class="btn btn--primary" href="${u('/demo.html')}">Book a Demo ${icon('arrow-right')}</a>
        <a class="btn btn--ghost" href="${u('/roi-calculator.html')}">${icon('sliders')} Run the numbers</a>
      </div>
    </div>
  </div>
</section>`;

module.exports = {
  crumbs, phero, shead, ticks, marquee, statBand, serviceCards, useCaseCards,
  stepsSection, testimonials, integrationsWall, securityGrid, pricingCards,
  faqList, roiCalculator, ctaSplit, demoPlayer, languagesStrip, calls, LANGUAGES,
  ehrDiagram, logoChip, ucHue, hexHue, logoWall,
  capabilityExplorer,
};
