#!/usr/bin/env node
/**
 * Verify production ramp readiness via GET /api/health (Bearer CRON_SECRET).
 *
 * Usage:
 *   CRON_SECRET=... npm run scale:readiness
 *   CRON_SECRET=... node scripts/scale-readiness.mjs --url https://www.anyexameasy.com
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const urlIdx = args.indexOf("--url");
const baseUrl = (
  urlIdx >= 0 ? args[urlIdx + 1] : process.env.SCALE_READINESS_URL ?? "https://www.anyexameasy.com"
).replace(/\/$/, "");

function loadCronSecret() {
  if (process.env.CRON_SECRET?.trim()) return process.env.CRON_SECRET.trim();
  for (const name of [".env.local", ".env"]) {
    const path = join(root, name);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const m = line.match(/^CRON_SECRET=(.+)$/);
      if (m) return m[1].replace(/^["']|["']$/g, "").trim();
    }
  }
  return "";
}

const secret = loadCronSecret();
if (!secret) {
  console.error("CRON_SECRET is required (env or .env.local)");
  process.exit(1);
}

const res = await fetch(`${baseUrl}/api/health`, {
  headers: { Authorization: `Bearer ${secret}` },
});
const body = await res.json().catch(() => ({}));

console.log(`\nScale readiness — ${baseUrl}\n`);
console.log(`HTTP ${res.status}  core ok: ${body.ok ?? "?"}`);

if (body.scaleReadiness) {
  const { ready, phase, checks } = body.scaleReadiness;
  console.log(`Phase: ${phase}  ready: ${ready}\n`);
  for (const c of checks ?? []) {
    const icon = c.status === "ok" ? "✓" : c.status === "warn" ? "!" : "✗";
    console.log(`  ${icon} [${c.status}] ${c.id}: ${c.detail}`);
  }
} else {
  console.warn("No scaleReadiness in response — deploy latest code or check CRON_SECRET.");
}

if (body.checks) {
  console.log("\nCore checks:");
  for (const [k, v] of Object.entries(body.checks)) {
    console.log(`  ${k}: ${v}`);
  }
}

process.exit(body.scaleReadiness?.ready && body.ok ? 0 : 1);
