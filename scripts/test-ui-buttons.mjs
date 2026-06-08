#!/usr/bin/env node
/**
 * Validates key pages render interactive controls and measures response times.
 * Usage: node scripts/test-ui-buttons.mjs [baseUrl]
 */
const base = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const email = process.env.LOAD_TEST_EMAIL ?? "dev@anyexameasy.test";
const password = process.env.LOAD_TEST_PASSWORD ?? "DevPassword1!";

const AUTH_REDIRECTS = new Set(["/login", "/forgot-password", "/reset-password"]);

const PAGES = [
  {
    path: "/",
    expect: 200,
    buttons: ["Open menu"],
    links: ["/dashboard", "/pricing", "/signup", "/login"],
    text: ["One subscription", "Four licensing", "NCLEX"],
  },
  {
    path: "/signup",
    expect: 200,
    buttons: [],
    links: ["/login", "/legal/terms"],
    text: ["Choose your plan", "study support tool"],
  },
  {
    path: "/pricing",
    expect: 200,
    links: ["/signup"],
    text: ["trial", "29.99"],
  },
  {
    path: "/feedback",
    expect: 200,
    buttons: [],
    links: [],
    text: ["Send us your feedback"],
  },
  {
    path: "/auth/login",
    expect: 200,
    buttons: [],
    links: [],
    text: ["Log in to continue", "NCLEX"],
  },
];

const PERF_BUDGET_MS = {
  "/": 2500,
  "/signup": 2000,
  "/pricing": 2000,
  "/api/health": 800,
  "/api/catalog/subjects": 8000,
};

let passed = 0;
let failed = 0;
const failures = [];
const perf = [];

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

function hasInteractive(html, label) {
  const lower = label.toLowerCase();
  if (html.toLowerCase().includes(`aria-label="${lower}"`)) return true;
  if (html.toLowerCase().includes(`>${label.toLowerCase()}<`)) return true;
  if (html.toLowerCase().includes(`aria-label="${label}"`.toLowerCase())) return true;
  const re = new RegExp(`>\\s*${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*<`, "i");
  return re.test(html);
}

function hasLink(html, href) {
  return html.includes(`href="${href}"`) || html.includes(`href='${href}'`);
}

async function timedFetch(path, opts = {}) {
  const start = performance.now();
  const res = await fetch(`${base}${path}`, { redirect: "manual", ...opts });
  const ms = Math.round(performance.now() - start);
  const html = res.headers.get("content-type")?.includes("text/html")
    ? await res.text()
    : "";
  return { status: res.status, ms, html };
}

async function login() {
  const csrfRes = await fetch(`${base}/api/auth/csrf`);
  if (csrfRes.status !== 200) return null;
  const { csrfToken } = await csrfRes.json();
  const setCookie = csrfRes.headers.getSetCookie?.() ?? csrfRes.headers.get("set-cookie");
  const csrfCookies = Array.isArray(setCookie)
    ? setCookie.map((c) => c.split(";")[0]).join("; ")
    : setCookie?.split(", ").map((c) => c.split(";")[0]).join("; ") ?? "";

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

  const loginSet = loginRes.headers.getSetCookie?.() ?? loginRes.headers.get("set-cookie");
  const loginCookies = Array.isArray(loginSet)
    ? loginSet.map((c) => c.split(";")[0]).join("; ")
    : loginSet?.split(", ").map((c) => c.split(";")[0]).join("; ") ?? "";
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

console.log(`\nUI button & load-time checks\nBase URL: ${base}\n`);

console.log("Page controls & links");
for (const page of PAGES) {
  try {
    const { status, ms, html } = await timedFetch(page.path);
    perf.push({ path: page.path, ms, status });

    const expect = Array.isArray(page.expect) ? page.expect : [page.expect];
    if (!expect.includes(status)) {
      fail(page.path, `HTTP ${status} (expected ${expect.join("|")})`);
      continue;
    }
    ok(page.path, `${status} in ${ms}ms`);

    const budget = PERF_BUDGET_MS[page.path];
    if (budget && ms > budget) {
      fail(`${page.path} load time`, `${ms}ms > ${budget}ms budget`);
    } else if (budget) {
      ok(`${page.path} load time`, `${ms}ms`);
    }

    for (const link of page.links ?? []) {
      hasLink(html, link) ? ok(`${page.path} link ${link}`) : fail(`${page.path} link ${link}`, "missing");
    }
    for (const btn of page.buttons ?? []) {
      hasInteractive(html, btn) ? ok(`${page.path} control "${btn}"`) : fail(`${page.path} control "${btn}"`, "missing");
    }
    for (const text of page.text ?? []) {
      html.toLowerCase().includes(text.toLowerCase())
        ? ok(`${page.path} text "${text}"`)
        : fail(`${page.path} text "${text}"`, "missing");
    }
  } catch (e) {
    fail(page.path, e instanceof Error ? e.message : String(e));
  }
}

console.log("\nAuth redirects");
for (const path of AUTH_REDIRECTS) {
  try {
    const { status, ms } = await timedFetch(path);
    if (status === 307 || status === 308) {
      ok(`${path} redirect`, `${status} in ${ms}ms`);
    } else if (status === 200) {
      ok(`${path}`, `200 in ${ms}ms`);
    } else {
      fail(`${path} redirect`, `got ${status}`);
    }
  } catch (e) {
    fail(`${path} redirect`, e instanceof Error ? e.message : String(e));
  }
}

console.log("\nAPI latency");
for (const path of ["/api/health", "/api/catalog/subjects"]) {
  try {
    const start = performance.now();
    const res = await fetch(`${base}${path}`);
    const ms = Math.round(performance.now() - start);
    perf.push({ path, ms, status: res.status });
    const budget = PERF_BUDGET_MS[path] ?? 5000;
    if (res.status >= 200 && res.status < 500) {
      ms <= budget ? ok(path, `${ms}ms`) : fail(path, `${ms}ms > ${budget}ms budget`);
    } else {
      fail(path, `status ${res.status}`);
    }
  } catch (e) {
    fail(path, e instanceof Error ? e.message : String(e));
  }
}

console.log("\nAuthenticated dashboard");
try {
  const auth = await login();
  if (!auth) {
    fail("login for dashboard", `could not sign in as ${email}`);
  } else {
    ok("login", auth.session.user.email);
    const { status, ms, html } = await timedFetch("/dashboard", {
      headers: { Cookie: auth.cookie },
    });
    perf.push({ path: "/dashboard", ms, status });
    if (status === 200) {
      ok("/dashboard", `${status} in ${ms}ms`);
      html.toLowerCase().includes("dashboard")
        ? ok("dashboard shell")
        : fail("dashboard shell", "missing");
      const dashApi = await fetch(`${base}/api/learning/dashboard`, {
        headers: { Cookie: auth.cookie },
      });
      dashApi.status === 200
        ? ok("/api/learning/dashboard")
        : fail("/api/learning/dashboard", `status ${dashApi.status}`);
      const budget = PERF_BUDGET_MS["/dashboard"] ?? 3500;
      ms <= budget ? ok("/dashboard load time", `${ms}ms`) : fail("/dashboard load time", `${ms}ms > ${budget}ms`);
    } else {
      fail("/dashboard", `status ${status}`);
    }
  }
} catch (e) {
  fail("authenticated dashboard", e instanceof Error ? e.message : String(e));
}

console.log(`\n${"─".repeat(48)}`);
console.log("Response times:");
for (const p of perf.sort((a, b) => b.ms - a.ms).slice(0, 8)) {
  console.log(`  ${String(p.ms).padStart(5)}ms  ${p.status}  ${p.path}`);
}
console.log(`\nPassed: ${passed}  Failed: ${failed}`);
if (failures.length) {
  console.log("\nFailures:");
  for (const f of failures) console.log(`  • ${f}`);
  process.exit(1);
}
console.log(`\nAll UI checks passed for ${base}`);
process.exit(0);
