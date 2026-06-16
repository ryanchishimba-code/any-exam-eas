import { config } from "dotenv";
config({ path: ".env.local" });

import { gatherTimedExamBankItems } from "../src/lib/questions/timed-exam-sampling.ts";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate.ts";
import {
  resolveExamBankSampleCount,
  finalizeExamSessionQuestions,
  assertExamSessionReady,
} from "../src/lib/questions/finalize-exam-session.ts";
import { bankItemToUsmleRaw } from "../src/lib/exam-prep/usmle-bank-bridge.ts";

const limit = Number(process.argv[2] ?? 280);
const fieldId = "usmle-step-2";
const sampleCount = resolveExamBankSampleCount(fieldId, limit, true);
console.log("limit", limit, "sampleCount", sampleCount);

const items = await gatherTimedExamBankItems({
  fieldId,
  limit,
  filterFn: (item) => usmleBankItemIsServeReady(item, fieldId),
  initialSampleCount: sampleCount,
});
console.log("gathered", items.length);

const rawInputs = items.map((item, i) =>
  bankItemToUsmleRaw(item, i, {
    field: fieldId,
    subjectId: item.subjectId ?? "__mixed__",
  })
);

const { prepared, quality } = finalizeExamSessionQuestions(rawInputs, limit);
console.log("prepared", prepared.length);
console.log("quality", quality);

try {
  assertExamSessionReady(quality, fieldId);
  console.log("ASSERT_OK");
} catch (e) {
  console.log("ASSERT_FAIL", e instanceof Error ? e.message : e);
}
