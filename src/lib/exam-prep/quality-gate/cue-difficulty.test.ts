import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { studentEligibleAndSql } from "@/lib/exam-prep/student-eligibility-sql";
import {
  buildQualityGateReport,
  filterServedRows,
  parseKnownCueFlags,
  qualityGateServedSql,
  resolveQualityGateBoard,
  scoreCueRecall,
  type QualityGateRow,
} from "./cue-difficulty";

const META = {
  board: "nclex",
  fieldId: "nursing",
  servedOnly: false,
  limit: null,
  generatedAt: "2026-11-06T00:00:00.000Z",
};

function row(overrides: Partial<QualityGateRow> & Pick<QualityGateRow, "id" | "question">): QualityGateRow {
  return {
    fieldId: "nursing",
    subjectId: "cardiac",
    itemType: "mcq",
    options: JSON.stringify([
      "Begin a focused reassessment",
      "Begin a focused reassessment",
      "Begin a focused reassessment",
      "Begin a focused reassessment",
    ]),
    correctAnswer: "Begin a focused reassessment",
    difficulty: 3,
    references: [{ label: "NCSBN", citation: "NCLEX-RN test plan" }],
    ...overrides,
  };
}

function codes(reportId: string, report: ReturnType<typeof buildQualityGateReport>): string[] {
  return report.items.find((item) => item.id === reportId)?.flags.map((flag) => flag.code) ?? [];
}

describe("quality gate boards and served predicate", () => {
  it("maps the Week-1 board names onto existing field ids", () => {
    expect(resolveQualityGateBoard("nclex-rn-2026")).toEqual({ board: "nclex-rn-2026", fieldId: "nursing" });
    expect(resolveQualityGateBoard("nclex")?.fieldId).toBe("nursing");
    expect(resolveQualityGateBoard("naplex")?.fieldId).toBe("pharmacy");
    expect(resolveQualityGateBoard("PANCE")?.fieldId).toBe("pance");
    expect(resolveQualityGateBoard("aanp-fnp")?.fieldId).toBe("aanp-fnp");
    expect(resolveQualityGateBoard("usmle")).toBeNull();
  });

  it("reuses the student-eligibility SQL instead of a new definition", () => {
    const sql = qualityGateServedSql();
    expect(sql).toContain('active = true AND "qaPassed" = true');
    expect(sql).toContain(studentEligibleAndSql());
  });

  it("keeps the script free of bank writes", () => {
    const source = readFileSync("scripts/quality-gate-cue-difficulty.ts", "utf8");
    expect(source).toContain("qualityGateServedSql");
    expect(source).not.toMatch(/\$executeRaw|questionBankItem\.(update|updateMany|delete|deleteMany|create|upsert)/);
  });
});

describe("cue flags", () => {
  it("flags a uniquely longest key and a batch over 30%", () => {
    const longKey = "Give the full indicated antibiotic course after cultures";
    const short = "Recheck tomorrow morning";
    const rows = Array.from({ length: 10 }, (_, index) => {
      const flagged = index < 4;
      const options = flagged
        ? [longKey, short, "Call a consult", "Offer water"]
        : ["Equal option one", "Equal option two", "Equal option six", "Equal option ten"];
      return row({
        id: `len-${index}`,
        question: `Next action number ${index} for this client?`,
        options: JSON.stringify(options),
        correctAnswer: options[0]!,
        blueprintTopic: "length-batch",
      });
    });
    const report = buildQualityGateReport(rows, META);
    expect(codes("len-0", report)).toContain("key_longest");
    expect(codes("len-9", report)).not.toContain("key_longest");
    expect(report.checks.keyLength.flagged).toBe(4);
    expect(report.checks.keyLength.batchFlag).toBe(true);
    expect(report.topics[0]?.keyLongestBatchFlag).toBe(true);
  });

  it("does not flag a tie for longest, or a batch at exactly 30%", () => {
    const tied = buildQualityGateReport(
      [
        row({
          id: "tie",
          question: "Which action comes first?",
          options: JSON.stringify([
            "Start oxygen and stay with the client now",
            "Start oxygen and stay with the client pls",
            "Offer a blanket",
            "Document later",
          ]),
          correctAnswer: "Start oxygen and stay with the client now",
        }),
      ],
      META
    );
    expect(codes("tie", tied)).not.toContain("key_longest");

    const batch = Array.from({ length: 10 }, (_, index) => {
      const flagged = index < 3;
      const options = flagged
        ? ["A much longer keyed nursing action than the rest", "Short one", "Short two", "Short six"]
        : ["Equal option one", "Equal option two", "Equal option six", "Equal option ten"];
      return row({
        id: `edge-${index}`,
        question: `Distinct stem ${index} about a different task?`,
        options: JSON.stringify(options),
        correctAnswer: options[0]!,
      });
    });
    const report = buildQualityGateReport(batch, META);
    expect(report.checks.keyLength.rate).toBeCloseTo(0.3);
    expect(report.checks.keyLength.batchFlag).toBe(false);
  });

  it("flags stem echo only when the key overlaps more than every distractor", () => {
    const echo = row({
      id: "echo",
      question: "The client has crushing substernal chest pain radiating to the jaw.",
        options: JSON.stringify([
          "Give aspirin for the crushing substernal pain",
          "Schedule a supervised hallway walk after lunch is finished and documented",
          "Apply a warm compress to the calf",
          "Offer a high protein evening snack",
        ]),
      correctAnswer: "Give aspirin for the crushing substernal pain",
    });
    const quiet = row({
      id: "quiet",
      question: "The client has crushing substernal chest pain radiating to the jaw.",
      options: JSON.stringify([
        "Give aspirin now",
        "Observe the crushing substernal chest pain",
        "Apply a warm compress to the calf",
        "Offer a high protein evening snack",
      ]),
      correctAnswer: "Give aspirin now",
    });
    const report = buildQualityGateReport([echo, quiet], META);
    expect(codes("echo", report)).toContain("stem_echo");
    expect(codes("quiet", report)).not.toContain("stem_echo");
  });

  it("flags absolute distractors and short outliers, not the word allergy", () => {
    const absolute = row({
      id: "abs",
      question: "Which counseling point is correct?",
      options: JSON.stringify([
        "Start the indicated antibiotic after cultures",
        "This regimen always cures the infection",
        "Review the allergy list before the dose",
        "Ask pharmacy to time the next dose",
      ]),
      correctAnswer: "Start the indicated antibiotic after cultures",
    });
    const short = row({
      id: "short",
      question: "Which order is appropriate?",
      options: JSON.stringify(["x".repeat(40), "x".repeat(40), "x".repeat(40), "x".repeat(8)]),
      correctAnswer: "x".repeat(40),
    });
    const report = buildQualityGateReport([absolute, short], META);
    expect(codes("abs", report)).toContain("distractor_absolute");
    expect(codes("abs", report)).not.toContain("option_length_outlier");
    expect(codes("short", report)).toContain("option_length_outlier");
    expect(codes("short", report)).not.toContain("key_longest");
  });

  it("flags SATA when the keyed options are the longest ones", () => {
    const keyed = ["Draw both sets of blood cultures before antibiotics", "Start the broad antibiotic after cultures"];
    const flagged = row({
      id: "sata-yes",
      itemType: "sata",
      question: "Select all that apply for this septic client.",
      options: JSON.stringify(["Sit up", "Offer ice", ...keyed]),
      correctAnswer: keyed.join("|||"),
    });
    const clean = row({
      id: "sata-no",
      itemType: "select_all",
      question: "Select all monitoring steps for this transfusion.",
      options: JSON.stringify([
        "Stay with the client for the first fifteen minutes",
        "Stop the infusion",
        "Document vitals",
      ]),
      correctAnswer: "Stop the infusion|||Document vitals",
    });
    const report = buildQualityGateReport([flagged, clean], META);
    expect(codes("sata-yes", report)).toContain("sata_keyed_longest");
    expect(codes("sata-yes", report)).not.toContain("key_longest");
    expect(codes("sata-no", report)).not.toContain("sata_keyed_longest");
    expect(report.checks.sata.flagged).toBe(1);
  });
});

describe("duplicates, position, difficulty, and support", () => {
  it("flags a repeated stem template and a near-duplicate pair inside one topic", () => {
    const prefix = "The assessment finding requires holding digoxin and notifying the provider about bradycardia";
    const templates = ["alpha", "bravo", "charlie"].map((tail) =>
      row({
        id: `tpl-${tail}`,
        blueprintTopic: "digoxin",
        question: `${prefix} ${tail} ${"unique detail ".repeat(12)}${tail}`,
        subjectId: "pharmacology",
      })
    );
    const stem =
      "Which intervention should the nurse perform first for this client with hypotension and a new fever spike?";
    const copies = ["a-keep", "b-flag"].map((id) =>
      row({
        id,
        blueprintTopic: "sepsis",
        question: stem,
        subjectId: "pharmacology",
      })
    );
    const report = buildQualityGateReport([...templates, ...copies], META);
    expect(codes("tpl-alpha", report)).toContain("repeated_template");
    expect(report.checks.duplicates.templateGroups).toHaveLength(1);
    expect(codes("b-flag", report)).toContain("near_duplicate");
    expect(report.checks.duplicates.nearPairs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ topic: "sepsis", keepId: "a-keep", flagId: "b-flag" }),
      ])
    );
  });

  it("flags a skewed key position on a large enough batch", () => {
    const options = ["choice alpha", "choice bravo", "choice carol", "choice david"];
    const rows = Array.from({ length: 40 }, (_, index) =>
      row({
        id: `pos-${index}`,
        question: `Next step for case p${index}`,
        options: JSON.stringify(options),
        correctAnswer: options[index < 25 ? 0 : 1]!,
        blueprintTopic: `slot-${index}`,
      })
    );
    const report = buildQualityGateReport(rows, META);
    expect(report.checks.answerPosition.evaluated).toBe(40);
    expect(report.checks.answerPosition.maxShare).toBeCloseTo(0.625);
    expect(report.checks.answerPosition.batchFlag).toBe(true);
  });

  it("compares stored labels to the proxy and does not propose NCLEX relabels", () => {
    const hardProxy = row({
      id: "hard-proxy",
      difficulty: 1,
      question: `${"clinical finding ".repeat(50)}what is the priority`,
    });
    const easyProxy = row({
      id: "easy-proxy",
      difficulty: 5,
      question: "What next?",
      options: JSON.stringify([
        "Administer the entire indicated vasopressor infusion and stay at the bedside",
        "Wait",
        "Rest",
        "Note",
      ]),
      correctAnswer: "Administer the entire indicated vasopressor infusion and stay at the bedside",
    });
    const adjacent = row({
      id: "adjacent",
      difficulty: 3,
      question: `${"clinical finding ".repeat(15)}`,
    });
    const nursing = buildQualityGateReport([hardProxy, easyProxy, adjacent], META);
    expect(nursing.checks.difficulty.genuinelyHard).toBe(1);
    expect(nursing.checks.difficulty.nclexReportOnly).toBe(true);
    expect(nursing.checks.difficulty.relabelProposals).toBe(0);
    expect(nursing.items.find((item) => item.id === "hard-proxy")?.difficulty.relabelSuggestion).toBeUndefined();
    expect(codes("adjacent", nursing)).not.toContain("difficulty_band_mismatch");
    expect(codes("easy-proxy", nursing)).toContain("difficulty_band_mismatch");

    const pharmacy = buildQualityGateReport(
      [{ ...easyProxy, fieldId: "pharmacy" }],
      { ...META, board: "naplex", fieldId: "pharmacy" }
    );
    expect(pharmacy.items.find((item) => item.id === "easy-proxy")?.difficulty.relabelSuggestion).toBe("Easy");
    expect(pharmacy.checks.difficulty.relabelProposals).toBe(1);
  });

  it("counts citations and source-check fields without inventing a source-check column", () => {
    const cited = row({ id: "cited", question: "Which lab should be drawn first today?" });
    const bare = row({
      id: "bare",
      question: "Which lab should be drawn second today?",
      references: [],
      generationMeta: undefined,
    });
    const checked = row({
      id: "checked",
      question: "Which lab should be drawn third today?",
      generationMeta: { sourceCheck: { checkedAt: "2026-11-01", ok: true } },
    });
    const uncheckedCue = row({
      id: "unchecked",
      question: "Which order is appropriate?",
      options: JSON.stringify(["x".repeat(48), "short", "brief", "tiny"]),
      correctAnswer: "x".repeat(48),
      references: [],
    });
    const absent = buildQualityGateReport([cited, bare], META);
    expect(absent.checks.support.citationPresent).toBe(1);
    expect(absent.checks.support.citationMissing).toBe(1);
    expect(absent.checks.support.sourceCheckFieldPresent).toBe(false);
    expect(absent.items.some((item) => item.flags.some((flag) => flag.code === "missing_citation"))).toBe(false);

    const present = buildQualityGateReport([checked, uncheckedCue], META);
    expect(present.checks.support.sourceCheckFieldPresent).toBe(true);
    expect(present.checks.support.sourceCheckRecorded).toBe(1);
    expect(present.checks.support.sourceCheckMissing).toBe(1);
    expect(codes("unchecked", present)).toEqual(
      expect.arrayContaining(["key_longest", "missing_citation", "missing_source_check"])
    );
    expect(present.items.some((item) => item.id === "checked")).toBe(false);
  });
});

describe("served fixture filter and CUE recall", () => {
  it("drops rows the shared student-eligibility rule rejects", () => {
    const eligible = row({
      id: "ok",
      question: "Which action is the priority for hypotension?",
      active: true,
      qaPassed: true,
    });
    const inactive = row({
      id: "off",
      question: "Which action is the priority for hypoxia?",
      active: false,
      qaPassed: true,
    });
    const badSata = row({
      id: "one-key",
      itemType: "sata",
      question: "Select all that apply to this client with chest pain.",
      options: JSON.stringify(["Give oxygen", "Start a large bore IV", "Leave the client alone"]),
      correctAnswer: "Give oxygen",
      active: true,
      qaPassed: true,
    });
    expect(filterServedRows([eligible, inactive, badSata]).map((item) => item.id)).toEqual(["ok"]);
  });

  it("reports recall of known CUE flags, including aliases", () => {
    const report = buildQualityGateReport(
      [
        row({
          id: "hit",
          question: "The client has crushing substernal chest pain radiating to the jaw.",
        options: JSON.stringify([
          "Give aspirin for the crushing substernal pain",
          "Schedule a supervised hallway walk after lunch is finished and documented",
          "Apply a warm compress to the calf",
          "Offer a high protein evening snack",
        ]),
          correctAnswer: "Give aspirin for the crushing substernal pain",
        }),
      ],
      META
    );
    const known = parseKnownCueFlags({
      flags: [
        { id: "hit", code: "keyed_longest" },
        { id: "hit", codes: ["stem_echo"] },
        { id: "missing", code: "stem_echo" },
      ],
    });
    const score = scoreCueRecall(report, known);
    expect(score.knownFlags).toBe(3);
    expect(score.recalledFlags).toBe(1);
    expect(score.recall).toBeCloseTo(1 / 3);
    expect(score.missed).toEqual(
      expect.arrayContaining([
        { id: "hit", code: "keyed_longest" },
        { id: "missing", code: "stem_echo" },
      ])
    );
  });
});
