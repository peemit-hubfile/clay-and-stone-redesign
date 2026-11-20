// Removes original client media from dist/ after build: pages only reference
// optimised derivatives (/images/opt). Fails if any built page still points at
// an original, so nothing breaks silently.
import { readFileSync, rmSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(import.meta.dirname, '..', '..', 'dist');
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
const offenders = htmlFiles.filter((f) => /["' ,](\/images\/source\/|\/videos\/source\/)/.test(readFileSync(f, 'utf8')));
if (offenders.length) {
  console.error('prune-dist: pages still reference original media:\n' + offenders.join('\n'));
  process.exit(1);
}
for (const dir of ['images/source', 'videos/source']) rmSync(join(DIST, dir), { recursive: true, force: true });
const size = walk(DIST).reduce((n, f) => n + statSync(f).size, 0);
console.log(`prune-dist: removed original media · dist is ${(size / 1e6).toFixed(1)} MB`);
