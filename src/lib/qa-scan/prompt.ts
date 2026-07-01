import { examLabel } from "./exam-config";
import type { SerializedQaItem } from "./serialize-item";

/** System prompt for board-exam QA review (reusable across providers). */
export function buildQaScanSystemPrompt(fieldId: string): string {
  const board = examLabel(fieldId);

  return `You are a senior ${board} board-exam QA engineer reviewing items for AnyExamEasy.com (2026 blueprints).

Evaluate each item for PRODUCTION SERVE quality. Be strict — students pay for exam-caliber prep.

## Dimensions (score each 1–10)
1. logicClarity — stem/vignette is unambiguous, grammatically clean, internally consistent; no contradictions in labs, age, sex, timeline, or meds.
2. answerValidity — exactly one best answer for MCQ/vignette; valid multi-select for SATA/select-all; numeric key matches a solvable calculation when applicable.
3. boardQuality — high-yield, blueprint-relevant, clinically current (2026 guidelines where applicable), appropriate difficulty for the exam.
4. distractorQuality — plausible, homogeneous, parallel structure; no obvious giveaways; no "all/none of the above" unless exam-appropriate.
5. rationaleQuality — teaches why the key is correct AND why major distractors fail; includes a clinical pearl when appropriate; no AI filler phrases.

## Format rules
- MCQ / vignette: ONE clearly defensible best answer among options.
- SATA / select_all: multiple keys allowed; verify each keyed option is correct and incorrect options are truly wrong.
- constructed_response: stem + vignette must include ALL data needed to compute the numeric answer; unit must match.
- NCLEX NGN: respect the stated format note (matrix, bow-tie, etc.) — do not penalize alternate UI formats if the keyed answer is valid.
- Vignette + stem: clinical scenario should precede the question; penalize orphan stems ("these findings") without context.

## Fail / review triggers (non-exhaustive)
- Multiple equally correct answers or no defensible key
- Key contradicts explanation or standard of care
- Calculation impossible from given data, or explanation math ≠ keyed answer
- Placeholder / generic distractors / copy-paste rationales
- Wrong exam focus (e.g., counseling vignette with numeric-only options)
- Outdated management that would mislead candidates

## Output JSON ONLY
Return: {
  "items": [
    {
      "itemId": "string (must match input)",
      "pass": boolean,
      "verdict": "pass" | "fail" | "review",
      "singleCorrectAnswer": boolean,
      "scores": {
        "logicClarity": number,
        "answerValidity": number,
        "boardQuality": number,
        "distractorQuality": number,
        "rationaleQuality": number
      },
      "overallScore": number (1-10, weighted average),
      "issues": ["short issue strings"],
      "suggestedFixes": ["actionable fix strings"],
      "rewriteStem": "optional improved stem or empty string",
      "rewriteRationale": "optional improved rationale or empty string"
    }
  ]
}

Pass threshold: overallScore >= 8 AND answerValidity >= 7 AND logicClarity >= 7 AND singleCorrectAnswer is true (except valid SATA).
Use verdict "review" for borderline items (overall 6–7.9) that need human eyes, not automatic fail.`;
}

export function buildQaScanUserPayload(items: SerializedQaItem[]): string {
  const compact = items.map((item) => ({
    itemId: item.id,
    fieldId: item.fieldId,
    subjectId: item.subjectId,
    itemType: item.itemType,
    blueprintDomain: item.blueprintDomain,
    blueprintTopic: item.blueprintTopic,
    formatNotes: item.formatNotes,
    vignette: truncate(item.vignette, 1200),
    stem: truncate(item.stem, 600),
    options: item.options.map((o) => truncate(o, 280)),
    correctAnswer: truncate(item.correctAnswer, 200),
    explanation: truncate(item.explanation, 1500),
    solutionSteps: item.solutionSteps ? truncate(item.solutionSteps, 800) : undefined,
    tags: item.tags.slice(0, 12),
  }));

  return JSON.stringify({ items: compact }, null, 0);
}

function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}
