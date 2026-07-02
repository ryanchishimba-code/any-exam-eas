import {
  isNeonPooledUrl,
  isPostgresDatabaseUrl,
  resolveDatabaseUrl,
} from "@/lib/database-url";
import { isUpstashRedisEnabled } from "@/lib/upstash-redis";
import {
  isIntervalPriceConfigured,
  STRIPE_PRICE_ENV_KEYS,
} from "@/lib/stripe-prices";
import {
  BILLING_INTERVAL_SAVINGS,
  type BillingInterval,
} from "@/lib/billing-config";
import type { SubscriptionTier } from "@/lib/subscription-tiers";

export type ScaleCheckStatus = "ok" | "warn" | "fail";

export type ScaleReadinessCheck = {
  id: string;
  status: ScaleCheckStatus;
  detail: string;
};

export type ScaleReadinessReport = {
  /** No `fail` checks — safe to ramp. Warnings may still apply. */
  ready: boolean;
  /** Recommended ops phase based on configured infra (not live traffic). */
  phase: "pre-1k" | "1k-3k" | "3k-5k" | "5k+";
  checks: ScaleReadinessCheck[];
};

const BILLING_INTERVALS = Object.keys(BILLING_INTERVAL_SAVINGS) as BillingInterval[];
const SUBSCRIPTION_TIERS: SubscriptionTier[] = ["pro"];

function check(id: string, status: ScaleCheckStatus, detail: string): ScaleReadinessCheck {
  return { id, status, detail };
}

function inferPhase(checks: ScaleReadinessCheck[]): ScaleReadinessReport["phase"] {
  const fail = (cid: string) => checks.find((c) => c.id === cid)?.status === "fail";
  const warn = (cid: string) => checks.find((c) => c.id === cid)?.status === "warn";

  if (fail("databaseUrl") || fail("neonPooler") || fail("nextauthSecret")) return "pre-1k";
  if (fail("upstash") || warn("upstash") || fail("stripePrices")) return "1k-3k";
  if (warn("neonPooler") || warn("resend") || warn("siteUrl")) return "3k-5k";
  return "5k+";
}

/** Static infra/env checks for ramp readiness (no Stripe API calls). */
export function runScaleReadinessChecks(): ScaleReadinessReport {
  const checks: ScaleReadinessCheck[] = [];
  const url = resolveDatabaseUrl();

  if (!url) {
    checks.push(check("databaseUrl", "fail", "DATABASE_URL missing"));
  } else if (!isPostgresDatabaseUrl(url)) {
    checks.push(check("databaseUrl", "fail", "Use Neon Postgres on Vercel (not SQLite)"));
  } else {
    checks.push(check("databaseUrl", "ok", "postgresql"));
  }

  if (url && isPostgresDatabaseUrl(url)) {
    checks.push(
      isNeonPooledUrl(url)
        ? check("neonPooler", "ok", "Neon pooled URL (-pooler hostname)")
        : check(
            "neonPooler",
            process.env.VERCEL ? "fail" : "warn",
            "Use Neon pooled URL for serverless — see docs/VERCEL_DATABASE.md"
          )
    );
  }

  checks.push(
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
      ? check("nextauthSecret", "ok", "set")
      : check("nextauthSecret", "fail", "AUTH_SECRET or NEXTAUTH_SECRET missing")
  );

  checks.push(
    process.env.CRON_SECRET?.trim()
      ? check("cronSecret", "ok", "set")
      : check("cronSecret", "warn", "Set CRON_SECRET for cron + detailed /api/health")
  );

  checks.push(
    isUpstashRedisEnabled()
      ? check("upstash", "ok", "Upstash Redis configured")
      : check(
          "upstash",
          process.env.VERCEL ? "fail" : "warn",
          "Set UPSTASH_REDIS_REST_URL + TOKEN — required at multi-instance scale"
        )
  );

  const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim();
  const stripePublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
  if (stripeSecret && stripePublishable) {
    checks.push(check("stripeKeys", "ok", "set"));
  } else {
    checks.push(check("stripeKeys", "fail", "STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY required"));
  }

  const missingPriceEnvKeys: string[] = [];
  for (const tier of SUBSCRIPTION_TIERS) {
    for (const interval of BILLING_INTERVALS) {
      if (!isIntervalPriceConfigured(tier, interval)) {
        missingPriceEnvKeys.push(STRIPE_PRICE_ENV_KEYS[tier][interval]);
      }
    }
  }
  if (missingPriceEnvKeys.length === 0) {
    checks.push(check("stripePrices", "ok", "all tier interval price IDs configured"));
  } else {
    checks.push(check("stripePrices", "fail", `Missing Stripe price env: ${missingPriceEnvKeys.join(", ")}`));
  }

  if (process.env.STRIPE_WEBHOOK_SECRET?.trim()) {
    checks.push(check("stripeWebhook", "ok", "set"));
  } else {
    checks.push(check("stripeWebhook", "warn", "STRIPE_WEBHOOK_SECRET missing — subscription sync may lag"));
  }

  if (process.env.RESEND_API_KEY?.trim()) {
    const from = process.env.EMAIL_FROM ?? "";
    checks.push(
      from.includes("resend.dev")
        ? check("resend", "warn", "RESEND_API_KEY set but EMAIL_FROM uses resend.dev sandbox")
        : check("resend", "ok", "email delivery configured")
    );
  } else {
    checks.push(check("resend", "warn", "RESEND_API_KEY missing — password reset emails will not send"));
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl?.startsWith("https://www.anyexameasy.com")) {
    checks.push(check("siteUrl", "ok", siteUrl));
  } else if (process.env.VERCEL && process.env.NODE_ENV === "production") {
    checks.push(
      check("siteUrl", "warn", "Set NEXT_PUBLIC_SITE_URL=https://www.anyexameasy.com in production")
    );
  } else {
    checks.push(check("siteUrl", "ok", siteUrl || "local-dev"));
  }

  if (process.env.OPENAI_API_KEY?.trim()) {
    checks.push(check("openai", "ok", "set"));
  } else {
    checks.push(check("openai", "warn", "OPENAI_API_KEY missing — AI generation disabled"));
  }

  const retentionDays = Number(process.env.ANALYTICS_RETENTION_DAYS ?? "90");
  checks.push(
    Number.isFinite(retentionDays) && retentionDays >= 30
      ? check("analyticsRetention", "ok", `${retentionDays}-day raw event retention`)
      : check("analyticsRetention", "warn", "ANALYTICS_RETENTION_DAYS should be >= 30 (default 90)")
  );

  const ready = !checks.some((c) => c.status === "fail");
  return { ready, phase: inferPhase(checks), checks };
}
