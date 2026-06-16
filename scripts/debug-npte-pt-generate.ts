#!/usr/bin/env node
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import OpenAI from "openai";
import { examQuestionToBankItem } from "../src/lib/engine/curation/exam-to-bank";
import { planNptePtGenerationSlots } from "../src/lib/exam-prep/npte-pt/blueprint-quota";
import { assessNptePtBankItem } from "../src/lib/exam-prep/npte-pt/quality-gate";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";
import {
  usmleBankItemHasClinicalScenario,
  splitUsmleBankItem,
  normalizeUsmleBankItemFields,
} from "../src/lib/exam-prep/usmle-clinical-gate";
import { validateClinicalVignette } from "../src/lib/engine/prompts/vignette";
import { bankItemToUsmleExam } from "../src/lib/exam-prep/usmle-bank-bridge";
import { collectNptePtSeedItems } from "../src/lib/edtech/seeds/npte-pt-seed-registry";
import type { NptePtGenerationMeta } from "../src/lib/exam-prep/npte-pt/types";
import { NPTE_PT_GENERATION_VERSION } from "../src/lib/exam-prep/npte-pt/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function main() {
  const deficits = { musculoskeletal: 800 };
  const slots = planNptePtGenerationSlots({ count: 2, deficitsByCategory: deficits });
  const exemplars = collectNptePtSeedItems();

  const slotLines = slots.map(
    (s, i) =>
      `${i + 1}. Content: ${s.contentCategory} | Task: ${s.taskCategory} | Topic: ${s.blueprintTopic}`
  );

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Generate exactly ${slots.length} NPTE-PT questions as JSON { questions: [...] }.
Each: vignette, question (stem ending ?), options (4), correctAnswer, explanation (150+ words), topicCategory, taskCategory, blueprintTopic, difficulty, tags.

SLOTS:
${slotLines.join("\n")}`,
      },
    ],
    temperature: 0.35,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const questions = (JSON.parse(raw) as { questions?: unknown[] }).questions ?? [];
  console.log("parsed questions:", questions.length);

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i]!;
    const exam = questions[i] as Record<string, unknown> | undefined;
    console.log(`\n=== slot ${i} ===`);
    if (!exam?.question || !exam?.correctAnswer) {
      console.log("FAIL: missing question or correctAnswer", Object.keys(exam ?? {}));
      continue;
    }

    const base = examQuestionToBankItem(exam as never, {
      subjectId: slot.contentCategory,
      topicCategory: slot.contentCategory,
      blueprintDomain: slot.contentCategory,
      difficulty: slot.difficulty,
      tags: ["npte-pt-generated"],
      source: "generated",
    });

    const item = {
      ...base,
      itemType: "vignette" as const,
      ngnPayload: {
        taskCategory: slot.taskCategory,
        blueprintTopic: slot.blueprintTopic,
        blueprintSystem: slot.contentCategory,
      },
    };

    const normalized = normalizeUsmleBankItemFields(item);
    const { vignette, stem } = splitUsmleBankItem(normalized);
    console.log("vignette len:", vignette?.length ?? 0, "stem:", stem.slice(0, 80));
    console.log("hasClinicalScenario:", usmleBankItemHasClinicalScenario(normalized));
    console.log("validateClinicalVignette:", validateClinicalVignette(bankItemToUsmleExam(normalized, 0)));

    const qc = assessNptePtBankItem(item, { source: "generated" });
    console.log("qc serveReady:", qc.serveReady, "score:", qc.qcScore, "flags:", qc.flags, "issues:", qc.issues);

    const editor = auditUsmleQaEditor(normalized, {
      fieldId: "npte-pt",
      source: "polished",
      difficulty: item.difficulty ?? null,
    });
    console.log("editor examReady:", editor.examReady, "score:", editor.score);
    if (!editor.examReady) {
      console.log(
        "editor top issues:",
        editor.issues.filter((x) => x.severity === "error").slice(0, 8).map((x) => x.message)
      );
    }
  }
}

main().catch(console.error);
