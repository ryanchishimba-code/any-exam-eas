import { describe, expect, it } from "vitest";
import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import {
  canonicalQuestionBankHref,
  canonicalizeQuestionBankQuery,
  questionBankPageFieldId,
  questionBankQueriesMatch,
  resolvePracticeSubjectId,
  subjectIdBelongsToField,
} from "@/lib/study/question-bank-filters";

describe("subjectIdBelongsToField", () => {
  it("keeps a subject on its own board and rejects it on another", () => {
    expect(subjectIdBelongsToField("usmle-step-1", "physiology")).toBe(true);
    expect(subjectIdBelongsToField("aanp-fnp", "physiology")).toBe(false);
    expect(subjectIdBelongsToField("nursing", "pharmacology-nursing")).toBe(true);
    expect(subjectIdBelongsToField("pharmacy", "pharmacology-nursing")).toBe(false);
  });

  it("treats mixed as valid on every board", () => {
    expect(subjectIdBelongsToField("aanp-fnp", "mixed")).toBe(true);
    expect(subjectIdBelongsToField("nursing", "__mixed__")).toBe(true);
  });
});

describe("canonicalizeQuestionBankQuery", () => {
  it("strips a stale subjectId that does not belong to the active field", () => {
    const current = new URLSearchParams(
      "field=aanp-fnp&mode=bank&subjectId=physiology&style=adaptive"
    );
    const next = canonicalizeQuestionBankQuery("aanp-fnp", current);

    expect(next.get("field")).toBe("aanp-fnp");
    expect(next.get("mode")).toBe("bank");
    expect(next.get("style")).toBe("adaptive");
    expect(next.has("subjectId")).toBe(false);
    expect(questionBankQueriesMatch(current, next)).toBe(false);
  });

  it("keeps a subjectId that belongs to the field", () => {
    const current = new URLSearchParams(
      "field=usmle-step-1&mode=bank&subjectId=physiology"
    );
    const next = canonicalizeQuestionBankQuery("usmle-step-1", current);
    expect(questionBankQueriesMatch(current, next)).toBe(true);
    expect(next.get("subjectId")).toBe("physiology");
  });

  it("drops board-specific filters when the field changes", () => {
    const current = new URLSearchParams(
      "field=nursing&mode=bank&subjectId=pharmacology-nursing&nclexLength=minimum&taskCategory=history&state=TX&mpjeState=TX"
    );
    const next = canonicalizeQuestionBankQuery("aanp-fnp", current);

    expect(next.get("field")).toBe("aanp-fnp");
    expect(next.has("subjectId")).toBe(false);
    expect(next.has("nclexLength")).toBe(false);
    expect(next.has("taskCategory")).toBe(false);
    expect(next.has("state")).toBe(false);
    expect(next.has("mpjeState")).toBe(false);
  });

  it("keeps a PANCE task filter on the PANCE field", () => {
    const current = new URLSearchParams("field=pance&mode=bank&taskCategory=history");
    const next = canonicalizeQuestionBankQuery("pance", current);
    expect(next.get("taskCategory")).toBe("history");
  });

  it("does not invent subjectId=assess when physiology is stripped", () => {
    const current = new URLSearchParams("field=aanp-fnp&subjectId=physiology");
    const next = canonicalizeQuestionBankQuery("aanp-fnp", current);
    expect(next.has("subjectId")).toBe(false);
    expect(next.get("subjectId")).not.toBe("assess");
  });

  it("keeps an explicit field when the subject belongs to another board", () => {
    const savedBoard = "nursing";
    const requested = "aanp-fnp";
    expect(questionBankPageFieldId(requested, savedBoard)).toBe("aanp-fnp");

    const href = canonicalQuestionBankHref(
      "/question-bank",
      new URLSearchParams("field=aanp-fnp&subjectId=physiology"),
      savedBoard,
      requested
    );
    expect(href).toBe("/question-bank?field=aanp-fnp&mode=bank");
    expect(href).not.toContain("subjectId");
    expect(href).not.toContain("field=nursing");
  });

  it("keeps a subjectId that belongs to the explicit field", () => {
    const search = new URLSearchParams("field=aanp-fnp&mode=bank&subjectId=assess");
    expect(questionBankPageFieldId("aanp-fnp", "nursing")).toBe("aanp-fnp");
    expect(canonicalQuestionBankHref("/question-bank", search, "nursing", "aanp-fnp")).toBeNull();
    expect(search.get("subjectId")).toBe("assess");
    expect(search.get("field")).toBe("aanp-fnp");
  });

  it("is idempotent", () => {
    const once = canonicalizeQuestionBankQuery(
      "pharmacy",
      new URLSearchParams("field=nursing&subjectId=physiology&mode=timed")
    );
    const twice = canonicalizeQuestionBankQuery("pharmacy", once);
    expect(questionBankQueriesMatch(once, twice)).toBe(true);
    expect(twice.get("mode")).toBe("timed");
    expect(twice.has("subjectId")).toBe(false);
  });
});

describe("resolvePracticeSubjectId", () => {
  const aanpIds = getSubjectsForFieldId("aanp-fnp").map((subject) => subject.id);

  it("drops a foreign subject instead of selecting the first AANP domain", () => {
    expect(aanpIds[0]).toBe("assess");
    expect(
      resolvePracticeSubjectId({
        fieldId: "aanp-fnp",
        subjectIds: aanpIds,
        subjectParam: "physiology",
        styleParam: null,
        persistedSubjectId: null,
        coverageLeadSubjectId: null,
        preferWeak: false,
        weakSubjectId: null,
      })
    ).toBe(MIXED_SUBJECT_ID);
  });

  it("opens all topics when the URL has no subject and nothing is remembered", () => {
    expect(
      resolvePracticeSubjectId({
        fieldId: "aanp-fnp",
        subjectIds: aanpIds,
        subjectParam: null,
        styleParam: null,
        persistedSubjectId: null,
        coverageLeadSubjectId: null,
        preferWeak: false,
        weakSubjectId: null,
      })
    ).toBe(MIXED_SUBJECT_ID);
  });

  it("keeps a subject that belongs to the field", () => {
    expect(
      resolvePracticeSubjectId({
        fieldId: "aanp-fnp",
        subjectIds: aanpIds,
        subjectParam: "assess",
        styleParam: null,
        persistedSubjectId: null,
        coverageLeadSubjectId: null,
        preferWeak: false,
        weakSubjectId: null,
      })
    ).toBe("assess");
  });
});
