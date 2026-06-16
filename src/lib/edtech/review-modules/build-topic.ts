import type { ExamSlug, HighYieldTopic } from "@/types/edtech";
import type { ReviewModuleContent, ReviewModuleSectionId } from "./types";
import { getReviewModuleAnatomy } from "@/lib/anatomy/review-module-anatomy";

function section(
  content: ReviewModuleContent,
  id: ReviewModuleSectionId
): ReviewModuleContent["sections"][number] | undefined {
  return content.sections.find((s) => s.id === id);
}

/** Map review module sections onto legacy HighYieldTopic fields for search/fallback. */
function legacyFieldsFromModule(content: ReviewModuleContent): Pick<
  HighYieldTopic,
  "summary" | "keyConcepts" | "mustKnowFacts" | "pearls" | "pitfalls"
> {
  const why = section(content, "why-it-matters");
  const core = section(content, "core-concepts");
  const apps = section(content, "clinical-applications");
  const traps = section(content, "misconceptions");
  const pearlsSec = section(content, "pearls");
  const summary = section(content, "quick-summary");

  return {
    summary: [...(why?.paragraphs ?? []), ...(core?.paragraphs ?? [])].join("\n\n"),
    keyConcepts: core?.bullets ?? [],
    mustKnowFacts: apps?.bullets ?? summary?.bullets ?? [],
    pearls: pearlsSec?.bullets ?? [],
    pitfalls: traps?.bullets ?? [],
  };
}

export function defineReviewModuleTopic(input: {
  examSlug: ExamSlug;
  slug: string;
  title: string;
  overview: string;
  practiceTopicSlug: string;
  reviewModule: ReviewModuleContent;
  sortOrder?: number;
}): HighYieldTopic {
  const legacy = legacyFieldsFromModule(input.reviewModule);
  const anatomy = getReviewModuleAnatomy(input.slug);
  return {
    id: `${input.examSlug}-${input.slug}`,
    examSlug: input.examSlug,
    slug: input.slug,
    category: "Review Modules",
    title: input.title,
    overview: input.overview,
    ...legacy,
    sortOrder: input.sortOrder ?? 0,
    practiceTopicSlug: input.practiceTopicSlug,
    relatedStructureIds: anatomy?.structureIds,
    reviewModule: input.reviewModule,
  };
}
