import type { DrugEntry } from "./types";
import type { ExamCode, ExamRelevance, Top300DrugCatalogDocument, Top300DrugRecord } from "./schema";
import { classifyDrug } from "./drug-classes";

/** Map internal catalog entry → canonical JSON record. */
export function drugEntryToRecord(drug: DrugEntry): Top300DrugRecord {
  return {
    id: drug.id,
    rank: drug.rank,
    generic: drug.generic,
    brand: drug.brand,
    class: drug.therapeuticClass,
    indications: drug.indications,
    sideEffects: drug.sideEffects,
    mnemonic: drug.mnemonic,
    examRelevance: drug.examRelevance,
    category: classifyDrug(drug.therapeuticClass),
  };
}

export function recordToDrugEntry(record: Top300DrugRecord): DrugEntry {
  return {
    id: record.id,
    rank: record.rank,
    generic: record.generic,
    brand: record.brand,
    therapeuticClass: record.class,
    indications: record.indications,
    sideEffects: record.sideEffects,
    mnemonic: record.mnemonic,
    examRelevance: record.examRelevance,
  };
}

export function buildCatalogDocument(drugs: DrugEntry[]): Top300DrugCatalogDocument {
  return {
    version: "1.0.0",
    source: "ClinCalc Top 500 (Any Exam Easy)",
    updatedAt: new Date().toISOString(),
    count: drugs.length,
    drugs: drugs.map(drugEntryToRecord),
  };
}

export function parseExamRelevance(value: unknown): ExamRelevance {
  if (!value || typeof value !== "object") {
    throw new Error("examRelevance must be an object with NCLEX, USMLE, NAPLEX booleans");
  }
  const obj = value as Record<string, unknown>;
  return {
    NCLEX: Boolean(obj.NCLEX),
    USMLE: Boolean(obj.USMLE),
    NAPLEX: Boolean(obj.NAPLEX),
  };
}

export function examsForDrug(relevance: ExamRelevance): ExamCode[] {
  return (["NCLEX", "USMLE", "NAPLEX"] as const).filter((code) => relevance[code]);
}
