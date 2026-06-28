/** Within-batch diversity checks for NPTE-PT generation. */
export {
  auditBatchDiversity,
  batchPassesDiversity,
  dedupeBatchItems,
  filterBatchByDiversity,
  type BatchDiversityIssue,
} from "@/lib/exam-prep/exam-similarity";
