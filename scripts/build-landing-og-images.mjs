/**
 * Static 1200×630 share cards from each landing's desktop hero.
 * Run: node scripts/build-landing-og-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const OUT_DIR = path.join(process.cwd(), "public/images/og");
const MAX_BYTES = 300 * 1024;

const PAGES = [
  {
    id: "home",
    focalY: 0.38,
    lines: ["Six board exams.", "One plan at $27.99/mo."],
  },
  {
    id: "nclex",
    focalY: 0.42,
    lines: ["NCLEX-RN practice", "with every answer explained."],
  },
  {
    id: "naplex",
    focalY: 0.4,
    lines: ["NAPLEX questions.", "Every answer explained."],
  },
  {
    id: "usmle",
    focalY: 0.38,
    lines: ["USMLE practice", "with every answer explained."],
  },
  {
    id: "pance",
    focalY: 0.4,
    lines: ["PANCE practice", "with every vignette explained."],
  },
  {
    id: "aanp-fnp",
    focalY: 0.38,
    lines: ["FNP practice", "with every vignette explained."],
  },
  {
    id: "npte-pt",
    focalY: 0.42,
    lines: ["NPTE-PT practice", "written for physical therapists."],
  },
  {
    id: "daily",
    focalY: 0.42,
    lines: ["A free board question,", "every day."],
  },
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function overlay(lines) {
  const longest = Math.max(...lines.map((line) => line.length));
  const size = longest > 32 ? 52 : longest > 26 ? 58 : 64;
  const lineHeight = Math.round(size * 1.12);
  const startY = HEIGHT - 56 - lineHeight * (lines.length - 1);
  const tspans = lines
    .map((line, index) => {
      const y = index === 0 ? `y="${startY}"` : `dy="${lineHeight}"`;
      return `<tspan x="56" ${y}>${escapeXml(line)}</tspan>`;
    })
    .join("");

  return Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="side" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#071422" stop-opacity="0.92"/>
      <stop offset="0.46" stop-color="#071422" stop-opacity="0.78"/>
      <stop offset="0.72" stop-color="#071422" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#071422" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="bottom" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#071422" stop-opacity="0.82"/>
      <stop offset="0.42" stop-color="#071422" stop-opacity="0.2"/>
      <stop offset="0.7" stop-color="#071422" stop-opacity="0"/>
    </linearGradient>
    <filter id="textShadow" x="-10%" y="-20%" width="130%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000" flood-opacity="0.55"/>
    </filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#side)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bottom)"/>
  <g transform="translate(56 48) scale(1.35)" fill="none">
    <path fill="#ffffff" d="M6 16.5 20 10l14 6.5-14 6.5L6 16.5Z"/>
    <path d="M32.5 17.2v7.2c0 2.6-5.4 4.6-12.5 4.6S7.5 27 7.5 24.4v-7.2" stroke="#ffffff" stroke-width="1.8"/>
    <path d="M14.5 22.2 18.2 26l7.3-8.4" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="124" y="86" fill="#ffffff" font-family="Inter" font-weight="700" font-size="30" letter-spacing="-0.4">AnyExamEasy</text>
  <text fill="#ffffff" font-family="Inter" font-weight="700" font-size="${size}" letter-spacing="-1.2" filter="url(#textShadow)">${tspans}</text>
</svg>`);
}

async function encodeUnderCap(buffer) {
  let quality = 82;
  let jpeg = await sharp(buffer).jpeg({ quality, mozjpeg: true }).toBuffer();
  while (jpeg.length > MAX_BYTES && quality > 60) {
    quality -= 4;
    jpeg = await sharp(buffer).jpeg({ quality, mozjpeg: true }).toBuffer();
  }
  return { jpeg, quality };
}

async function buildOne(page) {
  const src = path.join(process.cwd(), `public/images/marketing/heroes/${page.id}-desktop.avif`);
  const meta = await sharp(src).metadata();
  const scaledH = Math.round((meta.height * WIDTH) / meta.width);
  const top = Math.max(0, Math.min(scaledH - HEIGHT, Math.round((scaledH - HEIGHT) * page.focalY)));
  const photo = await sharp(src)
    .resize(WIDTH, scaledH, { fit: "fill" })
    .extract({ left: 0, top, width: WIDTH, height: HEIGHT })
    .toBuffer();
  const composed = await sharp(photo)
    .composite([{ input: overlay(page.lines), top: 0, left: 0 }])
    .png()
    .toBuffer();
  const { jpeg, quality } = await encodeUnderCap(composed);
  const out = path.join(OUT_DIR, `${page.id}.jpg`);
  fs.writeFileSync(out, jpeg);
  const info = await sharp(jpeg).metadata();
  console.log(
    `${page.id} ${info.width}x${info.height} q${quality} ${(jpeg.length / 1024).toFixed(1)} KB`
  );
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const only = process.argv[2];
for (const page of PAGES) {
  if (only && page.id !== only) continue;
  await buildOne(page);
}
