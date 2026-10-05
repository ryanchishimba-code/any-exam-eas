import { describe, expect, it } from "vitest";
import { getFieldMeta, getFieldMetaById, STUDY_FIELDS } from "@/lib/fields";
import { getRegisteredSubjectIds, resolveSubjectModule } from "@/lib/subjects/registry";
import {
  getSubjectArea as catalogArea,
  getSubjectsForFieldId as catalogSubjects,
} from "@/lib/subjects/subject-catalog";
import {
  getSubjectArea as registryArea,
  getSubjectsForFieldId as registrySubjects,
} from "@/lib/subjects/registry";

describe("subject catalog", () => {
  it("matches the registry topic ids and field labels for every practice board", () => {
    const ids = getRegisteredSubjectIds();
    expect(STUDY_FIELDS.map((field) => field.id)).toEqual(ids);

    for (const id of ids) {
      const meta = resolveSubjectModule(id).metadata;
      const field = getFieldMetaById(id);
      expect(field?.label).toBe(meta.label);
      expect(field?.boardExam).toBe(meta.boardExam);
      expect(field?.examFocus).toBe(meta.examFocus);
      expect(field?.topicPlaceholder).toBe(meta.topicPlaceholder);
      expect(field?.oerDomains).toEqual(meta.oerDomains);
      const catalogIds = catalogSubjects(id).map((subject) => subject.id);
      expect(catalogIds).toEqual(registrySubjects(id).map((subject) => subject.id));
      const sample = catalogIds[0];
      if (sample) {
        expect(catalogArea(id, sample)?.label).toBe(registryArea(id, sample)?.label);
      }
    }

    expect(getFieldMeta("NAPLEX")?.id).toBe("pharmacy");
    expect(catalogSubjects("not-a-board").map((subject) => subject.id)).toEqual(
      registrySubjects("not-a-board").map((subject) => subject.id)
    );
  });
});
