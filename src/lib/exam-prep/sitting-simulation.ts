/**
 * Before/after sitting metrics on a synthetic bank shaped like the 2026-10-05
 * sittings: cloned templates, overlapping prior exams, keyed option A/B/C, and
 * published NGN rows the old gather never merged in.
 */
import type { BankItem } from "@/lib/question-bank";
import { sittingAskKey, sittingEntityKey } from "@/lib/exam-prep/entity-cap";
import { isServableToStudents } from "@/lib/exam-prep/student-eligibility";
import { assignSittingClusters } from "@/lib/exam-prep/sitting-clusters";
import { finalizeAssembledSitting } from "@/lib/exam-prep/sitting-selection";
import { isPublishedNgnBankItem } from "@/lib/full-exam/ngn-format-mix";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import { initCatSession, updateCatSession } from "@/lib/questions/cat-engine";
import { mapDifficultyToCatBand, pickCatNext } from "@/lib/questions/cat-select";
import { cappedNgnTargetRatio } from "@/lib/full-exam/nclex-cat-ngn";

const CHOICES = ["Hold the dose", "Continue and monitor", "Call the prescriber", "Document only"];

export type SittingMetrics = {
  count: number;
  dupRate: number;
  repeatRate: number;
  keyPosition: number[];
  ngnCount: number;
};

const DRUGS = [
  "amiodarone", "warfarin", "metformin", "lisinopril", "furosemide", "digoxin", "phenytoin",
  "lithium", "vancomycin", "gentamicin", "piperacillin", "meropenem", "linezolid", "azithromycin",
  "levofloxacin", "doxycycline", "clindamycin", "metronidazole", "fluconazole", "acyclovir",
  "oseltamivir", "albuterol", "tiotropium", "montelukast", "prednisone", "methotrexate",
  "hydroxychloroquine", "allopurinol", "colchicine", "sumatriptan", "propranolol", "carvedilol",
  "metoprolol", "diltiazem", "amlodipine", "hydralazine", "clonidine", "spironolactone",
  "apixaban", "rivaroxaban", "enoxaparin", "clopidogrel", "atorvastatin", "rosuvastatin",
  "ezetimibe", "insulin", "glipizide", "empagliflozin", "levothyroxine", "methimazole",
  "sertraline", "fluoxetine", "bupropion", "trazodone", "haloperidol", "quetiapine",
  "lamotrigine", "valproate", "carbamazepine", "gabapentin", "pregabalin", "morphine",
  "oxycodone", "naloxone", "acetaminophen", "ibuprofen", "celecoxib", "omeprazole",
  "sucralfate", "ondansetron", "metoclopramide", "lactulose", "rifaximin", "ursodiol",
  "tacrolimus", "mycophenolate", "cyclosporine", "filgrastim", "epoetin", "alendronate",
];

function uniqueChoices(seed: string): string[] {
  return [
    `Start ${seed} and arrange follow-up`,
    `Stop ${seed} immediately`,
    `Double the ${seed} dose`,
    `Ignore ${seed} and discharge`,
  ];
}

function mcq(
  id: string,
  stem: string,
  opts?: { itemType?: string; correctIndex?: number; choices?: string[] }
): BankItem {
  const options = opts?.choices ?? [...CHOICES];
  const correctIndex = opts?.correctIndex ?? 0;
  return {
    id,
    question: stem,
    options,
    correctAnswer: options[correctIndex] ?? options[0]!,
    explanation: `Option A is correct because the keyed choice matches the guideline. Option C delays care.`,
    itemType: opts?.itemType ?? "vignette",
    qualityScore: 1,
  };
}

const TEMPLATES = [
  "A patient taking lamotrigine starts an oral contraceptive. Which counseling point is most appropriate?",
  "A patient on sertraline reports insomnia. Which medication is the best addition?",
  "Which statement best describes the purpose of a loading dose?",
  "A vancomycin trough is 22 mg/L. Which adjustment is preferred?",
  "An older adult takes diphenhydramine at bedtime. Which Beers criterion applies?",
  "A client with alcohol use disorder has pancreatitis and hypotension. Which action is the priority?",
];

export type SimulatedBank = {
  /** What the old single pull tended to return: clones and already-seen rows. */
  narrow: BankItem[];
  /** Deeper pull plus published NGN the old path did not merge. */
  wide: BankItem[];
  seenIds: Set<string>;
  limit: number;
  fieldId: string;
};

function buildShared(fieldId: string, limit: number, uniqueExtra: number, ngnCount: number): SimulatedBank {
  const narrow: BankItem[] = [];
  const seenIds = new Set<string>();

  TEMPLATES.forEach((stem, templateIndex) => {
    for (let copy = 0; copy < 14; copy++) {
      const id = `tpl-${templateIndex}-${copy}`;
      narrow.push(
        mcq(
          id,
          stem.replace("A patient", `A ${24 + copy}-year-old patient`).replace("A client", `A ${30 + copy}-year-old client`)
        )
      );
      if (copy < 9) seenIds.add(id);
    }
  });

  for (let i = 0; i < 80; i++) {
    const id = `seen-unique-${i}`;
    const drug = DRUGS[i % DRUGS.length]!;
    narrow.push(
      mcq(
        id,
        `Which monitoring parameter is required before the next ${drug} dose in scenario${i}x for ${DRUGS[(i * 3) % DRUGS.length]}?`,
        {
          correctIndex: i % 3,
          choices: uniqueChoices(`${drug}-${i}`),
        }
      )
    );
    seenIds.add(id);
  }

  const fillerCount = Math.max(0, limit + 20 - narrow.length);
  const unseenFiller = Math.max(0, Math.round(limit * 0.37) - TEMPLATES.length * 5);
  for (let i = 0; i < fillerCount; i++) {
    const id = `fill-${i}`;
    const drug = DRUGS[(i * 5) % DRUGS.length]!;
    narrow.push(
      mcq(
        id,
        `Which counseling point applies before refilling ${drug} in refillcase${i}x for ${DRUGS[(i * 11) % DRUGS.length]}?`,
        { choices: uniqueChoices(`fill-${drug}-${i}`) }
      )
    );
    if (i >= unseenFiller) seenIds.add(id);
  }

  const extra: BankItem[] = [];
  for (let i = 0; i < uniqueExtra; i++) {
    const drug = DRUGS[i % DRUGS.length]!;
    const condition = DRUGS[(i * 7 + 3) % DRUGS.length]!;
    extra.push(
      mcq(
        `fresh-${i}`,
        `A new prescription for ${drug} is written for ${condition} in freshcase${i}x. Which baseline test is required before the first dose?`,
        { correctIndex: i % 3, choices: uniqueChoices(`fresh-${drug}-${condition}-${i}`) }
      )
    );
  }
  for (let i = 0; i < ngnCount; i++) {
    const drug = DRUGS[(i * 4) % DRUGS.length]!;
    const bowtie = i % 2 === 0;
    const choices = uniqueChoices(`ngn-${drug}-${i}`);
    const row = mcq(
      `ngn-${i}`,
      `Bow-tie for ${drug} toxicity: which actions and parameters apply in this ${DRUGS[(i * 9) % DRUGS.length]} case?`,
      {
        itemType: bowtie ? "ngn_bowtie" : "select_all",
        correctIndex: 0,
        choices,
      }
    );
    if (bowtie) {
      const action = `Give the ${drug} antidote now`;
      const monitor = `Recheck the ${drug} level in one hour`;
      row.ngnPayload = { condition: `${drug} toxicity`, actions: [action], monitors: [monitor] };
      row.correctAnswer = `${action}|||${monitor}`;
    }
    extra.push(row);
  }

  return {
    narrow,
    wide: [...narrow, ...extra],
    seenIds,
    limit,
    fieldId,
  };
}

/** NAPLEX-length pharmacy sitting and an NCLEX CAT-sized nursing pool. */
export function simulatedBoards(): { naplex: SimulatedBank; nclex: SimulatedBank } {
  return {
    naplex: buildShared("pharmacy", 225, 260, 0),
    nclex: buildShared("nursing", 150, 180, 40),
  };
}

/** Old path: unseen ids first, then a hard slice. No cluster cap and no NGN merge. */
export function legacySittingSlice(
  pool: readonly BankItem[],
  limit: number,
  seenIds: ReadonlySet<string>
): BankItem[] {
  const unseen: BankItem[] = [];
  const seen: BankItem[] = [];
  const used = new Set<string>();
  for (const item of pool) {
    const id = item.id?.trim() ?? "";
    if (!id || used.has(id)) continue;
    used.add(id);
    if (seenIds.has(id)) seen.push(item);
    else unseen.push(item);
  }
  return [...unseen, ...seen].slice(0, limit);
}

export function clusterDupRate(items: readonly BankItem[]): number {
  if (items.length === 0) return 0;
  const clusters = assignSittingClusters(items);
  const counts = new Map<string, number>();
  items.forEach((item, index) => {
    const payload = item.ngnPayload;
    if (payload && typeof payload === "object" && payload.kind === "sequential") return;
    const id = clusters[index]!;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  });
  let extras = 0;
  for (const count of counts.values()) {
    if (count > 1) extras += count - 1;
  }
  return extras / items.length;
}

export function keyPositionShares(items: readonly BankItem[], shuffle: boolean, seed = 11): number[] {
  const counts = [0, 0, 0, 0];
  let total = 0;
  items.forEach((item, index) => {
    if ((item.options?.length ?? 0) < 4) return;
    if (isPublishedNgnBankItem(item) && item.itemType !== "vignette") return;
    const study = examQuestionToStudy(
      {
        id: index + 1,
        bankItemId: item.id,
        type: "multiple_choice",
        question: item.question,
        options: item.options,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
      },
      index,
      shuffle ? { shuffleOptions: true, shuffleSeed: seed } : { shuffleOptions: false }
    );
    if (study.type !== "multiple_choice") return;
    const correct = study.correctAnswers[0];
    const position = study.options.findIndex((option) => option === correct);
    if (position >= 0 && position < 4) {
      counts[position] += 1;
      total += 1;
    }
  });
  return counts.map((count) => (total > 0 ? count / total : 0));
}

export function measureSitting(
  items: readonly BankItem[],
  seenIds: ReadonlySet<string>,
  shuffle: boolean
): SittingMetrics {
  const repeat = items.filter((item) => item.id && seenIds.has(item.id)).length;
  return {
    count: items.length,
    dupRate: clusterDupRate(items),
    repeatRate: items.length > 0 ? repeat / items.length : 0,
    keyPosition: keyPositionShares(items, shuffle),
    ngnCount: items.filter((item) => isPublishedNgnBankItem(item)).length,
  };
}

/** Walk the practice CAT the way the simulator does, stopping at `length`. */
export function deliverCatSitting(
  pool: readonly BankItem[],
  length: number,
  fieldId = "nursing"
): BankItem[] {
  const eligible = pool.filter((item) => isServableToStudents(item));
  const clusters = assignSittingClusters([...eligible]);
  const items = eligible.map((item, index) => {
    const text = [item.scenario, item.vignette, item.question].filter(Boolean).join("\n");
    return {
      id: item.id ?? `row-${index}`,
      difficultyBand: mapDifficultyToCatBand(index % 3 === 0 ? "easy" : index % 3 === 1 ? "medium" : "hard", index),
      ngn: isPublishedNgnBankItem(item),
      entityKey: sittingEntityKey(text, fieldId),
      askKey: sittingAskKey(item.question) ?? sittingAskKey(text),
      clusterId: clusters[index],
      item,
    };
  });
  const delivered: typeof items = [];
  const used = new Set<string>();
  let state = initCatSession();
  for (let i = 0; i < length; i++) {
    const next = pickCatNext(state, items, used, () => 0.1, {
      ngnTargetRatio: cappedNgnTargetRatio(
        items.filter((item) => item.ngn).length,
        items.length
      ),
      delivered,
    });
    if (!next) break;
    used.add(next.id);
    delivered.push(next);
    state = updateCatSession(state, i % 2 === 0, next.difficultyBand);
  }
  return delivered.map((row) => row.item);
}

export function simulateCatNgnCount(pool: readonly BankItem[], length: number, fieldId = "nursing"): number {
  return deliverCatSitting(pool, length, fieldId).filter((item) => isPublishedNgnBankItem(item)).length;
}

export function compareSitting(board: SimulatedBank): { before: SittingMetrics; after: SittingMetrics } {
  const beforeItems = legacySittingSlice(board.narrow, board.limit, board.seenIds);
  const afterItems = finalizeAssembledSitting({
    pool: board.wide,
    limit: board.limit,
    fieldId: board.fieldId,
    seenIds: board.seenIds,
    seed: 42,
    includeNgn: board.fieldId === "nursing",
  }).items;
  return {
    before: measureSitting(beforeItems, board.seenIds, false),
    after: measureSitting(afterItems, board.seenIds, true),
  };
}
