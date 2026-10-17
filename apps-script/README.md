# Conectar el formulario y los eventos con Google Sheets

Un solo Google Sheet hace dos cosas:

1. **Leads**: cada vez que alguien pide su clase gratis, se agrega una fila, le llega un correo de confirmación a la familia (en su idioma) y otro al dueño con botones para llamar o mandar WhatsApp.
2. **Events**: lo que escriban en esta pestaña aparece en el sitio (home y página /events/). Así Eddie publica torneos, resultados y campamentos sin tocar código.

Tiempo estimado: 10 minutos.

## Paso 1. Crear el Sheet

1. Entra con la cuenta de Google de la academia (de ahí saldrán los correos).
2. Crea un Google Sheet nuevo, por ejemplo "Alchemy · Website".

## Paso 2. Pegar el código

1. En el Sheet: **Extensiones > Apps Script**.
2. Borra lo que viene y pega todo el contenido de `apps-script/Code.gs`.
3. Arriba en `CONFIG` revisa:
   - `OWNER_EMAILS`: a quién le llegan los avisos de leads (pueden ser varios separados por coma).
   - `LOGO_URL`: mientras el dominio no esté apuntado, cámbialo a la URL de Vercel, por ejemplo `https://karateacademy.vercel.app/email-logo.png`.
4. Guarda (icono de disco).

## Paso 3. Preparar las pestañas

1. En el menú de funciones elige **setup** y dale **Run**.
2. Google pedirá permisos (Sheets y enviar correo). Acepta. Si sale "Google hasn't verified this app": Advanced > Go to project.
3. Se crean las pestañas **Leads** y **Events**, con los eventos reales que ya tenemos como ejemplo.

Opcional: corre **testLead** para recibir los dos correos de prueba en tu propia cuenta.

## Paso 4. Publicar como Web App

1. **Deploy > New deployment > Web app**.
2. Execute as: **Me**. Who has access: **Anyone**.
3. Deploy y copia la URL que termina en `/exec`.

## Paso 5. Conectarlo al sitio

En Vercel: **Project > Settings > Environment Variables**

- Name: `VITE_SHEETS_ENDPOINT`
- Value: la URL `/exec`

Haz **Redeploy**. Listo: el formulario guarda en el Sheet y manda correos, y los eventos se leen de la pestaña Events.

En local: copia `.env.example` a `.env` y pega la URL.

## Cómo usar la pestaña Events

| Columna | Qué poner |
|---|---|
| published | Casilla. Si está apagada, el evento no se muestra. |
| date | Fecha (AAAA-MM-DD). Si es futura sale como "Upcoming" con cuenta regresiva; si ya pasó, sale como resultado. |
| date_label_en / date_label_es | Opcional. Texto en lugar de la fecha, por ejemplo "June 8, 10 & 12". |
| category | tournament, achievement, training, seminar, camp, graduation o motivation. Las filas `motivation` no salen como evento: van al "Muro del dojo" (posters motivacionales). |
| title_en / title_es | Título en inglés y español. |
| location | Lugar. |
| desc_en / desc_es | Descripción corta. |
| image | Opcional. Ruta como `/media/events/foto.jpg` o una URL completa de imagen. Los flyers se muestran completos (sin recortar) y se pueden ampliar con un clic. |
| link | Opcional. Link de registro, Facebook del evento, etc. |
| featured | Casilla. Los destacados tienen prioridad en el home cuando no hay próximos eventos. |

Los cambios aparecen en el sitio en máximo 5 minutos.

## Pestaña Leads

La columna **Status** tiene lista desplegable (New, Contacted, Booked, Attended, Joined, Not interested) para darle seguimiento a cada familia. También se guarda de qué página llegó y los `utm` si vino de un anuncio (Meta o Google).

## Notas

- Cuentas Gmail gratis pueden mandar unos 100 correos al día; Google Workspace hasta 1,500. Cada lead usa 2.
- Si cambias el código, publica de nuevo con **Deploy > Manage deployments > Edit > New version** para que la URL siga siendo la misma.
- Protección incluida: campo trampa para bots y bloqueo de envíos duplicados del mismo correo en 2 minutos.
