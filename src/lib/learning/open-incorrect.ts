/**
 * Still-incorrect items from persisted QuestionAttempt rows.
 * Open means missed and not yet cleared by spaced re-proof or mark-mastered.
 * Ephemeral numeric session keys (no bank id) are ignored.
 *
 * The rule lives in `item-mastery.ts` so Review incorrect and Analytics share it.
 */

export {
  attemptItemId,
  countOpenIncorrectItems,
  type MasteryAttempt as AttemptCorrectnessRow,
} from "@/lib/learning/item-mastery";
