#!/usr/bin/env node
/**
 * End-to-end feature & flow checks (pages, APIs, auth, catalog).
 * Usage: node scripts/test-feature-flows.mjs [baseUrl]
 */
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const email = process.env.LOAD_TEST_EMAIL ?? "test-premium@anyexameasy.test";
const password = process.env.LOAD_TEST_PASSWORD ?? "TestLogin1!";

const EXAM_FIELD_IDS = ["nursing", "usmle-step-1", "usmle-step-2", "pharmacy"];
const RETIRED_FIELD_IDS = ["dentistry", "sat", "math", "biology", "chemistry", "medicine", "inbde"];
const EXAM_QUESTION_SAMPLES = [
  { field: "nursing", subjectId: "pharmacology-nursing" },
  { field: "usmle-step-1", subjectId: "pathology" },
  { field: "usmle-step-2", subjectId: "cardiology" },
  { field: "pharmacy", subjectId: "pharmacology" },
];

const PUBLIC_PAGES = [
  { path: "/", expect: 200 },
  { path: "/login", expect: 200 },
  { path: "/signup", expect: 200 },
  { path: "/forgot-password", expect: 200 },
  { path: "/reset-password", expect: 200 },
  { path: "/pricing", expect: 200 },
  { path: "/feedback", expect: 200 },
  { path: "/study", expect: [200, 307] },
  { path: "/study/practice", expect: [200, 307] },
  { path: "/study/analytics", expect: [200, 307] },
  { path: "/study/drugs300", expect: [200, 307] },
  { path: "/learn", expect: [200, 307] },
  { path: "/generate", expect: [200, 307] },
  { path: "/dashboard", expect: [200, 307] },
  { path: "/progress", expect: [200, 307] },
  { path: "/checkout", expect: [200, 307] },
  { path: "/checkout/return", expect: [200, 307] },
  { path: "/legal/privacy", expect: 200 },
  { path: "/legal/terms", expect: 200 },
  { path: "/legal/disclaimer", expect: 200 },
  ...EXAM_FIELD_IDS.map((field) => ({
    path: `/study?field=${field}`,
    expect: [200, 307],
  })),
];

const GUEST_APIS = [
  { path: "/api/health", expect: [200, 503] },
  { path: "/api/auth/csrf", expect: 200 },
  { path: "/api/auth/providers", expect: 200 },
  { path: "/api/auth/session", expect: 200 },
  { path: "/api/catalog/subjects", expect: 200 },
  { path: "/api/stripe/config", expect: [200, 500] },
  { path: "/api/subscription/status", expect: [200, 401] },
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

function statusOk(status, expect) {
  const allowed = Array.isArray(expect) ? expect : [expect];
  return allowed.includes(status);
}

async function fetchStatus(path, opts = {}) {
  const res = await fetch(`${base}${path}`, { redirect: "manual", ...opts });
  return res.status;
}

async function fetchJson(path, opts = {}) {
  const res = await fetch(`${base}${path}`, opts);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* not json */
  }
  return { status: res.status, json, text, headers: res.headers };
}

function extractCookies(setCookieHeader) {
  if (!setCookieHeader) return "";
  const parts = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  return parts.map((c) => c.split(";")[0]).join("; ");
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
    callbackUrl: `${base}/study`,
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

  const sessionRes = await fetch(`${base}/api/auth/session`, {
    headers: cookie ? { Cookie: cookie } : {},
  });
  if (sessionRes.status !== 200) return null;
  const session = await sessionRes.json();
  if (!session?.user?.email) return null;
  return { cookie, session };
}

console.log(`\nAny Exam Easy — feature flow tests\nBase URL: ${base}\n`);

console.log("Public pages");
for (const { path, expect } of PUBLIC_PAGES) {
  try {
    const status = await fetchStatus(path);
    statusOk(status, expect) ? ok(path, String(status)) : fail(path, `got ${status}, expected ${expect}`);
  } catch (e) {
    fail(path, e instanceof Error ? e.message : String(e));
  }
}

console.log("\nGuest APIs");
for (const { path, expect } of GUEST_APIS) {
  try {
    const status = await fetchStatus(path);
    statusOk(status, expect) ? ok(path, String(status)) : fail(path, `got ${status}`);
  } catch (e) {
    fail(path, e instanceof Error ? e.message : String(e));
  }
}

console.log("\nCatalog & content");
try {
  const { status, json } = await fetchJson("/api/catalog/subjects");
  if (status !== 200 || !json?.subjects) {
    fail("catalog subjects payload", `status ${status}`);
  } else {
    const ids = json.subjects.map((s) => s.fieldId).sort();
    const expected = [...EXAM_FIELD_IDS].sort();
    if (JSON.stringify(ids) === JSON.stringify(expected)) {
      ok("catalog has 4 exams", ids.join(", "));
    } else {
      fail("catalog exam ids", `got [${ids.join(", ")}]`);
    }
    const total = json.totalQuestions ?? json.subjects.reduce((n, s) => n + (s.questionCount ?? 0), 0);
    total > 0 ? ok("question bank populated", `${total} questions`) : fail("question bank populated", "0 questions");
    for (const retired of RETIRED_FIELD_IDS) {
      if (ids.includes(retired)) fail("no retired subjects", `found ${retired}`);
    }
    if (!ids.some((id) => RETIRED_FIELD_IDS.includes(id))) {
      ok("no retired subjects in catalog");
    }
  }

  const home = await fetch(`${base}/`).then((r) => r.text());
  for (const label of ["NCLEX", "USMLE", "NAPLEX"]) {
    home.includes(label) ? ok(`homepage mentions ${label}`) : fail(`homepage mentions ${label}`);
  }
  for (const retired of ["INBDE", "SAT Prep", "Dentistry"]) {
    !home.includes(retired) ? ok(`homepage omits retired: ${retired}`) : fail(`homepage omits retired: ${retired}`, "still present");
  }
} catch (e) {
  fail("catalog/content checks", e instanceof Error ? e.message : String(e));
}

console.log("\nAuth & premium flows");
let auth = null;
try {
  auth = await login();
  if (auth) {
    ok("credentials login", auth.session.user.email);
  } else {
    fail("credentials login", `could not sign in as ${email}`);
  }
} catch (e) {
  fail("credentials login", e instanceof Error ? e.message : String(e));
}

if (auth?.cookie) {
  const authHeaders = { Cookie: auth.cookie };

  const me = await fetchJson("/api/me", { headers: authHeaders });
  me.status === 200 && me.json?.user?.email
    ? ok("/api/me", me.json.user.email)
    : fail("/api/me", `status ${me.status}`);

  const sub = await fetchJson("/api/subscription/status", { headers: authHeaders });
  sub.status === 200 ? ok("/api/subscription/status", sub.json?.status ?? "ok") : fail("/api/subscription/status", `status ${sub.status}`);

  const profile = await fetchJson("/api/learning/profile", { headers: authHeaders });
  profile.status === 200 ? ok("/api/learning/profile") : fail("/api/learning/profile", `status ${profile.status}`);

  const dash = await fetchJson("/api/learning/dashboard", { headers: authHeaders });
  dash.status === 200 ? ok("/api/learning/dashboard") : fail("/api/learning/dashboard", `status ${dash.status}`);

  console.log("\nQuestion bank (authenticated)");
  for (const { field, subjectId } of EXAM_QUESTION_SAMPLES) {
    const q = await fetchJson(
      `/api/questions?field=${encodeURIComponent(field)}&subjectId=${encodeURIComponent(subjectId)}&limit=5`,
      { headers: authHeaders }
    );
    if (q.status === 200) {
      const questions = q.json?.questions ?? q.json?.items ?? [];
      const count = Array.isArray(questions) ? questions.length : 0;
      count > 0 ? ok(`${field}/${subjectId}`, `${count} questions`) : fail(`${field}/${subjectId}`, "empty bank");
    } else {
      fail(`${field}/${subjectId}`, `status ${q.status}`);
    }
  }

  console.log("\nStudy attempt (mock)");
  const mockQuestion = {
    id: "flow-test-1",
    sourceIndex: 1,
    type: "multiple_choice",
    stem: "A patient with heart failure reports sudden weight gain. What is the priority assessment?",
    options: ["Dry cough", "Bilateral crackles and edema", "Normal BP", "Clear lungs"],
    correctAnswers: ["Bilateral crackles and edema"],
    explanation: "Fluid overload manifests as crackles and edema.",
    field: "nursing",
    subjectId: "pharmacology-nursing",
    tags: ["cardiac"],
    difficulty: "medium",
    highYield: true,
  };
  const attempt = await fetch(`${base}/api/study/attempt`, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      question: mockQuestion,
      correct: true,
      confidence: 4,
      durationMs: 12000,
      selectedAnswer: "Bilateral crackles and edema",
      sessionId: `flow-test-${Date.now()}`,
    }),
  });
  if (attempt.status === 200) {
    const body = await attempt.json();
    body.ok === true ? ok("/api/study/attempt") : fail("/api/study/attempt", "ok !== true");
  } else {
    fail("/api/study/attempt", `status ${attempt.status}`);
  }

  console.log("\nDrugs300 APIs");
  for (const path of ["/api/drugs300/due", "/api/drugs300/progress"]) {
    const r = await fetchJson(path, { headers: authHeaders });
    r.status === 200 ? ok(path) : fail(path, `status ${r.status}`);
  }
} else {
  console.log("  (skipped authenticated flows — login failed)");
}

console.log(`\n${"─".repeat(48)}`);
console.log(`Passed: ${passed}  Failed: ${failed}`);
if (failures.length) {
  console.log("\nFailures:");
  for (const f of failures) console.log(`  • ${f}`);
  process.exit(1);
}
console.log(`\nAll feature flow checks passed for ${base}`);
process.exit(0);
