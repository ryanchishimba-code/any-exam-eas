import type { Top300DrugRecord } from "./schema";
import type { ExamRelevance } from "./schema";

/** Map Prisma Top300Drug row fields ↔ canonical record. */
export type Top300DrugDbShape = {
  id: string;
  rank: number;
  generic: string;
  brand: string;
  drugClass: string;
  indications: string;
  sideEffects: string;
  mnemonic: string;
  examNclex: boolean;
  examUsmle: boolean;
  examNaplex: boolean;
  category: string | null;
};

export function examRelevanceFromDb(row: Pick<Top300DrugDbShape, "examNclex" | "examUsmle" | "examNaplex">): ExamRelevance {
  return {
    NCLEX: row.examNclex,
    USMLE: row.examUsmle,
    NAPLEX: row.examNaplex,
  };
}

export function dbRowFromRecord(record: Top300DrugRecord): Top300DrugDbShape {
  return {
    id: record.id,
    rank: record.rank,
    generic: record.generic,
    brand: record.brand,
    drugClass: record.class,
    indications: record.indications,
    sideEffects: record.sideEffects,
    mnemonic: record.mnemonic,
    examNclex: record.examRelevance.NCLEX,
    examUsmle: record.examRelevance.USMLE,
    examNaplex: record.examRelevance.NAPLEX,
    category: record.category ?? null,
  };
}

export function recordFromDbRow(row: Top300DrugDbShape): Top300DrugRecord {
  return {
    id: row.id,
    rank: row.rank,
    generic: row.generic,
    brand: row.brand,
    class: row.drugClass,
    indications: row.indications,
    sideEffects: row.sideEffects,
    mnemonic: row.mnemonic,
    examRelevance: examRelevanceFromDb(row),
    category: row.category ?? undefined,
  };
}
