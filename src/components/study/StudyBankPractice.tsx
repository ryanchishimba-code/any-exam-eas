"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  parseQuestionBankPace,
  parseQuestionBankStyle,
  type QuestionBankPace,
  type QuestionBankStyle,
} from "@/lib/exam/modes";
import { mpjePracticeExamHref, STUDY_HUB_PATH } from "@/lib/study-hub/config";
import { EXAM_CATALOG, examSlugFromFieldId } from "@/lib/edtech/exams";
import { persistUsmleStepPreference } from "@/lib/edtech/actions";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { fieldIdForExamSlug, fieldMatchesExamSlug } from "@/lib/edtech/exam-field-ids";
import {
  fullExamLaunchHref,
  fullExamSessionHref,
} from "@/lib/full-exam/config";
import {
  assertExactQuestionCount,
  resolveLengthPresetForField,
} from "@/lib/exam/session-count";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import { stashFullExamSessionPayload } from "@/lib/full-exam/session-payload-cache";
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
import { parsePracticeReturn, MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links";
import { qbUi } from "@/lib/study/question-bank-ui";
import {
  availableQuestionCount,
  estimateQuestionBankSessionMinutes,
  isRetestSessionCount,
  questionBankCountOptions,
  questionBankCountOptionsForAvailable,
  readPersistedQuestionBankSetup,
  resolveQuestionBankSessionCount,
  resolveWheelCountValue,
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
import { PanceTaskFocus } from "./question-bank/PanceTaskFocus";
import { useSubjectCounts } from "@/hooks/use-subject-counts";
import { useExamFieldSessionReset } from "@/hooks/use-exam-field-session-reset";
import type { PanceTaskAreaId } from "@/lib/exam-prep/pance/content-outline";
import {
  parsePanceTaskCategoryParam,
  sessionLabelWithTask,
} from "@/lib/exam-prep/pance/practice-focus";
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
    taskCategory?: PanceTaskAreaId | null;
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
  if (params.taskCategory) qs.set("taskCategory", params.taskCategory);
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
  const [taskCategory, setTaskCategory] = useState<PanceTaskAreaId | null>(() =>
    parsePanceTaskCategoryParam(
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("taskCategory")
        : null
    )
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upgradeHref, setUpgradeHref] = useState<string | null>(null);
  const [questions, setQuestions] = useState<RawQuestionInput[] | null>(null);
  const [sessionEpoch, setSessionEpoch] = useState(0);
  const autostartRequested = searchParams.get("autostart") === "1";
  const autostartAttempted = useRef(false);
  const zeroPoolFallbackAppliedRef = useRef(false);
  const fetchGenerationRef = useRef(0);
  const [examSwitching, setExamSwitching] = useState(false);
  const topicReturnTo = useMemo(
    () => parsePracticeReturn(searchParams),
    [searchParams]
  );

  const fieldId = useMemo(() => {
    if (fieldParam) {
      const fromParam = getFieldMeta(fieldParam) ?? getFieldMetaById(fieldParam);
      if (fromParam) return fromParam.id;
    }
    return resolveFieldId(field);
  }, [field, fieldParam]);

  const examScopeKey = useMemo(
    () => `${effectiveExamSlug ?? "open"}:${fieldId}`,
    [effectiveExamSlug, fieldId]
  );

  const resetPracticeSession = useCallback(() => {
    fetchGenerationRef.current += 1;
    setQuestions(null);
    setAdaptiveMeta(null);
    setError("");
    setUpgradeHref(null);
    setLoading(false);
    setSubjectId("");
    setSessionEpoch((epoch) => epoch + 1);
    autostartAttempted.current = false;
    zeroPoolFallbackAppliedRef.current = false;
  }, []);

  useExamFieldSessionReset(examScopeKey, resetPracticeSession);

  useEffect(() => {
    setExamSwitching(true);
  }, [examScopeKey]);

  const {
    data: subjectCounts = null,
    isLoading: countsLoading,
  } = useSubjectCounts(fieldId, {
    initialCounts: initialSubjectCounts ?? null,
    initialFieldId: initialSubjectCountsFieldId ?? null,
  });

  useEffect(() => {
    if (!countsLoading) setExamSwitching(false);
  }, [countsLoading, fieldId]);

  const subjects = useMemo(() => getSubjectsForFieldId(fieldId), [fieldId]);
  const bankSubjectIds = useMemo(() => subjects.map((s) => s.id), [subjects]);
  const weakSubjectIds = useMemo(
    () => weakSubjectIdsForField(weakTopics, fieldId, bankSubjectIds),
    [weakTopics, fieldId, bankSubjectIds]
  );

  const isNclex = useMemo(() => isNclexField(field), [field]);
  const isMpje = useMemo(() => isMpjeField(fieldId), [fieldId]);
  const isPance = fieldId === "pance";
  const hubMode = resolvePracticeModeFromParams({
    practiceMode: searchParams.get("practiceMode"),
    mode: searchParams.get("mode"),
    style: searchParams.get("style"),
    count: searchParams.get("count"),
  });
  const timedFieldKey = isMpje ? fieldId : field;
  const timedCount = useMemo(
    () => getTimedExamQuestionCount(timedFieldKey, isNclex ? { nclexLength } : undefined),
    [timedFieldKey, isNclex, nclexLength]
  );
  const lengthLabel = useMemo(
    () => formatExamLengthLabel(timedFieldKey, isNclex ? { nclexLength } : undefined),
    [timedFieldKey, isNclex, nclexLength]
  );
  const timedSessionSeconds = useMemo(
    () =>
      isTimedExam
        ? computeTimedExamTimeLimitSec(timedFieldKey, timedCount, isNclex ? { nclexLength } : undefined)
        : undefined,
    [isTimedExam, timedFieldKey, timedCount, isNclex, nclexLength]
  );
  const sessionStudyMode: StudyMode = isTimedExam
    ? "timed"
    : bankStyle === "weak_areas"
      ? "weak_area"
      : bankStyle === "adaptive" || bankStyle === "review_incorrect"
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
    const parsed = parsePanceTaskCategoryParam(resolvePracticeSearchParam(searchParams, "taskCategory"));
    setTaskCategory(parsed);
  }, [searchParams]);

  useEffect(() => {
    if (isPance) return;
    if (taskCategory) setTaskCategory(null);
  }, [isPance, taskCategory]);

  useEffect(() => {
    if (isTimedExam) return;

    const countParam = resolvePracticeSearchParam(searchParams, "count");
    const snapToWheel = (raw: number) =>
      resolveWheelCountValue(raw, questionBankCountOptions());
    if (countParam) {
      const raw = Number(countParam);
      // Preserve closed-loop retest sizes (5 / 10 / 25) from Deep Dive / miss CTAs.
      setQuestionCount(isRetestSessionCount(raw) ? raw : snapToWheel(raw));
    } else {
      const persisted = readPersistedQuestionBankSetup(fieldId);
      if (persisted?.count) setQuestionCount(snapToWheel(persisted.count));
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
      styleParam === "weak_areas" ||
      styleParam === "adaptive" ||
      styleParam === "review_incorrect" ||
      weakSubjectIds.length > 0;
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

  // Snap count to a valid 25 / 50 / 75 preset for the current topic pool.
  // Keep short retest counts (5 / 10 / 25) when the pool can still fill them.
  useEffect(() => {
    if (isTimedExam || countsLoading || !subjectCounts || !subjectId) return;
    const max = availableQuestionCount(subjectId, subjectCounts);
    if (max === null || max <= 0) return;
    setQuestionCount((current) => {
      if (isRetestSessionCount(current) && max >= current) return current;
      const options = questionBankCountOptionsForAvailable(max);
      if (options.length === 0) return current;
      const resolved = resolveWheelCountValue(current, options);
      if (resolved !== current) {
        syncPracticeUrl({ count: resolved });
      }
      return resolved;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, fieldId, subjectCounts, countsLoading, isTimedExam]);

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
      taskCategory: isPance ? taskCategory : null,
    });
  }, [fieldId, isTimedExam, subjectId, questionCount, bankPace, bankStyle, isPance, taskCategory]);

  function syncPracticeUrl(overrides?: {
    mpjeVariant?: MpjeVariant;
    mpjeState?: string;
    subjectId?: string;
    count?: number;
    pace?: QuestionBankPace;
    style?: QuestionBankStyle;
    taskCategory?: PanceTaskAreaId | null;
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
    const resolvedTaskCategory =
      overrides?.taskCategory !== undefined ? overrides.taskCategory : taskCategory;
    const href = buildBankPracticeUrl(
      {
        fieldId,
        subjectId: resolvedSubjectId,
        count: overrides?.count ?? questionCount,
        pace: overrides?.pace ?? bankPace,
        style: overrides?.style ?? bankStyle,
        taskCategory: isPance ? resolvedTaskCategory : null,
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

  function expectExactSessionCount(received: number, expected: number) {
    assertExactQuestionCount(received, expected);
  }

  async function start() {
    if (isMpje || !isTimedExam) syncPracticeUrl();

    if (!isTimedExam) {
      const validation = validateQuestionBankSession({
        subjectId,
        questionCount,
        subjectCounts,
        bankStyle,
        taskCategory: isPance ? taskCategory : null,
      });
      if (!validation.ok) {
        setError(validation.message ?? "Cannot start this session.");
        return;
      }
    }

    const generation = ++fetchGenerationRef.current;
    const isStale = () => generation !== fetchGenerationRef.current;

    setLoading(true);
    setError("");
    setUpgradeHref(null);
    setQuestions(null);
    setAdaptiveMeta(null);
    setSessionEpoch((epoch) => epoch + 1);
    try {
      const limit = isTimedExam
        ? timedCount
        : resolveQuestionBankSessionCount(
            questionCount,
            availableQuestionCount(subjectId, subjectCounts)
          );

      if (isTimedExam) {
        const examSlug = examSlugFromFieldId(fieldId);
        if (examSlug) {
          const resolvedFieldId = resolveFieldId(field);
          const lengthPreset = resolveLengthPresetForField(examSlug, timedCount, {
            nclexLength: isNclex ? nclexLength : undefined,
            fieldId: isUsmleFieldId(resolvedFieldId) ? resolvedFieldId : undefined,
          });
          const res = await fetch("/api/full-exam/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              examSlug,
              lengthPreset,
              timed: true,
              ...(isNclex ? { nclexLength } : {}),
              ...(examSlug === "usmle" && isUsmleFieldId(resolvedFieldId)
                ? { fieldId: resolvedFieldId }
                : {}),
            }),
          });
          const data = (await res.json().catch(() => ({}))) as {
            sessionId?: string;
            redirectUrl?: string;
            error?: string;
            upgradeUrl?: string;
            questions?: import("@/lib/ai").ExamQuestion[];
            bankItemIds?: string[];
            requested?: number;
          };
          if (!res.ok) {
            setUpgradeHref(data.upgradeUrl ?? null);
            throw new Error(studyLimitMessage(data) || data.error || "Could not start timed exam");
          }
          if (data.questions?.length) {
            expectExactSessionCount(data.questions.length, limit);
          }
          const href =
            data.redirectUrl ??
            (data.sessionId ? fullExamSessionHref(examSlug, data.sessionId) : null);
          if (!href) {
            throw new Error("Session was not created. Please try again.");
          }
          if (data.sessionId && data.questions?.length && data.bankItemIds?.length) {
            stashFullExamSessionPayload(data.sessionId, {
              questions: data.questions,
              bankItemIds: data.bankItemIds,
            });
          }
          if (isStale()) return;
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
        expectExactSessionCount(raw.length, limit);
        if (isStale()) return;
        setQuestions(raw);
        return;
      }

      const useAdaptive = bankStyle === "adaptive" || bankStyle === "weak_areas";
      const useReviewIncorrect = bankStyle === "review_incorrect";
      const effectiveSubjectId = subjectId || subjects[0]?.id || "";
      if (!effectiveSubjectId) {
        throw new Error("Choose a topic before starting practice.");
      }

      if (useReviewIncorrect) {
        const res = await fetch("/api/study/review-incorrect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            field,
            subjectId: effectiveSubjectId,
            count: limit,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setUpgradeHref(typeof data.upgradeUrl === "string" ? data.upgradeUrl : null);
          throw new Error(
            studyLimitMessage(data) || data.error || "Could not build review-incorrect session"
          );
        }

        const metaIds = (data.bankItemIds as string[] | undefined) ?? [];
        const raw = (data.questions as ExamQuestion[]).map((q, i) => ({
          ...q,
          id: i + 1,
          field,
          subjectId: (data.subjectId as string | undefined) ?? effectiveSubjectId,
          bankItemId: metaIds[i] ?? `bank-${fieldId}-${i}`,
        }));
        if (raw.length === 0) {
          throw new Error("No previously missed questions available to review.");
        }
        expectExactSessionCount(raw.length, limit);
        setAdaptiveMeta({
          sessionRationale: `Reviewing ${raw.length} items you missed and have not yet answered correctly.`,
          questionReasoning: Object.fromEntries(
            raw.map((q) => [
              String(q.id),
              "Previously incorrect — re-test until you get this right.",
            ])
          ),
        });
        if (isStale()) return;
        setQuestions(raw);
        return;
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
            ...(isPance && taskCategory ? { taskCategory } : {}),
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
        expectExactSessionCount(raw.length, limit);
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
        if (isStale()) return;
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
      if (isPance && taskCategory) qs.set("taskCategory", taskCategory);
      const nclexPreset = searchParams.get("nclexPreset");
      if (nclexPreset) qs.set("nclexPreset", nclexPreset);
      const difficultyTierParam = searchParams.get("difficultyTier");
      if (difficultyTierParam) qs.set("difficultyTier", difficultyTierParam);

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
      expectExactSessionCount(raw.length, limit);
      if (isStale()) return;
      setQuestions(raw);
    } catch (e) {
      if (isStale()) return;
      const message = e instanceof Error ? e.message : "Failed to load";
      if (isMpje && /no questions|empty/i.test(message)) {
        setError(
          "MPJE questions are being prepared for this selection. Try Federal Pharmacy Law or State Practice Act, or contact us if this persists."
        );
      } else {
        setError(message);
      }
    } finally {
      if (!isStale()) setLoading(false);
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
            taskCategory: isPance ? taskCategory : null,
          }),
    [isTimedExam, subjectId, questionCount, subjectCounts, bankStyle, isPance, taskCategory]
  );

  const previewTopicLabel = useMemo(() => {
    if (isTimedExam) return `${field} · Timed exam simulation`;
    const base = isMixedSubjectId(subjectId)
      ? MIXED_SUBJECT_LABEL
      : subjects.find((s) => s.id === subjectId)?.label ?? "Question bank";
    return isPance ? sessionLabelWithTask(base, taskCategory) : base;
  }, [field, isTimedExam, subjectId, subjects, isPance, taskCategory]);

  const previewAvailableCount = useMemo(
    () => (isTimedExam ? null : availableQuestionCount(subjectId, subjectCounts)),
    [isTimedExam, subjectId, subjectCounts]
  );

  const previewEstimatedMinutes = useMemo(
    () => estimateQuestionBankSessionMinutes(questionCount, bankPace),
    [questionCount, bankPace]
  );

  if ((loading && !questions) || (examSwitching && !questions)) {
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
    const scopedTopicLabel = isPance
      ? sessionLabelWithTask(topicLabel, taskCategory)
      : topicLabel;
    const mpjeScope =
      isMpje && mpjeVariant === "state"
        ? ` · ${getMpjeState(mpjeState)?.name ?? mpjeState} MPJE`
        : isMpje
          ? " · Uniform MPJE"
          : "";
    const title = isTimedExam
      ? `${field}${mpjeScope} · Timed exam · ${questions.length} questions`
      : `${field}${mpjeScope} · ${scopedTopicLabel} · ${questions.length} questions · ${
          bankStyle === "adaptive"
            ? "Adaptive practice"
            : bankStyle === "weak_areas"
              ? "Weak areas"
              : bankStyle === "review_incorrect"
                ? "Review incorrect"
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
          key={`${examScopeKey}:${sessionEpoch}`}
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
              hint="Full exam or question bank — pick how you want to practice."
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

          {isPance && !isTimedExam ? (
            <QuestionBankSection
              title="NCCPA task areas"
              hint="Sharpen diagnosis, pharmacotherapy, and other board tasks — works with any organ-system topic."
            >
              <PanceTaskFocus
                taskCategory={taskCategory}
                disabled={bankStyle !== "standard"}
                onTaskCategoryChange={(next) => {
                  if (bankStyle !== "standard") {
                    setBankStyle("standard");
                  }
                  setTaskCategory(next);
                  syncPracticeUrl({ taskCategory: next, style: "standard" });
                }}
                onFeaturedSelect={(next, count) => {
                  const max = availableQuestionCount(subjectId, subjectCounts);
                  const options =
                    max != null && max > 0
                      ? questionBankCountOptionsForAvailable(max)
                      : questionBankCountOptions();
                  const resolved = resolveWheelCountValue(count, options);
                  setBankStyle("standard");
                  setQuestionCount(resolved);
                  setTaskCategory(next);
                  syncPracticeUrl({
                    taskCategory: next,
                    count: resolved,
                    style: "standard",
                  });
                }}
              />
              {bankStyle !== "standard" ? (
                <p className={cn(qbUi.sectionHint, "px-0.5")}>
                  Switch to Standard selection to filter by task area.
                </p>
              ) : null}
            </QuestionBankSection>
          ) : null}

          {!isTimedExam ? (
            <QuestionBankSetup
              subjects={subjects}
              subjectId={subjectId}
              subjectCounts={subjectCounts}
              examLabel={lockedExam?.shortName ?? activeExamOption?.label}
              onSubjectChange={(id) => {
                setSubjectId(id);
                if (
                  isMixedSubjectId(id) &&
                  bankStyle !== "standard" &&
                  bankStyle !== "review_incorrect"
                ) {
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
