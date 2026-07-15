import { describe, expect, it } from "vitest";
import { isValidAnatomyStructureId } from "@/lib/anatomy/structure-ids";
import { REVIEW_MODULE_ANATOMY } from "@/lib/anatomy/review-module-anatomy";
import { ANATOMY_PROCEDURES } from "@/lib/anatomy/procedures";
import { CURATED_DISEASE_LINKS } from "@/lib/anatomy/clinical-links";
import {
  resolveStructureIdsForStudyItem,
  TOPIC_STRUCTURE_IDS_FOR_AUDIT,
} from "./anatomy-study-meta";

describe("anatomy structure id integrity", () => {
  it("TOPIC_STRUCTURE_IDS_FOR_AUDIT only references published structures", () => {
    for (const [topic, ids] of Object.entries(TOPIC_STRUCTURE_IDS_FOR_AUDIT)) {
      for (const id of ids) {
        expect(isValidAnatomyStructureId(id), `${topic} → ${id}`).toBe(true);
      }
    }
  });

  it("review modules only reference published structures and known diseases", () => {
    const diseaseIds = new Set(CURATED_DISEASE_LINKS.map((d) => d.id));
    for (const [slug, link] of Object.entries(REVIEW_MODULE_ANATOMY)) {
      for (const id of link.structureIds) {
        expect(isValidAnatomyStructureId(id), `${slug} → ${id}`).toBe(true);
      }
      for (const diseaseId of link.diseaseIds ?? []) {
        expect(diseaseIds.has(diseaseId), `${slug} → disease ${diseaseId}`).toBe(true);
      }
    }
  });

  it("procedures only reference published structures", () => {
    for (const proc of ANATOMY_PROCEDURES) {
      for (const id of proc.structureIds) {
        expect(isValidAnatomyStructureId(id), `${proc.id} → ${id}`).toBe(true);
      }
    }
  });

  it("resolves neurology topics to brain", () => {
    const ids = resolveStructureIdsForStudyItem({
      subjectId: "neurology-stroke",
      topicCategory: "stroke",
    });
    expect(ids).toContain("brain");
    expect(ids.every((id) => isValidAnatomyStructureId(id))).toBe(true);
  });

  it("neurology-stroke review module prefers brain over spinal-cord proxy", () => {
    expect(REVIEW_MODULE_ANATOMY["neurology-stroke"]?.structureIds).toContain("brain");
    expect(REVIEW_MODULE_ANATOMY["neurology-stroke"]?.structureIds).not.toContain(
      "spinal-cord"
    );
  });
});
