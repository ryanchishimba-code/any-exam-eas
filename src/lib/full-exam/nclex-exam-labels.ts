/**
 * What a student is allowed to see. Exam mode hides case titles and every
 * clinical-judgment step name. Practice hides the step names too. Review
 * pages may keep the internal names. Results use plain-language step labels.
 */

export const NCLEX_STEP_NAMES = [
  "Recognize cues",
  "Analyze cues",
  "Prioritize hypotheses",
  "Generate solutions",
  "Take action",
  "Evaluate outcomes",
] as const;

/** Results-page wording. These are not the licensed step names. */
export const GENERIC_JUDGMENT_LABELS = [
  "Noticing key findings",
  "Connecting the findings",
  "Deciding what matters most",
  "Choosing possible actions",
  "Carrying out the action",
  "Checking the result",
] as const;

const CLIENT_NEEDS: ReadonlyArray<{ test: RegExp; label: string }> = [
  { test: /management of care|management-of-care/i, label: "Management of Care" },
  { test: /safety and infection|safety & infection|safety-infection/i, label: "Safety and Infection Control" },
  { test: /health promotion|health-promotion/i, label: "Health Promotion and Maintenance" },
  { test: /psychosocial/i, label: "Psychosocial Integrity" },
  { test: /basic care|basic-care|comfort/i, label: "Basic Care and Comfort" },
  { test: /pharmacolog|parenteral|pharmacology-nursing/i, label: "Pharmacological and Parenteral Therapies" },
  { test: /reduction of risk|risk reduction|reduction-risk|risk-reduction/i, label: "Reduction of Risk Potential" },
  { test: /physiological adaptation|physiological-adaptation/i, label: "Physiological Adaptation" },
];

export type CaseChromeSurface = "exam" | "practice" | "review";

export function studentCaseChrome(input: {
  surface: CaseChromeSurface;
  step?: number | null;
  caseTitle?: string | null;
}): { stepLabel: string | null; caseTitle: string | null } {
  if (input.surface === "review") {
    const step = input.step;
    const stepLabel =
      typeof step === "number" && step >= 1 && step <= NCLEX_STEP_NAMES.length
        ? NCLEX_STEP_NAMES[step - 1]!
        : null;
    return { stepLabel, caseTitle: input.caseTitle?.trim() || null };
  }
  if (input.surface === "exam") return { stepLabel: null, caseTitle: null };
  return { stepLabel: null, caseTitle: input.caseTitle?.trim() || null };
}

/** Text that would be painted for one exam-mode item. Step names stay out. */
export function examModeItemText(input: {
  stem: string;
  step?: number | null;
  caseTitle?: string | null;
}): string {
  const chrome = studentCaseChrome({ surface: "exam", step: input.step, caseTitle: input.caseTitle });
  return [chrome.caseTitle, chrome.stepLabel, input.stem].filter(Boolean).join("\n");
}

export function withoutCaseTitle(vignette: string, title?: string | null): string {
  const trimmedTitle = title?.trim();
  if (!trimmedTitle) return vignette;
  const lines = vignette.split("\n");
  if (lines[0]?.trim() !== trimmedTitle) return vignette;
  return lines.slice(1).join("\n").trim();
}

export function genericJudgmentLabel(step: number | null | undefined): string | null {
  if (typeof step !== "number" || step < 1 || step > GENERIC_JUDGMENT_LABELS.length) return null;
  return GENERIC_JUDGMENT_LABELS[step - 1]!;
}

export function clientNeedLabel(...values: Array<string | null | undefined>): string | null {
  const haystack = values.filter((value) => typeof value === "string" && value.trim()).join(" ");
  if (!haystack) return null;
  for (const entry of CLIENT_NEEDS) {
    if (entry.test.test(haystack)) return entry.label;
  }
  return null;
}

export type ScoreRow = { correct: number; total: number; pct: number };

export function tallyLabeledScores(
  rows: ReadonlyArray<{ label: string | null; answered: boolean; correct: boolean }>
): Array<{ label: string } & ScoreRow> {
  const buckets = new Map<string, { correct: number; total: number }>();
  for (const row of rows) {
    if (!row.label || !row.answered) continue;
    const bucket = buckets.get(row.label) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (row.correct) bucket.correct += 1;
    buckets.set(row.label, bucket);
  }
  return [...buckets.entries()]
    .map(([label, bucket]) => ({
      label,
      correct: bucket.correct,
      total: bucket.total,
      pct: bucket.total > 0 ? Math.round((bucket.correct / bucket.total) * 100) : 0,
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

/**
 * Next locks the item just answered. The cursor never moves backward.
 * `lockedThrough` is the first index that can still be edited.
 */
export function lockAnswerOnNext(index: number, length: number): { index: number; lockedThrough: number } | "submit" {
  if (length <= 0 || index < 0) return "submit";
  const lockedThrough = index + 1;
  if (lockedThrough >= length) return "submit";
  return { index: lockedThrough, lockedThrough };
}

export function examAnswerEditable(index: number, lockedThrough: number): boolean {
  return index >= lockedThrough;
}
