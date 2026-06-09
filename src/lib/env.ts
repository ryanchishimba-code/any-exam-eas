import { z } from "zod";
import { ensureDatabaseUrlEnv, resolveDatabaseUrl } from "@/lib/database-url";
import { appBaseUrl, isResendSandboxFrom } from "@/lib/email/config";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(16).optional(),
  AUTH_SECRET: z.string().min(16).optional(),
  OPENAI_API_KEY: z.string().optional(),
  TAVILY_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

/** Validate required server env (call from health check or startup scripts). */
export function getServerEnv(opts?: { strict?: boolean }): ServerEnv {
  if (cached && !opts?.strict) return cached;

  ensureDatabaseUrlEnv();
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    throw new Error(`Invalid environment: ${JSON.stringify(msg)}`);
  }

  const data = parsed.data;
  const secret = data.AUTH_SECRET ?? data.NEXTAUTH_SECRET;
  if (opts?.strict && !secret) {
    throw new Error("NEXTAUTH_SECRET or AUTH_SECRET is required in production");
  }

  cached = data;
  return data;
}

export function envSummary(): Record<string, string> {
  const url = resolveDatabaseUrl();
  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    database: url.startsWith("file:")
      ? "sqlite"
      : url.startsWith("postgres")
        ? "postgresql"
        : "unset",
    openai: process.env.OPENAI_API_KEY ? "set" : "missing",
    tavily: process.env.TAVILY_API_KEY ? "set" : "missing",
    stripe: process.env.STRIPE_SECRET_KEY ? "set" : "missing",
    resend: process.env.RESEND_API_KEY ? "set" : "missing",
    emailFrom: isResendSandboxFrom()
      ? "resend-sandbox"
      : process.env.EMAIL_FROM
        ? "verified-domain"
        : "default-sandbox",
    passwordResetBaseUrl: appBaseUrl(),
    authSecret:
      process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET ? "set" : "missing",
  };
}
