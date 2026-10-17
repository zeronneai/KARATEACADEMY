// Fallback events. When the Google Sheet is connected (VITE_SHEETS_ENDPOINT),
// the "Events" tab replaces this list, so the academy edits events from the Sheet.
// category: tournament | achievement | training | seminar | camp | graduation | motivation
// motivation rows do not show as events: they go to "The Dojo Wall" on /events/
// date: YYYY-MM-DD (used for sorting and "upcoming" vs "past")
// dateLabel: optional text shown instead of the exact date

export const fallbackEvents = [
  {
    date: '2026-09-05',
    category: 'tournament', featured: true,
    title: { en: 'Battle of the Champions 2026', es: 'Battle of the Champions 2026' },
    location: 'El Paso Coliseum',
    desc: { en: 'Our own tournament, hosted by Alchemy Karate Academy with competitors from across the region.', es: 'Nuestro propio torneo, organizado por Alchemy Karate Academy con competidores de toda la región.' },
    image: '/media/events/battle-of-the-champions-2026.jpg',
  },
  {
    date: '2026-08-01', dateLabel: { en: '2026', es: '2026' },
    category: 'achievement', featured: true,
    title: { en: 'WAKO Youth World Championships', es: 'Mundial Juvenil WAKO' },
    location: 'Jesolo, Italy',
    desc: { en: 'Team Alchemy athletes competed on the world stage representing Team USA.', es: 'Atletas de Team Alchemy compitieron en el escenario mundial representando a Team USA.' },
    image: '/media/events/wako-worlds-2026.jpg',
  },
  {
    date: '2026-08-16', dateLabel: { en: 'August 12 to 16, 2026', es: '12 al 16 de agosto, 2026' },
    category: 'achievement', featured: true,
    title: { en: 'Victor Montanez, Panamerican Champion', es: 'Victor Montanez, Campeón Panamericano' },
    location: 'Olmué, Chile · WAKO Panamerican & South American Championships',
    desc: { en: 'Gold in -79kg Kick Light and Light Contact.', es: 'Oro en -79kg Kick Light y Light Contact.' },
    image: '/media/events/victor-montanez.jpg',
  },
  {
    date: '2026-06-08', dateLabel: { en: 'June 8, 10 & 12, 2026', es: '8, 10 y 12 de junio, 2026' },
    category: 'camp',
    title: { en: 'Karate Summer Camp', es: 'Campamento de Verano' },
    location: 'All locations',
    desc: { en: 'Gymnastics (June 8), sparring (June 10) and X-Zone trampoline park (June 12).', es: 'Gimnasia (8 de junio), sparring (10 de junio) y X-Zone trampoline park (12 de junio).' },
    image: '/media/events/summer-camp-2026.jpg',
  },
  {
    date: '2026-04-04', dateLabel: { en: 'Saturday, April 4, 2026 · 10:00 AM', es: 'Sábado 4 de abril, 2026 · 10:00 AM' },
    category: 'graduation',
    title: { en: 'Belt Graduation Day', es: 'Día de Graduación de Cintas' },
    location: 'Hanks High School, 2001 Lee Trevino Dr',
    desc: { en: 'All students, all belts, all locations. A day to celebrate the hard work.', es: 'Todos los alumnos, todas las cintas, todas las sedes. Un día para celebrar el esfuerzo.' },
    image: '/media/events/graduation-2026-04.jpg',
  },
  {
    date: '2026-03-09', dateLabel: { en: 'March 9, 11 & 13, 2026', es: '9, 11 y 13 de marzo, 2026' },
    category: 'camp',
    title: { en: 'Spring Break Camps', es: 'Campamentos de Spring Break' },
    location: 'All locations',
    desc: { en: 'Gymnastics camp, sparring camp and a fun day at X-Zone.', es: 'Campamento de gimnasia, de sparring y un día de diversión en X-Zone.' },
    image: '/media/events/spring-break-2026.jpg',
  },
  {
    date: '2026-02-01', dateLabel: { en: '2026', es: '2026' },
    category: 'seminar',
    title: { en: 'Leadership Seminar', es: 'Seminario de Liderazgo' },
    location: 'East location',
    desc: { en: 'Full leadership uniform, swords required, and a surprise for everyone.', es: 'Uniforme completo de liderazgo, espadas obligatorias y una sorpresa para todos.' },
    image: '/media/events/leadership-seminar.jpg',
  },
  {
    date: '2024-09-01', dateLabel: { en: '2024', es: '2024' },
    category: 'achievement',
    title: { en: 'Team USA breaks records at Junior Worlds', es: 'Team USA rompe récords en el Mundial Junior' },
    location: 'WAKO Junior World Kickboxing Championships',
    desc: { en: 'Alchemy athletes were part of the Team USA squad that set records in 2024.', es: 'Atletas de Alchemy formaron parte del equipo de Team USA que rompió récords en 2024.' },
    image: '/media/events/junior-worlds-2024.jpg',
  },
  {
    date: '2026-10-01', category: 'motivation',
    title: { en: 'Pressure. Focus.', es: 'Presión. Enfoque.' },
    desc: { en: 'See everyone watching. See the goal.', es: 'Mira a todos observando. Mira la meta.' },
    image: '/media/wall/pressure-focus.jpg',
  },
  {
    date: '2026-09-20', category: 'motivation',
    title: { en: 'Behind every strong karateka', es: 'Detrás de cada karateka fuerte' },
    desc: { en: 'Is a sensei who believed in them first.', es: 'Hay un sensei que creyó en él primero.' },
    image: '/media/wall/sensei-ladder.jpg',
  },
  {
    date: '2026-08-15', category: 'motivation',
    title: { en: 'Making after-school the best part of their day', es: 'Hacemos que la tarde sea la mejor parte de su día' },
    desc: { en: 'Transportation, snack, karate class, homework time and a full dinner.', es: 'Transporte, snack, clase de karate, tarea y cena completa.' },
    image: '/media/wall/after-school.jpg',
    link: '/programs/after-school/',
  },
];
