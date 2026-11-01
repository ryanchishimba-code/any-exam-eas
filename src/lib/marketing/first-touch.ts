export const FIRST_TOUCH_COOKIE = "aee_ft";
export const FUNNEL_EVENT_COOKIE = "aee_evt";
export const FIRST_TOUCH_MAX_AGE_SEC = 180 * 24 * 60 * 60;

const MAX_UTM = 120;
const MAX_REFERRER = 300;

export type FirstTouchAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
};

export function cleanAttributionValue(value: unknown, max = MAX_UTM): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  if (!trimmed || /[\r\n\0]/.test(trimmed)) return undefined;
  return trimmed;
}

export function hasFirstTouch(attr: FirstTouchAttribution): boolean {
  return Boolean(attr.utmSource || attr.utmMedium || attr.utmCampaign || attr.referrer);
}

/** First snapshot wins. A later visit does not replace it. */
export function mergeFirstTouch(
  stored: FirstTouchAttribution,
  incoming: FirstTouchAttribution
): FirstTouchAttribution {
  if (hasFirstTouch(stored)) return stored;
  return {
    utmSource: incoming.utmSource,
    utmMedium: incoming.utmMedium,
    utmCampaign: incoming.utmCampaign,
    referrer: incoming.referrer,
  };
}

export function encodeFirstTouch(attr: FirstTouchAttribution): string {
  return [attr.utmSource, attr.utmMedium, attr.utmCampaign, attr.referrer]
    .map((part) => encodeURIComponent(part ?? ""))
    .join("|");
}

export function decodeFirstTouch(raw: string | null | undefined): FirstTouchAttribution {
  if (!raw) return {};
  const parts = raw.split("|");
  const read = (index: number, max: number) => {
    const piece = parts[index];
    if (!piece) return undefined;
    try {
      return cleanAttributionValue(decodeURIComponent(piece), max);
    } catch {
      return undefined;
    }
  };
  return {
    utmSource: read(0, MAX_UTM),
    utmMedium: read(1, MAX_UTM),
    utmCampaign: read(2, MAX_UTM),
    referrer: read(3, MAX_REFERRER),
  };
}

export function readFirstTouchFromCookieHeader(
  header: string | null | undefined
): FirstTouchAttribution {
  if (!header) return {};
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const prefix = `${FIRST_TOUCH_COOKIE}=`;
    if (trimmed.startsWith(prefix)) {
      return decodeFirstTouch(trimmed.slice(prefix.length));
    }
  }
  return {};
}

export function attributionFromSearch(search: string): Pick<
  FirstTouchAttribution,
  "utmSource" | "utmMedium" | "utmCampaign"
> {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return {
    utmSource: cleanAttributionValue(params.get("utm_source")),
    utmMedium: cleanAttributionValue(params.get("utm_medium")),
    utmCampaign: cleanAttributionValue(params.get("utm_campaign")),
  };
}

/** Keep an external referrer as origin + path. Drop query strings and same-site visits. */
export function externalReferrer(referrer: string, pageOrigin: string): string | undefined {
  const cleaned = cleanAttributionValue(referrer, 2000);
  if (!cleaned) return undefined;
  try {
    const url = new URL(cleaned);
    const page = new URL(pageOrigin);
    if (url.origin === page.origin) return undefined;
    return cleanAttributionValue(`${url.origin}${url.pathname}`, MAX_REFERRER);
  } catch {
    return undefined;
  }
}

export function attributionColumns(attr: FirstTouchAttribution | undefined): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  signupReferrer?: string;
} {
  if (!attr) return {};
  return {
    ...(attr.utmSource ? { utmSource: attr.utmSource } : {}),
    ...(attr.utmMedium ? { utmMedium: attr.utmMedium } : {}),
    ...(attr.utmCampaign ? { utmCampaign: attr.utmCampaign } : {}),
    ...(attr.referrer ? { signupReferrer: attr.referrer } : {}),
  };
}
