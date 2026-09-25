import { prisma } from "@/lib/prisma";
import {
  FIRST_LOGIN_TOUR_ID,
  isFirstLoginTourEligible,
  isTourSchemaGap,
  isTourSeen,
  mergeTourRecord,
  type TourDevice,
  type TourStatus,
} from "@/lib/onboarding/tour-record";

export type TourGate = {
  seen: boolean;
  attemptCount: number | null;
  /** False when UserPreference could not be read or written (missing column/table). */
  persisted: boolean;
  eligible: boolean;
};

function logTourError(label: string, error: unknown): void {
  if (isTourSchemaGap(error)) return;
  console.warn(`[tour] ${label}:`, error instanceof Error ? error.message : error);
}

function emptyGate(persisted: boolean): TourGate {
  return { seen: false, attemptCount: null, persisted, eligible: false };
}

/**
 * Account-wide attempt count. Null on failure so the client fails closed
 * and does not surprise existing students.
 */
export async function readAccountAttemptCount(userId: string): Promise<number | null> {
  try {
    return await prisma.questionAttempt.count({ where: { userId } });
  } catch (error) {
    logTourError("attempt count unavailable", error);
    return null;
  }
}

export async function readTourGate(userId: string): Promise<TourGate> {
  try {
    const [row, attemptCount] = await Promise.all([
      prisma.userPreference.findUnique({
        where: { userId },
        select: { metadata: true },
      }),
      prisma.questionAttempt.count({ where: { userId } }),
    ]);
    const seen = isTourSeen(row?.metadata);
    return {
      seen,
      attemptCount,
      persisted: true,
      eligible: isFirstLoginTourEligible({
        seen,
        attemptCount,
        examSelected: true,
        pathname: "/dashboard",
        signedIn: true,
      }),
    };
  } catch (error) {
    logTourError("eligibility read failed", error);
    return emptyGate(false);
  }
}

export async function markTourStatus(
  userId: string,
  patch: { status: TourStatus; step: number; device?: TourDevice }
): Promise<{ ok: boolean; persisted: boolean }> {
  try {
    const row = await prisma.userPreference.findUnique({
      where: { userId },
      select: { metadata: true },
    });
    const next = mergeTourRecord(row?.metadata, {
      status: patch.status,
      step: patch.step,
      device: patch.device,
      at: new Date().toISOString(),
    });
    await prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        metadata: JSON.stringify(next),
        updatedAt: new Date(),
      },
      update: {
        metadata: JSON.stringify(next),
      },
    });
    return { ok: true, persisted: true };
  } catch (error) {
    logTourError("status write failed", error);
    return { ok: false, persisted: false };
  }
}

export { FIRST_LOGIN_TOUR_ID };
