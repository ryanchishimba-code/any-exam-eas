/**
 * Google Ads click ids (gclid, gbraid, wbraid), kept separate from the first-touch cookie.
 * First touch is "first snapshot wins". Ads attribution is "last click wins", so a later
 * ad click replaces the stored id. The cookie lives 90 days, the Ads import window.
 *
 * This module only parses and encodes cookie values. It does not read or write the database.
 */
export const ADS_CLICK_COOKIE = "aee_gads";
export const ADS_CLICK_MAX_AGE_SEC = 90 * 24 * 60 * 60;

export type AdsClickIds = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  /** Epoch ms when the click was seen on this site. */
  seenAt?: number;
};

const CLICK_ID = /^[A-Za-z0-9_-]{10,200}$/;

export function cleanClickId(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return CLICK_ID.test(trimmed) ? trimmed : undefined;
}

export function hasAdsClick(ids: AdsClickIds | undefined): boolean {
  return Boolean(ids && (ids.gclid || ids.gbraid || ids.wbraid));
}

export function adsClickFromSearch(search: string, now: number = Date.now()): AdsClickIds {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const gclid = cleanClickId(params.get("gclid"));
  const gbraid = cleanClickId(params.get("gbraid"));
  const wbraid = cleanClickId(params.get("wbraid"));
  if (!gclid && !gbraid && !wbraid) return {};
  // Google sends one id per click. Keep the first present, in this order.
  if (gclid) return { gclid, seenAt: now };
  if (gbraid) return { gbraid, seenAt: now };
  return { wbraid, seenAt: now };
}

export function encodeAdsClick(ids: AdsClickIds): string {
  return [ids.gclid, ids.gbraid, ids.wbraid, ids.seenAt ? String(ids.seenAt) : ""]
    .map((part) => encodeURIComponent(part ?? ""))
    .join("|");
}

export function decodeAdsClick(raw: string | null | undefined): AdsClickIds {
  if (!raw) return {};
  const parts = raw.split("|");
  const read = (i: number) => {
    try {
      return parts[i] ? decodeURIComponent(parts[i]) : undefined;
    } catch {
      return undefined;
    }
  };
  const seen = Number(read(3));
  const ids: AdsClickIds = {
    gclid: cleanClickId(read(0)),
    gbraid: cleanClickId(read(1)),
    wbraid: cleanClickId(read(2)),
    seenAt: Number.isFinite(seen) && seen > 0 ? seen : undefined,
  };
  return hasAdsClick(ids) ? ids : {};
}

export function readAdsClickFromCookieHeader(header: string | null | undefined): AdsClickIds {
  if (!header) return {};
  const prefix = `${ADS_CLICK_COOKIE}=`;
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) return decodeAdsClick(trimmed.slice(prefix.length));
  }
  return {};
}
