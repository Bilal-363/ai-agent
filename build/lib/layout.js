'use strict';

const { icon } = require('./icons');
const D = require('./data');
const { site, nav, footerNav, legalNav } = D;

/** Root-relative -> page-relative, so the site works from file:// and any subfolder. */
const u = (href) => (href && href.startsWith('/') ? href.slice(1) : href || '#');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const YEAR = 2026;

/* --------------------------------------------------------------------- brand */

/* ------------------------------------------------------------- brand mark */

// A lemniscate — the continuous "always answering" loop — carrying a voice
// waveform inside the ribbon. Drawn as SVG rather than shipping the raster
// original so it stays sharp, themes with the palette, and needs no background.
/**
 * The mark is a rendered 3D image, not the generated SVG below.
 *
 * Three SVG iterations were tried and all read as flat next to the supplied
 * artwork — a glossy twisted ribbon with a waveform printed on its surface is
 * shading and specular work, which is what a renderer does and a flat vector
 * does not. So the ribbon is now a real render, cut out to transparency.
 *
 * Cost of that choice, accepted deliberately: it no longer recolours with the
 * theme, so changing the palette means re-rendering the mark. It is 23 KB and
 * exported at 440px — over 7x the 56px it displays at, so it stays sharp on any
 * display. Source and the crop box live in build/logo-src/.
 */
const logoMark = () => `<img class="logo__svg" src="assets/img/logo-mark.webp"
  width="440" height="213" alt="" aria-hidden="true" decoding="async">`;

const logo = (cls = '') => {
  return `
<a class="logo${cls ? ' ' + cls : ''}" href="${u('/index.html')}" aria-label="${site.name} — home">
  <span class="logo__mark">${logoMark()}</span>
  <span class="logo__text">Vocryn <span class="logo__ai">Ai</span></span>
</a>`;
};

/* ----------------------------------------------------------------- mega menu */

function megaPanel(key, cfg, { grouped = false } = {}) {
  const items = cfg.items;

  const link = (i) => `<li><a class="mega__item" href="${u(cfg.href)}#${i.slug}">
    <span class="mega__ico">${icon(i.icon)}</span>
    <span class="mega__body"><span class="mega__title">${esc(i.title)}</span>
    <span class="mega__desc">${esc(i.short)}</span></span></a></li>`;

  // The panel grid must always have exactly two children — the group wrapper and
  // the promo — otherwise extra groups wrap into the promo column.
  let body;
  if (grouped) {
    const groups = [...new Set(items.map((i) => i.group))];
    body = `<div class="mega__groups mega__groups--split">
      ${groups
        .map(
          (g) => `<div class="mega__group">
        <p class="mega__grouptitle">${esc(g)}</p>
        <ul class="mega__list">${items.filter((i) => i.group === g).map(link).join('')}</ul>
      </div>`
        )
        .join('')}
    </div>`;
  } else {
    body = `<div class="mega__groups">
      <div class="mega__group">
        <ul class="mega__list mega__list--2col">${items.map(link).join('')}</ul>
      </div>
    </div>`;
  }

  return `<div class="mega" id="mega-${key}" role="region" aria-label="${esc(cfg.label)}">
  <div class="mega__inner">
    ${body}
    <div class="mega__promo">
      <span class="mega__promoIco">${icon(key === 'services' ? 'mic' : 'sliders')}</span>
      <p class="mega__promoTitle">${esc(cfg.promo.title)}</p>
      <p class="mega__promoBody">${esc(cfg.promo.body)}</p>
      <a class="mega__promoCta" href="${u(cfg.promo.href)}">${esc(cfg.promo.cta)} ${icon('arrow-right')}</a>
    </div>
  </div>
  <div class="mega__foot">
    <a href="${u(cfg.href)}">View all ${items.length} ${cfg.label.toLowerCase()} ${icon('arrow-right')}</a>
    <span class="mega__footNote">${icon('check')} Live in 10 business days</span>
  </div>
</div>`;
}

function navTrigger(key, cfg, active) {
  const isActive = active === key;
  return `<li class="nav__item has-mega" data-mega="${key}">
  <a class="nav__link nav__link--trigger${isActive ? ' is-active' : ''}" href="${u(cfg.href)}"
     aria-expanded="false" aria-controls="mega-${key}"${isActive ? ' aria-current="page"' : ''}>
    ${esc(cfg.label)} ${icon('chevron-down', 'nav__chev')}
  </a>
  ${megaPanel(key, cfg, { grouped: key === 'useCases' })}
</li>`;
}

/* -------------------------------------------------------------- mobile drawer */

function drawerAccordion(key, cfg) {
  return `<div class="drawer__acc">
  <button class="drawer__accBtn" aria-expanded="false" aria-controls="dr-${key}">
    ${esc(cfg.label)} <span class="drawer__accCount">${cfg.items.length}</span> ${icon('chevron-down')}
  </button>
  <div class="drawer__accPanel" id="dr-${key}" hidden>
    ${cfg.items
      .map(
        (i) => `<a class="drawer__sub" href="${u(cfg.href)}#${i.slug}">
      ${icon(i.icon)} <span>${esc(i.title)}</span></a>`
      )
      .join('')}
    <a class="drawer__all" href="${u(cfg.href)}">View all ${esc(cfg.label.toLowerCase())} ${icon('arrow-right')}</a>
  </div>
</div>`;
}

/* -------------------------------------------------------------------- header */

function header(active) {
  return `
<a class="skip" href="#main">Skip to main content</a>

<div class="announce" id="announce" hidden>
  <div class="wrap announce__in">
    <p>${icon('sparkles')} <strong>New:</strong> Casey now creates patient charts over the phone.
      <a href="${u('/services.html')}#new-patient-intake">See how</a></p>
    <button class="announce__x" id="announceClose" aria-label="Dismiss announcement">${icon('x')}</button>
  </div>
</div>

<header class="hdr" id="hdr">
  <div class="wrap hdr__in">
    ${logo()}
    <nav class="nav" aria-label="Main">
      <ul class="nav__list">
        ${navTrigger('services', nav.services, active)}
        ${navTrigger('useCases', nav.useCases, active)}
        ${nav.simple
          .map(
            (l) =>
              `<li class="nav__item"><a class="nav__link${active === l.href ? ' is-active' : ''}" href="${u(l.href)}"${
                active === l.href ? ' aria-current="page"' : ''
              }>${esc(l.label)}</a></li>`
          )
          .join('')}
      </ul>
    </nav>
    <div class="hdr__act">
      <button class="iconbtn js-theme" aria-label="Switch to dark theme" title="Switch theme">
        ${icon('sun', 'ico-sun')}${icon('moon', 'ico-moon')}
      </button>
      <a class="hdr__tel" href="tel:${site.phoneHref}">${icon('phone')} <span>${site.phone}</span></a>
      <a class="btn btn--ghost btn--sm hdr__contact" href="${u('/contact.html')}">Contact us</a>
      <a class="btn btn--primary btn--sm" href="${u('/demo.html')}">Book a Demo</a>
      <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">
        ${icon('menu', 'ico-menu')}${icon('x', 'ico-close')}
      </button>
    </div>
  </div>
  <div class="hdr__prog" id="prog" aria-hidden="true"></div>
</header>

<div class="drawer" id="drawer" hidden>
  <div class="drawer__in">
    ${drawerAccordion('services', nav.services)}
    ${drawerAccordion('useCases', nav.useCases)}
    ${nav.simple.map((l) => `<a class="drawer__link" href="${u(l.href)}">${esc(l.label)}</a>`).join('')}
    <a class="drawer__link" href="${u('/security.html')}">Security</a>
    <a class="drawer__link" href="${u('/roi-calculator.html')}">ROI calculator</a>
    <a class="drawer__link" href="${u('/faq.html')}">FAQ</a>
    <a class="drawer__link" href="${u('/about.html')}">About</a>
    <a class="drawer__link" href="${u('/blog.html')}">Blog</a>
    <a class="drawer__link" href="${u('/contact.html')}">Contact</a>
    <div class="drawer__cta">
      <a class="btn btn--primary btn--block" href="${u('/demo.html')}">Book a Demo</a>
      <a class="btn btn--ghost btn--block" href="${u('/contact.html')}">Contact us</a>
      <a class="btn btn--ghost btn--block" href="tel:${site.phoneHref}">${icon('phone')} ${site.phone}</a>
      <button class="btn btn--outline btn--block js-theme" aria-label="Switch theme">
        ${icon('sun', 'ico-sun')}${icon('moon', 'ico-moon')} <span class="js-theme-label">Dark mode</span>
      </button>
    </div>
  </div>
</div>
<div class="scrim" id="scrim" hidden></div>`;
}

/* -------------------------------------------------------------------- footer */

function footer() {
  const soc = [
    ['tiktok', site.social.tiktok, 'TikTok'],
    ['youtube', site.social.youtube, 'YouTube'],
    ['twitter', site.social.twitter, 'X'],
    ['linkedin', site.social.linkedin, 'LinkedIn'],
  ];
  return `
<section class="cta">
  <div class="wrap cta__in reveal">
    <p class="eyebrow eyebrow--light">${icon('zap')} Live in 10 business days</p>
    <h2 class="cta__h">Your next patient is calling right now.</h2>
    <p class="cta__p">See Casey answer, book, and document a real call in a 20-minute demo — using your
      scheduling rules, not a canned script.</p>
    <div class="cta__btns">
      <a class="btn btn--accent btn--lg" href="${u('/demo.html')}">Book a Demo ${icon('arrow-right')}</a>
      <a class="btn btn--outline-light btn--lg" href="tel:${site.phoneHref}">${icon('phone')} ${site.phone}</a>
    </div>
    <ul class="cta__marks">
      <li>${icon('check')} No change to your phone number</li>
      <li>${icon('check')} Month to month</li>
      <li>${icon('check')} BAA signed before go-live</li>
    </ul>
  </div>
</section>

<footer class="ft">
  <div class="wrap">
    <div class="ft__top">
      <div class="ft__brand">
        ${logo('logo--ft')}
        <p class="ft__blurb">Casey is the HIPAA-ready AI receptionist for dental and primary care
          clinics. Every patient heard. Every appointment booked.</p>
        <ul class="ft__contact">
          <li><a href="tel:${site.phoneHref}">${icon('phone')} ${site.phone}</a></li>
          <li><a href="mailto:${site.email}">${icon('mail')} ${site.email}</a></li>
          <li>${icon('map-pin')} <span>United States · Remote-first</span></li>
        </ul>
        <ul class="ft__soc">
          ${soc
            .map(
              ([k, href, label]) =>
                `<li><a href="${href}" aria-label="${label}" rel="noopener" target="_blank">${icon(k)}</a></li>`
            )
            .join('')}
        </ul>
      </div>
      <div class="ft__cols">
        ${footerNav
          .map(
            (c) => `<nav class="ft__col" aria-label="${esc(c.title)}">
          <h3 class="ft__ch">${esc(c.title)}</h3>
          <ul>${c.links.map((l) => `<li><a href="${u(l.href)}">${esc(l.label)}</a></li>`).join('')}</ul>
        </nav>`
          )
          .join('')}
      </div>
    </div>

    <div class="ft__badges">
      ${D.trustBadges.map((b) => `<span class="chip chip--ft">${icon(b.icon)} ${esc(b.label)}</span>`).join('')}
    </div>

    <div class="ft__bot">
      <p>© ${YEAR} ${esc(site.legalName)} All rights reserved.</p>
      <ul class="ft__legal">
        ${legalNav.map((l) => `<li><a href="${u(l.href)}">${esc(l.label)}</a></li>`).join('')}
      </ul>
    </div>
    <p class="ft__disc">Vocryn AI provides administrative call automation software. Casey does not
      provide medical advice, diagnosis, treatment, or prescriptions, and is not a telehealth
      provider, pharmacy, or medical device. HIPAA does not offer a certification programme; we
      operate under a signed Business Associate Agreement and build to HIPAA and SOC 2 Type II
      criteria. Metrics shown reflect aggregate and illustrative results from participating
      practices and are not a guarantee of outcomes.</p>
  </div>
</footer>

<button class="totop" id="totop" aria-label="Back to top" hidden>${icon('arrow-up')}</button>

<div class="mcta" id="mcta">
  <a class="btn btn--ghost btn--sm mcta__tel" href="tel:${site.phoneHref}"
     aria-label="Call ${site.phone}">${icon('phone')}</a>
  <a class="btn btn--primary btn--sm" href="${u('/demo.html')}">Book a Demo</a>
  <a class="btn btn--outline btn--sm" href="${u('/roi-calculator.html')}">${icon('sliders')} ROI</a>
</div>`;
}

/* ---------------------------------------------------------------------- page */

function page(o) {
  const {
    slug, title, desc, active = '', body, schema = [], bodyClass = '', og = 'og-image.jpg',
  } = o;
  const canonical = `${site.url}/${slug === 'index' ? '' : slug + '.html'}`;
  const fullTitle = slug === 'index' ? `${title}` : `${title} | ${site.name}`;

  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#3A49CE" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#070B1C" media="(prefers-color-scheme: dark)">
<meta name="robots" content="index,follow,max-image-preview:large">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.url}/assets/img/${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@Vocrynai">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${site.url}/assets/img/${og}">

<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="manifest" href="manifest.webmanifest">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="assets/css/styles.css">
<script>
  // Set theme before first paint to avoid a flash of the wrong theme.
  try {
    var t = localStorage.getItem('vocryn-theme');
    if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
  } catch (e) {}
</script>
${schema.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${header(active)}
<main id="main">
${body}
</main>
${footer()}
<script src="assets/js/main.js" defer></script>
</body>
</html>`;
}

module.exports = { page, header, footer, logo, u, esc, icon, YEAR };
