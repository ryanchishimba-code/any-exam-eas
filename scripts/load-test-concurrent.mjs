#!/usr/bin/env node
/**
 * Simulates concurrent users against local or deployed app.
 * Usage: node scripts/load-test-concurrent.mjs [baseUrl] [concurrency] [registerPool]
 *
 * Examples:
 *   node scripts/load-test-concurrent.mjs http://127.0.0.1:3000 100 15
 *   node scripts/load-test-concurrent.mjs https://any-exam-eas.vercel.app 100 20
 */
const base = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const concurrency = Number(process.argv[3] ?? 20);
/** Max parallel signups (SQLite: ~15; Postgres pooler: ~25–30). */
const registerPool = Number(process.argv[4] ?? (concurrency >= 100 ? 15 : 5));
const readsOnly =
  process.argv.includes("--reads-only") || process.env.LOAD_TEST_READS_ONLY === "1";
const runId = Date.now();

const READ_PATHS = ["/", "/signup", "/pricing", "/login", "/api/health"];

async function runPool(items, poolSize, fn) {
  const results = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(poolSize, items.length) }, () => worker())
  );
  return results;
}

async function timed(label, fn) {
  const start = performance.now();
  try {
    const result = await fn();
    return { label, ok: true, ms: Math.round(performance.now() - start), result };
  } catch (e) {
    return {
      label,
      ok: false,
      ms: Math.round(performance.now() - start),
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

async function registerUser(i) {
  const email = `load-${runId}-${i}@example.com`;
  const res = await fetch(`${base}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `Load User ${i}`,
      email,
      password: "LoadTestPass1!",
      dateOfBirth: "1990-06-15",
      acceptedTerms: true,
      plan: i % 2 === 0 ? "trial" : "subscribe",
    }),
  });
  const data = await res.json().catch(() => ({}));
  return {
    status: res.status,
    email,
    plan: data.plan,
    error: data.error,
    ok: res.ok,
  };
}

async function fetchRoute(path) {
  const res = await fetch(`${base}${path}`, { redirect: "manual" });
  return { path, status: res.status };
}

function summarize(runs) {
  const ok = runs.filter((r) => r.ok).length;
  const fail = runs.length - ok;
  const avgMs =
    runs.reduce((s, r) => s + r.ms, 0) / Math.max(runs.length, 1);
  const p95 = percentile(
    runs.map((r) => r.ms).sort((a, b) => a - b),
    0.95
  );
  return { ok, fail, avgMs: Math.round(avgMs), p95Ms: Math.round(p95) };
}

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil(sorted.length * p) - 1;
  return sorted[Math.max(0, idx)];
}

function statusOk(path, status) {
  if (path === "/api/health") return status === 200 || status === 503;
  if (["/study", "/learn", "/generate", "/checkout"].includes(path)) {
    return status === 200 || status === 307;
  }
  return status >= 200 && status < 400;
}

console.log(
  `Load test: ${concurrency} concurrent users${readsOnly ? " (reads-only)" : ` (${registerPool} parallel signups)`} → ${base}\n`
);

const healthRuns = await Promise.all(
  Array.from({ length: concurrency }, (_, i) =>
    timed(`health-${i}`, () => fetchRoute("/api/health"))
  )
);

const readRuns = await Promise.all(
  Array.from({ length: concurrency }, (_, i) => {
    const path = READ_PATHS[i % READ_PATHS.length];
    return timed(`read-${i}`, async () => {
      const result = await fetchRoute(path);
      return { ...result, path };
    });
  })
);

const healthSummary = summarize(healthRuns);
const readSummary = summarize(readRuns);

const healthOk = healthRuns.filter(
  (r) => r.ok && statusOk("/api/health", r.result?.status)
).length;

const readOk = readRuns.filter(
  (r) => r.ok && statusOk(r.result?.path ?? "/", r.result?.status)
).length;

const minHealthOk = concurrency;
const minReadOk = Math.floor(concurrency * 0.98);

console.log(`Health (${concurrency} parallel):`);
console.log(
  `  ${healthOk}/${concurrency} ok, avg ${healthSummary.avgMs}ms, p95 ${healthSummary.p95Ms}ms`
);

console.log(`\nRead traffic (${concurrency} parallel, mixed pages):`);
console.log(
  `  ${readOk}/${concurrency} ok, avg ${readSummary.avgMs}ms, p95 ${readSummary.p95Ms}ms`
);

if (healthOk < minHealthOk) {
  console.log("\nFAIL: health checks did not all succeed under load.");
  const bad = healthRuns.filter(
    (r) => !r.ok || !statusOk("/api/health", r.result?.status)
  );
  for (const f of bad.slice(0, 5)) {
    console.log(`  ${f.label}: ${f.result?.status ?? f.error}`);
  }
  process.exit(1);
}

if (readOk < minReadOk) {
  console.log(
    `\nFAIL: expected at least ${minReadOk}/${concurrency} read requests to succeed.`
  );
  process.exit(1);
}

if (readsOnly) {
  console.log("\nLoad test passed (reads-only).");
  process.exit(0);
}

const registerIndices = Array.from({ length: concurrency }, (_, i) => i);
const registerRuns = await runPool(registerIndices, registerPool, async (i) =>
  timed(`register-${i}`, () => registerUser(i))
);
const registerSummary = summarize(registerRuns);

const regOk = registerRuns.filter(
  (r) => r.ok && r.result?.status === 200
).length;
const reg429 = registerRuns.filter(
  (r) => r.ok && r.result?.status === 429
).length;
const regFail = registerRuns.filter(
  (r) => !r.ok || (r.result?.status !== 200 && r.result?.status !== 429)
).length;

const minRegOk =
  concurrency >= 100
    ? Math.min(40, Math.floor(concurrency * 0.35))
    : Math.max(1, concurrency - 2);

console.log(`\nRegister (${concurrency} attempts, pool ${registerPool}):`);
console.log(`  ${regOk} created, ${reg429} rate-limited, ${regFail} hard-failed`);
console.log(`  avg ${registerSummary.avgMs}ms, p95 ${registerSummary.p95Ms}ms`);

if (regOk < minRegOk && reg429 + regOk < minRegOk) {
  console.log(
    `\nFAIL: expected at least ${minRegOk} registrations (200) or rate-limit protection; got ${regOk} ok, ${reg429} limited.`
  );
  const bad = registerRuns.filter(
    (r) => !r.ok || (r.result?.status !== 200 && r.result?.status !== 429)
  );
  for (const f of bad.slice(0, 8)) {
    const detail = f.result?.error
      ? `${f.result.status} ${f.result.error}`
      : f.error ?? JSON.stringify(f.result);
    console.log(`  ${f.label}: ${detail}`);
  }
  process.exit(1);
}

console.log("\nLoad test passed.");
process.exit(0);
