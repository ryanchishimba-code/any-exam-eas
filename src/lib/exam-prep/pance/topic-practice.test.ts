import { describe, expect, it } from "vitest";
import { getHighYieldTopic } from "@/lib/edtech/seeds";
import { highYieldTopicPracticeHref } from "@/lib/edtech/practice-links";
import { resolvePanceTopicPracticeParams } from "./topic-practice";
import { runPanceTopicQaGate } from "./topic-qa-gate";

describe("PANCE topic practice alignment", () => {
  it("cardiovascular practice filters to ACS blueprint labels", () => {
    const topic = getHighYieldTopic("pance", "cardiovascular")!;
    const params = resolvePanceTopicPracticeParams(topic);
    expect(params.subjectId).toBe("cardiovascular");
    expect(params.blueprintTopics).toContain("ACS");
  });

  it("highYieldTopicPracticeHref encodes blueprintTopics for cardiovascular", () => {
    const topic = getHighYieldTopic("pance", "cardiovascular")!;
    const href = highYieldTopicPracticeHref("pance", topic, 10);
    const url = new URL(href, "http://localhost");
    expect(url.searchParams.get("blueprintTopics")).toContain("ACS");
    expect(url.searchParams.get("panceTopic")).toBe("cardiovascular");
  });

  it("passes the consolidated static audit", () => {
    const { passed, issues } = runPanceTopicQaGate();
    if (!passed) {
      expect.fail(issues.map((i) => i.message).join("\n"));
    }
    expect(passed).toBe(true);
  });
});
