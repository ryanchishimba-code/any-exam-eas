#!/usr/bin/env node
/**
 * Undo a consented testimonial seed batch (dry run by default).
 *
 *   npx tsx scripts/undo-consented-testimonials.ts --batch testimonials-2026-10-28
 *   npx tsx scripts/undo-consented-testimonials.ts --batch testimonials-2026-10-28 --apply
 */
import { spawnSync } from "node:child_process";
import path from "node:path";

const args = process.argv.slice(2);
const batchIndex = args.indexOf("--batch");
const batchId = batchIndex >= 0 ? args[batchIndex + 1] : null;

if (!batchId) {
  console.error("Usage: undo-consented-testimonials.ts --batch <batch-id> [--apply]");
  process.exit(1);
}

const apply = args.includes("--apply");
const seedScript = path.join(process.cwd(), "scripts/seed-consented-testimonials.ts");
const seedArgs = ["tsx", seedScript, "--batch", batchId, "--remove", ...(apply ? ["--apply"] : [])];

const result = spawnSync("npx", seedArgs, { stdio: "inherit", env: process.env });
process.exit(result.status ?? 1);
