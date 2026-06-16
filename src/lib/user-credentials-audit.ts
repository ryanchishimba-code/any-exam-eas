import { prisma } from "@/lib/prisma";
import { isValidPasswordHash } from "@/lib/password-hash";
import { normalizeEmail } from "@/lib/validators/auth";

export type CredentialAuditIssue =
  | { type: "invalid_password_hash"; userId: string; email: string }
  | { type: "mixed_case_email"; userId: string; email: string; normalized: string }
  | { type: "email_normalization_conflict"; email: string; normalized: string; userIds: string[] };

export type CredentialAuditReport = {
  scanned: number;
  issues: CredentialAuditIssue[];
};

export async function auditUserCredentials(): Promise<CredentialAuditReport> {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, passwordHash: true },
    orderBy: { createdAt: "asc" },
  });

  const issues: CredentialAuditIssue[] = [];
  const byNormalized = new Map<string, string[]>();

  for (const user of users) {
    const normalized = normalizeEmail(user.email);
    const bucket = byNormalized.get(normalized) ?? [];
    bucket.push(user.id);
    byNormalized.set(normalized, bucket);

    if (user.passwordHash && !isValidPasswordHash(user.passwordHash)) {
      issues.push({ type: "invalid_password_hash", userId: user.id, email: user.email });
    }

    if (user.email !== normalized) {
      issues.push({
        type: "mixed_case_email",
        userId: user.id,
        email: user.email,
        normalized,
      });
    }
  }

  for (const [normalized, userIds] of byNormalized) {
    if (userIds.length > 1) {
      issues.push({ type: "email_normalization_conflict", email: normalized, normalized, userIds });
    }
  }

  return { scanned: users.length, issues };
}

export type CredentialRepairResult = {
  emailsNormalized: number;
  invalidHashesCleared: number;
  skippedEmailConflicts: number;
};

export async function repairUserCredentials(): Promise<CredentialRepairResult> {
  const report = await auditUserCredentials();
  let emailsNormalized = 0;
  let invalidHashesCleared = 0;
  let skippedEmailConflicts = 0;

  const conflictIds = new Set(
    report.issues
      .filter((i) => i.type === "email_normalization_conflict")
      .flatMap((i) => i.userIds)
  );

  for (const issue of report.issues) {
    if (issue.type === "mixed_case_email") {
      if (conflictIds.has(issue.userId)) {
        skippedEmailConflicts++;
        continue;
      }
      await prisma.user.update({
        where: { id: issue.userId },
        data: { email: issue.normalized },
      });
      emailsNormalized++;
    }

    if (issue.type === "invalid_password_hash") {
      await prisma.user.update({
        where: { id: issue.userId },
        data: { passwordHash: null, passwordAlgo: null, passwordUpdatedAt: null },
      });
      invalidHashesCleared++;
    }
  }

  return { emailsNormalized, invalidHashesCleared, skippedEmailConflicts };
}
