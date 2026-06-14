export type {
  AnatomyProcedure,
  ProcedureApproach,
  ProcedureUrgency,
} from "./types";

export {
  PROCEDURE_APPROACH_LABELS,
  PROCEDURE_URGENCY_LABELS,
} from "./types";

export {
  ANATOMY_PROCEDURES,
  getProcedureById,
  getProceduresForStructure,
  getProceduresForSubregion,
  getHighYieldProcedures,
  assertProcedureCatalogIntegrity,
  searchProcedures,
} from "./registry";

export { EXTENDED_PROCEDURES } from "./curated-extended";

export { CARDIAC_PROCEDURES } from "./curated-cardiac";
export { GI_PROCEDURES } from "./curated-gi";
export { THORACIC_GU_PROCEDURES } from "./curated-thoracic-gu";
export { NEURO_MSK_PROCEDURES } from "./curated-neuro-msk";
