/**
 * Mobile hero exports from the native 720×1280 (9:16) portraits.
 * 1x is 360 wide for DPR 1. DPR 2 keeps the full 720×1280 frame.
 * DPR 3 is a Lanczos 1080-wide enlargement of that same frame.
 * Every phone file is lightly sharpened. Desktop 1280×720 files stay put.
 * Run: node scripts/optimize-marketing-hero-photos.mjs
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const UPLOAD_DIR = process.env.HERO_UPLOAD_DIR ?? "/home/ubuntu/.cursor/projects/workspace/uploads";
const OUT_DIR = path.join(process.cwd(), "public/images/marketing/heroes");

const HEROES = [
  { id: "home", file: "home-mobile_a73b.jpg" },
  { id: "nclex", file: "nclex-mobile_5496.jpg" },
  { id: "naplex", file: "naplex-mobile_617f.jpg" },
  { id: "usmle", file: "usmle-mobile_ceba.jpg" },
  { id: "pance", file: "pance-mobile_ab82.jpg" },
  { id: "aanp-fnp", file: "aanp-fnp-mobile_f7f3.jpg" },
  { id: "npte-pt", file: "npte-pt-mobile_d1bb.jpg" },
];

const WIDTH = { x1: 360, x2: 720, x3: 1080 };

async function encode(input, width, outBase) {
  const pipeline = sharp(input, { failOn: "none" })
    .resize({
      width,
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: width <= WIDTH.x2,
    })
    .sharpen({ sigma: 0.8, m1: 1, m2: 0.4 });
  const webpPath = `${outBase}.webp`;
  const avifPath = `${outBase}.avif`;
  const webpQ = 80;
  const avifQ = 80;
  await pipeline.clone().webp({ quality: webpQ, effort: 5 }).toFile(webpPath);
  await pipeline.clone().avif({ quality: avifQ, effort: 6, chromaSubsampling: "4:2:0" }).toFile(avifPath);

  const meta = await sharp(avifPath).metadata();
  return {
    webp: fs.statSync(webpPath).size,
    avif: fs.statSync(avifPath).size,
    width: meta.width,
    height: meta.height,
    webpQ,
    avifQ,
  };
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const report = [];
for (const hero of HEROES) {
  const input = path.join(UPLOAD_DIR, hero.file);
  if (!fs.existsSync(input)) throw new Error(`Missing upload: ${input}`);
  const source = await sharp(input).metadata();
  if (source.width !== 720 || source.height !== 1280) {
    throw new Error(`${hero.file} is ${source.width}x${source.height}, expected 720x1280`);
  }
  const x1 = await encode(input, WIDTH.x1, path.join(OUT_DIR, `${hero.id}-mobile`));
  const x2 = await encode(input, WIDTH.x2, path.join(OUT_DIR, `${hero.id}-mobile-2x`));
  const x3 = await encode(input, WIDTH.x3, path.join(OUT_DIR, `${hero.id}-mobile-3x`));
  report.push({ id: hero.id, variant: "1x", ...x1 });
  report.push({ id: hero.id, variant: "2x", ...x2 });
  report.push({ id: hero.id, variant: "3x", ...x3 });
}

const hashes = new Map();
for (const hero of HEROES) {
  for (const name of [`${hero.id}-mobile`, `${hero.id}-mobile-2x`, `${hero.id}-mobile-3x`]) {
    for (const ext of ["avif", "webp"]) {
      const file = path.join(OUT_DIR, `${name}.${ext}`);
      const hash = createHash("sha256").update(fs.readFileSync(file)).digest("hex");
      if (hashes.has(hash)) throw new Error(`${file} matches ${hashes.get(hash)}`);
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
    webpQ: row.webpQ,
    avifQ: row.avifQ,
  }))
);
