/**
 * Parametric USMLE calculation MCQs — verified math, unique vignettes per step.
 * Formulas align with First Aid / OpenStax physiology references.
 */
import type { EnrichedBankItem } from "./seed-helpers";
import { usmleCalcMcq, o } from "./usmle-calc-mcq-helpers";
import type { UsmleStepLevel } from "./usmle/types";

function fmt(n: number, decimals = 0): string {
  if (decimals === 0) return String(Math.round(n));
  return Number(n.toFixed(decimals)).toString();
}

function pushStep1(items: EnrichedBankItem[], seen: Set<string>) {
  for (let na = 130; na <= 145; na += 3) {
    for (let cl = 95; cl <= 110; cl += 5) {
      for (let hco3 = 16; hco3 <= 28; hco3 += 4) {
        const ag = na - (cl + hco3);
        if (ag < 8 || ag > 24) continue;
        const vignette = `Laboratory: Na⁺ ${na} mEq/L, Cl⁻ ${cl} mEq/L, HCO₃⁻ ${hco3} mEq/L.`;
        const key = `s1-ag|${vignette}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const wrong = [ag + 4, ag - 4, ag + 8].map((v) => `${v} mEq/L`);
        items.push(
          usmleCalcMcq({
            stepLevel: "step1",
            subjectId: "biochemistry",
            vignette,
            stem: "What is the anion gap (mEq/L)?",
            options: o(`${ag} mEq/L`, wrong[0]!, wrong[1]!, wrong[2]!),
            correct: `${ag} mEq/L`,
            explanation: `Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻) = ${na} − (${cl} + ${hco3}) = ${ag} mEq/L.`,
            steps: [`${na} − (${cl} + ${hco3})`, `= ${ag} mEq/L`],
            tags: ["procedural-calc", "anion-gap"],
          })
        );
      }
    }
  }

  for (let q = 0.01; q <= 0.05; q += 0.01) {
    const p = 1 - q;
    const carrier = 2 * p * q;
    const pct = Math.round(carrier * 100);
    const vignette = `Population screening: autosomal recessive allele frequency q = ${q.toFixed(2)} (Hardy–Weinberg).`;
    const key = `s1-hw|${q}`;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(
      usmleCalcMcq({
        stepLevel: "step1",
        subjectId: "pathology",
        vignette,
        stem: "What is the carrier frequency (2pq)? (Express as percent, round to nearest whole.)",
        options: o(`${pct}%`, `${pct + 2}%`, `${Math.max(1, pct - 3)}%`, `${pct + 5}%`),
        correct: `${pct}%`,
        explanation: `p ≈ ${p.toFixed(2)}, 2pq = 2 × ${p.toFixed(2)} × ${q.toFixed(2)} ≈ ${carrier.toFixed(3)} → ${pct}%.`,
        steps: [`2pq = 2×${p.toFixed(2)}×${q.toFixed(2)}`, `≈ ${pct}%`],
        tags: ["procedural-calc", "genetics"],
      })
    );
  }
}

function pushStep2(items: EnrichedBankItem[], seen: Set<string>) {
  for (let age = 50; age <= 80; age += 5) {
    for (let weight = 60; weight <= 100; weight += 10) {
      for (const cr of [1.0, 1.5, 2.0, 2.5]) {
        const crcl = Math.round(((140 - age) * weight) / (72 * cr));
        const vignette = `${age}-year-old man, weight ${weight} kg, serum creatinine ${cr} mg/dL. Estimate CrCl (Cockcroft–Gault).`;
        const key = `s2-crcl|${age}|${weight}|${cr}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const answer = `${crcl} mL/min`;
        items.push(
          usmleCalcMcq({
            stepLevel: "step2",
            subjectId: "internal-medicine",
            vignette,
            stem: "What is the estimated creatinine clearance (mL/min)? (Round to nearest whole number.)",
            options: o(
              answer,
              `${crcl + 10} mL/min`,
              `${Math.max(5, crcl - 12)} mL/min`,
              `${crcl + 20} mL/min`
            ),
            correct: answer,
            explanation: `CrCl = [(140 − age) × weight] / (72 × Cr) = (${140 - age} × ${weight}) / (72 × ${cr}) ≈ ${crcl} mL/min.`,
            steps: [
              `(${140 - age} × ${weight}) = ${(140 - age) * weight}`,
              `÷ (72 × ${cr}) = ${crcl}`,
            ],
            tags: ["procedural-calc", "cockcroft-gault"],
          })
        );
      }
    }
  }

  for (let weight = 10; weight <= 40; weight += 5) {
    const first10 = 4 * Math.min(weight, 10);
    const second10 = weight > 10 ? 2 * Math.min(weight - 10, 10) : 0;
    const remainder = weight > 20 ? 1 * (weight - 20) : 0;
    const rate = first10 + second10 + remainder;
    const vignette = `Pediatric patient ${weight} kg — maintenance IV fluids (4-2-1 rule, mL/hr).`;
    const key = `s2-421|${weight}`;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(
      usmleCalcMcq({
        stepLevel: "step2",
        subjectId: "pediatrics",
        vignette,
        stem: "What is the maintenance fluid rate (mL/hr)?",
        options: o(
          `${rate} mL/hr`,
          `${rate + 10} mL/hr`,
          `${Math.max(10, rate - 15)} mL/hr`,
          `${rate + 20} mL/hr`
        ),
        correct: `${rate} mL/hr`,
        explanation: `4-2-1: ${first10} + ${second10} + ${remainder} = ${rate} mL/hr.`,
        steps: [`4×10=${first10}`, `2×10=${second10}`, `1×${Math.max(0, weight - 20)}=${remainder}`],
        tags: ["procedural-calc", "fluids"],
      })
    );
  }

  for (let sbp = 90; sbp <= 160; sbp += 10) {
    for (let dbp = 50; dbp <= 100; dbp += 10) {
      if (dbp >= sbp) continue;
      const map = Math.round(dbp + (sbp - dbp) / 3);
      const vignette = `ICU monitoring: BP ${sbp}/${dbp} mmHg.`;
      const key = `s2-map|${sbp}|${dbp}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(
        usmleCalcMcq({
          stepLevel: "step2",
          subjectId: "internal-medicine",
          vignette,
          stem: "What is the mean arterial pressure (MAP, mmHg)? (Round to nearest whole number.)",
          options: o(`${map} mmHg`, `${map + 8} mmHg`, `${map - 10} mmHg`, `${map + 15} mmHg`),
          correct: `${map} mmHg`,
          explanation: `MAP = DBP + ⅓(SBP − DBP) = ${dbp} + (${sbp}−${dbp})/3 ≈ ${map} mmHg.`,
          steps: [`SBP−DBP=${sbp - dbp}`, `÷3=${fmt((sbp - dbp) / 3, 1)}`, `+DBP=${map}`],
          tags: ["procedural-calc", "hemodynamics"],
        })
      );
    }
  }
}

function pushStep3(items: EnrichedBankItem[], seen: Set<string>) {
  for (let control = 5; control <= 20; control += 5) {
    for (let treat = 1; treat < control; treat += 2) {
      const arr = (control - treat) / 100;
      const nnt = Math.ceil(1 / arr);
      const vignette = `Trial: ${control}% event rate (control) vs ${treat}% (treatment).`;
      const key = `s3-nnt|${control}|${treat}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(
        usmleCalcMcq({
          stepLevel: "step3",
          subjectId: "internal-medicine",
          vignette,
          stem: "What is the number needed to treat (NNT)? (Round up to next whole number.)",
          options: o(String(nnt), String(nnt + 5), String(Math.max(2, nnt - 3)), String(nnt + 10)),
          correct: String(nnt),
          explanation: `ARR = ${control}% − ${treat}% = ${control - treat}%. NNT = 1/0.${control - treat} ≈ ${nnt}.`,
          steps: [`ARR=${control - treat}%`, `NNT=1/${arr}`, `=${nnt}`],
          tags: ["procedural-calc", "nnt"],
          blueprintDomain: "usmle-biostats",
        })
      );
    }
  }

  for (const sens of [0.7, 0.8, 0.9]) {
    for (const spec of [0.85, 0.9, 0.95]) {
      const lr = sens / (1 - spec);
      const lrStr = fmt(lr, 1);
      const vignette = `Diagnostic test performance: sensitivity ${Math.round(sens * 100)}%, specificity ${Math.round(spec * 100)}%.`;
      const key = `s3-lr|${sens}|${spec}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(
        usmleCalcMcq({
          stepLevel: "step3",
          subjectId: "internal-medicine",
          vignette,
          stem: "What is the positive likelihood ratio (LR+)? (Round to one decimal.)",
          options: o(lrStr, fmt(lr + 2, 1), fmt(Math.max(0.5, lr - 2), 1), fmt(lr + 4, 1)),
          correct: lrStr,
          explanation: `LR+ = sensitivity / (1 − specificity) = ${sens} / ${(1 - spec).toFixed(2)} = ${lrStr}.`,
          steps: [`${sens}/(1−${spec})`, `=${lrStr}`],
          tags: ["procedural-calc", "likelihood-ratio"],
          blueprintDomain: "usmle-biostats",
        })
      );
    }
  }

  for (let prev = 5; prev <= 30; prev += 5) {
    for (const sens of [0.8, 0.9]) {
      for (const spec of [0.9, 0.95]) {
        const p = prev / 100;
        const tp = sens * p;
        const fp = (1 - spec) * (1 - p);
        const ppv = Math.round((tp / (tp + fp)) * 100);
        const vignette = `Screening: prevalence ${prev}%, sensitivity ${Math.round(sens * 100)}%, specificity ${Math.round(spec * 100)}%.`;
        const key = `s3-ppv|${prev}|${sens}|${spec}`;
        if (seen.has(key)) continue;
        seen.add(key);
        items.push(
          usmleCalcMcq({
            stepLevel: "step3",
            subjectId: "internal-medicine",
            vignette,
            stem: "What is the positive predictive value (PPV)? (Round to nearest whole percent.)",
            options: o(`${ppv}%`, `${ppv + 10}%`, `${Math.max(5, ppv - 12)}%`, `${ppv + 20}%`),
            correct: `${ppv}%`,
            explanation: `PPV = TP/(TP+FP) with TP=${tp.toFixed(3)}, FP=${fp.toFixed(3)} → ${ppv}%.`,
            steps: [`TP=${fmt(tp, 3)}`, `FP=${fmt(fp, 3)}`, `PPV=${ppv}%`],
            tags: ["procedural-calc", "ppv"],
            blueprintDomain: "usmle-biostats",
          })
        );
      }
    }
  }
}

export function generateUsmleProceduralCalcs(limitPerStep = 200): EnrichedBankItem[] {
  const seen = new Set<string>();
  const step1: EnrichedBankItem[] = [];
  const step2: EnrichedBankItem[] = [];
  const step3: EnrichedBankItem[] = [];

  pushStep1(step1, seen);
  pushStep2(step2, seen);
  pushStep3(step3, seen);

  const cap = (arr: EnrichedBankItem[]) => arr.slice(0, limitPerStep);
  return [...cap(step1), ...cap(step2), ...cap(step3)];
}

export function usmleCalcsForStep(
  step: UsmleStepLevel,
  items: EnrichedBankItem[]
): EnrichedBankItem[] {
  return items.filter(
    (i) =>
      (typeof i.ngnPayload?.stepLevel === "string" ? i.ngnPayload.stepLevel : null) === step ||
      i.tags?.includes(`step-${step.replace("step", "")}`) === true
  );
}
