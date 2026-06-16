#!/usr/bin/env node
import { loadEnvFiles } from "./load-env";
loadEnvFiles();

import OpenAI from "openai";
import { planNclexFullExamSlots } from "../src/lib/exam-prep/nclex/blueprint-quota";
import { assessNclexFullExamItem } from "../src/lib/exam-prep/nclex/quality-gate";
import { assessNclexItemQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { nclexBankItemIsServeReady } from "../src/lib/exam-prep/nclex-serve-gate";
import { scoreNclexBankItem } from "../src/lib/engine/polish/nclex-polish";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import { auditNclexBankItem } from "../src/lib/exam-prep/nclex-bank-audit";
import { examQuestionToBankItem } from "../src/lib/engine/curation/exam-to-bank";
import { NURSING_EXAM_SYSTEM_AUGMENTATION } from "../src/lib/subjects/nursing/prompts";

// Import normalization by duplicating minimal test — use pipeline slotToBankItem path
function stripOptionPrefix(option: string): string {
  return option.replace(/^[A-Da-d][.)]\s*/, "").trim();
}
function normalizeOptions(raw: string[]): string[] {
  return raw.map(stripOptionPrefix).filter(Boolean);
}
function alignCorrectAnswer(options: string[], correctAnswer: string): string {
  const norm = (s: string) =>
    stripOptionPrefix(s).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const target = norm(correctAnswer);
  const match = options.find((o) => norm(o) === target);
  if (match) return match;
  for (const option of options) {
    const n = norm(option);
    if (n.includes(target) || target.includes(n)) return option;
  }
  return options[0]!;
}

async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const slots = planNclexFullExamSlots({ examNumber: 1, questionCount: 1 });
  const slot = slots[0]!;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: NURSING_EXAM_SYSTEM_AUGMENTATION },
      {
        role: "user",
        content: `Generate 1 NCLEX question. Client Needs: ${slot.categoryLabel}. Topic: ${slot.blueprintTopic}.
Return JSON: { "questions": [{ "vignette", "question", "options" (4), "correctAnswer", "explanation" (150+ words), "clinicalReasoning", "distractorRationale" (object per wrong option), "topicCategory", "references" }] }`,
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 4000,
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as {
    questions?: Record<string, unknown>[];
  };
  const q = parsed.questions?.[0];
  if (!q) {
    console.log("No question returned");
    return;
  }

  console.log("Raw question keys:", Object.keys(q));
  console.log("Raw options:", JSON.stringify(q.options)?.slice(0, 200));
  console.log("Raw explanation type:", typeof q.explanation, String(q.explanation)?.slice(0, 100));

  const item = examQuestionToBankItem(q as never, {
    subjectId: slot.subjectId,
    source: "ai-curated",
    tags: ["nclex-ngn", "curated", "full-exam-generated"],
  });

  const options = normalizeOptions(item.options);
  item.options = options.slice(0, 4) as typeof item.options;
  item.correctAnswer = alignCorrectAnswer(options, item.correctAnswer);
  console.log("correctAnswer:", item.correctAnswer);
  console.log("options:", item.options);

  console.log("--- Item summary ---");
  console.log("vignette len:", (item.vignette ?? "").length);
  console.log("explanation len:", item.explanation.length);
  console.log("has Why other:", /Why other options are incorrect/i.test(item.explanation));
  console.log("has Incorrect —:", /Incorrect —/i.test(item.explanation));
  console.log("serveReady:", nclexBankItemIsServeReady(item));
  console.log("score:", scoreNclexBankItem(item));
  console.log("audit ok:", auditBankItem(item, "nursing").ok);
  console.log(
    "audit issues:",
    auditBankItem(item, "nursing").issues.filter((i) => i.severity === "error")
  );
  console.log("nclex audit ok:", auditNclexBankItem(item).ok);
  console.log(
    "nclex issues:",
    auditNclexBankItem(item).issues.filter((i) => i.severity === "error")
  );
  console.log("quality:", assessNclexItemQuality(item, { source: "ai-curated" }));
  console.log("fullExamQc:", assessNclexFullExamItem(item, 0));
}

main().catch(console.error);
