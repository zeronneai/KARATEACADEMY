// Central content for generated pages (programs, dojos) and SEO.
// Used by scripts/gen-pages.mjs at build time. Every text is { en, es }.

export const SITE_URL = 'https://alchemykarateacademy.com';
export const BRAND = 'Alchemy Karate Academy';
export const EMAIL = 'Alchemykarateacademy@live.com';
export const SOCIAL = {
  instagram: 'https://www.instagram.com/alchemykarateacademy',
  facebook: 'https://www.facebook.com/ALCHEMYKARATEACADEMY',
};

export const programs = [
  {
    slug: 'kids-karate',
    kanji: '空手',
    tone: 'dark',
    name: { en: 'Kids Karate', es: 'Karate Infantil' },
    tag: { en: 'Kids & teens', es: 'Niños y jóvenes' },
    metaTitle: 'Kids Karate Classes in El Paso, TX',
    metaDesc: 'Karate classes for kids and teens in El Paso. Build confidence, focus, respect and discipline at Alchemy Karate Academy. Your first class is free.',
    headline: { en: 'Confidence is built one belt at a time.', es: 'La confianza se construye cinta por cinta.' },
    lead: {
      en: 'Structured karate classes where kids grow through small victories. Every class blends technique, fitness and character, so the lessons show up at school and at home.',
      es: 'Clases de karate estructuradas donde los niños crecen a base de pequeñas victorias. Cada clase combina técnica, condición física y carácter, para que lo aprendido se note en la escuela y en casa.',
    },
    benefits: [
      { k: '自信', t: { en: 'Confidence', es: 'Confianza' }, d: { en: 'Every new technique and every new belt proves to them that hard work pays off.', es: 'Cada técnica y cada cinta nueva les demuestra que el esfuerzo da resultados.' } },
      { k: '集中', t: { en: 'Focus', es: 'Enfoque' }, d: { en: 'Drills and kata train attention and memory that carry into the classroom.', es: 'Los ejercicios y las katas entrenan la atención y la memoria que se llevan al salón de clases.' } },
      { k: '礼', t: { en: 'Respect', es: 'Respeto' }, d: { en: 'Bowing in, listening to the sensei and supporting teammates become habits.', es: 'Saludar al entrar, escuchar al sensei y apoyar a sus compañeros se vuelven hábitos.' } },
      { k: '体', t: { en: 'Fitness', es: 'Condición física' }, d: { en: 'Coordination, balance, flexibility and strength through active, fun classes.', es: 'Coordinación, equilibrio, flexibilidad y fuerza con clases activas y divertidas.' } },
    ],
    faq: [
      { q: { en: 'What age can my child start?', es: '¿A qué edad puede empezar mi hijo?' }, a: { en: 'We run classes for different ages and levels. Book a free class and our team will place your child in the right group.', es: 'Tenemos clases para distintas edades y niveles. Reserva una clase gratis y nuestro equipo acomodará a tu hijo en el grupo correcto.' } },
      { q: { en: 'Does my child need experience?', es: '¿Mi hijo necesita experiencia?' }, a: { en: 'No. Every black belt started at white belt, and beginners are always welcome.', es: 'No. Todo cinta negra empezó en cinta blanca, y los principiantes siempre son bienvenidos.' } },
      { q: { en: 'What should they wear to the first class?', es: '¿Qué debe llevar a la primera clase?' }, a: { en: 'Comfortable athletic clothes and a bottle of water. We will guide you on uniforms after the first class.', es: 'Ropa deportiva cómoda y una botella de agua. Después de la primera clase te orientamos sobre el uniforme.' } },
    ],
  },
  {
    slug: 'after-school',
    kanji: '放課後',
    tone: 'dark',
    name: { en: 'After-School Program', es: 'Programa Después de Clases' },
    tag: { en: 'School days', es: 'Días de escuela' },
    metaTitle: 'After-School Program with Karate in El Paso, TX',
    metaDesc: 'After-school care in El Paso with school pickup, snack, karate class, homework time and dinner. Safe, structured and fun at Alchemy Karate Academy.',
    headline: { en: 'The best part of their day starts after the bell.', es: 'La mejor parte de su día empieza después de la campana.' },
    lead: {
      en: 'We pick your kids up from school and turn the afternoon into something they look forward to: a snack, a karate class, homework time and a full dinner, all in a safe and structured dojo. The program runs on school days with local school districts.',
      es: 'Recogemos a tus hijos en la escuela y convertimos la tarde en algo que esperan con ganas: snack, clase de karate, tiempo de tarea y cena completa, todo en un dojo seguro y estructurado. El programa funciona en días de escuela junto con los distritos escolares locales.',
    },
    benefits: [
      { k: '車', t: { en: 'School pickup', es: 'Transporte' }, d: { en: 'Transportation from school straight to the dojo.', es: 'Transporte desde la escuela directo al dojo.' } },
      { k: '学', t: { en: 'Homework time', es: 'Tiempo de tarea' }, d: { en: 'A dedicated block to finish homework with support.', es: 'Un tiempo dedicado para terminar la tarea con apoyo.' } },
      { k: '空手', t: { en: 'Karate class', es: 'Clase de karate' }, d: { en: 'A full class every day to build discipline and burn energy.', es: 'Una clase completa cada día para formar disciplina y sacar energía.' } },
      { k: '食', t: { en: 'Snack and dinner', es: 'Snack y cena' }, d: { en: 'A snack after school and a full dinner before pickup.', es: 'Snack al salir de la escuela y cena completa antes de que los recojas.' } },
    ],
    faq: [
      { q: { en: 'Which schools do you pick up from?', es: '¿De qué escuelas los recogen?' }, a: { en: 'Pickup routes depend on the dojo. Call your closest location to confirm your child\'s school.', es: 'Las rutas dependen del dojo. Llama a la sede más cercana para confirmar la escuela de tu hijo.' } },
      { q: { en: 'Is it open when there is no school?', es: '¿Abre cuando no hay escuela?' }, a: { en: 'The after-school program follows the school calendar. During school breaks we run camps instead.', es: 'El programa sigue el calendario escolar. En vacaciones hacemos campamentos.' } },
      { q: { en: 'Do kids need karate experience?', es: '¿Necesitan experiencia en karate?' }, a: { en: 'No. Kids of every level join and learn from day one.', es: 'No. Entran niños de todos los niveles y aprenden desde el primer día.' } },
    ],
  },
  {
    slug: 'kickboxing',
    kanji: '拳',
    tone: 'dark',
    name: { en: 'Adult Fitness Kickboxing', es: 'Kickboxing Fitness para Adultos' },
    tag: { en: 'Adults', es: 'Adultos' },
    metaTitle: 'Adult Fitness Kickboxing Classes in El Paso, TX',
    metaDesc: 'Fitness kickboxing for adults in El Paso. Burn calories, build strength and train real striking technique. Try your first class free at Alchemy Karate Academy.',
    headline: { en: 'Train like a fighter. No fight required.', es: 'Entrena como peleador. Sin necesidad de pelear.' },
    lead: {
      en: 'A high-energy workout built on real striking technique. Burn calories, build strength and leave the stress on the bag. No experience needed.',
      es: 'Un entrenamiento de alta energía basado en técnica real de golpeo. Quema calorías, gana fuerza y deja el estrés en el costal. No necesitas experiencia.',
    },
    benefits: [
      { k: '火', t: { en: 'Burn calories', es: 'Quema calorías' }, d: { en: 'Intervals of punches, kicks and conditioning that keep your heart rate up.', es: 'Intervalos de golpes, patadas y acondicionamiento que mantienen tu ritmo cardiaco arriba.' } },
      { k: '力', t: { en: 'Build strength', es: 'Gana fuerza' }, d: { en: 'Full-body work for legs, core, shoulders and endurance.', es: 'Trabajo de cuerpo completo para piernas, abdomen, hombros y resistencia.' } },
      { k: '技', t: { en: 'Real technique', es: 'Técnica real' }, d: { en: 'Learn proper stance, combinations and footwork from martial artists.', es: 'Aprende postura, combinaciones y desplazamiento con artistas marciales.' } },
      { k: '心', t: { en: 'Clear your head', es: 'Despeja tu mente' }, d: { en: 'The best stress relief in El Paso is a heavy bag.', es: 'El mejor quitaestrés de El Paso es un costal.' } },
    ],
    faq: [
      { q: { en: 'Do I need to be in shape to start?', es: '¿Necesito estar en forma para empezar?' }, a: { en: 'No. Every exercise can be scaled to your level, and you will progress class by class.', es: 'No. Cada ejercicio se adapta a tu nivel y vas avanzando clase con clase.' } },
      { q: { en: 'Is there sparring?', es: '¿Hay combate?' }, a: { en: 'Fitness kickboxing focuses on pads, bags and conditioning. Ask our team about other options.', es: 'El kickboxing fitness se enfoca en manoplas, costales y acondicionamiento. Pregunta a nuestro equipo por otras opciones.' } },
      { q: { en: 'What do I bring?', es: '¿Qué llevo?' }, a: { en: 'Athletic clothes, water and a towel. We will help with gloves and wraps.', es: 'Ropa deportiva, agua y una toalla. Te ayudamos con guantes y vendas.' } },
    ],
  },
  {
    slug: 'competition-team',
    kanji: '勝',
    tone: 'red',
    name: { en: 'Competition Team', es: 'Equipo de Competencia' },
    tag: { en: 'Team Alchemy', es: 'Team Alchemy' },
    metaTitle: 'Karate & Kickboxing Competition Team in El Paso, TX',
    metaDesc: 'Team Alchemy competes from local tournaments to the WAKO World Championships with Team USA. Elite karate and kickboxing training in El Paso.',
    headline: { en: 'From El Paso to the world stage.', es: 'De El Paso al escenario mundial.' },
    lead: {
      en: 'For students ready for the next level. Team Alchemy trains to compete, from local tournaments to the WAKO World Championships representing Team USA.',
      es: 'Para alumnos listos para el siguiente nivel. Team Alchemy entrena para competir, desde torneos locales hasta el Campeonato Mundial WAKO representando a Team USA.',
    },
    benefits: [
      { k: '勝', t: { en: 'Elite training', es: 'Entrenamiento de élite' }, d: { en: 'Sparring, strategy and conditioning built for competition.', es: 'Combate, estrategia y acondicionamiento pensados para competir.' } },
      { k: '旅', t: { en: 'Real tournaments', es: 'Torneos reales' }, d: { en: 'Local, national and international events, including WAKO championships.', es: 'Eventos locales, nacionales e internacionales, incluyendo campeonatos WAKO.' } },
      { k: '絆', t: { en: 'A real team', es: 'Un equipo de verdad' }, d: { en: 'Athletes who push each other and travel together.', es: 'Atletas que se empujan entre sí y viajan juntos.' } },
      { k: '心', t: { en: 'Mental toughness', es: 'Fortaleza mental' }, d: { en: 'Learning to perform under pressure, win with humility and lose with honor.', es: 'Aprender a rendir bajo presión, ganar con humildad y perder con honor.' } },
    ],
    faq: [
      { q: { en: 'How does a student join the team?', es: '¿Cómo entra un alumno al equipo?' }, a: { en: 'Instructors invite students based on skill, attitude and commitment. Ask your instructor about the next tryout.', es: 'Los instructores invitan a alumnos según su nivel, actitud y compromiso. Pregunta a tu instructor por la próxima selección.' } },
      { q: { en: 'Which events does the team compete in?', es: '¿En qué eventos compite el equipo?' }, a: { en: 'Karate and kickboxing tournaments, including WAKO events. See our Events page for recent results.', es: 'Torneos de karate y kickboxing, incluyendo eventos WAKO. Revisa la página de Eventos para ver resultados recientes.' } },
      { q: { en: 'Can a beginner aim for the team?', es: '¿Un principiante puede aspirar al equipo?' }, a: { en: 'Yes. Most of our competitors started in a regular class. It all begins with a free class.', es: 'Sí. La mayoría de nuestros competidores empezó en una clase normal. Todo inicia con una clase gratis.' } },
    ],
  },
  {
    slug: 'leadership',
    kanji: '導',
    tone: 'gold',
    name: { en: 'Leadership Program', es: 'Programa de Liderazgo' },
    tag: { en: 'Mentorship', es: 'Mentoría' },
    metaTitle: 'Youth Leadership Program through Martial Arts in El Paso',
    metaDesc: 'The Alchemy Leadership Program turns karate students into leaders with seminars, mentorship and real responsibility on the mat. El Paso, TX.',
    headline: { en: 'The goal was never just the belt.', es: 'La meta nunca fue solo la cinta.' },
    lead: {
      en: 'Seminars, mentorship and responsibility on the mat. The Leadership Program turns students into the role models of the dojo, with skills that carry into school, sports and life.',
      es: 'Seminarios, mentoría y responsabilidad en el tatami. El Programa de Liderazgo convierte a los alumnos en el ejemplo del dojo, con habilidades que se llevan a la escuela, al deporte y a la vida.',
    },
    benefits: [
      { k: '導', t: { en: 'Lead by example', es: 'Liderar con el ejemplo' }, d: { en: 'Students help guide younger classmates and learn to teach.', es: 'Los alumnos ayudan a guiar a los más pequeños y aprenden a enseñar.' } },
      { k: '話', t: { en: 'Communication', es: 'Comunicación' }, d: { en: 'Speaking with confidence in front of a group.', es: 'Hablar con seguridad frente a un grupo.' } },
      { k: '責', t: { en: 'Responsibility', es: 'Responsabilidad' }, d: { en: 'Real roles in class and at events.', es: 'Roles reales en clase y en eventos.' } },
      { k: '志', t: { en: 'Goal setting', es: 'Metas' }, d: { en: 'Planning, discipline and follow-through, belt after belt.', es: 'Planear, ser disciplinado y cumplir, cinta tras cinta.' } },
    ],
    faq: [
      { q: { en: 'Who can join the Leadership Program?', es: '¿Quién puede entrar al Programa de Liderazgo?' }, a: { en: 'Current students invited or recommended by their instructors. Ask at your dojo.', es: 'Alumnos actuales invitados o recomendados por sus instructores. Pregunta en tu dojo.' } },
      { q: { en: 'What happens at a Leadership Seminar?', es: '¿Qué pasa en un Seminario de Liderazgo?' }, a: { en: 'Special training sessions focused on leadership skills, teamwork and advanced material. Watch the Events page for the next one.', es: 'Sesiones especiales enfocadas en liderazgo, trabajo en equipo y material avanzado. Revisa la página de Eventos para el próximo.' } },
      { q: { en: 'Is there a special uniform?', es: '¿Hay uniforme especial?' }, a: { en: 'Yes, leadership students wear the full leadership uniform at seminars.', es: 'Sí, los alumnos de liderazgo usan el uniforme completo de liderazgo en los seminarios.' } },
    ],
  },
  {
    slug: 'camps-and-birthday-parties',
    kanji: '祭',
    tone: 'dark',
    name: { en: 'Camps & Birthday Parties', es: 'Campamentos y Cumpleaños' },
    tag: { en: 'All year', es: 'Todo el año' },
    metaTitle: 'Kids Karate Camps & Birthday Parties in El Paso, TX',
    metaDesc: 'Spring break, summer, sparring and gymnastics camps plus karate birthday parties in El Paso. Book with Alchemy Karate Academy.',
    headline: { en: 'When school is out, the dojo is on.', es: 'Cuando no hay escuela, el dojo está encendido.' },
    lead: {
      en: 'Spring break, summer, sparring and gymnastics camps, plus birthday parties packed with games, board breaking and a lot of kiai.',
      es: 'Campamentos de spring break, verano, sparring y gimnasia, más fiestas de cumpleaños llenas de juegos, rompimiento de tablas y mucho kiai.',
    },
    benefits: [
      { k: '夏', t: { en: 'Summer camps', es: 'Campamentos de verano' }, d: { en: 'Themed camp days with karate, games and activities.', es: 'Días temáticos con karate, juegos y actividades.' } },
      { k: '春', t: { en: 'Spring break camps', es: 'Campamentos de spring break' }, d: { en: 'Gymnastics, sparring and fun days while school is out.', es: 'Gimnasia, sparring y días de diversión mientras no hay escuela.' } },
      { k: '祝', t: { en: 'Birthday parties', es: 'Fiestas de cumpleaños' }, d: { en: 'A party at the dojo with games, karate moves and board breaking.', es: 'Una fiesta en el dojo con juegos, movimientos de karate y tablas para romper.' } },
      { k: '友', t: { en: 'Bring friends', es: 'Trae amigos' }, d: { en: 'A fun first taste of martial arts for friends and family.', es: 'Una primera probada divertida de las artes marciales para amigos y familia.' } },
    ],
    faq: [
      { q: { en: 'When are the camps?', es: '¿Cuándo son los campamentos?' }, a: { en: 'We run camps during spring break, summer and other school breaks. Check the Events page for upcoming dates.', es: 'Hacemos campamentos en spring break, verano y otras vacaciones. Revisa la página de Eventos para las próximas fechas.' } },
      { q: { en: 'How do I book a birthday party?', es: '¿Cómo reservo una fiesta de cumpleaños?' }, a: { en: 'Call your closest dojo or send us your info with the free class form and mention the party.', es: 'Llama a tu dojo más cercano o mándanos tus datos con el formulario de clase gratis y menciona la fiesta.' } },
      { q: { en: 'Do kids need to be students to join a camp?', es: '¿Hay que ser alumno para ir a un campamento?' }, a: { en: 'Ask our team for each camp. Camps are a great way for new kids to try the dojo.', es: 'Pregunta a nuestro equipo por cada campamento. Son una gran forma de que niños nuevos conozcan el dojo.' } },
    ],
  },
];

export const dojos = [
  {
    slug: 'east',
    name: 'East',
    title: { en: 'East El Paso Dojo', es: 'Dojo East El Paso' },
    street: '1613 N Zaragoza Rd, Ste 104',
    city: 'El Paso', region: 'TX', zip: '79936',
    phone: '(915) 921-5677', tel: '+19159215677',
    area: { en: 'Serving East El Paso families along Zaragoza Road.', es: 'Atendiendo a las familias del este de El Paso sobre Zaragoza Road.' },
    metaTitle: 'Karate Classes in East El Paso (Zaragoza Rd)',
    metaDesc: 'Alchemy Karate Academy East: karate for kids, after-school program and adult kickboxing at 1613 N Zaragoza Rd, El Paso, TX 79936. Free first class.',
  },
  {
    slug: 'far-east',
    name: 'Far East',
    title: { en: 'Far East El Paso Dojo', es: 'Dojo Far East El Paso' },
    street: '3560 N Zaragoza Rd, Suite 210',
    city: 'El Paso', region: 'TX', zip: '79938',
    phone: '(915) 588-0753', tel: '+19155880753',
    area: { en: 'Serving Far East El Paso and the north Zaragoza corridor.', es: 'Atendiendo a Far East El Paso y la zona norte de Zaragoza.' },
    metaTitle: 'Karate Classes in Far East El Paso (79938)',
    metaDesc: 'Alchemy Karate Academy Far East: karate for kids, after-school program and adult kickboxing at 3560 N Zaragoza Rd, El Paso, TX 79938. Free first class.',
  },
  {
    slug: 'horizon',
    name: 'Horizon',
    title: { en: 'Horizon Dojo', es: 'Dojo Horizon' },
    street: '13750 Eastlake Blvd, Suite 200',
    city: 'El Paso', region: 'TX', zip: '79928',
    phone: '(915) 500-4072', tel: '+19155004072',
    area: { en: 'Serving Horizon City and the Eastlake area.', es: 'Atendiendo a Horizon City y la zona de Eastlake.' },
    metaTitle: 'Karate Classes near Horizon City, TX (Eastlake)',
    metaDesc: 'Alchemy Karate Academy Horizon: karate for kids, after-school program and adult kickboxing at 13750 Eastlake, El Paso, TX 79928. Free first class.',
  },
];
