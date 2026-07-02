#!/usr/bin/env node
/**
 * Validates that every major nav link / CTA destination loads with meaningful content.
 * Simulates "click → result" for href-based navigation (server + auth cookie).
 *
 * Usage:
 *   node scripts/test-click-audit.mjs [baseUrl]
 *   LOAD_TEST_EMAIL=... LOAD_TEST_PASSWORD=... node scripts/test-click-audit.mjs
 */
const base = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const email = process.env.LOAD_TEST_EMAIL ?? "dev@anyexameasy.test";
const password = process.env.LOAD_TEST_PASSWORD ?? "DevPassword1!";

/** path, allowed HTTP statuses, substrings that must appear in HTML (any match = ok) */
const PUBLIC_DESTINATIONS = [
  { label: "Home", path: "/", expect: [200], markers: ["One subscription", "Four licensing", "NCLEX"] },
  { label: "Pricing", path: "/pricing", expect: [200], markers: ["trial", "29.99"] },
  { label: "Signup", path: "/signup", expect: [200], markers: ["Choose your plan", "study support tool"] },
  { label: "Auth login", path: "/auth/login", expect: [200], markers: ["Log in", "NCLEX"] },
  { label: "Feedback", path: "/feedback", expect: [200], markers: ["feedback", "Send"] },
  { label: "Privacy", path: "/legal/privacy", expect: [200], markers: ["Privacy"] },
  { label: "Terms", path: "/legal/terms", expect: [200], markers: ["Terms"] },
  { label: "Exam NCLEX landing", path: "/exams/nclex", expect: [200, 307], markers: ["NCLEX", "Nursing"] },
  { label: "Exam USMLE landing", path: "/exams/usmle", expect: [200, 307], markers: ["USMLE"] },
  { label: "Exam NAPLEX landing", path: "/exams/naplex", expect: [200, 307], markers: ["NAPLEX"] },
  { label: "Exam MPJE landing (legacy → NAPLEX)", path: "/exams/mpje", expect: [200, 307, 308], markers: ["NAPLEX", "Pharmacy"] },
];

const AUTH_DESTINATIONS = [
  { label: "Dashboard (Home)", path: "/dashboard", markers: ["Dashboard", "Study"] },
  { label: "Question Bank", path: "/question-bank", markers: ["Question", "Bank", "practice"] },
  { label: "Quick Reference", path: "/reference", markers: ["Reference", "Memory Cards"] },
  { label: "Reference NCLEX", path: "/reference?exam=nclex", markers: ["Memory Cards", "NCLEX"] },
  { label: "Full Exam hub", path: "/full-exam", markers: ["Full Exam", "Exam", "NCLEX"] },
  { label: "Full Exam NCLEX", path: "/full-exam/nclex", markers: ["NCLEX", "Exam", "question"] },
  { label: "Analytics", path: "/analytics", markers: ["Analytics", "Performance", "accuracy"] },
  { label: "High-Yield Topics", path: "/dashboard/topics", markers: ["High-Yield", "Topics"] },
  {
    label: "Topics deep link (sepsis module)",
    path: "/dashboard/topics?exam=nclex&topic=sepsis-shock",
    markers: ["Sepsis", "Open module", "Textbook"],
  },
  { label: "Top 500 Drugs", path: "/study/drugs300", markers: ["500", "Drug", "flashcard"] },
  { label: "Select exam", path: "/select-exam", markers: ["exam", "NCLEX", "Select"] },
  { label: "Settings", path: "/settings", markers: ["Settings", "Account"] },
  { label: "Practice NCLEX", path: "/practice/nclex", markers: ["NCLEX", "practice", "Question"] },
  { label: "Practice USMLE", path: "/practice/usmle", markers: ["USMLE", "practice"] },
  { label: "Practice NAPLEX", path: "/practice/naplex", markers: ["NAPLEX", "practice"] },
  { label: "Practice MPJE", path: "/practice/mpje", markers: ["MPJE", "practice"] },
];

const API_ACTIONS = [
  { label: "Question fetch (NCLEX)", path: "/api/questions?field=nursing&subjectId=pharmacology-nursing&limit=3", jsonPath: "questions", minLen: 1 },
  {
    label: "Adaptive next (bank start)",
    path: "/api/study/adaptive/next",
    method: "POST",
    body: { field: "nursing", subjectId: "pharmacology-nursing", count: 5 },
    jsonPath: "questions",
    minLen: 1,
  },
  { label: "Learning dashboard", path: "/api/learning/dashboard", jsonPath: "dashboard" },
  { label: "Subscription status", path: "/api/subscription/status", jsonPath: "status" },
  { label: "Drugs300 due", path: "/api/drugs300/due" },
];

let passed = 0;
let failed = 0;
const failures = [];

function ok(label, detail = "") {
  passed++;
  console.log(`  ✓ ${label}${detail ? ` — ${detail}` : ""}`);
}

function fail(label, detail = "") {
  failed++;
  const msg = `${label}${detail ? ` — ${detail}` : ""}`;
  failures.push(msg);
  console.log(`  ✗ ${msg}`);
}

function extractCookies(setCookieHeader) {
  if (!setCookieHeader) return "";
  const parts = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  return parts.map((c) => c.split(";")[0]).join("; ");
}

function hasMarker(html, markers) {
  const lower = html.toLowerCase();
  return markers.some((m) => lower.includes(m.toLowerCase()));
}

function getJsonPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

async function login() {
  const csrfRes = await fetch(`${base}/api/auth/csrf`);
  if (csrfRes.status !== 200) return null;
  const { csrfToken } = await csrfRes.json();
  const csrfCookies = extractCookies(csrfRes.headers.getSetCookie?.() ?? csrfRes.headers.get("set-cookie"));

  const body = new URLSearchParams({
    csrfToken,
    email,
    password,
    callbackUrl: `${base}/dashboard`,
    json: "true",
  });

  const loginRes = await fetch(`${base}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: csrfCookies,
    },
    body,
    redirect: "manual",
  });

  const loginCookies = extractCookies(loginRes.headers.getSetCookie?.() ?? loginRes.headers.get("set-cookie"));
  const cookie = [csrfCookies, loginCookies].filter(Boolean).join("; ");
  if (loginRes.status < 200 || loginRes.status >= 400) return null;

  const sessionRes = await fetch(`${base}/api/auth/session`, { headers: cookie ? { Cookie: cookie } : {} });
  if (sessionRes.status !== 200) return null;
  const session = await sessionRes.json();
  if (!session?.user?.email) return null;
  return { cookie, session };
}

async function checkDestination({ label, path, expect = [200, 307, 308], markers }, cookie) {
  try {
    const res = await fetch(`${base}${path}`, {
      redirect: "manual",
      headers: cookie ? { Cookie: cookie } : {},
    });
    const allowed = Array.isArray(expect) ? expect : [expect];
    if (!allowed.includes(res.status)) {
      fail(label, `HTTP ${res.status} on ${path}`);
      return;
    }
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location") ?? "";
      ok(label, `${res.status} → ${loc || "redirect"}`);
      return;
    }
    const html = await res.text();
    if (markers?.length && !hasMarker(html, markers)) {
      fail(label, `loaded but missing expected content on ${path}`);
      return;
    }
    ok(label, `${res.status} ${path}`);
  } catch (e) {
    fail(label, e instanceof Error ? e.message : String(e));
  }
}

async function checkApiAction(action, cookie) {
  try {
    const opts = {
      headers: { ...(cookie ? { Cookie: cookie } : {}), "Content-Type": "application/json" },
      method: action.method ?? "GET",
    };
    if (action.body) opts.body = JSON.stringify(action.body);
    const res = await fetch(`${base}${action.path}`, opts);
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* ignore */
    }
    if (res.status < 200 || res.status >= 500) {
      fail(action.label, `HTTP ${res.status}`);
      return;
    }
    if (action.jsonOk && json?.ok !== true && json?.ok !== undefined) {
      fail(action.label, "ok !== true");
      return;
    }
    if (action.jsonPath) {
      const val = getJsonPath(json, action.jsonPath);
      if (action.minLen && (!Array.isArray(val) || val.length < action.minLen)) {
        fail(action.label, `empty ${action.jsonPath}`);
        return;
      }
      if (val === undefined && action.jsonPath !== "due") {
        fail(action.label, `missing ${action.jsonPath}`);
        return;
      }
    }
    ok(action.label, String(res.status));
  } catch (e) {
    fail(action.label, e instanceof Error ? e.message : String(e));
  }
}

console.log(`\nClick audit — link & action destinations\nBase: ${base}\n`);

console.log("Public destinations (marketing & legal)");
for (const dest of PUBLIC_DESTINATIONS) {
  await checkDestination(dest);
}

console.log("\nAuthenticated app shell (sidebar / bottom nav targets)");
const auth = await login();
if (!auth) {
  fail("login", `could not sign in as ${email}`);
} else {
  ok("login", auth.session.user.email);
  for (const dest of AUTH_DESTINATIONS) {
    await checkDestination(dest, auth.cookie);
  }

  console.log("\nAPI actions (button-backed results)");
  for (const action of API_ACTIONS) {
    await checkApiAction(action, auth.cookie);
  }
}

console.log(`\n${"─".repeat(48)}`);
console.log(`Passed: ${passed}  Failed: ${failed}`);
if (failures.length) {
  console.log("\nFailures:");
  for (const f of failures) console.log(`  • ${f}`);
  console.log(
    "\nNote: client-only clicks (Open module panel, memory card sheet, in-session question UI)" +
      " require browser verification — run with dev server and test manually or via browser tools."
  );
  process.exit(1);
}
console.log("\nAll click destinations returned results.");
process.exit(0);
