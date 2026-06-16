import type { ExamSlug } from "@/lib/exams/catalog";
import { getExamBlueprint } from "@/lib/engine/blueprints";

export function blueprintTopicsForExam(examType: ExamSlug): {
  slug: string;
  label: string;
  description?: string;
  sortOrder: number;
}[] {
  const fieldMap: Record<ExamSlug, string> = {
    nclex: "nursing",
    usmle: "usmle-step-2",
    naplex: "pharmacy",
    pance: "pance",
    "aanp-fnp": "aanp-fnp",
    top500: "drugs300",
  };
  const blueprint = getExamBlueprint(fieldMap[examType]);
  if (!blueprint) {
    return [
      { slug: "general", label: "General review", sortOrder: 0 },
    ];
  }
  return blueprint.categories.map((c, i) => ({
    slug: c.id,
    label: c.label,
    description: c.highYieldTopics?.slice(0, 3).join(", "),
    sortOrder: i,
  }));
}
