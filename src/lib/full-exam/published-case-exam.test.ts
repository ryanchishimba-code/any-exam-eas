import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { ServeCase, ServeItem } from "@/lib/assessment/serve";
import { selectPublishedCatalog } from "@/lib/assessment/serve";
import { assessStudentEligibility, isServableToStudents } from "@/lib/exam-prep/student-eligibility";
import { finalizeAssembledSitting } from "@/lib/exam-prep/sitting-selection";
import { NCLEX_2026_CLIENT_NEEDS } from "@/lib/exam-prep/nclex/blueprint-topics-2026";
import type { BankItem } from "@/lib/question-bank";
import { getSubjectsForFieldId } from "@/lib/subjects/subject-catalog";
import { publishedCatalogToBankItems } from "@/lib/full-exam/catalog-exam-items";
import { completeSequentialGroups } from "@/lib/full-exam/ngn-format-mix";
import { NCLEX_MINIMUM_ITEMS, nclexShapeRole } from "@/lib/full-exam/nclex-exam-shape";

type RawDoc = {
  batchId: string;
  cases: Array<ServeCase & { items?: ServeItem[] }>;
  standalone?: ServeItem[];
};

function loadPublished(file: string): { items: ServeItem[]; cases: ServeCase[] } {
  const doc = JSON.parse(readFileSync(resolve(process.cwd(), file), "utf8")) as RawDoc;
  const cases: ServeCase[] = [];
  const items: ServeItem[] = [];
  for (const entry of doc.cases) {
    const { items: steps = [], ...caseDoc } = entry;
    cases.push({ ...caseDoc, status: "published", batchId: doc.batchId });
    for (const step of steps) {
      items.push({
        ...step,
        status: "published",
        batchId: step.batchId || doc.batchId,
        caseVersion: entry.version,
      });
    }
  }
  for (const step of doc.standalone ?? []) {
    items.push({
      ...step,
      status: "published",
      batchId: step.batchId || doc.batchId,
      caseId: null,
      caseStep: null,
      caseVersion: null,
    });
  }
  return { items, cases };
}

function knowledge(id: string, category: string): BankItem {
  return {
    id,
    subjectId: category,
    question: `Which action is first for ${id}?`,
    options: [`Assess ${id}`, `Wait ${id}`, `Document ${id}`, `Delegate ${id}`],
    correctAnswer: `Assess ${id}`,
    explanation: `Assess ${id} before the other steps.`,
    scenario: `Client ${id} needs a distinct check.`,
    itemType: "mcq",
    qaPassed: true,
    active: true,
  };
}

describe("production-shaped published cases", () => {
  const subjects = getSubjectsForFieldId("nursing").map((subject) => ({
    id: subject.id,
    label: subject.label,
  }));

  it("keeps every pilot and batch-1 case when columns use label and a matrix row is blank", () => {
    for (const file of ["content/ngn-pilot/pilot-items.json", "content/ngn-batch1/batch1-items.json"]) {
      const loaded = loadPublished(file);
      const catalog = selectPublishedCatalog({
        items: loaded.items,
        cases: loaded.cases,
        subjects,
        fieldId: "nursing",
      });
      expect(catalog.cases).toHaveLength(loaded.cases.length);
      const bank = publishedCatalogToBankItems(catalog);
      const groups = completeSequentialGroups(bank).filter((group) => group.length === 6);
      expect(groups).toHaveLength(loaded.cases.length);
      const blocked = bank
        .filter((item) => item.id?.startsWith("ngn:") && !isServableToStudents(item))
        .map((item) => ({
          id: item.id,
          reasons: assessStudentEligibility({
            id: item.id,
            active: item.active,
            qaPassed: item.qaPassed,
            itemType: item.itemType,
            question: item.question,
            correctAnswer: item.correctAnswer,
            explanation: item.explanation,
            options: item.options,
            ngnPayload: item.ngnPayload,
          }).reasons,
        }));
      expect(blocked).toEqual([]);
    }
  });

  it("places three six-step cases before item 86 on CAT and linear exams", () => {
    const loaded = loadPublished("content/ngn-batch1/batch1-items.json");
    const catalog = selectPublishedCatalog({
      items: loaded.items,
      cases: loaded.cases,
      subjects,
      fieldId: "nursing",
    });
    const published = publishedCatalogToBankItems(catalog);
    const categories = NCLEX_2026_CLIENT_NEEDS.map((category) => category.id);
    const fillers = categories.flatMap((category) =>
      Array.from({ length: 40 }, (_, index) => knowledge(`${category}-${index}`, category))
    );
    const pool = [...published, ...fillers];

    for (const limit of [85, 150]) {
      const sitting = finalizeAssembledSitting({
        pool,
        limit,
        fieldId: "nursing",
        seed: limit,
        nclexExamMode: true,
      });
      expect(sitting.items).toHaveLength(limit);
      const groups = completeSequentialGroups(sitting.items).filter((group) => group.length === 6);
      expect(groups.length).toBeGreaterThanOrEqual(3);
      const early = sitting.items.slice(0, NCLEX_MINIMUM_ITEMS);
      const earlyGroups = completeSequentialGroups(early).filter((group) => group.length === 6);
      expect(earlyGroups.length).toBeGreaterThanOrEqual(3);
      const clinicalEarly = sitting.items.flatMap((item, index) => {
        const role = nclexShapeRole(item);
        return index < NCLEX_MINIMUM_ITEMS && (role === "bow_tie" || role === "trend") ? [index] : [];
      });
      expect(clinicalEarly).toEqual([]);
      if (limit > NCLEX_MINIMUM_ITEMS) {
        const clinicalLate = sitting.items.slice(NCLEX_MINIMUM_ITEMS).filter((item) => {
          const role = nclexShapeRole(item);
          return role === "bow_tie" || role === "trend";
        });
        expect(clinicalLate.length).toBeGreaterThan(0);
      }
    }
  });
});
