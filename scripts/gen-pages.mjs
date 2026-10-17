// Generates the SEO pages from src/data/site.js:
//   /programs/<slug>/index.html, /locations/<slug>/index.html, /events/index.html,
//   public/sitemap.xml and public/robots.txt
// Runs automatically before `npm run dev` and `npm run build`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, BRAND, EMAIL, SOCIAL, programs, dojos } from '../src/data/site.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const write = (rel, content) => {
  const file = resolve(root, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const bi = (o) => `<span data-l="en">${esc(o.en)}</span><span data-l="es">${esc(o.es)}</span>`;
const t = (en, es) => bi({ en, es });

const orgRef = { '@type': 'SportsOrganization', name: BRAND, url: SITE_URL + '/' };
const dojoLd = (d) => ({
  '@context': 'https://schema.org',
  '@type': 'SportsActivityLocation',
  '@id': `${SITE_URL}/locations/${d.slug}/#dojo`,
  name: `${BRAND} · ${d.name}`,
  url: `${SITE_URL}/locations/${d.slug}/`,
  telephone: d.tel,
  email: EMAIL,
  image: `${SITE_URL}/logo.webp`,
  sport: ['Karate', 'Kickboxing'],
  address: { '@type': 'PostalAddress', streetAddress: d.street, addressLocality: d.city, addressRegion: d.region, postalCode: d.zip, addressCountry: 'US' },
  parentOrganization: orgRef,
});

function head({ title, desc, path, ld = [] }) {
  const url = SITE_URL + path;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${url}" />
  <meta name="theme-color" content="#0a0a0b" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${BRAND}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE_URL}/logo.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
${ld.map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>`;
}

const crumbsLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE_URL + path })),
});

const ctaBand = `
    <section class="cta-band">
      <div class="cta-band__k" aria-hidden="true">押忍</div>
      <p class="eyebrow mono">${t('Free trial class', 'Clase de prueba gratis')}</p>
      <h2 class="cta-band__title">${t('Your first class', 'Tu primera clase')}<br /><span class="gold">${t('is on us.', 'va por nuestra cuenta.')}</span></h2>
      <a href="#free-class" data-open-drawer class="btn btn--red magnetic">${t('Book my free class', 'Reservar mi clase gratis')}<i class="arrow">→</i></a>
    </section>`;

const dojosMini = (exclude) => `
    <section class="pblock" id="dojos">
      <div class="section-head">
        <p class="eyebrow mono">${t('Locations', 'Sedes')}</p>
        <h2 class="h2">${t('Find your dojo.', 'Encuentra tu dojo.')}</h2>
      </div>
      <div class="dojo-cards">
${dojos.filter((d) => d.slug !== exclude).map((d) => `        <article class="dojo-card reveal">
          <span class="mono dojo-card__n">${d.zip}</span>
          <h3><a href="/locations/${d.slug}/">${esc(d.name)}</a></h3>
          <p>${esc(d.street)}<br />${d.city}, ${d.region} ${d.zip}</p>
          <div class="dojo__actions"><a class="btn btn--ghost btn--sm" href="tel:${d.tel}">${t('Call', 'Llamar')} ${d.phone}</a><a class="btn btn--ghost btn--sm" href="/locations/${d.slug}/">${t('View dojo', 'Ver dojo')}</a></div>
        </article>`).join('\n')}
      </div>
    </section>`;

const tail = (script = '/src/page.js') => `
  </main>
  <!-- @include footer -->
  <!-- @include drawer -->
  <script type="module" src="${script}"></script>
</body>
</html>
`;

/* ---------------- PROGRAM PAGES ---------------- */
programs.forEach((p, i) => {
  const path = `/programs/${p.slug}/`;
  const others = programs.filter((o) => o.slug !== p.slug);
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'Service',
      name: p.name.en, serviceType: p.name.en, description: p.metaDesc,
      provider: orgRef, areaServed: { '@type': 'City', name: 'El Paso, TX' }, url: SITE_URL + path,
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q.en, acceptedAnswer: { '@type': 'Answer', text: f.a.en } })),
    },
    crumbsLd([['Home', '/'], ['Programs', '/#programs'], [p.name.en, path]]),
  ];
  const html = `${head({ title: `${p.metaTitle} | ${BRAND}`, desc: p.metaDesc, path, ld })}
<body class="page page--program tone-${p.tone}" data-program="${p.slug}">
  <!-- @include nav -->
  <main>
    <section class="phero">
      <div class="phero__media"><img class="slot" src="/media/programs/${p.slug}.jpg" alt="${esc(p.name.en)} at ${BRAND}" /></div>
      <div class="phero__glow" aria-hidden="true"></div>
      <div class="phero__kanji" aria-hidden="true">${p.kanji}</div>
      <div class="phero__inner">
        <nav class="crumbs mono" aria-label="Breadcrumb"><a href="/">${t('Home', 'Inicio')}</a><i>/</i><a href="/#programs">${t('Programs', 'Programas')}</a><i>/</i><span>${bi(p.name)}</span></nav>
        <p class="eyebrow mono">${bi(p.tag)} · <span class="mono">0${i + 1}</span></p>
        <h1 class="phero__title">${bi(p.name)}</h1>
        <p class="phero__headline">${bi(p.headline)}</p>
        <p class="phero__lead">${bi(p.lead)}</p>
        <div class="hero__ctas">
          <a href="#free-class" data-open-drawer class="btn btn--red magnetic">${t('Book a free class', 'Reserva una clase gratis')}<i class="arrow">→</i></a>
          <a href="#dojos" class="btn btn--ghost">${t('Find a dojo', 'Busca tu dojo')}</a>
        </div>
      </div>
    </section>

    <section class="pblock">
      <div class="section-head">
        <p class="eyebrow mono">${t('What they build', 'Lo que construyen')}</p>
        <h2 class="h2">${t('Built on the mat.', 'Se forja en el tatami.')}<br />${t('Seen everywhere.', 'Se nota en todos lados.')}</h2>
      </div>
      <div class="benefits">
${p.benefits.map((b) => `        <article class="benefit reveal"><span class="benefit__k" aria-hidden="true">${b.k}</span><h3>${bi(b.t)}</h3><p>${bi(b.d)}</p></article>`).join('\n')}
      </div>
    </section>

    <section class="pblock">
      <div class="section-head">
        <p class="eyebrow mono">${t('How it starts', 'Cómo empieza')}</p>
        <h2 class="h2">${t('Three steps to the mat.', 'Tres pasos al tatami.')}</h2>
      </div>
      <ol class="steps">
        <li class="reveal"><b>01</b><h3>${t('Book your free class', 'Reserva tu clase gratis')}</h3><p>${t('Send the form in 30 seconds. We confirm by phone or email.', 'Manda el formulario en 30 segundos. Te confirmamos por teléfono o correo.')}</p></li>
        <li class="reveal"><b>02</b><h3>${t('Train with us', 'Entrena con nosotros')}</h3><p>${t('Meet the instructors, feel the energy of the dojo and try a real class.', 'Conoce a los instructores, siente la energía del dojo y prueba una clase real.')}</p></li>
        <li class="reveal"><b>03</b><h3>${t('Start your path', 'Empieza tu camino')}</h3><p>${t('We help you choose the right program and schedule for your family.', 'Te ayudamos a elegir el programa y horario ideal para tu familia.')}</p></li>
      </ol>
    </section>

    <section class="pblock">
      <div class="section-head">
        <p class="eyebrow mono">FAQ</p>
        <h2 class="h2">${t('Questions parents ask.', 'Preguntas de los papás.')}</h2>
      </div>
      <div class="faq">
${p.faq.map((f) => `        <details class="faq__item reveal"><summary>${bi(f.q)}<i aria-hidden="true">+</i></summary><p>${bi(f.a)}</p></details>`).join('\n')}
      </div>
    </section>

    <section class="pblock">
      <div class="section-head">
        <p class="eyebrow mono">${t('Keep exploring', 'Sigue explorando')}</p>
        <h2 class="h2">${t('More programs.', 'Más programas.')}</h2>
      </div>
      <div class="related">
${others.map((o) => `        <a class="related__item reveal" href="/programs/${o.slug}/"><span class="related__k" aria-hidden="true">${o.kanji}</span><span class="mono">${bi(o.tag)}</span><b>${bi(o.name)}</b><i class="arrow">→</i></a>`).join('\n')}
      </div>
    </section>
${dojosMini()}
${ctaBand}
${tail()}`;
  write(`programs/${p.slug}/index.html`, html);
});

/* ---------------- LOCATION PAGES ---------------- */
dojos.forEach((d) => {
  const path = `/locations/${d.slug}/`;
  const full = `${d.street}, ${d.city}, ${d.region} ${d.zip}`;
  const q = encodeURIComponent(`${BRAND} ${full}`);
  const ld = [dojoLd(d), crumbsLd([['Home', '/'], ['Dojos', '/#dojos'], [d.name, path]])];
  const html = `${head({ title: `${d.metaTitle} | ${BRAND}`, desc: d.metaDesc, path, ld })}
<body class="page page--dojo" data-dojo="${d.slug}">
  <!-- @include nav -->
  <main>
    <section class="phero phero--dojo">
      <div class="phero__media"><img class="slot" src="/media/locations/${d.slug}.jpg" alt="${BRAND} ${esc(d.name)} dojo" /></div>
      <div class="phero__glow" aria-hidden="true"></div>
      <div class="phero__kanji" aria-hidden="true">道場</div>
      <div class="phero__inner">
        <nav class="crumbs mono" aria-label="Breadcrumb"><a href="/">${t('Home', 'Inicio')}</a><i>/</i><a href="/#dojos">Dojos</a><i>/</i><span>${esc(d.name)}</span></nav>
        <p class="eyebrow mono">${bi(d.title)}</p>
        <h1 class="phero__title">${esc(d.name)}</h1>
        <p class="phero__headline">${t('Karate, kickboxing and after-school in', 'Karate, kickboxing y después de clases en')} ${d.zip === '79928' ? 'Horizon / Eastlake' : 'El Paso ' + d.zip}.</p>
        <p class="phero__lead">${bi(d.area)}</p>
        <address class="addr"><span>${esc(d.street)}<br />${d.city}, ${d.region} ${d.zip}</span></address>
        <div class="hero__ctas">
          <a href="#free-class" data-open-drawer class="btn btn--red magnetic">${t('Book a free class', 'Reserva una clase gratis')}<i class="arrow">→</i></a>
          <a href="tel:${d.tel}" class="btn btn--ghost">${t('Call', 'Llamar')} ${d.phone}</a>
          <a href="https://www.google.com/maps/search/?api=1&amp;query=${q}" target="_blank" rel="noopener" class="btn btn--ghost">${t('Directions', 'Cómo llegar')}</a>
        </div>
      </div>
    </section>

    <section class="pblock">
      <div class="map reveal">
        <iframe title="Map to ${BRAND} ${esc(d.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${q}&amp;output=embed"></iframe>
      </div>
    </section>

    <section class="pblock">
      <div class="section-head">
        <p class="eyebrow mono">${t('Programs', 'Programas')}</p>
        <h2 class="h2">${t('Train at', 'Entrena en')} ${esc(d.name)}.</h2>
        <p class="section-note">${t('Schedules vary by dojo. Call us to confirm times for your program.', 'Los horarios varían por dojo. Llámanos para confirmar los horarios de tu programa.')}</p>
      </div>
      <div class="related">
${programs.map((o) => `        <a class="related__item reveal" href="/programs/${o.slug}/"><span class="related__k" aria-hidden="true">${o.kanji}</span><span class="mono">${bi(o.tag)}</span><b>${bi(o.name)}</b><i class="arrow">→</i></a>`).join('\n')}
      </div>
    </section>
${dojosMini(d.slug)}
${ctaBand}
${tail()}`;
  write(`locations/${d.slug}/index.html`, html);
});

/* ---------------- EVENTS PAGE ---------------- */
{
  const path = '/events/';
  const desc = 'Upcoming tournaments, results, belt graduations, camps and training seminars at Alchemy Karate Academy in El Paso, TX.';
  const html = `${head({ title: `Events, Results & Training | ${BRAND}`, desc, path, ld: [crumbsLd([['Home', '/'], ['Events', path]])] })}
<body class="page page--events">
  <!-- @include nav -->
  <main>
    <section class="phero phero--events">
      <div class="phero__glow" aria-hidden="true"></div>
      <div class="phero__kanji" aria-hidden="true">試合</div>
      <div class="phero__inner">
        <nav class="crumbs mono" aria-label="Breadcrumb"><a href="/">${t('Home', 'Inicio')}</a><i>/</i><span>${t('Events', 'Eventos')}</span></nav>
        <p class="eyebrow mono">${t('Events · Results · Training', 'Eventos · Resultados · Entrenamientos')}</p>
        <h1 class="phero__title">${t('The Arena', 'La Arena')}</h1>
        <p class="phero__headline">${t('Where Team Alchemy competes, wins, trains and celebrates.', 'Donde Team Alchemy compite, gana, entrena y celebra.')}</p>
      </div>
    </section>

    <section class="pblock">
      <div class="tabs" role="tablist" id="eventTabs">
        <button role="tab" class="tab is-on" data-f="all">${t('All', 'Todo')}</button>
        <button role="tab" class="tab" data-f="upcoming">${t('Upcoming', 'Próximos')}</button>
        <button role="tab" class="tab" data-f="results">${t('Results & wins', 'Resultados y logros')}</button>
        <button role="tab" class="tab" data-f="training">${t('Training & camps', 'Entrenamientos y campamentos')}</button>
      </div>
      <div class="ev-grid" id="eventsPage" aria-live="polite"></div>
      <p class="ev-empty" id="eventsEmpty" hidden>${t('New dates are announced soon. Follow us on Instagram for the latest.', 'Pronto anunciamos nuevas fechas. Síguenos en Instagram para enterarte primero.')} <a href="${SOCIAL.instagram}" target="_blank" rel="noopener">@alchemykarateacademy</a></p>
    </section>
${ctaBand}
${tail()}`;
  write('events/index.html', html);
}

/* ---------------- SITEMAP + ROBOTS ---------------- */
const today = new Date().toISOString().slice(0, 10);
const urls = ['/', '/events/', ...programs.map((p) => `/programs/${p.slug}/`), ...dojos.map((d) => `/locations/${d.slug}/`)];
write('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod><changefreq>${u === '/events/' ? 'weekly' : 'monthly'}</changefreq><priority>${u === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`);
write('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`[gen-pages] ${programs.length} programs, ${dojos.length} dojos, events, sitemap (${urls.length} urls)`);
