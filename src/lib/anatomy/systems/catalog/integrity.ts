import { ANATOMY_QUIZ_QUESTIONS, ANATOMY_TOURS } from "../../tours";
import { getAllAnatomyStructures, getAnatomyStructure } from "./queries";

/** Validates tour and quiz references against the structure catalog. */
export function assertCatalogContentIntegrity(): string[] {
  const issues: string[] = [];

  for (const tour of ANATOMY_TOURS) {
    for (const step of tour.steps) {
      if (!getAnatomyStructure(step.structureId)) {
        issues.push(`tour:${tour.id}:missing:${step.structureId}`);
      }
    }
  }

  for (const q of ANATOMY_QUIZ_QUESTIONS) {
    if (!getAnatomyStructure(q.structureId)) {
      issues.push(`quiz:${q.id}:missing:${q.structureId}`);
    }
    for (const d of q.distractorIds ?? []) {
      if (!getAnatomyStructure(d)) {
        issues.push(`quiz:${q.id}:distractor:${d}`);
      }
    }
  }

  const all = getAllAnatomyStructures();
  if (all.length < 30) {
    issues.push(`catalog:too-small:${all.length}`);
  }

  return issues;
}
