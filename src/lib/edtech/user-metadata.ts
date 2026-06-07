import { prisma } from "@/lib/prisma";
import type { MpjeVariant } from "@/lib/mpje/config";
import { isMpjeUsJurisdiction } from "@/lib/mpje/us-jurisdictions";

export type UserEdtechMetadata = {
  mpjeStateCode?: string;
  mpjeVariant?: MpjeVariant;
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
