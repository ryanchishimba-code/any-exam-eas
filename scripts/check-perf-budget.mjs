/**
 * Fails CI when a production build ships the Neon driver to the browser
 * or when a watched route's client JavaScript grows past its budget.
 *
 * Run after `next build`. With no `.next` output it only checks source guards.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const nextConfig = readFileSync(path.join(root, "next.config.ts"), "utf8");
if (/inlineCss:\s*true/.test(nextConfig)) {
  console.error("experimental.inlineCss must stay false");
  process.exit(1);
}

const home = readFileSync(
  path.join(root, "src/app/(marketing)/(with-flagship)/page.tsx"),
  "utf8"
);
if (!home.includes("export const revalidate = 300")) {
  console.error("homepage must stay on a 5-minute revalidate");
  process.exit(1);
}
if (home.includes('dynamic = "force-dynamic"')) {
  console.error("homepage must not be force-dynamic");
  process.exit(1);
}

const staticDir = path.join(root, ".next/static");
if (!existsSync(staticDir)) {
  console.log("perf budget: source guards passed (no .next build to measure)");
  process.exit(0);
}

function chunkHasNeon(full) {
  if (!existsSync(full)) return false;
  const text = readFileSync(full, "utf8");
  return text.includes("@neondatabase/serverless") || text.includes("neondatabase");
}

/** Gzip budgets for the client files named by each route manifest. */
const ROUTE_GZIP_BUDGETS = {
  // Measured gzip of every client file named by the route manifest, plus ~15%.
  "app/(marketing)/(with-flagship)/page_client-reference-manifest.js": 170_000,
  "app/nclex/page_client-reference-manifest.js": 180_000,
  "app/(marketing)/(with-flagship)/[examSlug]/page_client-reference-manifest.js": 180_000,
  "app/(marketing)/pricing/page_client-reference-manifest.js": 180_000,
  "app/(app)/question-bank/page_client-reference-manifest.js": 1_400_000,
  "app/(app)/full-exam/[examSlug]/[sessionId]/page_client-reference-manifest.js": 1_450_000,
};

let failed = false;
for (const [manifestRel, budget] of Object.entries(ROUTE_GZIP_BUDGETS)) {
  const manifestPath = path.join(root, ".next/server", manifestRel);
  if (!existsSync(manifestPath)) {
    console.error("missing route manifest " + manifestRel);
    failed = true;
    continue;
  }
  const text = readFileSync(manifestPath, "utf8");
  const files = new Set();
  for (const match of text.matchAll(/static\/chunks\/[^"'\\\s]+\.js/g)) {
    files.add(match[0]);
  }
  let gzipBytes = 0;
  for (const rel of files) {
    const full = path.join(root, ".next", rel);
    if (!existsSync(full)) continue;
    if (chunkHasNeon(full)) {
      console.error(`${manifestRel} still ships the Neon driver in ${rel}`);
      failed = true;
    }
    gzipBytes += gzipSync(readFileSync(full)).length;
  }
  const kb = Math.round(gzipBytes / 1024);
  const limitKb = Math.round(budget / 1024);
  if (gzipBytes > budget) {
    console.error(`${manifestRel} gzip ${kb} kB exceeds budget ${limitKb} kB`);
    failed = true;
  } else {
    console.log(`${manifestRel} gzip ${kb} kB (budget ${limitKb} kB)`);
  }
}

if (failed) process.exit(1);
console.log("perf budget: passed");
