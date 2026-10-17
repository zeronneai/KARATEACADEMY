// Home page: intro (board break + logo), hero chop, belts path, arena.
import { gsap, ScrollTrigger, lenis, $, $$, reduceMotion, onLangChange, t, initCore } from './core.js';
import { renderHome } from './events.js';

initCore();
renderHome();

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
  impact() {
    if (!this.on) return;
    const ctx = this.get(); if (!ctx) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(90, now); o.frequency.exponentialRampToValueAtTime(28, now + 0.5);
    g.gain.setValueAtTime(1.2, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.95);
    const len = ctx.sampleRate * 0.25;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
    const n = ctx.createBufferSource(); n.buffer = buf;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
    n.connect(lp); lp.connect(ctx.destination); n.start(now);
    // shimmer for the shine
    [880, 1320, 1760].forEach((f, i) => {
      const s = ctx.createOscillator(); const sg = ctx.createGain();
      s.type = 'triangle'; s.frequency.value = f;
      const t0 = now + 0.55 + i * 0.07;
      sg.gain.setValueAtTime(0.0001, t0); sg.gain.exponentialRampToValueAtTime(0.05, t0 + 0.02); sg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
      s.connect(sg); sg.connect(ctx.destination); s.start(t0); s.stop(t0 + 1);
    });
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
   INTRO: the scroll plays the video frame by frame
   Frames live in public/media/intro/desktop and /mobile (001.webp ... 096.webp)
   --------------------------------------------------------- */
const FRAMES = 96;
const BREAK_AT = 0.56; // progress where the board snaps (around frame 54)

function runIntro() {
  const intro = $('#intro');
  const cvs = $('#introCanvas');
  const ctx = cvs.getContext('2d');
  const set = innerHeight > innerWidth ? 'mobile' : 'desktop';
  const src = (i) => `/media/intro/${set}/${String(i + 1).padStart(3, '0')}.webp`;
  const imgs = new Array(FRAMES);
  let loaded = 0; let ready = false; let done = false; let interacted = false; let broke = false;
  let target = 0; let current = 0; let lastDrawn = -1;

  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cvs.width = Math.round(innerWidth * dpr); cvs.height = Math.round(innerHeight * dpr);
    lastDrawn = -1;
  }
  size();
  const onResize = () => { size(); draw(Math.round(current * (FRAMES - 1))); };
  window.addEventListener('resize', onResize);

  const okImg = (im) => im && im.complete && im.naturalWidth;
  function nearest(i) {
    for (let d = 0; d < FRAMES; d++) {
      if (okImg(imgs[i - d])) return imgs[i - d];
      if (okImg(imgs[i + d])) return imgs[i + d];
    }
    return null;
  }
  function draw(i) {
    const img = nearest(i);
    if (!img) return;
    const cw = cvs.width; const ch = cvs.height;
    const sc = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * sc; const h = img.naturalHeight * sc;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    lastDrawn = i;
  }

  // Load in passes so it is playable early: key frames (every 2nd) first, the rest after.
  // The percentage tracks the key frames; missing frames fall back to the nearest loaded one.
  const pct = $('#introPct');
  const order = [];
  const seen = new Set();
  [8, 4, 2, 1].forEach((step) => { for (let i = 0; i < FRAMES; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); } });
  if (!seen.has(FRAMES - 1)) order.splice(1, 0, FRAMES - 1);
  const KEY = order.filter((i) => i % 2 === 0 || i === FRAMES - 1).length;
  let keyLoaded = 0; let next = 0; let inflight = 0;
  const pump = () => {
    while (inflight < 6 && next < order.length) {
      const i = order[next++];
      const im = new Image();
      im.decoding = 'async';
      im.onload = im.onerror = () => {
        inflight--; loaded++;
        if (i % 2 === 0 || i === FRAMES - 1) {
          keyLoaded++;
          pct.textContent = Math.min(100, Math.round((keyLoaded / KEY) * 100));
          if (keyLoaded === KEY) enable();
        }
        if (lastDrawn < 0 && imgs[0] && okImg(imgs[0])) draw(0);
        if (loaded === FRAMES) window.dispatchEvent(new Event('aka:frames-loaded'));
        pump();
      };
      im.src = src(i);
      imgs[i] = im;
      inflight++;
    }
  };
  pump();
  const failsafe = setTimeout(enable, 10000); // slow connection: start anyway with what loaded

  gsap.from('#introUi', { y: 20, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.15 });

  function enable() {
    if (ready) return;
    ready = true;
    clearTimeout(failsafe);
    $('#introLoad').classList.add('is-done');
    setTimeout(() => $('#introCue').classList.add('is-on'), 350);
  }

  const push = (d) => {
    if (!ready || done) return;
    target = Math.min(1, Math.max(0, target + d));
    if (!interacted && d > 0) {
      interacted = true;
      $('#introUi').classList.add('is-gone');
      sound.startHum();
    }
  };
  const onWheel = (e) => { e.preventDefault(); push(e.deltaY / 2400); };
  let ty = null;
  const onTouchStart = (e) => { ty = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    if (ty == null) return;
    const y = e.touches[0].clientY;
    push((ty - y) / (innerHeight * 1.5));
    ty = y;
    e.preventDefault();
  };
  const onKey = (e) => {
    if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) { e.preventDefault(); push(0.12); }
    if (['ArrowUp', 'PageUp'].includes(e.code)) { e.preventDefault(); push(-0.12); }
  };
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('keydown', onKey);

  if (matchMedia('(hover: none)').matches) {
    const cueText = $('#introCue .mono');
    cueText.dataset.i18n = 'intro.cueTouch';
    cueText.textContent = t('intro.cueTouch');
  }

  const bar = $('#introBar');
  const tick = () => {
    if (done) return;
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.0005) current = target;
    const f = Math.round(current * (FRAMES - 1));
    if (f !== lastDrawn) draw(f);
    bar.style.transform = `scaleX(${current})`;
    if (!broke) sound.setCharge(Math.min(1, current / BREAK_AT));
    if (!broke && current >= BREAK_AT) {
      broke = true;
      sound.stopHum();
      sound.crack();
      if (navigator.vibrate) navigator.vibrate([30, 40, 80]);
      gsap.fromTo('.intro__flash', { opacity: 0.6 }, { opacity: 0, duration: 0.5, ease: 'power2.out' });
      gsap.fromTo(cvs, { x: -14, y: 6 }, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    }
    if (current >= 0.995) end();
  };
  gsap.ticker.add(tick);

  function cleanup() {
    done = true;
    clearTimeout(failsafe);
    gsap.ticker.remove(tick);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onResize);
    sound.stopHum();
  }

  function end() {
    if (done) return;
    cleanup();
    startHeroVideo();
    draw(FRAMES - 1);
    gsap.timeline().add(logoSequence(), 0.25);
  }

  // Logo slams in, shockwave, shine, then flies into the nav
  function logoSequence() {
    const logo = $('#introLogo');
    const tl = gsap.timeline();
    tl.fromTo(logo, { opacity: 0, scale: 2.8, filter: 'blur(24px)', rotation: -6 },
      { opacity: 1, scale: 1, filter: 'blur(0px)', rotation: 0, duration: 0.42, ease: 'power4.in' })
      .add(() => { sound.impact(); if (navigator.vibrate) navigator.vibrate(60); })
      .to('.intro__flash', { opacity: 0.35, duration: 0.04 })
      .to('.intro__flash', { opacity: 0, duration: 0.45 })
      .fromTo('.intro__shock', { scale: 0.3, opacity: 1 }, { scale: 2.6, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out' }, '<')
      .to('#introCanvas', { keyframes: [{ x: -10, y: 6 }, { x: 8, y: -5 }, { x: -3, y: 2 }, { x: 0, y: 0 }], duration: 0.3 }, '<')
      .fromTo(logo, { scale: 0.94 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' }, '<')
      .fromTo('#introLogo .shine', { backgroundPosition: '160% 0' }, { backgroundPosition: '-60% 0', duration: 0.9, ease: 'power2.inOut' }, '<0.15')
      .add(() => flyToNav(logo), '+=0.25');
    return tl;
  }

  function flyToNav(logo) {
    const target = $('#brandLogo').getBoundingClientRect();
    const from = logo.getBoundingClientRect();
    const scale = target.height / from.height;
    const dx = target.left + target.width / 2 - (from.left + from.width / 2);
    const dy = target.top + target.height / 2 - (from.top + from.height / 2);
    intro.style.pointerEvents = 'none';
    heroIn({ skipBrand: true });
    gsap.timeline({ onComplete: finish })
      .to(['.intro__canvas', '.intro__shade', '.intro__corner', '.intro__bar', '.intro__ui'], { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 0)
      .to(logo, { x: dx, y: dy, scale, duration: 1.05, ease: 'expo.inOut' }, 0)
      .to('#introLogo img', { filter: 'drop-shadow(0 4px 14px rgba(0,0,0,.5))', duration: 1 }, 0);
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
    startHeroVideo();
    gsap.to(intro, { opacity: 0, duration: 0.5, onComplete: finish });
    heroIn();
    gsap.fromTo('.brand', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)', delay: 0.2 });
  });
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
   HERO LOOP VIDEO (horizontal on desktop, vertical on phones)
   --------------------------------------------------------- */
function initHeroVideo() {
  const v = $('#heroVideo');
  if (!v) return;
  const set = innerHeight > innerWidth ? 'mobile' : 'desktop';
  v.poster = `/media/hero/hero-${set}.jpg`;
  v.src = `/media/hero/hero-${set}.mp4`;
  v.addEventListener('loadeddata', () => $('.hero__media').classList.add('is-ready'), { once: true });
  v.addEventListener('error', () => $('.hero__media').classList.add('is-ready'), { once: true }); // poster stays
  $('.hero').classList.add('has-video');
  v.play().catch(() => {});
  // pause when the hero is off screen
  ScrollTrigger.create({
    trigger: '.hero', start: 'top bottom', end: 'bottom top',
    onToggle: (self) => (self.isActive ? v.play().catch(() => {}) : v.pause()),
  });
}
const startHeroVideo = () => { if (!startHeroVideo.done) { startHeroVideo.done = true; initHeroVideo(); } };
window.addEventListener('aka:frames-loaded', startHeroVideo, { once: true });
setTimeout(startHeroVideo, 12000); // safety net on slow connections
gsap.to('#galleryTrack', {
  x: () => -Math.max(0, $('#galleryTrack').scrollWidth - innerWidth),
  ease: 'none',
  scrollTrigger: { trigger: '#gallery', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
});

/* ---------------------------------------------------------
   HERO: THE CHOP
   --------------------------------------------------------- */
let heroPlayed = false;
function scramble(el, finalText, duration = 1.1) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
function heroIn(opts = {}) {
  if (heroPlayed) return; heroPlayed = true;
  const extra = $('#extra');
  const finalExtra = t('hero.extra');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from(opts.skipBrand ? '.nav__links, .nav__right' : '.nav', { y: -40, opacity: 0, duration: 1 })
    .from('.hero__title .row__in', { yPercent: 115, duration: 1.2, stagger: 0.09 }, 0)
    .add(() => { extra.style.visibility = 'hidden'; }, 0)
    .to('.chop__slash', { scaleX: 1, duration: 0.22, ease: 'power4.in' }, 0.75)
    .add(() => $('#chop').parentElement.classList.add('is-open'), 0.95)
    .to('.chop__top', { x: () => -em() * 0.07, y: () => -em() * 0.04, rotation: -2.5, duration: 0.9, ease: 'power3.out' }, 0.97)
    .to('.chop__bot', { x: () => em() * 0.08, y: () => em() * 0.04, rotation: 1.8, duration: 0.9, ease: 'power3.out' }, 0.97)
    .to('.chop', { color: '#3a3836', duration: 0.6 }, 0.97)
    .to('.chop__slash', { opacity: 0, duration: 0.6, ease: 'power2.out' }, 1.05)
    .add(() => { extra.style.visibility = 'visible'; scramble(extra, finalExtra, 1.2); }, 1.05)
    .from('.hero__ctas, .hero__meta li', { y: 26, opacity: 0, duration: 1, stagger: 0.06 }, 1.1)
    .from('#sigil', { opacity: 0, scale: 0.85, rotation: -40, duration: 2.2, ease: 'power3.out' }, 0.2)
    .from('.hero__kanji', { opacity: 0, y: 40, duration: 1.6 }, 0.6);

  if (!reduceMotion) {
    const shapes = $$('#sigil > *');
    shapes.forEach((s) => {
      let len = 0;
      try { len = s.getTotalLength ? s.getTotalLength() : 0; } catch (e) { len = 0; }
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
      onUpdate: () => { el.textContent = el.dataset.dec ? o.v.toFixed(+el.dataset.dec) : Math.round(o.v).toLocaleString('en-US'); },
    }),
  });
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
  startHeroVideo();
  heroIn();
} else {
  lenis.stop();
  runIntro();
}
