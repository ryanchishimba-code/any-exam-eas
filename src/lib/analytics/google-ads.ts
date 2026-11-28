/**
 * Google Ads tag AW-18297494724.
 *
 * The tag loads sitewide. Conversion events fire only after this server has
 * confirmed a free trial or a paid subscription. Email for enhanced
 * conversions is passed with gtag('set', 'user_data') so Google hashes it.
 * It is never placed in a page URL or in the gtag.js script address.
 */

export const GOOGLE_ADS_ID = "AW-18297494724";

export const GOOGLE_ADS_TRIAL_SEND_TO = "AW-18297494724/noSrCL349MAdEMS59pRE";

export const GOOGLE_ADS_PURCHASE_SEND_TO = "AW-18297494724/fqrSCMD49MAdEMS59pRE";

/** Paid-subscription conversion value requested for this tag. */
export const GOOGLE_ADS_PURCHASE_VALUE_USD = 27.99;

export const GOOGLE_ADS_TRIAL_EVENT = "google_ads_trial";

export const GOOGLE_ADS_PURCHASE_EVENT = "google_ads_purchase";

/** Query key Stripe replaces. Not an email and not other account data. */
export const GOOGLE_ADS_CHECKOUT_SESSION_PARAM = "stripe_session";

export const GOOGLE_ADS_SUBSCRIPTION_PARAM = "stripe_subscription";

const CHECKOUT_SESSION_ID = /^cs_[A-Za-z0-9_]+$/;
const SUBSCRIPTION_ID = /^sub_[A-Za-z0-9_]+$/;

export function googleAdsScriptSrc(): string {
  return `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
}

export function isStripeCheckoutSessionId(value: string | null | undefined): value is string {
  return typeof value === "string" && value.length <= 255 && CHECKOUT_SESSION_ID.test(value);
}

export function isStripeSubscriptionId(value: string | null | undefined): value is string {
  return typeof value === "string" && value.length <= 255 && SUBSCRIPTION_ID.test(value);
}

/** Hosted and embedded Checkout return here. Stripe fills the session id. */
export function paidCheckoutSuccessUrl(origin: string, dashboardPath: string): string {
  const base = origin.replace(/\/$/, "");
  return `${base}${dashboardPath}?checkout=success&${GOOGLE_ADS_CHECKOUT_SESSION_PARAM}={CHECKOUT_SESSION_ID}`;
}

export function paidUpgradeReturnPath(dashboardPath: string, subscriptionId: string): string {
  if (!isStripeSubscriptionId(subscriptionId)) {
    return `${dashboardPath}?checkout=success`;
  }
  return `${dashboardPath}?checkout=success&${GOOGLE_ADS_SUBSCRIPTION_PARAM}=${subscriptionId}`;
}

/** Trim and lowercase. Google hashes this after gtag set. Empty when it is not an email. */
export function normalizeAdsEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@") || normalized.includes(" ") || normalized.length > 320) return null;
  return normalized;
}

export type CheckoutConversionInput = {
  id: string;
  status: string | null;
  mode: string | null;
  paymentStatus: string | null;
  amountTotal: number | null;
  plan: string | null;
  ownerUserId: string | null;
  subscriptionId: string | null;
};

export type PurchaseConversion = {
  transactionId: string;
  value: number;
  currency: "USD";
  sendTo: string;
};

/**
 * A paid Stripe subscription Checkout that this user completed.
 * Trial checkouts and unpaid sessions do not qualify. The reported value is
 * the fixed Ads value, not a page-URL parameter.
 */
export function purchaseConversionFromCheckout(
  checkout: CheckoutConversionInput,
  userId: string
): PurchaseConversion | null {
  if (!userId || checkout.ownerUserId !== userId) return null;
  if (checkout.status !== "complete") return null;
  if (checkout.plan === "trial") return null;
  if (checkout.mode !== "subscription") return null;
  if (checkout.paymentStatus !== "paid" && checkout.paymentStatus !== "no_payment_required") {
    return null;
  }
  if ((checkout.amountTotal ?? 0) <= 0) return null;
  const transactionId = checkout.subscriptionId || checkout.id;
  if (!isStripeSubscriptionId(transactionId) && !isStripeCheckoutSessionId(transactionId)) {
    return null;
  }
  return {
    transactionId,
    value: GOOGLE_ADS_PURCHASE_VALUE_USD,
    currency: "USD",
    sendTo: GOOGLE_ADS_PURCHASE_SEND_TO,
  };
}

export type SubscriptionConversionInput = {
  id: string;
  status: string | null;
  ownerUserId: string | null;
  amountPaid: number | null;
};

/** In-app trial conversion that Stripe has already moved to an active paid subscription. */
export function purchaseConversionFromSubscription(
  subscription: SubscriptionConversionInput,
  userId: string
): PurchaseConversion | null {
  if (!userId || subscription.ownerUserId !== userId) return null;
  if (subscription.status !== "active") return null;
  if (!isStripeSubscriptionId(subscription.id)) return null;
  if ((subscription.amountPaid ?? 0) <= 0) return null;
  return {
    transactionId: subscription.id,
    value: GOOGLE_ADS_PURCHASE_VALUE_USD,
    currency: "USD",
    sendTo: GOOGLE_ADS_PURCHASE_SEND_TO,
  };
}

/** Event parameters. Email is intentionally absent so it cannot leak into the hit URL. */
export function googleAdsConversionParams(input: {
  sendTo: string;
  value?: number;
  currency?: "USD";
  transactionId?: string;
}): Record<string, string | number> {
  const params: Record<string, string | number> = { send_to: input.sendTo };
  if (typeof input.value === "number") {
    params.value = input.value;
    params.currency = input.currency ?? "USD";
  }
  if (input.transactionId) params.transaction_id = input.transactionId;
  return params;
}

export function trialConversionReady(input: {
  status: string | null | undefined;
  hasAccess: boolean;
  alreadySent: boolean;
}): boolean {
  return input.status === "trialing" && input.hasAccess && !input.alreadySent;
}
