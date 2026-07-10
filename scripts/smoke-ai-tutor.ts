#!/usr/bin/env node
/**
 * Smoke-test AI Tutor engine for NCLEX, NAPLEX, and USMLE sample items.
 * Usage: npx tsx scripts/smoke-ai-tutor.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { aiLogicEngine } from "../src/lib/core/ai-logic";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

loadEnvLocal();

const samples = [
  {
    label: "NCLEX prioritization",
    field: "nursing",
    stem: "A nurse finds a post-op patient pale with RR 28 and SpO2 89% on room air. What is the priority action?",
    options: [
      "Document findings in the chart",
      "Apply supplemental oxygen and assess airway",
      "Call the surgeon",
      "Increase IV fluid rate",
    ],
    correctAnswers: ["Apply supplemental oxygen and assess airway"],
    selectedAnswers: ["Document findings in the chart"],
    explanation: "Hypoxia requires immediate airway/oxygen intervention before documentation.",
  },
  {
    label: "NAPLEX interaction",
    field: "pharmacy",
    stem: "A patient on warfarin starts trimethoprim-sulfamethoxazole. What is the best pharmacist action?",
    options: [
      "No action needed",
      "Recommend INR monitoring and counsel on bleeding signs",
      "Discontinue warfarin permanently",
      "Switch to aspirin",
    ],
    correctAnswers: ["Recommend INR monitoring and counsel on bleeding signs"],
    selectedAnswers: ["No action needed"],
    explanation: "TMP-SMX inhibits warfarin metabolism — monitor INR and bleeding risk.",
  },
  {
    label: "USMLE Step 2 CK",
    field: "usmle-step-2",
    stem: "A 58-year-old with chest pain has ST depressions in V4–V6. BP 90/60. What is the next best step?",
    options: ["Immediate PCI", "IV fluids and nitrates cautiously", "Discharge with stress test", "Oral beta-blocker only"],
    correctAnswers: ["IV fluids and nitrates cautiously"],
    selectedAnswers: ["Immediate PCI"],
    explanation: "NSTEMI with hypotension — cautious medical therapy; PCI when stabilized.",
  },
];

async function main() {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    console.warn("OPENAI_API_KEY not set — running fallback-only smoke test.\n");
  }

  let pass = 0;
  for (const sample of samples) {
    const started = Date.now();
    const { explanation, source } = await aiLogicEngine.generateQuestionExplanation(sample);
    const ms = Date.now() - started;

    const distractorCount = Object.keys(explanation.whyIncorrect ?? {}).length;
    const ok =
      explanation.summary.length > 20 &&
      explanation.whyCorrect.length > 20 &&
      (source === "fallback" || distractorCount >= 2);

    console.log(`${ok ? "✓" : "✗"} ${sample.label} (${source}, ${ms}ms)`);
    console.log(`  summary: ${explanation.summary.slice(0, 100)}…`);
    console.log(`  whyCorrect: ${explanation.whyCorrect.slice(0, 90)}…`);
    console.log(`  distractors explained: ${distractorCount}`);
    if (explanation.pearls?.[0]) console.log(`  pearl: ${explanation.pearls[0]}`);
    console.log("");

    if (ok) pass++;
  }

  console.log(`Result: ${pass}/${samples.length} samples passed quality bar`);
  process.exit(pass === samples.length ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
