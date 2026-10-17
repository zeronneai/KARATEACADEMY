// Events, results and training. Source of truth: the "Events" tab of the Google Sheet
// (served by the Apps Script web app). Falls back to src/data/events.js.
import { SHEETS_ENDPOINT } from './config.js';
import { fallbackEvents } from './data/events.js';
import { $, $$, gsap, lang, onLangChange, initReveals, initTilt, ScrollTrigger } from './core.js';

const CAT = {
  tournament: { k: '試合', en: 'Tournament', es: 'Torneo', group: 'results' },
  achievement: { k: '勝', en: 'Result', es: 'Logro', group: 'results' },
  training: { k: '稽古', en: 'Training', es: 'Entrenamiento', group: 'training' },
  seminar: { k: '導', en: 'Seminar', es: 'Seminario', group: 'training' },
  camp: { k: '夏', en: 'Camp', es: 'Campamento', group: 'training' },
  graduation: { k: '帯', en: 'Graduation', es: 'Graduación', group: 'training' },
};
const L = {
  upcoming: { en: 'Upcoming', es: 'Próximo' },
  latest: { en: 'Latest', es: 'Lo más reciente' },
  today: { en: 'Today', es: 'Hoy' },
  inDays: { en: (n) => `In ${n} day${n === 1 ? '' : 's'}`, es: (n) => `En ${n} día${n === 1 ? '' : 's'}` },
  more: { en: 'Details', es: 'Detalles' },
  none: { en: 'New dates coming soon', es: 'Pronto nuevas fechas' },
};
const tx = (o) => (lang() === 'es' ? o.es : o.en);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function normalize(e) {
  // supports the local format and the flat Sheet format (title_en, title_es, ...)
  const pick = (base) => (e[base] && typeof e[base] === 'object' ? e[base] : { en: e[`${base}_en`] || '', es: e[`${base}_es`] || e[`${base}_en`] || '' });
  const date = e.date ? new Date(String(e.date).slice(0, 10) + 'T12:00:00') : null;
  const dl = e.dateLabel || (e.date_label_en ? { en: e.date_label_en, es: e.date_label_es || e.date_label_en } : null);
  return {
    date, dateLabel: dl,
    category: String(e.category || 'tournament').toLowerCase().trim(),
    title: pick('title'), desc: pick('desc'),
    location: e.location || '', image: e.image || '', link: e.link || '',
    featured: e.featured === true || String(e.featured).toLowerCase() === 'true',
  };
}

let cache = null;
export async function loadEvents() {
  if (cache) return cache;
  let rows = null;
  if (SHEETS_ENDPOINT) {
    try {
      const ctl = new AbortController();
      const to = setTimeout(() => ctl.abort(), 5000);
      const res = await fetch(`${SHEETS_ENDPOINT}?action=events`, { signal: ctl.signal });
      clearTimeout(to);
      const json = await res.json();
      if (json.ok && Array.isArray(json.events) && json.events.length) rows = json.events;
    } catch (e) { console.warn('[events] using fallback list', e); }
  }
  const list = (rows || fallbackEvents).map(normalize).filter((e) => e.date && !isNaN(e.date) && e.title.en);
  const now = new Date(); now.setHours(0, 0, 0, 0);
  list.forEach((e) => { e.upcoming = e.date >= now; e.days = Math.round((e.date - now) / 864e5); });
  const upcoming = list.filter((e) => e.upcoming).sort((a, b) => a.date - b.date);
  const past = list.filter((e) => !e.upcoming).sort((a, b) => b.date - a.date);
  cache = { upcoming, past, all: [...upcoming, ...past] };
  return cache;
}

function dateText(e) {
  if (e.dateLabel) return tx(e.dateLabel);
  return e.date.toLocaleDateString(lang() === 'es' ? 'es-MX' : 'en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
}

function card(e, { big = false } = {}) {
  const c = CAT[e.category] || CAT.tournament;
  const badge = e.upcoming
    ? `<span class="ev__badge ev__badge--up">${tx(L.upcoming)}${e.days === 0 ? ' · ' + tx(L.today) : e.days > 0 && e.days < 120 ? ' · ' + L.inDays[lang()](e.days) : ''}</span>`
    : '';
  const tag = e.link ? 'a' : 'article';
  const href = e.link ? ` href="${esc(e.link)}" target="_blank" rel="noopener"` : '';
  return `<${tag} class="ev ev--${esc(e.category)}${big ? ' ev--big' : ''}${e.upcoming ? ' is-up' : ''} tilt reveal"${href}>
    <div class="ev__media"><span class="ev__k" aria-hidden="true">${c.k}</span>${e.image ? `<img class="slot" src="${esc(e.image)}" alt="${esc(e.title.en)}" loading="lazy" />` : ''}</div>
    <div class="ev__body">
      <p class="ev__meta mono"><span class="ev__cat">${tx(c)}</span><span>${esc(dateText(e))}</span></p>
      ${badge}
      <h3 class="ev__title">${esc(tx(e.title))}</h3>
      ${e.location ? `<p class="ev__loc">${esc(e.location)}</p>` : ''}
      ${tx(e.desc) ? `<p class="ev__desc">${esc(tx(e.desc))}</p>` : ''}
      ${e.link ? `<span class="ev__more mono">${tx(L.more)} →</span>` : ''}
    </div>
  </${tag}>`;
}

function after(root) {
  // images that fail to load leave the kanji artwork
  $$('img.slot', root).forEach((img) => {
    const ok = () => img.closest('.ev')?.classList.add('has-img');
    if (img.complete) { img.naturalWidth ? ok() : img.remove(); }
    img.addEventListener('load', ok);
    img.addEventListener('error', () => img.remove());
  });
  initReveals(root);
  initTilt(root);
  ScrollTrigger.refresh();
}

/* ---------- home: featured + 3 ---------- */
export async function renderHome() {
  const el = $('#eventsHome');
  if (!el) return;
  const { upcoming, past } = await loadEvents();
  const draw = () => {
    const lead = upcoming[0] || past.find((e) => e.featured) || past[0];
    if (!lead) { el.closest('section').hidden = true; return; }
    const rest = [...upcoming, ...past].filter((e) => e !== lead).slice(0, 3);
    el.innerHTML = card(lead, { big: true }) + `<div class="evhome__side">${rest.map((e) => card(e)).join('')}</div>`;
    after(el);
  };
  draw();
  onLangChange(draw);
}

/* ---------- /events/ page with filters ---------- */
export async function renderPage() {
  const el = $('#eventsPage');
  if (!el) return;
  const data = await loadEvents();
  let filter = 'all';
  const draw = () => {
    let list = data.all;
    if (filter === 'upcoming') list = data.upcoming;
    if (filter === 'results') list = data.past.filter((e) => (CAT[e.category] || {}).group === 'results');
    if (filter === 'training') list = data.all.filter((e) => (CAT[e.category] || {}).group === 'training');
    el.innerHTML = list.map((e, i) => card(e, { big: i === 0 && e.upcoming })).join('');
    $('#eventsEmpty').hidden = list.length > 0;
    after(el);
  };
  $$('#eventTabs .tab').forEach((b) => b.addEventListener('click', () => {
    $$('#eventTabs .tab').forEach((x) => x.classList.toggle('is-on', x === b));
    filter = b.dataset.f;
    gsap.to(el, { opacity: 0, y: 10, duration: 0.2, onComplete() { draw(); gsap.to(el, { opacity: 1, y: 0, duration: 0.4 }); } });
  }));
  draw();
  onLangChange(draw);

  // Event structured data for upcoming events (Google rich results)
  const ld = data.upcoming.map((e) => ({
    '@context': 'https://schema.org', '@type': 'Event',
    name: e.title.en, startDate: e.date.toISOString().slice(0, 10),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: e.location || 'Alchemy Karate Academy', address: { '@type': 'PostalAddress', addressLocality: 'El Paso', addressRegion: 'TX', addressCountry: 'US' } },
    description: e.desc.en, image: e.image ? location.origin + e.image : undefined,
    organizer: { '@type': 'SportsOrganization', name: 'Alchemy Karate Academy', url: location.origin + '/' },
  }));
  if (ld.length) {
    const s = document.createElement('script');
    s.type = 'application/ld+json'; s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }
}
