#!/usr/bin/env node
/**
 * Smoke-test public routes. Usage: node scripts/smoke-test.mjs [baseUrl]
 */
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

const routes = [
  { path: "/", expect: 200 },
  { path: "/login", expect: 200 },
  { path: "/forgot-password", expect: 200 },
  { path: "/signup", expect: 200 },
  { path: "/study", expect: [200, 307] },
  { path: "/study/practice", expect: [200, 307] },
  { path: "/learn", expect: [200, 307] },
  { path: "/generate", expect: [200, 307] },
  { path: "/pricing", expect: 200 },
  { path: "/feedback", expect: 200 },
  { path: "/employee/login", expect: [200, 307, 308] },
  { path: "/checkout", expect: [200, 307] },
  { path: "/api/health", expect: [200, 503] },
];

let failed = 0;

for (const { path, expect } of routes) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const allowed = Array.isArray(expect) ? expect : [expect];
    const ok = allowed.includes(res.status);
    console.log(`${ok ? "OK" : "FAIL"} ${res.status} ${path}`);
    if (!ok) failed++;
  } catch (e) {
    console.log(`FAIL ${path} (${e instanceof Error ? e.message : e})`);
    failed++;
  }
}

try {
  const csrf = await fetch(`${base}/api/auth/csrf`);
  const csrfOk = csrf.status === 200;
  console.log(`${csrfOk ? "OK" : "FAIL"} ${csrf.status} /api/auth/csrf`);
  if (!csrfOk) failed++;
} catch (e) {
  console.log(`FAIL /api/auth/csrf (${e instanceof Error ? e.message : e})`);
  failed++;
}

const signupHtml = await fetch(`${base}/signup`).then((r) => r.text());
const hasPlanChoice =
  signupHtml.includes("Choose your plan") &&
  (signupHtml.includes("day trial") || signupHtml.includes("Subscribe"));
const hasMarketingDisclaimer =
  signupHtml.includes("study support tool") ||
  signupHtml.includes("do not guarantee");
console.log(`${hasPlanChoice ? "OK" : "FAIL"} signup plan choice UI`);
console.log(`${hasMarketingDisclaimer ? "OK" : "FAIL"} signup marketing disclaimer`);
if (!hasPlanChoice) failed++;
if (!hasMarketingDisclaimer) failed++;

if (failed) {
  console.log(`\n${failed} check(s) failed for ${base}`);
  process.exit(1);
}
console.log(`\nAll checks passed for ${base}`);
process.exit(0);
