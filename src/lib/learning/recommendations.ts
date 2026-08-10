import type { ConceptMasterySnapshot, RemediationRecommendation } from "./types";
import { mistakeCategoryLabel } from "./mistake-analysis";
import type { MistakeCategory } from "./types";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { practiceTopicHref } from "@/lib/edtech/practice-links-core";
import { getExamTopicStudyLinks } from "@/lib/library/exam-topic-bridge";
import { ROUTES, fullExamHref } from "@/lib/routes";
import { getNclexStudyPreset, nclexPresetPracticeHref } from "@/lib/exam-prep/nclex/study-presets";

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
  const examSlug = examSlugFromFieldId(params.fieldId);

  const topicForLinks = params.subjectId ?? params.weakConcepts[0] ?? params.weakest[0]?.conceptKey;
  const deepDive =
    examSlug && topicForLinks
      ? getExamTopicStudyLinks(examSlug, topicForLinks).deepDiveHref
      : undefined;

  if (!params.correct && deepDive && examSlug && topicForLinks) {
    recs.push({
      type: "foundational_review",
      title: "Study this topic — deep dive",
      description: "Eight-section review module matched to this question.",
      href: deepDive,
      priority: 0,
    });
  }

  // Closed miss→retest loop: same topic, wheel-size block, autostart.
  if (!params.correct && examSlug && topicForLinks) {
    const retestHref = `${practiceTopicHref(examSlug, topicForLinks, 25)}&autostart=1`;
    recs.push({
      type: "retry_questions",
      title: "Retest this topic (25Q)",
      description: "Short block on the same subject — lock in the fix.",
      href: retestHref,
      priority: 1,
    });
  }

  if (!params.correct && examSlug === "nclex" && params.subjectId === "management-of-care") {
    const preset = getNclexStudyPreset("prioritization-workshop");
    if (preset) {
      recs.push({
        type: "weak_area_quiz",
        title: "Prioritization workshop (25Q)",
        description: "ABC triage block matched to this miss.",
        href: nclexPresetPracticeHref("nclex", preset),
        priority: 2,
      });
    }
  }

  if (!params.correct && examSlug === "nclex") {
    const trap = getNclexStudyPreset("trap-tier-drill");
    if (trap) {
      recs.push({
        type: "weak_area_quiz",
        title: "Trap-tier drill",
        description: "Practice FIRST/MOST/BEST elimination on similar items.",
        href: nclexPresetPracticeHref("nclex", trap),
        priority: 3,
      });
    }
  }

  if (!params.correct && params.mistakeCategory) {
    recs.push({
      type: "foundational_review",
      title: `${mistakeCategoryLabel(params.mistakeCategory)} review`,
      description: "Topic-focused question bank session on this reasoning pattern.",
      href: `${ROUTES.questionBank}?${fieldQ}${subjectParam}`,
      priority: 4,
    });
  }

  if (params.weakConcepts.length > 0 || params.weakest.length > 0) {
    recs.push({
      type: "weak_area_quiz",
      title: "Topic practice",
      description: "Flexible question bank session on your weak areas.",
      href: `${ROUTES.questionBank}?${fieldQ}${subjectParam}`,
      priority: 5,
    });
  }

  recs.push({
    type: "timed_practice",
    title: "Timed exam",
    description: "Full exam-length simulation with mixed topics at real board counts.",
    href: (() => {
      const slug = examSlugFromFieldId(params.fieldId);
      return slug ? fullExamHref(slug) : ROUTES.fullExam;
    })(),
    priority: 6,
  });

  return recs.sort((a, b) => a.priority - b.priority);
}
