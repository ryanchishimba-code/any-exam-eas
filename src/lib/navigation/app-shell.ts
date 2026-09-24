import { studyGuideForPathname, studyGuideRouteBases } from "@/lib/nclex-study-guide/guide-registry";
import type { ExamSlug } from "@/types/edtech";

/** Derived from the guide registry so reader chrome cannot drift per exam. */
const STUDY_GUIDE_ROUTE_BASES = studyGuideRouteBases();

/** Routes that use the focused app shell (top nav + sidebar / mobile bottom bar). */
export const APP_SHELL_PREFIXES = [
  "/dashboard",
  "/question-bank",
  "/analytics",
  "/full-exam",
  "/library",
  "/anatomy",
  "/settings",
  "/study/drugs300",
  "/nclex/study-guide",
  "/naplex/study-guide",
  "/aanp-fnp/study-guide",
] as const;

export const MINIMAL_CHROME_PREFIXES = [
  "/select-exam",
  "/login",
  "/auth/login",
  "/signup",
  "/checkout",
] as const;

export function isAppShellRoute(pathname: string): boolean {
  return APP_SHELL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isMinimalChromeRoute(pathname: string): boolean {
  return MINIMAL_CHROME_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function hideMarketingChrome(pathname: string): boolean {
  return isAppShellRoute(pathname) || isMinimalChromeRoute(pathname);
}

/** Active full-exam simulator or results — hide mobile tab bar so footer controls stay reachable. */
export function isFullExamSessionRoute(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "full-exam") return false;
  if (parts.length === 3) return true;
  return parts.length === 4 && parts[3] === "results";
}

/**
 * Study Guide chapter reader — owns its own TOC and fills the viewport.
 * Matches every exam's book, so a new guide gets immersive chrome for free.
 */
export function isStudyGuideReaderRoute(pathname: string): boolean {
  return STUDY_GUIDE_ROUTE_BASES.some((base) => pathname.startsWith(`${base}/`));
}

/**
 * Routes that keep the top nav but surrender the sidebar, page padding, and
 * mobile tab bar because the page is a full-viewport experience of its own.
 */
export function isImmersiveAppRoute(pathname: string): boolean {
  return isFullExamSessionRoute(pathname) || isStudyGuideReaderRoute(pathname);
}

/**
 * Board shown by the header exam chip.
 *
 * Study-guide URLs name the book in the path (`/naplex/study-guide`,
 * `/aanp-fnp/study-guide/...`). The saved preference can still be another
 * exam — often NCLEX — which left the chip disagreeing with the page.
 * On those routes the path wins. Everywhere else the saved preference stays
 * the source of truth, so Dashboard / Bank / Full Exam switching is unchanged.
 */
export function headerBoardExamSlug(
  pathname: string,
  preferredExam: ExamSlug | null
): ExamSlug | null {
  return studyGuideForPathname(pathname)?.exam ?? preferredExam;
}

/** Question bank + full-exam launcher — primary exam cannot be changed from chrome or URL. */
export function isExamPracticeLockedRoute(pathname: string): boolean {
  if (pathname === "/question-bank" || pathname.startsWith("/question-bank/")) {
    return true;
  }
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] === "full-exam" && parts.length === 2;
}
