import { describe, expect, it } from "vitest";
import { getHighYieldTopic } from "@/lib/edtech/seeds";
import { highYieldTopicPracticeHref } from "@/lib/edtech/practice-links";
import { resolveNclexTopicPracticeParams } from "./topic-practice";
import { auditNclexTopicIntegration, runNclexTopicQaGate } from "./topic-qa-gate";

describe("NCLEX topic practice alignment", () => {
  it("electrolytes practice filters to fluid-balance-io blueprint", () => {
    const topic = getHighYieldTopic("nclex", "electrolytes");
    expect(topic).toBeDefined();
    const params = resolveNclexTopicPracticeParams(topic!);
    expect(params.subjectId).toBe("physiological-adaptation");
    expect(params.blueprintTopics).toContain("fluid-balance-io");
    expect(params.nclexPreset).toBe("electrolytes-block");
  });

  it("infection-control practice filters to infection blueprint slugs", () => {
    const topic = getHighYieldTopic("nclex", "infection-control");
    expect(topic).toBeDefined();
    const params = resolveNclexTopicPracticeParams(topic!);
    expect(params.blueprintTopics?.length).toBeGreaterThan(0);
    expect(params.blueprintTopics).toContain("standard-precautions-hand-hygiene");
  });

  it("sata-mastery uses NGN preset practice", () => {
    const topic = getHighYieldTopic("nclex", "sata-mastery");
    expect(topic).toBeDefined();
    const params = resolveNclexTopicPracticeParams(topic!);
    expect(params.nclexPreset).toBe("sata-mastery");
  });

  it("pediatrics practice uses peds-block preset on pediatrics-nursing subject", () => {
    const topic = getHighYieldTopic("nclex", "pediatrics");
    expect(topic).toBeDefined();
    const params = resolveNclexTopicPracticeParams(topic!);
    expect(params.subjectId).toBe("pediatrics-nursing");
    expect(params.nclexPreset).toBe("peds-block");
    expect(params.blueprintTopics).toContain("pediatric-milestones");
    expect(params.blueprintTopics).not.toContain("menopause-aging");
  });

  it("renal topic pulls from physiological-adaptation subject", () => {
    const topic = getHighYieldTopic("nclex", "renal")!;
    const params = resolveNclexTopicPracticeParams(topic);
    expect(params.subjectId).toBe("physiological-adaptation");
    expect(params.blueprintTopics).toContain("renal-urinary");
    expect(params.nclexPreset).toBeUndefined();
  });

  it("chemotherapy-toxicity filters to chemo blueprint only (not NG tube)", () => {
    const topic = getHighYieldTopic("nclex", "chemotherapy-toxicity")!;
    const params = resolveNclexTopicPracticeParams(topic);
    expect(params.subjectId).toBe("reduction-risk");
    expect(params.blueprintTopics).toEqual(["chemotherapy-side-effects"]);
    expect(params.blueprintTopics).not.toContain("ng-feeding-tube");
  });

  it("heme-oncology filters to hematology-oncology blueprint", () => {
    const topic = getHighYieldTopic("nclex", "heme-oncology")!;
    const params = resolveNclexTopicPracticeParams(topic);
    expect(params.subjectId).toBe("physiological-adaptation");
    expect(params.blueprintTopics).toEqual(["hematology-oncology"]);
  });

  it("infection-control skips foundation-review preset when blueprints exist", () => {
    const topic = getHighYieldTopic("nclex", "infection-control")!;
    const params = resolveNclexTopicPracticeParams(topic);
    expect(params.nclexPreset).toBeUndefined();
    expect(params.blueprintTopics?.length).toBeGreaterThan(0);
  });

  it("highYieldTopicPracticeHref encodes blueprintTopics for electrolytes", () => {
    const topic = getHighYieldTopic("nclex", "electrolytes")!;
    const href = highYieldTopicPracticeHref("nclex", topic, 10);
    const url = new URL(href, "http://localhost");
    expect(url.searchParams.get("blueprintTopics")).toContain("fluid-balance-io");
    expect(url.searchParams.get("subjectId")).toBe("physiological-adaptation");
    expect(url.searchParams.get("nclexPreset")).toBe("electrolytes-block");
  });
});

describe("NCLEX topic integration QA gate", () => {
  it("passes the consolidated static audit", () => {
    const { passed, issues } = runNclexTopicQaGate();
    if (!passed) {
      const summary = issues.map((i) => `[${i.code}] ${i.message}`).join("\n");
      expect.fail(`NCLEX topic QA failed:\n${summary}`);
    }
    expect(passed).toBe(true);
  });

  it("auditNclexTopicIntegration returns no issues", () => {
    expect(auditNclexTopicIntegration()).toEqual([]);
  });
});
