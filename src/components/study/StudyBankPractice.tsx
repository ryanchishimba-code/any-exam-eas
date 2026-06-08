"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Brain, Clock, Flag, Zap } from "lucide-react";
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
import { mpjePracticeExamHref, STUDY_HUB_PATH } from "@/lib/study-hub/config";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { fullExamLaunchHref, fullExamSessionHref } from "@/lib/full-exam/config";
import { navigateHard } from "@/lib/client/navigate-hard";
import { ROUTES } from "@/lib/routes";
import {
  computeTimedExamTimeLimitSec,
  formatExamLengthLabel,
  getTimedExamQuestionCount,
  isNclexField,
  parseNclexTimedVariant,
  resolveFieldId,
  type NclexTimedVariant,
} from "@/lib/exam/exam-lengths";
import {
  EXAM_FIELD_OPTIONS,
  PRACTICE_MODES,
  practiceModeLaunchHref,
  resolvePracticeModeFromParams,
  type PracticeModeId,
} from "@/lib/exam-prep/practice-modes";
import type { ExamFieldId } from "@/lib/exam-prep/types";
import { QuestionBankSetup } from "./QuestionBankSetup";
import { MpjeVariantSelector } from "./MpjeVariantSelector";
import { MpjeStateSelect } from "./MpjeStateSelect";
import { MpjePracticeBanner } from "./MpjePracticeBanner";
import {
  isMpjeField,
  parseMpjeVariant,
  getMpjeState,
  type MpjeVariant,
} from "@/lib/mpje/config";
import { parseOptionalMpjeStateParam } from "@/lib/mpje/validators";
import type { AdaptiveSessionMeta, RawQuestionInput, StudyMode } from "@/lib/questions/types";
import type { ExamQuestion } from "@/lib/ai";
import { Button } from "@/components/ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";
import { cn } from "@/lib/utils";

const StudySessionPlayer = dynamic(
  () => import("./StudySessionPlayer").then((m) => m.StudySessionPlayer),
  {
    loading: () => (
      <p className="py-8 text-center text-sm text-[var(--color-ink-muted)]">Loading session…</p>
    ),
  }
);

const MODE_ICONS = {
  zap: Zap,
  clock: Clock,
  brain: Brain,
  book: BookOpen,
  flag: Flag,
} as const;

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

function resolvePracticeMode(param: string | null, onQuestionBank: boolean): PracticeMode {
  if (param === "bank") return "bank";
  if (param === "timed") return "timed";
  return onQuestionBank ? "bank" : "timed";
}

function buildBankPracticeUrl(
  params: {
    fieldId: string;
    subjectId: string;
    count: number;
    pace: QuestionBankPace;
    style?: QuestionBankStyle;
    mpjeVariant?: MpjeVariant;
    mpjeState?: string;
  },
  base = "/study/practice"
) {
  const qs = new URLSearchParams({
    mode: "bank",
    field: params.fieldId,
    subjectId: params.subjectId,
    count: String(params.count),
    pace: params.pace,
  });
  if (params.style && params.style !== "standard") qs.set("style", params.style);
  if (params.mpjeVariant) qs.set("mpjeVariant", params.mpjeVariant);
  if (params.mpjeState) {
    qs.set("state", params.mpjeState);
    qs.set("mpjeState", params.mpjeState);
  }
  return `${base}?${qs.toString()}`;
}

function buildTimedPracticeUrl(
  params: {
    fieldId: string;
    nclexLength?: NclexTimedVariant;
    mpjeVariant?: MpjeVariant;
    mpjeState?: string;
  },
  base = "/study/practice"
) {
  const qs = new URLSearchParams({
    mode: "timed",
    field: params.fieldId,
  });
  if (params.nclexLength) qs.set("nclexLength", params.nclexLength);
  if (params.mpjeVariant) qs.set("mpjeVariant", params.mpjeVariant);
  if (params.mpjeState) {
    qs.set("state", params.mpjeState);
    qs.set("mpjeState", params.mpjeState);
  }
  return `${base}?${qs.toString()}`;
}

export function StudyBankPractice() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const fieldParam = searchParams.get("field");
  const onQuestionBank = pathname === ROUTES.questionBank;
  const practiceBase = onQuestionBank ? ROUTES.questionBank : "/study/practice";

  const practiceMode = resolvePracticeMode(
    modeParam && !LEGACY_MODES.has(modeParam) ? modeParam : null,
    onQuestionBank
  );
  const isTimedExam = practiceMode === "timed";

  const [field, setField] = useState(DEFAULT_STUDY_FIELD_LABEL);
  const [subjectId, setSubjectId] = useState("");
  const [questionCount, setQuestionCount] = useState(25);
  const [bankPace, setBankPace] = useState<QuestionBankPace>("untimed");
  const [bankStyle, setBankStyle] = useState<QuestionBankStyle>("adaptive");
  const [adaptiveMeta, setAdaptiveMeta] = useState<AdaptiveSessionMeta | null>(null);
  const [nclexLength, setNclexLength] = useState<NclexTimedVariant>("minimum");
  const [mpjeVariant, setMpjeVariant] = useState<MpjeVariant>("state");
  const [mpjeState, setMpjeState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<RawQuestionInput[] | null>(null);
  const autostartRequested = searchParams.get("autostart") === "1";
  const autostartAttempted = useRef(false);

  const subjects = useMemo(() => getSubjectsForField(field), [field]);
  const fieldId = useMemo(() => resolveFieldId(field), [field]);
  const isNclex = useMemo(() => isNclexField(field), [field]);
  const isMpje = useMemo(() => isMpjeField(fieldId), [fieldId]);
  const hubMode = resolvePracticeModeFromParams({
    practiceMode: searchParams.get("practiceMode"),
    mode: searchParams.get("mode"),
    style: searchParams.get("style"),
    count: searchParams.get("count"),
  });
  const timedCount = useMemo(
    () => getTimedExamQuestionCount(field, isNclex ? { nclexLength } : undefined),
    [field, isNclex, nclexLength]
  );
  const lengthLabel = useMemo(
    () => formatExamLengthLabel(field, isNclex ? { nclexLength } : undefined),
    [field, isNclex, nclexLength]
  );
  const timedSessionSeconds = useMemo(
    () =>
      isTimedExam
        ? computeTimedExamTimeLimitSec(field, timedCount, isNclex ? { nclexLength } : undefined)
        : undefined,
    [isTimedExam, field, timedCount, isNclex, nclexLength]
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
    if (questions) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [questions]);

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
    const parsed = parseOptionalMpjeStateParam(
      searchParams.get("state"),
      searchParams.get("mpjeState")
    );
    setMpjeState(parsed ?? "");
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
        buildTimedPracticeUrl(
          {
            fieldId,
            nclexLength: isNclex ? nclexLength : undefined,
            mpjeVariant: isMpje ? resolvedVariant : undefined,
            mpjeState:
              isMpje && resolvedVariant === "state" && resolvedState
                ? resolvedState
                : undefined,
          },
          practiceBase
        ),
        { scroll: false }
      );
      return;
    }
    if (!resolvedSubjectId) return;
    router.replace(
      buildBankPracticeUrl(
        {
          fieldId,
          subjectId: resolvedSubjectId,
          count: overrides?.count ?? questionCount,
          pace: overrides?.pace ?? bankPace,
          style: overrides?.style ?? bankStyle,
          mpjeVariant: isMpje ? resolvedVariant : undefined,
          mpjeState:
            isMpje && resolvedVariant === "state" && resolvedState
              ? resolvedState
              : undefined,
        },
        practiceBase
      ),
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

      if (isTimedExam) {
        if (isMpje) {
          if (mpjeVariant === "state" && mpjeState) {
            router.push(mpjePracticeExamHref(mpjeState));
            return;
          }
        } else {
          const examSlug = examSlugFromFieldId(fieldId);
          if (examSlug) {
            const res = await fetch("/api/full-exam/start", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                examSlug,
                lengthPreset: "full",
                timed: true,
              }),
            });
            const data = (await res.json().catch(() => ({}))) as {
              sessionId?: string;
              redirectUrl?: string;
              error?: string;
            };
            if (!res.ok) {
              throw new Error(data.error ?? "Could not start timed exam");
            }
            const href =
              data.redirectUrl ??
              (data.sessionId ? fullExamSessionHref(examSlug, data.sessionId) : null);
            if (!href) {
              throw new Error("Session was not created. Please try again.");
            }
            navigateHard(href);
            return;
          }
        }

        const qs = new URLSearchParams({
          field,
          limit: String(limit),
          mode: "timed",
          scope: "field",
          meta: "0",
        });
        if (isNclex) qs.set("nclexLength", nclexLength);
        if (isMpje) {
          qs.set("mpjeVariant", mpjeVariant);
          if (mpjeVariant === "state" && mpjeState) {
            qs.set("state", mpjeState);
            qs.set("mpjeState", mpjeState);
          }
        }

        const res = await fetch(`/api/questions?${qs.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not load timed exam");

        const metaIds = (data.bankItemIds as string[] | undefined) ?? [];
        const raw = (data.questions as ExamQuestion[]).map((q, i) => ({
          ...q,
          id: i + 1,
          field,
          subjectId: "__mixed__",
          bankItemId: metaIds[i] ?? `bank-${fieldId}-${i}`,
        }));
        if (raw.length === 0) {
          throw new Error("No questions in bank for this exam yet.");
        }
        setQuestions(raw);
        return;
      }

      const useAdaptive = bankStyle === "adaptive" || bankStyle === "weak_areas";
      const effectiveSubjectId = subjectId || subjects[0]?.id || "";
      if (!effectiveSubjectId) {
        throw new Error("Choose a topic before starting practice.");
      }

      if (useAdaptive) {
        const res = await fetch("/api/study/adaptive/next", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            field,
            subjectId: effectiveSubjectId,
            count: limit,
            currentDifficulty: "medium",
            studyMode: bankStyle === "weak_areas" ? "weak_area" : "adaptive",
            ...(isMpje
              ? {
                  mpjeVariant,
                  state:
                    mpjeVariant === "state" && mpjeState ? mpjeState : undefined,
                  mpjeState:
                    mpjeVariant === "state" && mpjeState ? mpjeState : undefined,
                }
              : {}),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not build adaptive session");

        const metaIds = (data.bankItemIds as string[] | undefined) ?? [];
        const raw = (data.questions as ExamQuestion[]).map((q, i) => ({
          ...q,
          id: i + 1,
          field,
          subjectId: effectiveSubjectId,
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
        meta: "0",
      });
      if (isMpje) {
        qs.set("mpjeVariant", mpjeVariant);
        if (mpjeVariant === "state" && mpjeState) {
          qs.set("state", mpjeState);
          qs.set("mpjeState", mpjeState);
        }
      }
      qs.set("subjectId", effectiveSubjectId);

      const res = await fetch(`/api/questions?${qs.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not load questions");

      const metaIds = (data.bankItemIds as string[] | undefined) ?? [];
      const raw = (data.questions as ExamQuestion[]).map((q, i) => ({
        ...q,
        id: i + 1,
        field,
        subjectId: effectiveSubjectId,
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
      const message = e instanceof Error ? e.message : "Failed to load";
      if (isMpje && /no questions|empty/i.test(message)) {
        setError(
          "MPJE questions are being prepared for this selection. Try Federal Pharmacy Law or State Practice Act, or contact us if this persists."
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    autostartAttempted.current = false;
  }, [searchParams]);

  useEffect(() => {
    if (!questions || !autostartRequested) return;
    const qs = new URLSearchParams(searchParams.toString());
    if (!qs.has("autostart")) return;
    qs.delete("autostart");
    const next = qs.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [questions, autostartRequested, pathname, router, searchParams]);

  useEffect(() => {
    if (!autostartRequested || autostartAttempted.current || questions || loading) return;
    if (!isTimedExam && !subjectId) return;
    autostartAttempted.current = true;
    document.getElementById("practice-launcher")?.scrollIntoView({ behavior: "smooth", block: "start" });
    void start();
  }, [autostartRequested, isTimedExam, subjectId, questions, loading]);

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
        timedSessionSeconds={timedSessionSeconds}
      />
    );
  }

  function launchPracticeMode(modeId: PracticeModeId) {
    const href = practiceModeLaunchHref(fieldId as ExamFieldId, modeId, practiceBase, {
      stateCode: mpjeState || undefined,
    });
    router.push(href);
  }

  const activeMode = EXAM_MODES.find((m) => m.id === practiceMode);
  const otherMode = EXAM_MODES.find((m) => m.id !== practiceMode);
  const timedExamLink =
    otherMode?.id === "timed" && examSlugFromFieldId(fieldId)
      ? fullExamLaunchHref(examSlugFromFieldId(fieldId)!)
      : otherMode
        ? `${practiceBase}?mode=${otherMode.param}&field=${encodeURIComponent(fieldId)}`
        : null;

  return (
    <div id="practice-launcher" className="mt-8 scroll-mt-24 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={STUDY_HUB_PATH}
          className="text-sm font-medium text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
        >
          ← Study Hub
        </Link>
        {otherMode && timedExamLink ? (
          <Link
            href={timedExamLink}
            className="text-sm font-medium text-[var(--color-accent)] transition hover:underline"
          >
            Switch to {otherMode.label}
          </Link>
        ) : null}
      </div>

      <div className="rounded-2xl border border-black/[0.06] bg-black/[0.02] px-5 py-4">
        <p className="font-semibold text-[var(--color-ink)]">{activeMode?.label}</p>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{activeMode?.description}</p>
      </div>

      <div className="apple-card space-y-6 p-4 sm:p-6 md:p-8">
        <div>
          <label className="apple-label">Exam</label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {EXAM_FIELD_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  const meta = getFieldMetaById(opt.id);
                  if (meta) setField(meta.label);
                  router.replace(`${practiceBase}?field=${encodeURIComponent(opt.fieldParam)}`, {
                    scroll: false,
                  });
                }}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-left text-sm transition",
                  fieldId === opt.id
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]"
                    : "border-black/[0.08] bg-white hover:border-black/[0.12]"
                )}
              >
                <p className="font-semibold text-[var(--color-ink)]">{opt.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="apple-label">Practice mode</label>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PRACTICE_MODES.map((m) => {
              const Icon = MODE_ICONS[m.icon as keyof typeof MODE_ICONS] ?? Zap;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => launchPracticeMode(m.id)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-left transition",
                    hubMode === m.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]"
                      : "border-black/[0.08] bg-white hover:border-black/[0.12]"
                  )}
                >
                  <Icon className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
                  <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{m.label}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">{m.timing}</p>
                </button>
              );
            })}
          </div>
        </div>

        {isMpje && mpjeVariant === "state" && (
          <MpjePracticeBanner stateCode={mpjeState} />
        )}

        {isMpje && (
          <div className="space-y-5">
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
            {mpjeVariant === "state" && (
              <MpjeStateSelect
                value={mpjeState}
                disabled={loading}
                onChange={(code) => {
                  setMpjeState(code);
                  syncPracticeUrl({ mpjeState: code });
                }}
              />
            )}
          </div>
        )}

        {!isTimedExam && (
          <QuestionBankSetup
            subjects={subjects}
            subjectId={subjectId}
            onSubjectChange={(id) => {
              setSubjectId(id);
              syncPracticeUrl({ subjectId: id });
            }}
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
                    : mpjeState
                      ? `State-specific MPJE — ${mpjeState} pharmacy law`
                      : "Federal pharmacy law only (no state selected)"}
                </li>
              )}
              <li>Fixed board-length session with per-question timer</li>
            </ul>
          </div>
        )}

        {isMpje && mpjeVariant === "state" && (
          <div className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-500/10 to-orange-500/5 px-4 py-4">
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              MPJE board exam simulator
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Full-length practice: 120 questions, 2.5 hours, countdown timer, flag &amp; review —
              matches the real MPJE format for{" "}
              {getMpjeState(mpjeState)?.name ?? (mpjeState || "federal")} pharmacy law.
            </p>
            <Button
              href={mpjePracticeExamHref(mpjeState)}
              variant="secondary"
              className="mt-4 w-full !rounded-xl"
            >
              Take Full Practice Exam (120 Questions — 2.5 Hours)
            </Button>
          </div>
        )}

        {error && (
          <div className="space-y-3">
            <InlineError>{error}</InlineError>
            {isMpje && (
              <p className="text-center text-xs text-[var(--color-ink-muted)]">
                Need help?{" "}
                <Link href="/feedback" className="font-medium text-[var(--color-accent)] hover:underline">
                  Contact support
                </Link>{" "}
                — we&apos;re expanding Oklahoma and federal MPJE coverage.
              </p>
            )}
          </div>
        )}
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
