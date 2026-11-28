import { TRIAL_DAYS } from "@/lib/billing-config";
import { SEO_DESC_MAX, SEO_DESC_MIN, assertMetaDescription } from "@/lib/seo/meta-budget";
import { SITE_NAME } from "@/lib/site";
import type { ExamSlug } from "@/types/edtech";

/** Rendered hub title. Absolute so the root template does not add the brand twice. */
export const QOTD_HUB_TITLE = `Question of the Day — Free Board Exam Practice | ${SITE_NAME}`;

/**
 * Evergreen /daily/{board} descriptions. Fixed copy, 140–160 characters,
 * independent of the day's stem so the meta cannot cut off mid-question.
 */
export const QOTD_EXAM_DESCRIPTIONS = {
  nclex:
    "Free NCLEX question of the day. Answer a board-style item with a rationale for every choice, no account required, then start a 5-day free trial.",
  usmle:
    "Free USMLE question of the day for Steps 1, 2 CK, and 3. Answer a vignette with a rationale for every choice, no account required, then a 5-day free trial.",
  naplex:
    "Free NAPLEX question of the day. Practice calculations or a drug-therapy item with a rationale for every choice, no account required, then a 5-day free trial.",
  pance:
    "Free PANCE question of the day. Answer an NCCPA blueprint vignette with a rationale for every choice, no account required, then start a 5-day free trial.",
  "aanp-fnp":
    "Free AANP FNP question of the day. Answer a primary-care item across the lifespan with a rationale for every choice, then start a 5-day free trial.",
  "npte-pt":
    "Free NPTE-PT question of the day. Answer a physical therapy scenario with a rationale for every choice, no account required, then start a 5-day free trial.",
} as const satisfies Record<ExamSlug, string>;

export function qotdExamMetaDescription(exam: ExamSlug): string {
  return assertMetaDescription(QOTD_EXAM_DESCRIPTIONS[exam], `/daily/${exam}`);
}

export function qotdExamTitle(boardName: string): string {
  return `${boardName} Question of the Day | ${SITE_NAME}`;
}

export function qotdDatedTitle(boardName: string, isoDate: string): string {
  return `${boardName} Question of the Day — ${isoDate} | ${SITE_NAME}`;
}

/** Dated and per-exam descriptions stay inside 140–160. Stems are cut on a word boundary. */
export function qotdMetaDescription(boardName: string, stem: string): string {
  const tail = ` ${boardName} question of the day. Try it, then a ${TRIAL_DAYS}-day free trial.`;
  const room = SEO_DESC_MAX - tail.length;
  let head = stem.replace(/\s+/g, " ").trim();
  if (head.length > room) {
    const cut = head.slice(0, room);
    const space = cut.lastIndexOf(" ");
    head = (space > 24 ? cut.slice(0, space) : cut).trimEnd().replace(/[.,;:]+$/, "");
  }
  let out = `${head}${tail}`.replace(/\s+/g, " ").trim();
  const filler = " No account is required to answer.";
  if (out.length < SEO_DESC_MIN && out.length + filler.length <= SEO_DESC_MAX) {
    out = `${out}${filler}`;
  }
  if (out.length > SEO_DESC_MAX) {
    out = out.slice(0, SEO_DESC_MAX).replace(/\s+\S*$/, "").trimEnd();
  }
  return out;
}
