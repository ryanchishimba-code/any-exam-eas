import type Stripe from "stripe";

/**
 * Helpers for a later server-side Google Ads offline conversion upload.
 *
 * This file has no Prisma imports and does not read or write the database.
 * Upload and enqueue are held for a later PR, after the migration is approved.
 * Inert unless a later change starts calling an uploader; the cron route in
 * this release is a no-op.
 */

export type AdsConversionKind = "paid" | "trial";

export const ADS_CLICK_WINDOW_MS = 90 * 24 * 60 * 60 * 1000;

export function adsConversionsEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.GOOGLE_ADS_CONVERSIONS_ENABLED === "1";
}

/** Revenue in minor units, excluding tax. Zero for free or fully discounted invoices. */
export function invoiceRevenueMinor(invoice: Stripe.Invoice): number {
  const paid = invoice.amount_paid ?? 0;
  const tax = (invoice.total_tax_amounts ?? []).reduce((sum, t) => sum + (t.amount ?? 0), 0);
  return Math.max(0, paid - tax);
}

export type AdsUploadConfig = {
  customerId: string;
  loginCustomerId?: string;
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  paidActionId: string;
  trialActionId: string;
  apiVersion: string;
};

export function readAdsUploadConfig(env: NodeJS.ProcessEnv = process.env): AdsUploadConfig | null {
  const need = [
    "GOOGLE_ADS_CUSTOMER_ID",
    "GOOGLE_ADS_DEVELOPER_TOKEN",
    "GOOGLE_ADS_CLIENT_ID",
    "GOOGLE_ADS_CLIENT_SECRET",
    "GOOGLE_ADS_REFRESH_TOKEN",
    "GOOGLE_ADS_PAID_ACTION_ID",
    "GOOGLE_ADS_TRIAL_ACTION_ID",
  ] as const;
  if (need.some((k) => !env[k]?.trim())) return null;
  return {
    customerId: env.GOOGLE_ADS_CUSTOMER_ID!.replace(/-/g, "").trim(),
    loginCustomerId: env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, "").trim() || undefined,
    developerToken: env.GOOGLE_ADS_DEVELOPER_TOKEN!.trim(),
    clientId: env.GOOGLE_ADS_CLIENT_ID!.trim(),
    clientSecret: env.GOOGLE_ADS_CLIENT_SECRET!.trim(),
    refreshToken: env.GOOGLE_ADS_REFRESH_TOKEN!.trim(),
    paidActionId: env.GOOGLE_ADS_PAID_ACTION_ID!.trim(),
    trialActionId: env.GOOGLE_ADS_TRIAL_ACTION_ID!.trim(),
    apiVersion: env.GOOGLE_ADS_API_VERSION?.trim() || "v26",
  };
}

/** Google format: yyyy-mm-dd hh:mm:ss+00:00 */
export function formatAdsDateTime(date: Date): string {
  return date.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "+00:00");
}

export type UploadRow = {
  kind: string;
  orderId: string;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  valueMinor: number | null;
  currency: string;
  occurredAt: Date;
};

export function buildClickConversion(
  row: UploadRow,
  cfg: Pick<AdsUploadConfig, "customerId" | "paidActionId" | "trialActionId">
) {
  const actionId = row.kind === "paid" ? cfg.paidActionId : cfg.trialActionId;
  const base: Record<string, unknown> = {
    conversionAction: `customers/${cfg.customerId}/conversionActions/${actionId}`,
    conversionDateTime: formatAdsDateTime(row.occurredAt),
    orderId: row.orderId,
  };
  // Google accepts one click id per conversion.
  if (row.gclid) base.gclid = row.gclid;
  else if (row.gbraid) base.gbraid = row.gbraid;
  else if (row.wbraid) base.wbraid = row.wbraid;
  if (row.kind === "paid" && row.valueMinor != null) {
    base.conversionValue = Math.round(row.valueMinor) / 100;
    base.currencyCode = row.currency;
  }
  return base;
}

/** Row indexes Google refused, read from partialFailureError.details[].errors[].location. */
export function failedIndexes(resp: unknown): Map<number, string> {
  const out = new Map<number, string>();
  const details = (resp as { partialFailureError?: { details?: unknown[] } })?.partialFailureError?.details;
  for (const d of details ?? []) {
    const errors = (d as { errors?: unknown[] })?.errors ?? [];
    for (const e of errors) {
      const err = e as {
        message?: string;
        location?: { fieldPathElements?: { fieldName?: string; index?: number }[] };
      };
      const el = err.location?.fieldPathElements?.find((x) => x.fieldName === "conversions");
      if (el?.index != null) out.set(el.index, err.message ?? "rejected");
    }
  }
  return out;
}
