import { createHash, randomBytes } from "crypto";
import { appBaseUrl, type EmailDeliveryResult } from "@/lib/email/config";
import { emailParagraph, transactionalEmailLayout } from "@/lib/email/layout";
import { sendTransactionalEmail } from "@/lib/email/resend-client";
import { prisma } from "@/lib/prisma";
import { LEGAL_ENTITY } from "@/lib/legal";

export type DailyLeadStatus = "pending" | "confirmed" | "unsubscribed";

export function hashLeadToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

function newToken(): string {
  return randomBytes(32).toString("base64url");
}

export function dailyConfirmUrl(token: string): string {
  return `${appBaseUrl()}/daily/confirm?token=${encodeURIComponent(token)}`;
}

export function dailyUnsubscribeUrl(token: string): string {
  return `${appBaseUrl()}/daily/unsubscribe?token=${encodeURIComponent(token)}`;
}

export function dailyLeadConfirmationContent(confirmUrl: string, unsubscribeUrl: string) {
  const subject = "Confirm your AnyExamEasy daily question email";
  const bodyHtml = [
    emailParagraph("You asked to get the question of the day by email."),
    emailParagraph(
      "Confirm below if that was you. We will not send a daily question until you do. If you did not ask for this, you can ignore the message or unsubscribe."
    ),
    emailParagraph(
      `${LEGAL_ENTITY.productName} is a study aid. A daily question is practice, not a promise of a score or a license.`
    ),
  ].join("");
  const text = [
    "You asked to get the question of the day by email.",
    "",
    "Confirm if that was you. We will not send a daily question until you do.",
    `Confirm: ${confirmUrl}`,
    `Unsubscribe: ${unsubscribeUrl}`,
    "",
    `${LEGAL_ENTITY.productName} is a study aid. A daily question is practice, not a promise of a score or a license.`,
  ].join("\n");
  const html = transactionalEmailLayout({
    title: "Confirm this email",
    preheader: "No daily question is sent until you confirm.",
    bodyHtml,
    primaryCta: { label: "Confirm email", url: confirmUrl },
    secondaryCta: { label: "Unsubscribe", url: unsubscribeUrl },
    footerNote: "You are receiving this because this address was entered on a daily question page.",
  });
  return { subject, html, text };
}

async function sendDailyLeadConfirmation(params: {
  to: string;
  confirmToken: string;
  unsubscribeToken: string;
}): Promise<EmailDeliveryResult> {
  const content = dailyLeadConfirmationContent(
    dailyConfirmUrl(params.confirmToken),
    dailyUnsubscribeUrl(params.unsubscribeToken)
  );
  return sendTransactionalEmail({
    to: params.to,
    subject: content.subject,
    html: content.html,
    text: content.text,
    tags: [{ name: "category", value: "daily-question-confirm" }],
  });
}

export type SaveDailyLeadResult = {
  status: DailyLeadStatus;
  confirmationSent: boolean;
};

export async function saveDailyQuestionLead(input: {
  email: string;
  examSlug?: string | null;
}): Promise<SaveDailyLeadResult> {
  const email = input.email.trim().toLowerCase();
  const examSlug = input.examSlug?.trim() || null;
  const existing = await prisma.dailyQuestionLead.findUnique({ where: { email } });
  if (existing?.status === "confirmed") {
    return { status: "confirmed", confirmationSent: false };
  }

  const confirmToken = newToken();
  const unsubscribeToken = newToken();
  const data = {
    status: "pending",
    examSlug,
    confirmTokenHash: hashLeadToken(confirmToken),
    unsubscribeTokenHash: hashLeadToken(unsubscribeToken),
    confirmedAt: null,
    unsubscribedAt: null,
  };

  if (existing) {
    await prisma.dailyQuestionLead.update({ where: { email }, data });
  } else {
    await prisma.dailyQuestionLead.create({ data: { email, ...data } });
  }

  const sent = await sendDailyLeadConfirmation({ to: email, confirmToken, unsubscribeToken });
  return { status: "pending", confirmationSent: sent.ok };
}

export async function confirmDailyQuestionLead(rawToken: string): Promise<{ ok: boolean }> {
  const token = rawToken.trim();
  if (!token) return { ok: false };
  const row = await prisma.dailyQuestionLead.findUnique({
    where: { confirmTokenHash: hashLeadToken(token) },
  });
  if (!row || row.status === "unsubscribed") return { ok: false };
  if (row.status === "confirmed") return { ok: true };
  await prisma.dailyQuestionLead.update({
    where: { id: row.id },
    data: { status: "confirmed", confirmedAt: new Date() },
  });
  return { ok: true };
}

export async function unsubscribeDailyQuestionLead(rawToken: string): Promise<{ ok: boolean }> {
  const token = rawToken.trim();
  if (!token) return { ok: false };
  const row = await prisma.dailyQuestionLead.findUnique({
    where: { unsubscribeTokenHash: hashLeadToken(token) },
  });
  if (!row) return { ok: false };
  if (row.status !== "unsubscribed") {
    await prisma.dailyQuestionLead.update({
      where: { id: row.id },
      data: { status: "unsubscribed", unsubscribedAt: new Date() },
    });
  }
  return { ok: true };
}
