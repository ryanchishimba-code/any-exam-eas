import { examSlugFromFieldId, isExamSlug } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";

/**
 * Short-lived first-party hint for the board a visitor was on when they
 * started signup or sign-in. It is not the saved exam. A saved exam always
 * wins; Settings is the only later change.
 */
export const BOARD_INTENT_COOKIE = "aee_board";
export const BOARD_INTENT_MAX_AGE_SEC = 60 * 60;

export const OAUTH_CALLBACK_COOKIES = [
  "authjs.callback-url",
  "__Secure-authjs.callback-url",
] as const;

/** Where a board value came from. Page visits never write the saved exam. */
export type BoardIntentSource = "capture" | "settings" | "page";

export type BoardWriteDecision =
  | { persist: true; examSlug: ExamSlug }
  | { persist: false; examSlug: ExamSlug | null };

const AUTH_KEEP_PREFIXES = ["/login", "/signup", "/register", "/auth", "/checkout"] as const;

/**
 * Accept a board slug, an exam slug, or a practice field id (`nursing`, `pharmacy`).
 * MPJE was removed from the product; its field id still aliases to PANCE.
 */
export function parseBoardSlug(raw: string | null | undefined): ExamSlug | null {
  if (!raw) return null;
  const value = raw.trim().toLowerCase();
  if (!value) return null;
  if (isExamSlug(value)) return value;
  return examSlugFromFieldId(value);
}

export function boardFromSearchParams(params: {
  get(name: string): string | null;
}): ExamSlug | null {
  return (
    parseBoardSlug(params.get("board")) ??
    parseBoardSlug(params.get("exam")) ??
    parseBoardSlug(params.get("field"))
  );
}

/** Board landing, study guide, quiz (on the landing), or legacy exam/practice URL. */
export function boardFromPathname(pathname: string | null | undefined): ExamSlug | null {
  const path = (pathname || "/").split("?")[0] || "/";
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  if ((parts[0] === "exams" || parts[0] === "practice") && parts[1] && isExamSlug(parts[1])) {
    return parts[1];
  }
  if (isExamSlug(parts[0] ?? "")) return parts[0] as ExamSlug;
  return null;
}

export function boardFromCallbackUrl(raw: string | null | undefined, depth = 0): ExamSlug | null {
  if (!raw || depth > 3) return null;
  let value = raw.trim();
  if (!value) return null;
  for (let i = 0; i < 2; i += 1) {
    try {
      const decoded = decodeURIComponent(value);
      if (decoded === value) break;
      value = decoded;
    } catch {
      break;
    }
  }
  try {
    const url =
      value.startsWith("http://") || value.startsWith("https://")
        ? new URL(value)
        : new URL(value, "https://anyexameasy.local");
    const direct = boardFromSearchParams(url.searchParams);
    if (direct) return direct;
    const nested = url.searchParams.get("callbackUrl");
    if (nested) {
      const inner = boardFromCallbackUrl(nested, depth + 1);
      if (inner) return inner;
    }
    return boardFromPathname(url.pathname);
  } catch {
    return null;
  }
}

function readCookieValue(header: string, name: string): string | null {
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() !== name) continue;
    const value = part.slice(eq + 1).trim();
    if (!value) return null;
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }
  return null;
}

/** Prefer the first-party board cookie, then the OAuth callback URL cookie. */
export function boardFromCookieHeader(header: string | null | undefined): ExamSlug | null {
  if (!header) return null;
  const direct = parseBoardSlug(readCookieValue(header, BOARD_INTENT_COOKIE));
  if (direct) return direct;
  for (const name of OAUTH_CALLBACK_COOKIES) {
    const board = boardFromCallbackUrl(readCookieValue(header, name));
    if (board) return board;
  }
  return null;
}

/**
 * Board carried across a signup or sign-in request.
 * Query and path win over a stale cookie so a home-page visit can clear intent
 * before the cookie is deleted.
 */
export function resolveCarriedBoard(input: {
  cookieHeader?: string | null;
  callbackUrl?: string | null;
  search?: string | null;
  pathname?: string | null;
}): ExamSlug | null {
  const fromSearch = input.search
    ? boardFromSearchParams(new URLSearchParams(input.search))
    : null;
  const fromPath = input.pathname ? boardFromPathname(input.pathname) : null;
  return (
    fromSearch ??
    fromPath ??
    boardFromCallbackUrl(input.callbackUrl) ??
    boardFromCookieHeader(input.cookieHeader)
  );
}

/**
 * Saved exam is never replaced by a page, signup, OAuth callback, email link,
 * or login. Settings is the only source that replaces it.
 */
export function shouldPersistIncomingBoard(
  savedExam: ExamSlug | null,
  incomingBoard: ExamSlug | null,
  source: BoardIntentSource
): BoardWriteDecision {
  if (source === "page") {
    return { persist: false, examSlug: savedExam };
  }
  if (source === "settings") {
    if (!incomingBoard) return { persist: false, examSlug: savedExam };
    return { persist: true, examSlug: incomingBoard };
  }
  if (savedExam) return { persist: false, examSlug: savedExam };
  if (!incomingBoard) return { persist: false, examSlug: null };
  return { persist: true, examSlug: incomingBoard };
}

/** Auth screens keep a board cookie set on the previous page. Other pages clear it. */
export function boardIntentPathAction(pathname: string): "keep" | "clear" {
  const path = (pathname || "/").split("?")[0] || "/";
  if (
    AUTH_KEEP_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
  ) {
    return "keep";
  }
  return "clear";
}

export function writeBoardIntentCookie(slug: ExamSlug): string {
  return `${BOARD_INTENT_COOKIE}=${encodeURIComponent(slug)}; Path=/; Max-Age=${BOARD_INTENT_MAX_AGE_SEC}; SameSite=Lax`;
}

export function clearBoardIntentCookieValue(): string {
  return `${BOARD_INTENT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function hrefWithBoard(href: string, board: ExamSlug): string {
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = withoutHash.indexOf("?");
  const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const params = new URLSearchParams(queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "");
  if (!params.get("board")) params.set("board", board);
  if ((path === "/signup" || path.endsWith("/signup")) && !params.get("exam")) {
    params.set("exam", board);
  }
  const qs = params.toString();
  return `${path}${qs ? `?${qs}` : ""}${hash}`;
}

export function emailVerificationPath(token: string, board?: ExamSlug | null): string {
  const params = new URLSearchParams({ token });
  if (board) params.set("board", board);
  return `/api/auth/verify-email?${params.toString()}`;
}

export function rememberBoardIntent(slug: ExamSlug): void {
  if (typeof document === "undefined") return;
  document.cookie = writeBoardIntentCookie(slug);
}

/** Read the board from this page, then from the short-lived cookie. */
export function stampBoardIntentFromLocation(): ExamSlug | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const board = boardFromSearchParams(params) ?? boardFromPathname(window.location.pathname);
  if (board) {
    rememberBoardIntent(board);
    return board;
  }
  if (typeof document === "undefined") return null;
  return boardFromCookieHeader(document.cookie);
}
