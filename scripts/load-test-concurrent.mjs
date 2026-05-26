#!/usr/bin/env node
/**
 * Simulates concurrent users against local or deployed app.
 * Usage: node scripts/load-test-concurrent.mjs [baseUrl] [concurrency]
 */
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const concurrency = Number(process.argv[3] ?? 20);
/** Max parallel signups (SQLite dev chokes on 20 at once; Postgres handles more). */
const registerPool = Number(process.argv[4] ?? 5);
const runId = Date.now();

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

console.log(
  `Load test: ${concurrency} users (${registerPool} parallel signups) → ${base}\n`
);

const healthRuns = await Promise.all(
  Array.from({ length: concurrency }, (_, i) =>
    timed(`health-${i}`, () => fetchRoute("/api/health"))
  )
);

const pageRuns = await Promise.all(
  ["/", "/signup", "/pricing", "/login"].map((path) =>
    timed(path, () => fetchRoute(path))
  )
);

const registerIndices = Array.from({ length: concurrency }, (_, i) => i);
const registerRuns = await runPool(registerIndices, registerPool, async (i) =>
  timed(`register-${i}`, () => registerUser(i))
);

function summarize(runs) {
  const ok = runs.filter((r) => r.ok).length;
  const fail = runs.length - ok;
  const avgMs =
    runs.reduce((s, r) => s + r.ms, 0) / Math.max(runs.length, 1);
  return { ok, fail, avgMs: Math.round(avgMs) };
}

const healthSummary = summarize(healthRuns);
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
const minRegOk = Math.max(1, concurrency - 2);

console.log("Public pages:");
for (const r of pageRuns) {
  console.log(
    `  ${r.ok ? "OK" : "FAIL"} ${r.label} ${r.result?.status ?? ""} (${r.ms}ms)`
  );
}

console.log(`\nHealth (${concurrency} parallel):`);
console.log(
  `  ${healthSummary.ok}/${concurrency} ok, avg ${healthSummary.avgMs}ms`
);

console.log(`\nRegister (${concurrency} parallel):`);
console.log(`  ${regOk} created, ${reg429} rate-limited, ${regFail} failed`);
console.log(`  avg ${registerSummary.avgMs}ms`);

if (healthSummary.ok < concurrency) {
  console.log("\nFAIL: health checks did not all succeed under load.");
  process.exit(1);
}

if (regOk < minRegOk) {
  console.log(
    `\nFAIL: expected at least ${minRegOk}/${concurrency} registrations, got ${regOk}.`
  );
  const bad = registerRuns.filter(
    (r) => !r.ok || (r.result?.status !== 200 && r.result?.status !== 429)
  );
  for (const f of bad.slice(0, 5)) {
    const detail = f.result?.error
      ? `${f.result.status} ${f.result.error}`
      : f.error ?? JSON.stringify(f.result);
    console.log(`  ${f.label}: ${detail}`);
  }
  process.exit(1);
}

const failed = pageRuns.filter((r) => !r.ok || r.result?.status >= 400);

if (failed.length > 0) {
  console.log("\nFailures:");
  for (const f of failed) {
    console.log(`  ${f.label}: ${f.result?.status ?? f.error}`);
  }
  process.exit(1);
}

console.log("\nLoad test passed.");
process.exit(0);
