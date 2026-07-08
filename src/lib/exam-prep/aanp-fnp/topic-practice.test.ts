import { describe, expect, it } from "vitest";
import { getHighYieldTopic } from "@/lib/edtech/seeds";
import { highYieldTopicPracticeHref } from "@/lib/edtech/practice-links";
import { resolveAanpFnpTopicPracticeParams } from "./topic-practice";
import { runAanpFnpTopicQaGate } from "./topic-qa-gate";

describe("AANP FNP topic practice alignment", () => {
  it("assess domain practice uses assess subject and blueprint slugs", () => {
    const topic = getHighYieldTopic("aanp-fnp", "aanp-assess-domain")!;
    const params = resolveAanpFnpTopicPracticeParams(topic);
    expect(params.subjectId).toBe("assess");
    expect(params.blueprintDomain).toBe("assess");
    expect(params.blueprintTopics?.length).toBeGreaterThan(10);
  });

  it("system cardiovascular module uses cardiovascular subject", () => {
    const topic = getHighYieldTopic("aanp-fnp", "aanp-system-cardiovascular")!;
    const params = resolveAanpFnpTopicPracticeParams(topic);
    expect(params.subjectId).toBe("cardiovascular");
    expect(params.clinicalSystem).toBe("cardiovascular");
  });

  it("highYieldTopicPracticeHref encodes aanpFnpTopic", () => {
    const topic = getHighYieldTopic("aanp-fnp", "aanp-plan-domain")!;
    const href = highYieldTopicPracticeHref("aanp-fnp", topic, 10);
    const url = new URL(href, "http://localhost");
    expect(url.searchParams.get("aanpFnpTopic")).toBe("aanp-plan-domain");
    expect(url.searchParams.get("blueprintTopics")?.length).toBeGreaterThan(0);
  });

  it("passes the consolidated static audit", () => {
    const { passed, issues } = runAanpFnpTopicQaGate();
    if (!passed) {
      expect.fail(issues.map((i) => i.message).join("\n"));
    }
    expect(passed).toBe(true);
  });
});
