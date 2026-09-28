/**
 * One scored-item count for every board, public page, and the Qbank.
 *
 * A question is one item a student can answer:
 * - one student-eligible QuestionBankItem row (MCQ, SATA, constructed response, CCS)
 * - one published standalone NGN item
 * - one published item inside a published case study
 *
 * A case study is not an extra question. QuestionBankItem rows that are already
 * case-style or NGN-style stay inside the bank-item total. They are not added again.
 */
import type { PublishedCatalog } from "@/lib/assessment/serve";
import { blueprintAreaLabel, blueprintCategoryIdForQuestion } from "@/lib/inventory/blueprint-domain-pool";
import type { FormatCounts, InventoryCategoryCount } from "@/lib/inventory/active-questions";

export const COUNT_BOARD_SLUGS = [
  "nclex",
  "usmle",
  "naplex",
  "pance",
  "aanp-fnp",
  "npte-pt",
] as const;

export type CountBoardSlug = (typeof COUNT_BOARD_SLUGS)[number];

export const QUESTION_UNIT_DEFINITION =
  "A question is one scored item: a student-eligible bank row, a published standalone NGN item, or a published item inside a published case study. The case study itself is not an extra question.";

export type BoardQuestionUnits = {
  slug: CountBoardSlug;
  /** Student-eligible QuestionBankItem rows. Each row is one scored item. */
  bankItems: number;
  /** Partition of bankItems. These three sum to bankItems. */
  standaloneMcq: number;
  /** SATA and other NGN-style rows already inside bankItems. */
  bankNgnStyle: number;
  /** CCS and other case-style rows already inside bankItems. */
  bankCaseStyle: number;
  /** Published ngn_item standalones. Not stored on QuestionBankItem. */
  standaloneNgn: number;
  /** Published ngn_case shells. Not scored questions. */
  caseStudies: number;
  /** Published scored items inside those case studies. */
  caseItems: number;
};

export type ClinicalQuestionExtra = {
  standaloneNgn: number;
  caseStudies: number;
  caseItems: number;
};

export function scoredQuestionCount(
  units: Pick<BoardQuestionUnits, "bankItems" | "standaloneNgn" | "caseItems">
): number {
  return units.bankItems + units.standaloneNgn + units.caseItems;
}

export function formatExactQuestionCount(count: number): string {
  return Math.max(0, Math.floor(count)).toLocaleString("en-US");
}

/**
 * Floor to the nearest hundred and append "+".
 * Counts under 100 stay exact. Never rounds up.
 */
export function formatRoundedDownQuestionCount(count: number): string {
  const whole = Math.max(0, Math.floor(count));
  if (whole < 100) return formatExactQuestionCount(whole);
  const floored = Math.floor(whole / 100) * 100;
  return `${formatExactQuestionCount(floored)}+`;
}

function countNoun(count: number, one: string, many: string): string {
  return `${formatExactQuestionCount(count)} ${count === 1 ? one : many}`;
}

/**
 * Honest sentence.
 * NCLEX: "5,636 questions, including 60 items in 10 case studies and 10 standalone NGN items"
 * A board with no separate NGN catalog: "17,276 questions"
 */
export function formatBoardQuestionSentence(
  units: Pick<BoardQuestionUnits, "bankItems" | "standaloneNgn" | "caseStudies" | "caseItems">
): string {
  const total = scoredQuestionCount(units);
  const head = countNoun(total, "question", "questions");
  const parts: string[] = [];
  if (units.caseStudies > 0) {
    parts.push(
      `${countNoun(units.caseItems, "item", "items")} in ${countNoun(units.caseStudies, "case study", "case studies")}`
    );
  }
  if (units.standaloneNgn > 0) {
    parts.push(countNoun(units.standaloneNgn, "standalone NGN item", "standalone NGN items"));
  }
  if (parts.length === 0) return head;
  return `${head}, including ${parts.join(" and ")}`;
}

export function emptyClinicalExtra(): ClinicalQuestionExtra {
  return { standaloneNgn: 0, caseStudies: 0, caseItems: 0 };
}

export function boardQuestionUnits(input: {
  slug: CountBoardSlug;
  bankItems: number;
  formats?: { mcq: number; ngn: number; case: number } | null;
  clinical?: ClinicalQuestionExtra | null;
}): BoardQuestionUnits {
  const formats = input.formats ?? { mcq: input.bankItems, ngn: 0, case: 0 };
  const clinical = input.clinical ?? emptyClinicalExtra();
  return {
    slug: input.slug,
    bankItems: input.bankItems,
    standaloneMcq: formats.mcq,
    bankNgnStyle: formats.ngn,
    bankCaseStyle: formats.case,
    standaloneNgn: clinical.standaloneNgn,
    caseStudies: clinical.caseStudies,
    caseItems: clinical.caseItems,
  };
}

export function clinicalExtraFromCatalog(catalog: PublishedCatalog | null | undefined): ClinicalQuestionExtra {
  if (!catalog) return emptyClinicalExtra();
  return {
    standaloneNgn: catalog.standalones.length,
    caseStudies: catalog.cases.length,
    caseItems: catalog.cases.reduce((sum, unit) => sum + unit.items.length, 0),
  };
}

export type SiteQuestionCounts = {
  boards: Record<CountBoardSlug, BoardQuestionUnits>;
  totalQuestions: number;
  sentence: string;
  roundedDown: string;
};

/**
 * Canonical public board totals. SEO metadata reads this stamp so the
 * document head does not wait on a database round trip. Live pages may
 * still render the bank snapshot when it is available.
 */
export const PUBLISHED_BOARD_UNITS: Record<CountBoardSlug, BoardQuestionUnits> = {
  nclex: boardQuestionUnits({
    slug: "nclex",
    bankItems: 5566,
    formats: { mcq: 5566, ngn: 0, case: 0 },
    clinical: { standaloneNgn: 10, caseStudies: 10, caseItems: 60 },
  }),
  usmle: boardQuestionUnits({
    slug: "usmle",
    bankItems: 17276,
    formats: { mcq: 17276, ngn: 0, case: 0 },
  }),
  naplex: boardQuestionUnits({
    slug: "naplex",
    bankItems: 10066,
    formats: { mcq: 10066, ngn: 0, case: 0 },
  }),
  pance: boardQuestionUnits({
    slug: "pance",
    bankItems: 2938,
    formats: { mcq: 2938, ngn: 0, case: 0 },
  }),
  "aanp-fnp": boardQuestionUnits({
    slug: "aanp-fnp",
    bankItems: 6105,
    formats: { mcq: 6105, ngn: 0, case: 0 },
  }),
  "npte-pt": boardQuestionUnits({
    slug: "npte-pt",
    bankItems: 4240,
    formats: { mcq: 4240, ngn: 0, case: 0 },
  }),
};

export function publishedSiteQuestionCounts(): SiteQuestionCounts {
  return siteQuestionCounts(PUBLISHED_BOARD_UNITS);
}

export function siteQuestionCounts(
  boards: Record<CountBoardSlug, BoardQuestionUnits>
): SiteQuestionCounts {
  const list = COUNT_BOARD_SLUGS.map((slug) => boards[slug]);
  const standaloneNgn = list.reduce((sum, board) => sum + board.standaloneNgn, 0);
  const caseStudies = list.reduce((sum, board) => sum + board.caseStudies, 0);
  const caseItems = list.reduce((sum, board) => sum + board.caseItems, 0);
  const bankItems = list.reduce((sum, board) => sum + board.bankItems, 0);
  const totalQuestions = bankItems + standaloneNgn + caseItems;
  return {
    boards,
    totalQuestions,
    sentence: formatBoardQuestionSentence({ bankItems, standaloneNgn, caseStudies, caseItems }),
    roundedDown: formatRoundedDownQuestionCount(totalQuestions),
  };
}

type ClinicalUnit = {
  subjectId: string | null;
  /** Scored items this unit adds to topic and area totals. */
  scoredItems: number;
  /** Practice-unit bucket. A case study counts as one case, not as its items. */
  format: "ngn" | "case";
};

function unitsFromCatalog(catalog: PublishedCatalog): ClinicalUnit[] {
  const standalones: ClinicalUnit[] = catalog.standalones.map((unit) => ({
    subjectId: unit.subjectId,
    scoredItems: 1,
    format: "ngn",
  }));
  const cases: ClinicalUnit[] = catalog.cases.map((unit) => ({
    subjectId: unit.subjectId,
    scoredItems: unit.items.length,
    format: "case",
  }));
  return [...standalones, ...cases];
}

export type ScoredClinicalApplication = {
  topicCounts: Record<string, number>;
  /** QuestionBankItem topic counts, before published NGN items were added. */
  sessionCounts: Record<string, number>;
  categories: InventoryCategoryCount[];
  formats: FormatCounts | null;
  topicFormats: Record<string, FormatCounts>;
  total: number;
  bankItemTotal: number;
  unmappedTopics: number;
  unmappedAreas: number;
  clinical: ClinicalQuestionExtra;
};

/**
 * Add published NGN standalones and case items onto the student-eligible bank.
 * Format cards stay practice units: standalone items and case-study shells.
 */
export function applyScoredClinicalCatalog(input: {
  fieldId: string;
  bankTotal: number;
  topicCounts: Record<string, number>;
  formats: FormatCounts | null;
  topicFormats: Record<string, FormatCounts> | null;
  categories: InventoryCategoryCount[];
  catalog: PublishedCatalog | null;
}): ScoredClinicalApplication {
  const sessionCounts = { ...input.topicCounts };
  const topicCounts = { ...input.topicCounts };
  const categories = input.categories.map((category) => ({ ...category }));
  const topicFormats: Record<string, FormatCounts> = {};
  for (const [id, counts] of Object.entries(input.topicFormats ?? {})) {
    topicFormats[id] = { ...counts };
  }
  const formats = input.formats
    ? { mcq: input.formats.mcq, ngn: input.formats.ngn, case: input.formats.case }
    : null;
  const clinical = clinicalExtraFromCatalog(input.catalog);
  let unmappedTopics = 0;
  let unmappedAreas = 0;

  if (input.catalog) {
    for (const unit of unitsFromCatalog(input.catalog)) {
      if (unit.subjectId) {
        topicCounts[unit.subjectId] = (topicCounts[unit.subjectId] ?? 0) + unit.scoredItems;
        const current = topicFormats[unit.subjectId] ?? { mcq: 0, ngn: 0, case: 0 };
        current[unit.format] += 1;
        topicFormats[unit.subjectId] = current;
      } else {
        unmappedTopics += unit.scoredItems;
      }

      const areaId = unit.subjectId
        ? blueprintCategoryIdForQuestion(input.fieldId, {
            subjectId: unit.subjectId,
            clientNeeds: null,
          })
        : null;
      if (!areaId) {
        unmappedAreas += unit.scoredItems;
      } else {
        const existing = categories.find((category) => category.id === areaId);
        if (existing) {
          existing.count += unit.scoredItems;
        } else {
          categories.push({
            id: areaId,
            label: blueprintAreaLabel(input.fieldId, areaId) ?? areaId,
            count: unit.scoredItems,
          });
        }
      }

      if (formats) formats[unit.format] += 1;
    }
  }

  return {
    topicCounts,
    sessionCounts,
    categories,
    formats,
    topicFormats,
    total: input.bankTotal + clinical.standaloneNgn + clinical.caseItems,
    bankItemTotal: input.bankTotal,
    unmappedTopics,
    unmappedAreas,
    clinical,
  };
}

/** Published NGN catalog for the boards that store one. Nursing is the only field today. */
export async function loadClinicalExtrasByBoard(): Promise<
  Partial<Record<CountBoardSlug, ClinicalQuestionExtra>>
> {
  const { loadPublishedClinicalBank } = await import("@/lib/assessment/serve-db");
  const nursing = await loadPublishedClinicalBank("nursing");
  const extra = clinicalExtraFromCatalog(nursing.catalog);
  if (extra.standaloneNgn === 0 && extra.caseStudies === 0 && extra.caseItems === 0) return {};
  return { nclex: extra };
}
