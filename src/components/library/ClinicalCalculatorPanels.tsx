"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  CalcField,
  CalcResultPanel,
  parsePositiveNum,
} from "@/components/library/CalculatorUi";
import {
  bodyMassIndex,
  bodySurfaceArea,
  bsaDose,
  dosageByWeight,
  dripRateGttPerMin,
  infusionTimeHours,
  ivFlowRateFromMinutes,
  ivFlowRateMlPerHour,
  metricConversion,
  METRIC_CONVERSION_LABELS,
  type BmiUnitMode,
  type BsaFormula,
  type MetricConversionKind,
} from "@/lib/library/calculations/clinical-calcs";

export type ClinicalCalcId =
  | "bmi"
  | "weight-dose"
  | "iv-flow"
  | "drip-rate"
  | "infusion-time"
  | "bsa-dose"
  | "conversions";

export const CLINICAL_CALC_TABS: Array<{ id: ClinicalCalcId; label: string }> = [
  { id: "bmi", label: "BMI" },
  { id: "weight-dose", label: "Dose by weight" },
  { id: "iv-flow", label: "IV flow rate" },
  { id: "drip-rate", label: "Drip rate" },
  { id: "infusion-time", label: "Infusion time" },
  { id: "bsa-dose", label: "BSA dosing" },
  { id: "conversions", label: "Conversions" },
];

export function ClinicalCalculatorPanel({ calcId }: { calcId: ClinicalCalcId }) {
  switch (calcId) {
    case "bmi":
      return <BmiPanel />;
    case "weight-dose":
      return <WeightDosePanel />;
    case "iv-flow":
      return <IvFlowPanel />;
    case "drip-rate":
      return <DripRatePanel />;
    case "infusion-time":
      return <InfusionTimePanel />;
    case "bsa-dose":
      return <BsaDosePanel />;
    case "conversions":
      return <ConversionsPanel />;
  }
}

function BmiPanel() {
  const [mode, setMode] = useState<BmiUnitMode>("metric");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState(mode === "metric" ? "175" : "69");

  const result = useMemo(() => {
    const w = parsePositiveNum(weight);
    const h = parsePositiveNum(height);
    if (!w || !h) return null;
    return bodyMassIndex(mode, w, h);
  }, [mode, weight, height]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <CalcField label="Units">
          <select
            className="apple-input h-11 w-full"
            value={mode}
            onChange={(e) => {
              const next = e.target.value as BmiUnitMode;
              setMode(next);
              setHeight(next === "metric" ? "175" : "69");
            }}
          >
            <option value="metric">Metric (kg, cm)</option>
            <option value="imperial">Imperial (lb, in)</option>
          </select>
        </CalcField>
        <CalcField label={mode === "metric" ? "Weight (kg)" : "Weight (lb)"}>
          <Input type="number" min={1} value={weight} onChange={(e) => setWeight(e.target.value)} />
        </CalcField>
        <CalcField label={mode === "metric" ? "Height (cm)" : "Height (in)"}>
          <Input type="number" min={1} value={height} onChange={(e) => setHeight(e.target.value)} />
        </CalcField>
      </div>
      <div>
        {result ? (
          <CalcResultPanel result={result} title="Body mass index" />
        ) : (
          <p className="text-[13px] text-[var(--color-ink-muted)]">Enter valid weight and height.</p>
        )}
      </div>
    </div>
  );
}

function WeightDosePanel() {
  const [dosePerKg, setDosePerKg] = useState("10");
  const [weightKg, setWeightKg] = useState("75");

  const result = useMemo(() => {
    const dose = parsePositiveNum(dosePerKg);
    const w = parsePositiveNum(weightKg);
    if (!dose || !w) return null;
    return dosageByWeight(dose, w);
  }, [dosePerKg, weightKg]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <CalcField label="Ordered dose (mg/kg)" hint="e.g. 10 mg/kg for weight-based pediatric dosing">
          <Input type="number" min={0.1} step="0.1" value={dosePerKg} onChange={(e) => setDosePerKg(e.target.value)} />
        </CalcField>
        <CalcField label="Patient weight (kg)">
          <Input type="number" min={1} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
        </CalcField>
      </div>
      <div>
        {result ? (
          <CalcResultPanel result={result} title="Total dose" />
        ) : (
          <p className="text-[13px] text-[var(--color-ink-muted)]">Enter dose and weight.</p>
        )}
      </div>
    </div>
  );
}

function IvFlowPanel() {
  const [timeMode, setTimeMode] = useState<"hours" | "minutes">("hours");
  const [volume, setVolume] = useState("1000");
  const [time, setTime] = useState("8");

  const result = useMemo(() => {
    const v = parsePositiveNum(volume);
    const t = parsePositiveNum(time);
    if (!v || !t) return null;
    return timeMode === "hours"
      ? ivFlowRateMlPerHour(v, t)
      : ivFlowRateFromMinutes(v, t);
  }, [volume, time, timeMode]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <CalcField label="Volume to infuse (mL)">
          <Input type="number" min={1} value={volume} onChange={(e) => setVolume(e.target.value)} />
        </CalcField>
        <CalcField label="Time unit">
          <select
            className="apple-input h-11 w-full"
            value={timeMode}
            onChange={(e) => setTimeMode(e.target.value as "hours" | "minutes")}
          >
            <option value="hours">Hours</option>
            <option value="minutes">Minutes</option>
          </select>
        </CalcField>
        <CalcField label={timeMode === "hours" ? "Infusion time (hr)" : "Infusion time (min)"}>
          <Input type="number" min={1} value={time} onChange={(e) => setTime(e.target.value)} />
        </CalcField>
      </div>
      <div>
        {result ? (
          <CalcResultPanel result={result} title="IV flow rate" />
        ) : (
          <p className="text-[13px] text-[var(--color-ink-muted)]">Enter volume and time.</p>
        )}
      </div>
    </div>
  );
}

function DripRatePanel() {
  const [volume, setVolume] = useState("100");
  const [dropFactor, setDropFactor] = useState("15");
  const [timeMin, setTimeMin] = useState("60");

  const result = useMemo(() => {
    const v = parsePositiveNum(volume);
    const df = parsePositiveNum(dropFactor);
    const t = parsePositiveNum(timeMin);
    if (!v || !df || !t) return null;
    return dripRateGttPerMin(v, df, t);
  }, [volume, dropFactor, timeMin]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <CalcField label="Volume (mL)">
          <Input type="number" min={1} value={volume} onChange={(e) => setVolume(e.target.value)} />
        </CalcField>
        <CalcField label="Drop factor (gtt/mL)" hint="Common: 10, 15, or 20 gtt/mL">
          <select
            className="apple-input h-11 w-full"
            value={dropFactor}
            onChange={(e) => setDropFactor(e.target.value)}
          >
            <option value="10">10 gtt/mL (macro)</option>
            <option value="15">15 gtt/mL (macro)</option>
            <option value="20">20 gtt/mL (macro)</option>
            <option value="60">60 gtt/mL (micro)</option>
          </select>
        </CalcField>
        <CalcField label="Infusion time (min)">
          <Input type="number" min={1} value={timeMin} onChange={(e) => setTimeMin(e.target.value)} />
        </CalcField>
      </div>
      <div>
        {result ? (
          <CalcResultPanel result={result} title="Drip rate" />
        ) : (
          <p className="text-[13px] text-[var(--color-ink-muted)]">Enter volume, drop factor, and time.</p>
        )}
      </div>
    </div>
  );
}

function InfusionTimePanel() {
  const [volume, setVolume] = useState("500");
  const [rate, setRate] = useState("125");

  const result = useMemo(() => {
    const v = parsePositiveNum(volume);
    const r = parsePositiveNum(rate);
    if (!v || !r) return null;
    return infusionTimeHours(v, r);
  }, [volume, rate]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <CalcField label="Volume (mL)">
          <Input type="number" min={1} value={volume} onChange={(e) => setVolume(e.target.value)} />
        </CalcField>
        <CalcField label="Rate (mL/hr)">
          <Input type="number" min={1} value={rate} onChange={(e) => setRate(e.target.value)} />
        </CalcField>
      </div>
      <div>
        {result ? (
          <CalcResultPanel result={result} title="Infusion time" />
        ) : (
          <p className="text-[13px] text-[var(--color-ink-muted)]">Enter volume and rate.</p>
        )}
      </div>
    </div>
  );
}

function BsaDosePanel() {
  const [dosePerM2, setDosePerM2] = useState("50");
  const [heightCm, setHeightCm] = useState("170");
  const [weightKg, setWeightKg] = useState("70");
  const [formula, setFormula] = useState<BsaFormula>("mosteller");

  const bsaOnly = useMemo(() => {
    const h = parsePositiveNum(heightCm);
    const w = parsePositiveNum(weightKg);
    if (!h || !w) return null;
    return bodySurfaceArea(h, w, formula);
  }, [heightCm, weightKg, formula]);

  const doseResult = useMemo(() => {
    const dose = parsePositiveNum(dosePerM2);
    const h = parsePositiveNum(heightCm);
    const w = parsePositiveNum(weightKg);
    if (!dose || !h || !w) return null;
    return bsaDose(dose, h, w, formula);
  }, [dosePerM2, heightCm, weightKg, formula]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <CalcField label="Ordered dose (mg/m²)">
          <Input type="number" min={0.1} step="0.1" value={dosePerM2} onChange={(e) => setDosePerM2(e.target.value)} />
        </CalcField>
        <CalcField label="Height (cm)">
          <Input type="number" min={1} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
        </CalcField>
        <CalcField label="Weight (kg)">
          <Input type="number" min={1} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
        </CalcField>
        <CalcField label="BSA formula">
          <select
            className="apple-input h-11 w-full"
            value={formula}
            onChange={(e) => setFormula(e.target.value as BsaFormula)}
          >
            <option value="mosteller">Mosteller (standard)</option>
            <option value="dubois">Du Bois</option>
          </select>
        </CalcField>
        {bsaOnly ? (
          <p className="text-[12px] text-[var(--color-ink-muted)]">
            BSA alone: {bsaOnly.resultFormatted} m²
          </p>
        ) : null}
      </div>
      <div>
        {doseResult ? (
          <CalcResultPanel result={doseResult} title="BSA-based dose" />
        ) : (
          <p className="text-[13px] text-[var(--color-ink-muted)]">Enter dose, height, and weight.</p>
        )}
      </div>
    </div>
  );
}

function ConversionsPanel() {
  const [kind, setKind] = useState<MetricConversionKind>("kg-lb");
  const [toMetric, setToMetric] = useState(false);
  const [value, setValue] = useState("10");

  const labels = METRIC_CONVERSION_LABELS[kind];
  const fromUnit = toMetric ? labels.imperialUnit : labels.metricUnit;
  const toUnit = toMetric ? labels.metricUnit : labels.imperialUnit;

  const result = useMemo(() => {
    const v = parsePositiveNum(value);
    if (!v) return null;
    return metricConversion(kind, v, toMetric);
  }, [kind, value, toMetric]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <CalcField label="Conversion type">
          <select
            className="apple-input h-11 w-full"
            value={kind}
            onChange={(e) => setKind(e.target.value as MetricConversionKind)}
          >
            <option value="kg-lb">Weight: kg ↔ lb</option>
            <option value="cm-in">Length: cm ↔ in</option>
            <option value="mg-g">Mass: mg ↔ g</option>
            <option value="ml-l">Volume: mL ↔ L</option>
            <option value="mcg-mg">Drug units: mcg ↔ mg</option>
          </select>
        </CalcField>
        <CalcField label="Direction">
          <select
            className="apple-input h-11 w-full"
            value={toMetric ? "to-metric" : "from-metric"}
            onChange={(e) => setToMetric(e.target.value === "to-metric")}
          >
            <option value="from-metric">{labels.metricUnit} → {labels.imperialUnit}</option>
            <option value="to-metric">{labels.imperialUnit} → {labels.metricUnit}</option>
          </select>
        </CalcField>
        <CalcField label={`Value (${fromUnit})`}>
          <Input type="number" min={0.001} step="any" value={value} onChange={(e) => setValue(e.target.value)} />
        </CalcField>
      </div>
      <div>
        {result ? (
          <CalcResultPanel
            result={{ ...result, resultUnit: toUnit }}
            title={`Converted to ${toUnit}`}
          />
        ) : (
          <p className="text-[13px] text-[var(--color-ink-muted)]">Enter a positive value.</p>
        )}
      </div>
    </div>
  );
}
