/**
 * Build WebP + AVIF hero assets from the approved JPGs.
 * Desktop keeps the native 1280×720 frame. Mobile is a portrait crop of that
 * same file (full 720px height) so a tall phone hero is not a sliver of a
 * downscaled landscape. Each id uses its own source. Nothing is enlarged.
 * Run: node scripts/optimize-marketing-hero-photos.mjs
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const UPLOAD_DIR = process.env.HERO_UPLOAD_DIR ?? "/home/ubuntu/.cursor/projects/workspace/uploads";
const OUT_DIR = path.join(process.cwd(), "public/images/marketing/heroes");

/** Horizontal center of the subject, as a fraction of the 1280px source. */
const HEROES = [
  { id: "home", file: "hero-home_a4d4.jpg", focusX: 0.68 },
  { id: "nclex", file: "hero-nclex_3cfd.jpg", focusX: 0.74 },
  { id: "naplex", file: "hero-naplex_c503.jpg", focusX: 0.78 },
  { id: "usmle", file: "hero-usmle_f103.jpg", focusX: 0.8 },
  { id: "pance", file: "hero-pance_c0f7.jpg", focusX: 0.78 },
  { id: "aanp-fnp", file: "hero-fnp_3f3e.jpg", focusX: 0.7 },
  { id: "npte-pt", file: "hero-npte_1bc8.jpg", focusX: 0.76 },
];

const SOURCE = { width: 1280, height: 720 };
const MOBILE_ASPECT = 390 / 780;

function mobileExtract(focusX) {
  const height = SOURCE.height;
  const width = Math.round(height * MOBILE_ASPECT);
  const maxLeft = SOURCE.width - width;
  const center = Math.round(focusX * SOURCE.width);
  const left = Math.min(maxLeft, Math.max(0, center - Math.round(width / 2)));
  return { left, top: 0, width, height };
}

async function encodeVariant(input, outBase, extract) {
  const base = sharp(input, { failOn: "none" });
  const cropped = extract ? base.extract(extract) : base;
  const webpPath = `${outBase}.webp`;
  const avifPath = `${outBase}.avif`;
  const cap = extract ? 80 * 1024 : 120 * 1024;

  let webpQ = 82;
  for (let attempt = 0; attempt < 6; attempt++) {
    await cropped.clone().webp({ quality: webpQ, effort: 5 }).toFile(webpPath);
    if (fs.statSync(webpPath).size <= cap || webpQ <= 60) break;
    webpQ -= 4;
  }

  let avifQ = 58;
  for (let attempt = 0; attempt < 6; attempt++) {
    await cropped.clone().avif({ quality: avifQ, effort: 6 }).toFile(avifPath);
    if (fs.statSync(avifPath).size <= cap || avifQ <= 40) break;
    avifQ -= 4;
  }

  const meta = await sharp(avifPath).metadata();
  return {
    webp: fs.statSync(webpPath).size,
    avif: fs.statSync(avifPath).size,
    width: meta.width,
    height: meta.height,
  };
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const report = [];
for (const hero of HEROES) {
  const input = path.join(UPLOAD_DIR, hero.file);
  if (!fs.existsSync(input)) {
    throw new Error(`Missing upload: ${input}`);
  }
  const desktop = await encodeVariant(input, path.join(OUT_DIR, `${hero.id}-desktop`), null);
  const mobile = await encodeVariant(
    input,
    path.join(OUT_DIR, `${hero.id}-mobile`),
    mobileExtract(hero.focusX)
  );
  report.push({ id: hero.id, variant: "desktop", ...desktop });
  report.push({ id: hero.id, variant: "mobile", ...mobile });
}

const hashes = new Map();
for (const hero of HEROES) {
  for (const suffix of ["desktop", "mobile"]) {
    for (const ext of ["avif", "webp"]) {
      const file = path.join(OUT_DIR, `${hero.id}-${suffix}.${ext}`);
      const hash = createHash("sha256").update(fs.readFileSync(file)).digest("hex");
      if (hashes.has(hash)) {
        throw new Error(`${file} matches ${hashes.get(hash)}`);
      }
      hashes.set(hash, file);
    }
  }
}

console.table(
  report.map((row) => ({
    hero: row.id,
    variant: row.variant,
    px: `${row.width}x${row.height}`,
    webp_kb: Math.round(row.webp / 1024),
    avif_kb: Math.round(row.avif / 1024),
  }))
);
