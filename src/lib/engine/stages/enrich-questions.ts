import type { ExamQuestion, GeneratedExam } from "@/lib/ai";
import { normalizeFieldId } from "@/lib/subjects/field-ids";
import {
  formatDrugProfileForExplanation,
  isDrugCenteredQuestion,
  isDrugProfileComplete,
  normalizeDrugProfile,
} from "@/lib/engine/prompts/pharm-drug-profile";
import { ensureClinicalVignette } from "@/lib/engine/prompts/vignette";

const NGN_TYPES = new Set([
  "select_all",
  "bow_tie",
  "matrix",
  "unfolding_case",
  "highlight",
  "ordered_response",
  "drag_drop",
]);

/**
 * Post-process AI output: merge vignette into display stem, fill missing rationales,
 * and flag high-yield items lacking board-style depth.
 */
export function enrichGeneratedExam(exam: GeneratedExam, fieldId?: string): GeneratedExam {
  const normalizedField = fieldId ? normalizeFieldId(fieldId) : undefined;
  return {
    ...exam,
    questions: exam.questions.map((q) => enrichQuestion(q, normalizedField)),
  };
}

export function enrichQuestion(q: ExamQuestion, fieldId?: string): ExamQuestion {
  const enriched = ensureClinicalVignette({ ...q });

  if (enriched.vignette?.trim()) {
    const vignette = enriched.vignette.trim();
    if (!enriched.question.includes(vignette.slice(0, Math.min(40, vignette.length)))) {
      enriched.question = `${vignette}\n\n${enriched.question.trim()}`;
    }
  }

  enriched.distractorRationale = enrichDistractorRationale(enriched, fieldId);
  enriched.clinicalReasoning =
    enriched.clinicalReasoning?.trim() ||
    deriveClinicalReasoning(enriched, fieldId);
  enriched.drugProfile = enrichDrugProfile(enriched, fieldId);
  enriched.explanation = enrichExplanationText(enriched);
  enriched.highYield = enriched.highYield ?? inferHighYield(enriched);

  return enriched;
}

function enrichDistractorRationale(q: ExamQuestion, fieldId?: string): Record<string, string> {
  const existing = q.distractorRationale ?? {};
  const options = q.options ?? [];
  if (options.length === 0) return existing;

  const incorrect = options.filter(
    (o) => o.trim() && o.trim() !== q.correctAnswer.trim()
  );

  const result = { ...existing };
  for (const opt of incorrect) {
    if (result[opt]?.trim()) continue;
    result[opt] = inferDistractorWhy(opt, q, fieldId);
  }

  return result;
}

function inferDistractorWhy(option: string, q: ExamQuestion, fieldId?: string): string {
  const stem = (q.vignette ?? q.question).slice(0, 140);
  const id = fieldId ?? "";

  if (id === "nursing") {
    if (/stable|chronic|routine|discharge teaching only|3\/10|142 mg/i.test(option)) {
      return `Incorrect — stable, chronic, or scheduled needs are lower priority than the client with acute, unstable cues in the vignette.`;
    }
    if (/comprehensive assessment|insulin|triage|teaching a new/i.test(option)) {
      return `Incorrect — assessment, teaching, and triage exceed UAP scope or address the wrong priority; the RN retains accountability.`;
    }
    if (/without verifying|another client|before giving|skip hand|reuse|shouldn't feel|not talk|overreacting/i.test(option)) {
      return `Incorrect — violates nursing safety standards, therapeutic communication principles, or scope of practice.`;
    }
    if (/wait until|delay|restrict all oral|comfort measures for all other/i.test(option)) {
      return `Incorrect — delays necessary intervention for unstable findings supported by the vignette data.`;
    }
    if (/hand rub alone|negative-pressure|droplet only/i.test(option)) {
      return `Incorrect — wrong infection control precaution level for this presentation.`;
    }
  }

  if (id === "usmle-step-1" || id === "usmle-step-2") {
    if (/defer|discharge|6 months|without imaging|reassure only|no testing/i.test(option)) {
      return `Incorrect — unsafe delay or inadequate evaluation for a potentially serious condition.`;
    }
    if (/NSAID|antibiotic|diuretic|PCI|thrombolysis|anticoagulation/i.test(option) && /alone|only|without|defer/i.test(option)) {
      return `Incorrect — incomplete or contraindicated management that fails to address the underlying diagnosis.`;
    }
    if (/random|psychological only|nutritional deficiency|benign finding never|artifact that invalidates/i.test(option)) {
      return `Incorrect — fails to integrate pathophysiology with clinical findings; a common USMLE trap.`;
    }
    if (/related diagnosis|wrong next step|premature|contraindicated/i.test(stem)) {
      return `Incorrect — plausible differential or management option but not the single best answer given discriminating data.`;
    }
  }

  if (id === "pance") {
    if (/federal.*not apply|state always supersede|ignore board/i.test(option)) {
      return `Incorrect — misapplies jurisdiction; federal and state pharmacy law both govern practice with specific precedence rules.`;
    }
    if (/technician|uncertified|without supervision|delegate all/i.test(option)) {
      return `Incorrect — violates pharmacist supervision and scope-of-practice requirements under the practice act.`;
    }
    if (/without verifying|dispense immediately|unlimited refill|skip counseling/i.test(option)) {
      return `Incorrect — fails required prescription verification, controlled substance limits, or legal dispensing standards.`;
    }
    if (/share.*record|any requesting party|without authorization/i.test(option)) {
      return `Incorrect — HIPAA and state privacy law restrict PHI disclosure without patient authorization or legal exception.`;
    }
  }

  if (id === "pharmacy") {
    if (/share|family member/i.test(option)) {
      return `Incorrect — medications must not be shared; counseling requires patient-specific safety and monitoring.`;
    }
    if (/without review|ignore|dispense without/i.test(option)) {
      return `Incorrect — pharmacists must verify interactions, contraindications, and dosing before dispensing (Medication Use Process).`;
    }
    if (/no monitoring|never requires|no adverse/i.test(option)) {
      return `Incorrect — all drug therapy requires appropriate monitoring and adverse-effect counseling per NAPLEX Person-Centered Care standards.`;
    }
    if (/double|maximum dose above|unlimited refill/i.test(option)) {
      return `Incorrect — dosing and refill practices must follow legal limits, renal/hepatic adjustment, and prescriber authorization.`;
    }
    const profile = normalizeDrugProfile(q.drugProfile);
    if (profile && /inhibitor|blocker|agonist|antagonist/i.test(option)) {
      if (!option.toLowerCase().includes(profile.generic.toLowerCase())) {
        return `Incorrect — this mechanism/class does not match ${profile.generic} (${profile.therapeuticClass}) for the patient's indication.`;
      }
    }
  }

  return `Incorrect — "${option}" does not best address the clinical priority, mechanism, or key finding in this scenario. The stem data support a different answer. Context: ${stem}${stem.length >= 140 ? "…" : ""}`;
}

function deriveClinicalReasoning(q: ExamQuestion, fieldId?: string): string {
  if (!q.vignette && q.question.length < 80) return "";

  const id = fieldId ? normalizeFieldId(fieldId) : "";

  if (id === "nursing") {
    return [
      "1. Recognize cues: identify abnormal vs normal client data from the vignette.",
      "2. Analyze cues: cluster findings; infer pathophysiology and etiology.",
      "3. Prioritize hypotheses: rank problems by urgency (ABCs, Maslow, safety).",
      "4. Generate solutions: identify evidence-based nursing actions.",
      "5. Take action: select the single best nursing intervention.",
      q.explanation.length > 40
        ? `6. Evaluate outcomes: ${q.explanation.slice(0, 160)}${q.explanation.length > 160 ? "…" : ""}`
        : "6. Evaluate outcomes: anticipate expected improvement and reassessment.",
    ].join("\n");
  }

  if (id === "usmle-step-1") {
    return [
      "1. Identify presenting signs/symptoms and key lab/exam findings.",
      "2. Link findings to underlying mechanism, pathology, or pharmacology.",
      "3. Apply basic science to select the most likely cause or best answer.",
      q.explanation.length > 40
        ? `4. Confirm: ${q.explanation.slice(0, 160)}${q.explanation.length > 160 ? "…" : ""}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (id === "pance") {
    return [
      "1. Identify facts: extract regulatory facts from the pharmacy practice scenario.",
      "2. Determine authority: identify whether federal (DEA/FDA/HIPAA) or state (practice act/board) law applies.",
      "3. Apply rule: match governing statute or board regulation to the scenario.",
      "4. Select action: choose the legally required pharmacist response.",
      q.explanation.length > 40
        ? `5. Confirm: ${q.explanation.slice(0, 160)}${q.explanation.length > 160 ? "…" : ""}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (id === "usmle-step-2" || id === "pharmacy") {
    const steps = [
      "1. Recognize cues: extract discriminating signs/symptoms and patient context.",
      id === "pharmacy"
        ? "2. Analyze: match condition etiology and patient factors to therapeutic options."
        : "2. Analyze: form differential using pathophysiology and epidemiology.",
      id === "pharmacy"
        ? "3. Select therapy: choose drug/dose/counseling based on guidelines and safety."
        : "3. Prioritize: determine next best step in diagnosis or management.",
      "4. Act: select the single best answer supported by evidence.",
    ];
    if (q.explanation.length > 40) {
      steps.push(
        `5. Evaluate: ${q.explanation.slice(0, 160)}${q.explanation.length > 160 ? "…" : ""}`
      );
    }
    return steps.join("\n");
  }

  return [
    "1. Recognize cues: identify abnormal findings and client context from the vignette.",
    "2. Analyze: link findings to the underlying problem or priority.",
    "3. Prioritize: apply safety-first principles to rank actions.",
    "4. Act: select the single best intervention or answer supported by evidence.",
  ].join("\n");
}

function enrichDrugProfile(
  q: ExamQuestion,
  fieldId?: string
): ExamQuestion["drugProfile"] {
  const normalized = normalizeDrugProfile(q.drugProfile);
  if (!normalized) return q.drugProfile;

  const id = fieldId ? normalizeFieldId(fieldId) : "";
  const isPharmField = id === "pharmacy" || id === "nursing";

  if (isPharmField && isDrugCenteredQuestion(q) && !isDrugProfileComplete(normalized)) {
    if (!normalized.conditionEtiology && normalized.indication) {
      normalized.conditionEtiology = `Pathophysiology related to ${normalized.indication.toLowerCase()}.`;
    }
    if (normalized.conditionSymptoms.length === 0 && normalized.indication) {
      normalized.conditionSymptoms = [normalized.indication];
    }
  }

  return normalized;
}

function enrichExplanationText(q: ExamQuestion): string {
  let text = q.explanation?.trim() ?? "";
  if (!text) return text;

  const profile = normalizeDrugProfile(q.drugProfile);
  if (
    profile &&
    isDrugProfileComplete(profile) &&
    !text.toLowerCase().includes(profile.generic.toLowerCase())
  ) {
    text = `${text}\n\n${formatDrugProfileForExplanation(profile)}`;
  }

  const hasDistractorSection = /why (other|incorrect|wrong)/i.test(text);
  const rationales = q.distractorRationale ?? {};
  const incorrectEntries = Object.entries(rationales).filter(
    ([opt]) => opt.trim() !== q.correctAnswer.trim()
  );

  if (!hasDistractorSection && incorrectEntries.length >= 2) {
    const block = incorrectEntries
      .slice(0, 4)
      .map(([opt, why]) => `• ${opt}: ${why}`)
      .join("\n");
    text = `${text}\n\nWhy other options are incorrect:\n${block}`;
  }

  if (q.references?.length && !/reference|source \[/i.test(text)) {
    text = `${text}\n\nReferences: ${q.references.join("; ")}`;
  }

  return text;
}

function inferHighYield(q: ExamQuestion): boolean {
  if (q.highYield !== undefined) return q.highYield;
  const hasVignette = Boolean(q.vignette?.trim()) || q.question.length > 100;
  const hasDepth =
    q.explanation.length > 60 &&
    Object.keys(q.distractorRationale ?? {}).length >= 2;
  const isNgn = NGN_TYPES.has(q.type);
  return hasVignette && (hasDepth || isNgn);
}
