import { describe, expect, it } from "vitest";
import { getHighYieldTopic } from "@/lib/edtech/seeds";
import { highYieldTopicPracticeHref } from "@/lib/edtech/practice-links";
import { resolveNptePtTopicPracticeParams } from "./topic-practice";
import { runNptePtTopicQaGate } from "./topic-qa-gate";

describe("NPTE-PT topic practice alignment", () => {
  it("musculoskeletal practice uses MSK blueprint slugs", () => {
    const topic = getHighYieldTopic("npte-pt", "musculoskeletal")!;
    const params = resolveNptePtTopicPracticeParams(topic);
    expect(params.subjectId).toBe("musculoskeletal");
    expect(params.blueprintTopics).toContain("rotator-cuff-impingement");
  });

  it("highYieldTopicPracticeHref encodes nptePtTopic", () => {
    const topic = getHighYieldTopic("npte-pt", "musculoskeletal")!;
    const href = highYieldTopicPracticeHref("npte-pt", topic, 10);
    const url = new URL(href, "http://localhost");
    expect(url.searchParams.get("nptePtTopic")).toBe("musculoskeletal");
    expect(url.searchParams.get("blueprintTopics")).toContain("rotator-cuff-impingement");
  });

  it("passes the consolidated static audit", () => {
    const { passed, issues } = runNptePtTopicQaGate();
    if (!passed) {
      expect.fail(issues.map((i) => i.message).join("\n"));
    }
    expect(passed).toBe(true);
  });
});
