import { defineConfig } from 'vite';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = process.cwd();
const SKIP = new Set(['node_modules', 'dist', 'public', 'partials', 'apps-script', 'scripts', 'src', '.git']);

// Every index.html in the project becomes a page (/, /events/, /programs/*, /locations/*)
function findPages(dir, out = {}) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) findPages(full, out);
    else if (name === 'index.html') {
      const key = full.slice(root.length + 1).replace(/\/?index\.html$/, '') || 'main';
      out[key] = full;
    }
  }
  return out;
}

// <!-- @include nav --> pulls partials/nav.html into the page at build time (static HTML, good for SEO)
const partials = () => ({
  name: 'html-partials',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => html.replace(/<!--\s*@include\s+([\w-]+)\s*-->/g, (_, n) => readFileSync(resolve(root, 'partials', `${n}.html`), 'utf8')),
  },
});

export default defineConfig({
  appType: 'mpa',
  plugins: [partials()],
  build: { rollupOptions: { input: findPages(root) } },
});
