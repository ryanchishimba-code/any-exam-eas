import { NextResponse } from "next/server";
import { z } from "zod";
import { invalidateStudentReadCaches } from "@/lib/learning/invalidate-read-caches";
import { prisma } from "@/lib/prisma";
import { respondDbUnavailable } from "@/lib/api-db-error";

export const runtime = "nodejs";
export const maxDuration = 30;

const bodySchema = z.object({
  field: z.string().min(1),
  itemId: z.string().min(1).max(200),
  confirm: z.literal(true),
});

/**
 * Documented mark-mastered. Requires an explicit confirm flag so a stray
 * click cannot clear a miss. A later incorrect attempt reopens the item.
 */
export async function POST(req: Request) {
  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;

  try {
    const body = bodySchema.parse(await req.json());
    const itemId = body.itemId.trim();
    if (!itemId || /^\d+$/.test(itemId)) {
      return NextResponse.json({ error: "That item cannot be marked mastered." }, { status: 400 });
    }

    const { enforceQuestionBankFieldAccess } = await import("@/lib/edtech/question-bank-scope");
    const access = await enforceQuestionBankFieldAccess(premium.userId, body.field);
    if (!access.ok) return access.response;
    const fieldId = access.fieldId;

    const miss = await prisma.questionAttempt.findFirst({
      where: {
        userId: premium.userId,
        fieldId,
        correct: false,
        OR: [{ bankItemId: itemId }, { questionKey: itemId }],
      },
      select: { id: true },
    });
    if (!miss) {
      return NextResponse.json(
        { error: "This item is not in Review incorrect." },
        { status: 400 }
      );
    }

    const confirmedAt = new Date();
    await prisma.remediationMasteryMark.upsert({
      where: { userId_fieldId_itemId: { userId: premium.userId, fieldId, itemId } },
      create: { userId: premium.userId, fieldId, itemId, confirmedAt },
      update: { confirmedAt },
    });
    await invalidateStudentReadCaches(premium.userId, fieldId);

    return NextResponse.json({
      ok: true,
      itemId,
      fieldId,
      confirmedAt: confirmedAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Confirm mastery before this item can leave Review incorrect." },
        { status: 400 }
      );
    }
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    console.error("[remediation-mastery]", error);
    return NextResponse.json({ error: "Could not mark this item mastered." }, { status: 500 });
  }
}
