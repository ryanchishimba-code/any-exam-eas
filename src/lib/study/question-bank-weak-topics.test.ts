import { describe, expect, it } from "vitest";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import {
  conceptKeyToSubjectSlug,
  primaryWeakSubjectId,
  weakSubjectIdsForField,
} from "./question-bank-weak-topics";

function row(partial: Partial<WeakTopicRow> & Pick<WeakTopicRow, "id" | "fieldId">): WeakTopicRow {
  return {
    name: partial.id,
    masteryScore: 40,
    attempts: 5,
    weight: 20,
    ...partial,
  };
}

describe("question-bank-weak-topics", () => {
  it("strips subject prefix from concept keys", () => {
    expect(conceptKeyToSubjectSlug("subject:cardiology")).toBe("cardiology");
  });

  it("returns field-scoped bank subject slugs in weakness order", () => {
    const weakTopics = [
      row({ id: "subject:cardiology", fieldId: "pance" }),
      row({ id: "subject:pulmonology", fieldId: "pance" }),
      row({ id: "subject:cardiology", fieldId: "nursing" }),
      row({ id: "tag:high-yield", fieldId: "pance" }),
    ];
    expect(
      weakSubjectIdsForField(weakTopics, "pance", ["cardiology", "pulmonology", "gi"])
    ).toEqual(["cardiology", "pulmonology"]);
  });

  it("picks the first resolvable weak subject", () => {
    const weakTopics = [row({ id: "subject:derm", fieldId: "pance" })];
    expect(primaryWeakSubjectId(weakTopics, "pance", ["cardiology"])).toBeNull();
    expect(primaryWeakSubjectId(weakTopics, "pance", ["derm", "cardiology"])).toBe("derm");
  });
});
