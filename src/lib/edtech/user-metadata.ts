import { prisma } from "@/lib/prisma";
import type { MpjeVariant } from "@/lib/mpje/config";
import { isMpjeUsJurisdiction } from "@/lib/mpje/us-jurisdictions";

export type UserEdtechMetadata = {
  mpjeStateCode?: string;
  mpjeVariant?: MpjeVariant;
  /** Last USMLE step bank the learner practiced (usmle-step-1/2/3). */
  usmleFieldId?: string;
  /** Anticipated test date per exam, keyed by exam slug (ISO `YYYY-MM-DD`). */
  examTestDates?: Record<string, string>;
};

function parseMetadata(raw: string | null | undefined): UserEdtechMetadata {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as UserEdtechMetadata;
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

export async function getUserEdtechMetadata(userId: string): Promise<UserEdtechMetadata> {
  try {
    const row = await prisma.userPreference.findUnique({ where: { userId } });
    return parseMetadata(row?.metadata);
  } catch {
    return {};
  }
}

export async function setUserEdtechMetadata(
  userId: string,
  patch: Partial<UserEdtechMetadata>
): Promise<UserEdtechMetadata> {
  const current = await getUserEdtechMetadata(userId);
  const next: UserEdtechMetadata = { ...current, ...patch };

  if (next.mpjeStateCode && !isMpjeUsJurisdiction(next.mpjeStateCode)) {
    delete next.mpjeStateCode;
  }

  await prisma.userPreference.upsert({
    where: { userId },
    create: {
      userId,
      metadata: JSON.stringify(next),
      updatedAt: new Date(),
    },
    update: {
      metadata: JSON.stringify(next),
      updatedAt: new Date(),
    },
  });

  return next;
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string): boolean {
  return ISO_DATE_RE.test(value) && !Number.isNaN(Date.parse(value));
}

/** Read the anticipated test date for a given exam (ISO `YYYY-MM-DD`) or null. */
export function getExamTestDate(meta: UserEdtechMetadata, examSlug: string): string | null {
  const date = meta.examTestDates?.[examSlug];
  return date && isValidIsoDate(date) ? date : null;
}

/** Set or clear (pass null) the anticipated test date for a given exam. */
export async function setUserExamTestDate(
  userId: string,
  examSlug: string,
  date: string | null
): Promise<UserEdtechMetadata> {
  const current = await getUserEdtechMetadata(userId);
  const examTestDates = { ...(current.examTestDates ?? {}) };

  if (date && isValidIsoDate(date)) {
    examTestDates[examSlug] = date;
  } else {
    delete examTestDates[examSlug];
  }

  return setUserEdtechMetadata(userId, { examTestDates });
}
