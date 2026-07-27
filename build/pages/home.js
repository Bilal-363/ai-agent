'use strict';

const { icon } = require('../lib/icons');
const { u, esc } = require('../lib/layout');
const C = require('../lib/components');
const D = require('../lib/data');
const { site } = D;

const body = `
<section class="hero">
  <div class="wrap hero__grid">
    <div>
      <p class="hero__live"><span class="hero__dot"></span> Casey is answering calls right now</p>
      <p class="eyebrow">${icon('shield-check')} HIPAA-ready · BAA included</p>
      <h1 class="hero__h">Your clinic's AI receptionist. <span class="grad">Every patient heard.</span></h1>
      <p class="lead hero__p">Casey answers in under two seconds, books straight into your EHR, verifies
        insurance, and hands anything urgent to a real person. Nights, weekends, and the Monday-morning
        rush included.</p>
      <div class="btnrow hero__btns">
        <a class="btn btn--primary btn--lg" href="${u('/demo.html')}">Book a Demo ${icon('arrow-right')}</a>
        <a class="btn btn--ghost btn--lg" href="#demo">${icon('play')} Hear a real call</a>
      </div>
      <p class="hero__note">${icon('check')} Live in 10 business days ${icon('check')} Keep your phone number
        ${icon('check')} Month to month</p>

      <div class="hero__stats">
        ${D.heroStats
          .map(
            (s) => `<div class="hero__stat">
          <b data-count="${s.value}" data-dec="${s.format === 'dec' ? 1 : 0}" data-suf="${s.suffix}">0${s.suffix}</b>
          <span>${esc(s.label)}</span>
        </div>`
          )
          .join('')}
      </div>
    </div>

    <div class="hero__art reveal reveal-d2">
      <img class="hero__img" src="assets/img/reception.webp"
           srcset="assets/img/reception-sm.webp 700w, assets/img/reception.webp 1200w"
           sizes="(max-width: 1024px) 90vw, 46vw"
           width="1200" height="800" alt="A bright, calm dental and primary care clinic reception area">
      <div class="hero__badge hero__badge--tl">
        <span class="hero__badgeIco">${icon('phone')}</span>
        <span>Answered in <b>1.4s</b></span>
      </div>
      <div class="hero__badge hero__badge--br">
        <span class="hero__badgeIco">${icon('calendar-check')}</span>
        <span>Booked to <b>Dentrix</b></span>
      </div>
    </div>
  </div>
</section>

${C.marquee()}

<section class="sec">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'The problem',
      eyebrowIcon: 'phone-missed',
      h: 'The phone is where practices quietly lose money.',
      lead: 'Not through bad service — through arithmetic. Call demand peaks exactly when your front desk is busiest, and nobody can be in two places at once.',
    })}
    <div class="prob">
      <div class="prob__c reveal">
        <p class="prob__n">67%</p>
        <h3 class="prob__t">Hang up and don't come back</h3>
        <p class="prob__p">Two thirds of callers abandon after two minutes on hold. They don't leave a
          voicemail — they call the practice down the road, and that practice answers.</p>
      </div>
      <div class="prob__c reveal reveal-d1">
        <p class="prob__n">38%</p>
        <h3 class="prob__t">Of demand is outside your hours</h3>
        <p class="prob__p">Evenings, weekends, and lunch breaks. No amount of staff discipline covers a
          window when the lights are off.</p>
      </div>
      <div class="prob__c reveal reveal-d2">
        <p class="prob__n">2 hrs</p>
        <h3 class="prob__t">Lost per person, per day</h3>
        <p class="prob__p">Routine calls — refills, reschedules, directions — eat the time your team
          should be spending on the patient standing at the desk.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec sec--alt" id="demo">
  <div class="wrap split">
    <div class="casey__art reveal">
      <img class="casey__img" src="assets/img/casey.webp"
           srcset="assets/img/casey-sm.webp 380w, assets/img/casey.webp 760w"
           sizes="(max-width: 1024px) 80vw, 26vw"
           width="760" height="760" loading="lazy"
           alt="Casey, the Vocryn AI receptionist, represented by a warm professional portrait">
      <span class="casey__tag"><span class="hero__dot"></span> Casey · on a call</span>
    </div>

    <div>
      <p class="eyebrow">${icon('mic')} Hear Casey speak</p>
      <h2 class="h2" style="margin:1.1rem 0 .95rem">Warm, clinic-trained, and never flustered.</h2>
      <p class="lead">Casey isn't a phone tree with a nicer voice. Press play on any of these three
        calls — booking, a refill, and a caller who just wants a human — and listen to how it
        actually handles them.</p>
      <p style="margin-top:1rem;font-size:var(--t-sm);color:var(--ink-3)">Casey identifies itself as
        an assistant on every call. Patients who ask for a person get one immediately, as the third
        call shows.</p>

      ${C.demoPlayer()}
    </div>
  </div>
</section>

<section class="sec sec--tight">
  <div class="wrap">
    ${C.shead({
      eyebrow: '20+ languages',
      eyebrowIcon: 'languages',
      h: 'Casey answers in the patient’s language.',
      lead: 'Detected automatically on the call. No separate line, no interpreter queue, no asking a patient to call back with a family member.',
    })}
    ${C.languagesStrip()}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'Services',
      eyebrowIcon: 'sparkles',
      h: 'Everything a great front desk does — on every call.',
      lead: 'Ten jobs Casey handles end to end. Hover any card, or open the Services menu above to see them all at once.',
    })}
    ${C.serviceCards()}
    <div class="btnrow" style="justify-content:center;margin-top:2.5rem">
      <a class="btn btn--ghost" href="${u('/services.html')}">Explore all services in detail ${icon('arrow-right')}</a>
    </div>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'How it works',
      eyebrowIcon: 'workflow',
      h: 'Live in ten business days. About two hours of your time.',
      lead: 'We do the configuration. You review the conversation flows and sign off before a single patient hears Casey.',
    })}
    ${C.stepsSection()}
    <div class="btnrow" style="justify-content:center;margin-top:2.5rem">
      <a class="btn btn--ghost" href="${u('/how-it-works.html')}">See the full onboarding process ${icon('arrow-right')}</a>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'Use cases',
      eyebrowIcon: 'target',
      h: 'Built for the way your practice actually runs.',
      lead: 'Filter by practice type or by the problem you are trying to solve.',
    })}
    ${C.useCaseCards()}
  </div>
</section>

${C.statBand({
  title: 'What changes in the first month',
  lead: 'Aggregate results across participating dental and primary care practices.',
})}

<section class="sec">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'Results',
      eyebrowIcon: 'star',
      h: 'Practice managers stopped apologising to the phone.',
    })}
    ${C.testimonials()}
    <div class="btnrow" style="justify-content:center;margin-top:2.5rem">
      <a class="btn btn--ghost" href="${u('/results.html')}">Read the full case studies ${icon('arrow-right')}</a>
    </div>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'Integrations',
      eyebrowIcon: 'database',
      h: 'It writes into your system, not a spreadsheet.',
      lead: 'A booking is only real when it lands in your schedule. Casey has two-way access to the software your team already lives in.',
    })}
    ${C.integrationsWall()}
    <div class="btnrow" style="justify-content:center;margin-top:2.5rem">
      <a class="btn btn--ghost" href="${u('/integrations.html')}">See all integrations ${icon('arrow-right')}</a>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'Security & compliance',
      eyebrowIcon: 'shield-check',
      h: 'Boring where it counts.',
      lead: 'HIPAA has no certification programme, so here are the specifics instead of a badge.',
    })}
    ${C.securityGrid(4)}
    <div class="btnrow" style="justify-content:center;margin-top:2.5rem">
      <a class="btn btn--ghost" href="${u('/security.html')}">Read our full security posture ${icon('arrow-right')}</a>
    </div>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'ROI calculator',
      eyebrowIcon: 'sliders',
      h: 'Work out what your missed calls are costing.',
      lead: 'Four sliders, honest assumptions, no email required.',
    })}
    ${C.roiCalculator({ compact: true })}
    <div class="btnrow" style="justify-content:center;margin-top:2.5rem">
      <a class="btn btn--ghost" href="${u('/roi-calculator.html')}">Open the full calculator ${icon('arrow-right')}</a>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${C.shead({
      eyebrow: 'Pricing',
      eyebrowIcon: 'dollar-sign',
      h: 'One fixed monthly cost. No per-minute surprises.',
      lead: 'Zero turnover, zero retraining, zero sick days — priced by call volume, not headcount.',
    })}
    ${C.pricingCards()}
    <div class="btnrow" style="justify-content:center;margin-top:2.5rem">
      <a class="btn btn--ghost" href="${u('/pricing.html')}">Compare plans in full ${icon('arrow-right')}</a>
    </div>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    ${C.shead({ eyebrow: 'FAQ', eyebrowIcon: 'book-open', h: 'The questions practices actually ask.' })}
    ${C.faqList(8)}
    <div class="btnrow" style="justify-content:center;margin-top:2.5rem">
      <a class="btn btn--ghost" href="${u('/faq.html')}">All ${D.faqs.length} questions ${icon('arrow-right')}</a>
    </div>
  </div>
</section>`;

module.exports = {
  slug: 'index',
  title: 'Vocryn AI — HIPAA-Ready AI Receptionist for Dental & Primary Care Clinics',
  desc: 'Casey answers every patient call in under two seconds and books straight into your EHR. HIPAA-ready AI receptionist, live in 10 business days.',
  body,
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      logo: `${site.url}/favicon.svg`,
      description: 'HIPAA-ready AI voice receptionist for dental and primary care clinics.',
      telephone: site.phone,
      email: site.email,
      foundingDate: site.founded,
      address: { '@type': 'PostalAddress', addressCountry: 'US' },
      sameAs: Object.values(site.social),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Casey by Vocryn AI',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'Healthcare Call Automation',
      operatingSystem: 'Cloud',
      url: site.url,
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: '399',
        highPrice: '2500',
        offerCount: '3',
      },
      featureList: D.services.map((s) => s.title),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: D.faqs.slice(0, 8).map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};
