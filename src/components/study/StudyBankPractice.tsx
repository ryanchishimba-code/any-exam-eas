"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  DEFAULT_STUDY_FIELD_LABEL,
  getFieldMeta,
  getFieldMetaById,
} from "@/lib/fields";
import { getSubjectsForField } from "@/lib/field-subjects";
import {
  EXAM_MODES,
  clampQuestionBankCount,
  parseQuestionBankPace,
  parseQuestionBankStyle,
  type QuestionBankPace,
  type QuestionBankStyle,
} from "@/lib/exam/modes";
import { STUDY_HUB_PATH } from "@/lib/study-hub/config";
import {
  formatExamLengthLabel,
  getTimedExamQuestionCount,
  isNclexField,
  parseNclexTimedVariant,
  resolveFieldId,
  type NclexTimedVariant,
} from "@/lib/exam/exam-lengths";
import { EXAM_FIELD_IDS } from "@/lib/subjects/field-ids";
import { QuestionBankSetup } from "./QuestionBankSetup";
import { MpjeVariantSelector } from "./MpjeVariantSelector";
import {
  isMpjeField,
  parseMpjeVariant,
  getMpjeState,
  resolveMpjeStateCode,
  type MpjeVariant,
} from "@/lib/mpje/config";
import { StudySessionPlayer } from "./StudySessionPlayer";
import type { AdaptiveSessionMeta, RawQuestionInput, StudyMode } from "@/lib/questions/types";
import type { ExamQuestion } from "@/lib/ai";
import { Button } from "@/components/ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";
import { cn } from "@/lib/utils";

type PracticeMode = "timed" | "bank";

const LEGACY_MODES = new Set([
  "tutor",
  "rapid",
  "adaptive",
  "weak",
  "weak_area",
  "cat",
  "practice",
  "research",
  "final",
]);

const TIMED_EXAM_LABELS = EXAM_FIELD_IDS.map(
  (id) => getFieldMetaById(id)?.label ?? id
);

function resolvePracticeMode(param: string | null): PracticeMode {
  if (param === "bank") return "bank";
  return "timed";
}

function buildBankPracticeUrl(params: {
  fieldId: string;
  subjectId: string;
  count: number;
  pace: QuestionBankPace;
  style?: QuestionBankStyle;
  mpjeVariant?: MpjeVariant;
  mpjeState?: string;
}) {
  const qs = new URLSearchParams({
    mode: "bank",
    field: params.fieldId,
    subjectId: params.subjectId,
    count: String(params.count),
    pace: params.pace,
  });
  if (params.style && params.style !== "standard") qs.set("style", params.style);
  if (params.mpjeVariant) qs.set("mpjeVariant", params.mpjeVariant);
  if (params.mpjeState) qs.set("mpjeState", params.mpjeState);
  return `/study/practice?${qs.toString()}`;
}

function buildTimedPracticeUrl(params: {
  fieldId: string;
  nclexLength?: NclexTimedVariant;
  mpjeVariant?: MpjeVariant;
  mpjeState?: string;
}) {
  const qs = new URLSearchParams({
    mode: "timed",
    field: params.fieldId,
  });
  if (params.nclexLength) qs.set("nclexLength", params.nclexLength);
  if (params.mpjeVariant) qs.set("mpjeVariant", params.mpjeVariant);
  if (params.mpjeState) qs.set("mpjeState", params.mpjeState);
  return `/study/practice?${qs.toString()}`;
}

export function StudyBankPractice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const fieldParam = searchParams.get("field");

  const practiceMode = resolvePracticeMode(
    modeParam && !LEGACY_MODES.has(modeParam) ? modeParam : "timed"
  );
  const isTimedExam = practiceMode === "timed";

  const [field, setField] = useState(DEFAULT_STUDY_FIELD_LABEL);
  const [subjectId, setSubjectId] = useState("");
  const [questionCount, setQuestionCount] = useState(25);
  const [bankPace, setBankPace] = useState<QuestionBankPace>("untimed");
  const [bankStyle, setBankStyle] = useState<QuestionBankStyle>("adaptive");
  const [adaptiveMeta, setAdaptiveMeta] = useState<AdaptiveSessionMeta | null>(null);
  const [nclexLength, setNclexLength] = useState<NclexTimedVariant>("minimum");
  const [mpjeVariant, setMpjeVariant] = useState<MpjeVariant>("uniform");
  const [mpjeState, setMpjeState] = useState("TX");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<RawQuestionInput[] | null>(null);

  const subjects = useMemo(() => getSubjectsForField(field), [field]);
  const fieldId = useMemo(() => resolveFieldId(field), [field]);
  const isNclex = useMemo(() => isNclexField(field), [field]);
  const isMpje = useMemo(() => isMpjeField(fieldId), [fieldId]);
  const timedCount = useMemo(
    () => getTimedExamQuestionCount(field, isNclex ? { nclexLength } : undefined),
    [field, isNclex, nclexLength]
  );
  const lengthLabel = useMemo(
    () => formatExamLengthLabel(field, isNclex ? { nclexLength } : undefined),
    [field, isNclex, nclexLength]
  );
  const sessionStudyMode: StudyMode = isTimedExam
    ? "timed"
    : bankStyle === "weak_areas"
      ? "weak_area"
      : bankStyle === "adaptive"
        ? "adaptive"
        : bankPace === "timed"
          ? "timed"
          : "practice";

  useEffect(() => {
    if (!modeParam) return;
    if (LEGACY_MODES.has(modeParam)) {
      router.replace(
        `/study/practice?field=${encodeURIComponent(fieldId)}&mode=${modeParam === "practice" ? "bank" : "timed"}`
      );
    }
    if (modeParam === "research") {
      router.replace(`/study/practice?field=${encodeURIComponent(fieldId)}&mode=bank`);
    }
  }, [modeParam, fieldId, router]);

  useEffect(() => {
    if (isTimedExam && searchParams.get("subjectId")) {
      const qs = new URLSearchParams(searchParams.toString());
      qs.delete("subjectId");
      qs.delete("count");
      qs.delete("pace");
      router.replace(`/study/practice?${qs.toString()}`);
    }
  }, [isTimedExam, searchParams, router]);

  useEffect(() => {
    const nclexParam = searchParams.get("nclexLength");
    if (nclexParam) setNclexLength(parseNclexTimedVariant(nclexParam));
  }, [searchParams]);

  useEffect(() => {
    const variantParam = searchParams.get("mpjeVariant");
    if (variantParam) setMpjeVariant(parseMpjeVariant(variantParam));
    const stateParam = searchParams.get("mpjeState");
    if (stateParam) setMpjeState(resolveMpjeStateCode(stateParam));
  }, [searchParams]);

  useEffect(() => {
    if (fieldParam) {
      const meta = getFieldMeta(fieldParam) ?? getFieldMetaById(fieldParam);
      if (meta) setField(meta.label);
    }
  }, [fieldParam]);

  useEffect(() => {
    if (isTimedExam) return;

    const countParam = searchParams.get("count");
    if (countParam) setQuestionCount(clampQuestionBankCount(Number(countParam)));

    const paceParam = searchParams.get("pace");
    if (paceParam) setBankPace(parseQuestionBankPace(paceParam));

    const styleParam = searchParams.get("style");
    if (styleParam) setBankStyle(parseQuestionBankStyle(styleParam));
  }, [isTimedExam, searchParams]);

  useEffect(() => {
    if (isTimedExam) return;
    const list = getSubjectsForField(field);
    if (!list.length) {
      setSubjectId("");
      return;
    }

    const subjectParam = searchParams.get("subjectId");
    const match = subjectParam && list.some((s) => s.id === subjectParam);
    setSubjectId(match ? subjectParam! : list[0].id);
  }, [field, isTimedExam, searchParams]);

  function syncPracticeUrl(overrides?: {
    mpjeVariant?: MpjeVariant;
    mpjeState?: string;
    subjectId?: string;
    count?: number;
    pace?: QuestionBankPace;
    style?: QuestionBankStyle;
  }) {
    const resolvedVariant = overrides?.mpjeVariant ?? mpjeVariant;
    const resolvedState = overrides?.mpjeState ?? mpjeState;
    const resolvedSubjectId = overrides?.subjectId ?? subjectId;

    if (isTimedExam) {
      router.replace(
        buildTimedPracticeUrl({
          fieldId,
          nclexLength: isNclex ? nclexLength : undefined,
          mpjeVariant: isMpje ? resolvedVariant : undefined,
          mpjeState: isMpje && resolvedVariant === "state" ? resolvedState : undefined,
        }),
        { scroll: false }
      );
      return;
    }
    if (!resolvedSubjectId) return;
    router.replace(
      buildBankPracticeUrl({
        fieldId,
        subjectId: resolvedSubjectId,
        count: overrides?.count ?? questionCount,
        pace: overrides?.pace ?? bankPace,
        style: overrides?.style ?? bankStyle,
        mpjeVariant: isMpje ? resolvedVariant : undefined,
        mpjeState: isMpje && resolvedVariant === "state" ? resolvedState : undefined,
      }),
      { scroll: false }
    );
  }

  async function start() {
    if (isMpje || !isTimedExam) syncPracticeUrl();

    setLoading(true);
    setError("");
    setQuestions(null);
    setAdaptiveMeta(null);
    try {
      const limit = isTimedExam ? timedCount : questionCount;
      const useAdaptive =
        isTimedExam || bankStyle === "adaptive" || bankStyle === "weak_areas";

      if (useAdaptive) {
        const res = await fetch("/api/study/adaptive/next", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            field,
            subjectId: isTimedExam ? undefined : subjectId,
            count: limit,
            currentDifficulty: "medium",
            studyMode: isTimedExam
              ? "timed"
              : bankStyle === "weak_areas"
                ? "weak_area"
                : "adaptive",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not build adaptive session");

        const metaIds = (data.bankItemIds as string[] | undefined) ?? [];
        const raw = (data.questions as ExamQuestion[]).map((q, i) => ({
          ...q,
          id: i + 1,
          field,
          subjectId: isTimedExam ? "__mixed__" : subjectId,
          bankItemId: metaIds[i] ?? `bank-${fieldId}-${i}`,
        }));
        if (raw.length === 0) {
          throw new Error("No questions in bank for this selection.");
        }
        const questionReasoning: Record<string, string> = {};
        raw.forEach((q, i) => {
          questionReasoning[String(q.id)] =
            data.adaptive?.selectionReasoning?.[i]?.reasoning ??
            "Adaptive selection based on your weak areas and review schedule.";
        });
        setAdaptiveMeta({
          sessionRationale: data.adaptive?.rationale,
          questionReasoning,
          recommendedDifficulty: data.adaptive?.recommendedDifficulty,
        });
        setQuestions(raw);
        return;
      }

      const qs = new URLSearchParams({
        field,
        limit: String(limit),
        mode: "bank",
      });
      if (isMpje) {
        qs.set("mpjeVariant", mpjeVariant);
        if (mpjeVariant === "state") qs.set("mpjeState", mpjeState);
      }
      if (!subjectId) return;
      qs.set("subjectId", subjectId);

      const res = await fetch(`/api/questions?${qs.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not load questions");

      const metaIds = (data.bankItemIds as string[] | undefined) ?? [];
      const raw = (data.questions as ExamQuestion[]).map((q, i) => ({
        ...q,
        id: i + 1,
        field,
        subjectId,
        bankItemId: metaIds[i] ?? `bank-${fieldId}-${i}`,
      }));
      if (raw.length === 0) {
        throw new Error(
          isTimedExam
            ? "No questions in bank for this exam yet."
            : "No questions in bank for this topic yet."
        );
      }
      setQuestions(raw);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  if (questions) {
    const topicLabel = subjects.find((s) => s.id === subjectId)?.label ?? "Question bank";
    const mpjeScope =
      isMpje && mpjeVariant === "state"
        ? ` · ${getMpjeState(mpjeState)?.name ?? mpjeState} MPJE`
        : isMpje
          ? " · Uniform MPJE"
          : "";
    const title = isTimedExam
      ? `${field}${mpjeScope} · Timed exam · ${questions.length} questions`
      : `${field}${mpjeScope} · ${topicLabel} · ${questions.length} questions · ${
          bankStyle === "adaptive"
            ? "Adaptive AI"
            : bankStyle === "weak_areas"
              ? "Weak areas"
              : bankPace === "timed"
                ? "Timed"
                : "Untimed"
        }`;

    return (
      <StudySessionPlayer
        field={field}
        subjectId={isTimedExam ? "__mixed__" : subjectId}
        questions={questions}
        sourceType="bank"
        mode={sessionStudyMode}
        title={title}
        adaptiveMeta={adaptiveMeta ?? undefined}
      />
    );
  }

  const activeMode = EXAM_MODES.find((m) => m.id === practiceMode);
  const otherMode = EXAM_MODES.find((m) => m.id !== practiceMode);

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={STUDY_HUB_PATH}
          className="text-sm font-medium text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
        >
          ← Study Hub
        </Link>
        {otherMode && (
          <Link
            href={`/study/practice?mode=${otherMode.param}`}
            className="text-sm font-medium text-[var(--color-accent)] transition hover:underline"
          >
            Switch to {otherMode.label}
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-black/[0.06] bg-black/[0.02] px-5 py-4">
        <p className="font-semibold text-[var(--color-ink)]">{activeMode?.label}</p>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{activeMode?.description}</p>
      </div>

      <div className="apple-card space-y-6 p-8">
        <div>
          <label className="apple-label">Exam</label>
          <select
            className="apple-input mt-2 w-full"
            value={field}
            onChange={(e) => setField(e.target.value)}
          >
            {TIMED_EXAM_LABELS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>

        {isMpje && (
          <MpjeVariantSelector
            variant={mpjeVariant}
            onVariantChange={(v) => {
              setMpjeVariant(v);
              syncPracticeUrl({ mpjeVariant: v });
            }}
            stateCode={mpjeState}
            onStateChange={(code) => {
              setMpjeState(code);
              syncPracticeUrl({ mpjeState: code });
            }}
          />
        )}

        {!isTimedExam && (
          <QuestionBankSetup
            subjects={subjects}
            subjectId={subjectId}
            onSubjectChange={setSubjectId}
            questionCount={questionCount}
            onQuestionCountChange={setQuestionCount}
            pace={bankPace}
            onPaceChange={(p) => {
              setBankPace(p);
              syncPracticeUrl({ pace: p });
            }}
            bankStyle={bankStyle}
            onBankStyleChange={(s) => {
              setBankStyle(s);
              syncPracticeUrl({ style: s });
            }}
          />
        )}

        {isTimedExam && isNclex && (
          <div>
            <label className="apple-label">NCLEX exam length</label>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {(
                [
                  {
                    id: "minimum" as const,
                    title: "85 questions",
                    hint: "NCLEX minimum — standard timed simulation",
                  },
                  {
                    id: "maximum" as const,
                    title: "150 questions",
                    hint: "NCLEX maximum — full-length simulation",
                  },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setNclexLength(option.id)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left transition",
                    nclexLength === option.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]"
                      : "border-black/[0.08] bg-white hover:border-black/[0.12]"
                  )}
                >
                  <p className="font-medium text-[var(--color-ink)]">{option.title}</p>
                  <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{option.hint}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {isTimedExam && (
          <div className="rounded-xl border border-black/[0.06] bg-black/[0.02] px-4 py-3">
            <p className="text-sm font-medium text-[var(--color-ink)]">Full exam simulation</p>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{lengthLabel}</p>
            <ul className="mt-3 space-y-1.5 text-xs text-[var(--color-ink-muted)]">
              <li>Random assorted questions from the full exam bank</li>
              <li>No topic selection — mirrors a real board exam</li>
              {isMpje && (
                <li>
                  {mpjeVariant === "uniform"
                    ? "Uniform MPJE (UMPJE) — federal + common state law"
                    : `State-specific MPJE — ${mpjeState} pharmacy law`}
                </li>
              )}
              <li>Fixed board-length session with per-question timer</li>
            </ul>
          </div>
        )}

        {error && <InlineError>{error}</InlineError>}
        <Button
          type="button"
          disabled={loading || (!isTimedExam && !subjectId)}
          className="w-full"
          onClick={() => void start()}
        >
          {loading
            ? "Loading…"
            : isTimedExam
              ? `Start timed exam (${timedCount} questions)`
              : bankStyle === "adaptive"
                ? `Start adaptive practice (${questionCount} questions)`
                : bankStyle === "weak_areas"
                  ? `Start weak-area drill (${questionCount} questions)`
                  : `Start ${bankPace} practice (${questionCount} questions)`}
        </Button>
      </div>
    </div>
  );
}
