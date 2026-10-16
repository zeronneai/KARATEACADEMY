# Alchemy Karate Academy · Propuesta Web v0.1

Landing premium para Alchemy Karate Academy (El Paso, TX). Reemplaza el sitio actual en Yola (plantilla genérica) por una experiencia cinematográfica que hace sentir al papá que su hijo va a entrar a algo grande.

## El concepto: "La Alquimia"

El lema de la academia es *Turning the ordinary to extraordinary*. Todo el sitio cuenta esa transformación.

1. **Intro interactiva: romper la tabla.** En Four O's el reloj se desarma solo y el usuario mira. Aquí el usuario *participa*: mantiene presionado el botón 拳, la tabla tiembla, se agrieta, suena un zumbido que sube y al llegar al 100% la tabla explota en astillas con un golpe sintetizado y un 気合 (kiai) gigante. Es el primer "rompimiento de tabla" de cada visitante. Funciona con mouse, touch (mantener presionado) y teclado (espacio). Tiene "Skip intro", control de sonido y solo se muestra una vez por sesión.
2. **Hero "El corte".** La palabra ORDINARY aparece en gris, un corte rojo de karate chop la parte en dos y aparece EXTRAORDINARY en oro con efecto de transmutación. Detrás gira un círculo alquímico que se dibuja trazo por trazo.
3. **El Camino (scroll horizontal fijado).** 7 cintas, de blanca a negra. Cada una con su virtud en kanji (礼 Respeto, 律 Disciplina, 集中 Enfoque, 自信 Confianza, 勇気 Valor, 指導 Liderazgo). La cinta física se va tejiendo en la parte de abajo y el color ambiental cambia con cada nivel.
4. **Programas (bento).** Kids Karate, After-School (transporte, snack, clase, tarea, cena, sacado de su flyer de IG), Kickboxing adultos, Equipo de Competencia, Programa de Liderazgo, Campamentos y Cumpleaños. Tarjetas con spotlight y tilt 3D.
5. **Arena.** PRESSURE. FOCUS. GLORY. sobre un tatami en perspectiva (inspirado en su post de IG). Datos reales: Mundial Juvenil WAKO 2026 en Jesolo, Battle of the Champions en el El Paso County Coliseum, campeones panamericanos.
6. **Testimonios, 3 dojos (East, Far East, Horizon) con llamar y cómo llegar, y formulario de clase gratis** con chips de programa y sede.
7. **Bilingüe EN / ES** con un toggle. Detecta el idioma del navegador. Clave para el mercado de El Paso.

## Tendencias 2026 que usa

Scroll-driven storytelling, tipografía gigante como hero, micro-interacciones, dark mode como decisión de diseño, profundidad/3D en pantalla plana, grano cinematográfico. Y lo que convierte en sitios de artes marciales: CTA de clase gratis visible siempre, programas segmentados, info por sede con teléfono y mapa, pruebas sociales.

## Stack

Vite + vanilla JS, GSAP (ScrollTrigger), Lenis (smooth scroll). Fuentes self-hosted con Fontsource (Big Shoulders Display, Inter Tight, IBM Plex Mono, Noto Serif JP). Audio 100% sintetizado con Web Audio (sin archivos). Respeta `prefers-reduced-motion`.

```bash
npm install
npm run dev      # local
npm run build    # produce /dist
```

Deploy en Vercel: importar el repo, framework "Vite", sin configuración extra. `/#nointro` salta la intro para revisar rápido.

## Pendientes antes de mostrar al cliente

- [ ] **Logo real** (PNG/SVG transparente) para reemplazar el wordmark temporal del nav y el favicon.
- [ ] **Fotos/video**: hero con loop de video (kumite o kata en cámara lenta) y fotos por programa. Se pueden generar con IA en el estilo de sus posts.
- [ ] **Testimonios**: pegar el texto exacto de las reseñas (ahora están parafraseados de su sitio actual) o usar reseñas de Google.
- [ ] Confirmar edades por programa, horarios y si quieren mostrar precios.
- [ ] Conectar el formulario (Formspree, Supabase o su CRM). Ahora solo valida y muestra confirmación (`TODO` en `src/main.js`).
- [ ] Revisar con Eddie el contador de "2,500+ familias y fans" (basado en seguidores de IG).
- [ ] Siguiente fase opcional: página de horarios por dojo, galería del Battle of the Champions, sección Leadership Program.
