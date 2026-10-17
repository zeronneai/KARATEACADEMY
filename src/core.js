// Shared by every page: fonts, styles, smooth scroll, language, nav, mobile menu,
// free class drawer + form (Google Sheets), floating button, cursor and reveals.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initI18n, onLangChange, t, lang } from './i18n.js';
import { SHEETS_ENDPOINT } from './config.js';
import '@fontsource/big-shoulders-display/600';
import '@fontsource/big-shoulders-display/800';
import '@fontsource/big-shoulders-display/900';
import '@fontsource/inter-tight/400';
import '@fontsource/inter-tight/500';
import '@fontsource/inter-tight/600';
import '@fontsource/ibm-plex-mono/400';
import '@fontsource/ibm-plex-mono/500';
import '@fontsource/noto-serif-jp/900';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger, onLangChange, t, lang };
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

initI18n();

/* ---------------- smooth scroll ---------------- */
export const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ---------------- UTM capture (for the Sheet) ---------------- */
(function captureUtm() {
  try {
    const q = new URLSearchParams(location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'fbclid', 'gclid'];
    const found = {};
    keys.forEach((k) => { if (q.get(k)) found[k] = q.get(k); });
    if (Object.keys(found).length) sessionStorage.setItem('aka-utm', JSON.stringify(found));
    if (!sessionStorage.getItem('aka-landing')) sessionStorage.setItem('aka-landing', location.pathname);
  } catch (e) { /* ignore */ }
})();
const readUtm = () => { try { return JSON.parse(sessionStorage.getItem('aka-utm') || '{}'); } catch (e) { return {}; } };

/* =========================================================
   DRAWER (free class form, opens from the side anywhere)
   ========================================================= */
const drawer = { el: null, panel: null, open: false, lastFocus: null };

const PROGRAM_BY_SLUG = {
  'kids-karate': 'Kids Karate', 'after-school': 'After-School', kickboxing: 'Kickboxing',
  'camps-and-birthday-parties': 'Camps / Birthday', 'competition-team': 'Kids Karate', leadership: 'Kids Karate',
};
const DOJO_BY_SLUG = { east: 'East', 'far-east': 'Far East', horizon: 'Horizon' };

function selectChip(group, value) {
  const g = $(`.chips[data-name="${group}"]`);
  if (!g || !value) return;
  const chip = $$('.chip', g).find((c) => c.dataset.v === value);
  if (chip) $$('.chip', g).forEach((c) => c.classList.toggle('is-on', c === chip));
}

export function openDrawer(opts = {}) {
  if (drawer.open) return;
  drawer.open = true;
  drawer.lastFocus = document.activeElement;
  selectChip('program', opts.program || PROGRAM_BY_SLUG[document.body.dataset.program]);
  selectChip('location', opts.location || DOJO_BY_SLUG[document.body.dataset.dojo]);
  drawer.el.classList.add('is-open');
  drawer.el.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
  lenis.stop();
  const tl = gsap.timeline();
  tl.fromTo('.drawer__scrim', { opacity: 0 }, { opacity: 1, duration: 0.4 })
    .fromTo(drawer.panel, { xPercent: 105 }, { xPercent: 0, duration: 0.75, ease: 'expo.out' }, 0)
    .fromTo($$('.drawer__view:not([hidden]) > *', drawer.panel), { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'expo.out' }, 0.15);
  setTimeout(() => (($('#drawerForm:not([hidden]) input[name=name]') || drawer.panel)).focus({ preventScroll: true }), 350);
  history.replaceState(null, '', location.pathname + location.search + '#free-class');
}

export function closeDrawer() {
  if (!drawer.open) return;
  drawer.open = false;
  gsap.timeline({
    onComplete() {
      drawer.el.classList.remove('is-open');
      drawer.el.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('drawer-open');
      if (!document.body.classList.contains('is-intro')) lenis.start();
      const done = $('#drawerDone');
      if (done && !done.hidden) { done.hidden = true; $('#drawerForm').hidden = false; }
      drawer.lastFocus?.focus?.({ preventScroll: true });
    },
  })
    .to(drawer.panel, { xPercent: 105, duration: 0.5, ease: 'expo.in' })
    .to('.drawer__scrim', { opacity: 0, duration: 0.35 }, 0.15);
  history.replaceState(null, '', location.pathname + location.search);
}

function initDrawer() {
  drawer.el = $('#drawer');
  drawer.panel = $('.drawer__panel');
  if (!drawer.el) return;
  gsap.set(drawer.panel, { xPercent: 105 });

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-drawer]');
    if (opener) {
      e.preventDefault();
      $('#mmenu')?.classList.contains('is-open') && toggleMenu(false);
      openDrawer({ program: opener.dataset.program, location: opener.dataset.location });
      return;
    }
    if (e.target.closest('[data-close-drawer]')) { e.preventDefault(); closeDrawer(); }
  });
  document.addEventListener('keydown', (e) => {
    if (!drawer.open) return;
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Tab') {
      const f = $$('button, input, a[href]', drawer.panel).filter((x) => x.offsetParent !== null && !x.closest('.hp'));
      if (!f.length) return;
      const first = f[0]; const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  if (location.hash === '#free-class') setTimeout(() => openDrawer(), document.body.classList.contains('is-intro') ? 0 : 400);
}

/* ---------------- FORM -> Google Sheets (Apps Script) ---------------- */
function initForm() {
  const form = $('#joinForm');
  if (!form) return;
  $$('.chips').forEach((group) => {
    group.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip'); if (!chip) return;
      $$('.chip', group).forEach((c) => c.classList.toggle('is-on', c === chip));
    });
  });

  const err = $('#formErr');
  const btn = $('#formSubmit');
  const showErr = (msg) => { err.textContent = msg; err.hidden = false; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.hidden = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const digits = phone.replace(/\D/g, '');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    form.name.classList.toggle('is-bad', !name);
    form.email.classList.toggle('is-bad', !emailOk);
    form.phone.classList.toggle('is-bad', digits.length < 10);
    if (!name || !emailOk || digits.length < 10) { showErr(t('j.errFields')); return; }

    const data = {
      name, email, phone,
      age: form.age.value.trim(),
      program: $('.chips[data-name="program"] .is-on')?.dataset.v || '',
      location: $('.chips[data-name="location"] .is-on')?.dataset.v || '',
      lang: lang(),
      page: location.pathname,
      landing: (() => { try { return sessionStorage.getItem('aka-landing') || ''; } catch (x) { return ''; } })(),
      company: form.company.value, // honeypot, must stay empty
      ...readUtm(),
    };

    btn.disabled = true;
    btn.classList.add('is-loading');
    try {
      if (SHEETS_ENDPOINT) {
        // text/plain keeps it a "simple" request (no CORS preflight) that Apps Script accepts
        const res = await fetch(SHEETS_ENDPOINT, { method: 'POST', body: JSON.stringify(data) });
        const out = await res.json().catch(() => ({ ok: res.ok }));
        if (!out.ok) throw new Error(out.error || 'Request failed');
      } else {
        console.info('[demo mode] VITE_SHEETS_ENDPOINT not set. Lead:', data);
        await new Promise((r) => setTimeout(r, 700));
      }
      showDone(data);
      form.reset();
    } catch (ex) {
      console.error(ex);
      showErr(t('j.errSend'));
    } finally {
      btn.disabled = false;
      btn.classList.remove('is-loading');
    }
  });
}

function showDone(data) {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  $('#doneSummary').innerHTML = `
    <div><span class="mono">${t('j.program')}</span><b>${esc(data.program)}</b></div>
    <div><span class="mono">${t('j.loc')}</span><b>${esc(data.location)}</b></div>
    <div><span class="mono">${t('j.email')}</span><b>${esc(data.email)}</b></div>`;
  const formView = $('#drawerForm');
  const done = $('#drawerDone');
  gsap.to(formView, {
    opacity: 0, x: -30, duration: 0.3,
    onComplete() {
      formView.hidden = true; gsap.set(formView, { clearProps: 'all' });
      done.hidden = false;
      gsap.fromTo(done.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'expo.out' });
      gsap.fromTo('.done__k', { scale: 2.2, opacity: 0, filter: 'blur(12px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power4.in' });
    },
  });
}

/* ---------------- floating button ---------------- */
function initFab() {
  const fab = $('#fab');
  if (!fab) return;
  // show it once the visitor passes the first screen (always visible on inner pages)
  const isHome = !!$('.hero');
  if (isHome) {
    ScrollTrigger.create({
      start: () => innerHeight * 0.6, end: 'max',
      onToggle: (self) => fab.classList.toggle('is-shown', self.isActive),
    });
  } else fab.classList.add('is-shown');
}

/* ---------------- mobile menu ---------------- */
function toggleMenu(force) {
  const m = $('#mmenu'); const b = $('#burger');
  const open = force ?? !m.classList.contains('is-open');
  m.classList.toggle('is-open', open);
  m.setAttribute('aria-hidden', String(!open));
  b.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  if (open) {
    lenis.stop();
    gsap.fromTo('.mmenu__inner > *', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.03, ease: 'expo.out' });
  } else if (!drawer.open) lenis.start();
}
function initMenu() {
  $('#burger')?.addEventListener('click', () => toggleMenu());
  $$('#mmenu a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));
}

/* ---------------- anchors: smooth scroll on this page ---------------- */
function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || a.hasAttribute('data-open-drawer')) return;
    const href = a.getAttribute('href');
    let hash = null;
    if (href.startsWith('#')) hash = href;
    else if (href.startsWith('/#') && location.pathname === '/') hash = href.slice(1);
    if (!hash || hash === '#free-class') return;
    const target = hash === '#top' ? 0 : $(hash);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: hash === '#top' ? 0 : -20, duration: 1.6 });
  });
  // arriving from another page with /#programs etc.
  if (location.hash && location.hash !== '#free-class' && location.hash !== '#nointro') {
    window.addEventListener('load', () => {
      const tgt = $(location.hash);
      if (tgt) setTimeout(() => lenis.scrollTo(tgt, { immediate: true }), 50);
    });
  }
}

/* ---------------- media slots ---------------- */
export function initSlots(root = document) {
  $$('img.slot', root).forEach((img) => {
    const ok = () => {
      img.closest('.card, .ev, .phero')?.classList.add('has-img');
      const g = img.closest('#gallery');
      if (g && g.hidden) { g.hidden = false; ScrollTrigger.refresh(); }
    };
    const bad = () => img.remove();
    if (img.complete) { img.naturalWidth ? ok() : bad(); }
    img.addEventListener('load', ok);
    img.addEventListener('error', bad);
  });
}

/* ---------------- reveals, tilt, cursor, magnetic ---------------- */
export function initReveals(root = document) {
  const els = $$('.reveal:not(.is-rev)', root);
  els.forEach((el) => el.classList.add('is-rev'));
  gsap.set(els, { opacity: 0 });
  ScrollTrigger.batch(els, {
    start: 'top 90%',
    onEnter: (b) => gsap.fromTo(b, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'expo.out', overwrite: true }),
  });
}

export function initTilt(root = document) {
  if (!matchMedia('(hover: hover)').matches) return;
  $$('.tilt:not(.is-tilt)', root).forEach((card) => {
    card.classList.add('is-tilt');
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(card, { transformPerspective: 900 });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      rx((0.5 - py) * 6); ry((px - 0.5) * 6);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

function initPointer() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  $$('.magnetic').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.25);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
  const cursor = $('.cursor');
  if (!cursor) return;
  const dot = $('.cursor__dot'); const ring = $('.cursor__ring');
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 }); const dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
  const rxq = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }); const ryq = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { dx(e.clientX); dy(e.clientY); rxq(e.clientX); ryq(e.clientY); });
  document.addEventListener('pointerover', (e) => {
    cursor.classList.toggle('is-hover', !!e.target.closest('a, button, .card, input, summary'));
  });
}

function initChrome() {
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  ScrollTrigger.create({ start: 80, end: 'max', onToggle: (self) => $('#nav')?.classList.toggle('is-solid', self.isActive) });
  $$('.section-head').forEach((h) => {
    gsap.from(h.children, { y: 40, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
  });
  if ($('.footer__logo')) {
    gsap.from('.footer__logo', { scale: 0.6, opacity: 0, rotation: -8, ease: 'back.out(1.6)', duration: 1.2, scrollTrigger: { trigger: '.footer', start: 'top 80%' } });
    gsap.to('.footer__word', { backgroundSize: '100% 100%', ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top 90%', end: 'bottom bottom', scrub: true } });
  }
  // FAQ: smooth height
  $$('.faq__item').forEach((d) => d.addEventListener('toggle', () => ScrollTrigger.refresh()));
}

export function initCore() {
  initChrome();
  initDrawer();
  initForm();
  initFab();
  initMenu();
  initAnchors();
  initSlots();
  initReveals();
  initTilt();
  initPointer();
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
