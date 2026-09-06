/**
 * POST /api/study/today — Mastery Engine Today set for NCLEX, NAPLEX, or USMLE.
 * Returns prepared StudyQuestions for the existing StudySessionPlayer.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  isTodayEngineEnabled,
  isTodayEngineNaplexEnabled,
  isTodayEngineUsmleEnabled,
} from "@/lib/engine/mastery/feature-flag";
import {
  buildNclexTodayForUser,
  buildNaplexTodayForUser,
  buildUsmleTodayForUser,
} from "@/lib/engine/mastery/today-service";
import { parseMasteryItemTags } from "@/lib/engine/mastery/item-tags";
import type { MasteryItemTags } from "@/lib/engine/mastery/types";
import { bankItemToSessionRaw } from "@/lib/exam-prep/prepare-bank-session";
import { getFieldMetaById } from "@/lib/fields";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/lib/routes";
import type { BankItem } from "@/lib/question-bank";

export const runtime = "nodejs";

const bodySchema = z.object({
  size: z.union([z.literal(20), z.literal(40), z.literal(60)]).optional(),
  examSlug: z.enum(["nclex", "naplex", "usmle"]).optional(),
  fieldId: z.string().optional(),
});

function masteryTagsToStudyTags(tags: MasteryItemTags): string[] {
  const out: string[] = [];
  if (tags.clientNeeds) out.push(`cn:${tags.clientNeeds}`);
  if (tags.cjmmFunction) out.push(`cjmm:${tags.cjmmFunction}`);
  if (tags.naplexDomain) out.push(`naplexDomain:${tags.naplexDomain}`);
  if (tags.naplexSubtopic) out.push(`naplexSubtopic:${tags.naplexSubtopic}`);
  for (const id of tags.drugIds ?? []) out.push(`drug:${id}`);
  for (const id of tags.labFlags ?? []) out.push(`lab:${id}`);
  for (const id of tags.calcFlags ?? []) out.push(`calc:${id}`);
  if (tags.anatomyId) out.push(`anatomy:${tags.anatomyId}`);
  return out;
}

export async function POST(req: Request) {
  const body = bodySchema.parse(await req.json().catch(() => ({})));
  const examSlug = body.examSlug ?? "nclex";

  if (examSlug === "naplex") {
    if (!isTodayEngineNaplexEnabled()) {
      return NextResponse.json(
        { error: "NAPLEX Today engine is not enabled.", code: "TODAY_ENGINE_NAPLEX_OFF" },
        { status: 404 }
      );
    }
  } else if (examSlug === "usmle") {
    if (!isTodayEngineUsmleEnabled()) {
      return NextResponse.json(
        { error: "USMLE Today engine is not enabled.", code: "TODAY_ENGINE_USMLE_OFF" },
        { status: 404 }
      );
    }
  } else if (!isTodayEngineEnabled()) {
    return NextResponse.json(
      { error: "Today engine is not enabled.", code: "TODAY_ENGINE_OFF" },
      { status: 404 }
    );
  }

  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;

  try {
    const built =
      examSlug === "naplex"
        ? await buildNaplexTodayForUser({
            userId: premium.userId,
            size: body.size,
          })
        : examSlug === "usmle"
          ? await buildUsmleTodayForUser({
              userId: premium.userId,
              size: body.size,
              fieldId: body.fieldId,
            })
          : await buildNclexTodayForUser({
              userId: premium.userId,
              size: body.size,
            });

    if (built.bankItemIds.length === 0) {
      return NextResponse.json(
        {
          error: `No ${examSlug.toUpperCase()} items available for Today.`,
          code: "EMPTY_TODAY",
        },
        { status: 404 }
      );
    }

    const rows = await prisma.questionBankItem.findMany({
      where: { id: { in: built.bankItemIds } },
    });
    const byId = new Map(rows.map((r) => [r.id, r]));
    const ordered = built.bankItemIds
      .map((id) => byId.get(id))
      .filter((r): r is NonNullable<typeof r> => Boolean(r));

    const fieldMeta = getFieldMetaById(built.fieldId);
    const fieldLabel = fieldMeta?.label ?? built.fieldId;

    const questions = ordered.map((row, i) => {
      const raw = bankItemToSessionRaw(
        built.fieldId,
        fieldLabel,
        row.subjectId ?? "mixed",
        row as unknown as BankItem,
        i
      );
      const study = examQuestionToStudy(
        {
          ...raw,
          bankItemId: row.id,
          subjectId: row.subjectId ?? "mixed",
          field: fieldLabel,
        },
        i,
        { shuffleOptions: false }
      );
      const mastery = parseMasteryItemTags({
        clientNeeds: row.clientNeeds,
        cjmmFunction: row.cjmmFunction,
        tags: row.tags,
        generationMeta: row.generationMeta,
        curationMeta: row.curationMeta,
      });
      const enrichedTags = [
        ...(Array.isArray(study.tags) ? study.tags : []),
        ...masteryTagsToStudyTags(mastery),
      ];
      return {
        ...study,
        id: row.id,
        bankItemId: row.id,
        tags: [...new Set(enrichedTags)],
      };
    });

    return NextResponse.json({
      ok: true,
      examSlug,
      size: questions.length,
      fieldId: built.fieldId,
      cellKeys: built.cellKeys,
      primers: built.primers,
      domainShare: "domainShare" in built ? built.domainShare : undefined,
      questions,
      playerHref: `${ROUTES.questionBank}?field=${encodeURIComponent(built.fieldId)}&mode=bank&style=today&count=${built.size}&autostart=1`,
    });
  } catch (e) {
    console.error("[study/today]", e);
    return NextResponse.json({ error: "Could not build Today set." }, { status: 500 });
  }
}
