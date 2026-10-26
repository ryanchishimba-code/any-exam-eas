/**
 * Warm URLs then run Lighthouse mobile 3x; print medians.
 * Usage: node scripts/lighthouse-hero-benchmark.mjs <label> <baseUrl> </nclex>
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const label = process.argv[2];
const baseUrl = process.argv[3]?.replace(/\/$/, "");
const vercelShare = process.env.VERCEL_SHARE?.trim();
const paths = process.argv.slice(4);
if (!label || !baseUrl || paths.length === 0) {
  console.error("Usage: node scripts/lighthouse-hero-benchmark.mjs <label> <baseUrl> / /nclex");
  process.exit(1);
}

const OUT_DIR = path.join("/opt/cursor/artifacts/lighthouse-benchmark", label);
fs.mkdirSync(OUT_DIR, { recursive: true });

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function warm(url) {
  for (let i = 0; i < 4; i++) {
    try {
      await fetch(url, { redirect: "follow" });
    } catch {
      /* ignore */
    }
  }
}

function runLighthouse(url, outFile) {
  const res = spawnSync(
    "npx",
    [
      "--yes",
      "lighthouse@12.6.1",
      url,
      "--only-categories=performance",
      "--form-factor=mobile",
      "--screenEmulation.mobile=true",
      "--throttling-method=simulate",
      "--output=json",
      `--output-path=${outFile}`,
      "--chrome-flags=--headless --no-sandbox",
      "--quiet",
    ],
    { encoding: "utf8", timeout: 180_000 }
  );
  if (res.status !== 0) {
    throw new Error(res.stderr || res.stdout || `lighthouse failed for ${url}`);
  }
}

function lcpElementFromAudit(j) {
  const tables = j.audits["largest-contentful-paint-element"]?.details?.items ?? [];
  for (const table of tables) {
    const node = table?.items?.[0]?.node;
    if (node?.snippet || node?.selector) {
      return {
        snippet: node.snippet,
        selector: node.selector,
        label: node.nodeLabel,
      };
    }
  }
  return null;
}

function extract(file) {
  const j = JSON.parse(fs.readFileSync(file, "utf8"));
  const lcpNode = lcpElementFromAudit(j);
  const lcpEl = lcpNode
    ? `${lcpNode.snippet ?? lcpNode.selector} (${lcpNode.label ?? ""})`.trim()
    : "unknown";
  return {
    perf: j.categories.performance.score,
    lcpMs: j.audits["largest-contentful-paint"].numericValue,
    cls: j.audits["cumulative-layout-shift"].numericValue,
    tbt: j.audits["total-blocking-time"].numericValue,
    lcpElement: lcpEl,
  };
}

const summary = {};

function pageUrl(path) {
  const u = new URL(path === "/" ? "/" : path, `${baseUrl}/`);
  if (vercelShare) u.searchParams.set("_vercel_share", vercelShare);
  return u.href;
}

for (const p of paths) {
  const url = pageUrl(p);
  console.log(`\n[${label}] warming ${url}`);
  await warm(url);

  const runs = [];
  for (let i = 0; i < 3; i++) {
    const outFile = path.join(OUT_DIR, `${p.replace(/\//g, "_") || "home"}_run${i + 1}.json`);
    console.log(`[${label}] lighthouse ${p} run ${i + 1}/3`);
    runLighthouse(url, outFile);
    runs.push(extract(outFile));
  }

  summary[p] = {
    perf: median(runs.map((r) => r.perf)),
    lcpMs: median(runs.map((r) => r.lcpMs)),
    cls: median(runs.map((r) => r.cls)),
    tbt: median(runs.map((r) => r.tbt)),
    lcpElement: runs.map((r) => r.lcpElement),
  };
}

const reportPath = path.join(OUT_DIR, "summary.json");
fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
console.log("\n=== MEDIAN SUMMARY ===");
console.log(JSON.stringify(summary, null, 2));
console.log(`\nWrote ${reportPath}`);
