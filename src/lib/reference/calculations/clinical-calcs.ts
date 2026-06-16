/** Structured output for step-by-step calculator UI. */
export type CalculationResult = {
  formula: string;
  steps: string[];
  result: number;
  resultUnit: string;
  resultFormatted: string;
  interpretation?: string;
};

const LB_PER_KG = 2.2046226218;
const CM_PER_IN = 2.54;

function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function fmt(value: number, decimals = 1): string {
  return round(value, decimals).toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });
}

export type BmiUnitMode = "metric" | "imperial";

export function bodyMassIndex(
  mode: BmiUnitMode,
  weight: number,
  height: number
): CalculationResult {
  if (mode === "metric") {
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    const steps = [
      `BMI = weight (kg) ÷ height (m)²`,
      `height = ${height} cm = ${fmt(heightM, 2)} m`,
      `BMI = ${weight} ÷ (${fmt(heightM, 2)})²`,
      `BMI = ${weight} ÷ ${fmt(heightM * heightM, 3)}`,
      `≈ ${fmt(bmi)} kg/m²`,
    ];
    return {
      formula: "BMI = weight (kg) ÷ [height (m)]²",
      steps,
      result: round(bmi),
      resultUnit: "kg/m²",
      resultFormatted: fmt(bmi),
      interpretation: bmiInterpretation(bmi),
    };
  }

  const bmi = (703 * weight) / (height * height);
  const steps = [
    `BMI = 703 × weight (lb) ÷ [height (in)]²`,
    `BMI = 703 × ${weight} ÷ (${height})²`,
    `BMI = ${703 * weight} ÷ ${height * height}`,
    `≈ ${fmt(bmi)} kg/m²`,
  ];
  return {
    formula: "BMI = 703 × weight (lb) ÷ [height (in)]²",
    steps,
    result: round(bmi),
    resultUnit: "kg/m²",
    resultFormatted: fmt(bmi),
    interpretation: bmiInterpretation(bmi),
  };
}

function bmiInterpretation(bmi: number): string {
  if (bmi < 18.5) return "Below healthy range (<18.5) — underweight category.";
  if (bmi < 25) return "Healthy weight range (18.5–24.9).";
  if (bmi < 30) return "Overweight category (25–29.9).";
  return "Obese category (≥30).";
}

/** Total dose = mg/kg × weight (kg). */
export function dosageByWeight(
  doseMgPerKg: number,
  weightKg: number
): CalculationResult {
  const totalMg = doseMgPerKg * weightKg;
  const steps = [
    `Total dose = dose (mg/kg) × weight (kg)`,
    `= ${doseMgPerKg} × ${weightKg}`,
    `= ${fmt(totalMg, 2)} mg`,
  ];
  return {
    formula: "Total dose (mg) = dose (mg/kg) × weight (kg)",
    steps,
    result: round(totalMg, 2),
    resultUnit: "mg",
    resultFormatted: fmt(totalMg, 2),
  };
}

/** IV flow rate in mL/hr from volume and time. */
export function ivFlowRateMlPerHour(
  volumeMl: number,
  timeHours: number
): CalculationResult {
  const rate = volumeMl / timeHours;
  const steps = [
    `Rate (mL/hr) = Volume (mL) ÷ Time (hr)`,
    `= ${volumeMl} ÷ ${timeHours}`,
    `= ${fmt(rate, 2)} mL/hr`,
  ];
  return {
    formula: "Rate (mL/hr) = Volume (mL) ÷ Time (hr)",
    steps,
    result: round(rate, 2),
    resultUnit: "mL/hr",
    resultFormatted: fmt(rate, 2),
  };
}

/** IV flow rate in mL/hr when time is given in minutes. */
export function ivFlowRateFromMinutes(
  volumeMl: number,
  timeMinutes: number
): CalculationResult {
  const rate = (volumeMl * 60) / timeMinutes;
  const steps = [
    `Rate (mL/hr) = Volume (mL) × 60 ÷ Time (min)`,
    `= ${volumeMl} × 60 ÷ ${timeMinutes}`,
    `= ${volumeMl * 60} ÷ ${timeMinutes}`,
    `= ${fmt(rate, 2)} mL/hr`,
  ];
  return {
    formula: "Rate (mL/hr) = Volume (mL) × 60 ÷ Time (min)",
    steps,
    result: round(rate, 2),
    resultUnit: "mL/hr",
    resultFormatted: fmt(rate, 2),
  };
}

/** Drip rate in gtt/min. */
export function dripRateGttPerMin(
  volumeMl: number,
  dropFactorGttPerMl: number,
  timeMinutes: number
): CalculationResult {
  const gtt = (volumeMl * dropFactorGttPerMl) / timeMinutes;
  const steps = [
    `gtt/min = (Volume (mL) × Drop factor) ÷ Time (min)`,
    `= (${volumeMl} × ${dropFactorGttPerMl}) ÷ ${timeMinutes}`,
    `= ${volumeMl * dropFactorGttPerMl} ÷ ${timeMinutes}`,
    `≈ ${fmt(gtt, 1)} gtt/min`,
  ];
  return {
    formula: "gtt/min = (Volume (mL) × Drop factor) ÷ Time (min)",
    steps,
    result: round(gtt, 1),
    resultUnit: "gtt/min",
    resultFormatted: fmt(gtt, 1),
  };
}

/** Infusion time in hours from volume and rate. */
export function infusionTimeHours(
  volumeMl: number,
  rateMlPerHour: number
): CalculationResult {
  const hours = volumeMl / rateMlPerHour;
  const minutes = hours * 60;
  const steps = [
    `Time (hr) = Volume (mL) ÷ Rate (mL/hr)`,
    `= ${volumeMl} ÷ ${rateMlPerHour}`,
    `= ${fmt(hours, 2)} hr`,
    `≈ ${fmt(minutes, 0)} min`,
  ];
  return {
    formula: "Time (hr) = Volume (mL) ÷ Rate (mL/hr)",
    steps,
    result: round(hours, 2),
    resultUnit: "hr",
    resultFormatted: fmt(hours, 2),
    interpretation: `≈ ${fmt(minutes, 0)} minutes`,
  };
}

export type BsaFormula = "mosteller" | "dubois";

/**
 * Body surface area — Mosteller is the standard for nursing/pharmacy dosing.
 * Mosteller: BSA (m²) = √(height(cm) × weight(kg) / 3600)
 * Du Bois: BSA (m²) = 0.007184 × height(cm)^0.725 × weight(kg)^0.425
 */
export function bodySurfaceArea(
  heightCm: number,
  weightKg: number,
  formula: BsaFormula = "mosteller"
): CalculationResult {
  if (formula === "mosteller") {
    const product = heightCm * weightKg;
    const bsa = Math.sqrt(product / 3600);
    const steps = [
      `BSA (m²) = √(height (cm) × weight (kg) ÷ 3600)`,
      `= √(${heightCm} × ${weightKg} ÷ 3600)`,
      `= √(${product} ÷ 3600)`,
      `= √${fmt(product / 3600, 4)}`,
      `≈ ${fmt(bsa, 2)} m²`,
    ];
    return {
      formula: "BSA (m²) = √(height (cm) × weight (kg) ÷ 3600)",
      steps,
      result: round(bsa, 2),
      resultUnit: "m²",
      resultFormatted: fmt(bsa, 2),
    };
  }

  const bsa = 0.007184 * heightCm ** 0.725 * weightKg ** 0.425;
  const steps = [
    `BSA (m²) = 0.007184 × height(cm)^0.725 × weight(kg)^0.425`,
    `= 0.007184 × ${heightCm}^0.725 × ${weightKg}^0.425`,
    `≈ ${fmt(bsa, 2)} m²`,
  ];
  return {
    formula: "BSA (m²) = 0.007184 × height(cm)^0.725 × weight(kg)^0.425",
    steps,
    result: round(bsa, 2),
    resultUnit: "m²",
    resultFormatted: fmt(bsa, 2),
  };
}

/** Total dose from mg/m² × BSA. */
export function bsaDose(
  doseMgPerM2: number,
  heightCm: number,
  weightKg: number,
  formula: BsaFormula = "mosteller"
): CalculationResult {
  const bsa = bodySurfaceArea(heightCm, weightKg, formula);
  const totalMg = doseMgPerM2 * bsa.result;
  const steps = [
    `Step 1 — BSA (${bsa.resultFormatted} m²):`,
    ...bsa.steps.map((s) => `  ${s}`),
    `Step 2 — Total dose:`,
    `Total dose (mg) = dose (mg/m²) × BSA (m²)`,
    `= ${doseMgPerM2} × ${bsa.resultFormatted}`,
    `= ${fmt(totalMg, 2)} mg`,
  ];
  return {
    formula: "Total dose (mg) = dose (mg/m²) × BSA (m²); BSA via Mosteller",
    steps,
    result: round(totalMg, 2),
    resultUnit: "mg",
    resultFormatted: fmt(totalMg, 2),
    interpretation: `BSA = ${bsa.resultFormatted} m² (${formula === "mosteller" ? "Mosteller" : "Du Bois"})`,
  };
}

export type MetricConversionKind =
  | "kg-lb"
  | "cm-in"
  | "mg-g"
  | "ml-l"
  | "mcg-mg";

export function metricConversion(
  kind: MetricConversionKind,
  value: number,
  toMetric: boolean
): CalculationResult {
  switch (kind) {
    case "kg-lb":
      if (toMetric) {
        const kg = value / LB_PER_KG;
        return {
          formula: "kg = lb ÷ 2.2",
          steps: [`kg = ${value} ÷ ${fmt(LB_PER_KG, 2)}`, `= ${fmt(kg, 2)} kg`],
          result: round(kg, 2),
          resultUnit: "kg",
          resultFormatted: fmt(kg, 2),
        };
      }
      const lb = value * LB_PER_KG;
      return {
        formula: "lb = kg × 2.2",
        steps: [`lb = ${value} × ${fmt(LB_PER_KG, 2)}`, `= ${fmt(lb, 2)} lb`],
        result: round(lb, 2),
        resultUnit: "lb",
        resultFormatted: fmt(lb, 2),
      };

    case "cm-in":
      if (toMetric) {
        const cm = value * CM_PER_IN;
        return {
          formula: "cm = in × 2.54",
          steps: [`cm = ${value} × ${CM_PER_IN}`, `= ${fmt(cm, 2)} cm`],
          result: round(cm, 2),
          resultUnit: "cm",
          resultFormatted: fmt(cm, 2),
        };
      }
      const inVal = value / CM_PER_IN;
      return {
        formula: "in = cm ÷ 2.54",
        steps: [`in = ${value} ÷ ${CM_PER_IN}`, `= ${fmt(inVal, 2)} in`],
        result: round(inVal, 2),
        resultUnit: "in",
        resultFormatted: fmt(inVal, 2),
      };

    case "mg-g":
      if (toMetric) {
        const g = value / 1000;
        return {
          formula: "g = mg ÷ 1000",
          steps: [`g = ${value} ÷ 1000`, `= ${fmt(g, 3)} g`],
          result: round(g, 3),
          resultUnit: "g",
          resultFormatted: fmt(g, 3),
        };
      }
      const mg = value * 1000;
      return {
        formula: "mg = g × 1000",
        steps: [`mg = ${value} × 1000`, `= ${fmt(mg, 0)} mg`],
        result: round(mg, 0),
        resultUnit: "mg",
        resultFormatted: fmt(mg, 0),
      };

    case "ml-l":
      if (toMetric) {
        const l = value / 1000;
        return {
          formula: "L = mL ÷ 1000",
          steps: [`L = ${value} ÷ 1000`, `= ${fmt(l, 3)} L`],
          result: round(l, 3),
          resultUnit: "L",
          resultFormatted: fmt(l, 3),
        };
      }
      const ml = value * 1000;
      return {
        formula: "mL = L × 1000",
        steps: [`mL = ${value} × 1000`, `= ${fmt(ml, 0)} mL`],
        result: round(ml, 0),
        resultUnit: "mL",
        resultFormatted: fmt(ml, 0),
      };

    case "mcg-mg":
      if (toMetric) {
        const mgFromMcg = value / 1000;
        return {
          formula: "mg = mcg ÷ 1000",
          steps: [`mg = ${value} ÷ 1000`, `= ${fmt(mgFromMcg, 3)} mg`],
          result: round(mgFromMcg, 3),
          resultUnit: "mg",
          resultFormatted: fmt(mgFromMcg, 3),
        };
      }
      const mcg = value * 1000;
      return {
        formula: "mcg = mg × 1000",
        steps: [`mcg = ${value} × 1000`, `= ${fmt(mcg, 0)} mcg`],
        result: round(mcg, 0),
        resultUnit: "mcg",
        resultFormatted: fmt(mcg, 0),
      };
  }
}

export const METRIC_CONVERSION_LABELS: Record<
  MetricConversionKind,
  { from: string; to: string; metricUnit: string; imperialUnit: string }
> = {
  "kg-lb": { from: "lb", to: "kg", metricUnit: "kg", imperialUnit: "lb" },
  "cm-in": { from: "in", to: "cm", metricUnit: "cm", imperialUnit: "in" },
  "mg-g": { from: "g", to: "mg", metricUnit: "mg", imperialUnit: "g" },
  "ml-l": { from: "L", to: "mL", metricUnit: "mL", imperialUnit: "L" },
  "mcg-mg": { from: "mg", to: "mcg", metricUnit: "mcg", imperialUnit: "mg" },
};
