import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(import.meta.dirname);
const SRC = join(ROOT, 'src');

// Static pages are rendered by tools/build/render.mjs into src/{th,en}/…/index.html
// (git-ignored). It runs in a child process so template edits are always fresh.
function renderPages() {
  execFileSync(process.execPath, [join(ROOT, 'tools', 'build', 'render.mjs')], { stdio: 'inherit' });
  return JSON.parse(readFileSync(join(SRC, '.routes.json'), 'utf8'));
}

function staticPages() {
  return {
    name: 'clay-static-pages',
    configureServer(server) {
      const watched = ['components', 'pages', 'lib', 'data'].map((d) => join(SRC, d));
      server.watcher.add(watched);
      let timer;
      server.watcher.on('change', (file) => {
        if (!watched.some((d) => file.startsWith(d))) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          try { renderPages(); server.ws.send({ type: 'full-reload' }); } catch (e) { console.error(e.message); }
        }, 80);
      });
    },
  };
}

const routes = renderPages();

export default defineConfig({
  root: SRC,
  publicDir: join(ROOT, 'public'),
  appType: 'mpa',
  plugins: [staticPages()],
  server: { port: 5173, strictPort: false },
  build: {
    outDir: join(ROOT, 'dist'),
    emptyOutDir: true,
    rollupOptions: { input: Object.fromEntries(routes.map((r) => [r.key, join(SRC, r.file)])) },
  },
});
