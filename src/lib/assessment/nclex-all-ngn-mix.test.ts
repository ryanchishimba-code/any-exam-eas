import { describe, expect, it } from "vitest";
import { findBannedStudentKeys } from "@/lib/questions/student-payload";
import { examQuestionToStudy, studyQuestionsToExamQuestions } from "@/lib/questions/prepare";
import { createStudySession, recordSessionGrade } from "@/lib/questions/session-engine";
import { getSequentialPayload } from "@/lib/questions/sequential-sets";
import { gradeWithheldNclexAllSession } from "@/lib/client/grade-nclex-all-session";
import { isNclexAllNgnMixEnabled } from "@/lib/assessment/nclex-all-ngn-flag";
import {
  nclexAllNgnCommitKind,
  readNclexAllNgnSlot,
  sessionIncludesNclexAllNgn,
} from "@/lib/assessment/nclex-all-ngn-slot";
import {
  expandNgnMixSlots,
  nclexAllMixScoredCount,
  nclexAllNgnMixRecipe,
  packNclexAllNgnSession,
  type NgnMixCandidate,
} from "@/lib/assessment/nclex-all-ngn-pack";
import { studyQuestionsForPublishedUnit } from "@/lib/assessment/nclex-all-ngn-build";
import {
  latestAttemptCorrect,
  mixPreparedWithNgnUnits,
  nclexAllNgnMixApplies,
  statusForUnit,
} from "@/lib/assessment/nclex-all-ngn-mix";
import type { PublishedUnit, ServeItem } from "@/lib/assessment/serve";
import type { StudyQuestion, StudySessionState } from "@/lib/questions/types";
import {
  NGN_ATTEMPT_CLIENT_NEED_JOIN,
  domainTalliesFromAttemptGroups,
} from "@/lib/engine/mastery/nclex-ngn-attempt-tally";

function qbi(id: string): StudyQuestion {
  return {
    id,
    sourceIndex: 1,
    type: "multiple_choice",
    stem: `Bank item ${id} asks which action the nurse takes first for this client.`,
    options: ["Assess", "Document"],
    correctAnswers: ["Assess"],
    explanation: "Assess first.",
    bankItemId: id,
    subjectId: "management-of-care",
  };
}

function standalone(id: string, extras: Partial<NgnMixCandidate> = {}): NgnMixCandidate {
  return {
    id,
    kind: "standalone",
    steps: 1,
    subjectIds: ["management-of-care"],
    clientNeedId: "management-of-care",
    unseen: true,
    incorrect: false,
    ...extras,
  };
}

function completeCase(id: string, extras: Partial<NgnMixCandidate> = {}): NgnMixCandidate {
  return {
    id,
    kind: "case",
    steps: 6,
    subjectIds: ["physiological-adaptation", "med-surg"],
    clientNeedId: "physiological-adaptation",
    unseen: true,
    incorrect: false,
    ...extras,
  };
}

function serveItem(id: string, step: number | null, caseId: string | null): ServeItem {
  return {
    id,
    version: 1,
    batchId: "nclex-rn-2026",
    itemType: caseId ? "case_item" : "bowtie",
    caseId,
    caseStep: step,
    caseVersion: caseId ? 1 : null,
    cjmmFunction: [],
    timepoint: "t0",
    responseFormat: caseId ? "mc_single" : "bowtie",
    scoringRule: "zero_one",
    maxPoints: 1,
    stem: `${id} which finding requires the nurse to act first?`,
    payload: caseId
      ? { options: [{ id: "a", text: "Call the provider" }, { id: "b", text: "Document" }], key: "a" }
      : {
          condition: { options: [{ id: "c", text: "Shock" }], key: "c" },
          actions: { options: [{ id: "a1", text: "Fluids" }], keys: ["a1"] },
          monitor: { options: [{ id: "m1", text: "Urine" }], keys: ["m1"] },
        },
    rationale: {
      short: "secret rationale",
      expanded: {
        perOption: { a: { verdict: "key", text: "yes" } },
        cjmmCoaching: "",
        pointsLost: "",
        takeaway: "",
      },
    },
    clientNeeds: { subcategory: caseId ? "Physiological Adaptation" : "Management of Care" },
    references: [],
    rnFlags: ["reviewer note"],
    status: "published",
  };
}

function caseUnit(id: string, steps = 6): PublishedUnit {
  const items = Array.from({ length: steps }, (_, index) => serveItem(`${id}-S${index + 1}`, index + 1, id));
  return {
    kind: "case",
    subjectId: "physiological-adaptation",
    practiceSubjectIds: ["physiological-adaptation", "med-surg"],
    items,
    caseDoc: {
      id,
      version: 1,
      batchId: "nclex-rn-2026",
      title: `${id} title`,
      boardProfile: "nclex-rn-2026",
      status: "published",
      primaryClientNeed: "Physiological Adaptation",
      setting: "ICU",
      patient: { displayName: "Alex", age: 54, sex: "male", weightKg: 80, allergies: "NKDA" },
      timepoints: [{ id: "t0", label: "Admission" }],
      chart: { tabs: [{ id: "notes", label: "Notes" }] },
      revealRule: "after-case",
      references: [],
      items,
    },
  };
}

function bowtieUnit(id: string): PublishedUnit {
  return {
    kind: "standalone",
    subjectId: "management-of-care",
    item: serveItem(id, null, null),
  };
}

describe("NCLEX all-questions NGN flag", () => {
  it("stays off unless the env is exactly true or 1", () => {
    expect(isNclexAllNgnMixEnabled({})).toBe(false);
    expect(isNclexAllNgnMixEnabled({ NCLEX_ALL_NGN_MIX: "false" })).toBe(false);
    expect(isNclexAllNgnMixEnabled({ NCLEX_ALL_NGN_MIX: "" })).toBe(false);
    expect(isNclexAllNgnMixEnabled({ NCLEX_ALL_NGN_MIX: "true" })).toBe(true);
    expect(isNclexAllNgnMixEnabled({ NEXT_PUBLIC_NCLEX_ALL_NGN_MIX: "1" })).toBe(true);
  });

  it("applies only to NCLEX format=all standard bank sessions", () => {
    const base = {
      enabled: true,
      fieldId: "nursing",
      questionBank: true,
      timedExam: false,
      format: null,
      weakArea: false,
      topicNarrowed: false,
    };
    expect(nclexAllNgnMixApplies(base)).toBe(true);
    expect(nclexAllNgnMixApplies({ ...base, enabled: false })).toBe(false);
    expect(nclexAllNgnMixApplies({ ...base, fieldId: "pharmacy" })).toBe(false);
    expect(nclexAllNgnMixApplies({ ...base, timedExam: true })).toBe(false);
    expect(nclexAllNgnMixApplies({ ...base, format: "ngn" })).toBe(false);
    expect(nclexAllNgnMixApplies({ ...base, format: "case" })).toBe(false);
    expect(nclexAllNgnMixApplies({ ...base, weakArea: true })).toBe(false);
    expect(nclexAllNgnMixApplies({ ...base, topicNarrowed: true })).toBe(false);
    expect(nclexAllNgnMixApplies({ ...base, questionBank: false })).toBe(false);
  });
});

describe("NCLEX all-questions NGN packing", () => {
  const sizes = [
    { limit: 5, cases: 0, standalones: 1, qbi: 4 },
    { limit: 10, cases: 0, standalones: 1, qbi: 9 },
    { limit: 25, cases: 1, standalones: 2, qbi: 17 },
    { limit: 50, cases: 2, standalones: 4, qbi: 34 },
    { limit: 75, cases: 3, standalones: 6, qbi: 51 },
  ] as const;

  it("uses the preset compositions and counts a case as six scored items", () => {
    for (const size of sizes) {
      expect(nclexAllNgnMixRecipe(size.limit)).toEqual({
        cases: size.cases,
        standalones: size.standalones,
      });
      const plan = packNclexAllNgnSession({
        limit: size.limit,
        qbi: Array.from({ length: size.limit }, (_, index) => qbi(`q${index}`)),
        cases: Array.from({ length: 8 }, (_, index) => completeCase(`C${index}`)),
        standalones: Array.from({ length: 12 }, (_, index) => standalone(`B${index}`)),
        seed: `size-${size.limit}`,
      });
      expect(plan).not.toBeNull();
      expect(plan).toMatchObject({
        cases: size.cases,
        standalones: size.standalones,
        qbi: size.qbi,
        scored: size.limit,
      });
      expect(
        nclexAllMixScoredCount({
          cases: plan!.cases,
          standalones: plan!.standalones,
          qbi: plan!.qbi,
        })
      ).toBe(size.limit);
      const expanded = expandNgnMixSlots(plan!.slots);
      expect(expanded).toHaveLength(size.limit);
      const caseIds = expanded.filter((slot) => slot.kind === "case");
      for (let index = 0; index < caseIds.length; index += 6) {
        const block = caseIds.slice(index, index + 6);
        expect(block.map((slot) => (slot.kind === "case" ? slot.step : 0))).toEqual([1, 2, 3, 4, 5, 6]);
        expect(new Set(block.map((slot) => (slot.kind === "case" ? slot.id : ""))).size).toBe(1);
      }
    }
  });

  it("never serves an incomplete case and fills the exact count from QBI", () => {
    const plan = packNclexAllNgnSession({
      limit: 25,
      qbi: Array.from({ length: 25 }, (_, index) => qbi(`q${index}`)),
      cases: [completeCase("short", { steps: 5 }), completeCase("full")],
      standalones: [standalone("only")],
      seed: "fallback",
    });
    expect(plan).toMatchObject({ cases: 1, standalones: 1, qbi: 18, scored: 25 });
    expect(plan!.slots.some((slot) => slot.kind === "case" && slot.id === "short")).toBe(false);
    expect(plan!.slots.some((slot) => slot.kind === "case" && slot.id === "full")).toBe(true);
  });

  it("prefers unseen units and can limit the pool to incorrect units", () => {
    const plan = packNclexAllNgnSession({
      limit: 25,
      qbi: Array.from({ length: 25 }, (_, index) => qbi(`q${index}`)),
      cases: [
        completeCase("seen", { unseen: false, incorrect: false }),
        completeCase("missed", { unseen: false, incorrect: true }),
        completeCase("new"),
      ],
      standalones: [
        standalone("seen-item", { unseen: false, incorrect: false }),
        standalone("new-item"),
      ],
      seed: "unseen-first",
    });
    const caseId = plan!.slots.find((slot) => slot.kind === "case");
    expect(caseId && caseId.kind === "case" ? caseId.id : "").toBe("new");
    const standaloneIds = plan!.slots
      .filter((slot) => slot.kind === "standalone")
      .map((slot) => (slot.kind === "standalone" ? slot.id : ""));
    expect(standaloneIds[0]).toBe("new-item");

    const incorrectOnly = packNclexAllNgnSession({
      limit: 25,
      qbi: Array.from({ length: 25 }, (_, index) => qbi(`q${index}`)),
      cases: [completeCase("new"), completeCase("missed", { unseen: false, incorrect: true })],
      standalones: [standalone("new-item"), standalone("missed-item", { unseen: false, incorrect: true })],
      seed: "incorrect",
      scope: { status: "incorrect" },
    });
    expect(incorrectOnly).toMatchObject({ cases: 1, standalones: 1, qbi: 18 });
    expect(incorrectOnly!.slots.find((slot) => slot.kind === "case")).toMatchObject({ id: "missed" });
    expect(incorrectOnly!.slots.find((slot) => slot.kind === "standalone")).toMatchObject({
      id: "missed-item",
    });
  });

  it("respects topic and client-need scope", () => {
    const plan = packNclexAllNgnSession({
      limit: 25,
      qbi: Array.from({ length: 25 }, (_, index) => qbi(`q${index}`)),
      cases: [completeCase("phys"), completeCase("care", {
        subjectIds: ["management-of-care"],
        clientNeedId: "management-of-care",
      })],
      standalones: [standalone("care-item"), standalone("phys-item", {
        subjectIds: ["physiological-adaptation"],
        clientNeedId: "physiological-adaptation",
      })],
      seed: "topic",
      scope: { subjectId: "med-surg" },
    });
    expect(plan!.slots.filter((slot) => slot.kind === "case").map((slot) => slot.kind === "case" && slot.id)).toEqual([
      "phys",
    ]);
    expect(plan!.slots.some((slot) => slot.kind === "standalone")).toBe(false);
    expect(plan).toMatchObject({ cases: 1, standalones: 0, qbi: 19, scored: 25 });

    const area = packNclexAllNgnSession({
      limit: 10,
      qbi: Array.from({ length: 10 }, (_, index) => qbi(`q${index}`)),
      cases: [],
      standalones: [standalone("care-item"), standalone("phys-item", {
        subjectIds: ["physiological-adaptation"],
        clientNeedId: "physiological-adaptation",
      })],
      seed: "area",
      scope: { blueprintAreaId: "physiological-adaptation" },
    });
    expect(area!.slots.find((slot) => slot.kind === "standalone")).toMatchObject({ id: "phys-item" });
  });
});

describe("official NGN rows inside All questions", () => {
  it("keeps six case steps together and hides answer keys", () => {
    const questions = studyQuestionsForPublishedUnit({
      unit: caseUnit("C01"),
      sourcesById: { cdc: { title: "CDC", url: "https://example.test" } },
      field: "Nursing",
    });
    expect(questions).toHaveLength(6);
    const delivered = studyQuestionsToExamQuestions(questions);
    for (const question of delivered) {
      expect(findBannedStudentKeys(question)).toEqual([]);
      expect(JSON.stringify(question)).not.toContain("secret rationale");
      expect(JSON.stringify(question)).not.toContain("reviewer note");
    }
    const prepared = delivered.map((question, index) => examQuestionToStudy(question, index));
    const session = createStudySession({
      questions: prepared.map((question, index) => ({
        id: index + 1,
        type: "multiple_choice",
        question: question.stem,
        options: question.options,
        correctAnswer: "",
        explanation: "",
        ngnPayload: question.ngnPayload,
        subjectId: question.subjectId,
        bankItemId: questions![index]!.bankItemId,
        tags: question.tags,
      })),
      field: "Nursing",
      sourceType: "bank",
      mode: "practice",
      shuffleOrder: true,
    });
    const slots = session.questions.map((question) => readNclexAllNgnSlot(question));
    expect(slots.every((slot) => slot?.role === "case")).toBe(true);
    expect(slots.map((slot) => slot?.stepIndex)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(slots.map((slot) => slot?.setId)).size).toBe(1);
    expect(getSequentialPayload(session.questions[0]!)?.totalSteps).toBe(6);
    expect(session.questions[0]?.subjectId).toBe("physiological-adaptation");
    expect(session.questions[0]?.tags).toContain("cn:physiological-adaptation");
  });

  it("mixes published units ahead of unseen history and drops a short case", () => {
    const latest = latestAttemptCorrect([
      { key: "ngn:seen:v1", correct: true, createdAt: 10 },
      { key: "ngn:C02-S1:v1", correct: false, createdAt: 5 },
    ]);
    expect(statusForUnit(["ngn:fresh:v1"], latest)).toEqual({ unseen: true, incorrect: false });
    expect(statusForUnit(["ngn:C02-S1:v1"], latest)).toEqual({ unseen: false, incorrect: true });

    const mixed = mixPreparedWithNgnUnits({
      prepared: Array.from({ length: 25 }, (_, index) => qbi(`q${index}`)),
      limit: 25,
      units: [caseUnit("Cshort", 5), caseUnit("C01"), bowtieUnit("B01"), bowtieUnit("B02")],
      latest: new Map(),
      sourcesById: {},
      field: "Nursing",
      seed: "mix",
      scope: {},
    });
    expect(mixed).toHaveLength(25);
    const slots = mixed!.map((question) => readNclexAllNgnSlot(question));
    const caseSteps = slots.filter((slot) => slot?.role === "case");
    expect(caseSteps).toHaveLength(6);
    expect(caseSteps.map((slot) => slot?.stepIndex)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(slots.filter((slot) => slot?.role === "standalone")).toHaveLength(2);
    expect(slots.filter((slot) => slot == null)).toHaveLength(17);
    expect(sessionIncludesNclexAllNgn(mixed!)).toBe(true);
  });

  it("counts each case step toward the usage total when the session is graded", async () => {
    const unit = caseUnit("C01");
    const questions = studyQuestionsForPublishedUnit({
      unit,
      sourcesById: {},
      field: "Nursing",
    })!;
    const session: StudySessionState = {
      sessionId: "sess",
      mode: "timed",
      field: "Nursing",
      sourceType: "bank",
      order: questions.map((question) => question.id),
      currentIndex: 5,
      answers: {},
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timedSessionSeconds: 45 * 6,
    };
    let reveals = 0;
    const graded = await gradeWithheldNclexAllSession({
      session,
      questions,
      responses: {},
      revealNgn: async () => {
        reveals += 1;
        return {
          item: { ...questions[0]!.ngnPayload!.caseData, id: "x" } as never,
          correct: reveals % 2 === 0,
          points: 1,
          maxPoints: 1,
        };
      },
      revealBank: async () => null,
    });
    expect(reveals).toBe(6);
    expect(Object.values(graded.session.answers).filter((answer) => answer?.revealed)).toHaveLength(6);
    expect(nclexAllMixScoredCount({ cases: 1, standalones: 0, qbi: 0 })).toBe(6);
  });
});

describe("All-questions commit rules", () => {
  it("reveals a case only after step 6 in practice and withholds every item on the session timer", () => {
    expect(nclexAllNgnCommitKind({ slot: null, withholdReveal: false })).toBe("qbi");
    expect(
      nclexAllNgnCommitKind({
        slot: { role: "case", stepIndex: 3, totalSteps: 6 },
        withholdReveal: false,
      })
    ).toBe("advance");
    expect(
      nclexAllNgnCommitKind({
        slot: { role: "case", stepIndex: 6, totalSteps: 6 },
        withholdReveal: false,
      })
    ).toBe("reveal-case");
    expect(
      nclexAllNgnCommitKind({
        slot: { role: "standalone", stepIndex: 1, totalSteps: 1 },
        withholdReveal: false,
      })
    ).toBe("reveal-item");
    expect(
      nclexAllNgnCommitKind({
        slot: { role: "standalone", stepIndex: 1, totalSteps: 1 },
        withholdReveal: true,
      })
    ).toBe("advance");
    const graded = recordSessionGrade(
      {
        sessionId: "s",
        mode: "practice",
        field: "Nursing",
        sourceType: "bank",
        order: ["q"],
        currentIndex: 0,
        answers: {},
        startedAt: "",
        updatedAt: "",
      },
      "q",
      { selected: ["{}"], correct: true, revealed: true }
    );
    expect(graded.answers.q?.correct).toBe(true);
  });
});

describe("Client Needs mastery for ngn keys", () => {
  it("reads client needs from ngn_item when the bank join misses the key", () => {
    expect(NGN_ATTEMPT_CLIENT_NEED_JOIN).toContain("ngn_item");
    expect(NGN_ATTEMPT_CLIENT_NEED_JOIN).toContain("client_needs");
    expect(NGN_ATTEMPT_CLIENT_NEED_JOIN).toContain("ngn:");
    const tallies = domainTalliesFromAttemptGroups("nursing", [
      {
        subjectId: "__mixed__",
        clientNeeds: "",
        blueprintDomain: "",
        answered: 4,
        correct: 1,
      },
      {
        subjectId: "__mixed__",
        clientNeeds: "Physiological Adaptation",
        blueprintDomain: "",
        answered: 6,
        correct: 4,
      },
      {
        subjectId: "pharmacology-nursing",
        clientNeeds: "",
        blueprintDomain: "",
        answered: 2,
        correct: 2,
      },
    ]);
    const phys = tallies.find((row) => row.domainId === "physiological-adaptation");
    const pharm = tallies.find((row) => row.domainId === "pharmacology");
    expect(phys).toEqual({ domainId: "physiological-adaptation", answered: 6, correct: 4 });
    expect(pharm).toEqual({ domainId: "pharmacology", answered: 2, correct: 2 });
    expect(tallies.some((row) => row.answered === 4 && row.correct === 1)).toBe(false);
  });
});
