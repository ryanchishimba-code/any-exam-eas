/**
 * NPTE-PT blueprint reference data — DB-backed categories, topics, and question helpers.
 */
import { prisma } from "@/lib/prisma";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import { NPTE_PT_TASK_CATEGORIES } from "@/lib/edtech/learning-hub/npte-pt-learning-paths";

export type NptePtBlueprintCategoryRow = {
  slug: string;
  kind: "content" | "task";
  label: string;
  weight: number;
  sortOrder: number;
  description?: string | null;
};

export type NptePtTopicRow = {
  slug: string;
  label: string;
  contentCategory?: string | null;
  taskCategory?: string | null;
  subjectId?: string | null;
  reviewModuleSlug?: string | null;
  sortOrder: number;
};

/** Load content + task categories from DB (falls back to in-code blueprint). */
export async function loadNptePtBlueprintCategories(): Promise<NptePtBlueprintCategoryRow[]> {
  try {
    const rows = await prisma.npte-ptBlueprintCategory.findMany({
      orderBy: [{ kind: "asc" }, { sortOrder: "asc" }],
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        slug: r.slug,
        kind: r.kind as "content" | "task",
        label: r.label,
        weight: r.weight,
        sortOrder: r.sortOrder,
        description: r.description,
      }));
    }
  } catch {
    /* table may not exist yet */
  }
  return fallbackBlueprintCategories();
}

export async function loadNptePtTopics(subjectId?: string): Promise<NptePtTopicRow[]> {
  try {
    const rows = await prisma.npte-ptTopic.findMany({
      where: subjectId ? { subjectId } : undefined,
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        slug: r.slug,
        label: r.label,
        contentCategory: r.contentCategory,
        taskCategory: r.taskCategory,
        subjectId: r.subjectId,
        reviewModuleSlug: r.reviewModuleSlug,
        sortOrder: r.sortOrder,
      }));
    }
  } catch {
    /* table may not exist yet */
  }
  return [];
}

function fallbackBlueprintCategories(): NptePtBlueprintCategoryRow[] {
  const blueprint = getExamBlueprint("npte-pt");
  const content =
    blueprint?.categories.map((c, i) => ({
      slug: c.id,
      kind: "content" as const,
      label: c.label,
      weight: c.weight,
      sortOrder: i,
      description: c.highYieldTopics?.join(", ") ?? null,
    })) ?? [];
  const tasks = NPTE_PT_TASK_CATEGORIES.map((t, i) => ({
    slug: t.id,
    kind: "task" as const,
    label: t.label,
    weight: t.weight,
    sortOrder: 20 + i,
    description: null,
  }));
  return [...content, ...tasks];
}

/** Resolve Deep Dive slug for a question's topic + subject. */
export async function resolveNptePtDeepDiveSlug(params: {
  subjectId?: string;
  blueprintTopic?: string;
  reviewModuleSlug?: string;
}): Promise<string | undefined> {
  if (params.reviewModuleSlug) return params.reviewModuleSlug;
  const topics = await loadNptePtTopics(params.subjectId);
  if (params.blueprintTopic) {
    const norm = params.blueprintTopic.toLowerCase().replace(/\s+/g, "-");
    const match = topics.find(
      (t) => t.slug === norm || t.label.toLowerCase().includes(params.blueprintTopic!.toLowerCase())
    );
    if (match?.reviewModuleSlug) return match.reviewModuleSlug;
  }
  const fallback = topics.find((t) => t.reviewModuleSlug)?.reviewModuleSlug;
  return fallback ?? undefined;
}
