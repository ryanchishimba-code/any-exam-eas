import { buildMpjeScopeLabel, getMpjeState, type MpjeVariant } from "@/lib/mpje/config";
import { buildStateLawPromptBlock, buildUniformLawPromptBlock } from "@/lib/mpje/state-law";

export const MPJE_EXAM_SYSTEM_AUGMENTATION = `You are an expert MPJE (Multistate Pharmacy Jurisprudence Examination) item writer.
You MUST follow NABP MPJE/UMPJE jurisprudence competencies and applicable federal pharmacy law.

Rules:
- Focus on PHARMACY LAW, REGULATIONS, ETHICS, and PROFESSIONAL PRACTICE — not clinical pharmacotherapy (that is NAPLEX).
- Every item MUST include a realistic practice scenario (pharmacy setting, pharmacist role, regulatory facts) before the question lead-in.
- Cover: federal vs state authority, controlled substances, dispensing rules, compounding, HIPAA, ethics, board discipline, prescription validity.
- Distinguish FEDERAL law (DEA, FDA, HIPAA) from STATE law (practice act, board rules) when both apply.
- Four options with one best answer; distractors = common legal misconceptions, wrong jurisdiction, outdated rules.
- Rationales cite the governing statute/regulation principle and why each distractor fails.
- references array MUST cite NABP MPJE content outline AND relevant federal/state legal source.
- BATCH DIVERSITY: No consecutive similar legal scenarios, answer-choice patterns, or fact-pattern structure; every batch of 10 must vary jurisdiction focus, scenario setting, and option wording.
- Output only valid JSON.`;

export function getMpjeUserAugmentation(options?: {
  variant?: MpjeVariant;
  stateCode?: string;
  stateName?: string;
}): string {
  const variant = options?.variant ?? "uniform";
  const scope = buildMpjeScopeLabel(variant, options?.stateCode);

  const state = options?.stateCode ? getMpjeState(options.stateCode) : undefined;
  const stateLawBlock =
    variant === "state" && options?.stateCode
      ? buildStateLawPromptBlock(options.stateCode)
      : "";
  const uniformBlock = variant === "uniform" ? buildUniformLawPromptBlock() : "";

  const stateBlock =
    variant === "state" && (state?.name ?? options?.stateName)
      ? `
STATE-SPECIFIC MPJE (${state?.name ?? options?.stateName}):
- Apply ${state?.name ?? options?.stateName} pharmacy practice act and board of pharmacy regulations.
- Include state-specific scope: technician ratios, immunization authority, collaborative practice, telepharmacy, PDMP.
- Note when ${state?.name ?? options?.stateName} differs from uniform/multistate patterns.
- California and Arkansas use separate jurisprudence exams — emphasize their distinct rules when applicable.
${stateLawBlock}`
      : `
UNIFORM MPJE (UMPJE):
- Emphasize multistate jurisprudence patterns and federal law applicable nationwide.
- Many states are transitioning to Uniform MPJE (UMPJE) in 2026 — use current uniform framework.
- Federal law (DEA, FDA, HIPAA) applies uniformly; avoid state-specific statutes unless illustrating uniform standards.
${uniformBlock}`;

  return `
MPJE AUGMENTATION — ${scope}:
${stateBlock}

CONTENT DOMAINS:
1. Federal pharmacy law — DEA (schedules, records, PDMP), FDA (labeling, compounding, DSCSA), HIPAA.
2. State pharmacy law — practice act, licensure, technician supervision, prescription requirements.
3. Ethics & professionalism — APhA Code of Ethics, duty to patient, conflicts, reporting obligations.
4. Dispensing & operations — valid Rx elements, refills, transfers, DUR, record retention, inspections.

SCENARIO STYLE:
- Community pharmacy, hospital pharmacy, mail-order, or board inspection context.
- Name the pharmacist's regulatory dilemma (e.g., incomplete C-II Rx, suspected forgery, HIPAA request).
- Include concrete facts: schedule, refill count, days supply, board rule citation style.

RATIONALE STRUCTURE:
1. Identify governing authority (federal vs state).
2. State the legal rule or board standard.
3. Apply rule to scenario facts → correct answer.
4. Explain why each distractor violates or misapplies the law.

BATCH DIVERSITY:
- No consecutive items testing the same statute, schedule, or board rule with parallel option wording.
- Every 10-question block must vary scenario setting (community, hospital, mail-order, inspection) and legal domain mix.`;
}
