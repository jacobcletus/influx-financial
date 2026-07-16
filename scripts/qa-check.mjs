/**
 * Static QA over the production build (dist/):
 *  - unique <title> and exactly one <h1> per page
 *  - no lorem ipsum / placeholder contact details / template credits
 *  - every internal link resolves to a built page, a redirect, or an asset
 *  - every <img> has an alt attribute
 * Run: npm run build && node scripts/qa-check.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) pages.push(p);
  }
})(DIST);

const redirects = readFileSync('public/_redirects', 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map((l) => l.split(/\s+/)[0]);

const errors = [];
const warn = [];
const titles = new Map();

const BAD_PATTERNS = [
  [/lorem ipsum/i, 'lorem ipsum'],
  [/dolorum|voluptas vitae|doloremque/i, 'latin placeholder'],
  [/info@example\.com|example@/i, 'example email'],
  [/\+1 \(\d{3}\)/, 'US placeholder phone'],
  [/Pixxelstudio/i, 'template credit'],
  [/Jhon william|Sarah albert|Mike hardson/i, 'fake testimonial name'],
];

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const rel =
    '/' +
    relative(DIST, file)
      .replace(/index\.html$/, '')
      .replace(/\.html$/, '')
      .replace(/\/$/, '');
  const route = rel === '/' ? '/' : rel.replace(/\/$/, '');

  const title = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1];
  if (!title) errors.push(`${route}: missing <title>`);
  else if (titles.has(title))
    errors.push(`${route}: duplicate title with ${titles.get(title)} — "${title}"`);
  else titles.set(title, route);

  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) errors.push(`${route}: ${h1Count} <h1> elements`);

  const desc = html.match(/<meta name="description" content="([^"]*)"/);
  if (!desc) errors.push(`${route}: missing meta description`);

  for (const [re, label] of BAD_PATTERNS) {
    if (re.test(html)) errors.push(`${route}: contains ${label}`);
  }

  // img alt check
  for (const img of html.match(/<img [^>]*>/g) ?? []) {
    if (!/ alt=/.test(img)) errors.push(`${route}: img missing alt: ${img.slice(0, 80)}`);
  }

  // internal links
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = m[1].replace(/\/$/, '') || '/';
    if (
      href.startsWith('/_') ||
      /\.(png|jpg|jpeg|webp|svg|xml|txt|ico|css|js|woff2?)$/.test(href)
    ) {
      const asset = join(DIST, href);
      if (!existsSync(asset) && !href.startsWith('/_'))
        warn.push(`${route}: asset link may be missing: ${href}`);
      continue;
    }
    const target = href === '/' ? join(DIST, 'index.html') : join(DIST, href, 'index.html');
    const targetFlat = join(DIST, `${href}.html`);
    if (
      !existsSync(target) &&
      !existsSync(targetFlat) &&
      !redirects.includes(href) &&
      !redirects.includes(href + '/')
    ) {
      errors.push(`${route}: broken internal link → ${href}`);
    }
  }
}

console.log(`Checked ${pages.length} pages.`);
if (warn.length) console.log('\nWarnings:\n' + warn.join('\n'));
if (errors.length) {
  console.error('\nERRORS:\n' + [...new Set(errors)].join('\n'));
  process.exit(1);
}
console.log('All QA checks passed.');
