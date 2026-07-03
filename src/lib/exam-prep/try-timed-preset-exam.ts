/**
 * Fast path for timed/full exams — serve pre-composed preset exams from the DB
 * instead of runtime blueprint compose + progressive gather.
 */
import type { BankItem } from "@/lib/question-bank";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { clampPresetExamNumber, PRESET_EXAM_MAX } from "@/lib/exam-prep/preset-exam-config";
import { loadPresetExamItems } from "@/lib/exam-prep/load-preset-exam";
import type { ExamSlug } from "@/types/edtech";

export type TimedPresetSessionResult = {
  items: BankItem[];
  examSlug: ExamSlug;
  examNumber: number;
};

function seededShuffle<T>(items: T[], seed: number): T[] {
  let a = seed >>> 0;
  const rng = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function presetExamNumbersToTry(seed: number, attempts = 4): number[] {
  const base = clampPresetExamNumber((seed % PRESET_EXAM_MAX) + 1);
  const nums = new Set<number>([base]);
  for (let i = 1; nums.size < attempts; i++) {
    nums.add(clampPresetExamNumber(base + i * 17));
    nums.add(clampPresetExamNumber(base + i * 31));
  }
  return [...nums];
}

/** Load a pre-composed preset and slice/shuffle to the requested session length. */
export async function tryLoadTimedPresetSession(params: {
  fieldId: string;
  limit: number;
  seed?: number;
}): Promise<TimedPresetSessionResult | null> {
  const examSlug = examSlugFromFieldId(params.fieldId);
  if (!examSlug) return null;

  const seed = params.seed ?? ((Date.now() ^ 0x51ed270b) >>> 0);
  const examNumbers = presetExamNumbersToTry(seed);

  for (const examNumber of examNumbers) {
    const row = await loadPresetExamItems(examSlug, examNumber);
    if (!row || row.items.length < params.limit) continue;
    if (row.fieldId && row.fieldId !== params.fieldId) continue;
    const items = seededShuffle(row.items, seed ^ examNumber).slice(0, params.limit);
    if (items.length < params.limit) continue;
    return { items, examSlug, examNumber: row.examNumber };
  }

  return null;
}
