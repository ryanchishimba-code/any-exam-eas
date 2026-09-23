import type { ConceptMasterySnapshot, RemediationRecommendation } from "./types";
import { mistakeCategoryLabel } from "./mistake-analysis";
import type { MistakeCategory } from "./types";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { practiceTopicHref } from "@/lib/edtech/practice-links-core";
import { getExamTopicStudyLinks } from "@/lib/library/exam-topic-bridge";
import {
  resolveRelatedCards,
  resolveRelatedDrug,
  resolveStudyGuideSection,
} from "@/lib/learning/remediation-loop";
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

  if (!params.correct && examSlug) {
    const guide = resolveStudyGuideSection(examSlug, [
      params.subjectId,
      topicForLinks,
      ...params.weakConcepts,
    ]);
    if (guide) {
      recs.push({
        type: "foundational_review",
        title: `Study guide — ${guide.title}`,
        description: "Guide section matched to this miss.",
        href: guide.href,
        priority: 0,
      });
    }
    const drug = resolveRelatedDrug({
      examSlug,
      topicKeys: [params.subjectId, topicForLinks, ...params.weakConcepts],
    });
    if (drug) {
      const onPath = drug.href.includes("path=safety");
      recs.push({
        type: "foundational_review",
        title: onPath
          ? `Safety path — ${drug.label}`
          : drug.kind === "class"
            ? `Drug class — ${drug.label}`
            : `Related drug — ${drug.label}`,
        description: onPath
          ? "Opens this drug on the curated safety path."
          : drug.kind === "class"
            ? "Drug class tied to this topic."
            : "Drug card tied to this topic.",
        href: drug.href,
        priority: 1,
      });
      if (drug.safetyPathHref) {
        recs.push({
          type: "foundational_review",
          title: "Drug safety path",
          description: "Five high-alert drugs, in a fixed order.",
          href: drug.safetyPathHref,
          priority: 1,
        });
      }
    }
    const cards = resolveRelatedCards(examSlug, [params.subjectId, topicForLinks]);
    if (cards) {
      recs.push({
        type: "foundational_review",
        title: cards.title,
        description: "Library cards for this topic.",
        href: cards.href,
        priority: 2,
      });
    }
  }

  if (!params.correct && deepDive && examSlug && topicForLinks) {
    recs.push({
      type: "foundational_review",
      title: "Study this topic — deep dive",
      description: "Eight-section review module matched to this question.",
      href: deepDive,
      priority: 3,
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
      priority: 4,
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
        priority: 5,
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
        priority: 6,
      });
    }
  }

  if (!params.correct && params.mistakeCategory) {
    recs.push({
      type: "foundational_review",
      title: `${mistakeCategoryLabel(params.mistakeCategory)} review`,
      description: "Topic-focused question bank session on this reasoning pattern.",
      href: `${ROUTES.questionBank}?${fieldQ}${subjectParam}`,
      priority: 7,
    });
  }

  if (params.weakConcepts.length > 0 || params.weakest.length > 0) {
    recs.push({
      type: "weak_area_quiz",
      title: "Topic practice",
      description: "Flexible question bank session on your weak areas.",
      href: `${ROUTES.questionBank}?${fieldQ}${subjectParam}`,
      priority: 8,
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
    priority: 9,
  });

  return recs.sort((a, b) => a.priority - b.priority);
}
