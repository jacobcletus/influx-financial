/**
 * Generates the default Open Graph image (1200×630) from brand assets.
 * Run: node scripts/generate-og.mjs
 */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const logo = readFileSync('public/images/influx-logo-white.png').toString('base64');

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#002a23"/>
  <g fill="#ffffff" fill-opacity="0.05">
    ${Array.from({ length: 28 }, (_, r) =>
      Array.from(
        { length: 55 },
        (_, c) => `<circle cx="${c * 22 + 11}" cy="${r * 22 + 11}" r="1"/>`
      ).join('')
    ).join('')}
  </g>
  <rect x="0" y="0" width="1200" height="8" fill="#006d5a"/>
  <image href="data:image/png;base64,${logo}" x="90" y="200" width="560" height="73"/>
  <text x="92" y="360" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="bold" fill="#eefffc" letter-spacing="-0.5">Mortgage broking, lending &amp; accounting</text>
  <text x="92" y="412" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#9dc5be">Making first homes happen — Melbourne, Australia</text>
  <text x="92" y="540" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#7fb0a7">influxfinancial.com.au</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile('public/images/og/og-default.png');
console.log('og-default.png written');
