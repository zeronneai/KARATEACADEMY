# Alchemy Karate Academy · Propuesta Web v0.2

Landing premium para Alchemy Karate Academy (El Paso, TX). Reemplaza el sitio actual en Yola (plantilla genérica) por una experiencia cinematográfica que hace sentir al papá que su hijo va a entrar a algo grande.

## El concepto: "La Alquimia"

El lema de la academia es *Turning the ordinary to extraordinary*. Todo el sitio cuenta esa transformación.

1. **Intro: la patada con el scroll.** Pantalla de carga con porcentaje real; luego cada scroll (o swipe en celular) avanza el video cuadro por cuadro desde el punto de vista del sensei que sostiene la tabla. En el impacto suena el crack, y al final el logo cae y vuela a la esquina. Los 96 cuadros están en `public/media/intro/desktop` y `/mobile`. El hero continúa con el loop de la misma escena (`public/media/hero/`).
   *Versión anterior (tabla hecha con código, ya reemplazada):* En Four O's el reloj se desarma solo y el usuario mira. Aquí el usuario *participa*: mantiene presionado el botón 拳, la tabla tiembla, se agrieta, suena un zumbido que sube y al llegar al 100% la tabla explota en astillas con un golpe sintetizado y un 気合 (kiai) gigante. Es el primer "rompimiento de tabla" de cada visitante. Funciona con mouse, touch (mantener presionado) y teclado (espacio). Después del kiai, el logo de Alchemy cae de golpe con onda expansiva, retumbe y un destello metálico, y luego vuela a su lugar en la barra de navegación mientras se revela el sitio. Tiene "Skip intro", control de sonido y solo se muestra una vez por sesión.
2. **Hero "El corte".** La palabra ORDINARY aparece en gris, un corte rojo de karate chop la parte en dos y aparece EXTRAORDINARY en oro con efecto de transmutación. Detrás gira un círculo alquímico que se dibuja trazo por trazo.
3. **El Camino (scroll horizontal fijado).** 7 cintas, de blanca a negra. Cada una con su virtud en kanji (礼 Respeto, 律 Disciplina, 集中 Enfoque, 自信 Confianza, 勇気 Valor, 指導 Liderazgo). La cinta física se va tejiendo en la parte de abajo y el color ambiental cambia con cada nivel.
4. **Programas (bento).** Kids Karate, After-School (transporte, snack, clase, tarea, cena, sacado de su flyer de IG), Kickboxing adultos, Equipo de Competencia, Programa de Liderazgo, Campamentos y Cumpleaños. Tarjetas con spotlight y tilt 3D.
5. **Arena.** PRESSURE. FOCUS. GLORY. sobre un tatami en perspectiva (inspirado en su post de IG). Datos reales: Mundial Juvenil WAKO 2026 en Jesolo, Battle of the Champions en el El Paso County Coliseum, campeones panamericanos.
6. **Testimonios, 3 dojos (East, Far East, Horizon) con llamar y cómo llegar, y formulario de clase gratis** con chips de programa y sede.
7. **Bilingüe EN / ES** con un toggle. Detecta el idioma del navegador. Clave para el mercado de El Paso.
8. **Eventos y resultados** justo después del hero: próximo evento con cuenta regresiva o el logro más reciente. Página completa en `/events/` con filtros (Próximos, Resultados, Entrenamientos y campamentos). Se editan desde Google Sheets.
9. **Clase gratis en panel lateral**: cualquier botón de Free Class abre el formulario desde el lado, sin mover al usuario de donde está. Botón flotante siempre visible. En las páginas de programa o dojo, el formulario ya viene preseleccionado.
10. **Formulario conectado a Google Sheets** con Apps Script: guarda el lead, manda correo de confirmación a la familia (en su idioma) y aviso al dueño con botones de llamar y WhatsApp. Guía: [`apps-script/README.md`](apps-script/README.md).

## Páginas y SEO

| URL | Contenido |
|---|---|
| `/` | Home |
| `/events/` | Eventos, resultados y entrenamientos |
| `/programs/kids-karate/`, `/after-school/`, `/kickboxing/`, `/competition-team/`, `/leadership/`, `/camps-and-birthday-parties/` | Una página por programa con beneficios, pasos, FAQ y programas relacionados |
| `/locations/east/`, `/far-east/`, `/horizon/` | Una página por dojo con mapa, teléfono y dirección (SEO local: "karate near me") |

Cada página tiene su propio title, description, canonical, Open Graph y datos estructurados (SportsOrganization, SportsActivityLocation por dojo, Service, FAQPage, BreadcrumbList y Event para próximos eventos). Hay `sitemap.xml` y `robots.txt`. Nav con menús desplegables, menú móvil y footer con links internos a todo.

El contenido de programas y dojos vive en `src/data/site.js`; `scripts/gen-pages.mjs` genera las páginas automáticamente antes de `dev` y `build`. Para editar un texto, se cambia ahí, no en el HTML generado.

## Tendencias 2026 que usa

Scroll-driven storytelling, tipografía gigante como hero, micro-interacciones, dark mode como decisión de diseño, profundidad/3D en pantalla plana, grano cinematográfico. Y lo que convierte en sitios de artes marciales: CTA de clase gratis visible siempre, programas segmentados, info por sede con teléfono y mapa, pruebas sociales.

## Stack

Vite + vanilla JS, GSAP (ScrollTrigger), Lenis (smooth scroll). Fuentes self-hosted con Fontsource (Big Shoulders Display, Inter Tight, Barlow Condensed, Noto Serif JP). Audio 100% sintetizado con Web Audio (sin archivos). Respeta `prefers-reduced-motion`.

```bash
npm install
npm run dev      # local
npm run build    # produce /dist
```

Deploy en Vercel: importar el repo, framework "Vite". Agregar la variable `VITE_SHEETS_ENDPOINT` (ver `apps-script/README.md`). `/#nointro` salta la intro para revisar rápido.

## Dónde van las imágenes

Todo va en `public/media/` con nombres fijos. La tabla completa con tamaños está en [`public/media/LEEME.md`](public/media/LEEME.md). Si un archivo no existe, su espacio se oculta solo y el diseño se ve igual.

- `media/hero/hero-desktop.mp4` (16:9) y `hero-mobile.mp4` (9:16), con sus `.jpg` de poster: loop de fondo del hero.
- `media/intro/desktop/001-096.webp` y `media/intro/mobile/001-096.webp`: cuadros del video de la intro.
- `media/programs/`: `kids-karate`, `after-school`, `kickboxing`, `competition`, `leadership`, `camps` (.jpg).
- `media/arena/`: `wako-worlds`, `battle-of-the-champions`, `panamerican` (.jpg).
- `media/gallery/01.jpg` a `10.jpg`: carrusel "Life at the dojo" (aparece solo cuando hay fotos).
- `media/locations/`: `east`, `far-east`, `horizon` (.jpg), fondo de cada página de dojo.
- `media/events/`: fotos de eventos; el nombre se pone en la columna `image` del Sheet.

## Pendientes antes de mostrar al cliente

- [x] Logo real integrado (nav, intro animada y footer).
- [ ] **Fotos/video**: hero con loop de video (kumite o kata en cámara lenta) y fotos por programa. Se pueden generar con IA en el estilo de sus posts.
- [ ] **Testimonios**: pegar el texto exacto de las reseñas (ahora están parafraseados de su sitio actual) o usar reseñas de Google.
- [ ] Confirmar edades por programa, horarios y si quieren mostrar precios.
- [ ] Conectar el formulario: crear el Google Sheet y poner `VITE_SHEETS_ENDPOINT` en Vercel (guía en `apps-script/README.md`). Sin eso, el formulario corre en modo demo.
- [ ] Confirmar el dominio final (`SITE_URL` en `src/data/site.js`, ahora `alchemykarateacademy.com`) y dar de alta el sitemap en Google Search Console.
- [ ] Fotos de eventos en `public/media/events/` y de dojos en `public/media/locations/`.
- [x] Video de la intro (patada que rompe la tabla) y loop del hero.
- [ ] Revisar con Eddie el contador de "2,500+ familias y fans" (basado en seguidores de IG).
- [ ] Siguiente fase opcional: página de horarios por dojo, galería del Battle of the Champions, sección Leadership Program.
