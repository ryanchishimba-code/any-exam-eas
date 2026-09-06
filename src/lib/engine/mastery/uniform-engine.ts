/**
 * Uniform Mastery Engine — single fail-safe write path for every board.
 *
 * Layers (always, in order):
 *   A. ConceptMastery + LearningProfile readiness  (via recordAttemptWithMastery)
 *   B. QuestionMastery SRS / ability                 (via recordAttemptWithMastery)
 *   C. Skill Cell state machine                     (this module; board-gated)
 *
 * Fail-proof rules:
 *   - Cell writes never throw to the attempt UI
 *   - Missing ontology falls back to a stable system/topic key
 *   - Unknown fieldId is a no-op for cells (concept/SRS still recorded upstream)
 *   - Structured result always returned for observability
 */

import { examSlugFromFieldId } from "@/lib/edtech/exams";
import type { AttemptInput } from "@/lib/learning/types";
import type { ExamSlug } from "@/types/edtech";
import { getBoardMasteryCapabilities } from "./board-capabilities";
import {
  resolveCellKeyFromQuestion,
  skillCellKey,
} from "./cells";
import { parseMasteryItemTags } from "./item-tags";
import { recordCellAttempt } from "./persist";
import type { StudyItemMode, UserCellStateSnapshot } from "./types";

export type UniformCellWriteResult =
  | {
      ok: true;
      skipped?: false;
      examSlug: ExamSlug;
      cellKey: string;
      snapshot: UserCellStateSnapshot;
    }
  | {
      ok: true;
      skipped: true;
      reason: "no_exam" | "cells_disabled" | "unresolved_cell";
      examSlug?: ExamSlug;
    }
  | {
      ok: false;
      examSlug?: ExamSlug;
      error: string;
    };

export function studyModeToCellMode(studyMode?: string): StudyItemMode {
  if (
    studyMode === "timed" ||
    studyMode === "mock" ||
    studyMode === "cat"
  ) {
    return "timed";
  }
  return "tutor";
}

/** Default system axis when ontology cannot resolve a domain. */
export function defaultSystemKeyForExam(examSlug: ExamSlug): string {
  switch (examSlug) {
    case "nclex":
      return "physiological-adaptation";
    case "naplex":
      return "naplex-area3-treatment-planning";
    case "usmle":
      return "cardiovascular";
    case "pance":
      return "cardiovascular";
    case "aanp-fnp":
      return "primary-care";
    case "npte-pt":
      return "musculoskeletal";
    default:
      return "_general";
  }
}

/**
 * Resolve a Skill Cell for any board. Ontology boards use dedicated resolvers;
 * others use blueprint/subject fallback so writes never silently disappear.
 */
export function resolveUniformCellKey(input: {
  examSlug: ExamSlug;
  subjectId?: string | null;
  tagsCsv?: string | null;
  clientNeeds?: string | null;
  naplexDomain?: number | null;
  blueprintDomain?: string | null;
  blueprintTopic?: string | null;
  cellStrategy: "ontology" | "blueprint_fallback";
}): { cellKey: string; systemKey: string; topicKey: string } {
  const tags = parseMasteryItemTags({ tags: input.tagsCsv ?? null });
  const clientNeeds = input.clientNeeds ?? tags.clientNeeds;
  const naplexDomain = input.naplexDomain ?? tags.naplexDomain;

  const resolved = resolveCellKeyFromQuestion({
    examSlug: input.examSlug,
    subjectId: input.subjectId,
    clientNeeds,
    naplexDomain,
    blueprintDomain: input.blueprintDomain,
    blueprintTopic: input.blueprintTopic,
    topicCategory: input.subjectId,
  });

  if (resolved) {
    const parts = resolved.split(":");
    return {
      cellKey: resolved,
      systemKey: parts[1] ?? defaultSystemKeyForExam(input.examSlug),
      topicKey: parts[2] ?? input.subjectId ?? "_system",
    };
  }

  // Fail-soft fallback — always produce a stable cell so progress is tracked.
  const systemKey =
    clientNeeds ||
    input.blueprintDomain ||
    defaultSystemKeyForExam(input.examSlug);
  const topicKey = input.subjectId?.trim() || input.blueprintTopic?.trim() || "_system";
  const cellKey = skillCellKey(input.examSlug, systemKey, topicKey);
  return { cellKey, systemKey, topicKey };
}

/**
 * Record a Skill Cell attempt for the board owning `fieldId`.
 * Safe to call after concept/SRS persistence; never throws.
 */
export async function recordUniformCellAttempt(
  input: AttemptInput
): Promise<UniformCellWriteResult> {
  try {
    const examSlug = examSlugFromFieldId(input.fieldId);
    if (!examSlug) {
      return { ok: true, skipped: true, reason: "no_exam" };
    }

    const caps = getBoardMasteryCapabilities(examSlug);
    if (!caps.cellWrites) {
      return { ok: true, skipped: true, reason: "cells_disabled", examSlug };
    }

    const tagsCsv = input.question.tags?.join(",") ?? null;
    const { cellKey, systemKey, topicKey } = resolveUniformCellKey({
      examSlug,
      subjectId: input.question.subjectId,
      tagsCsv,
      cellStrategy: caps.cellStrategy,
    });

    if (!cellKey) {
      return { ok: true, skipped: true, reason: "unresolved_cell", examSlug };
    }

    const snapshot = await recordCellAttempt({
      userId: input.userId,
      examSlug,
      cellKey,
      systemKey,
      topicKey,
      correct: input.correct,
      mode: studyModeToCellMode(input.studyMode),
    });

    return { ok: true, examSlug, cellKey, snapshot };
  } catch (error) {
    const message = error instanceof Error ? error.message : "cell_write_failed";
    console.warn("[uniform-mastery] cell write failed:", message);
    return { ok: false, error: message };
  }
}
