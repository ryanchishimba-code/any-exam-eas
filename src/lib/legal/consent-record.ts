import { prisma } from "@/lib/prisma";
import { LEGAL_DISCLAIMERS, LEGAL_ENTITY, LEGAL_LAST_UPDATED } from "@/lib/legal";

export type ConsentSignupMethod = "credentials" | "google" | "apple" | "linkedin";

export type UserConsentSnapshot = {
  userId: string;
  email: string;
  name: string | null;
  dateOfBirth: string;
  accountCreatedAt: string;
  termsVersion: string;
  privacyVersion: string;
  acceptedAt: string;
  signupMethod: string;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  source: "recorded" | "inferred";
};

export type ConsentListSummary = {
  acceptedAt: string;
  termsVersion: string;
  signupMethod: string;
  source: "recorded" | "inferred";
};

function clientIpFromRequest(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return req.headers.get("x-real-ip");
}

export async function recordUserLegalConsent(input: {
  userId: string;
  signupMethod?: ConsentSignupMethod;
  req?: Request;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const ipAddress = input.req ? clientIpFromRequest(input.req) : null;
  const userAgent = input.req?.headers.get("user-agent") ?? null;

  await prisma.userLegalConsent.upsert({
    where: { userId: input.userId },
    create: {
      userId: input.userId,
      termsVersion: LEGAL_LAST_UPDATED,
      privacyVersion: LEGAL_LAST_UPDATED,
      signupMethod: input.signupMethod ?? "credentials",
      ipAddress,
      userAgent,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    },
    update: {},
  });
}

export async function getUserConsentSnapshot(userId: string): Promise<UserConsentSnapshot | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      dateOfBirth: true,
      createdAt: true,
      legalConsent: true,
    },
  });
  if (!user) return null;

  if (user.legalConsent) {
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      dateOfBirth: user.dateOfBirth.toISOString().slice(0, 10),
      accountCreatedAt: user.createdAt.toISOString(),
      termsVersion: user.legalConsent.termsVersion,
      privacyVersion: user.legalConsent.privacyVersion,
      acceptedAt: user.legalConsent.acceptedAt.toISOString(),
      signupMethod: user.legalConsent.signupMethod,
      ipAddress: user.legalConsent.ipAddress,
      userAgent: user.legalConsent.userAgent,
      metadata: user.legalConsent.metadata
        ? (JSON.parse(user.legalConsent.metadata) as Record<string, unknown>)
        : null,
      source: "recorded",
    };
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    dateOfBirth: user.dateOfBirth.toISOString().slice(0, 10),
    accountCreatedAt: user.createdAt.toISOString(),
    termsVersion: LEGAL_LAST_UPDATED,
    privacyVersion: LEGAL_LAST_UPDATED,
    acceptedAt: user.createdAt.toISOString(),
    signupMethod: "unknown",
    ipAddress: null,
    userAgent: null,
    metadata: null,
    source: "inferred",
  };
}

export function summarizeConsentForList(
  consent: { acceptedAt: Date; termsVersion: string; signupMethod: string } | null,
  accountCreatedAt: Date
): ConsentListSummary {
  if (consent) {
    return {
      acceptedAt: consent.acceptedAt.toISOString(),
      termsVersion: consent.termsVersion,
      signupMethod: consent.signupMethod,
      source: "recorded",
    };
  }
  return {
    acceptedAt: accountCreatedAt.toISOString(),
    termsVersion: LEGAL_LAST_UPDATED,
    signupMethod: "unknown",
    source: "inferred",
  };
}

export function renderConsentDocument(snapshot: UserConsentSnapshot): string {
  const accepted = new Date(snapshot.acceptedAt).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const meta = snapshot.metadata;
  const plan = typeof meta?.plan === "string" ? meta.plan : null;
  const examSlug = typeof meta?.examSlug === "string" ? meta.examSlug : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Consent record — ${snapshot.email}</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1.5rem; color: #111; line-height: 1.55; }
    h1 { font-size: 1.35rem; margin-bottom: 0.25rem; }
    .meta { color: #555; font-size: 0.9rem; margin-bottom: 1.5rem; }
    section { border: 1px solid #e5e5e5; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1rem; }
    h2 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: #666; margin: 0 0 0.75rem; }
    dl { display: grid; grid-template-columns: 140px 1fr; gap: 0.35rem 1rem; margin: 0; font-size: 0.92rem; }
    dt { color: #666; }
    dd { margin: 0; font-weight: 500; }
    ul { margin: 0.5rem 0 0; padding-left: 1.2rem; font-size: 0.88rem; color: #333; }
    .badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; background: #f0f9ff; color: #0369a1; }
    .inferred { background: #fef3c7; color: #92400e; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>User consent &amp; attestation record</h1>
  <p class="meta">${LEGAL_ENTITY.productName} · ${LEGAL_ENTITY.companyName} · Internal use only</p>

  <section>
    <h2>Account</h2>
    <dl>
      <dt>Email</dt><dd>${escapeHtml(snapshot.email)}</dd>
      <dt>Legal name</dt><dd>${escapeHtml(snapshot.name ?? "—")}</dd>
      <dt>Date of birth</dt><dd>${escapeHtml(snapshot.dateOfBirth)}</dd>
      <dt>User ID</dt><dd><code>${escapeHtml(snapshot.userId)}</code></dd>
    </dl>
  </section>

  <section>
    <h2>Consent captured</h2>
    <dl>
      <dt>Accepted at</dt><dd>${escapeHtml(accepted)} UTC</dd>
      <dt>Terms version</dt><dd>${escapeHtml(snapshot.termsVersion)}</dd>
      <dt>Privacy version</dt><dd>${escapeHtml(snapshot.privacyVersion)}</dd>
      <dt>Signup method</dt><dd>${escapeHtml(snapshot.signupMethod)}</dd>
      <dt>Record type</dt><dd><span class="badge ${snapshot.source === "inferred" ? "inferred" : ""}">${snapshot.source === "recorded" ? "Recorded consent" : "Inferred from account creation"}</span></dd>
      ${plan ? `<dt>Plan at signup</dt><dd>${escapeHtml(plan)}</dd>` : ""}
      ${examSlug ? `<dt>Exam at signup</dt><dd>${escapeHtml(examSlug)}</dd>` : ""}
      ${snapshot.ipAddress ? `<dt>IP address</dt><dd>${escapeHtml(snapshot.ipAddress)}</dd>` : ""}
    </dl>
  </section>

  <section>
    <h2>Attestations accepted</h2>
    <ul>
      <li>Terms of Service (version ${escapeHtml(snapshot.termsVersion)})</li>
      <li>Privacy Policy (version ${escapeHtml(snapshot.privacyVersion)})</li>
      <li>${escapeHtml(LEGAL_DISCLAIMERS.ageRequirement)}</li>
      <li>${escapeHtml(LEGAL_DISCLAIMERS.userResponsibility)}</li>
    </ul>
  </section>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
