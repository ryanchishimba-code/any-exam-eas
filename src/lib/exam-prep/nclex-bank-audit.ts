/**
 * Editorial audit for NCLEX (nursing field) bank items — vignette/stem alignment,
 * stable-vs-unstable contradictions, and delegation/priority mismatches.
 */
import type { BankItem } from "@/lib/question-bank";
import { hasOrphanDeicticStem } from "@/lib/engine/prompts/vignette";
import { cleanOptionText } from "@/lib/question-format";
import { hasShiftNoteArtifacts, isVagueClinicalJudgmentStem } from "@/lib/questions/shift-notes";

export type NclexAuditIssue = {
  code: string;
  message: string;
  severity: "error" | "warn";
};

export type NclexAuditReport = {
  ok: boolean;
  issues: NclexAuditIssue[];
};

export type NclexAuditItemReport = NclexAuditReport & {
  itemId?: string;
  subjectId?: string;
};

const UNSTABLE_VITAL_CUES =
  /SpO₂?\s*(?:8[0-9]|9[0-3])%|peak flow\s*(?:[1-4]?\d)%\s*of personal best|intercostal retractions|speaking in short phrases|RR\s*(?:10|11|12|[3-9]\d)|pinpoint pupils|somnolen|letharg|shallow respirations|altered mental|GCS\s*\d+\s*\/|BP\s*(?:7[0-9]|8[0-9])\s*\/\s*(?:4[0-9]|5[0-9])|lactate\s*[3-9]|glucose\s*(?:4[0-9][0-9]|[3-9]\d{2})\s*mg|fruity breath|Kussmaul/i;

const STABLE_ASSERTION =
  /stable after initial assessment|(?:client|patient) is stable|alert and oriented|asymptomatic|due for routine|discharge teaching only|chronic stable pain rated [12]\/10/i;

const DELEGATION_VIGNETTE =
  /assign tasks to (?:unlicensed assistive personnel|UAP)|maintaining accountability|delegate tasks to UAP/i;

const INFECTION_STEM =
  /infection|precaution|isolation|PPE|hand hygiene|contact precaution|transmission-based|droplet precaution|airborne precaution/i;

const INFECTION_TRANSMISSION_BOILERPLATE =
  /The nurse must prevent transmission to other clients and staff\.?/i;

/** Strip generator boilerplate that falsely satisfies infection-context checks. */
export function stripInfectionBoilerplate(text: string): string {
  return text.replace(INFECTION_TRANSMISSION_BOILERPLATE, "").trim();
}

/** True infectious-disease context in the clinical scenario (not generic boilerplate). */
export function hasTrueInfectionContext(text: string): boolean {
  return /C\. diff|Clostridioides difficile|MRSA|methicillin-resistant|tuberculosis|\bTB\b|meningococcal|meningitis|cellulitis|COVID-19|norovirus|hepatitis A|varicella|measles|active tuberculosis|infectious diarrhea|watery diarrhea.*(?:WBC|leukocytosis)|purulent wound|pyelonephritis with (?:ESBL|resistant)|contact precaution for (?:C\. diff|MRSA)/i.test(
    text
  );
}

export function optionsAreInfectionControlOnly(options: string[]): boolean {
  if (options.length < 4) return false;
  return options.every((o) =>
    /^(Use alcohol-based hand rub|Place the client on (contact|droplet) precautions|Keep the client in a negative-pressure room)/i.test(
      o.trim()
    )
  );
}

export function inferNclexTemplateFromClinical(text: string, stem: string): string | undefined {
  const body = stripInfectionBoilerplate(text);
  if (/morphine|opioid|pinpoint pupils|somnolen|PCA/i.test(body)) {
    return /assessed first|see first|prioritize|four clients/i.test(stem) ? "prioritization" : "intervention";
  }
  if (/heart failure|hypovolemic|hemorrhage|GI bleed|melena|anaphylaxis|stridor|urticaria/i.test(body)) {
    return /assessed first|see first|four clients/i.test(stem) ? "prioritization" : "intervention";
  }
  if (/depressive|suicidal|psychiatric|fear and anxiety|goodbye note/i.test(body)) {
    return /therapeutic|communication|psychosocial/i.test(stem) ? "communication" : "intervention";
  }
  if (/hyperglycemia|diabetes|insulin|glucose\s*4|fruity breath/i.test(body)) {
    return /medication|administer|six rights/i.test(stem) ? "pharmacology" : "intervention";
  }
  if (/postpartum|boggy fundus|perineal pad|lochia/i.test(body)) return "risk";
  if (hasTrueInfectionContext(body)) return "infection";
  return undefined;
}

const INFECTION_VIGNETTE =
  /C\. diff|Clostridioides difficile|contact precaution|droplet precaution|isolation room|infectious|MRSA|tuberculosis|contagious/i;

const PHANTOM_DX_CHECKS: Array<{ optionPattern: RegExp; vignetteNeed: RegExp; label: string }> = [
  {
    optionPattern: /\btype 2 diabetes\b|\binsulin self-administration\b/i,
    vignetteNeed: /\b(?:type 2 )?diabetes|diabetic|insulin|glucose\b/i,
    label: "type 2 diabetes / insulin teaching",
  },
  {
    optionPattern: /\btotal knee arthroplasty\b|\bTKA\b/i,
    vignetteNeed: /\bknee arthroplasty|TKA|total knee\b/i,
    label: "total knee arthroplasty",
  },
  {
    optionPattern: /\bcellulitis\b/i,
    vignetteNeed: /\bcellulitis\b/i,
    label: "cellulitis",
  },
  {
    optionPattern: /\bheart failure\b|\bCHF\b/i,
    vignetteNeed: /\bheart failure|CHF|volume status\b/i,
    label: "heart failure",
  },
];

function countRoomLabels(text: string): number {
  return (text.match(/Room \d+/g) ?? []).length;
}

export function resolveNclexVignette(item: BankItem): string {
  const vignette = item.vignette?.trim() || item.scenario?.trim() || "";
  if (vignette) return vignette;
  const q = item.question?.trim() ?? "";
  if (q.includes("\n\n")) {
    const head = q.split("\n\n")[0]?.trim() ?? "";
    if (head.length >= 30) return head;
  }
  return "";
}

export function resolveNclexStem(item: BankItem): string {
  const vignette = item.vignette?.trim() || item.scenario?.trim() || "";
  const q = item.question?.trim() ?? "";
  if (vignette && q.startsWith(vignette)) {
    return q.slice(vignette.length).replace(/^\s*\n+\s*/, "").trim();
  }
  if (q.includes("\n\n")) {
    const parts = q.split("\n\n");
    if (parts.length >= 2 && (parts[0]?.length ?? 0) >= 30) {
      return parts.slice(1).join("\n\n").trim();
    }
  }
  return q;
}

export function normalizeNclexBankItemFields(item: BankItem): BankItem {
  const vignette = resolveNclexVignette(item);
  const stem = resolveNclexStem(item);
  if (!vignette && stem === item.question) return item;
  return {
    ...item,
    vignette: vignette || item.vignette,
    scenario: vignette || item.scenario?.trim() || item.scenario,
    question: stem || item.question,
  };
}

export function auditNclexBankItem(item: BankItem): NclexAuditReport {
  const issues: NclexAuditIssue[] = [];
  const push = (severity: NclexAuditIssue["severity"], code: string, message: string) =>
    issues.push({ severity, code, message });

  const vignette = resolveNclexVignette(item);
  const stem = resolveNclexStem(item);
  const blob = `${vignette}\n${stem}`;

  if (hasShiftNoteArtifacts(vignette) || hasShiftNoteArtifacts(stem)) {
    push(
      "error",
      "shift_note_format",
      "Vignette uses EHR shift-note or timestamp chart formatting — rewrite as a focused patient scenario."
    );
  }

  if (isVagueClinicalJudgmentStem(stem)) {
    push(
      "error",
      "vague_stem",
      'Stem must ask a specific clinical question, not "Choose the single best answer based on clinical judgment."'
    );
  }

  const asksForFinding = /which finding|which assessment finding|requires immediate nursing follow-up/i.test(
    stem
  );
  const optionsLookLikeActions = item.options.every((o) =>
    /^(Notify|Document|Delegate|Reassure|Administer|Establish|Apply|Encourage|Assist|Ask|Hold|Complete|Wait)/i.test(
      o.trim()
    )
  );
  if (asksForFinding && optionsLookLikeActions) {
    push(
      "error",
      "stem_option_category_mismatch",
      'Stem asks for a finding but all options are nursing actions — rewrite options as findings or change the stem.'
    );
  }

  if (asksForFinding) {
    for (const opt of item.options) {
      if (/^[A-Za-z]+ \(\s*RR\s*\d+/i.test(opt.trim())) {
        push(
          "error",
          "malformed_finding_option",
          "Finding option mixes unrelated assessment labels — rewrite as a single coherent finding."
        );
        break;
      }
    }
  }

  if (STABLE_ASSERTION.test(blob) && UNSTABLE_VITAL_CUES.test(vignette || blob)) {
    push(
      "error",
      "stable_unstable_mismatch",
      "Vignette claims stability but documents unstable vitals or respiratory distress cues."
    );
  }

  if (/delegate|UAP|unlicensed assistive personnel/i.test(stem)) {
    if (!/UAP|unlicensed assistive personnel|assign tasks to/i.test(blob)) {
      push(
        "error",
        "delegation_context_missing",
        "Delegation stem lacks UAP assignment context in the vignette."
      );
    }
    if (/assigned four clients|Handoff report —/i.test(vignette)) {
      push(
        "error",
        "delegation_prioritization_mismatch",
        "Multi-client handoff vignette paired with a single-client delegation stem."
      );
    }
    if (/shift handoff|handoff report|During handoff/i.test(vignette)) {
      push(
        "error",
        "delegation_handoff_mismatch",
        "Shift handoff vignette paired with a delegation stem."
      );
    }
  }

  if (/assessed first|see first|highest priority/i.test(stem) && /assign tasks to UAP/i.test(vignette)) {
    push(
      "error",
      "priority_delegation_mismatch",
      "Priority lead-in paired with a delegation-only vignette."
    );
  }

  const isPrioritizationStem =
    /assigned four clients|four clients|four assigned clients|assessed first|assess first|see first|highest priority|prioritize for immediate assessment|receives report on four/i.test(
      stem
    );
  if (vignette && countRoomLabels(vignette) >= 2 && !isPrioritizationStem) {
    push(
      "error",
      "multi_client_vignette",
      "Vignette describes multiple room assignments but the stem is not a four-client prioritization question."
    );
  }

  const clinicalBody = stripInfectionBoilerplate(vignette);
  const vignetteDelegation = DELEGATION_VIGNETTE.test(vignette);
  const stemInfection = INFECTION_STEM.test(stem);
  const vignetteInfection =
    hasTrueInfectionContext(clinicalBody) || INFECTION_VIGNETTE.test(clinicalBody);
  if (vignetteDelegation && stemInfection && !vignetteInfection) {
    push(
      "error",
      "stem_vignette_template_mismatch",
      "Delegation vignette paired with infection-control stem without infectious context in the scenario."
    );
  }
  if (
    stemInfection &&
    clinicalBody.length > 50 &&
    !vignetteInfection &&
    !isPrioritizationStem &&
    !vignetteDelegation
  ) {
    push(
      "error",
      "infection_stem_without_context",
      "Infection-control stem lacks transmission or infectious-disease context in the vignette."
    );
  }
  if (stemInfection && optionsAreInfectionControlOnly(item.options) && clinicalBody.length > 50 && !vignetteInfection) {
    push(
      "error",
      "infection_template_clinical_mismatch",
      "Infection-control stem and options do not match the clinical scenario in the vignette."
    );
  }

  if (vignette) {
    for (const opt of item.options) {
      for (const check of PHANTOM_DX_CHECKS) {
        if (check.optionPattern.test(opt) && !check.vignetteNeed.test(vignette)) {
          push(
            "error",
            "phantom_client_in_options",
            `Option references ${check.label}, which is not described in the vignette.`
          );
          break;
        }
      }
    }
  }

  if (
    /delegate|UAP|unlicensed assistive personnel/i.test(stem) &&
    /^Measure and record intake and output on a stable client who is alert and oriented/i.test(
      item.correctAnswer
    )
  ) {
    push(
      "error",
      "generic_delegation_correct",
      "Correct delegation answer is generic and not tied to the client described in the vignette."
    );
  }

  if (
    /Pediatric|pediatric/i.test(vignette) &&
    /\b(?:1[89]|[2-9]\d)-year-old (?:man|woman)\b/.test(vignette) &&
    /asthma|wheeze|retractions/i.test(vignette)
  ) {
    push(
      "error",
      "pediatric_age_mismatch",
      "Pediatric setting with adult age label — likely polish age bump artifact."
    );
  }

  const rawQuestion = item.question?.trim() ?? "";
  const explicitVignette = item.vignette?.trim() || item.scenario?.trim() || "";
  const vignetteHead = vignette.slice(0, Math.min(60, vignette.length));
  if (explicitVignette && rawQuestion.startsWith(explicitVignette)) {
    push("warn", "duplicate_vignette_in_stem", "Question stem repeats vignette text already shown above.");
  } else if (vignette && stem && vignetteHead.length >= 20 && stem.includes(vignetteHead)) {
    push("warn", "duplicate_vignette_in_stem", "Question stem repeats vignette text already shown above.");
  }

  if (!vignette && stem.length > 120 && !/Handoff report/i.test(stem)) {
    push("warn", "missing_vignette_split", "Long clinical text may belong in scenario, not the stem alone.");
  }

  if (
    hasOrphanDeicticStem({
      id: 0,
      type: "multiple_choice",
      question: stem,
      vignette,
      correctAnswer: "",
      explanation: "",
    })
  ) {
    push("error", "orphan_deictic_stem", 'Stem references "these findings" without an preceding vignette.');
  }

  if (item.options.length >= 2 && item.correctAnswer) {
    const cleanedOptions = item.options.map((o) => cleanOptionText(String(o)));
    const cleanedCorrect = cleanOptionText(item.correctAnswer);
    if (!cleanedOptions.some((o) => o.toLowerCase() === cleanedCorrect.toLowerCase())) {
      push("error", "correct_not_in_options", "correctAnswer must match one option exactly.");
    }
  }

  const errors = issues.filter((i) => i.severity === "error");
  return { ok: errors.length === 0, issues };
}

/** Safety / editorial codes that must never be served even if a stale qaPassed row exists. */
export const NCLEX_SERVE_BLOCK_CODES = [
  "pediatric_age_mismatch",
  "generic_delegation_correct",
  "infection_template_clinical_mismatch",
  "infection_stem_without_context",
  "stem_vignette_template_mismatch",
  "phantom_client_in_options",
  "priority_hypoxemia_mismatch",
  "duplicate_vignette_in_stem",
  "malformed_finding_option",
  "stem_option_category_mismatch",
] as const;

export function nclexHasServeBlockIssues(item: BankItem): boolean {
  const report = auditNclexBankItem(item);
  const blockSet = new Set<string>(NCLEX_SERVE_BLOCK_CODES);
  return report.issues.some((i) => blockSet.has(i.code));
}

/** Warn-level codes that warrant curation even when error-level audit passes. */
export const NCLEX_EDITORIAL_WARN_CODES = [
  "duplicate_vignette_in_stem",
  "missing_vignette_split",
] as const;

export type NclexEditorialWarnCode = (typeof NCLEX_EDITORIAL_WARN_CODES)[number];

const editorialWarnSet = new Set<string>(NCLEX_EDITORIAL_WARN_CODES);

export function getNclexEditorialWarnCodes(item: BankItem): NclexEditorialWarnCode[] {
  const report = auditNclexBankItem(item);
  return report.issues
    .filter((i) => i.severity === "warn" && editorialWarnSet.has(i.code))
    .map((i) => i.code as NclexEditorialWarnCode);
}

export function hasNclexEditorialWarnFlags(item: BankItem): boolean {
  return getNclexEditorialWarnCodes(item).length > 0;
}

export function auditNclexBankItems(items: BankItem[]): {
  ok: boolean;
  total: number;
  errorCount: number;
  warnCount: number;
  byCode: Record<string, number>;
  samples: Array<{ index: number; subjectId?: string; issues: NclexAuditIssue[] }>;
} {
  let errorCount = 0;
  let warnCount = 0;
  const byCode: Record<string, number> = {};
  const samples: Array<{ index: number; subjectId?: string; issues: NclexAuditIssue[] }> = [];

  for (let i = 0; i < items.length; i++) {
    const report = auditNclexBankItem(items[i]!);
    for (const issue of report.issues) {
      byCode[issue.code] = (byCode[issue.code] ?? 0) + 1;
      if (issue.severity === "error") errorCount++;
      else warnCount++;
    }
    if (report.issues.some((x) => x.severity === "error") && samples.length < 25) {
      samples.push({ index: i, subjectId: items[i]?.subjectId, issues: report.issues });
    }
  }

  return {
    ok: errorCount === 0,
    total: items.length,
    errorCount,
    warnCount,
    byCode,
    samples,
  };
}

export function summarizeNclexAudit(results: NclexAuditItemReport[]): {
  total: number;
  pass: number;
  fail: number;
  bySeverity: Record<string, number>;
  byCode: Record<string, number>;
} {
  let pass = 0;
  let fail = 0;
  const bySeverity: Record<string, number> = {};
  const byCode: Record<string, number> = {};

  for (const result of results) {
    if (result.ok) pass++;
    else fail++;

    for (const issue of result.issues) {
      bySeverity[issue.severity] = (bySeverity[issue.severity] ?? 0) + 1;
      byCode[issue.code] = (byCode[issue.code] ?? 0) + 1;
    }
  }

  return { total: results.length, pass, fail, bySeverity, byCode };
}
