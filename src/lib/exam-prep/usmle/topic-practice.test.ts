import { describe, expect, it } from "vitest";
import { getHighYieldTopic } from "@/lib/edtech/seeds";
import { highYieldTopicPracticeHref } from "@/lib/edtech/practice-links";
import {
  resolveUsmleTopicFieldId,
  resolveUsmleTopicPracticeParams,
} from "./topic-practice";
import { auditUsmleTopicIntegration, runUsmleTopicQaGate } from "./topic-qa-gate";

describe("USMLE topic practice alignment", () => {
  it("acute-coronary-syndrome practice filters to ACS blueprint slugs on Step 2", () => {
    const topic = getHighYieldTopic("usmle", "acute-coronary-syndrome");
    expect(topic).toBeDefined();
    const params = resolveUsmleTopicPracticeParams(topic!);
    expect(params.fieldId).toBe("usmle-step-2");
    expect(params.subjectId).toBe("cardiology");
    expect(params.blueprintTopics).toContain("acs-management");
    expect(params.blueprintTopics).toContain("acs-pathophysiology");
  });

  it("pharmacology-moa practice routes to Step 1 pharmacology subject", () => {
    const topic = getHighYieldTopic("usmle", "pharmacology-moa")!;
    const params = resolveUsmleTopicPracticeParams(topic);
    expect(params.fieldId).toBe("usmle-step-1");
    expect(params.subjectId).toBe("pharmacology");
    expect(params.blueprintTopics?.length).toBeGreaterThan(0);
  });

  it("ccs-case-management practice routes to Step 3 with CCS blueprint slugs", () => {
    const topic = getHighYieldTopic("usmle", "ccs-case-management")!;
    const params = resolveUsmleTopicPracticeParams(topic);
    expect(params.fieldId).toBe("usmle-step-3");
    expect(params.blueprintTopics).toContain("ccs-initial-workup");
    expect(params.blueprintTopics).toContain("ccs-monitoring-escalation");
  });

  it("2026 granular topic uses its slug as blueprint filter", () => {
    const topic = getHighYieldTopic("usmle", "acs-management")!;
    const params = resolveUsmleTopicPracticeParams(topic);
    expect(params.blueprintTopics).toEqual(["acs-management"]);
    expect(params.fieldId).toBe("usmle-step-2");
  });

  it("highYieldTopicPracticeHref encodes blueprintTopics and field for ACS", () => {
    const topic = getHighYieldTopic("usmle", "acute-coronary-syndrome")!;
    const href = highYieldTopicPracticeHref("usmle", topic, 10);
    const url = new URL(href, "http://localhost");
    expect(url.searchParams.get("field")).toBe("usmle-step-2");
    expect(url.searchParams.get("blueprintTopics")).toContain("acs-management");
    expect(url.searchParams.get("subjectId")).toBe("cardiology");
    expect(url.searchParams.get("usmleTopic")).toBe("acute-coronary-syndrome");
  });

  it("resolveUsmleTopicFieldId maps Step 3 ethics to usmle-step-3", () => {
    const topic = getHighYieldTopic("usmle", "medical-ethics-legal")!;
    expect(resolveUsmleTopicFieldId(topic)).toBe("usmle-step-3");
  });
});

describe("USMLE topic integration QA gate", () => {
  it("passes the consolidated static audit", () => {
    const { passed, issues } = runUsmleTopicQaGate();
    if (!passed) {
      const summary = issues.map((i) => `[${i.code}] ${i.message}`).join("\n");
      expect.fail(`USMLE topic QA failed:\n${summary}`);
    }
    expect(passed).toBe(true);
  });

  it("auditUsmleTopicIntegration returns no issues", () => {
    expect(auditUsmleTopicIntegration()).toEqual([]);
  });
});
