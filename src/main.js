import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initI18n, onLangChange, t } from './i18n.js';
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

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

initI18n();
$('#year').textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   SMOOTH SCROLL
   --------------------------------------------------------- */
const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();

$$('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0, duration: 1.6 });
  });
});

/* ---------------------------------------------------------
   AUDIO (synthesized, no files; only starts after a gesture)
   --------------------------------------------------------- */
const sound = {
  on: true,
  ctx: null,
  hum: null,
  humGain: null,
  get() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },
  startHum() {
    if (!this.on || this.hum) return;
    const ctx = this.get(); if (!ctx) return;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    osc.type = 'sawtooth'; osc2.type = 'sine';
    osc.frequency.value = 48; osc2.frequency.value = 96;
    lp.type = 'lowpass'; lp.frequency.value = 260;
    g.gain.value = 0;
    osc.connect(lp); osc2.connect(lp); lp.connect(g); g.connect(ctx.destination);
    osc.start(); osc2.start();
    this.hum = { osc, osc2, lp }; this.humGain = g;
  },
  setCharge(p) {
    if (!this.hum) return;
    const now = this.ctx.currentTime;
    this.humGain.gain.setTargetAtTime(this.on ? p * 0.09 : 0, now, 0.05);
    this.hum.osc.frequency.setTargetAtTime(48 + p * 70, now, 0.05);
    this.hum.lp.frequency.setTargetAtTime(260 + p * 900, now, 0.05);
  },
  stopHum() {
    if (!this.hum) return;
    const now = this.ctx.currentTime;
    this.humGain.gain.setTargetAtTime(0, now, 0.03);
    const h = this.hum; this.hum = null;
    setTimeout(() => { h.osc.stop(); h.osc2.stop(); }, 300);
  },
  crack() {
    if (!this.on) return;
    const ctx = this.get(); if (!ctx) return;
    const now = ctx.currentTime;
    // wood snap: filtered noise burst
    const len = ctx.sampleRate * 0.5;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.5);
    const n = ctx.createBufferSource(); n.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2200; bp.Q.value = 0.8;
    const ng = ctx.createGain(); ng.gain.value = 1.1;
    n.connect(bp); bp.connect(ng); ng.connect(ctx.destination); n.start(now);
    // body thump
    const o = ctx.createOscillator(); const og = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(140, now); o.frequency.exponentialRampToValueAtTime(38, now + 0.35);
    og.gain.setValueAtTime(1, now); og.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    o.connect(og); og.connect(ctx.destination); o.start(now); o.stop(now + 0.65);
  },
};

const soundBtn = $('#soundBtn');
soundBtn.addEventListener('click', () => {
  sound.on = !sound.on;
  soundBtn.setAttribute('aria-pressed', String(sound.on));
  if (!sound.on) sound.setCharge(0);
});

/* ---------------------------------------------------------
   INTRO: HOLD TO BREAK
   --------------------------------------------------------- */
function runIntro() {
  const intro = $('#intro');
  const board = $('#board');
  const holdBtn = $('#holdBtn');
  const prog = $('.hold__prog');
  const crack = $('.board__crack polyline');
  const hint = $('.intro__hint');
  const L = $('.board__half--l');
  const R = $('.board__half--r');

  const C = 2 * Math.PI * 54;
  prog.style.strokeDasharray = C;
  prog.style.strokeDashoffset = C;
  const crackLen = crack.getTotalLength ? crack.getTotalLength() : 110;
  crack.style.strokeDasharray = crackLen;
  crack.style.strokeDashoffset = crackLen;

  let progress = 0;
  let holding = false;
  let done = false;
  let interacted = false;

  gsap.from('.intro__stage > *', { y: 30, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', delay: 0.2 });

  const nudgeTimer = setTimeout(() => { if (!interacted) hint.classList.add('is-nudge'); }, 6000);

  const start = (e) => {
    if (done) return;
    if (e && e.cancelable) e.preventDefault();
    interacted = true; holding = true;
    hint.classList.remove('is-nudge');
    holdBtn.classList.add('is-holding');
    sound.startHum();
  };
  const stop = () => { holding = false; holdBtn.classList.remove('is-holding'); };

  [holdBtn, board].forEach((el) => {
    el.addEventListener('pointerdown', (e) => { el.setPointerCapture?.(e.pointerId); start(e); });
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  });
  const onKeyDown = (e) => { if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat) { e.preventDefault(); start(); } };
  const onKeyUp = (e) => { if (e.code === 'Space' || e.code === 'Enter') stop(); };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  const tick = (time, dt) => {
    if (done) return;
    const s = dt / 1000;
    progress += holding ? s / 1.35 : -s / 0.7;
    progress = Math.max(0, Math.min(1, progress));

    prog.style.strokeDashoffset = C * (1 - progress);
    holdBtn.style.setProperty('--charge', progress);
    const cp = Math.max(0, (progress - 0.35) / 0.65);
    crack.style.strokeDashoffset = crackLen * (1 - cp);

    const amp = progress * progress * 7;
    gsap.set(board, {
      x: (Math.random() - 0.5) * amp,
      y: (Math.random() - 0.5) * amp,
      rotation: (Math.random() - 0.5) * amp * 0.25,
      scale: 1 + progress * 0.06,
    });
    sound.setCharge(progress);

    if (progress >= 1) breakIt();
  };
  gsap.ticker.add(tick);

  function cleanup() {
    done = true;
    clearTimeout(nudgeTimer);
    gsap.ticker.remove(tick);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    sound.stopHum();
  }

  function breakIt() {
    if (done) return;
    cleanup();
    sound.crack();
    if (navigator.vibrate) navigator.vibrate([30, 40, 80]);
    splinters(board);

    const tl = gsap.timeline({ onComplete: finish });
    tl.set(board, { x: 0, y: 0, rotation: 0 })
      .to('.intro__flash', { opacity: 0.9, duration: 0.05 })
      .to('.intro__flash', { opacity: 0, duration: 0.5, ease: 'power2.out' })
      .to(L, { xPercent: -90, yPercent: 40, rotation: -38, opacity: 0, duration: 1.1, ease: 'power3.out' }, '<')
      .to(R, { xPercent: 90, yPercent: 30, rotation: 34, opacity: 0, duration: 1.1, ease: 'power3.out' }, '<')
      .to('.board__crack, .board__kanji', { opacity: 0, duration: 0.1 }, '<')
      .to('#introStage', { keyframes: [{ x: -14, y: 8 }, { x: 12, y: -6 }, { x: -6, y: 4 }, { x: 0, y: 0 }], duration: 0.35 }, '<')
      .to(['.hold', '.intro__hint', '.intro__kicker'], { opacity: 0, y: 20, duration: 0.4 }, '<')
      .fromTo('.intro__kiai', { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, '<0.05')
      .to('.intro__kiai', { opacity: 0, scale: 1.4, filter: 'blur(12px)', duration: 0.6, ease: 'power2.in' }, '+=0.25')
      .to(intro, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.3')
      .add(() => heroIn(), '-=0.55');
  }

  function finish() {
    intro.remove();
    document.body.classList.remove('is-intro');
    lenis.start();
    ScrollTrigger.refresh();
    try { sessionStorage.setItem('aka-intro', '1'); } catch (e) { /* ignore */ }
  }

  $('#skipBtn').addEventListener('click', () => {
    if (done) return;
    cleanup();
    gsap.to(intro, { opacity: 0, duration: 0.5, onComplete: finish });
    heroIn();
  });
}

function splinters(board) {
  const cvs = $('#splinters');
  const ctx = cvs.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  cvs.width = innerWidth * dpr; cvs.height = innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const r = board.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const colors = ['#c99a62', '#a8773f', '#8a5a2b', '#e3c08d', '#5e3a18'];
  const parts = Array.from({ length: 90 }, () => {
    const y = r.top + Math.random() * r.height;
    const dir = Math.random() < 0.5 ? -1 : 1;
    return {
      x: cx + (Math.random() - 0.5) * 18, y,
      vx: dir * (4 + Math.random() * 14), vy: -6 + Math.random() * 8,
      w: 2 + Math.random() * 5, h: 6 + Math.random() * 22,
      a: Math.random() * Math.PI, va: (Math.random() - 0.5) * 0.5,
      c: colors[(Math.random() * colors.length) | 0], life: 1,
    };
  });
  const sparks = Array.from({ length: 40 }, () => ({
    x: cx, y: r.top + Math.random() * r.height,
    vx: (Math.random() - 0.5) * 26, vy: (Math.random() - 0.5) * 26, life: 1,
  }));
  let raf;
  const step = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    let alive = false;
    parts.forEach((p) => {
      if (p.life <= 0) return; alive = true;
      p.vy += 0.55; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.a += p.va; p.life -= 0.011;
      ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.translate(p.x, p.y); ctx.rotate(p.a);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    });
    sparks.forEach((s) => {
      if (s.life <= 0) return; alive = true;
      s.x += s.vx; s.y += s.vy; s.vx *= 0.9; s.vy *= 0.9; s.life -= 0.04;
      ctx.globalAlpha = Math.max(0, s.life); ctx.fillStyle = '#ff2a33';
      ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (alive) raf = requestAnimationFrame(step);
  };
  cancelAnimationFrame(raf);
  step();
}

/* ---------------------------------------------------------
   FIT HERO WORDS TO WIDTH (long words like EXTRAORDINARIO)
   --------------------------------------------------------- */
function fitHero() {
  const title = $('.hero__title');
  title.style.fontSize = '';
  const max = title.parentElement.clientWidth;
  const widest = Math.max($('#extra').scrollWidth, $('.chop__sizer').scrollWidth);
  if (widest > max) {
    const fs = parseFloat(getComputedStyle(title).fontSize);
    title.style.fontSize = Math.floor(fs * (max / widest) * 0.98) + 'px';
  }
}
document.fonts?.ready.then(fitHero);
fitHero();
window.addEventListener('resize', () => { fitHero(); });

/* ---------------------------------------------------------
   HERO: THE CHOP
   --------------------------------------------------------- */
let heroPlayed = false;
function scramble(el, finalText, duration = 1.1) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ空手道錬金気合';
  const obj = { p: 0 };
  return gsap.to(obj, {
    p: 1, duration, ease: 'power2.out',
    onUpdate() {
      const n = Math.floor(obj.p * finalText.length);
      let out = finalText.slice(0, n);
      for (let i = n; i < finalText.length; i++) out += finalText[i] === ' ' ? ' ' : chars[(Math.random() * chars.length) | 0];
      el.textContent = out;
    },
    onComplete() { el.textContent = finalText; },
  });
}

const em = () => parseFloat(getComputedStyle($('.hero__title')).fontSize);
function heroIn() {
  if (heroPlayed) return; heroPlayed = true;
  const extra = $('#extra');
  const finalExtra = t('hero.extra');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.nav', { y: -40, opacity: 0, duration: 1 })
    .from('.hero__title .row__in', { yPercent: 115, duration: 1.2, stagger: 0.09 }, 0)
    .add(() => { extra.style.visibility = 'hidden'; }, 0)
    .to('.chop__slash', { scaleX: 1, duration: 0.22, ease: 'power4.in' }, 0.75)
    .add(() => $('#chop').parentElement.classList.add('is-open'), 0.95)
    .to('.chop__top', { x: () => -em() * 0.07, y: () => -em() * 0.04, rotation: -2.5, duration: 0.9, ease: 'power3.out' }, 0.97)
    .to('.chop__bot', { x: () => em() * 0.08, y: () => em() * 0.04, rotation: 1.8, duration: 0.9, ease: 'power3.out' }, 0.97)
    .to('.chop', { color: '#3a3836', duration: 0.6 }, 0.97)
    .to('.chop__slash', { opacity: 0, duration: 0.6, ease: 'power2.out' }, 1.05)
    .add(() => { extra.style.visibility = 'visible'; scramble(extra, finalExtra, 1.2); }, 1.05)
    .from('.hero__eyebrow, .hero__sub, .hero__ctas, .hero__meta li', { y: 26, opacity: 0, duration: 1, stagger: 0.06 }, 1.1)
    .from('#sigil', { opacity: 0, scale: 0.85, rotation: -40, duration: 2.2, ease: 'power3.out' }, 0.2)
    .from('.hero__kanji', { opacity: 0, y: 40, duration: 1.6 }, 0.6);

  if (!reduceMotion) {
    const shapes = $$('#sigil > *');
    shapes.forEach((s) => {
      const len = s.getTotalLength ? s.getTotalLength() : 0;
      if (len) { s.style.strokeDasharray = len; s.style.strokeDashoffset = len; }
    });
    gsap.to(shapes, { strokeDashoffset: 0, duration: 2.6, stagger: 0.06, ease: 'power2.inOut', delay: 0.2 });
  }
}

/* sigil spin on scroll + slow idle spin */
gsap.to('#sigil', { rotation: 360, duration: 120, repeat: -1, ease: 'none' });
gsap.to('#sigil', {
  yPercent: -30, scale: 1.25,
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
});
gsap.to('.hero__inner', {
  yPercent: 18, opacity: 0.2,
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
});

/* ---------------------------------------------------------
   NAV STATE
   --------------------------------------------------------- */
ScrollTrigger.create({
  start: 80, end: 'max',
  onToggle: (self) => $('#nav').classList.toggle('is-solid', self.isActive),
});

/* ---------------------------------------------------------
   MARQUEE: duplicate + velocity skew
   --------------------------------------------------------- */
const mq = $('#marquee');
mq.appendChild(mq.firstElementChild.cloneNode(true));
const skewTo = gsap.quickTo('.marquee', 'skewX', { duration: 0.5, ease: 'power3' });
ScrollTrigger.create({
  onUpdate: (self) => skewTo(gsap.utils.clamp(-10, 10, self.getVelocity() / -250)),
});

/* ---------------------------------------------------------
   MANIFESTO: words ignite on scroll
   --------------------------------------------------------- */
const KEYWORDS = ['black', 'quit.', 'lead.', 'alchemy.', 'negro', 'rendirse.', 'liderar.', 'alquimia.'];
let manifestoST;
function buildManifesto() {
  const el = $('#manifestoText');
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="w${KEYWORDS.includes(w.toLowerCase()) ? ' is-key' : ''}">${w}</span>`).join(' ');
  manifestoST?.scrollTrigger?.kill(); manifestoST?.kill();
  manifestoST = gsap.to($$('.w', el), {
    opacity: 1, stagger: 0.1, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
  });
}
buildManifesto();

/* ---------------------------------------------------------
   THE PATH: pinned horizontal belt journey
   --------------------------------------------------------- */
const path = $('#path');
const track = $('#pathTrack');
const belts = $$('.belt', track);
const beltColors = belts.map((b) => getComputedStyle(b).getPropertyValue('--c').trim());
let currentBelt = -1;

const pathTween = gsap.to(track, {
  x: () => -(track.scrollWidth - innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: path,
    start: 'top top',
    end: () => '+=' + (track.scrollWidth - innerWidth),
    pin: true,
    scrub: 0.8,
    invalidateOnRefresh: true,
    onUpdate(self) {
      $('#beltBar').style.transform = `scaleX(${self.progress})`;
      const idx = Math.min(belts.length - 1, Math.round(self.progress * (belts.length - 1)));
      if (idx !== currentBelt) {
        currentBelt = idx;
        $('#beltNum').textContent = String(idx + 1).padStart(2, '0');
        const c = idx === belts.length - 1 ? '#e3121b' : beltColors[idx];
        gsap.to(path, { '--belt': c, duration: 0.6 });
      }
    },
  },
});

belts.forEach((b) => {
  gsap.from(b.querySelector('.belt__kanji'), {
    yPercent: 30, opacity: 0, scale: 0.85,
    scrollTrigger: { trigger: b, containerAnimation: pathTween, start: 'left 85%', end: 'left 30%', scrub: true },
  });
  gsap.from(b.querySelectorAll('.belt__body > *'), {
    x: 80, opacity: 0, stagger: 0.08,
    scrollTrigger: { trigger: b, containerAnimation: pathTween, start: 'left 70%', end: 'left 20%', scrub: true },
  });
  gsap.from(b.querySelector('.belt__band i'), {
    scaleX: 0, transformOrigin: 'left center',
    scrollTrigger: { trigger: b, containerAnimation: pathTween, start: 'left 90%', end: 'left 10%', scrub: true },
  });
});

/* ---------------------------------------------------------
   REVEALS
   --------------------------------------------------------- */
ScrollTrigger.batch('.reveal', {
  start: 'top 88%',
  onEnter: (els) => gsap.fromTo(els, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'expo.out', overwrite: true }),
});
gsap.set('.reveal', { opacity: 0 });

$$('.section-head').forEach((h) => {
  gsap.from(h.children, {
    y: 40, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: h, start: 'top 85%' },
  });
});

/* ---------------------------------------------------------
   CARDS: spotlight + tilt
   --------------------------------------------------------- */
if (matchMedia('(hover: hover)').matches) {
  $$('.tilt').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(card, { transformPerspective: 900 });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      rx((0.5 - py) * 7); ry((px - 0.5) * 7);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/* ---------------------------------------------------------
   ARENA: pressure / focus / glory
   --------------------------------------------------------- */
const aws = $$('.aw');
const arenaTl = gsap.timeline({
  scrollTrigger: { trigger: '#arenaPin', start: 'top top', end: '+=220%', pin: true, scrub: 0.6 },
});
arenaTl.fromTo('.arena__mat', { rotateX: 70, scale: 1.3 }, { rotateX: 52, scale: 1, duration: 3, ease: 'none' }, 0);
aws.forEach((w, i) => {
  const last = i === aws.length - 1;
  arenaTl.fromTo(w, { opacity: 0, scale: 1.8, filter: 'blur(20px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' }, i);
  if (!last) arenaTl.to(w, { opacity: 0, scale: 0.7, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in' }, i + 0.6);
});
arenaTl.from('.arena__caption', { opacity: 0, y: 20, duration: 0.4 }, 2.4);

/* counters */
$$('.count').forEach((el) => {
  const to = +el.dataset.to;
  const o = { v: 0 };
  ScrollTrigger.create({
    trigger: el, start: 'top 90%', once: true,
    onEnter: () => gsap.to(o, {
      v: to, duration: 2, ease: 'power3.out',
      onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-US'); },
    }),
  });
});

/* footer word fill */
gsap.to('.footer__word', {
  backgroundSize: '100% 100%', ease: 'none',
  scrollTrigger: { trigger: '.footer', start: 'top 90%', end: 'bottom bottom', scrub: true },
});

/* ---------------------------------------------------------
   MAGNETIC BUTTONS + CURSOR
   --------------------------------------------------------- */
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
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
  const dot = $('.cursor__dot');
  const ring = $('.cursor__ring');
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 }); const dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
  const rxq = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }); const ryq = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { dx(e.clientX); dy(e.clientY); rxq(e.clientX); ryq(e.clientY); });
  document.addEventListener('pointerover', (e) => {
    cursor.classList.toggle('is-hover', !!e.target.closest('a, button, .card, input'));
  });
}

/* ---------------------------------------------------------
   FORM
   --------------------------------------------------------- */
$$('.chips').forEach((group) => {
  group.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip'); if (!chip) return;
    $$('.chip', group).forEach((c) => c.classList.toggle('is-on', c === chip));
  });
});
$('#joinForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const name = f.name.value.trim();
  const phone = f.phone.value.trim();
  f.name.classList.toggle('is-bad', !name);
  f.phone.classList.toggle('is-bad', phone.replace(/\D/g, '').length < 10);
  if (!name || phone.replace(/\D/g, '').length < 10) return;

  const data = {
    name, phone, age: f.age.value.trim(),
    program: $('.chips[data-name="program"] .is-on').dataset.v,
    location: $('.chips[data-name="location"] .is-on').dataset.v,
  };
  // TODO: connect to the academy's CRM / Formspree / Supabase endpoint.
  console.info('[free-class lead]', data);
  const ok = $('#formOk');
  ok.hidden = false;
  gsap.from(ok, { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out' });
  f.querySelector('button[type=submit]').disabled = true;
});

/* ---------------------------------------------------------
   LANGUAGE CHANGES
   --------------------------------------------------------- */
onLangChange(() => {
  buildManifesto();
  if (heroPlayed) $('#extra').textContent = t('hero.extra');
  fitHero();
  ScrollTrigger.refresh();
});

/* ---------------------------------------------------------
   BOOT
   --------------------------------------------------------- */
let seen = false;
try { seen = sessionStorage.getItem('aka-intro') === '1'; } catch (e) { /* ignore */ }
if (reduceMotion || seen || location.hash === '#nointro') {
  $('#intro').remove();
  document.body.classList.remove('is-intro');
  lenis.start();
  heroIn();
} else {
  runIntro();
}
window.addEventListener('load', () => ScrollTrigger.refresh());
