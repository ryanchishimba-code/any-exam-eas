"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  cockcroftGaultCrCl,
  meanArterialPressure,
  qsofaScore,
  roundCrClForExam,
  vancomycinIntervalFromCrCl,
  vancomycinLoadingDose,
  vancomycinMonitoringFromTrough,
  type Sex,
} from "@/lib/reference/calculations/pharmacy-calcs";
import { refUi } from "@/lib/reference/reference-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type CalcTab = "crcl" | "vancomycin" | "bedside";

const CLINICAL_EXAMS: ExamSlug[] = ["naplex", "usmle", "nclex"];

function parseNum(value: string): number | null {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[13px] font-medium text-[var(--color-ink)]">{label}</span>
      {children}
      {hint ? <span className="block text-[11px] text-[var(--color-ink-muted)]">{hint}</span> : null}
    </label>
  );
}

function ResultBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[14px] border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.06] p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
        {title}
      </p>
      <div className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-[var(--color-ink)]">
        {children}
      </div>
    </div>
  );
}

export function ReferenceCalculators({ examSlug }: { examSlug: ExamSlug }) {
  const showVanc = examSlug === "naplex" || examSlug === "usmle";
  const showBedside = examSlug === "nclex";
  const [tab, setTab] = useState<CalcTab>("crcl");

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
    const items: Array<{ id: CalcTab; label: string }> = [{ id: "crcl", label: "CrCl" }];
    if (showVanc) items.push({ id: "vancomycin", label: "Vancomycin" });
    if (showBedside) items.push({ id: "bedside", label: "MAP & qSOFA" });
    return items;
  }, [showVanc, showBedside]);

  const crClResult = useMemo(() => {
    const ageN = parseNum(age);
    const scrN = parseNum(scr);
    const weightN = parseNum(weight);
    if (!ageN || !scrN || !weightN) return null;
    const heightN = height.trim() ? parseNum(height) : null;
    return cockcroftGaultCrCl({
      age: ageN,
      sex,
      scrMgDl: scrN,
      actualWeightKg: weightN,
      heightInches: heightN ?? undefined,
    });
  }, [age, sex, scr, weight, height]);

  const vancLoading = useMemo(() => {
    const w = parseNum(vancWeight);
    if (!w) return null;
    return vancomycinLoadingDose(w, vancSerious);
  }, [vancWeight, vancSerious]);

  const vancInterval = useMemo(() => {
    const c = parseNum(vancCrCl);
    if (!c) return null;
    return vancomycinIntervalFromCrCl(c);
  }, [vancCrCl]);

  const vancMonitor = useMemo(() => {
    const t = parseNum(vancTrough);
    if (!t) return null;
    return vancomycinMonitoringFromTrough(t, vancSerious);
  }, [vancTrough, vancSerious]);

  const mapResult = useMemo(() => {
    const sbp = parseNum(mapSbp);
    const dbp = parseNum(mapDbp);
    if (!sbp || !dbp) return null;
    return meanArterialPressure(sbp, dbp);
  }, [mapSbp, mapDbp]);

  const qsofaResult = useMemo(() => {
    const rr = parseNum(qsofaRr);
    const sbp = parseNum(qsofaSbp);
    if (!rr || !sbp) return null;
    return qsofaScore({
      respiratoryRate: rr,
      systolicBp: sbp,
      alteredMentation: qsofaGcs,
    });
  }, [qsofaRr, qsofaSbp, qsofaGcs]);

  if (!CLINICAL_EXAMS.includes(examSlug)) return null;

  return (
    <section id="hub-calculators" aria-labelledby="calculators-heading" className="space-y-3">
      <div>
        <h2 id="calculators-heading" className={refUi.sectionTitle}>
          <Calculator className="mr-1.5 inline h-4 w-4 text-[var(--color-accent)]" aria-hidden />
          Pharmacy calculators
        </h2>
        <p className={cn(refUi.sectionHint, "mt-0.5")}>
          {examSlug === "nclex"
            ? "CrCl, MAP, and qSOFA — bedside tools for sepsis and antimicrobial monitoring."
            : "CrCl, vancomycin loading, dosing interval, and AUC estimate — for study and board-style checks."}
        </p>
      </div>

      <div className={refUi.chipRow}>
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(refUi.chip, tab === id ? refUi.chipActive : refUi.chipIdle)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-[18px] border border-black/[0.06] bg-black/[0.02] p-4 sm:p-5">
        {tab === "crcl" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <Field label="Age (years)">
                <Input type="number" min={1} value={age} onChange={(e) => setAge(e.target.value)} />
              </Field>
              <Field label="Sex">
                <select
                  className="apple-input h-11 w-full"
                  value={sex}
                  onChange={(e) => setSex(e.target.value as Sex)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </Field>
              <Field label="Serum creatinine (mg/dL)">
                <Input type="number" step="0.1" min={0.1} value={scr} onChange={(e) => setScr(e.target.value)} />
              </Field>
              <Field label="Weight (kg)">
                <Input type="number" min={1} value={weight} onChange={(e) => setWeight(e.target.value)} />
              </Field>
              <Field label="Height (inches)" hint="Optional — enables IBW/ABW for obese patients">
                <Input type="number" min={48} value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 68" />
              </Field>
            </div>
            <div className="space-y-3">
              {crClResult ? (
                <>
                  <ResultBox title="Creatinine clearance">
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
                  </ResultBox>
                  <div className="rounded-[12px] border border-black/[0.06] bg-white p-3 font-mono text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
                    {crClResult.formulaSteps.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-[13px] text-[var(--color-ink-muted)]">Enter valid age, SCr, and weight.</p>
              )}
            </div>
          </div>
        ) : tab === "vancomycin" ? (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-3">
              <p className="text-[13px] font-semibold text-[var(--color-ink)]">Loading dose</p>
              <Field label="Weight (kg)">
                <Input type="number" min={1} value={vancWeight} onChange={(e) => setVancWeight(e.target.value)} />
              </Field>
              <Field label="Indication">
                <select
                  className="apple-input h-11 w-full"
                  value={vancSerious ? "serious" : "standard"}
                  onChange={(e) => setVancSerious(e.target.value === "serious")}
                >
                  <option value="serious">Serious MRSA (25 mg/kg)</option>
                  <option value="standard">Standard (17.5 mg/kg)</option>
                </select>
              </Field>
              {vancLoading ? (
                <ResultBox title="Loading dose">
                  <p className="text-[22px] font-semibold tabular-nums">
                    {vancLoading.doseMg.toLocaleString()} mg IV
                  </p>
                  <p>{vancLoading.note}</p>
                  {vancLoading.capped ? (
                    <p className="text-amber-700">Capped at {vancLoading.capMg / 1000} g maximum.</p>
                  ) : null}
                </ResultBox>
              ) : null}
            </div>

            <div className="space-y-3">
              <p className="text-[13px] font-semibold text-[var(--color-ink)]">Maintenance interval</p>
              <Field label="CrCl (mL/min)" hint="From Cockcroft-Gault — use CrCl tab or enter known value">
                <Input type="number" min={1} value={vancCrCl} onChange={(e) => setVancCrCl(e.target.value)} />
              </Field>
              {vancInterval ? (
                <ResultBox title="Suggested interval">
                  <p className="text-lg font-semibold">{vancInterval.intervalLabel}</p>
                  <p>{vancInterval.note}</p>
                </ResultBox>
              ) : null}
              <div className="rounded-[12px] border border-black/[0.06] bg-white p-3 text-[12px] text-[var(--color-ink-muted)]">
                <p className="font-semibold text-[var(--color-ink)]">Target AUC/MIC</p>
                <p className="mt-1">400–600 mg·h/L for serious MRSA (MIC = 1). Prefer AUC-guided dosing over trough-only.</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[13px] font-semibold text-[var(--color-ink)]">Trough → AUC check</p>
              <Field label="Steady-state trough (mg/L)" hint="Educational estimate: AUC ≈ trough × 12">
                <Input type="number" step="0.1" min={1} value={vancTrough} onChange={(e) => setVancTrough(e.target.value)} />
              </Field>
              {vancMonitor ? (
                <ResultBox title="Monitoring">
                  <p>
                    Est. AUC<sub>24</sub> ≈ <strong>{vancMonitor.estimatedAuc}</strong> mg·h/L
                  </p>
                  <p>{vancMonitor.interpretation}</p>
                  <p className="text-[var(--color-ink-muted)]">
                    Legacy trough target (15–20 mg/L):{" "}
                    {vancMonitor.troughInLegacyTarget ? "in range" : "out of range"}.
                  </p>
                </ResultBox>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="text-[13px] font-semibold text-[var(--color-ink)]">Mean arterial pressure</p>
              <Field label="Systolic BP (mmHg)">
                <Input type="number" min={1} value={mapSbp} onChange={(e) => setMapSbp(e.target.value)} />
              </Field>
              <Field label="Diastolic BP (mmHg)">
                <Input type="number" min={1} value={mapDbp} onChange={(e) => setMapDbp(e.target.value)} />
              </Field>
              {mapResult != null ? (
                <ResultBox title="MAP">
                  <p className="text-[22px] font-semibold tabular-nums">
                    {mapResult.toFixed(0)} <span className="text-[14px] font-normal">mmHg</span>
                  </p>
                  <p>
                    Septic shock target MAP ≥65 mmHg —{" "}
                    {mapResult >= 65 ? "at goal" : "below goal; escalate fluids/pressors per protocol"}.
                  </p>
                  <p className="font-mono text-[12px] text-[var(--color-ink-muted)]">
                    MAP = DBP + ⅓(SBP − DBP)
                  </p>
                </ResultBox>
              ) : null}
            </div>
            <div className="space-y-3">
              <p className="text-[13px] font-semibold text-[var(--color-ink)]">qSOFA screen</p>
              <Field label="Respiratory rate (/min)">
                <Input type="number" min={1} value={qsofaRr} onChange={(e) => setQsofaRr(e.target.value)} />
              </Field>
              <Field label="Systolic BP (mmHg)">
                <Input type="number" min={1} value={qsofaSbp} onChange={(e) => setQsofaSbp(e.target.value)} />
              </Field>
              <label className="flex items-center gap-2 text-[13px]">
                <input
                  type="checkbox"
                  checked={qsofaGcs}
                  onChange={(e) => setQsofaGcs(e.target.checked)}
                  className="h-4 w-4 rounded border-black/20"
                />
                Altered mentation (GCS &lt;15)
              </label>
              {qsofaResult != null ? (
                <ResultBox title="qSOFA score">
                  <p className="text-[22px] font-semibold tabular-nums">{qsofaResult} / 3</p>
                  <p>
                    {qsofaResult >= 2
                      ? "≥2 — suspect sepsis; escalate assessment and hour-1 bundle."
                      : "<2 — screen negative; continue monitoring."}
                  </p>
                </ResultBox>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
        For clinical decisions, use institution protocols. These tools mirror common board-style math
        (CrCl, vancomycin dosing, MAP, qSOFA).
      </p>
    </section>
  );
}
