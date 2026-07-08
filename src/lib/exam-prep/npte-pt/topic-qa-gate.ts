import { getHighYieldTopics } from "@/lib/edtech/seeds";
import { resolveNptePtTopicPracticeParams } from "./topic-practice";

export type NptePtTopicQaIssue = {
  code: string;
  message: string;
  slug?: string;
};

function auditPracticeAlignment(): NptePtTopicQaIssue[] {
  const issues: NptePtTopicQaIssue[] = [];
  for (const topic of getHighYieldTopics("npte-pt")) {
    const params = resolveNptePtTopicPracticeParams(topic);
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

export function auditNptePtTopicIntegration(): NptePtTopicQaIssue[] {
  return [...auditPracticeAlignment()];
}

export function runNptePtTopicQaGate(): { passed: boolean; issues: NptePtTopicQaIssue[] } {
  const issues = auditNptePtTopicIntegration();
  return { passed: issues.length === 0, issues };
}
