import { spacedReviewHref } from "@/lib/edtech/practice-links";
import { practiceTopicHref } from "@/lib/edtech/practice-links-core";
import { getExamTopicStudyLinks, getWeakTopicsFromBreakdown } from "@/lib/library/exam-topic-bridge";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamResultsAnalysis, FullExamTopicBreakdown } from "@/types/full-exam";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

export type FullExamInsightAction = {
  label: string;
  href: string;
  description: string;
  priority: "high" | "medium";
};

export type FullExamInsights = {
  headline: string;
  subline: string;
  weakTopics: FullExamTopicBreakdown[];
  actions: FullExamInsightAction[];
  missedCount: number;
  flaggedCount: number;
};

function performanceHeadline(score: number): { headline: string; subline: string } {
  if (score >= 85) {
    return {
      headline: "Strong exam performance",
      subline: "You're board-ready on most domains — polish weak spots with targeted review.",
    };
  }
  if (score >= 70) {
    return {
      headline: "Solid foundation — room to grow",
      subline: "Focus your next sessions on the topics below to lift your score quickly.",
    };
  }
  return {
    headline: "Build momentum with focused practice",
    subline: "Review missed items, then drill your weakest blueprint areas in short sessions.",
  };
}

/** Post-exam learner insights with actionable next steps. */
export function buildFullExamInsights(
  examSlug: ExamSlug,
  score: number,
  analysis: FullExamResultsAnalysis,
  answers: ExamAnswerRecord[]
): FullExamInsights {
  const weakTopics = getWeakTopicsFromBreakdown(analysis.topicBreakdown, 70).slice(0, 5);
  const missedCount = answers.filter((a) => !a.correct).length;
  const flaggedCount = answers.filter((a) => a.flagged).length;
  const isCat = Boolean(analysis.catOutcome);

  const { headline, subline } = isCat
    ? {
        headline: "Practice CAT complete — focus weak areas",
        subline:
          analysis.catOutcome?.practiceBand.hint ??
          "Use the practice band below as a study guide, not a pass prediction.",
      }
    : performanceHeadline(score);

  const actions: FullExamInsightAction[] = [];
  const practiceCount = isCat ? 25 : 10;

  if (missedCount > 0) {
    const topWeak = weakTopics[0];
    if (topWeak) {
      const links = getExamTopicStudyLinks(examSlug, topWeak.topic);
      const href = `${practiceTopicHref(examSlug, links.topicKey, practiceCount)}${
        isCat ? "&autostart=1" : ""
      }`;
      actions.push({
        label: `Practice ${topWeak.topic} (${practiceCount}Q)`,
        href,
        description: `${topWeak.pct}% on this topic — targeted drill`,
        priority: "high",
      });
    }
    actions.push({
      label: "Spaced review queue",
      href: spacedReviewHref(examSlug, Math.min(20, Math.max(10, missedCount))),
      description: "Prioritize due and weak items from your SRS queue",
      priority: "high",
    });
  }

  for (const row of weakTopics.slice(0, 3)) {
    const links = getExamTopicStudyLinks(examSlug, row.topic);
    const href = `${practiceTopicHref(examSlug, links.topicKey, practiceCount)}${
      isCat ? "&autostart=1" : ""
    }`;
    actions.push({
      label: row.topic,
      href,
      description: `${row.correct}/${row.total} correct (${row.pct}%)`,
      priority: row.pct < 50 ? "high" : "medium",
    });
  }

  return {
    headline,
    subline,
    weakTopics,
    actions,
    missedCount,
    flaggedCount,
  };
}
