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
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import {
  EXAM_MODES,
  clampQuestionBankCount,
  parseQuestionBankPace,
  parseQuestionBankStyle,
  type QuestionBankPace,
  type QuestionBankStyle,
} from "@/lib/exam/modes";
import { mpjePracticeExamHref, STUDY_HUB_PATH } from "@/lib/study-hub/config";
import { EXAM_CATALOG, examSlugFromFieldId } from "@/lib/edtech/exams";
import { persistExamPreference, persistUsmleStepPreference } from "@/lib/edtech/actions";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import {
  fieldIdForExamSlug,
  fieldMatchesExamSlug,
} from "@/lib/edtech/question-bank-scope";
import { fullExamLaunchHref, fullExamSessionHref } from "@/lib/full-exam/config";
import { navigateHard } from "@/lib/client/navigate-hard";
import { ROUTES, fullExamHref } from "@/lib/routes";
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
  USMLE_STEP_OPTIONS,
  practiceModeLaunchHref,
  resolvePracticeModeFromParams,
  type PracticeModeId,
} from "@/lib/exam-prep/practice-modes";
import type { PracticeFieldId } from "@/lib/subjects/field-ids";
import { QuestionBankSetup } from "./QuestionBankSetup";
import { QuestionBankHeader } from "./question-bank/QuestionBankHeader";
import type { QuestionBankHubStats } from "./question-bank/QuestionBankPracticeLoader";
import { StudyUsageBanner } from "@/components/study/StudyUsageBanner";
import { studyLimitMessage } from "@/lib/study/usage-limit-messages";
import { QuestionBankSection, QuestionBankSegment } from "./question-bank/QuestionBankSection";
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
import { parseTopicPracticeReturn, MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links";
import { qbUi } from "@/lib/study/question-bank-ui";
import {
  availableQuestionCount,
  estimateQuestionBankSessionMinutes,
  readPersistedQuestionBankSetup,
  validateQuestionBankSession,
  writePersistedQuestionBankSetup,
  isMixedSubjectId,
  MIXED_SUBJECT_LABEL,
} from "@/lib/study/question-bank-setup";
import { QuestionBankSessionPreview } from "./question-bank/QuestionBankSessionPreview";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import {
  primaryWeakSubjectId,
  weakSubjectIdsForField,
} from "@/lib/study/question-bank-weak-topics";
import { TopicPracticeReturnBanner } from "./TopicPracticeReturnBanner";
import { QuestionSessionSkeleton } from "./QuestionSessionSkeleton";
import { useSubjectCounts } from "@/hooks/use-subject-counts";
import type { ExamSlug } from "@/types/edtech";

const StudySessionPlayer = dynamic(
  () => import("./StudySessionPlayer").then((m) => m.StudySessionPlayer),
  {
    loading: () => <QuestionSessionSkeleton />,
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

function readBrowserSubjectParam(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("subjectId");
}

function resolveSubjectParam(
  searchParams: Pick<URLSearchParams, "get">
): string | null {
  return searchParams.get("subjectId") ?? readBrowserSubjectParam();
}

function resolvePracticeSearchParam(
  searchParams: Pick<URLSearchParams, "get">,
  key: string
): string | null {
  return searchParams.get(key) ?? readBrowserSearchParam(key);
}

function readBrowserSearchParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

function practiceUrlSearchParams(
  searchParams: Pick<URLSearchParams, "toString" | "get">
): URLSearchParams {
  if (typeof window !== "undefined" && window.location.search) {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams(searchParams.toString());
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
  base = ROUTES.questionBank
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
  base = ROUTES.questionBank
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

function initialFieldLabel(
  preferredExamSlug?: ExamSlug,
  initialFieldId?: string
): string {
  if (initialFieldId) {
    const meta = getFieldMetaById(initialFieldId);
    if (meta) return meta.label;
  }
  if (preferredExamSlug) {
    const meta = getFieldMetaById(fieldIdForExamSlug(preferredExamSlug));
    if (meta) return meta.label;
  }
  return DEFAULT_STUDY_FIELD_LABEL;
}

export function StudyBankPractice({
  preferredExamSlug,
  lockExam = false,
  initialFieldId,
  initialSubjectCounts,
  initialSubjectCountsFieldId,
  weakTopics = [],
  hubStats,
  usmleStepLabel,
  topicCount = null,
  totalQuestions = null,
}: {
  preferredExamSlug?: ExamSlug;
  lockExam?: boolean;
  /** Server-resolved field id from ?field= — keeps step selection in sync on first paint. */
  initialFieldId?: string;
  /** Server-prefetched serve counts — avoids empty-state flash on /question-bank. */
  initialSubjectCounts?: Record<string, number> | null;
  initialSubjectCountsFieldId?: string;
  /** Analytics weak topics — drives badges and default topic selection. */
  weakTopics?: WeakTopicRow[];
  hubStats?: QuestionBankHubStats;
  usmleStepLabel?: string;
  topicCount?: number | null;
  totalQuestions?: number | null;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { examSlug: clientExamSlug, loading: prefLoading, setExamSlug, refresh: refreshExamPref } =
    useAppPreferences();
  const modeParam = searchParams.get("mode");
  const fieldParam =
    searchParams.get("field") ?? readBrowserSearchParam("field");
  const onQuestionBank = pathname === ROUTES.questionBank;
  const practiceBase = ROUTES.questionBank;
  const effectiveExamSlug = preferredExamSlug ?? clientExamSlug;
  const examLocked = lockExam || onQuestionBank;

  const practiceMode = resolvePracticeMode(
    modeParam && !LEGACY_MODES.has(modeParam) ? modeParam : null,
    onQuestionBank
  );
  const isTimedExam = practiceMode === "timed";

  const [field, setField] = useState(() => initialFieldLabel(preferredExamSlug, initialFieldId));
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
  const [upgradeHref, setUpgradeHref] = useState<string | null>(null);
  const [questions, setQuestions] = useState<RawQuestionInput[] | null>(null);
  const autostartRequested = searchParams.get("autostart") === "1";
  const autostartAttempted = useRef(false);
  const crossExamFieldSyncRef = useRef<string | null>(null);
  const zeroPoolFallbackAppliedRef = useRef(false);
  const topicReturnTo = useMemo(
    () => parseTopicPracticeReturn(searchParams),
    [searchParams]
  );

  const fieldId = useMemo(() => {
    if (fieldParam) {
      const fromParam = getFieldMeta(fieldParam) ?? getFieldMetaById(fieldParam);
      if (fromParam) return fromParam.id;
    }
    return resolveFieldId(field);
  }, [field, fieldParam]);
  const {
    data: subjectCounts = null,
    isLoading: countsLoading,
  } = useSubjectCounts(fieldId, {
    initialCounts: initialSubjectCounts ?? null,
    initialFieldId: initialSubjectCountsFieldId ?? null,
  });
  const subjects = useMemo(() => getSubjectsForFieldId(fieldId), [fieldId]);
  const bankSubjectIds = useMemo(() => subjects.map((s) => s.id), [subjects]);
  const weakSubjectIds = useMemo(
    () => weakSubjectIdsForField(weakTopics, fieldId, bankSubjectIds),
    [weakTopics, fieldId, bankSubjectIds]
  );

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
      const bankModes = new Set(["practice", "research", "weak", "weak_area"]);
      const target = bankModes.has(modeParam)
        ? `${ROUTES.questionBank}?field=${encodeURIComponent(fieldId)}`
        : fullExamHref(examSlugFromFieldId(fieldId) ?? effectiveExamSlug!);
      router.replace(target);
      return;
    }
  }, [modeParam, fieldId, effectiveExamSlug, router]);

  useEffect(() => {
    if (isTimedExam && searchParams.get("subjectId")) {
      const qs = new URLSearchParams(searchParams.toString());
      qs.delete("subjectId");
      qs.delete("count");
      qs.delete("pace");
      router.replace(`${practiceBase}?${qs.toString()}`);
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
    if (prefLoading && !preferredExamSlug) return;

    const paramMeta = fieldParam
      ? getFieldMeta(fieldParam) ?? getFieldMetaById(fieldParam)
      : undefined;

    if (effectiveExamSlug && examLocked) {
      const expectedId = fieldIdForExamSlug(effectiveExamSlug);
      const expectedMeta = getFieldMetaById(expectedId);
      if (!expectedMeta) return;

      if (paramMeta && !fieldMatchesExamSlug(paramMeta.id, effectiveExamSlug)) {
        const targetSlug = examSlugFromFieldId(paramMeta.id);
        if (targetSlug) {
          setField(paramMeta.label);
          const syncKey = `${paramMeta.id}:${targetSlug}`;
          if (crossExamFieldSyncRef.current !== syncKey) {
            crossExamFieldSyncRef.current = syncKey;
            void persistExamPreference(targetSlug).then(async (result) => {
              if (result.ok) {
                setExamSlug(targetSlug);
                await refreshExamPref();
                router.refresh();
              }
            });
          }
          return;
        }
        setField(expectedMeta.label);
        const qs = practiceUrlSearchParams(searchParams);
        qs.set("field", expectedId);
        if (onQuestionBank && !qs.has("mode")) qs.set("mode", "bank");
        router.replace(`${practiceBase}?${qs.toString()}`, { scroll: false });
        return;
      }

      // A specific field WITHIN the locked exam (e.g. a chosen USMLE step like
      // usmle-step-1 / usmle-step-3) — honor it instead of collapsing to the
      // exam's default field (usmle-step-2).
      if (paramMeta && paramMeta.id !== expectedId) {
        setField(paramMeta.label);
        return;
      }

      setField(expectedMeta.label);

      const activeField = fieldParam ?? readBrowserSearchParam("field");
      if (!activeField || activeField !== expectedId) {
        const qs = practiceUrlSearchParams(searchParams);
        qs.set("field", expectedId);
        if (onQuestionBank && !qs.has("mode")) qs.set("mode", "bank");
        router.replace(`${practiceBase}?${qs.toString()}`, { scroll: false });
      }
      return;
    }

    if (paramMeta) {
      setField(paramMeta.label);
      return;
    }

    if (effectiveExamSlug) {
      const expectedMeta = getFieldMetaById(fieldIdForExamSlug(effectiveExamSlug));
      if (expectedMeta) setField(expectedMeta.label);
    }
  }, [
    effectiveExamSlug,
    examLocked,
    fieldParam,
    onQuestionBank,
    practiceBase,
    prefLoading,
    preferredExamSlug,
    refreshExamPref,
    router,
    searchParams,
    setExamSlug,
  ]);

  useEffect(() => {
    if (isTimedExam) return;

    const countParam = resolvePracticeSearchParam(searchParams, "count");
    if (countParam) {
      setQuestionCount(clampQuestionBankCount(Number(countParam)));
    } else {
      const persisted = readPersistedQuestionBankSetup(fieldId);
      if (persisted?.count) setQuestionCount(clampQuestionBankCount(persisted.count));
    }

    const paceParam = resolvePracticeSearchParam(searchParams, "pace");
    if (paceParam) {
      setBankPace(parseQuestionBankPace(paceParam));
    } else {
      const persisted = readPersistedQuestionBankSetup(fieldId);
      if (persisted?.pace) setBankPace(persisted.pace);
    }

    const styleParam = resolvePracticeSearchParam(searchParams, "style");
    if (styleParam) {
      setBankStyle(parseQuestionBankStyle(styleParam));
    } else {
      const persisted = readPersistedQuestionBankSetup(fieldId);
      if (persisted?.style) setBankStyle(persisted.style);
    }
  }, [fieldId, isTimedExam, searchParams]);

  useEffect(() => {
    if (isTimedExam) return;
    const list = getSubjectsForFieldId(fieldId);
    if (!list.length) {
      setSubjectId("");
      return;
    }

    const subjectParam = resolveSubjectParam(searchParams);
    if (subjectParam === MIXED_SUBJECT_ID) {
      setSubjectId(MIXED_SUBJECT_ID);
      return;
    }
    const match = subjectParam && list.some((s) => s.id === subjectParam);
    if (match) {
      setSubjectId(subjectParam!);
      return;
    }

    const persisted = readPersistedQuestionBankSetup(fieldId);
    if (
      !resolveSubjectParam(searchParams) &&
      persisted?.subjectId &&
      (persisted.subjectId === MIXED_SUBJECT_ID ||
        list.some((s) => s.id === persisted.subjectId))
    ) {
      setSubjectId(persisted.subjectId);
      return;
    }

    const styleParam = resolvePracticeSearchParam(searchParams, "style");
    const preferWeak =
      styleParam === "weak_areas" || styleParam === "adaptive" || weakSubjectIds.length > 0;
    if (preferWeak) {
      const weakest = primaryWeakSubjectId(weakTopics, fieldId, list.map((s) => s.id));
      if (weakest) {
        setSubjectId(weakest);
        return;
      }
    }

    setSubjectId(list[0]?.id ?? "");
  }, [fieldId, isTimedExam, searchParams, weakTopics, weakSubjectIds.length]);

  useEffect(() => {
    zeroPoolFallbackAppliedRef.current = false;
  }, [fieldId]);

  // When counts first load, move off a zero-count topic (once per field visit).
  useEffect(() => {
    if (isTimedExam || countsLoading || !subjectCounts || zeroPoolFallbackAppliedRef.current) {
      return;
    }
    zeroPoolFallbackAppliedRef.current = true;

    const pool = availableQuestionCount(subjectId, subjectCounts);
    if (pool === null || pool > 0) return;

    const list = getSubjectsForFieldId(fieldId);
    const fallback =
      list.find((s) => (subjectCounts[s.id] ?? 0) > 0)?.id ??
      (Object.values(subjectCounts).reduce((sum, n) => sum + n, 0) > 0
        ? MIXED_SUBJECT_ID
        : (list[0]?.id ?? ""));

    if (fallback && fallback !== subjectId) {
      setSubjectId(fallback);
      syncPracticeUrl({ subjectId: fallback });
    }
  }, [isTimedExam, countsLoading, subjectCounts, subjectId, fieldId]);

  // Shrink session length when the selected topic cannot fill the current count.
  useEffect(() => {
    if (isTimedExam || countsLoading || !subjectCounts || !subjectId) return;
    const max = availableQuestionCount(subjectId, subjectCounts);
    if (max === null || max <= 0 || questionCount <= max) return;
    const clamped = clampQuestionBankCount(max);
    setQuestionCount(clamped);
    syncPracticeUrl({ count: clamped });
  }, [isTimedExam, countsLoading, subjectCounts, subjectId, questionCount, fieldId]);

  const subjectUrlSyncedRef = useRef(false);
  useEffect(() => {
    subjectUrlSyncedRef.current = false;
  }, [fieldId]);

  useEffect(() => {
    if (isTimedExam || !subjectId) return;
    if (resolveSubjectParam(searchParams)) return;
    if (subjectUrlSyncedRef.current) return;
    subjectUrlSyncedRef.current = true;
    syncPracticeUrl({ subjectId });
  }, [isTimedExam, subjectId, searchParams]);

  useEffect(() => {
    if (isTimedExam || !subjectId) return;
    writePersistedQuestionBankSetup(fieldId, {
      subjectId,
      count: questionCount,
      pace: bankPace,
      style: bankStyle,
    });
  }, [fieldId, isTimedExam, subjectId, questionCount, bankPace, bankStyle]);

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
    const href = buildBankPracticeUrl(
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
    );
    if (typeof window !== "undefined") {
      window.history.replaceState(window.history.state, "", href);
    }
    router.replace(href, { scroll: false });
  }

  async function start() {
    if (isMpje || !isTimedExam) syncPracticeUrl();

    if (!isTimedExam) {
      const validation = validateQuestionBankSession({
        subjectId,
        questionCount,
        subjectCounts,
        bankStyle,
      });
      if (!validation.ok) {
        setError(validation.message ?? "Cannot start this session.");
        return;
      }
    }

    setLoading(true);
    setError("");
    setUpgradeHref(null);
    setQuestions(null);
    setAdaptiveMeta(null);
    try {
      const limit = isTimedExam ? timedCount : questionCount;

      if (isTimedExam) {
        const examSlug = examSlugFromFieldId(fieldId);
        if (examSlug) {
          const res = await fetch("/api/full-exam/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              examSlug,
              lengthPreset: "full",
              timed: true,
              ...(isNclex ? { nclexLength } : {}),
            }),
          });
          const data = (await res.json().catch(() => ({}))) as {
            sessionId?: string;
            redirectUrl?: string;
            error?: string;
            upgradeUrl?: string;
          };
          if (!res.ok) {
            setUpgradeHref(data.upgradeUrl ?? null);
            throw new Error(studyLimitMessage(data) || data.error || "Could not start timed exam");
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

        const qs = new URLSearchParams({
          field: fieldId,
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
        if (!res.ok) {
          setUpgradeHref(typeof data.upgradeUrl === "string" ? data.upgradeUrl : null);
          throw new Error(studyLimitMessage(data) || data.error || "Could not load timed exam");
        }

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
        if (!res.ok) {
          setUpgradeHref(typeof data.upgradeUrl === "string" ? data.upgradeUrl : null);
          throw new Error(studyLimitMessage(data) || data.error || "Could not build adaptive session");
        }

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
        field: fieldId,
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
      if (!res.ok) {
        setUpgradeHref(typeof data.upgradeUrl === "string" ? data.upgradeUrl : null);
        throw new Error(studyLimitMessage(data) || data.error || "Could not load questions");
      }

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

  const bankSessionValidation = useMemo(
    () =>
      isTimedExam
        ? { ok: true as const }
        : validateQuestionBankSession({
            subjectId,
            questionCount,
            subjectCounts,
            bankStyle,
          }),
    [isTimedExam, subjectId, questionCount, subjectCounts, bankStyle]
  );

  const previewTopicLabel = useMemo(() => {
    if (isTimedExam) return `${field} · Timed exam simulation`;
    if (isMixedSubjectId(subjectId)) return MIXED_SUBJECT_LABEL;
    return subjects.find((s) => s.id === subjectId)?.label ?? "Question bank";
  }, [field, isTimedExam, subjectId, subjects]);

  const previewAvailableCount = useMemo(
    () => (isTimedExam ? null : availableQuestionCount(subjectId, subjectCounts)),
    [isTimedExam, subjectId, subjectCounts]
  );

  const previewEstimatedMinutes = useMemo(
    () => estimateQuestionBankSessionMinutes(questionCount, bankPace),
    [questionCount, bankPace]
  );

  if (loading && !questions) {
    return (
      <div
        id="practice-launcher"
        className={cn(qbUi.page, onQuestionBank ? "mt-0 scroll-mt-20" : "mt-8 scroll-mt-24")}
      >
        <QuestionSessionSkeleton />
      </div>
    );
  }

  if (questions) {
    const topicLabel = isMixedSubjectId(subjectId)
      ? MIXED_SUBJECT_LABEL
      : subjects.find((s) => s.id === subjectId)?.label ?? "Question bank";
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
            ? "Adaptive practice"
            : bankStyle === "weak_areas"
              ? "Weak areas"
              : bankPace === "timed"
                ? "Timed"
                : "Untimed"
        }`;

    return (
      <div className="space-y-4">
        {topicReturnTo ? (
          <TopicPracticeReturnBanner returnTo={topicReturnTo} />
        ) : null}
        <StudySessionPlayer
          field={field}
          subjectId={isTimedExam ? "__mixed__" : subjectId}
          questions={questions}
          sourceType="bank"
          mode={sessionStudyMode}
          title={title}
          adaptiveMeta={adaptiveMeta ?? undefined}
          timedSessionSeconds={timedSessionSeconds}
          returnTo={topicReturnTo ?? undefined}
        />
      </div>
    );
  }

  function launchPracticeMode(modeId: PracticeModeId) {
    const href = practiceModeLaunchHref(fieldId as PracticeFieldId, modeId, practiceBase);
    router.push(href);
  }

  const activeMode = EXAM_MODES.find((m) => m.id === practiceMode);
  const activeExamOption = EXAM_FIELD_OPTIONS.find((opt) => opt.id === fieldId);
  const lockedExam = effectiveExamSlug ? EXAM_CATALOG[effectiveExamSlug] : null;

  const previewTimedMinutes =
    typeof timedSessionSeconds === "number" ? Math.ceil(timedSessionSeconds / 60) : undefined;

  const canStartBank =
    !isTimedExam &&
    !!subjectId &&
    bankSessionValidation.ok &&
    !loading &&
    !countsLoading;
  const canStartTimed = isTimedExam && !loading && (!isMpje || mpjeVariant !== "state" || !!mpjeState);

  return (
    <div
      id="practice-launcher"
      className={cn(qbUi.page, onQuestionBank ? "mt-0 scroll-mt-20" : "mt-8 scroll-mt-24")}
    >
      {!onQuestionBank ? (
        <div className="flex flex-wrap items-center justify-between gap-3 px-0.5">
          <Link
            href={STUDY_HUB_PATH}
            className="text-[13px] font-medium text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
          >
            ← Study Hub
          </Link>
        </div>
      ) : null}

      {onQuestionBank && examLocked && lockedExam && effectiveExamSlug ? (
        <QuestionBankHeader
          examName={lockedExam.shortName}
          usmleStepLabel={usmleStepLabel}
          practiceMode={practiceMode}
          topicCount={topicCount}
          totalQuestions={totalQuestions}
          readinessScore={hubStats?.readinessScore}
          streakDays={hubStats?.streakDays}
        />
      ) : null}

      <StudyUsageBanner compact={onQuestionBank} />

      <QuestionBankSection title="Practice type" hint={activeMode?.description}>
            <QuestionBankSegment
              ariaLabel="Practice type"
              value={practiceMode}
              onChange={(mode) => {
                const qs = new URLSearchParams(searchParams.toString());
                qs.set("mode", mode);
                if (mode === "timed") {
                  qs.delete("subjectId");
                  qs.delete("count");
                  qs.delete("pace");
                  qs.delete("style");
                }
                router.replace(`${practiceBase}?${qs.toString()}`, { scroll: false });
              }}
              options={[
                { id: "bank", label: "Question Bank" },
                { id: "timed", label: "Timed Exam" },
              ]}
            />
          </QuestionBankSection>

          {examLocked && effectiveExamSlug === "usmle" ? (
            <QuestionBankSection title="USMLE step" hint="Step 1, Step 2 CK, and Step 3 each have dedicated banks and roadmaps.">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {USMLE_STEP_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      const meta = getFieldMetaById(opt.id);
                      if (meta) setField(meta.label);
                      void persistUsmleStepPreference(opt.fieldParam);
                      const qs = new URLSearchParams(searchParams.toString());
                      qs.set("field", opt.fieldParam);
                      if (onQuestionBank && !qs.has("mode")) qs.set("mode", "bank");
                      router.replace(`${practiceBase}?${qs.toString()}`, {
                        scroll: false,
                      });
                    }}
                    className={cn(
                      qbUi.optionCard,
                      fieldId === opt.id && qbUi.optionCardActive
                    )}
                  >
                    <p className="text-[13px] font-semibold text-[var(--color-ink)]">{opt.label}</p>
                    <p className={cn(qbUi.sectionHint, "mt-0.5")}>{opt.format}</p>
                  </button>
                ))}
              </div>
            </QuestionBankSection>
          ) : null}

          {!examLocked && (
            <QuestionBankSection title="Exam">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                      qbUi.optionCard,
                      fieldId === opt.id && qbUi.optionCardActive
                    )}
                  >
                    <p className="text-[13px] font-semibold text-[var(--color-ink)]">{opt.label}</p>
                  </button>
                ))}
              </div>
            </QuestionBankSection>
          )}

          {!(onQuestionBank && examLocked) ? (
            <QuestionBankSection
              title="Quick start"
              hint="Jump into a preset session — settings update automatically."
            >
              <div className={cn(qbUi.chipRow, "snap-x snap-mandatory px-0.5")}>
                {PRACTICE_MODES.map((m) => {
                  const Icon = MODE_ICONS[m.icon as keyof typeof MODE_ICONS] ?? Zap;
                  const active = hubMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => launchPracticeMode(m.id)}
                      className={cn(qbUi.modeCard, active && qbUi.modeCardActive)}
                    >
                      <Icon className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
                      <p className="mt-2 text-[14px] font-semibold text-[var(--color-ink)]">{m.label}</p>
                      <p className="mt-0.5 text-[11px] text-[var(--color-ink-muted)]">{m.timing}</p>
                    </button>
                  );
                })}
              </div>
            </QuestionBankSection>
          ) : null}

          {isMpje && mpjeVariant === "state" ? <MpjePracticeBanner stateCode={mpjeState} /> : null}

          {isMpje ? (
            <div className={cn(qbUi.surface, "space-y-4 p-4")}>
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
              {mpjeVariant === "state" ? (
                <MpjeStateSelect
                  value={mpjeState}
                  disabled={loading}
                  onChange={(code) => {
                    setMpjeState(code);
                    syncPracticeUrl({ mpjeState: code });
                  }}
                />
              ) : null}
            </div>
          ) : null}

          {!isTimedExam ? (
            <QuestionBankSetup
              subjects={subjects}
              subjectId={subjectId}
              subjectCounts={subjectCounts}
              examLabel={lockedExam?.shortName ?? activeExamOption?.label}
              onSubjectChange={(id) => {
                setSubjectId(id);
                if (isMixedSubjectId(id) && bankStyle !== "standard") {
                  setBankStyle("standard");
                  syncPracticeUrl({ subjectId: id, style: "standard" });
                  return;
                }
                syncPracticeUrl({ subjectId: id });
              }}
              questionCount={questionCount}
              onQuestionCountChange={(count) => {
                setQuestionCount(count);
                syncPracticeUrl({ count });
              }}
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
              weakSubjectIds={weakSubjectIds}
              countsLoading={countsLoading}
            />
          ) : null}

          {isTimedExam && isNclex ? (
            <QuestionBankSection title="NCLEX length">
              <QuestionBankSegment
                ariaLabel="NCLEX exam length"
                value={nclexLength}
                onChange={setNclexLength}
                options={[
                  { id: "minimum", label: "85 questions" },
                  { id: "maximum", label: "150 questions" },
                ]}
              />
            </QuestionBankSection>
          ) : null}

          {isTimedExam ? (
            <div className={cn(qbUi.surface, "p-4")}>
              <div className="space-y-2">
                <p className="text-[13px] font-semibold text-[var(--color-ink)]">Full exam simulation</p>
                <p className={qbUi.sectionHint}>{lengthLabel}</p>
                <ul className="space-y-1.5 pt-1 text-[12px] text-[var(--color-ink-muted)]">
                  <li>Mixed questions from your full exam bank</li>
                  <li>No topic filter — mirrors test-day conditions</li>
                  {isMpje ? (
                    <li>
                      {mpjeVariant === "uniform"
                        ? "Uniform MPJE — federal + common state law"
                        : mpjeState
                          ? `State MPJE — ${mpjeState} pharmacy law`
                          : "Select a state for state-specific law"}
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          ) : null}

          {isMpje && mpjeVariant === "state" ? (
            <div className={cn(qbUi.surface, "p-4")}>
              <p className="text-[13px] font-semibold text-[var(--color-ink)]">MPJE board simulator</p>
              <p className={cn(qbUi.sectionHint, "mt-1")}>
                120 questions · 2.5 hours · flag &amp; review for{" "}
                {getMpjeState(mpjeState)?.name ?? (mpjeState || "federal")} law.
              </p>
              <Button
                href={mpjePracticeExamHref(mpjeState)}
                variant="secondary"
                className="mt-3 w-full !rounded-full"
              >
                Full practice exam
              </Button>
            </div>
          ) : null}

          {error ? (
            <div className="space-y-3">
              <InlineError>{error}</InlineError>
              {upgradeHref ? (
                <div className="flex justify-center">
                  <Button href={upgradeHref} variant="secondary" className="!rounded-full">
                    View upgrade options
                  </Button>
                </div>
              ) : null}
              {isMpje ? (
                <p className="text-center text-[12px] text-[var(--color-ink-muted)]">
                  Need help?{" "}
                  <Link href="/feedback" className="font-medium text-[var(--color-accent)] hover:underline">
                    Contact support
                  </Link>
                </p>
              ) : null}
            </div>
          ) : null}

          <QuestionBankSessionPreview
            topicLabel={previewTopicLabel}
            questionCount={questionCount}
            pace={bankPace}
            bankStyle={bankStyle}
            estimatedMinutes={previewEstimatedMinutes}
            availableCount={previewAvailableCount}
            validationMessage={bankSessionValidation.ok ? undefined : bankSessionValidation.message}
            loading={loading || countsLoading}
            disabled={!(canStartBank || canStartTimed)}
            onStart={() => void start()}
            isTimedExam={isTimedExam}
            timedCount={timedCount}
            timedMinutes={previewTimedMinutes}
          />
    </div>
  );
}
