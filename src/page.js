// Inner pages: programs, dojos, events.
import { gsap, $, $$, initCore } from './core.js';
import { renderPage, renderWall } from './events.js';

initCore();
renderPage();
renderWall();

// page hero entrance
const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
tl.from('.nav', { y: -40, opacity: 0, duration: 1 })
  .from('.phero__inner > *', { y: 50, opacity: 0, duration: 1.1, stagger: 0.07 }, 0.1)
  .from('.phero__kanji', { opacity: 0, scale: 0.85, duration: 1.8 }, 0.2);

// kanji drifts with scroll
if ($('.phero__kanji')) {
  gsap.to('.phero__kanji', { yPercent: 25, ease: 'none', scrollTrigger: { trigger: '.phero', start: 'top top', end: 'bottom top', scrub: true } });
}
// benefits kanji stamp in
$$('.benefit').forEach((b) => {
  gsap.from(b.querySelector('.benefit__k'), { scale: 1.8, opacity: 0, filter: 'blur(10px)', duration: 0.9, ease: 'power4.in', scrollTrigger: { trigger: b, start: 'top 85%' } });
});
