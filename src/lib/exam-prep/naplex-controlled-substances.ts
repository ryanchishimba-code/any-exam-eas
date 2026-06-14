import type { DrugEntry } from "@/lib/drugs300/types";

const CONTROLLED_SUBSTANCE_PATTERN =
  /opioid|benzodiazepine|schedule\s*(ii|iii|iv|v)|\bschedule ii\b|\bschedule iii\b|\bschedule iv\b|\bschedule v\b|cns stimulant|amphetamine|methylphenidate|methamphetamine|buprenorphine|hydrocodone|oxycodone|morphine|fentanyl|codeine|tramadol|alprazolam|lorazepam|clonazepam|diazepam|zolpidem|testosterone.*schedule|anabolic steroid.*dea/i;

const NON_CONTROLLED_HINT = /not controlled|non-stimulant|noncontrolled|non-controlled/i;

/** True when Top-500 metadata indicates a DEA-controlled agent (Schedules II–V). */
export function isControlledSubstanceDrug(drug: DrugEntry): boolean {
  const blob = `${drug.generic} ${drug.therapeuticClass} ${drug.mnemonic} ${drug.sideEffects}`.toLowerCase();
  if (NON_CONTROLLED_HINT.test(blob)) return false;
  return CONTROLLED_SUBSTANCE_PATTERN.test(blob);
}

export function hasInvalidControlledSubstanceStem(text: string): boolean {
  return /controlled-substance prescription for\s+metformin|controlled medications related to biguanide/i.test(
    text
  );
}
