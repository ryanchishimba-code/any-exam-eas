#!/usr/bin/env node
/**
 * Download HuBMAP CCF v1.2 Visible Human reference organ GLBs for local serving.
 * Usage: node scripts/fetch-visible-human-organs.mjs
 *
 * After download, set in .env.local:
 *   NEXT_PUBLIC_VOLUME_ORGAN_BASE=/anatomy/volumes
 */

import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/anatomy/volumes");

const HRA_CDN =
  "https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-releases@main/v1.2/models";

/** Full HuBMAP CCF v1.2 male atlas set for CT mode + local serving. */
const ORGAN_FILES = [
  "VH_M_Skin.glb",
  "VH_M_Heart.glb",
  "VH_M_Lung.glb",
  "VH_M_Blood_Vasculature.glb",
  "VH_M_Liver.glb",
  "VH_M_Spleen.glb",
  "VH_M_Pancreas.glb",
  "VH_M_Kidney_L.glb",
  "VH_M_Kidney_R.glb",
  "VH_M_Small_Intestine.glb",
  "SBU_M_Intestine_Large.glb",
  "VH_M_Urinary_Bladder.glb",
  "VH_M_Prostate.glb",
  "Allen_M_Brain.glb",
  "VH_M_Spinal_Cord.glb",
  "VH_M_Thymus.glb",
  "VH_M_Pelvis.glb",
  "VH_M_Knee_L.glb",
  "VH_M_Knee_R.glb",
];

async function downloadFile(fileName) {
  const url = `${HRA_CDN}/${fileName}`;
  const dest = path.join(OUT_DIR, fileName);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  await pipeline(res.body, createWriteStream(dest));
  const sizeMb = ((res.headers.get("content-length") ?? 0) / 1e6).toFixed(1);
  console.log(`  ✓ ${fileName} (${sizeMb} MB)`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Downloading ${ORGAN_FILES.length} HRA reference organs → ${OUT_DIR}\n`);

  for (const file of ORGAN_FILES) {
    await downloadFile(file);
  }

  const readme = `# Visible Human / HuBMAP CCF v1.2 Reference Organs

Derived from the NLM Visible Human Project via HuBMAP CCF 3D Reference Object Library.
License: CC BY 4.0 — https://hubmapconsortium.github.io/ccf/pages/ccf-3d-reference-library.html

Source: https://github.com/hubmapconsortium/ccf-releases/tree/main/v1.2/models

Enable local serving:
  NEXT_PUBLIC_VOLUME_ORGAN_BASE=/anatomy/volumes
`;
  await writeFile(path.join(OUT_DIR, "README.md"), readme);
  console.log("\nDone. Recommended: NEXT_PUBLIC_VOLUME_ORGAN_BASE=local in .env.local");
  console.log("Default: CT atlas tries /anatomy/volumes first, then jsDelivr CDN fallback.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
