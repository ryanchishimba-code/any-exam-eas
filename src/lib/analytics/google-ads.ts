/**
 * Google Ads and GA4 conversion hits.
 *
 * Account 917-707-9098 is the only Ads account the connected API login can open.
 * Its conversion tracking id is 18297494724 (tag AW-18297494724), managed by that
 * account itself. Tag snippets from conversion actions 7920761917 and 7920761920:
 *   Free trial sign-up  AW-18297494724/noSrCL349MAdEMS59pRE
 *   Paid subscription    AW-18297494724/fqrSCMD49MAdEMS59pRE
 * Both are primary, one conversion per click, and set to always use the default
 * value ($8 and $27.99). The site must still send the real purchase value.
 *
 * Account 125-765-3442 has no AW- tag. Both of its conversion actions are GA4
 * imports from property anyexameasy.com (562268160):
 *   Sign Up imports the GA4 event ads_conversion_Sign_Up_1
 *   anyexameasy.com (web) purchase imports the GA4 event purchase
 * Those events are sent with send_to NEXT_PUBLIC_GA_MEASUREMENT_ID, the G- id
 * of the web stream on that property. There is no second Ads tag id.
 */

export const GOOGLE_ADS_CUSTOMER_ID = "9177079098";
export const GOOGLE_ADS_TAG_ID = "AW-18297494724";
export const GOOGLE_ADS_SIGNUP_LABEL = "noSrCL349MAdEMS59pRE";
export const GOOGLE_ADS_PURCHASE_LABEL = "fqrSCMD49MAdEMS59pRE";
export const GOOGLE_ADS_SIGNUP_SEND_TO = `${GOOGLE_ADS_TAG_ID}/${GOOGLE_ADS_SIGNUP_LABEL}`;
export const GOOGLE_ADS_PURCHASE_SEND_TO = `${GOOGLE_ADS_TAG_ID}/${GOOGLE_ADS_PURCHASE_LABEL}`;

/**
 * GA4 event imported as Sign Up on account 125-765-3442.
 * Sent to the measurement id, once per new account, with sign_up.
 */
export const GA4_IMPORTED_SIGNUP_EVENT = "ads_conversion_Sign_Up_1";

export const ADS_SIGNUP_COOKIE = "aee_ads_signup";
export const ADS_PURCHASE_COOKIE = "aee_ads_purchase";

/** Stripe replaces this placeholder. It must stay unencoded. */
export const STRIPE_CHECKOUT_SUCCESS_PATH =
  "/checkout/return?session_id={CHECKOUT_SESSION_ID}";

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;
const METHOD_PATTERN = /^[a-z]{2,20}$/;
const USER_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
const TRANSACTION_ID_PATTERN = /^[A-Za-z0-9_]{3,255}$/;

/**
 * EEA, UK, and Switzerland. No banner updates this choice, so these regions
 * stay denied. Everywhere else defaults to granted so US conversions record.
 */
export const CONSENT_DENIED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
] as const;

export type GtagParams = Record<string, unknown>;

export type GtagEvent = {
  name: string;
  params: GtagParams;
};

export type ConfirmedPurchase = {
  transactionId: string;
  value: number;
  currency: string;
  itemId: string;
  itemName: string;
};

export type SignupBeacon = {
  method: string;
  userId: string;
  trial: boolean;
};

export type FiredStore = {
  has(key: string): boolean;
  add(key: string): void;
};

export function gaMeasurementId(): string | null {
  return matchId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, GA_ID_PATTERN);
}

export function googleTagScriptSrc(): string {
  return `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_TAG_ID}`;
}

export function adsCookieOptions(): {
  path: string;
  maxAge: number;
  sameSite: "lax";
  httpOnly: false;
  secure: boolean;
} {
  return {
    path: "/",
    maxAge: 30 * 60,
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  };
}

function matchId(raw: string | undefined, pattern: RegExp): string | null {
  const value = raw?.trim() ?? "";
  return pattern.test(value) ? value : null;
}

export function encodeSignupCookie(input: SignupBeacon): string | null {
  const method = input.method.trim().toLowerCase();
  if (!METHOD_PATTERN.test(method) || !USER_ID_PATTERN.test(input.userId)) return null;
  return [method, input.userId, input.trial ? "1" : "0"].join(".");
}

export function parseSignupCookie(raw: string): SignupBeacon | null {
  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [method, userId, trial] = parts;
  if (!method || !userId || (trial !== "0" && trial !== "1")) return null;
  if (!METHOD_PATTERN.test(method) || !USER_ID_PATTERN.test(userId)) return null;
  return { method, userId, trial: trial === "1" };
}

function encodeBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string): string | null {
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export function encodePurchaseCookie(purchase: ConfirmedPurchase): string | null {
  if (!TRANSACTION_ID_PATTERN.test(purchase.transactionId)) return null;
  if (!Number.isFinite(purchase.value) || purchase.value <= 0) return null;
  return encodeBase64Url(JSON.stringify(purchase));
}

export function parsePurchaseCookie(raw: string): ConfirmedPurchase | null {
  const json = decodeBase64Url(raw);
  if (!json) return null;
  let parsed: Partial<ConfirmedPurchase>;
  try {
    parsed = JSON.parse(json) as Partial<ConfirmedPurchase>;
  } catch {
    return null;
  }
  if (!parsed.transactionId || parsed.value == null) return null;
  return buildConfirmedPurchase({
    transactionId: parsed.transactionId,
    amountCents: Math.round(Number(parsed.value) * 100 + Number.EPSILON),
    currency: parsed.currency,
    itemId: parsed.itemId,
    itemName: parsed.itemName,
  });
}

export function buildConfirmedPurchase(input: {
  transactionId: string;
  amountCents: number;
  currency?: string | null;
  tier?: string | null;
  interval?: string | null;
  itemId?: string | null;
  itemName?: string | null;
}): ConfirmedPurchase | null {
  const transactionId = input.transactionId.trim();
  if (!TRANSACTION_ID_PATTERN.test(transactionId)) return null;
  if (!Number.isFinite(input.amountCents) || input.amountCents <= 0) return null;
  const currency = (input.currency || "usd").trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) return null;
  const tier = slugPart(input.tier, "pro");
  const interval = slugPart(input.interval, "monthly");
  const itemId = input.itemId?.trim() || `${tier}_${interval}`;
  const itemName = input.itemName?.trim() || `${tier === "pro" ? "Pro" : tier} ${interval}`;
  if (!itemId || !itemName) return null;
  return {
    transactionId,
    value: Math.round(input.amountCents) / 100,
    currency,
    itemId,
    itemName,
  };
}

function slugPart(value: string | null | undefined, fallback: string): string {
  const slug = (value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
  return slug || fallback;
}

export type CheckoutSessionForPurchase = {
  id: string;
  status: string | null;
  payment_status: string | null;
  amount_total: number | null;
  currency: string | null;
  metadata: {
    userId?: string | null;
    tier?: string | null;
    interval?: string | null;
  } | null;
  subscription: string | { id?: string | null } | null;
};

/**
 * A purchase hit only after Stripe says this user paid. Transaction id is the
 * subscription id when Checkout created one, otherwise the Checkout Session id.
 */
export function purchaseFromCheckoutSession(
  session: CheckoutSessionForPurchase,
  userId: string
): ConfirmedPurchase | null {
  const owner = session.metadata?.userId ?? "";
  if (!owner || owner !== userId) return null;
  if (session.status !== "complete" || session.payment_status !== "paid") return null;
  const subscription = session.subscription;
  const subscriptionId =
    typeof subscription === "string" ? subscription : subscription?.id || "";
  return buildConfirmedPurchase({
    transactionId: subscriptionId || session.id,
    amountCents: session.amount_total ?? 0,
    currency: session.currency,
    tier: session.metadata?.tier,
    interval: session.metadata?.interval,
  });
}

/** Normalize the way Google documents enhanced conversions, then SHA-256 hex. */
export async function hashEmailForAds(email: string | null | undefined): Promise<string | null> {
  const normalized = email?.trim().toLowerCase() ?? "";
  if (!normalized.includes("@")) return null;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function signUpGtagEvents(input: {
  userId: string;
  method: string;
  trial: boolean;
  gaId: string | null;
}): GtagEvent[] {
  const events: GtagEvent[] = [];
  if (input.gaId) {
    events.push({
      name: "sign_up",
      params: { method: input.method, send_to: input.gaId },
    });
    events.push({
      name: GA4_IMPORTED_SIGNUP_EVENT,
      params: { method: input.method, send_to: input.gaId },
    });
  }
  if (input.trial) {
    events.push({
      name: "conversion",
      params: {
        send_to: GOOGLE_ADS_SIGNUP_SEND_TO,
        transaction_id: input.userId,
      },
    });
  }
  return events;
}

export function purchaseGtagEvents(
  purchase: ConfirmedPurchase,
  gaId: string | null
): GtagEvent[] {
  const item = {
    item_id: purchase.itemId,
    item_name: purchase.itemName,
    price: purchase.value,
    quantity: 1,
  };
  const events: GtagEvent[] = [
    {
      name: "conversion",
      params: {
        send_to: GOOGLE_ADS_PURCHASE_SEND_TO,
        value: purchase.value,
        currency: purchase.currency,
        transaction_id: purchase.transactionId,
      },
    },
  ];
  if (gaId) {
    events.push({
      name: "purchase",
      params: {
        send_to: gaId,
        transaction_id: purchase.transactionId,
        value: purchase.value,
        currency: purchase.currency,
        items: [item],
      },
    });
  }
  return events;
}

const SIGNUP_FIRED_PREFIX = "aee_ads_fired_signup:";
const PURCHASE_FIRED_PREFIX = "aee_ads_fired_purchase:";

export async function trackSignUpOnce(options: {
  signup: SignupBeacon;
  email?: string | null;
  store: FiredStore;
  gaId?: string | null;
  send: (events: GtagEvent[], emailHash: string | null) => void | Promise<void>;
}): Promise<boolean> {
  const key = `${SIGNUP_FIRED_PREFIX}${options.signup.userId}`;
  if (options.store.has(key)) return false;
  const events = signUpGtagEvents({
    userId: options.signup.userId,
    method: options.signup.method,
    trial: options.signup.trial,
    gaId: options.gaId === undefined ? gaMeasurementId() : options.gaId,
  });
  if (events.length === 0) return false;
  options.store.add(key);
  const emailHash = await hashEmailForAds(options.email);
  await options.send(events, emailHash);
  return true;
}

export async function trackPurchaseOnce(options: {
  purchase: ConfirmedPurchase;
  email?: string | null;
  store: FiredStore;
  gaId?: string | null;
  send: (events: GtagEvent[], emailHash: string | null) => void | Promise<void>;
}): Promise<boolean> {
  const key = `${PURCHASE_FIRED_PREFIX}${options.purchase.transactionId}`;
  if (options.store.has(key)) return false;
  const events = purchaseGtagEvents(
    options.purchase,
    options.gaId === undefined ? gaMeasurementId() : options.gaId
  );
  if (events.length === 0) return false;
  options.store.add(key);
  const emailHash = await hashEmailForAds(options.email);
  await options.send(events, emailHash);
  return true;
}

export function memoryFiredStore(): FiredStore {
  const keys = new Set<string>();
  return {
    has: (key) => keys.has(key),
    add: (key) => {
      keys.add(key);
    },
  };
}

/** Inline stub. Consent defaults run before any Google tag config. */
export function googleTagBootstrapScript(): string {
  const configs = [
    `window.gtag('config', '${GOOGLE_ADS_TAG_ID}', { allow_enhanced_conversions: true });`,
  ];
  const gaId = gaMeasurementId();
  if (gaId) configs.push(`window.gtag('config', '${gaId}');`);
  const regions = CONSENT_DENIED_REGIONS.map((code) => `'${code}'`).join(",");
  return `
window.dataLayer = window.dataLayer || [];
window.gtag = function gtag(){window.dataLayer.push(arguments);};
window.gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  region: [${regions}]
});
window.gtag('consent', 'default', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted'
});
window.gtag('js', new Date());
${configs.join("\n")}
`.trim();
}
