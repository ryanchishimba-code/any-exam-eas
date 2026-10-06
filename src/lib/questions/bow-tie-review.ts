import { deserializeExamSelection } from "@/lib/full-exam/answer-serialize";
import type { FullExamBowTieSnapshot } from "@/types/full-exam";

export type BowTieReviewChoice = {
  text: string;
  selected: boolean;
  correct: boolean;
};

export type BowTieReviewColumns = {
  actions: BowTieReviewChoice[];
  conditions: BowTieReviewChoice[];
  parameters: BowTieReviewChoice[];
};

function norm(value: string): string {
  return value.trim().toLowerCase();
}

function marked(choices: string[], selected: Set<string>, correct: Set<string>): BowTieReviewChoice[] {
  const seen = new Set<string>();
  const rows: BowTieReviewChoice[] = [];
  for (const text of choices) {
    const key = norm(text);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    rows.push({
      text,
      selected: selected.has(key),
      correct: correct.has(key),
    });
  }
  return rows;
}

/** Condition, actions, and parameters for the post-exam bow-tie review. */
export function bowTieReviewColumns(input: {
  question: string;
  options: string[];
  correctAnswer: string;
  selected: string;
  ngnFormat?: string;
  bowTie?: FullExamBowTieSnapshot;
}): BowTieReviewColumns | null {
  const looks =
    input.ngnFormat === "bow_tie" ||
    Boolean(input.bowTie?.conditionOptions?.length) ||
    /bow-?tie|actions to take|parameters to monitor|conditions to monitor/i.test(input.question);
  if (!looks) return null;

  const selectedParts = deserializeExamSelection(input.selected);
  const correctParts = deserializeExamSelection(input.correctAnswer);
  const selectedSet = new Set(selectedParts.map(norm));
  const correctSet = new Set(correctParts.map(norm));
  const bow = input.bowTie;
  const actions = bow?.actions ?? [];
  const parameters = bow?.monitors ?? [];
  const known = new Set([...actions, ...parameters, ...(bow?.conditionOptions ?? []), ...input.options].map(norm));

  let conditions = bow?.conditionOptions?.length ? [...bow.conditionOptions] : [];
  if (conditions.length === 0 && bow?.condition && !/^(?:clinical condition|patient presentation)$/i.test(bow.condition)) {
    conditions = [bow.condition];
  }
  if (conditions.length === 0) {
    const seen = new Set<string>();
    conditions = [...correctParts, ...selectedParts].filter((part) => {
      const key = norm(part);
      if (!key || known.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  if (actions.length === 0 && parameters.length === 0 && conditions.length === 0) return null;

  return {
    actions: marked(actions, selectedSet, correctSet),
    conditions: marked(conditions, selectedSet, correctSet),
    parameters: marked(parameters, selectedSet, correctSet),
  };
}
