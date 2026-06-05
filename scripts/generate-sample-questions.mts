#!/usr/bin/env npx tsx
/**
 * Generate 3 sample board questions through the vignette + OER polish pipeline.
 * Run: npx tsx scripts/generate-sample-questions.mts
 */
import {
  formatSampleQuestionForDisplay,
  generateSampleQuestions,
} from "../src/lib/engine/generate-sample-questions.ts";

const samples = generateSampleQuestions();

console.log("Sample question generation — vignette + OER pipeline test\n");
console.log(`Generated ${samples.length} questions\n`);

let allPassed = true;
for (const sample of samples) {
  console.log(formatSampleQuestionForDisplay(sample));
  console.log("---\n");
  if (!sample.passed) allPassed = false;
}

console.log(allPassed ? "✓ All 3 samples passed vignette validation" : "✗ Some samples failed validation");
process.exit(allPassed ? 0 : 1);
