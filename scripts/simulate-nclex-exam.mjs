import { config } from "dotenv";
config({ path: ".env.local" });

import { gatherTimedExamBankItems } from "../src/lib/questions/timed-exam-sampling.ts";
import { nclexItemPassesTimedExamGate } from "../src/lib/exam-prep/nclex-serve-gate.ts";
import {
  resolveExamBankSampleCount,
  finalizeExamSessionQuestions,
  assertExamSessionReady,
} from "../src/lib/questions/finalize-exam-session.ts";
import { bankItemToRawQuestion } from "../src/lib/exam-prep/ngn-bank-bridge.ts";

const limit = Number(process.argv[2] ?? 85);
const sampleCount = resolveExamBankSampleCount("nursing", limit, true);
console.log("limit", limit, "sampleCount", sampleCount);

const items = await gatherTimedExamBankItems({
  fieldId: "nursing",
  limit,
  filterFn: nclexItemPassesTimedExamGate,
  initialSampleCount: sampleCount,
});
console.log("gathered", items.length);

const rawInputs = items.map((item, i) =>
  bankItemToRawQuestion(item, i, {
    field: "nursing",
    subjectId: item.subjectId ?? "__mixed__",
  })
);

const { prepared, quality } = finalizeExamSessionQuestions(rawInputs, limit);
console.log("prepared", prepared.length);
console.log("quality", quality);

try {
  assertExamSessionReady(quality, "nursing");
  console.log("ASSERT_OK");
} catch (e) {
  console.log("ASSERT_FAIL", e instanceof Error ? e.message : e);
}
