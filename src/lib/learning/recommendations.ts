import type { ConceptMasterySnapshot, RemediationRecommendation } from "./types";
import { mistakeCategoryLabel } from "./mistake-analysis";
import type { MistakeCategory } from "./types";

export function buildRemediationRecommendations(params: {
  fieldId: string;
  subjectId?: string;
  correct: boolean;
  mistakeCategory?: MistakeCategory;
  weakConcepts: string[];
  weakest: ConceptMasterySnapshot[];
}): RemediationRecommendation[] {
  const recs: RemediationRecommendation[] = [];
  const subjectParam = params.subjectId
    ? `&subjectId=${encodeURIComponent(params.subjectId)}`
    : "";
  const fieldQ = `field=${encodeURIComponent(params.fieldId)}`;

  if (!params.correct && params.mistakeCategory) {
    recs.push({
      type: "foundational_review",
      title: `${mistakeCategoryLabel(params.mistakeCategory)} review`,
      description: "Topic-focused question bank session on this reasoning pattern.",
      href: `/study/practice?mode=bank&${fieldQ}${subjectParam}`,
      priority: 1,
    });
  }

  if (params.weakConcepts.length > 0 || params.weakest.length > 0) {
    recs.push({
      type: "weak_area_quiz",
      title: "Topic practice",
      description: "Flexible question bank session on your weak areas.",
      href: `/study/practice?mode=bank&${fieldQ}${subjectParam}`,
      priority: 2,
    });
  }

  recs.push({
    type: "timed_practice",
    title: "Timed exam",
    description: "Full exam-length simulation with mixed topics at real board counts.",
    href: `/study/practice?mode=timed&${fieldQ}`,
    priority: 3,
  });

  return recs;
}
