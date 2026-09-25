/**
 * POST /api/study/daily-set
 *
 * One sitting for the board in `field` (the question-bank page field, which
 * already prefers the URL over the saved exam). Mixes due Review incorrect,
 * due spaced review, and unseen blueprint-weighted items.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { CONVERSION_EVENTS } from "@/lib/analytics/conversion-types";
import { trackConversionServer } from "@/lib/analytics/conversions";
import { examSlugForFieldId } from "@/lib/edtech/exam-field-ids";
import { bankItemToSessionRaw } from "@/lib/exam-prep/prepare-bank-session";
import { loadBankItemsByIds } from "@/lib/full-exam/load-bank-items-by-ids";
import { getFieldMetaById } from "@/lib/fields";
import {
  recountTodayMix,
  resolveTodaySetSize,
} from "@/lib/learning/today-set";
import { selectTodaySet } from "@/lib/learning/today-set-plan";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import { ROUTES } from "@/lib/routes";
import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  field: z.string().min(1),
});

export async function POST(req: Request) {
  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;

  try {
    const body = bodySchema.parse(await req.json().catch(() => ({})));
    const { resolveQuestionBankFieldId, enforceQuestionBankFieldAccess } = await import(
      "@/lib/edtech/question-bank-scope"
    );
    const fieldId = resolveQuestionBankFieldId(body.field);
    const examSlug = examSlugForFieldId(fieldId);
    if (!examSlug) {
      return NextResponse.json({ error: "Unknown exam field." }, { status: 400 });
    }

    const access = await enforceQuestionBankFieldAccess(premium.userId, body.field);
    if (!access.ok) return access.response;

    const target = resolveTodaySetSize();
    const { checkStudyQuestionUsage, recordStudyQuestionsServed } = await import(
      "@/lib/study/usage-limits"
    );
    const usageCheck = await checkStudyQuestionUsage({
      userId: premium.userId,
      access: premium.access,
      requestedCount: target,
      adaptive: false,
    });
    if (!usageCheck.ok) return usageCheck.response;

    const selection = await selectTodaySet({
      userId: premium.userId,
      examSlug,
      fieldId,
      size: Math.min(target, usageCheck.allowedCount),
    });

    const items = await loadBankItemsByIds(fieldId, selection.composition.ids);
    const loadedIds = new Set(items.map((item) => item.id).filter((id): id is string => Boolean(id)));
    const mix = recountTodayMix(selection.composition, loadedIds);
    if (mix.ids.length === 0) {
      return NextResponse.json(
        {
          error: "No questions ready for this board yet.",
          code: "EMPTY_DAILY_SET",
          mixLine: null,
          reviewCount: 0,
          newCount: 0,
        },
        { status: 404 }
      );
    }

    const ordered = mix.ids
      .map((id) => items.find((item) => item.id === id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
    const fieldLabel = getFieldMetaById(fieldId)?.label ?? fieldId;
    const questions = ordered.map((item, index) => {
      const study = examQuestionToStudy(
        bankItemToSessionRaw(
          fieldId,
          fieldLabel,
          item.subjectId ?? MIXED_SUBJECT_ID,
          item,
          index
        ),
        index,
        { shuffleOptions: false }
      );
      return {
        ...study,
        id: item.id,
        bankItemId: item.id,
        subjectId: item.subjectId ?? MIXED_SUBJECT_ID,
      };
    });

    await recordStudyQuestionsServed(premium.userId, questions.length, "bank", usageCheck.plan);

    const topics: TodayTopics = {};
    for (const id of mix.ids) {
      const topic = selection.topics[id];
      if (topic) topics[id] = topic;
    }

    trackConversionServer({
      eventName: CONVERSION_EVENTS.TODAY_SET_STARTED,
      userId: premium.userId,
      properties: {
        exam_slug: examSlug,
        field_id: fieldId,
        size: questions.length,
        review_count: mix.reviewCount,
        spaced_count: mix.spacedReviewIds.length,
        new_count: mix.newCount,
      },
    });

    const playerHref = `${ROUTES.questionBank}?field=${encodeURIComponent(fieldId)}&mode=bank&style=daily_set&count=${questions.length}&autostart=1`;

    return NextResponse.json({
      ok: true,
      examSlug,
      fieldId,
      size: questions.length,
      target: selection.target,
      tomorrowCount: selection.tomorrowCount,
      reviewCount: mix.reviewCount,
      newCount: mix.newCount,
      mixLine: mix.mixLine,
      questions,
      bankItemIds: mix.ids,
      todaySet: {
        examSlug,
        target: selection.target,
        tomorrowCount: selection.tomorrowCount,
        topics,
      },
      playerHref,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    console.error("[study/daily-set]", error);
    return NextResponse.json({ error: "Could not build today's set." }, { status: 500 });
  }
}

type TodayTopics = Record<string, { id: string; label: string; href: string }>;
