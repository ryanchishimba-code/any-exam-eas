export type Sex = "male" | "female";

export type CrClInput = {
  age: number;
  sex: Sex;
  scrMgDl: number;
  actualWeightKg: number;
  heightInches?: number;
};

export type CrClResult = {
  crClMlMin: number;
  weightUsedKg: number;
  weightRationale: string;
  idealBodyWeightKg?: number;
  adjustedBodyWeightKg?: number;
  formulaSteps: string[];
};

/** Devine ideal body weight (kg). Height in inches; minimum 60 in for formula base. */
export function idealBodyWeightKg(heightInches: number, sex: Sex): number {
  const h = Math.max(heightInches, 60);
  if (sex === "male") return 50 + 2.3 * (h - 60);
  return 45.5 + 2.3 * (h - 60);
}

export function adjustedBodyWeightKg(actualKg: number, ibwKg: number): number {
  return ibwKg + 0.4 * (actualKg - ibwKg);
}

/** Select weight for Cockcroft-Gault per NAPLEX conventions. */
export function selectCrClWeightKg(
  actualKg: number,
  ibwKg: number | undefined
): { weightKg: number; rationale: string; ibwKg?: number; adjBwKg?: number } {
  if (!ibwKg || ibwKg <= 0) {
    return { weightKg: actualKg, rationale: "Use actual body weight." };
  }
  if (actualKg < ibwKg) {
    return {
      weightKg: actualKg,
      rationale: "Actual weight is below IBW — use actual body weight.",
      ibwKg,
    };
  }
  const obese = actualKg > ibwKg * 1.3;
  if (obese) {
    const adjBwKg = adjustedBodyWeightKg(actualKg, ibwKg);
    return {
      weightKg: adjBwKg,
      rationale:
        "Patient >30% above IBW — use adjusted body weight (ABW = IBW + 0.4 × (actual − IBW)).",
      ibwKg,
      adjBwKg,
    };
  }
  return {
    weightKg: actualKg,
    rationale: "Use actual body weight (not obese by IBW threshold).",
    ibwKg,
  };
}

export function cockcroftGaultCrCl(input: CrClInput): CrClResult {
  const ibw =
    input.heightInches && input.heightInches > 0
      ? idealBodyWeightKg(input.heightInches, input.sex)
      : undefined;
  const weight = selectCrClWeightKg(input.actualWeightKg, ibw);
  const numerator = (140 - input.age) * weight.weightKg;
  const denominator = 72 * input.scrMgDl;
  let crCl = numerator / denominator;
  if (input.sex === "female") crCl *= 0.85;

  const steps = [
    `CrCl = [(140 − age) × weight] ÷ (72 × SCr)${input.sex === "female" ? " × 0.85" : ""}`,
    `= [(140 − ${input.age}) × ${weight.weightKg.toFixed(1)}] ÷ (72 × ${input.scrMgDl})${input.sex === "female" ? " × 0.85" : ""}`,
    `≈ ${Math.round(crCl)} mL/min`,
  ];

  return {
    crClMlMin: crCl,
    weightUsedKg: weight.weightKg,
    weightRationale: weight.rationale,
    idealBodyWeightKg: weight.ibwKg,
    adjustedBodyWeightKg: weight.adjBwKg,
    formulaSteps: steps,
  };
}

export type VancomycinLoadingResult = {
  doseMg: number;
  mgPerKg: number;
  capped: boolean;
  capMg: number;
  note: string;
};

/** Loading dose for serious MRSA (25–30 mg/kg) or standard (15–20 mg/kg). */
export function vancomycinLoadingDose(
  weightKg: number,
  serious = true
): VancomycinLoadingResult {
  const mgPerKg = serious ? 25 : 17.5;
  const capMg = 3000;
  const raw = weightKg * mgPerKg;
  const capped = raw > capMg;
  return {
    doseMg: Math.round(Math.min(raw, capMg)),
    mgPerKg,
    capped,
    capMg,
    note: serious
      ? "Serious MRSA: 25–30 mg/kg (max 3 g). IDSA AUC-guided protocols often use 20–35 mg/kg loading."
      : "Standard loading: 15–20 mg/kg (max 3 g).",
  };
};

export type VancomycinIntervalResult = {
  intervalHours: number;
  intervalLabel: string;
  note: string;
};

/** Traditional interval guidance from CrCl — pair with AUC monitoring. */
export function vancomycinIntervalFromCrCl(crClMlMin: number): VancomycinIntervalResult {
  if (crClMlMin >= 50) {
    return {
      intervalHours: 12,
      intervalLabel: "q8–12 h",
      note: "Normal/high CrCl: typical q12 h starting point; titrate to AUC/MIC 400–600.",
    };
  }
  if (crClMlMin >= 30) {
    return {
      intervalHours: 24,
      intervalLabel: "q12–24 h",
      note: "Moderate renal impairment: extend interval; monitor AUC or trough at steady state (~4th dose).",
    };
  }
  if (crClMlMin >= 10) {
    return {
      intervalHours: 48,
      intervalLabel: "q24–48 h",
      note: "Significant renal impairment: prolonged interval; high nephrotoxicity risk with pip-tazo/aminoglycosides.",
    };
  }
  return {
    intervalHours: 48,
    intervalLabel: "q48 h+",
    note: "CrCl <10: extended interval or dialysis-specific dosing; consult ID/pharmacokinetics.",
  };
};

export type VancomycinMonitoringResult = {
  troughMgL: number;
  estimatedAuc: number;
  aucInTarget: boolean;
  troughInLegacyTarget: boolean;
  interpretation: string;
};

const AUC_TARGET_LOW = 400;
const AUC_TARGET_HIGH = 600;

/**
 * Educational AUC estimate from a single steady-state trough (q12h).
 * Approximation only — Bayesian/two-level sampling is preferred clinically.
 */
export function vancomycinMonitoringFromTrough(
  troughMgL: number,
  serious = true
): VancomycinMonitoringResult {
  const estimatedAuc = Math.round(troughMgL * 12);
  const aucInTarget = estimatedAuc >= AUC_TARGET_LOW && estimatedAuc <= AUC_TARGET_HIGH;
  const legacyLow = serious ? 15 : 10;
  const legacyHigh = serious ? 20 : 15;
  const troughInLegacyTarget = troughMgL >= legacyLow && troughMgL <= legacyHigh;

  let interpretation: string;
  if (aucInTarget) {
    interpretation = `Estimated AUC ≈ ${estimatedAuc} mg·h/L — within target 400–600 for serious MRSA (MIC=1).`;
  } else if (estimatedAuc < AUC_TARGET_LOW) {
    interpretation = `Estimated AUC ≈ ${estimatedAuc} — likely subtherapeutic; consider dose increase with AUC confirmation.`;
  } else {
    interpretation = `Estimated AUC ≈ ${estimatedAuc} — above target; nephrotoxicity risk — consider dose reduction.`;
  }

  return {
    troughMgL,
    estimatedAuc,
    aucInTarget,
    troughInLegacyTarget,
    interpretation,
  };
}

export function roundCrClForExam(crCl: number): number {
  return Math.round(crCl);
}

/** MAP = DBP + ⅓(SBP − DBP) — septic shock resuscitation target ≥65 mmHg. */
export function meanArterialPressure(sbp: number, dbp: number): number {
  return dbp + (sbp - dbp) / 3;
}

/** qSOFA bedside screen: ≥2 criteria suggests sepsis workup. */
export function qsofaScore(params: {
  respiratoryRate: number;
  systolicBp: number;
  alteredMentation: boolean;
}): number {
  let score = 0;
  if (params.respiratoryRate >= 22) score++;
  if (params.systolicBp <= 100) score++;
  if (params.alteredMentation) score++;
  return score;
}
