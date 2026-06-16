import type { SubjectModule, ExamGenerationContext } from "../../subjects/types";
import {
  UNIVERSAL_EXAM_SYSTEM,
  buildUniversalScopeBlock,
  buildUniversalExamUserPrompt,
} from "./base";
import { BATCH_DIVERSITY_RULES } from "./batch-diversity";
import { buildHighYieldJsonShape, buildHighYieldRequirements } from "./high-yield";
import { buildDrugCatalogReferenceBlock } from "./pharm-drug-profile";

export function composeExamSystemPrompt(subjectModule: SubjectModule): string {
  return `${UNIVERSAL_EXAM_SYSTEM}\n${BATCH_DIVERSITY_RULES}\n${subjectModule.getExamSystemAugmentation()}\nNever include questions outside the specified subject scope.`;
}

export function composeExamUserPrompt(
  subjectModule: SubjectModule,
  ctx: ExamGenerationContext,
  params: {
    fieldBlock: string;
    context: string;
    extraRequirements?: string;
  }
): string {
  const subject = ctx.subject;
  const scopeBlock = buildUniversalScopeBlock({
    subjectLabel: subject?.label ?? ctx.topic,
    field: ctx.field,
    topic: ctx.topic,
    textbookRefs:
      subject?.textbookRefs ??
      (ctx.field === "nursing"
        ? "Open RN Project, OpenStax Nursing, NCSBN NCLEX-RN Test Plan"
        : ctx.field === "pharmacy"
          ? "OpenStax Pharmacy, LibreTexts, NABP NAPLEX Content Outline"
          : ctx.field === "mpje"
            ? "NABP MPJE/UMPJE outline, DEA Pharmacist's Manual, FDA pharmacy guidance, state practice acts"
            : "OpenStax Anatomy & Physiology, LibreTexts Pathology, USMLE Content Outline"),
    examFocus: subject?.examHints ?? subjectModule.metadata.examFocus,
  });

  const augmentation = subjectModule.getExamUserAugmentation(ctx);
  const highYieldBlock = buildHighYieldRequirements(subjectModule, ctx);
  const drugCatalogBlock = buildDrugCatalogReferenceBlock(ctx);

  return buildUniversalExamUserPrompt({
    questionCount: ctx.questionCount,
    difficulty: ctx.difficulty,
    fieldBlock: params.fieldBlock,
    scopeBlock: `${scopeBlock}\n${augmentation}`.trim(),
    researchBrief: ctx.researchBrief,
    sourceCount: ctx.sources.length,
    context: params.context,
    subjectLabel: subject?.label ?? ctx.topic,
    extraRequirements: [highYieldBlock, drugCatalogBlock, params.extraRequirements]
      .filter(Boolean)
      .join("\n\n"),
    jsonShapeExtra: buildHighYieldJsonShape(ctx),
  });
}
