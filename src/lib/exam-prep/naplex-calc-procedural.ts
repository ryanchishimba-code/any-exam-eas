/**
 * Parametric NAPLEX calculation items — verified math, unique vignettes.
 * Formulas align with standard pharmacy references (FDA labels, USP compounding).
 */
import type { EnrichedBankItem } from "./seed-helpers";
import { ensureCalcExplanation, ensureCalcVignette } from "./naplex-calc-mcq-helpers";
import { naplexCalcCase } from "./naplex-seed-factory";

const A1 = "naplex-2026-medication-dispensing" as const;
const A3 = "naplex-2026-pharmacotherapy" as const;
const FDA = { label: "FDA prescribing information", url: "https://www.fda.gov/drugs" };
const USP797 = { label: "USP <797> Sterile Compounding", url: "https://www.usp.org" };

function fmt(n: number, decimals = 0): string {
  const v = decimals > 0 ? Number(n.toFixed(decimals)) : Math.round(n);
  return String(v);
}

function calcCase(
  subjectId: string,
  vignette: string,
  stem: string,
  correctValue: string,
  unit: string,
  explanation: string,
  meta: Parameters<typeof naplexCalcCase>[6],
  solutionSteps?: string[]
): EnrichedBankItem {
  return naplexCalcCase(
    subjectId,
    ensureCalcVignette(vignette),
    stem,
    correctValue,
    unit,
    ensureCalcExplanation(explanation),
    meta,
    solutionSteps
  );
}

function pushIvRate(items: EnrichedBankItem[], seen: Set<string>) {
  const drugs = [
    { name: "Dopamine", unit: "mcg/kg/min", concLabel: "mcg/mL" },
    { name: "Norepinephrine", unit: "mcg/kg/min", concLabel: "mcg/mL" },
    { name: "Dobutamine", unit: "mcg/kg/min", concLabel: "mcg/mL" },
  ];
  for (const drug of drugs) {
    for (let weight = 4; weight <= 120; weight += weight < 20 ? 2 : weight < 60 ? 4 : 8) {
      for (const dose of [3, 5, 7, 10, 12, 15]) {
        for (const conc of [400, 800, 1200, 1600]) {
          const rate = (dose * weight * 60) / conc;
          const answer = fmt(rate, 0);
          const vignette = `ICU | ${drug.name} ${dose} ${drug.unit} IV | Patient ${weight} kg | Final bag strength ${conc} ${drug.concLabel}`;
          const key = `${vignette}|${answer}`;
          if (seen.has(key)) continue;
          seen.add(key);
          items.push(
            calcCase(
              "compounding-calculations",
              vignette,
              "What infusion rate (mL/hr) delivers the ordered dose? (Round to nearest whole number.)",
              answer,
              "mL/hr",
              `${dose} ${drug.unit} × ${weight} kg = ${dose * weight} ${drug.unit.replace("/min", "")}/min = ${dose * weight * 60} mcg/hr. Rate = ${dose * weight * 60} ÷ ${conc} = ${rate.toFixed(1)} → ${answer} mL/hr. Verify pump programming and line compatibility per institutional policy.`,
              { blueprintDomain: A1, references: [FDA], tags: ["procedural-calc", "iv-infusion"] },
              [
                `${dose} × ${weight} × 60 = ${dose * weight * 60} mcg/hr`,
                `÷ ${conc} mcg/mL = ${rate.toFixed(1)} mL/hr`,
              ]
            )
          );
        }
      }
    }
  }
}

function pushPediatricVolume(items: EnrichedBankItem[], seen: Set<string>) {
  const drugs = [
    { name: "Amoxicillin", mgPerKg: 40, conc: 400, volBase: 5, freq: "BID", days: 10 },
    { name: "Amoxicillin", mgPerKg: 45, conc: 400, volBase: 5, freq: "TID", days: 7 },
    { name: "Acetaminophen", mgPerKg: 15, conc: 160, volBase: 5, freq: "q6h", days: 1 },
    { name: "Ibuprofen", mgPerKg: 10, conc: 100, volBase: 5, freq: "q6h", days: 1 },
  ];
  for (const drug of drugs) {
    for (let weight = 8; weight <= 48; weight += 2) {
      const dailyMg = drug.mgPerKg * weight;
      const dosesPerDay = drug.freq === "BID" ? 2 : drug.freq === "TID" ? 3 : 4;
      const doseMg = dailyMg / dosesPerDay;
      const volumePerDose = (doseMg / drug.conc) * drug.volBase;
      const totalVol =
        drug.days === 1 ? volumePerDose : volumePerDose * dosesPerDay * drug.days;
      const answer = fmt(totalVol, drug.days === 1 ? 1 : 0);
      const vignette = `Pediatric | ${drug.name} ${drug.mgPerKg} mg/kg/day ${drug.freq} | Child ${weight} kg | Suspension ${drug.conc} mg/${drug.volBase} mL | ${drug.days}-day supply`;
      const key = `${vignette}|${answer}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const stem =
        drug.days === 1
          ? "How many milliliters per dose? (Round to one decimal.)"
          : `How many milliliters (mL) should be dispensed for the full ${drug.days}-day course? (Round to nearest whole mL.)`;
      items.push(
        calcCase(
          "compounding-calculations",
          vignette,
          stem,
          answer,
          "mL",
          `Daily dose = ${drug.mgPerKg} × ${weight} = ${dailyMg} mg. Per-dose = ${dailyMg} ÷ ${dosesPerDay} = ${doseMg.toFixed(1)} mg. Volume per dose = ${doseMg.toFixed(1)}/${drug.conc} × ${drug.volBase} = ${volumePerDose.toFixed(2)} mL.` +
            (drug.days > 1
              ? ` Total ${drug.days}-day supply = ${volumePerDose.toFixed(2)} × ${dosesPerDay * drug.days} doses ≈ ${answer} mL.`
              : ` Rounded to ${answer} mL per dose.`),
          { blueprintDomain: A3, references: [FDA], tags: ["procedural-calc", "pediatric"] },
          [`${dailyMg} mg/day`, `${volumePerDose.toFixed(2)} mL per dose`]
        )
      );
    }
  }
}

function pushCrCl(items: EnrichedBankItem[], seen: Set<string>) {
  for (let age = 25; age <= 90; age += 5) {
    for (let weight = 50; weight <= 110; weight += 10) {
      for (const scr of [1.0, 1.4, 1.8, 2.2, 2.8, 3.5]) {
        for (const female of [false, true]) {
          let crcl = ((140 - age) * weight) / (72 * scr);
          if (female) crcl *= 0.85;
          const answer = fmt(crcl, 0);
          const vignette = `${female ? "F" : "M"}.P., ${age} y/o | Weight ${weight} kg | SCr ${scr} mg/dL | Cockcroft–Gault estimate for renally cleared drug dosing`;
          const key = `${vignette}|${answer}`;
          if (seen.has(key)) continue;
          seen.add(key);
          items.push(
            calcCase(
              "pharmacokinetics",
              vignette,
              "Estimated creatinine clearance (mL/min)? (Round to nearest whole number.)",
              answer,
              "mL/min",
              `CrCl = [(140 − ${age}) × ${weight}] / (72 × ${scr})${female ? " × 0.85" : ""} = ${answer} mL/min. Use for dosing thresholds per package insert; eGFR from CKD-EPI is used for staging, not always for dosing.`,
              { blueprintDomain: A3, references: [FDA], tags: ["procedural-calc", "renal"] },
              [`(140−age)×weight/(72×SCr)`, `≈ ${answer} mL/min`]
            )
          );
        }
      }
    }
  }
}

function pushKclStock(items: EnrichedBankItem[], seen: Set<string>) {
  for (const mEq of [10, 15, 20, 25, 30, 40, 50, 60]) {
    for (const stock of [1, 2, 3, 4]) {
      const vol = mEq / stock;
      const answer = fmt(vol, 1);
      const vignette = `Admixture | Add ${mEq} mEq KCl to IV bag | Stock potassium chloride ${stock} mEq/mL`;
      const key = `${vignette}|${answer}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(
        calcCase(
          "compounding-calculations",
          vignette,
          "How many mL of KCl stock are needed? (Round to one decimal.)",
          answer,
          "mL",
          `${mEq} mEq ÷ ${stock} mEq/mL = ${vol.toFixed(1)} mL. Verify final osmolarity and infusion site compatibility; central line may be required for higher concentrations per institutional policy.`,
          { blueprintDomain: A1, references: [USP797], tags: ["procedural-calc", "compounding"] },
          [`${mEq} mEq total`, `÷ ${stock} mEq/mL = ${answer} mL`]
        )
      );
    }
  }
}

function pushPumpRate(items: EnrichedBankItem[], seen: Set<string>) {
  for (let volume = 50; volume <= 1000; volume += 25) {
    for (const minutes of [15, 20, 30, 45, 60, 90, 120, 180, 240]) {
      const rate = volume / (minutes / 60);
      const answer = fmt(rate, 0);
      const vignette = `IV piggyback | ${volume} mL to infuse over ${minutes} minutes`;
      const key = `${vignette}|${answer}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(
        calcCase(
          "compounding-calculations",
          vignette,
          "Required pump rate (mL/hr)? (Round to nearest whole number.)",
          answer,
          "mL/hr",
          `${volume} mL ÷ (${minutes}/60) h = ${volume} ÷ ${(minutes / 60).toFixed(2)} = ${rate.toFixed(1)} → ${answer} mL/hr.`,
          { blueprintDomain: A1, references: [USP797], tags: ["procedural-calc", "iv-infusion"] },
          [`${minutes} min = ${(minutes / 60).toFixed(2)} h`, `${volume} mL ÷ time`]
        )
      );
    }
  }
}

function pushPercentWv(items: EnrichedBankItem[], seen: Set<string>) {
  for (let pct = 0.5; pct <= 5; pct += 0.5) {
    for (let vol = 2; vol <= 20; vol += 1) {
      const mg = pct * 10 * vol;
      const answer = `${fmt(mg, 0)} mg`;
      const vignette = `Compounding check | ${pct}% (w/v) solution | Total volume ${vol} mL`;
      const key = `${vignette}|${answer}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(
        calcCase(
          "compounding-calculations",
          vignette,
          "How many mg of solute are in this preparation? (Round to nearest whole mg.)",
          fmt(mg, 0),
          "mg",
          `${pct}% w/v = ${pct} g per 100 mL = ${pct * 10} mg/mL. In ${vol} mL: ${pct * 10} × ${vol} = ${mg} mg. Percent weight-in-volume is g/100 mL; convert to mg for small-volume calculations.`,
          { blueprintDomain: A1, references: [USP797], tags: ["procedural-calc", "compounding"] },
          [`${pct}% w/v = ${pct * 10} mg/mL`, `× ${vol} mL = ${mg} mg`]
        )
      );
    }
  }
}

function pushAlligation(items: EnrichedBankItem[], seen: Set<string>) {
  for (let targetPct = 10; targetPct <= 30; targetPct += 2) {
    for (let totalMl = 100; totalMl <= 600; totalMl += 50) {
      for (const [high, low] of [
        [50, 5],
        [70, 10],
        [40, 5],
      ] as const) {
        const highVol = ((targetPct - low) / (high - low)) * totalMl;
        const answer = fmt(highVol, 0);
        const vignette = `Alligation | Prepare ${totalMl} mL of ${targetPct}% dextrose from ${high}% and ${low}% stock solutions`;
        const key = `${vignette}|${answer}`;
        if (seen.has(key)) continue;
        seen.add(key);
        items.push(
          calcCase(
            "compounding-calculations",
            vignette,
            "Milliliters of higher-strength stock required? (Round to nearest whole mL.)",
            answer,
            "mL",
            `Alligation ratio: (${targetPct}−${low})/(${high}−${low}) = ${(targetPct - low) / (high - low)} of ${totalMl} mL ≈ ${answer} mL of ${high}% and the remainder ${low}%. Verify final concentration before labeling.`,
            { blueprintDomain: A1, references: [USP797], tags: ["procedural-calc", "alligation"] },
            [`(${targetPct}−${low})/(${high}−${low})`, `× ${totalMl} mL`]
          )
        );
      }
    }
  }
}

function pushTabletDispense(items: EnrichedBankItem[], seen: Set<string>) {
  for (let mgPerDay = 250; mgPerDay <= 2000; mgPerDay += 250) {
    for (const strength of [5, 10, 20, 25, 50, 100, 250, 500]) {
      for (const days of [7, 10, 14, 30, 90]) {
        const tablets = (mgPerDay * days) / strength;
        const answer = fmt(tablets, 0);
        const vignette = `Dispensing | Rx ${mgPerDay} mg/day | Tablets ${strength} mg | ${days}-day supply`;
        const key = `${vignette}|${answer}`;
        if (seen.has(key)) continue;
        seen.add(key);
        items.push(
          calcCase(
            "compounding-calculations",
            vignette,
            "How many tablets should be dispensed for this order? (Round to nearest whole tablet.)",
            answer,
            "tablets",
            `Total mg = ${mgPerDay} × ${days} = ${mgPerDay * days} mg. Tablets = ${mgPerDay * days} ÷ ${strength} = ${tablets.toFixed(1)} → ${answer} tablets. Confirm sig matches daily dose and duration before release.`,
            { blueprintDomain: A1, references: [FDA], tags: ["procedural-calc", "quantity"] },
            [`${mgPerDay * days} mg total`, `÷ ${strength} mg/tablet`]
          )
        );
      }
    }
  }
}

function pushHeparinBolus(items: EnrichedBankItem[], seen: Set<string>) {
  for (let weight = 50; weight <= 120; weight += 5) {
    for (const unitsPerKg of [50, 60, 70, 80]) {
      for (const conc of [500, 1000]) {
        const units = unitsPerKg * weight;
        const vol = units / conc;
        const answer = fmt(vol, 1);
        const vignette = `Anticoagulation | Weight ${weight} kg | Heparin bolus ${unitsPerKg} units/kg IV | Concentration ${conc} units/mL`;
        const key = `${vignette}|${answer}`;
        if (seen.has(key)) continue;
        seen.add(key);
        items.push(
          calcCase(
            "pharmacokinetics",
            vignette,
            "Bolus volume (mL)? (Round to one decimal.)",
            answer,
            "mL",
            `Bolus = ${unitsPerKg} × ${weight} = ${units} units. Volume = ${units} ÷ ${conc} = ${vol.toFixed(2)} → ${answer} mL. Confirm indication and aPTT monitoring protocol per institutional protocol.`,
            { blueprintDomain: A3, references: [FDA], tags: ["procedural-calc", "heparin"] },
            [`${units} units`, `÷ ${conc} units/mL`]
          )
        );
      }
    }
  }
}

function pushLevothyroxine(items: EnrichedBankItem[], seen: Set<string>) {
  for (let weight = 45; weight <= 95; weight += 5) {
    for (const mcgPerKg of [1.4, 1.6, 1.8]) {
      const dose = mcgPerKg * weight;
      const answer = fmt(dose, 0);
      const vignette = `Hypothyroidism | Weight ${weight} kg | Full replacement levothyroxine ${mcgPerKg} mcg/kg/day`;
      const key = `${vignette}|${answer}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(
        calcCase(
          "endocrine-rx",
          vignette,
          "Daily dose (mcg)? (Round to nearest whole mcg.)",
          answer,
          "mcg",
          `${mcgPerKg} mcg/kg × ${weight} kg = ${dose.toFixed(1)} → ${answer} mcg daily. Recheck TSH in 6–8 weeks; counsel on empty-stomach administration and separation from calcium/iron.`,
          { blueprintDomain: A3, references: [FDA], tags: ["procedural-calc", "endocrine"] },
          [`${mcgPerKg} × ${weight} = ${answer} mcg`]
        )
      );
    }
  }
}

/** Generate verified procedural calculation items (unique vignette + answer). */
export function generateNaplexProceduralCalcs(maxItems = 900): EnrichedBankItem[] {
  const items: EnrichedBankItem[] = [];
  const seen = new Set<string>();
  pushIvRate(items, seen);
  pushPediatricVolume(items, seen);
  pushCrCl(items, seen);
  pushKclStock(items, seen);
  pushPumpRate(items, seen);
  pushPercentWv(items, seen);
  pushAlligation(items, seen);
  pushTabletDispense(items, seen);
  pushHeparinBolus(items, seen);
  pushLevothyroxine(items, seen);
  return items.slice(0, maxItems);
}
