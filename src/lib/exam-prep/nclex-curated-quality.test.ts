import { describe, expect, it } from "vitest";
import { NCLEX_CURATED_QUALITY } from "./nclex-curated-quality";
import { bankItemToExamQuestion, bankItemToRawQuestion } from "./ngn-bank-bridge";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import { serializeBankOptions, parseBankOptions } from "@/lib/mpje/parse-bank-options";

describe("NCLEX_CURATED_QUALITY", () => {
  it("includes at least two curated high-yield items", () => {
    expect(NCLEX_CURATED_QUALITY.length).toBeGreaterThanOrEqual(2);
  });

  const sepsisItem = NCLEX_CURATED_QUALITY.find((i) =>
    i.vignette?.includes("urinary tract infection")
  );
  const icpItem = NCLEX_CURATED_QUALITY.find((i) =>
    i.vignette?.includes("closed head injury")
  );

  it("includes the septic shock prioritization item", () => {
    expect(sepsisItem).toBeDefined();
    expect(sepsisItem!.correctAnswer).toContain("blood cultures");
    expect(sepsisItem!.distractorRationale).toBeDefined();
    expect(Object.keys(sepsisItem!.distractorRationale ?? {})).toHaveLength(3);
  });

  it("includes the increased ICP head-injury prioritization item", () => {
    expect(icpItem).toBeDefined();
    expect(icpItem!.correctAnswer).toContain("Elevate the head of the bed");
    expect(icpItem!.distractorRationale).toBeDefined();
    expect(Object.keys(icpItem!.distractorRationale ?? {})).toHaveLength(3);
    expect(icpItem!.topicCategory).toBe("neurological");
  });

  it("round-trips enriched rationales through bank serialization", () => {
    const raw = serializeBankOptions(sepsisItem!);
    const parsed = parseBankOptions(raw);
    expect(parsed.options).toHaveLength(4);
    expect(parsed.distractorRationale?.[parsed.options[0]]).toContain("sequencing");
    expect(parsed.clinicalReasoning).toContain("Recognize cues");
  });

  it("preserves vignette, CJMM reasoning, and study pipeline metadata", () => {
    const exam = bankItemToExamQuestion(sepsisItem!, 0);
    expect(exam.vignette).toContain("68-year-old");
    expect(exam.clinicalReasoning).toContain("Prioritize hypotheses");
    expect(exam.distractorRationale).toBeDefined();

    const study = examQuestionToStudy(bankItemToRawQuestion(sepsisItem!, 0), 0);
    expect(study.vignette).toContain("urinary tract infection");
    expect(study.distractorRationale).toBeDefined();
    expect(study.ngnPayload?.reviewModuleSlug).toBe("sepsis-shock");
    expect(study.solutionSteps?.[0]).toContain("sepsis/septic shock");
  });

  it("round-trips ICP item through study pipeline with full rationales", () => {
    const exam = bankItemToExamQuestion(icpItem!, 0);
    expect(exam.vignette).toContain("Glasgow Coma Scale");
    expect(exam.clinicalReasoning).toContain("Cushing triad");

    const study = examQuestionToStudy(bankItemToRawQuestion(icpItem!, 0), 0);
    const wrongOpt = icpItem!.options[0];
    expect(study.distractorRationale?.[wrongOpt]).toContain("aspiration");
    expect(study.ngnPayload?.top500Drugs).toContain("Mannitol");
  });
});
