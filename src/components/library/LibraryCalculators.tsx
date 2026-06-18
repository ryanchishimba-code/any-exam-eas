"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CalcField,
  CalcFormulaBox,
  CalcResultBox,
  CalcStepsBox,
  calcPanelShell,
  parsePositiveNum,
} from "@/components/library/CalculatorUi";
import {
  CLINICAL_CALC_TABS,
  ClinicalCalculatorPanel,
  type ClinicalCalcId,
} from "@/components/library/ClinicalCalculatorPanels";
import {
  cockcroftGaultCrCl,
  meanArterialPressure,
  qsofaScore,
  roundCrClForExam,
  vancomycinIntervalFromCrCl,
  vancomycinLoadingDose,
  vancomycinMonitoringFromTrough,
  type Sex,
} from "@/lib/library/calculations/pharmacy-calcs";
import { libUi } from "@/lib/library/library-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type PharmacyCalcTab = "crcl" | "vancomycin" | "bedside";
type CalcTab = ClinicalCalcId | PharmacyCalcTab;

const CLINICAL_EXAMS: ExamSlug[] = ["naplex", "usmle", "nclex", "pance", "aanp-fnp", "npte-pt"];

export function LibraryCalculators({ examSlug }: { examSlug: ExamSlug }) {
  const showVanc = examSlug === "naplex" || examSlug === "usmle";
  const showBedside =
    examSlug === "nclex" || examSlug === "pance" || examSlug === "aanp-fnp";
  const [tab, setTab] = useState<CalcTab>("bmi");

  const [age, setAge] = useState("70");
  const [sex, setSex] = useState<Sex>("male");
  const [scr, setScr] = useState("2.4");
  const [weight, setWeight] = useState("75");
  const [height, setHeight] = useState("");

  const [vancWeight, setVancWeight] = useState("75");
  const [vancSerious, setVancSerious] = useState(true);
  const [vancCrCl, setVancCrCl] = useState("30");
  const [vancTrough, setVancTrough] = useState("16");

  const [mapSbp, setMapSbp] = useState("90");
  const [mapDbp, setMapDbp] = useState("60");
  const [qsofaRr, setQsofaRr] = useState("24");
  const [qsofaSbp, setQsofaSbp] = useState("95");
  const [qsofaGcs, setQsofaGcs] = useState(false);

  const tabs = useMemo(() => {
    const items: Array<{ id: CalcTab; label: string }> = [...CLINICAL_CALC_TABS];
    items.push({ id: "crcl", label: "CrCl" });
    if (showVanc) items.push({ id: "vancomycin", label: "Vancomycin" });
    if (showBedside) items.push({ id: "bedside", label: "MAP & qSOFA" });
    return items;
  }, [showVanc, showBedside]);

  const crClResult = useMemo(() => {
    const ageN = parsePositiveNum(age);
    const scrN = parsePositiveNum(scr);
    const weightN = parsePositiveNum(weight);
    if (!ageN || !scrN || !weightN) return null;
    const heightN = height.trim() ? parsePositiveNum(height) : null;
    return cockcroftGaultCrCl({
      age: ageN,
      sex,
      scrMgDl: scrN,
      actualWeightKg: weightN,
      heightInches: heightN ?? undefined,
    });
  }, [age, sex, scr, weight, height]);

  const vancLoading = useMemo(() => {
    const w = parsePositiveNum(vancWeight);
    if (!w) return null;
    return vancomycinLoadingDose(w, vancSerious);
  }, [vancWeight, vancSerious]);

  const vancInterval = useMemo(() => {
    const c = parsePositiveNum(vancCrCl);
    if (!c) return null;
    return vancomycinIntervalFromCrCl(c);
  }, [vancCrCl]);

  const vancMonitor = useMemo(() => {
    const t = parsePositiveNum(vancTrough);
    if (!t) return null;
    return vancomycinMonitoringFromTrough(t, vancSerious);
  }, [vancTrough, vancSerious]);

  const mapResult = useMemo(() => {
    const sbp = parsePositiveNum(mapSbp);
    const dbp = parsePositiveNum(mapDbp);
    if (!sbp || !dbp) return null;
    return meanArterialPressure(sbp, dbp);
  }, [mapSbp, mapDbp]);

  const qsofaResult = useMemo(() => {
    const rr = parsePositiveNum(qsofaRr);
    const sbp = parsePositiveNum(qsofaSbp);
    if (!rr || !sbp) return null;
    return qsofaScore({
      respiratoryRate: rr,
      systolicBp: sbp,
      alteredMentation: qsofaGcs,
    });
  }, [qsofaRr, qsofaSbp, qsofaGcs]);

  if (!CLINICAL_EXAMS.includes(examSlug)) return null;

  const sectionHint =
    examSlug === "nclex"
      ? "BMI, IV rates, weight-based dosing, and bedside MAP/qSOFA — core nursing math and monitoring."
      : examSlug === "naplex"
        ? "Clinical math plus CrCl and vancomycin tools for pharmacy board-style checks."
        : examSlug === "pance" || examSlug === "aanp-fnp"
          ? "Clinical math, renal function, and bedside MAP/qSOFA for primary-care and medicine boards."
          : examSlug === "npte-pt"
            ? "BMI, BSA, and unit conversions plus renal function for rehab-relevant dosing checks."
            : "Clinical math, renal dosing, and antimicrobial monitoring for medicine boards.";

  const isClinicalTab = CLINICAL_CALC_TABS.some((t) => t.id === tab);

  return (
    <section id="hub-calculators" aria-labelledby="calculators-heading" className="space-y-3">
      <div>
        <h2 id="calculators-heading" className={libUi.sectionTitle}>
          <Calculator className="mr-1.5 inline h-4 w-4 text-[var(--color-accent)]" aria-hidden />
          Calculators
        </h2>
        <p className={cn(libUi.sectionHint, "mt-0.5")}>{sectionHint}</p>
      </div>

      <div className={libUi.chipRow}>
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(libUi.chip, tab === id ? libUi.chipActive : libUi.chipIdle)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={calcPanelShell}>
        {isClinicalTab ? (
          <ClinicalCalculatorPanel calcId={tab as ClinicalCalcId} />
        ) : tab === "crcl" ? (
          <CrClPanel
            age={age}
            setAge={setAge}
            sex={sex}
            setSex={setSex}
            scr={scr}
            setScr={setScr}
            weight={weight}
            setWeight={setWeight}
            height={height}
            setHeight={setHeight}
            crClResult={crClResult}
          />
        ) : tab === "vancomycin" ? (
          <VancomycinPanel
            vancWeight={vancWeight}
            setVancWeight={setVancWeight}
            vancSerious={vancSerious}
            setVancSerious={setVancSerious}
            vancCrCl={vancCrCl}
            setVancCrCl={setVancCrCl}
            vancTrough={vancTrough}
            setVancTrough={setVancTrough}
            vancLoading={vancLoading}
            vancInterval={vancInterval}
            vancMonitor={vancMonitor}
          />
        ) : (
          <BedsidePanel
            mapSbp={mapSbp}
            setMapSbp={setMapSbp}
            mapDbp={mapDbp}
            setMapDbp={setMapDbp}
            mapResult={mapResult}
            qsofaRr={qsofaRr}
            setQsofaRr={setQsofaRr}
            qsofaSbp={qsofaSbp}
            setQsofaSbp={setQsofaSbp}
            qsofaGcs={qsofaGcs}
            setQsofaGcs={setQsofaGcs}
            qsofaResult={qsofaResult}
          />
        )}
      </div>

      <p className="text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
        For clinical decisions, use institution protocols. These tools mirror common board-style math
        for nursing, pharmacy, and medicine.
      </p>
    </section>
  );
}

function CrClPanel({
  age,
  setAge,
  sex,
  setSex,
  scr,
  setScr,
  weight,
  setWeight,
  height,
  setHeight,
  crClResult,
}: {
  age: string;
  setAge: (v: string) => void;
  sex: Sex;
  setSex: (v: Sex) => void;
  scr: string;
  setScr: (v: string) => void;
  weight: string;
  setWeight: (v: string) => void;
  height: string;
  setHeight: (v: string) => void;
  crClResult: ReturnType<typeof cockcroftGaultCrCl> | null;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <CalcFormulaBox
          formula="CrCl = [(140 − age) × weight] ÷ (72 × SCr) × 0.85 if female"
        />
        <CalcField label="Age (years)">
          <Input type="number" min={1} value={age} onChange={(e) => setAge(e.target.value)} />
        </CalcField>
        <CalcField label="Sex">
          <select
            className="apple-input h-11 w-full"
            value={sex}
            onChange={(e) => setSex(e.target.value as Sex)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </CalcField>
        <CalcField label="Serum creatinine (mg/dL)">
          <Input type="number" step="0.1" min={0.1} value={scr} onChange={(e) => setScr(e.target.value)} />
        </CalcField>
        <CalcField label="Weight (kg)">
          <Input type="number" min={1} value={weight} onChange={(e) => setWeight(e.target.value)} />
        </CalcField>
        <CalcField label="Height (inches)" hint="Optional — enables IBW/ABW for obese patients">
          <Input type="number" min={48} value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 68" />
        </CalcField>
      </div>
      <div className="space-y-3">
        {crClResult ? (
          <>
            <CalcResultBox title="Creatinine clearance">
              <p className="text-[22px] font-semibold tabular-nums">
                {roundCrClForExam(crClResult.crClMlMin)}{" "}
                <span className="text-[14px] font-normal">mL/min</span>
              </p>
              <p className="text-[var(--color-ink-muted)]">{crClResult.weightRationale}</p>
              {crClResult.idealBodyWeightKg != null ? (
                <p>
                  IBW ≈ {crClResult.idealBodyWeightKg.toFixed(1)} kg
                  {crClResult.adjustedBodyWeightKg != null
                    ? ` · ABW ≈ ${crClResult.adjustedBodyWeightKg.toFixed(1)} kg`
                    : ""}
                </p>
              ) : null}
            </CalcResultBox>
            <CalcStepsBox steps={crClResult.formulaSteps} />
          </>
        ) : (
          <p className="text-[13px] text-[var(--color-ink-muted)]">Enter valid age, SCr, and weight.</p>
        )}
      </div>
    </div>
  );
}

function VancomycinPanel({
  vancWeight,
  setVancWeight,
  vancSerious,
  setVancSerious,
  vancCrCl,
  setVancCrCl,
  vancTrough,
  setVancTrough,
  vancLoading,
  vancInterval,
  vancMonitor,
}: {
  vancWeight: string;
  setVancWeight: (v: string) => void;
  vancSerious: boolean;
  setVancSerious: (v: boolean) => void;
  vancCrCl: string;
  setVancCrCl: (v: string) => void;
  vancTrough: string;
  setVancTrough: (v: string) => void;
  vancLoading: ReturnType<typeof vancomycinLoadingDose> | null;
  vancInterval: ReturnType<typeof vancomycinIntervalFromCrCl> | null;
  vancMonitor: ReturnType<typeof vancomycinMonitoringFromTrough> | null;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-3">
        <p className="text-[13px] font-semibold text-[var(--color-ink)]">Loading dose</p>
        <CalcField label="Weight (kg)">
          <Input type="number" min={1} value={vancWeight} onChange={(e) => setVancWeight(e.target.value)} />
        </CalcField>
        <CalcField label="Indication">
          <select
            className="apple-input h-11 w-full"
            value={vancSerious ? "serious" : "standard"}
            onChange={(e) => setVancSerious(e.target.value === "serious")}
          >
            <option value="serious">Serious MRSA (25 mg/kg)</option>
            <option value="standard">Standard (17.5 mg/kg)</option>
          </select>
        </CalcField>
        {vancLoading ? (
          <CalcResultBox title="Loading dose">
            <p className="text-[22px] font-semibold tabular-nums">
              {vancLoading.doseMg.toLocaleString()} mg IV
            </p>
            <p>{vancLoading.note}</p>
            {vancLoading.capped ? (
              <p className="text-[var(--color-accent)]">
                Capped at {vancLoading.capMg / 1000} g maximum.
              </p>
            ) : null}
          </CalcResultBox>
        ) : null}
      </div>

      <div className="space-y-3">
        <p className="text-[13px] font-semibold text-[var(--color-ink)]">Maintenance interval</p>
        <CalcField label="CrCl (mL/min)" hint="From Cockcroft-Gault — use CrCl tab or enter known value">
          <Input type="number" min={1} value={vancCrCl} onChange={(e) => setVancCrCl(e.target.value)} />
        </CalcField>
        {vancInterval ? (
          <CalcResultBox title="Suggested interval">
            <p className="text-lg font-semibold">{vancInterval.intervalLabel}</p>
            <p>{vancInterval.note}</p>
          </CalcResultBox>
        ) : null}
        <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 text-[12px] text-[var(--color-ink-muted)]">
          <p className="font-semibold text-[var(--color-ink)]">Target AUC/MIC</p>
          <p className="mt-1">400–600 mg·h/L for serious MRSA (MIC = 1). Prefer AUC-guided dosing over trough-only.</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[13px] font-semibold text-[var(--color-ink)]">Trough → AUC check</p>
        <CalcField label="Steady-state trough (mg/L)" hint="Educational estimate: AUC ≈ trough × 12">
          <Input type="number" step="0.1" min={1} value={vancTrough} onChange={(e) => setVancTrough(e.target.value)} />
        </CalcField>
        {vancMonitor ? (
          <CalcResultBox title="Monitoring">
            <p>
              Est. AUC<sub>24</sub> ≈ <strong>{vancMonitor.estimatedAuc}</strong> mg·h/L
            </p>
            <p>{vancMonitor.interpretation}</p>
            <p className="text-[var(--color-ink-muted)]">
              Legacy trough target (15–20 mg/L):{" "}
              {vancMonitor.troughInLegacyTarget ? "in range" : "out of range"}.
            </p>
          </CalcResultBox>
        ) : null}
      </div>
    </div>
  );
}

function BedsidePanel({
  mapSbp,
  setMapSbp,
  mapDbp,
  setMapDbp,
  mapResult,
  qsofaRr,
  setQsofaRr,
  qsofaSbp,
  setQsofaSbp,
  qsofaGcs,
  setQsofaGcs,
  qsofaResult,
}: {
  mapSbp: string;
  setMapSbp: (v: string) => void;
  mapDbp: string;
  setMapDbp: (v: string) => void;
  mapResult: number | null;
  qsofaRr: string;
  setQsofaRr: (v: string) => void;
  qsofaSbp: string;
  setQsofaSbp: (v: string) => void;
  qsofaGcs: boolean;
  setQsofaGcs: (v: boolean) => void;
  qsofaResult: number | null;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-3">
        <p className="text-[13px] font-semibold text-[var(--color-ink)]">Mean arterial pressure</p>
        <CalcFormulaBox formula="MAP = DBP + ⅓(SBP − DBP)" />
        <CalcField label="Systolic BP (mmHg)">
          <Input type="number" min={1} value={mapSbp} onChange={(e) => setMapSbp(e.target.value)} />
        </CalcField>
        <CalcField label="Diastolic BP (mmHg)">
          <Input type="number" min={1} value={mapDbp} onChange={(e) => setMapDbp(e.target.value)} />
        </CalcField>
        {mapResult != null ? (
          <CalcResultBox title="MAP">
            <p className="text-[22px] font-semibold tabular-nums">
              {mapResult.toFixed(0)} <span className="text-[14px] font-normal">mmHg</span>
            </p>
            <p>
              Septic shock target MAP ≥65 mmHg —{" "}
              {mapResult >= 65 ? "at goal" : "below goal; escalate fluids/pressors per protocol"}.
            </p>
          </CalcResultBox>
        ) : null}
      </div>
      <div className="space-y-3">
        <p className="text-[13px] font-semibold text-[var(--color-ink)]">qSOFA screen</p>
        <CalcField label="Respiratory rate (/min)">
          <Input type="number" min={1} value={qsofaRr} onChange={(e) => setQsofaRr(e.target.value)} />
        </CalcField>
        <CalcField label="Systolic BP (mmHg)">
          <Input type="number" min={1} value={qsofaSbp} onChange={(e) => setQsofaSbp(e.target.value)} />
        </CalcField>
        <label className="flex items-center gap-2 text-[13px] text-[var(--color-ink)]">
          <input
            type="checkbox"
            checked={qsofaGcs}
            onChange={(e) => setQsofaGcs(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--color-border)]"
          />
          Altered mentation (GCS &lt;15)
        </label>
        {qsofaResult != null ? (
          <CalcResultBox title="qSOFA score">
            <p className="text-[22px] font-semibold tabular-nums">{qsofaResult} / 3</p>
            <p>
              {qsofaResult >= 2
                ? "≥2 — suspect sepsis; escalate assessment and hour-1 bundle."
                : "<2 — screen negative; continue monitoring."}
            </p>
          </CalcResultBox>
        ) : null}
      </div>
    </div>
  );
}
