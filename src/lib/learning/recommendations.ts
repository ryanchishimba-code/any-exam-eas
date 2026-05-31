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
      description: "Short tutor-mode block on this reasoning pattern.",
      href: `/study/practice?mode=practice&${fieldQ}${subjectParam}`,
      priority: 1,
    });
  }

  if (params.weakConcepts.length > 0 || params.weakest.length > 0) {
    recs.push({
      type: "weak_area_quiz",
      title: "Weak-area drill",
      description: "Questions prioritized from your lowest mastery tags.",
      href: `/study/practice?mode=weak&${fieldQ}${subjectParam}`,
      priority: 2,
    });
  }

  recs.push({
    type: "retry_questions",
    title: "Retry missed items",
    description: "Spaced re-exposure to questions you missed recently.",
    href: `/study/practice?mode=adaptive&${fieldQ}${subjectParam}`,
    priority: 3,
  });

  recs.push({
    type: "timed_practice",
    title: "Timed pressure set",
    description: "Timed practice pacing with per-question clock.",
    href: `/study/practice?mode=timed&${fieldQ}${subjectParam}`,
    priority: 4,
  });

  recs.push({
    type: "mock_exam",
    title: "Mock board block",
    description: "Full mixed-topic AI practice exam with analytics. Verify content independently.",
    href: `/generate?${fieldQ}`,
    priority: 5,
  });

  return recs.sort((a, b) => a.priority - b.priority);
}
