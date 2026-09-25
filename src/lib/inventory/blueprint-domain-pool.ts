/**
 * One assignment rule for blueprint-area counts and the session a chip starts.
 *
 * Active questions are the published, not-retired rows in the shared inventory
 * (`active` and `qaPassed`). A topic row counts those rows for one subject.
 * A blueprint chip counts the same rows for one blueprint area:
 * an explicit clientNeeds value wins, otherwise the first blueprint category
 * whose id or subjectIds include the subject. Areas that share a subject do
 * not both count it. Selecting a chip samples this same set.
 */

import { getExamBlueprint } from "@/lib/engine/blueprints";

export type QuestionAreaSource = {
  subjectId?: string | null;
  clientNeeds?: string | null;
};

/** Blueprint category for one question. Null when it is not on the blueprint. */
export function blueprintCategoryIdForQuestion(
  fieldId: string,
  source: QuestionAreaSource
): string | null {
  const explicit = source.clientNeeds?.trim();
  if (explicit) return explicit;
  const subjectId = source.subjectId?.trim() || "unassigned";
  const categories = getExamBlueprint(fieldId)?.categories ?? [];
  const match = categories.find(
    (category) => category.id === subjectId || category.subjectIds?.includes(subjectId)
  );
  return match?.id ?? null;
}

export function isBlueprintAreaId(fieldId: string, areaId: string): boolean {
  return getExamBlueprint(fieldId)?.categories.some((category) => category.id === areaId) ?? false;
}

export function blueprintAreaLabel(fieldId: string, areaId: string): string | null {
  return (
    getExamBlueprint(fieldId)?.categories.find((category) => category.id === areaId)?.label ?? null
  );
}

/**
 * Subjects whose blank-clientNeeds questions belong to this area.
 * First blueprint category wins, matching blueprintCategoryIdForQuestion.
 */
export function exclusiveSubjectsForBlueprintCategory(
  fieldId: string,
  areaId: string
): string[] {
  const categories = getExamBlueprint(fieldId)?.categories ?? [];
  const seen = new Set<string>();
  const subjects: string[] = [];
  for (const category of categories) {
    for (const id of [category.id, ...(category.subjectIds ?? [])]) {
      if (!id || seen.has(id)) continue;
      seen.add(id);
      subjects.push(id);
    }
  }
  return subjects.filter(
    (subjectId) =>
      blueprintCategoryIdForQuestion(fieldId, { subjectId, clientNeeds: null }) === areaId
  );
}

/** True when this active question is inside the chip's blueprint area. */
export function questionInBlueprintArea(
  fieldId: string,
  areaId: string,
  source: QuestionAreaSource
): boolean {
  return blueprintCategoryIdForQuestion(fieldId, source) === areaId;
}

/**
 * Prisma filter for the questions a blueprint chip counts.
 * Blank clientNeeds uses the exclusive subject list. An explicit clientNeeds
 * value is that area even when the subject maps elsewhere.
 */
export function activeBlueprintAreaWhere(fieldId: string, areaId: string) {
  const subjects = exclusiveSubjectsForBlueprintCategory(fieldId, areaId);
  const or: Array<Record<string, unknown>> = [{ clientNeeds: areaId }];
  if (subjects.length > 0) {
    or.push({
      AND: [
        { OR: [{ clientNeeds: null }, { clientNeeds: "" }] },
        { subjectId: { in: subjects } },
      ],
    });
  }
  return {
    fieldId,
    active: true as const,
    qaPassed: true as const,
    OR: or,
  };
}

/** Area size from topic counts when every question has a blank clientNeeds. */
export function blueprintAreaCountFromTopics(
  fieldId: string,
  areaId: string,
  topicCounts: Record<string, number>
): number {
  return exclusiveSubjectsForBlueprintCategory(fieldId, areaId).reduce(
    (sum, subjectId) => sum + (topicCounts[subjectId] ?? 0),
    0
  );
}

/**
 * When the area is exactly one topic, the chip and the row are the same pool.
 * Returns that subject id. A broader area returns null so the chip stays an area.
 */
export function blueprintAreaSelectsSingleTopic(input: {
  fieldId: string;
  areaId: string;
  topicCounts: Record<string, number> | null | undefined;
  areaCount: number;
}): string | null {
  const subjects = exclusiveSubjectsForBlueprintCategory(input.fieldId, input.areaId);
  const counted = subjects.filter((id) => (input.topicCounts?.[id] ?? 0) > 0);
  const topicSum = subjects.reduce((sum, id) => sum + (input.topicCounts?.[id] ?? 0), 0);
  if (counted.length === 1 && topicSum === input.areaCount) return counted[0]!;
  return null;
}

/**
 * Extra words for a topic row that shares its name with a larger blueprint area.
 * Null when the row and the area are the same pool.
 */
export function topicRowCountQualifier(input: {
  fieldId: string;
  subjectId: string;
  topicCount: number;
  areaCounts: Record<string, number>;
}): string | null {
  const areaId = blueprintCategoryIdForQuestion(input.fieldId, {
    subjectId: input.subjectId,
    clientNeeds: null,
  });
  if (!areaId || areaId !== input.subjectId) return null;
  const areaCount = input.areaCounts[areaId];
  if (areaCount == null || areaCount === input.topicCount) return null;
  return "in this topic";
}
