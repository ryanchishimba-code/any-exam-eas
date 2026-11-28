import { gatedStudyGuidePaths } from "@/lib/seo/gated-study-guide-paths";
import { quickBiteRouteBases } from "@/lib/quick-bites/boards";
import { exactRedirectSources } from "@/lib/seo/canonical-redirects";

/** Production canonical origin. Sitemaps and robots always advertise this host. */
export const CANONICAL_ORIGIN = "https://www.anyexameasy.com";

/**
 * IndexNow key hosted at `/{key}.txt`. The file body is the key.
 * Ping only after this file is live on www.
 */
export const INDEXNOW_KEY = "c4e8a1b79d2f4063a5e8b1c74d9f02a6";

export const INDEXNOW_KEY_PATH = `/${INDEXNOW_KEY}.txt`;

/** Longer allow rules beat a shorter disallow. `/` allows the rest of the public site. */
export const ROBOTS_ALLOW = ["/", "/nclex", "/naplex", "/study/drugs300", "/anatomy"] as const;

/**
 * Private and non-canonical prefixes. `/study` is here so the app stays out,
 * while `/study/drugs300` stays allowed by the longer Allow rule.
 * `/exam` is not listed: it would also match `/exams`, which is a redirect, not a section we need to name.
 */
const PRIVATE_PREFIXES = [
  "/api",
  "/admin",
  "/internal",
  "/employee",
  "/auth",
  "/checkout",
  "/dashboard",
  "/settings",
  "/select-exam",
  "/onboarding",
  "/login",
  "/signup",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/learn",
  "/generate",
  "/progress",
  "/engine",
  "/practice",
  "/prep",
  "/question-bank",
  "/library",
  "/analytics",
  "/readiness",
  "/full-exam",
  "/upgrade",
  "/dev",
  "/mpje",
  "/study",
  "/study-tools",
  "/daily/confirm",
  "/daily/unsubscribe",
  "/email/unsubscribe",
  "/service-unavailable",
] as const;

export function robotsDisallowPaths(): string[] {
  return [...PRIVATE_PREFIXES, ...gatedStudyGuidePaths(), ...quickBiteRouteBases()];
}

export function robotsAllowsPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  let winner: { length: number; allow: boolean } | null = null;
  const rules: Array<{ path: string; allow: boolean }> = [
    ...ROBOTS_ALLOW.map((rule) => ({ path: rule, allow: true })),
    ...robotsDisallowPaths().map((rule) => ({ path: rule, allow: false })),
  ];
  for (const rule of rules) {
    if (!prefixMatches(rule.path, path)) continue;
    const length = rule.path.length;
    if (!winner || length > winner.length || (length === winner.length && rule.allow)) {
      winner = { length, allow: rule.allow };
    }
  }
  return winner?.allow ?? true;
}

/**
 * X-Robots-Tag sources. These must not cover public indexable URLs.
 * `/study/:path*` is intentionally absent so `/study/drugs300` can stay indexable.
 */
export function noindexHeaderSources(): string[] {
  const roots = [
    "/admin",
    "/internal",
    "/employee",
    "/auth",
    "/checkout",
    "/dashboard",
    "/settings",
    "/select-exam",
    "/onboarding",
    "/dev",
    "/engine",
    "/learn",
    "/generate",
    "/progress",
    "/practice",
    "/prep",
    "/question-bank",
    "/library",
    "/analytics",
    "/readiness",
    "/full-exam",
    "/upgrade",
    "/study-tools",
    "/mpje",
    "/login",
    "/signup",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/daily/confirm",
    "/daily/unsubscribe",
    "/email/unsubscribe",
    "/service-unavailable",
    "/study",
    "/study/practice",
    "/study/analytics",
    ...gatedStudyGuidePaths(),
    ...quickBiteRouteBases(),
  ];
  const sources = new Set<string>();
  for (const root of roots) {
    sources.add(root);
    if (root !== "/study") sources.add(`${root}/:path*`);
  }
  sources.add("/api/:path*");
  sources.add("/exam/:path*");
  return [...sources];
}

export function noindexHeaderMatches(source: string, pathname: string): boolean {
  const path = normalizePath(pathname);
  if (source.endsWith("/:path*")) {
    const base = source.slice(0, -"/:path*".length);
    return path === base || path.startsWith(`${base}/`);
  }
  return path === source;
}

const BLOCKED_PREFIXES = [
  "/api",
  "/admin",
  "/internal",
  "/employee",
  "/auth",
  "/checkout",
  "/dashboard",
  "/settings",
  "/select-exam",
  "/onboarding",
  "/login",
  "/signup",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/learn",
  "/generate",
  "/progress",
  "/engine",
  "/practice",
  "/prep",
  "/question-bank",
  "/library",
  "/analytics",
  "/readiness",
  "/full-exam",
  "/upgrade",
  "/dev",
  "/mpje",
  "/study-tools",
  "/daily/confirm",
  "/daily/unsubscribe",
  "/email/unsubscribe",
  "/service-unavailable",
  "/exams",
  "/exam",
] as const;

/** True when a path is a redirect, a private route, or a noindex reader. */
export function isNonIndexablePath(pathname: string): boolean {
  const path = normalizePath(pathname);
  if (exactRedirectSources().includes(path)) return true;
  if (path.startsWith("/exams/") || path === "/exams") return true;
  if (BLOCKED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return true;
  }
  if (path === "/study" || (path.startsWith("/study/") && path !== "/study/drugs300" && !path.startsWith("/study/drugs300/"))) {
    return true;
  }
  if (gatedStudyGuidePaths().some((base) => path === base || path.startsWith(`${base}/`))) {
    return true;
  }
  if (quickBiteRouteBases().some((base) => path === base || path.startsWith(`${base}/`))) {
    return true;
  }
  return false;
}

export function normalizePath(pathname: string): string {
  const noQuery = pathname.split("?")[0]?.split("#")[0] ?? "/";
  if (noQuery.length > 1 && noQuery.endsWith("/")) return noQuery.slice(0, -1);
  return noQuery || "/";
}

function prefixMatches(rulePath: string, urlPath: string): boolean {
  if (rulePath === "/") return true;
  return urlPath === rulePath || urlPath.startsWith(`${rulePath}/`) || urlPath.startsWith(rulePath);
}
