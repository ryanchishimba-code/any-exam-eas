/**
 * Combined NAPLEX calculation MCQ batches (open-source 40 + topic expansions).
 */
import { NAPLEX_CALC_MCQ_BOARD_VIGNETTES_10 } from "./naplex-calc-mcq-board-vignettes-10";
import { NAPLEX_CALC_MCQ_COMPOUNDING } from "./naplex-calc-mcq-compounding";
import { NAPLEX_CALC_MCQ_ONCOLOGY } from "./naplex-calc-mcq-oncology";
import { NAPLEX_CALC_MCQ_OPEN_SOURCE_40 } from "./naplex-calc-mcq-open-source-40";
import { NAPLEX_CALC_MCQ_TPN } from "./naplex-calc-mcq-tpn";
import type { EnrichedBankItem } from "./seed-helpers";

export const NAPLEX_CALC_MCQ_ALL: EnrichedBankItem[] = [
  ...NAPLEX_CALC_MCQ_OPEN_SOURCE_40,
  ...NAPLEX_CALC_MCQ_TPN,
  ...NAPLEX_CALC_MCQ_ONCOLOGY,
  ...NAPLEX_CALC_MCQ_COMPOUNDING,
  ...NAPLEX_CALC_MCQ_BOARD_VIGNETTES_10,
];

export {
  NAPLEX_CALC_MCQ_OPEN_SOURCE_40,
  NAPLEX_CALC_MCQ_TPN,
  NAPLEX_CALC_MCQ_ONCOLOGY,
  NAPLEX_CALC_MCQ_COMPOUNDING,
  NAPLEX_CALC_MCQ_BOARD_VIGNETTES_10,
};
