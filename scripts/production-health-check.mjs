#!/usr/bin/env node
/**
 * Liveness / database check for production — used by GitHub Actions and local ops.
 *
 * Usage:
 *   node scripts/production-health-check.mjs
 *   node scripts/production-health-check.mjs --url https://www.anyexameasy.com
 *   CRON_SECRET=... node scripts/production-health-check.mjs --detailed
 *   CRON_SECRET=... node scripts/production-health-check.mjs --database
 */
const args = process.argv.slice(2);
const urlIdx = args.indexOf("--url");
const baseUrl = (
  urlIdx >= 0 ? args[urlIdx + 1] : process.env.PRODUCTION_URL ?? "https://www.anyexameasy.com"
).replace(/\/$/, "");
const detailed = args.includes("--detailed");
const database = args.includes("--database");
const timeoutMs = Number(process.env.HEALTH_TIMEOUT_MS ?? 25_000);

function loadCronSecret() {
  if (process.env.CRON_SECRET?.trim()) return process.env.CRON_SECRET.trim();
  return "";
}

async function fetchJson(path, headers, ms = timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      headers,
      cache: "no-store",
      signal: controller.signal,
    });
    const body = await res.json().catch(() => ({}));
    return { res, body };
  } finally {
    clearTimeout(timer);
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function runPublicCheck() {
  let res;
  let body;
  try {
    ({ res, body } = await fetchJson("/api/health", {}));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(`Health request failed (${baseUrl}/api/health): ${message}`);
  }

  const ok = res.status === 200 && body.ok === true;
  console.log(`${baseUrl}/api/health → HTTP ${res.status} ok=${body.ok ?? false}`);
  if (!ok) fail("Public health check failed");
}

async function runDetailedCheck(secret) {
  let res;
  let body;
  try {
    ({ res, body } = await fetchJson("/api/health", {
      Authorization: `Bearer ${secret}`,
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(`Detailed health request failed: ${message}`);
  }

  console.log(JSON.stringify(body, null, 2));
  const db = body.checks?.databaseUrl ?? "?";
  const ping = body.checks?.databasePing ?? "?";
  const prisma = body.checks?.prisma ?? "?";
  const bank = body.checks?.questionBank ?? "?";
  console.log(`\nSummary: ok=${body.ok} db=${db} ping=${ping} prisma=${prisma} bank=${bank}`);

  if (res.status !== 200 || body.ok !== true) {
    fail("Detailed health check failed (ok !== true)");
  }
  if (db !== "postgresql") {
    fail(`Expected databaseUrl=postgresql, got ${db}`);
  }
  if (ping !== "ok") {
    fail(`Expected databasePing=ok, got ${ping}`);
  }
  if (prisma && prisma !== "ok" && prisma !== "unknown") {
    fail(`Expected prisma=ok, got ${prisma}`);
  }
  if (bank && String(bank).includes("error")) {
    fail(`Question bank check failed: ${bank}`);
  }
}

async function runKeepaliveCheck(secret) {
  let res;
  let body;
  try {
    ({ res, body } = await fetchJson(
      "/api/cron/db-keepalive",
      { Authorization: `Bearer ${secret}` },
      45_000
    ));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(`Keepalive probe failed: ${message}`);
  }

  console.log(
    `keepalive → HTTP ${res.status} ok=${body.ok ?? false} warmed=${body.warmed ?? "?"} prismaOk=${body.prismaOk ?? "?"}`
  );
  if (res.status !== 200 || body.ok !== true) {
    fail("Neon keepalive probe failed — compute may be asleep or DATABASE_URL misconfigured");
  }
}

async function main() {
  if (database || detailed) {
    const secret = loadCronSecret();
    if (!secret) {
      fail("CRON_SECRET is required for --detailed / --database");
    }

    if (database) {
      console.log("=== Production database check ===\n");
      await runPublicCheck();
      console.log("");
      await runDetailedCheck(secret);
      console.log("");
      await runKeepaliveCheck(secret);
      console.log("\n✓ Database check passed");
      return;
    }

    await runDetailedCheck(secret);
    return;
  }

  await runPublicCheck();
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
