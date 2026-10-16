// Bilingual copy. English lives in index.html (source of truth for SEO);
// Spanish lives here. Elements opt in with data-i18n="key".

const es = {
  'intro.kicker': 'Alchemy Karate Academy · El Paso, TX',
  'intro.hold': 'Mantén para romper',
  'intro.hint': 'Presiona y mantén. Respira. Golpea.',
  'intro.skip': 'Saltar intro',
  'intro.sound': 'Sonido',

  'nav.path': 'El Camino',
  'nav.programs': 'Programas',
  'nav.arena': 'Arena',
  'nav.locations': 'Dojos',
  'nav.cta': 'Clase Gratis',

  'hero.eyebrow': 'Escuela de Artes Marciales · 3 Dojos en El Paso',
  'hero.l1': 'Convertimos lo',
  'hero.ordinary': 'ORDINARIO',
  'hero.l3': 'en',
  'hero.extra': 'EXTRAORDINARIO',
  'hero.sub': 'Karate, kickboxing y liderazgo para niños, jóvenes y adultos. Formamos confianza, disciplina y campeones, una cinta a la vez.',
  'hero.cta1': 'Reserva tu clase gratis',
  'hero.cta2': 'Conoce el camino',
  'hero.m1t': '3 Dojos',
  'hero.m1': 'East · Far East · Horizon',
  'hero.m2t': 'Team USA',
  'hero.m2': 'Atletas en el Mundial WAKO',
  'hero.m3t': 'Niños a adultos',
  'hero.m3': 'Karate · Kickboxing · Liderazgo',
  'hero.scroll': 'Desliza',

  'v.respect': 'Respeto',
  'v.discipline': 'Disciplina',
  'v.focus': 'Enfoque',
  'v.confidence': 'Confianza',
  'v.courage': 'Valor',
  'v.leadership': 'Liderazgo',

  'manifesto.eyebrow': 'La Alquimia',
  'manifesto.text': 'Todo cinta negra fue alguna vez un cinta blanca que se negó a rendirse. En nuestros dojos, los niños aprenden a saludar, a caer, a levantarse y a liderar. Esa es la alquimia.',

  'path.eyebrow': 'El Camino',
  'path.title': 'Siete cintas. Una transformación.',
  'b1.belt': 'Cinta Blanca', 'b1.v': 'El Inicio', 'b1.t': 'Toda leyenda empieza aquí. El primer saludo, la primera postura, la primera promesa de nunca rendirse.',
  'b2.belt': 'Cinta Amarilla', 'b2.v': 'Respeto', 'b2.t': 'Respeto al sensei, al dojo, a la familia y a uno mismo. La base de todo lo que viene.',
  'b3.belt': 'Cinta Naranja', 'b3.v': 'Disciplina', 'b3.t': 'Presentarse cuando cuesta. Practicar cuando nadie está viendo. Hábitos que se llevan a casa.',
  'b4.belt': 'Cinta Verde', 'b4.v': 'Enfoque', 'b4.t': 'Entrenar la mente para estar presente. En el dojo, en el salón de clases y en la mesa.',
  'b5.belt': 'Cinta Azul', 'b5.v': 'Confianza', 'b5.t': 'Pararse firme, alzar la voz y creer en lo que pueden lograr. Confianza ganada, no regalada.',
  'b6.belt': 'Cinta Café', 'b6.v': 'Valor', 'b6.t': 'Subir al tatami bajo presión. Enfrentar el miedo y seguir adelante.',
  'b7.belt': 'Cinta Negra', 'b7.v': 'Liderazgo', 'b7.t': 'No es el final. Es el inicio de guiar a otros por el mismo camino.',
  'b7.cta': 'Empieza en cinta blanca',

  'prog.eyebrow': 'Programas',
  'prog.title': 'Encuentra tu disciplina.',
  'p.try': 'Prueba una clase gratis →',
  'p1.tag': 'Niños y jóvenes', 'p1.t': 'Karate Infantil', 'p1.d': 'Confianza a través de pequeñas victorias. Clases estructuradas que forman enfoque, respeto, coordinación y el valor de intentarlo.',
  'p2.tag': 'Días de escuela', 'p2.t': 'Después de Clases', 'p2.d': 'Hacemos que la tarde sea la mejor parte de su día.',
  'p2.l1': 'Transporte desde la escuela', 'p2.l2': 'Snack', 'p2.l3': 'Clase de karate', 'p2.l4': 'Tiempo de tarea', 'p2.l5': 'Cena completa',
  'p3.tag': 'Adultos', 'p3.t': 'Kickboxing Fitness', 'p3.d': 'Quema calorías, gana fuerza y entrena como peleador.',
  'p4.tag': 'Team Alchemy', 'p4.t': 'Equipo de Competencia', 'p4.d': 'De torneos locales al Campeonato Mundial WAKO con Team USA.',
  'p5.tag': 'Mentoría', 'p5.t': 'Programa de Liderazgo', 'p5.d': 'Seminarios y mentoría que convierten alumnos en líderes dentro y fuera del tatami.',
  'p6.tag': 'Todo el año', 'p6.t': 'Campamentos y Cumpleaños', 'p6.d': 'Campamentos de spring break, verano, sparring y gimnasia. Fiestas de cumpleaños con kiai.',

  'arena.w1': 'PRESIÓN.', 'arena.w2': 'ENFOQUE.', 'arena.w3': 'GLORIA.',
  'arena.cap': 'Hechos para el gran escenario',
  'f1.k': 'Jesolo, Italia · 2026', 'f1.t': 'Mundial Juvenil WAKO', 'f1.d': 'Team Alchemy compitiendo con Team USA en el escenario mundial.',
  'f2.k': 'El Paso County Coliseum', 'f2.t': 'Battle of the Champions', 'f2.d': 'Nuestro propio torneo. Toda la ciudad viendo.',
  'f3.k': 'Campeonato Panamericano', 'f3.t': 'Campeones que traen el oro', 'f3.d': 'Atletas de Alchemy en el podio, representando a El Paso.',
  's1': 'dojos en El Paso', 's2': 'cintas entre el primer día y la negra', 's3': 'familias y fans siguiendo el camino',

  't.eyebrow': 'Papás', 't.title': 'Ellos vieron el cambio.', 't.parent': 'Mamá / papá Alchemy',
  't1.q': 'Mi pequeño espera cada clase con emoción. Los instructores son pacientes y apasionados, y cada semana vemos más autodisciplina y concentración.',
  't2.q': 'A cinco meses, mi hijo muestra más confianza y enfoque en la escuela. Fue nuestra primera actividad extraescolar y estamos muy contentos.',
  't3.q': 'Un gran ambiente familiar con instructores con experiencia.',

  'd.eyebrow': 'Sedes', 'd.title': 'Tres dojos. Una familia.', 'd.call': 'Llamar', 'd.dir': 'Cómo llegar',

  'j.eyebrow': 'Clase de prueba gratis',
  'j.t1': 'Tu primera clase', 'j.t2': 'va por nuestra cuenta.',
  'j.sub': 'Trae a tu hijo. Ven tú. No necesitas experiencia, solo las ganas de empezar.',
  'j.name': 'Nombre del papá o alumno', 'j.phone': 'Teléfono', 'j.program': 'Programa', 'j.loc': 'Dojo más cercano', 'j.age': 'Edad del alumno',
  'j.submit': 'Reservar mi clase gratis',
  'j.ok': 'Lo recibimos. Nuestro equipo te contactará pronto para agendar tu clase gratis.',

  'foot.tag': 'Convertimos lo ordinario en extraordinario.',
};

const en = {};
const listeners = [];
let current = 'en';

export function t(key) {
  return (current === 'es' ? es[key] : en[key]) ?? en[key] ?? key;
}
export function lang() { return current; }
export function onLangChange(fn) { listeners.push(fn); }

export function setLang(l) {
  current = l === 'es' ? 'es' : 'en';
  document.documentElement.lang = current;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = t(el.dataset.i18n);
    if (v != null) el.innerHTML = v;
  });
  document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('is-active', b.dataset.lang === current));
  try { localStorage.setItem('aka-lang', current); } catch (e) { /* storage blocked */ }
  listeners.forEach((fn) => fn(current));
}

export function initI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    if (!(el.dataset.i18n in en)) en[el.dataset.i18n] = el.innerHTML;
  });
  let saved = null;
  try { saved = localStorage.getItem('aka-lang'); } catch (e) { /* ignore */ }
  const initial = saved || ((navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en');
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  if (initial !== 'en') setLang(initial);
}
