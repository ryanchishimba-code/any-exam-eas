import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  buildSessionConfig,
  parseFullExamLengthPreset,
  resolveChosenLengthPreset,
  resolveLengthPresetFromQuestionCount,
  resolveNclexCatEnabled,
  resolveStartLengthPreset,
} from "./config";
import { EXAM_SLUGS } from "@/lib/edtech/exams";
import { CAT_MAX_QUESTIONS, NCLEX_CAT_TIME_LIMIT_SEC } from "@/lib/questions/cat-engine";

describe("buildSessionConfig", () => {
  it("uses length wheel counts for 50/100 sprints on every board", () => {
    for (const slug of EXAM_SLUGS) {
      expect(buildSessionConfig(slug, "100", false).questionCount).toBe(100);
      expect(buildSessionConfig(slug, "100", true).adaptive).toBe(false);
      expect(buildSessionConfig(slug, "50", true).questionCount).toBe(50);
      expect(buildSessionConfig(slug, "50", true).adaptive).toBe(false);
    }
  });

  it("keeps a chosen sprint shorter than that board's full-length clock", () => {
    const cases = [
      { slug: "naplex" as const, full: 225 },
      { slug: "pance" as const, full: 300 },
      { slug: "aanp-fnp" as const, full: 135 },
      { slug: "npte-pt" as const, full: 250 },
    ];
    for (const exam of cases) {
      const sprint = buildSessionConfig(exam.slug, "50", true);
      const full = buildSessionConfig(exam.slug, "full", true);
      expect(sprint.questionCount).toBe(50);
      expect(sprint.timeLimitSec).toBeGreaterThan(0);
      expect(sprint.timeLimitSec).toBeLessThan(full.timeLimitSec);
      expect(full.questionCount).toBe(exam.full);
    }

    const step1Sprint = buildSessionConfig("usmle", "50", true, { fieldId: "usmle-step-1" });
    const step1Full = buildSessionConfig("usmle", "full", true, { fieldId: "usmle-step-1" });
    expect(step1Sprint.questionCount).toBe(50);
    expect(step1Sprint.lengthPreset).toBe("50");
    expect(step1Sprint.timeLimitSec).toBe(4500);
    expect(step1Full.questionCount).toBe(280);
    expect(step1Full.timeLimitSec).toBe(7 * 60 * 60);
    expect(step1Sprint.timeLimitSec).toBeLessThan(step1Full.timeLimitSec);

    const step3Sprint = buildSessionConfig("usmle", "50", true, { fieldId: "usmle-step-3" });
    const step3Full = buildSessionConfig("usmle", "full", true, { fieldId: "usmle-step-3" });
    expect(step3Full.questionCount).toBe(200);
    expect(step3Sprint.questionCount).toBe(50);
    expect(step3Sprint.timeLimitSec).toBeLessThan(step3Full.timeLimitSec);
  });

  it("uses catalog full-length counts for full mocks", () => {
    expect(buildSessionConfig("naplex", "full", true).questionCount).toBe(225);
    expect(buildSessionConfig("pance", "full", true).questionCount).toBe(300);
    expect(buildSessionConfig("aanp-fnp", "full", true).questionCount).toBe(135);
    expect(buildSessionConfig("npte-pt", "full", true).questionCount).toBe(250);
    expect(buildSessionConfig("usmle", "full", true).questionCount).toBe(280);
    expect(
      buildSessionConfig("usmle", "full", true, { fieldId: "usmle-step-3" }).questionCount
    ).toBe(200);
  });

  it("enables adaptive mix for full-length non-NCLEX exams", () => {
    expect(buildSessionConfig("naplex", "full", true).adaptive).toBe(true);
  });

  it("defaults NCLEX full-length to practice CAT (85–150, 5h)", () => {
    const cfg = buildSessionConfig("nclex", "full", true);
    expect(cfg.adaptive).toBe(true);
    expect(cfg.nclexCat).toBe(true);
    expect(cfg.questionCount).toBe(CAT_MAX_QUESTIONS);
    expect(cfg.timeLimitSec).toBe(NCLEX_CAT_TIME_LIMIT_SEC);
  });

  it("allows fixed 85 NCLEX when CAT is explicitly disabled", () => {
    const cfg = buildSessionConfig("nclex", "full", true, { nclexCat: false });
    expect(cfg.nclexCat).toBe(false);
    expect(cfg.adaptive).toBe(false);
    expect(cfg.questionCount).toBe(85);
    expect(cfg.timeLimitSec).toBe(5 * 60 * 60); // 300 min catalog base for 85Q
  });

  it("prefeches CAT_MAX pool when nclexCat is set (supports early stop)", () => {
    expect(buildSessionConfig("nclex", "full", true, { nclexCat: true }).questionCount).toBe(
      CAT_MAX_QUESTIONS
    );
    expect(
      buildSessionConfig("nclex", "full", true, { nclexCat: true, nclexLength: "maximum" })
        .questionCount
    ).toBe(CAT_MAX_QUESTIONS);
  });
});

describe("resolveNclexCatEnabled", () => {
  it("defaults full to CAT and keeps sprints fixed unless opted in", () => {
    expect(resolveNclexCatEnabled("full")).toBe(true);
    expect(resolveNclexCatEnabled("full", false)).toBe(false);
    expect(resolveNclexCatEnabled("50")).toBe(false);
    expect(resolveNclexCatEnabled("50", true)).toBe(true);
  });
});

describe("resolveChosenLengthPreset", () => {
  const options = [{ preset: "50" as const }, { preset: "100" as const }, { preset: "full" as const }];

  it("keeps a chosen 50 when the deep link still says full", () => {
    expect(
      resolveChosenLengthPreset({
        options,
        chosen: "50",
        initialMode: "full",
        fallback: "full",
      })
    ).toBe("50");
  });

  it("uses the deep link only before the student chooses", () => {
    expect(
      resolveChosenLengthPreset({
        options,
        chosen: null,
        initialMode: "full",
        fallback: "50",
      })
    ).toBe("full");
  });
});

describe("resolveStartLengthPreset", () => {
  it("uses the sent question count when lengthPreset is a stale full", () => {
    expect(
      resolveStartLengthPreset({
        examSlug: "usmle",
        fieldId: "usmle-step-1",
        lengthPreset: "full",
        questionCount: 50,
      })
    ).toBe("50");
    expect(
      resolveStartLengthPreset({
        examSlug: "naplex",
        lengthPreset: "full",
        questionCount: 50,
      })
    ).toBe("50");
    expect(
      resolveStartLengthPreset({
        examSlug: "nclex",
        lengthPreset: "full",
        questionCount: 100,
      })
    ).toBe("100");
  });

  it("maps a Step 3 full count back to full", () => {
    expect(
      resolveStartLengthPreset({
        examSlug: "usmle",
        fieldId: "usmle-step-3",
        lengthPreset: "50",
        questionCount: 200,
      })
    ).toBe("full");
  });
});

describe("full exam index does not force full length", () => {
  it("forwards an explicit mode and does not invent mode=full", () => {
    const page = readFileSync(
      new URL("../../app/(app)/full-exam/page.tsx", import.meta.url),
      "utf8"
    );
    expect(page).not.toContain('sp.mode ?? "full"');
    expect(page).toContain("if (sp.mode) qs.set(\"mode\", sp.mode)");
  });
});

describe("parseFullExamLengthPreset", () => {
  it("parses sprint and full presets", () => {
    expect(parseFullExamLengthPreset("50")).toBe("50");
    expect(parseFullExamLengthPreset("100q")).toBe("100");
    expect(parseFullExamLengthPreset("full-length")).toBe("full");
    expect(parseFullExamLengthPreset("")).toBe("50");
  });
});

describe("resolveLengthPresetFromQuestionCount", () => {
  it("maps sprint counts for every board", () => {
    for (const slug of EXAM_SLUGS) {
      expect(resolveLengthPresetFromQuestionCount(slug, 50)).toBe("50");
      expect(resolveLengthPresetFromQuestionCount(slug, 100)).toBe("100");
    }
  });

  it("maps full-length counts per catalog", () => {
    expect(resolveLengthPresetFromQuestionCount("naplex", 225)).toBe("full");
    expect(resolveLengthPresetFromQuestionCount("pance", 300)).toBe("full");
    expect(resolveLengthPresetFromQuestionCount("nclex", 85)).toBe("full");
    expect(resolveLengthPresetFromQuestionCount("nclex", 150, { nclexLength: "maximum" })).toBe(
      "full"
    );
  });
});
