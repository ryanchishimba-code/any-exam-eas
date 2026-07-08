import { getHighYieldTopics } from "@/lib/edtech/seeds";
import { resolvePanceTopicPracticeParams } from "./topic-practice";

export type PanceTopicQaIssue = {
  code: string;
  message: string;
  slug?: string;
};

function auditPracticeAlignment(): PanceTopicQaIssue[] {
  const issues: PanceTopicQaIssue[] = [];
  for (const topic of getHighYieldTopics("pance")) {
    const params = resolvePanceTopicPracticeParams(topic);
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

export function auditPanceTopicIntegration(): PanceTopicQaIssue[] {
  return [...auditPracticeAlignment()];
}

export function runPanceTopicQaGate(): { passed: boolean; issues: PanceTopicQaIssue[] } {
  const issues = auditPanceTopicIntegration();
  return { passed: issues.length === 0, issues };
}
