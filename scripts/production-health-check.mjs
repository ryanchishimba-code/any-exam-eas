#!/usr/bin/env node
/**
 * Liveness check for production — used by GitHub Actions uptime and local ops.
 *
 * Usage:
 *   node scripts/production-health-check.mjs
 *   node scripts/production-health-check.mjs --url https://www.anyexameasy.com
 *   CRON_SECRET=... node scripts/production-health-check.mjs --detailed
 */
const args = process.argv.slice(2);
const urlIdx = args.indexOf("--url");
const baseUrl = (
  urlIdx >= 0 ? args[urlIdx + 1] : process.env.PRODUCTION_URL ?? "https://www.anyexameasy.com"
).replace(/\/$/, "");
const detailed = args.includes("--detailed");
const timeoutMs = Number(process.env.HEALTH_TIMEOUT_MS ?? 20_000);

function loadCronSecret() {
  if (process.env.CRON_SECRET?.trim()) return process.env.CRON_SECRET.trim();
  return "";
}

async function main() {
  const headers = {};
  const secret = loadCronSecret();
  if (detailed) {
    if (!secret) {
      console.error("CRON_SECRET is required for --detailed");
      process.exit(1);
    }
    headers.Authorization = `Bearer ${secret}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(`${baseUrl}/api/health`, {
      headers,
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Health request failed (${baseUrl}/api/health): ${message}`);
    process.exit(1);
  } finally {
    clearTimeout(timer);
  }

  const body = await res.json().catch(() => ({}));
  const ok = res.status === 200 && body.ok === true;

  if (detailed) {
    console.log(JSON.stringify(body, null, 2));
    const db = body.checks?.databaseUrl ?? "?";
    const prisma = body.checks?.prisma ?? "?";
    const bank = body.checks?.questionBank ?? "?";
    console.log(`\nSummary: ok=${body.ok} db=${db} prisma=${prisma} bank=${bank}`);
  } else {
    console.log(`${baseUrl}/api/health → HTTP ${res.status} ok=${body.ok ?? false}`);
  }

  if (!ok) process.exit(1);
}

main();
