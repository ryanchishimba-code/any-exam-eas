/**
 * Build WebP + AVIF hero assets (desktop ~1440w, mobile ~768w) from approved JPGs.
 * Run: node scripts/optimize-marketing-hero-photos.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const UPLOAD_DIR = process.env.HERO_UPLOAD_DIR ?? "/home/ubuntu/.cursor/projects/workspace/uploads";
const OUT_DIR = path.join(process.cwd(), "public/images/marketing/heroes");

const HEROES = [
  { id: "home", file: "hero-home_a4d4.jpg" },
  { id: "nclex", file: "hero-nclex_3cfd.jpg" },
  { id: "naplex", file: "hero-naplex_c503.jpg" },
  { id: "usmle", file: "hero-usmle_f103.jpg" },
  { id: "pance", file: "hero-pance_c0f7.jpg" },
  { id: "aanp-fnp", file: "hero-fnp_3f3e.jpg" },
  { id: "npte-pt", file: "hero-npte_1bc8.jpg" },
];

const VARIANTS = [
  { suffix: "desktop", width: 1440 },
  { suffix: "mobile", width: 768 },
];

async function encodeVariant(input, outBase, width) {
  const resized = sharp(input).resize({ width, withoutEnlargement: true });

  const webpPath = `${outBase}.webp`;
  const avifPath = `${outBase}.avif`;

  let webpQ = 78;
  let avifQ = 50;
  for (let attempt = 0; attempt < 6; attempt++) {
    await resized.clone().webp({ quality: webpQ, effort: 4 }).toFile(webpPath);
    const webpSize = fs.statSync(webpPath).size;
    const webpCap = width >= 1200 ? 150 * 1024 : 60 * 1024;
    if (webpSize <= webpCap || webpQ <= 52) break;
    webpQ -= 6;
  }

  for (let attempt = 0; attempt < 6; attempt++) {
    await resized.clone().avif({ quality: avifQ, effort: 4 }).toFile(avifPath);
    const avifSize = fs.statSync(avifPath).size;
    const avifCap = width >= 1200 ? 150 * 1024 : 60 * 1024;
    if (avifSize <= avifCap || avifQ <= 32) break;
    avifQ -= 5;
  }

  return {
    webp: fs.statSync(webpPath).size,
    avif: fs.statSync(avifPath).size,
  };
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const report = [];
for (const hero of HEROES) {
  const input = path.join(UPLOAD_DIR, hero.file);
  if (!fs.existsSync(input)) {
    throw new Error(`Missing upload: ${input}`);
  }
  for (const variant of VARIANTS) {
    const outBase = path.join(OUT_DIR, `${hero.id}-${variant.suffix}`);
    const sizes = await encodeVariant(input, outBase, variant.width);
    report.push({ id: hero.id, variant: variant.suffix, ...sizes });
  }
}

console.table(
  report.map((row) => ({
    hero: row.id,
    variant: row.variant,
    webp_kb: Math.round(row.webp / 1024),
    avif_kb: Math.round(row.avif / 1024),
  }))
);
