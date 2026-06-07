#!/usr/bin/env node
/**
 * Drop a production `.next` output before `next dev` so vendor chunks stay in sync.
 * Written by `next build` / vercel-build; consumed by `predev`.
 */
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = path.join(root, ".next");
const prodMarker = path.join(nextDir, ".production-build");

if (existsSync(prodMarker)) {
  console.log("Clearing production .next cache before dev (run npm run dev:fix if issues persist)…");
  rmSync(nextDir, { recursive: true, force: true });
}
