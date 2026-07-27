/* ==========================================================================
   Vocryn AI — behaviour. No dependencies.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------ 1. Theme */

  // Two toggles exist: one in the header, one in the mobile drawer (the header
  // one is hidden on narrow screens where there is no room for it).
  const themeBtns = $$('.js-theme');
  const setTheme = (t) => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('vocryn-theme', t); } catch (e) {}
    const next = t === 'dark' ? 'light' : 'dark';
    themeBtns.forEach((b) => {
      b.setAttribute('aria-label', `Switch to ${next} theme`);
      if (b.title) b.title = `Switch to ${next} theme`;
      const lbl = $('.js-theme-label', b);
      if (lbl) lbl.textContent = next === 'dark' ? 'Dark mode' : 'Light mode';
    });
  };
  setTheme(document.documentElement.dataset.theme || 'light');
  themeBtns.forEach((b) =>
    b.addEventListener('click', () =>
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')
    )
  );

  /* -------------------------------------------------- 2. Hover mega-menus */

  const OPEN_DELAY = 110;   // stops accidental flashes when sweeping the nav
  const CLOSE_GRACE = 220;  // lets the pointer cross the gap to the panel

  const megas = $$('.has-mega');
  let openTimer = null, closeTimer = null;

  function closeAll(except) {
    megas.forEach((m) => {
      if (m === except) return;
      m.classList.remove('is-open');
      const t = $('.nav__link--trigger', m);
      t && t.setAttribute('aria-expanded', 'false');
    });
  }

  function open(item) {
    clearTimeout(closeTimer);
    closeAll(item);
    item.classList.add('is-open');
    const t = $('.nav__link--trigger', item);
    t && t.setAttribute('aria-expanded', 'true');
  }

  function close(item) {
    item.classList.remove('is-open');
    const t = $('.nav__link--trigger', item);
    t && t.setAttribute('aria-expanded', 'false');
  }

  megas.forEach((item) => {
    const trigger = $('.nav__link--trigger', item);

    // Pointer: hover with delay in, grace period out.
    item.addEventListener('mouseenter', () => {
      if (!finePointer()) return;
      clearTimeout(closeTimer);
      clearTimeout(openTimer);
      openTimer = setTimeout(() => open(item), OPEN_DELAY);
    });
    item.addEventListener('mouseleave', () => {
      if (!finePointer()) return;
      clearTimeout(openTimer);
      closeTimer = setTimeout(() => close(item), CLOSE_GRACE);
    });

    // Touch / coarse pointer: first tap opens instead of navigating.
    trigger && trigger.addEventListener('click', (e) => {
      if (finePointer()) return;
      if (!item.classList.contains('is-open')) {
        e.preventDefault();
        open(item);
      }
    });

    // Keyboard: focus opens, arrows walk the list, Escape returns focus.
    trigger && trigger.addEventListener('focus', () => open(item));
    trigger && trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        open(item);
        const first = $('.mega__item', item);
        first && first.focus();
      }
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        close(item);
        trigger && trigger.focus();
        return;
      }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const links = $$('.mega__item, .mega__promoCta', item);
      const i = links.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      const next = e.key === 'ArrowDown' ? i + 1 : i - 1;
      if (next < 0) { trigger && trigger.focus(); return; }
      links[Math.min(next, links.length - 1)].focus();
    });

    // Leaving the whole item by keyboard closes it.
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) close(item);
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-mega')) closeAll();
  });

  /* --------------------------------------------------------- 3. Drawer */

  const burger = $('#burger'), drawer = $('#drawer'), scrim = $('#scrim');
  let lastFocus = null;

  // The announcement bar makes the header a variable height, so the drawer is
  // anchored to whatever the header's real bottom edge is rather than a guess.
  function positionDrawer() {
    if (!drawer || drawer.hidden) return;
    const h = $('#hdr');
    drawer.style.top = (h ? Math.max(0, Math.round(h.getBoundingClientRect().bottom)) : 0) + 'px';
  }

  function setDrawer(on) {
    if (!drawer) return;
    burger.setAttribute('aria-expanded', String(on));
    drawer.hidden = !on;
    scrim.hidden = !on;
    document.body.style.overflow = on ? 'hidden' : '';
    if (on) positionDrawer();
    if (on) {
      lastFocus = document.activeElement;
      const f = $('.drawer__accBtn, .drawer__link', drawer);
      f && f.focus();
    } else if (lastFocus) {
      lastFocus.focus();
    }
  }

  burger && burger.addEventListener('click', () =>
    setDrawer(burger.getAttribute('aria-expanded') !== 'true')
  );
  scrim && scrim.addEventListener('click', () => setDrawer(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && !drawer.hidden) setDrawer(false);
  });
  addEventListener('resize', positionDrawer);

  // Focus trap inside the drawer.
  drawer && drawer.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = $$('a[href], button:not([disabled])', drawer).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Drawer accordions.
  $$('.drawer__accBtn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!on));
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.hidden = on;
    });
  });

  // Close the drawer when navigating to an in-page anchor.
  $$('.drawer a[href*="#"]').forEach((a) => a.addEventListener('click', () => setDrawer(false)));

  /* ------------------------------------------ 4. Header state + progress */

  const hdr = $('#hdr'), prog = $('#prog'), totop = $('#totop');
  let raf = false;

  function onScroll() {
    const y = scrollY;
    hdr && hdr.classList.toggle('is-stuck', y > 8);
    if (prog) {
      const h = document.documentElement.scrollHeight - innerHeight;
      prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (totop) totop.hidden = y < 700;
    raf = false;
  }
  addEventListener('scroll', () => {
    if (!raf) { raf = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  totop && totop.addEventListener('click', () =>
    scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  );

  /* ------------------------------------------------ 5. Announcement bar */

  const announce = $('#announce');
  if (announce) {
    let dismissed = false;
    try { dismissed = localStorage.getItem('vocryn-announce') === 'off'; } catch (e) {}
    announce.hidden = dismissed;
    $('#announceClose').addEventListener('click', () => {
      announce.hidden = true;
      try { localStorage.setItem('vocryn-announce', 'off'); } catch (e) {}
    });
  }

  /* ------------------------------------------------- 6. Scroll reveals */

  const revealables = $$('.reveal');
  if (revealables.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealables.forEach((el) => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
      revealables.forEach((el) => io.observe(el));
    }
  }

  /* --------------------------------------------------- 7. Count-up stats */

  const fmt = (n, dec) =>
    dec ? n.toFixed(1) : Math.round(n).toLocaleString('en-US');

  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const dec = el.dataset.dec === '1';
    const pre = el.dataset.pre || '';
    const suf = el.dataset.suf || '';
    if (reduced) { el.textContent = pre + fmt(target, dec) + suf; return; }
    const dur = 1500, t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(target * eased, dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  const counters = $$('[data-count]');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) counters.forEach(countUp);
    else {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach((el) => cio.observe(el));
    }
  }

  /* ---------------------------------------------- 8. Demo audio player */

  const player = $('#player');
  if (player) {
    const btn = $('.player__btn', player);
    const wave = $('.player__wave', player);
    // Build the bars once, with pseudo-random but stable heights.
    const BARS = 56;
    for (let i = 0; i < BARS; i++) {
      const b = document.createElement('span');
      b.className = 'player__bar';
      const h = 18 + Math.abs(Math.sin(i * 1.7) * 62) + (i % 5) * 3;
      b.style.height = Math.min(h, 100) + '%';
      b.style.animationDelay = (i % 14) * 0.055 + 's';
      wave.appendChild(b);
    }
    const audio = $('#demoAudio');
    btn.addEventListener('click', () => {
      const playing = player.classList.toggle('is-playing');
      btn.setAttribute('aria-label', playing ? 'Pause demo call' : 'Play demo call');
      if (!audio) return;
      // If a real recording is dropped in later, this drives it too.
      playing ? audio.play().catch(() => {}) : audio.pause();
    });
    audio && audio.addEventListener('ended', () => {
      player.classList.remove('is-playing');
      btn.setAttribute('aria-label', 'Play demo call');
    });
  }

  /* ------------------------------------------------------- 9. Filters */

  $$('[data-filter-group]').forEach((group) => {
    const targets = $$(`[data-filter-target="${group.dataset.filterGroup}"]`);
    $$('.filter', group).forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.filter', group).forEach((b) => {
          b.classList.toggle('is-on', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
        const v = btn.dataset.filter;
        targets.forEach((t) => {
          const show = v === 'all' || (t.dataset.tags || '').split(' ').includes(v);
          t.hidden = !show;
        });
      });
    });
  });

  /* -------------------------------------------- 10. Integration search */

  const isearch = $('#intgSearch');
  if (isearch) {
    const cards = $$('[data-intg]');
    const empty = $('#intgEmpty');
    isearch.addEventListener('input', () => {
      const q = isearch.value.trim().toLowerCase();
      let n = 0;
      cards.forEach((c) => {
        const hit = !q || c.dataset.intg.toLowerCase().includes(q);
        c.hidden = !hit;
        if (hit) n++;
      });
      if (empty) empty.hidden = n > 0;
    });
  }

  /* ------------------------------------------------ 11. ROI calculator */

  const roi = $('#roi');
  if (roi) {
    const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
    const inputs = {
      calls: $('#roiCalls'),
      missed: $('#roiMissed'),
      value: $('#roiValue'),
      fee: $('#roiFee'),
    };
    const out = {
      calls: $('#outCalls'), missed: $('#outMissed'), value: $('#outValue'), fee: $('#outFee'),
      missedCount: $('#outMissedCount'), recovered: $('#outRecovered'),
      revenue: $('#outRevenue'), net: $('#outNet'), hours: $('#outHours'), roiPct: $('#outRoi'),
    };
    const set = (el, v) => { if (el) el.textContent = v; };

    function calc() {
      const calls = +inputs.calls.value;
      const missedPct = +inputs.missed.value;
      const value = +inputs.value.value;
      const fee = +inputs.fee.value;

      const missed = Math.round(calls * (missedPct / 100));
      // Deliberately conservative chain: only ~30% of missed calls carry
      // appointment intent, only ~50% of those are permanently lost (the rest
      // ring back), and Casey answers ~94% of what currently goes unanswered.
      const APPT_INTENT = 0.30, PERMANENTLY_LOST = 0.5, ANSWER_RATE = 0.94;
      const recovered = Math.round(missed * APPT_INTENT * PERMANENTLY_LOST * ANSWER_RATE);
      const revenue = recovered * value;
      const net = revenue - fee;
      const hours = Math.round(((calls * 0.7) * 3.5) / 60); // 70% of calls, ~3.5 min each
      const pct = fee > 0 ? Math.round((net / fee) * 100) : 0;

      set(out.calls, calls.toLocaleString('en-US'));
      set(out.missed, missedPct + '%');
      set(out.value, usd(value));
      set(out.fee, usd(fee));
      set(out.missedCount, missed.toLocaleString('en-US'));
      set(out.recovered, recovered.toLocaleString('en-US'));
      set(out.revenue, usd(revenue));
      set(out.net, (net < 0 ? '-' : '') + usd(Math.abs(net)));
      set(out.hours, hours.toLocaleString('en-US') + ' hrs');
      set(out.roiPct, (pct > 0 ? '+' : '') + pct + '%');
    }

    Object.values(inputs).forEach((i) => i && i.addEventListener('input', calc));
    calc();
  }

  /* ------------------------------------------------------- 12. Forms */

  $$('form[data-validate]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      $$('.fld', form).forEach((fld) => {
        const ctrl = $('input, select, textarea', fld);
        if (!ctrl) return;
        const bad = !ctrl.checkValidity();
        fld.classList.toggle('is-bad', bad);
        if (bad && ok) { ctrl.focus(); ok = false; }
      });
      if (!ok) return;
      // No backend wired up yet — see README for how to connect one.
      form.classList.add('is-sent');
      form.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });

    $$('input, select, textarea', form).forEach((ctrl) => {
      ctrl.addEventListener('blur', () => {
        const fld = ctrl.closest('.fld');
        if (fld && ctrl.value) fld.classList.toggle('is-bad', !ctrl.checkValidity());
      });
      ctrl.addEventListener('input', () => {
        const fld = ctrl.closest('.fld');
        if (fld && ctrl.checkValidity()) fld.classList.remove('is-bad');
      });
    });
  });

  /* -------------------------------------------------- 13. Copy to clipboard */

  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const old = btn.dataset.label || btn.textContent.trim();
        btn.dataset.label = old;
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = old; }, 1600);
      } catch (e) {}
    });
  });

  /* ---------------------------------------- 14. FAQ — one open at a time */

  const faqWrap = $('[data-accordion-single]');
  if (faqWrap) {
    $$('details', faqWrap).forEach((d) => {
      d.addEventListener('toggle', () => {
        if (!d.open) return;
        $$('details', faqWrap).forEach((o) => { if (o !== d) o.open = false; });
      });
    });
  }

  /* --------------------------------- 15. Deep-link the right accordion open */

  if (location.hash) {
    const t = document.getElementById(location.hash.slice(1));
    if (t && t.tagName === 'DETAILS') t.open = true;
  }
})();
