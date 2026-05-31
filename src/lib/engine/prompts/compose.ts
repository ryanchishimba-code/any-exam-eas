import type { SubjectModule, ExamGenerationContext } from "../../subjects/types";
import {
  UNIVERSAL_EXAM_SYSTEM,
  buildUniversalScopeBlock,
  buildUniversalExamUserPrompt,
} from "./base";
import { buildHighYieldJsonShape, buildHighYieldRequirements } from "./high-yield";

export function composeExamSystemPrompt(subjectModule: SubjectModule): string {
  return `${UNIVERSAL_EXAM_SYSTEM}\n${subjectModule.getExamSystemAugmentation()}\nNever include questions outside the specified subject scope.`;
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
    textbookRefs: subject?.textbookRefs ?? "OpenStax / LibreTexts OER",
    examFocus: subject?.examHints ?? subjectModule.metadata.examFocus,
  });

  const augmentation = subjectModule.getExamUserAugmentation(ctx);
  const highYieldBlock = buildHighYieldRequirements(subjectModule, ctx);

  return buildUniversalExamUserPrompt({
    questionCount: ctx.questionCount,
    difficulty: ctx.difficulty,
    fieldBlock: params.fieldBlock,
    scopeBlock: `${scopeBlock}\n${augmentation}`.trim(),
    researchBrief: ctx.researchBrief,
    sourceCount: ctx.sources.length,
    context: params.context,
    subjectLabel: subject?.label ?? ctx.topic,
    extraRequirements: [highYieldBlock, params.extraRequirements].filter(Boolean).join("\n\n"),
    jsonShapeExtra: buildHighYieldJsonShape(),
  });
}
