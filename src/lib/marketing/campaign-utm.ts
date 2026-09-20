/** Paid-traffic query keys we must keep through signup. */
export const CAMPAIGN_UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type CampaignUtmKey = (typeof CAMPAIGN_UTM_KEYS)[number];

const SESSION_KEY = "aee_campaign_utms";

function asSearchParams(
  search: string | URLSearchParams | null | undefined
): URLSearchParams {
  if (!search) return new URLSearchParams();
  if (typeof search !== "string") return new URLSearchParams(search.toString());
  return new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
}

/** Pull campaign UTMs from a query string. Empty values are dropped. */
export function pickCampaignUtms(
  search: string | URLSearchParams | null | undefined
): Record<string, string> {
  const params = asSearchParams(search);
  const out: Record<string, string> = {};
  for (const key of CAMPAIGN_UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) out[key] = value;
  }
  return out;
}

export function hrefLooksLikeSignup(href: string): boolean {
  const path = href.split(/[?#]/)[0] ?? href;
  return path === "/signup" || path.endsWith("/signup");
}

/**
 * Copy campaign UTMs onto a destination URL.
 * Existing dest params win so explicit signup UTMs are not overwritten.
 */
export function appendCampaignUtms(
  href: string,
  search: string | URLSearchParams | null | undefined,
  remembered: Record<string, string> = {}
): string {
  const incoming = pickCampaignUtms(search);
  const merged = { ...remembered, ...incoming };
  if (Object.keys(merged).length === 0) return href;

  const hashIndex = href.indexOf("#");
  const beforeHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const qIndex = beforeHash.indexOf("?");
  const path = qIndex >= 0 ? beforeHash.slice(0, qIndex) : beforeHash;
  const existing = new URLSearchParams(qIndex >= 0 ? beforeHash.slice(qIndex + 1) : "");

  for (const [key, value] of Object.entries(merged)) {
    if (!existing.get(key)) existing.set(key, value);
  }

  const qs = existing.toString();
  return `${path}${qs ? `?${qs}` : ""}${hash}`;
}

export function readRememberedCampaignUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/** Persist inbound UTMs for the tab so later signup clicks stay attributable. */
export function rememberCampaignUtms(
  search: string | URLSearchParams | null | undefined
): Record<string, string> {
  const incoming = pickCampaignUtms(search);
  const stored = readRememberedCampaignUtms();
  const next = { ...stored, ...incoming };
  if (typeof window !== "undefined" && Object.keys(incoming).length > 0) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    } catch {
      /* private mode / quota — attribution still works from the current URL */
    }
  }
  return next;
}

/** Client helper: current page + session UTMs onto a signup href. */
export function withPageCampaignUtms(href: string): string {
  if (typeof window === "undefined" || !hrefLooksLikeSignup(href)) return href;
  const remembered = rememberCampaignUtms(window.location.search);
  return appendCampaignUtms(href, window.location.search, remembered);
}
