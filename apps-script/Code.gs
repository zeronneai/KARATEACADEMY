/**
 * ALCHEMY KARATE ACADEMY · Free class leads + Events
 * Google Apps Script bound to the Google Sheet (Extensions > Apps Script).
 *
 *  POST  (website form)      -> saves the lead in "Leads", emails the family and the owner
 *  GET   ?action=events      -> returns the "Events" tab as JSON for the website
 *
 * Setup guide: apps-script/README.md
 */

const CONFIG = {
  ACADEMY: 'Alchemy Karate Academy',
  OWNER_EMAILS: 'Alchemykarateacademy@live.com', // several: 'a@x.com, b@y.com'
  REPLY_TO: 'Alchemykarateacademy@live.com',
  SITE_URL: 'https://alchemykarateacademy.com',
  LOGO_URL: 'https://alchemykarateacademy.com/email-logo.png',
  INSTAGRAM: 'https://www.instagram.com/alchemykarateacademy',
  LEADS_SHEET: 'Leads',
  EVENTS_SHEET: 'Events',
  TIMEZONE: 'America/Denver', // El Paso
  DOJOS: {
    'East': { phone: '(915) 921-5677', tel: '+19159215677', address: '1613 N Zaragoza Rd, Ste 104, El Paso, TX 79936' },
    'Far East': { phone: '(915) 588-0753', tel: '+19155880753', address: '3560 N Zaragoza Rd, Suite 210, El Paso, TX 79938' },
    'Horizon': { phone: '(915) 500-4072', tel: '+19155004072', address: '13750 Eastlake Blvd, Suite 200, El Paso, TX 79928' },
  },
};

const LEAD_HEADERS = ['Timestamp', 'Name', 'Email', 'Phone', 'Student age', 'Program', 'Dojo', 'Language', 'Page', 'Landing page', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'Status', 'Notes'];
const EVENT_HEADERS = ['published', 'date', 'date_label_en', 'date_label_es', 'category', 'title_en', 'title_es', 'location', 'desc_en', 'desc_es', 'image', 'link', 'featured'];
const CATEGORIES = ['tournament', 'achievement', 'training', 'seminar', 'camp', 'graduation', 'motivation'];
const STATUSES = ['New', 'Contacted', 'Booked', 'Attended', 'Joined', 'Not interested'];

/* =========================================================
   WEB APP
   ========================================================= */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // honeypot: bots fill the hidden "company" field. Pretend success, save nothing.
    if (d.company) return json({ ok: true });

    const name = clean(d.name, 120);
    const email = clean(d.email, 160).toLowerCase();
    const phone = clean(d.phone, 40);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || phone.replace(/\D/g, '').length < 10) {
      return json({ ok: false, error: 'invalid' });
    }

    // simple duplicate guard: same email within 2 minutes
    const cache = CacheService.getScriptCache();
    if (cache.get('lead:' + email)) return json({ ok: true, duplicate: true });
    cache.put('lead:' + email, '1', 120);

    const lead = {
      name: name, email: email, phone: phone,
      age: clean(d.age, 10), program: clean(d.program, 60), dojo: clean(d.location, 40),
      lang: d.lang === 'es' ? 'es' : 'en', page: clean(d.page, 200), landing: clean(d.landing, 200),
      utm_source: clean(d.utm_source, 100), utm_medium: clean(d.utm_medium, 100),
      utm_campaign: clean(d.utm_campaign, 100), utm_content: clean(d.utm_content, 100),
    };

    sheet_(CONFIG.LEADS_SHEET, LEAD_HEADERS).appendRow([
      new Date(), lead.name, lead.email, lead.phone, lead.age, lead.program, lead.dojo, lead.lang,
      lead.page, lead.landing, lead.utm_source, lead.utm_medium, lead.utm_campaign, lead.utm_content, 'New', '',
    ]);

    // emails never block the lead from being saved
    try { sendFamilyEmail_(lead); } catch (err) { console.error('family email', err); }
    try { sendOwnerEmail_(lead); } catch (err) { console.error('owner email', err); }

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const action = e && e.parameter && e.parameter.action;
  if (action === 'events') {
    const cache = CacheService.getScriptCache();
    const hit = cache.get('events');
    if (hit) return ContentService.createTextOutput(hit).setMimeType(ContentService.MimeType.JSON);
    const out = JSON.stringify({ ok: true, events: readEvents_() });
    cache.put('events', out, 300); // 5 minutes
    return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
  }
  return json({ ok: true, service: CONFIG.ACADEMY });
}

/** Clears the events cache whenever someone edits the Events tab (simple trigger). */
function onEdit(e) {
  if (e && e.range && e.range.getSheet().getName() === CONFIG.EVENTS_SHEET) {
    CacheService.getScriptCache().remove('events');
  }
}

function readEvents_() {
  const sh = SpreadsheetApp.getActive().getSheetByName(CONFIG.EVENTS_SHEET);
  if (!sh || sh.getLastRow() < 2) return [];
  const values = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  const head = values.shift().map(function (h) { return String(h).trim(); });
  return values
    .map(function (row) {
      const o = {};
      head.forEach(function (h, i) { o[h] = row[i]; });
      return o;
    })
    .filter(function (o) { return o.title_en && String(o.published).toUpperCase() !== 'FALSE'; })
    .map(function (o) {
      if (o.date instanceof Date) o.date = Utilities.formatDate(o.date, CONFIG.TIMEZONE, 'yyyy-MM-dd');
      o.featured = String(o.featured).toUpperCase() === 'TRUE';
      delete o.published;
      return o;
    });
}

/* =========================================================
   EMAILS
   ========================================================= */
function sendFamilyEmail_(lead) {
  const es = lead.lang === 'es';
  const first = lead.name.split(' ')[0];
  const dojo = CONFIG.DOJOS[lead.dojo];
  const subject = es ? '¡OSS! Tu clase gratis en Alchemy Karate Academy' : 'OSS! Your free class at Alchemy Karate Academy';
  const rows = [
    [es ? 'Programa' : 'Program', lead.program],
    [es ? 'Dojo' : 'Dojo', lead.dojo + (dojo ? '<br><span style="color:#8d8a85">' + esc(dojo.address) + '</span>' : '')],
    [es ? 'Teléfono' : 'Phone', esc(lead.phone)],
  ];
  const body = es
    ? '<p>Hola ' + esc(first) + ',</p><p>Recibimos tu solicitud para una <b>clase de prueba gratis</b>. Nuestro equipo te va a contactar muy pronto para confirmar el día y la hora.</p>'
    : '<p>Hi ' + esc(first) + ',</p><p>We received your request for a <b>free trial class</b>. Our team will reach out very soon to confirm the day and time.</p>';
  const bring = es
    ? '<p style="margin:24px 0 6px;font-weight:700">Qué llevar</p><p style="margin:0;color:#b9b5ae">Ropa deportiva cómoda, una botella de agua y muchas ganas. No necesitas experiencia.</p>'
    : '<p style="margin:24px 0 6px;font-weight:700">What to bring</p><p style="margin:0;color:#b9b5ae">Comfortable athletic clothes, a water bottle and the will to start. No experience needed.</p>';
  const cta = dojo
    ? button_('tel:' + dojo.tel, (es ? 'Llamar al dojo ' : 'Call the ') + lead.dojo + (es ? '' : ' dojo') + ' · ' + dojo.phone)
    : '';
  const html = layout_(
    es ? 'Tu primera clase va por nuestra cuenta.' : 'Your first class is on us.',
    body + table_(rows) + bring + cta +
    '<p style="margin:28px 0 0;color:#8d8a85;font-size:13px">' + (es ? 'Síguenos en ' : 'Follow us on ') +
    '<a href="' + CONFIG.INSTAGRAM + '" style="color:#ff2a33">@alchemykarateacademy</a></p>'
  );
  MailApp.sendEmail({ to: lead.email, subject: subject, htmlBody: html, name: CONFIG.ACADEMY, replyTo: CONFIG.REPLY_TO });
}

function sendOwnerEmail_(lead) {
  const digits = lead.phone.replace(/\D/g, '');
  const intl = digits.length === 10 ? '1' + digits : digits;
  const rows = [
    ['Name', esc(lead.name)],
    ['Phone', '<a href="tel:+' + intl + '" style="color:#ff2a33">' + esc(lead.phone) + '</a>'],
    ['Email', '<a href="mailto:' + esc(lead.email) + '" style="color:#ff2a33">' + esc(lead.email) + '</a>'],
    ['Program', esc(lead.program)],
    ['Dojo', esc(lead.dojo)],
    ['Student age', esc(lead.age || '-')],
    ['Language', lead.lang === 'es' ? 'Español' : 'English'],
    ['Came from', esc(lead.landing || lead.page) + (lead.utm_source ? ' · ' + esc(lead.utm_source) + ' / ' + esc(lead.utm_campaign) : '')],
  ];
  const html = layout_(
    'New free class request',
    '<p>A new family wants to try a class. Call them while they are hot.</p>' + table_(rows) +
    button_('tel:+' + intl, 'Call ' + lead.name.split(' ')[0]) +
    button_('https://wa.me/' + intl, 'WhatsApp', true) +
    '<p style="margin:26px 0 0;font-size:13px;color:#8d8a85">Reply to this email to answer the family directly. All leads: <a href="' +
    SpreadsheetApp.getActive().getUrl() + '" style="color:#ff2a33">open the Sheet</a>.</p>'
  );
  MailApp.sendEmail({
    to: CONFIG.OWNER_EMAILS,
    subject: 'New free class · ' + lead.name + ' · ' + (lead.program || '') + ' · ' + (lead.dojo || ''),
    htmlBody: html, name: 'Alchemy Website', replyTo: lead.email,
  });
}

function layout_(title, inner) {
  return '<div style="background:#0a0a0b;padding:32px 12px;font-family:Helvetica,Arial,sans-serif">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#121214;border:1px solid #26262b;border-radius:18px;overflow:hidden">' +
    '<tr><td style="height:6px;background:#e3121b"></td></tr>' +
    '<tr><td style="padding:30px 32px 6px;text-align:center"><img src="' + CONFIG.LOGO_URL + '" width="150" alt="' + CONFIG.ACADEMY + '" style="display:inline-block;max-width:150px;height:auto"></td></tr>' +
    '<tr><td style="padding:10px 32px 34px;color:#f2ede4;font-size:16px;line-height:1.55">' +
    '<h1 style="margin:10px 0 18px;font-size:28px;line-height:1.05;text-transform:uppercase;letter-spacing:.5px;color:#f2ede4">' + title + '</h1>' +
    inner + '</td></tr>' +
    '<tr><td style="padding:18px 32px;background:#0d0d0f;color:#8d8a85;font-size:12px;text-align:center">' + CONFIG.ACADEMY + ' · El Paso, TX · <a href="' + CONFIG.SITE_URL + '" style="color:#8d8a85">' + CONFIG.SITE_URL.replace('https://', '') + '</a></td></tr>' +
    '</table></div>';
}
function table_(rows) {
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border:1px solid #26262b;border-radius:12px">' +
    rows.map(function (r, i) {
      return '<tr><td style="padding:12px 14px;color:#8d8a85;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:34%;' + (i ? 'border-top:1px solid #26262b;' : '') + '">' + r[0] +
        '</td><td style="padding:12px 14px;color:#f2ede4;' + (i ? 'border-top:1px solid #26262b;' : '') + '">' + r[1] + '</td></tr>';
    }).join('') + '</table>';
}
function button_(href, label, ghost) {
  return '<a href="' + href + '" style="display:inline-block;margin:8px 8px 0 0;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:700;font-size:14px;' +
    (ghost ? 'border:1px solid #3a3a40;color:#f2ede4' : 'background:#e3121b;color:#ffffff') + '">' + esc(label) + '</a>';
}

/* =========================================================
   ONE-TIME SETUP: run this once from the editor (Run > setup)
   ========================================================= */
function setup() {
  const leads = sheet_(CONFIG.LEADS_SHEET, LEAD_HEADERS);
  styleHeader_(leads, LEAD_HEADERS.length, '#e3121b');
  leads.setColumnWidths(1, LEAD_HEADERS.length, 140);
  leads.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
  leads.getRange(2, 15, 999, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build());

  const events = sheet_(CONFIG.EVENTS_SHEET, EVENT_HEADERS);
  styleHeader_(events, EVENT_HEADERS.length, '#111111');
  events.setColumnWidths(1, EVENT_HEADERS.length, 160);
  events.getRange('B:B').setNumberFormat('yyyy-mm-dd');
  events.getRange(2, 1, 999, 1).insertCheckboxes();
  events.getRange(2, 13, 999, 1).insertCheckboxes();
  events.getRange(2, 5, 999, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(CATEGORIES, true).build());

  if (events.getLastRow() < 2) {
    const seed = [
      [true, '2026-09-05', '', '', 'tournament', 'Battle of the Champions 2026', 'Battle of the Champions 2026', 'El Paso Coliseum', 'Our own tournament, hosted by Alchemy Karate Academy with competitors from across the region.', 'Nuestro propio torneo, organizado por Alchemy Karate Academy con competidores de toda la región.', '/media/events/battle-of-the-champions-2026.jpg', '', true],
      [true, '2026-08-01', '2026', '2026', 'achievement', 'WAKO Youth World Championships', 'Mundial Juvenil WAKO', 'Jesolo, Italy', 'Team Alchemy athletes competed on the world stage representing Team USA.', 'Atletas de Team Alchemy compitieron en el escenario mundial representando a Team USA.', '/media/events/wako-worlds-2026.jpg', '', true],
      [true, '2026-07-15', '2026', '2026', 'achievement', 'Victor Montanez, Panamerican Champion', 'Victor Montanez, Campeón Panamericano', 'WAKO Panamerican & South American Championships', 'Gold in -79kg Kick Light and Light Contact.', 'Oro en -79kg Kick Light y Light Contact.', '/media/events/victor-montanez.jpg', '', false],
      [true, '2026-06-08', 'June 8, 10 & 12, 2026', '8, 10 y 12 de junio, 2026', 'camp', 'Karate Summer Camp', 'Campamento de Verano', 'All locations', 'Gymnastics, sparring and X-Zone camp days.', 'Días de gimnasia, sparring y X-Zone.', '/media/events/summer-camp-2026.jpg', '', false],
      [true, '2026-04-04', 'Saturday, April 4, 2026 · 10:00 AM', 'Sábado 4 de abril, 2026 · 10:00 AM', 'graduation', 'Belt Graduation Day', 'Día de Graduación de Cintas', 'Hanks High School, 2001 Lee Trevino Dr', 'All students, all belts, all locations. A day to celebrate the hard work.', 'Todos los alumnos, todas las cintas, todas las sedes. Un día para celebrar el esfuerzo.', '/media/events/graduation-2026-04.jpg', '', false],
      [true, '2026-03-09', 'March 9, 11 & 13, 2026', '9, 11 y 13 de marzo, 2026', 'camp', 'Spring Break Camps', 'Campamentos de Spring Break', 'All locations', 'Gymnastics camp, sparring camp and a fun day at X-Zone.', 'Campamento de gimnasia, de sparring y un día de diversión en X-Zone.', '/media/events/spring-break-2026.jpg', '', false],
      [true, '2026-10-01', '', '', 'motivation', 'Pressure. Focus.', 'Presión. Enfoque.', '', 'See everyone watching. See the goal.', 'Mira a todos observando. Mira la meta.', '/media/wall/pressure-focus.jpg', '', false],
      [true, '2026-09-20', '', '', 'motivation', 'Behind every strong karateka', 'Detrás de cada karateka fuerte', '', 'Is a sensei who believed in them first.', 'Hay un sensei que creyó en él primero.', '/media/wall/sensei-ladder.jpg', '', false],
      [true, '2026-08-15', '', '', 'motivation', 'Making after-school the best part of their day', 'Hacemos que la tarde sea la mejor parte de su día', '', 'Transportation, snack, karate class, homework time and a full dinner.', 'Transporte, snack, clase de karate, tarea y cena completa.', '/media/wall/after-school.jpg', '/programs/after-school/', false],
      [true, '2026-02-01', '2026', '2026', 'seminar', 'Leadership Seminar', 'Seminario de Liderazgo', 'East location', 'Full leadership uniform, swords required, and a surprise for everyone.', 'Uniforme completo de liderazgo, espadas obligatorias y una sorpresa para todos.', '/media/events/leadership-seminar.jpg', '', false],
    ];
    events.getRange(2, 1, seed.length, seed[0].length).setValues(seed);
  }
  SpreadsheetApp.getActive().toast('Leads and Events tabs are ready.', 'Alchemy', 5);
}

/** Run once to test the emails without the website. */
function testLead() {
  const fake = { postData: { contents: JSON.stringify({ name: 'Test Parent', email: Session.getActiveUser().getEmail(), phone: '9155550100', age: '8', program: 'Kids Karate', location: 'East', lang: 'en', page: '/' }) } };
  console.log(doPost(fake).getContent());
}

/* =========================================================
   HELPERS
   ========================================================= */
function sheet_(name, headers) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) { sh.appendRow(headers); sh.setFrozenRows(1); }
  return sh;
}
function styleHeader_(sh, n, color) {
  sh.getRange(1, 1, 1, n).setBackground(color).setFontColor('#ffffff').setFontWeight('bold');
}
function clean(v, max) { return String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
