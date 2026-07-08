import { getHighYieldTopics } from "@/lib/edtech/seeds";
import { resolveAanpFnpTopicPracticeParams } from "./topic-practice";

export type AanpFnpTopicQaIssue = {
  code: string;
  message: string;
  slug?: string;
};

function auditPracticeAlignment(): AanpFnpTopicQaIssue[] {
  const issues: AanpFnpTopicQaIssue[] = [];
  for (const topic of getHighYieldTopics("aanp-fnp")) {
    const params = resolveAanpFnpTopicPracticeParams(topic);
    if (!params.blueprintTopics?.length) {
      issues.push({
        code: "practice_not_aligned",
        message: `"${topic.slug}" practice resolves to subject-only pool (no blueprint filter)`,
        slug: topic.slug,
      });
    }
  }
  return issues;
}

export function auditAanpFnpTopicIntegration(): AanpFnpTopicQaIssue[] {
  return [...auditPracticeAlignment()];
}

export function runAanpFnpTopicQaGate(): { passed: boolean; issues: AanpFnpTopicQaIssue[] } {
  const issues = auditAanpFnpTopicIntegration();
  return { passed: issues.length === 0, issues };
}
