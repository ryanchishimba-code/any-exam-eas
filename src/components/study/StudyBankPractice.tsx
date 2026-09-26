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
  type QuestionBankPace,
  type QuestionBankStyle,
} from "@/lib/exam/modes";
import { mpjePracticeExamHref, STUDY_HUB_PATH } from "@/lib/study-hub/config";
import { EXAM_CATALOG, examSlugFromFieldId } from "@/lib/edtech/exams";
import { persistUsmleStepPreference } from "@/lib/edtech/actions";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { fieldIdForExamSlug } from "@/lib/edtech/exam-field-ids";
import { takeDailySet } from "@/lib/learning/today-set-stash";
import { isPracticeFieldId } from "@/lib/subjects/field-ids";
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
import type { AdaptiveSessionMeta, RawQuestionInput } from "@/lib/questions/types";
import type { ExamQuestion } from "@/lib/ai";
import { Button } from "@/components/ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";
import { cn } from "@/lib/utils";
import { parsePracticeReturn, MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links";
import {
  canonicalizeQuestionBankQuery,
  resolvePracticeSubjectId,
  subjectIdBelongsToField,
  subjectIdForPracticeUrl,
} from "@/lib/study/question-bank-filters";
import {
  blueprintAreaCountFromTopics,
  blueprintAreaLabel,
  isBlueprintAreaId,
} from "@/lib/inventory/blueprint-domain-pool";
import { qbUi } from "@/lib/study/question-bank-ui";
import {
  availableQuestionCount,
  bankStyleHonorsLaunchStyle,
  deliberateFormatForLaunch,
  estimateQuestionBankSessionMinutes,
  isRetestSessionCount,
  preferredQuestionBankStyleParam,
  questionBankCountOptions,
  questionBankCountOptionsForAvailable,
  readPersistedQuestionBankSetup,
  resolveQuestionBankSessionCount,
  resolveQuestionBankStyleAndFormat,
  resolveWheelCountValue,
  studyModeForQuestionBankLaunch,
  stylePreservedForPracticeUrl,
  validateQuestionBankSession,
  writePersistedQuestionBankSetup,
  isMixedSubjectId,
  MIXED_SUBJECT_LABEL,
} from "@/lib/study/question-bank-setup";
import {
  buildDeliberateFormatQuestionQuery,
  ngnStyleLabel,
  practiceFormatCountOptions,
  practiceFormatEmptyGuidance,
  practiceFormatPoolCount,
  practiceFormatScopeCounts,
  practiceFormatTitle,
  validatePracticeFormatSession,
  type PracticeFormatEmptyGuidance,
  type PracticeFormatMode,
} from "@/lib/study/practice-format";
import { QuestionBankSessionPreview } from "./question-bank/QuestionBankSessionPreview";
import { OTHER_OPEN_SUBJECT_ID } from "@/lib/learning/other-open-subject";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import { weakSubjectIdsForField } from "@/lib/study/question-bank-weak-topics";
import { TopicPracticeReturnBanner } from "./TopicPracticeReturnBanner";
import { QuestionSessionSkeleton } from "./QuestionSessionSkeleton";
import { RemediationLaunchNotice } from "./RemediationLaunchNotice";
import {
  decisionFromRemediationPayload,
  emptyModeFromLaunchQuery,
  launchQueryForEmpty,
  reviewIncorrectBlocksSessionSkeleton,
  shouldAutostartPractice,
  type RemediationMode,
} from "@/lib/study/remediation-launch";
import {
  reviewSubjectForLaunch,
  unscopedReviewSubject,
} from "@/lib/learning/review-queue-launch";
import {
  resolveReviewOpenQueueTotal,
  reviewIncorrectSessionRationale,
} from "@/lib/study/review-incorrect-queue-label";
import { PanceTaskFocus } from "./question-bank/PanceTaskFocus";
import { useSubjectCounts } from "@/hooks/use-subject-counts";
import { useCoverageHeatmap } from "@/hooks/use-coverage-heatmap";
import type { CoverageHeatmap } from "@/lib/learning/coverage-heatmap";
import type { SubjectCountsClient } from "@/lib/study/subject-counts-client";
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
    subjectId?: string | null;
    blueprintAreaId?: string | null;
    count: number;
    pace: QuestionBankPace;
    style?: QuestionBankStyle;
    mpjeVariant?: MpjeVariant;
    mpjeState?: string;
    taskCategory?: PanceTaskAreaId | null;
    format?: PracticeFormatMode;
  },
  base = ROUTES.questionBank
) {
  const qs = new URLSearchParams({
    mode: "bank",
    field: params.fieldId,
    count: String(params.count),
    pace: params.pace,
  });
  if (params.subjectId) qs.set("subjectId", params.subjectId);
  if (params.blueprintAreaId) qs.set("blueprintArea", params.blueprintAreaId);
  if (params.format && params.format !== "all") qs.set("format", params.format);
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
  initialInventory,
  weakTopics = [],
  initialCoverage = null,
  initialCoverageFieldId,
  hubStats,
  usmleStepLabel,
  topicCount = null,
  totalQuestions = null,
  boardOpenRemediationCount = null,
}: {
  preferredExamSlug?: ExamSlug;
  lockExam?: boolean;
  /** Server-resolved field id from ?field= — keeps step selection in sync on first paint. */
  initialFieldId?: string;
  /** Server-prefetched serve counts — avoids empty-state flash on /question-bank. */
  initialSubjectCounts?: Record<string, number> | null;
  initialSubjectCountsFieldId?: string;
  /** Active inventory (formats, Client Needs) for the prefetched field. */
  initialInventory?: SubjectCountsClient | null;
  /** Analytics weak topics — drives badges and default topic selection. */
  weakTopics?: WeakTopicRow[];
  /** Server heatmap for the prefetched field. Same shape as /api/learning/coverage. */
  initialCoverage?: CoverageHeatmap | null;
  initialCoverageFieldId?: string;
  hubStats?: QuestionBankHubStats;
  usmleStepLabel?: string;
  topicCount?: number | null;
  totalQuestions?: number | null;
  /**
   * Servable open remediations for this board. Same roadmap total the dashboard
   * shows. A capped sitting must not replace it.
   */
  boardOpenRemediationCount?: number | null;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { examSlug: clientExamSlug, loading: prefLoading, setExamSlug, refresh: refreshExamPref } =
    useAppPreferences();
  const modeParam = searchParams.get("mode");
  const fieldParam = searchParams.get("field");
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
  const [blueprintAreaId, setBlueprintAreaId] = useState<string | null>(null);
  const explicitSubjectRef = useRef<string | null>(null);
  const [questionCount, setQuestionCount] = useState(25);
  const [bankPace, setBankPace] = useState<QuestionBankPace>("untimed");
  const [bankStyle, setBankStyle] = useState<QuestionBankStyle>(() => {
    const style = searchParams.get("style");
    // Default chip is Adaptive. A remediation deep link is the style for this
    // visit from the first render, before effects read remembered setup.
    if (
      style === "weak_areas" ||
      style === "review_incorrect" ||
      style === "daily_set" ||
      style === "today"
    ) {
      return style;
    }
    return "adaptive";
  });
  // Keep honoring the URL if state is still the remembered/default chip.
  const urlStyle = searchParams.get("style");
  const urlRemediationStyle =
    urlStyle === "weak_areas" || urlStyle === "review_incorrect" || urlStyle === "daily_set"
      ? (urlStyle as QuestionBankStyle)
      : null;
  const effectiveBankStyle = urlRemediationStyle ?? bankStyle;
  const [practiceFormat, setPracticeFormat] = useState<PracticeFormatMode>("all");
  const [adaptiveMeta, setAdaptiveMeta] = useState<AdaptiveSessionMeta | null>(null);
  const [nclexLength, setNclexLength] = useState<NclexTimedVariant>("minimum");
  const [mpjeVariant, setMpjeVariant] = useState<MpjeVariant>("state");
  const [mpjeState, setMpjeState] = useState("");
  const [taskCategory, setTaskCategory] = useState<PanceTaskAreaId | null>(() =>
    parsePanceTaskCategoryParam(searchParams.get("taskCategory"))
  );
  const [loading, setLoading] = useState(false);
  const [checkingRemediation, setCheckingRemediation] = useState(false);
  const [remediationEmpty, setRemediationEmpty] = useState<RemediationMode | null>(() =>
    emptyModeFromLaunchQuery(searchParams.get("launch"))
  );
  const [error, setError] = useState("");
  const [upgradeHref, setUpgradeHref] = useState<string | null>(null);
  const [questions, setQuestions] = useState<RawQuestionInput[] | null>(null);
  const [sessionEpoch, setSessionEpoch] = useState(0);
  const autostartRequested = searchParams.get("autostart") === "1";
  const autostartAttempted = useRef(false);
  const zeroPoolFallbackAppliedRef = useRef(false);
  const fetchGenerationRef = useRef(0);
  const examScopeSeenRef = useRef<string | null>(null);
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
    setCheckingRemediation(false);
    setRemediationEmpty(null);
    setSubjectId("");
    setSessionEpoch((epoch) => epoch + 1);
    autostartAttempted.current = false;
    zeroPoolFallbackAppliedRef.current = false;
  }, []);

  useExamFieldSessionReset(examScopeKey, resetPracticeSession);

  useEffect(() => {
    const prev = examScopeSeenRef.current;
    examScopeSeenRef.current = examScopeKey;
    // First paint with server-seeded counts: keep the launcher visible.
    if (prev === null && initialSubjectCounts) {
      setExamSwitching(false);
      return;
    }
    // Real exam/field change after mount: show switching skeleton briefly.
    if (prev !== null && prev !== examScopeKey) {
      setExamSwitching(true);
    }
  }, [examScopeKey, initialSubjectCounts]);

  const {
    data: subjectCountPayload = null,
    isLoading: countsLoading,
  } = useSubjectCounts(fieldId, {
    initial: initialInventory ?? (
      initialSubjectCounts
        ? {
            counts: initialSubjectCounts,
            total: totalQuestions,
            formats: null,
            topicFormats: null,
            categories: [],
            categoryLabel: null,
            definition: null,
          }
        : null
    ),
    initialFieldId: initialSubjectCountsFieldId ?? null,
  });
  const subjectCounts = subjectCountPayload?.counts ?? null;
  const inventoryTotal = subjectCountPayload?.total;
  const activeTotal =
    typeof inventoryTotal === "number"
      ? inventoryTotal
      : typeof totalQuestions === "number" && initialSubjectCountsFieldId === fieldId
        ? totalQuestions
        : null;
  const activeFormats = subjectCountPayload?.formats ?? null;
  const topicFormats = subjectCountPayload?.topicFormats ?? null;
  const scopeFormats = useMemo(
    () =>
      practiceFormatScopeCounts({
        subjectId,
        formats: activeFormats,
        topicFormats,
      }),
    [activeFormats, subjectId, topicFormats]
  );
  const activeCategories = useMemo(
    () => subjectCountPayload?.categories ?? [],
    [subjectCountPayload]
  );
  const activeCategoryLabel = subjectCountPayload?.categoryLabel ?? null;
  const ngnLabel = ngnStyleLabel(activeCategoryLabel, fieldId);
  const activeDefinition = subjectCountPayload?.definition ?? null;
  const activeTopicCount = subjectCounts
    ? Object.keys(subjectCounts).length
    : initialSubjectCountsFieldId === fieldId
      ? topicCount
      : null;

  useEffect(() => {
    if (!countsLoading) setExamSwitching(false);
  }, [countsLoading, fieldId]);

  const subjects = useMemo(() => getSubjectsForFieldId(fieldId), [fieldId]);
  const bankSubjectIds = useMemo(() => subjects.map((s) => s.id), [subjects]);
  const weakSubjectIds = useMemo(
    () => weakSubjectIdsForField(weakTopics, fieldId, bankSubjectIds),
    [weakTopics, fieldId, bankSubjectIds]
  );
  const coverageQuery = useCoverageHeatmap(fieldId, {
    initial: initialCoverage,
    initialFieldId: initialCoverageFieldId,
  });
  const coverage = coverageQuery.data ?? null;
  const coverageChips = useMemo(() => {
    if (!coverage) return [];
    const ids = new Set(bankSubjectIds);
    return coverage.chips.filter((chip) => ids.has(chip.subjectId));
  }, [coverage, bankSubjectIds]);
  const blueprintAreaCount = useMemo(() => {
    if (!blueprintAreaId) return null;
    const chip = coverageChips.find((row) => row.domainId === blueprintAreaId);
    if (chip) return chip.available;
    const category = activeCategories.find((row) => row.id === blueprintAreaId);
    if (category) return category.count;
    if (subjectCounts) return blueprintAreaCountFromTopics(fieldId, blueprintAreaId, subjectCounts);
    return null;
  }, [activeCategories, blueprintAreaId, coverageChips, fieldId, subjectCounts]);
  const sessionSubjectId = blueprintAreaId || subjectId;
  const sessionCounts = useMemo(
    () =>
      blueprintAreaId && blueprintAreaCount != null
        ? { [blueprintAreaId]: blueprintAreaCount }
        : subjectCounts,
    [blueprintAreaId, blueprintAreaCount, subjectCounts]
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
  const sessionStudyMode = studyModeForQuestionBankLaunch({
    isTimedExam,
    bankStyle: effectiveBankStyle,
    pace: bankPace,
  });

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

      // An explicit practice field in the URL wins for this page, including a
      // board other than the saved exam and a USMLE step other than the default.
      // The saved preference is not rewritten from here.
      if (paramMeta && isPracticeFieldId(paramMeta.id)) {
        setField(paramMeta.label);
        return;
      }

      setField(expectedMeta.label);

      const activeField = fieldParam ?? readBrowserSearchParam("field");
      if (!activeField || activeField !== expectedId) {
        const qs = canonicalizeQuestionBankQuery(
          expectedId,
          practiceUrlSearchParams(searchParams)
        );
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
      resolveWheelCountValue(raw, questionBankCountOptions(fieldId));
    if (countParam) {
      const raw = Number(countParam);
      // Preserve closed-loop retest sizes (5 / 10 / 25) from Deep Dive / miss CTAs.
      setQuestionCount(isRetestSessionCount(raw) ? raw : snapToWheel(raw));
    } else {
      const persisted = readPersistedQuestionBankSetup(fieldId);
      if (persisted?.count) {
        setQuestionCount(snapToWheel(persisted.count));
      } else if (isUsmleFieldId(fieldId)) {
        setQuestionCount(40);
      }
    }

    const paceParam =
      resolvePracticeSearchParam(searchParams, "pace") ??
      (resolvePracticeSearchParam(searchParams, "timed") === "1" ? "timed" : null);
    if (paceParam) {
      setBankPace(parseQuestionBankPace(paceParam));
    } else {
      const persisted = readPersistedQuestionBankSetup(fieldId);
      if (persisted?.pace) {
        setBankPace(persisted.pace);
      } else if (isUsmleFieldId(fieldId)) {
        setBankPace("timed");
      }
    }

    const persisted = readPersistedQuestionBankSetup(fieldId);
    const resolved = resolveQuestionBankStyleAndFormat({
      styleParam: preferredQuestionBankStyleParam(
        searchParams.get("style"),
        readBrowserSearchParam("style")
      ),
      formatParam: resolvePracticeSearchParam(searchParams, "format"),
      persistedStyle: persisted?.style,
      persistedFormat: persisted?.format,
    });
    // Weak-areas deep links clear a remembered NGN/case format here. Leaving
    // that format in place snaps the chip to Standard and launches an NGN set.
    if (resolved.style) setBankStyle(resolved.style);
    if (resolved.format) setPracticeFormat(resolved.format);
  }, [fieldId, isTimedExam, searchParams]);

  const subjectParam = searchParams.get("subjectId");
  const blueprintAreaParam = searchParams.get("blueprintArea");
  const styleParamForSubject = searchParams.get("style");

  useEffect(() => {
    if (isTimedExam) return;
    const list = getSubjectsForFieldId(fieldId);
    if (!list.length) {
      setSubjectId("");
      setBlueprintAreaId(null);
      return;
    }

    const ids = list.map((subject) => subject.id);
    if (
      explicitSubjectRef.current &&
      !subjectIdBelongsToField(fieldId, explicitSubjectRef.current)
    ) {
      explicitSubjectRef.current = null;
    }
    const area =
      blueprintAreaParam && isBlueprintAreaId(fieldId, blueprintAreaParam)
        ? blueprintAreaParam
        : null;
    const subject = resolvePracticeSubjectId({
      fieldId,
      subjectIds: ids,
      subjectParam,
      styleParam: styleParamForSubject,
      explicitSubjectId: subjectParam ? null : explicitSubjectRef.current,
    });
    const urlNamesTopic =
      !!subjectParam &&
      (subjectParam === MIXED_SUBJECT_ID ||
        subjectParam === "mixed" ||
        ids.includes(subjectParam));
    // A blueprint area is an explicit pick. It does not also select the
    // lead topic. A topic in the URL wins over the area.
    if (area && !urlNamesTopic && !explicitSubjectRef.current) {
      setBlueprintAreaId(area);
      setSubjectId("");
      return;
    }
    setBlueprintAreaId(null);
    setSubjectId(subject);
  }, [blueprintAreaParam, fieldId, isTimedExam, styleParamForSubject, subjectParam]);

  useEffect(() => {
    zeroPoolFallbackAppliedRef.current = false;
  }, [fieldId]);

  // When counts first load, move off a zero-count topic (once per field visit).
  useEffect(() => {
    if (isTimedExam || countsLoading || !subjectCounts || zeroPoolFallbackAppliedRef.current) {
      return;
    }
    // Review incorrect is board-scoped. A zero topic pool must not retarget
    // the queue onto the first inventory subject — that hides misses stored
    // on a later topic and the server then renders an empty queue.
    const browserStyle = readBrowserSearchParam("style");
    const styleParam = resolvePracticeSearchParam(searchParams, "style");
    if (
      browserStyle === "review_incorrect" ||
      styleParam === "review_incorrect" ||
      effectiveBankStyle === "review_incorrect"
    ) {
      return;
    }
    // Subject state is still "" on the frame before the URL subject is applied.
    // Treating that as a zero pool consumes this one-shot and overwrites
    // __mixed__ with the first topic that has inventory.
    if (!subjectId) return;

    // A stripped stale subject lands on all topics. Do not replace that with
    // the first domain that has inventory and write it back into the URL.
    if (isMixedSubjectId(subjectId) && !resolveSubjectParam(searchParams)) return;

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
  }, [
    isTimedExam,
    countsLoading,
    subjectCounts,
    subjectId,
    fieldId,
    searchParams,
    effectiveBankStyle,
  ]);

  // Snap count to a valid 25 / 50 / 75 preset for the current topic pool.
  // Keep short retest counts (5 / 10 / 25) when the pool can still fill them.
  useEffect(() => {
    if (isTimedExam || countsLoading) return;
    if (practiceFormat === "ngn" || practiceFormat === "case") {
      // Remediation deep links cannot ride an NGN/case set. Drop the format
      // instead of rewriting the link to Standard. Check the address bar too:
      // state can still be the default Adaptive on the hydrate frame.
      const browserStyle = readBrowserSearchParam("style");
      const remediationStyle =
        browserStyle === "weak_areas" || browserStyle === "review_incorrect"
          ? browserStyle
          : effectiveBankStyle === "weak_areas" || effectiveBankStyle === "review_incorrect"
            ? effectiveBankStyle
            : null;
      if (remediationStyle) {
        if (bankStyle !== remediationStyle) setBankStyle(remediationStyle);
        setPracticeFormat("all");
        syncPracticeUrl({ format: "all", style: remediationStyle });
        return;
      }
      const pool = practiceFormatPoolCount(practiceFormat, scopeFormats);
      const options = practiceFormatCountOptions(pool);
      if (options.length === 0) return;
      setQuestionCount((current) => {
        const resolved = resolveWheelCountValue(current, options);
        if (resolved !== current || bankStyle !== "standard") {
          syncPracticeUrl({
            count: resolved,
            format: practiceFormat,
            style: "standard",
          });
        }
        return resolved;
      });
      if (bankStyle !== "standard") setBankStyle("standard");
      return;
    }
    const poolSubjectId = blueprintAreaId || subjectId;
    const poolCounts = blueprintAreaId
      ? blueprintAreaCount == null
        ? null
        : { [blueprintAreaId]: blueprintAreaCount }
      : subjectCounts;
    if (!poolCounts || !poolSubjectId) return;
    const max = availableQuestionCount(poolSubjectId, poolCounts);
    if (max === null || max <= 0) return;
    setQuestionCount((current) => {
      if (isRetestSessionCount(current) && max >= current) return current;
      const options = questionBankCountOptionsForAvailable(max, fieldId);
      if (options.length === 0) return current;
      const resolved = resolveWheelCountValue(current, options);
      if (resolved !== current) {
        syncPracticeUrl({ count: resolved });
      }
      return resolved;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, blueprintAreaId, blueprintAreaCount, fieldId, subjectCounts, countsLoading, isTimedExam, practiceFormat, scopeFormats, bankStyle, effectiveBankStyle]);

  // A weak-areas link that also carries format=ngn|case would otherwise stay
  // on that format in the address bar. Clear it once a topic is known.
  useEffect(() => {
    if (isTimedExam || !subjectId) return;
    const styleParam = resolvePracticeSearchParam(searchParams, "style");
    const formatParam = resolvePracticeSearchParam(searchParams, "format");
    const remediationStyle = preferredQuestionBankStyleParam(
      styleParam,
      readBrowserSearchParam("style")
    );
    if (remediationStyle !== "weak_areas" && remediationStyle !== "review_incorrect") return;
    if (formatParam !== "ngn" && formatParam !== "case") return;
    syncPracticeUrl({ style: remediationStyle, format: "all" });
    // syncPracticeUrl is recreated each render; this effect follows the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimedExam, subjectId, searchParams]);

  useEffect(() => {
    if (isTimedExam || !subjectId) return;
    writePersistedQuestionBankSetup(fieldId, {
      subjectId,
      count: questionCount,
      pace: bankPace,
      style: stylePreservedForPracticeUrl({
        stateStyle: bankStyle,
        browserStyle: readBrowserSearchParam("style"),
      }),
      taskCategory: isPance ? taskCategory : null,
      format: practiceFormat,
    });
  }, [fieldId, isTimedExam, subjectId, questionCount, bankPace, bankStyle, isPance, taskCategory, practiceFormat]);

  function syncPracticeUrl(overrides?: {
    mpjeVariant?: MpjeVariant;
    mpjeState?: string;
    subjectId?: string | null;
    blueprintAreaId?: string | null;
    count?: number;
    pace?: QuestionBankPace;
    style?: QuestionBankStyle;
    taskCategory?: PanceTaskAreaId | null;
    format?: PracticeFormatMode;
    /** Skip Next.js navigation so an in-flight session is not unmounted by Suspense. */
    historyOnly?: boolean;
  }) {
    const resolvedVariant = overrides?.mpjeVariant ?? mpjeVariant;
    const resolvedState = overrides?.mpjeState ?? mpjeState;
    const subjectProvided = overrides != null && "subjectId" in overrides;
    const areaProvided = overrides != null && "blueprintAreaId" in overrides;
    const browserArea = readBrowserSearchParam("blueprintArea");
    const resolvedArea = areaProvided
      ? overrides?.blueprintAreaId || null
      : browserArea && isBlueprintAreaId(fieldId, browserArea)
        ? browserArea
        : blueprintAreaId;
    const resolvedSubjectId = subjectIdForPracticeUrl({
      fieldId,
      overrideProvided: subjectProvided,
      override: overrides?.subjectId,
      browserSubjectId: readBrowserSubjectParam(),
      blueprintAreaId: resolvedArea,
    });

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
    const resolvedTaskCategory =
      overrides?.taskCategory !== undefined ? overrides.taskCategory : taskCategory;
    const href = buildBankPracticeUrl(
      {
        fieldId,
        subjectId: resolvedSubjectId,
        blueprintAreaId: resolvedArea,
        count: overrides?.count ?? questionCount,
        pace: overrides?.pace ?? bankPace,
        style: stylePreservedForPracticeUrl({
          stateStyle: effectiveBankStyle,
          overrideStyle: overrides?.style,
          browserStyle: readBrowserSearchParam("style"),
        }),
        format: overrides?.format ?? practiceFormat,
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
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== href) {
        window.history.replaceState(window.history.state, "", href);
      }
      if (overrides?.historyOnly) return;
    }
    router.replace(href, { scroll: false });
  }

  function rememberLaunchOutcome(mode: RemediationMode | null) {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (mode) url.searchParams.set("launch", launchQueryForEmpty(mode));
    else url.searchParams.delete("launch");
    const next = `${url.pathname}${url.search}`;
    window.history.replaceState(window.history.state, "", next);
  }

  function expectExactSessionCount(received: number, expected: number) {
    assertExactQuestionCount(received, expected);
  }

  async function fetchJson(
    url: string,
    body: unknown,
    timeoutMs: number
  ): Promise<{
    ok: boolean;
    status: number;
    data: Record<string, unknown>;
    openQueueTotal: number | null;
  }> {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      const headerTotal = Number(res.headers.get("x-review-open-total"));
      return {
        ok: res.ok,
        status: res.status,
        data,
        openQueueTotal: Number.isFinite(headerTotal) ? headerTotal : null,
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("This is taking too long. Check your connection and try again.");
      }
      throw error;
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function start() {
    const activeStyle = effectiveBankStyle;
    if (isMpje || !isTimedExam) syncPracticeUrl({ historyOnly: true });

    const deliberateFormat = deliberateFormatForLaunch(activeStyle, practiceFormat);
    // A blueprint-area chip is its own pool. Format and style filters would
    // serve a different set than the count on the chip.
    const areaSession = Boolean(blueprintAreaId);
    if (!isTimedExam) {
      const validation =
        deliberateFormat && !areaSession
          ? validatePracticeFormatSession({
              format: deliberateFormat,
              questionCount,
              formats: scopeFormats,
              bankStyle: "standard",
              ngnLabel,
              subjectId,
            })
          : validateQuestionBankSession({
              subjectId: sessionSubjectId,
              questionCount,
              subjectCounts: sessionCounts,
              bankStyle: areaSession ? "standard" : activeStyle,
              taskCategory: isPance ? taskCategory : null,
            });
      if (!validation.ok) {
        setError(validation.message ?? "Cannot start this session.");
        return;
      }
    }

    const generation = ++fetchGenerationRef.current;
    const isStale = () => generation !== fetchGenerationRef.current;

    const remediationMode: RemediationMode | null =
      !isTimedExam && (activeStyle === "review_incorrect" || activeStyle === "weak_areas")
        ? activeStyle
        : null;
    if (remediationMode) {
      setCheckingRemediation(true);
    } else {
      setLoading(true);
    }
    setError("");
    setUpgradeHref(null);
    setQuestions(null);
    setAdaptiveMeta(null);
    setSessionEpoch((epoch) => epoch + 1);
    try {
      const limit = isTimedExam
        ? timedCount
        : deliberateFormat !== null
          ? questionCount
          : resolveQuestionBankSessionCount(
              questionCount,
              availableQuestionCount(sessionSubjectId, sessionCounts)
            );

      if (!isTimedExam && deliberateFormat && !blueprintAreaId) {
        const qs = buildDeliberateFormatQuestionQuery({
          fieldId,
          subjectId,
          format: deliberateFormat,
          limit,
        });
        if (!qs) {
          throw new Error(
            deliberateFormat === "case"
              ? "Pick one topic for this case set."
              : `Pick one topic for this ${ngnLabel} set.`
          );
        }
        const res = await fetch(`/api/questions?${qs.toString()}`);
        const data = await res.json();
        if (!res.ok) {
          setUpgradeHref(typeof data.upgradeUrl === "string" ? data.upgradeUrl : null);
          throw new Error(studyLimitMessage(data) || data.error || "Could not load this format set");
        }
        if (data.practiceFormat !== deliberateFormat) {
          throw new Error("This set was not limited to the selected format.");
        }
        const metaIds = (data.bankItemIds as string[] | undefined) ?? [];
        const subjectIds = (data.subjectIds as Array<string | null> | undefined) ?? [];
        const raw = (
          data.questions as Array<ExamQuestion & { subjectId?: string; bankItemId?: string }>
        ).map((q, i) => ({
          ...q,
          id: i + 1,
          field,
          subjectId: subjectIds[i] || q.subjectId || MIXED_SUBJECT_ID,
          bankItemId: metaIds[i] ?? q.bankItemId ?? `bank-${fieldId}-${i}`,
        }));
        if (raw.length === 0) {
          throw new Error(
            deliberateFormat === "case"
              ? "No published case items were available for this set."
              : `No published ${ngnLabel} items were available for this set.`
          );
        }
        expectExactSessionCount(raw.length, limit);
        if (isStale()) return;
        setQuestions(raw);
        return;
      }

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

      const useArea = Boolean(blueprintAreaId);
      const useAdaptive =
        !useArea && (activeStyle === "adaptive" || activeStyle === "weak_areas");
      const useReviewIncorrect = !useArea && activeStyle === "review_incorrect";
      const useToday = !useArea && activeStyle === "today";
      const useDailySet = !useArea && activeStyle === "daily_set";
      const effectiveSubjectId = useReviewIncorrect
        ? reviewSubjectForLaunch(subjectId)
        : subjectId || subjects[0]?.id || MIXED_SUBJECT_ID || "";
      if (!useArea && !useToday && !useDailySet && !effectiveSubjectId) {
        throw new Error("Choose a topic before starting practice.");
      }

      if (useDailySet) {
        const stashed = takeDailySet(fieldId);
        if (stashed) {
          const prepared = stashed.questions as {
            stem?: string;
            question?: string;
            options?: string[];
            correctAnswers?: string[];
            correctAnswer?: string;
            explanation?: string;
            subjectId?: string;
            bankItemId?: string;
            id?: string;
            type?: string;
            vignette?: string;
            tags?: string[];
          }[];
          const raw: RawQuestionInput[] = prepared.map((q, i) => ({
            id: i + 1,
            question: q.question || q.stem || "",
            options: q.options ?? [],
            correctAnswer: q.correctAnswer || (q.correctAnswers ?? []).join(", "),
            explanation: q.explanation ?? "",
            field,
            subjectId: q.subjectId ?? MIXED_SUBJECT_ID,
            bankItemId: q.bankItemId ?? stashed.bankItemIds[i] ?? q.id,
            type: (q.type as RawQuestionInput["type"]) ?? "multiple_choice",
            vignette: q.vignette,
            tags: q.tags,
          }));
          setAdaptiveMeta({
            sessionRationale:
              typeof stashed.mixLine === "string" && stashed.mixLine
                ? `Today's set — ${stashed.mixLine}.`
                : "Today's set — review first, then new questions.",
            todaySet: stashed.todaySet,
          });
          if (isStale()) return;
          setQuestions(raw);
          return;
        }

        const res = await fetch("/api/study/daily-set", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ field: fieldId }),
        });
        const data = await res.json();
        if (!res.ok) {
          setUpgradeHref(typeof data.upgradeUrl === "string" ? data.upgradeUrl : null);
          throw new Error(studyLimitMessage(data) || data.error || "Could not build today's set");
        }
        type DailyQ = {
          stem?: string;
          question?: string;
          options?: string[];
          correctAnswers?: string[];
          correctAnswer?: string;
          explanation?: string;
          subjectId?: string;
          bankItemId?: string;
          id?: string;
          type?: string;
          vignette?: string;
          tags?: string[];
        };
        const prepared = (data.questions as DailyQ[] | undefined) ?? [];
        if (prepared.length === 0) {
          throw new Error(data.error || "No questions ready for this board yet.");
        }
        const raw: RawQuestionInput[] = prepared.map((q, i) => ({
          id: i + 1,
          question: q.question || q.stem || "",
          options: q.options ?? [],
          correctAnswer: q.correctAnswer || (q.correctAnswers ?? []).join(", "),
          explanation: q.explanation ?? "",
          field,
          subjectId: q.subjectId ?? MIXED_SUBJECT_ID,
          bankItemId: q.bankItemId ?? (data.bankItemIds as string[] | undefined)?.[i] ?? q.id,
          type: (q.type as RawQuestionInput["type"]) ?? "multiple_choice",
          vignette: q.vignette,
          tags: q.tags,
        }));
        setAdaptiveMeta({
          sessionRationale:
            typeof data.mixLine === "string" && data.mixLine
              ? `Today's set — ${data.mixLine}.`
              : "Today's set — review first, then new questions.",
          todaySet: data.todaySet,
        });
        if (isStale()) return;
        setQuestions(raw);
        return;
      }

      if (useToday) {
        const slug = examSlugFromFieldId(fieldId);
        const todayExamSlug =
          fieldId === "pharmacy" || slug === "naplex"
            ? "naplex"
            : slug === "usmle" || isUsmleFieldId(fieldId)
              ? "usmle"
              : "nclex";
        const res = await fetch("/api/study/today", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            size: limit === 20 || limit === 60 ? limit : 40,
            examSlug: todayExamSlug,
            fieldId: todayExamSlug === "usmle" ? fieldId : undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setUpgradeHref(typeof data.upgradeUrl === "string" ? data.upgradeUrl : null);
          throw new Error(
            studyLimitMessage(data) || data.error || "Could not build Today set"
          );
        }
        type TodayQ = {
          id: string;
          stem: string;
          options: string[];
          correctAnswers: string[];
          explanation: string;
          subjectId?: string;
          bankItemId?: string;
          type?: string;
          vignette?: string;
          tags?: string[];
        };
        const prepared = (data.questions as TodayQ[] | undefined) ?? [];
        if (prepared.length === 0) {
          throw new Error("No questions available for Today yet.");
        }
        const raw: RawQuestionInput[] = prepared.map((q, i) => ({
          id: i + 1,
          question: q.stem,
          options: q.options,
          correctAnswer: (q.correctAnswers ?? []).join(", "),
          explanation: q.explanation,
          field,
          subjectId: q.subjectId ?? MIXED_SUBJECT_ID,
          bankItemId: q.bankItemId ?? q.id,
          type: (q.type as RawQuestionInput["type"]) ?? "multiple_choice",
          vignette: q.vignette,
          tags: q.tags,
        }));
        setAdaptiveMeta({
          sessionRationale:
            todayExamSlug === "naplex"
              ? `NAPLEX Today — ${raw.length} items weighted to the 2025 Content Outline (Domain 3 heaviest).`
              : todayExamSlug === "usmle"
                ? `USMLE Today — ${raw.length} items across your organ-system Skill Cells.`
                : `Today’s Mastery set — ${raw.length} items across your Skill Cells.`,
          questionReasoning: Object.fromEntries(
            raw.map((q) => [
              String(q.id),
              todayExamSlug === "naplex"
                ? "Queued by NAPLEX Mastery Engine for today’s focus."
                : todayExamSlug === "usmle"
                  ? "Queued by USMLE Mastery Engine for today’s organ-system focus."
                  : "Queued by Mastery Engine for today’s focus.",
            ])
          ),
        });
        if (isStale()) return;
        setQuestions(raw);
        return;
      }

      if (useReviewIncorrect) {
        // Send the canonical field id. The visible label (NAPLEX) is not the
        // attempt field (pharmacy); querying the label misses the saved miss.
        const reviewField = fieldId || field;
        let reviewSubject = effectiveSubjectId;
        let preflight = await fetchJson(
          "/api/study/review-incorrect",
          { field: reviewField, subjectId: reviewSubject, count: limit, preflight: true },
          8000
        );
        let decision = decisionFromRemediationPayload({
          mode: "review_incorrect",
          ok: preflight.ok,
          requestedCount: limit,
          body: preflight.data,
        });
        if (
          decision.status === "empty" &&
          reviewSubject !== MIXED_SUBJECT_ID
        ) {
          reviewSubject = MIXED_SUBJECT_ID;
          preflight = await fetchJson(
            "/api/study/review-incorrect",
            { field: reviewField, subjectId: reviewSubject, count: limit, preflight: true },
            8000
          );
          decision = decisionFromRemediationPayload({
            mode: "review_incorrect",
            ok: preflight.ok,
            requestedCount: limit,
            body: preflight.data,
          });
        }
        if (decision.status === "empty") {
          setRemediationEmpty("review_incorrect");
          rememberLaunchOutcome("review_incorrect");
          return;
        }
        setRemediationEmpty(null);
        rememberLaunchOutcome(null);
        if (decision.status === "error") {
          throw new Error(decision.message);
        }
        const launched = await fetchJson(
          "/api/study/review-incorrect",
          { field: reviewField, subjectId: reviewSubject, count: decision.count },
          20000
        );
        if (!launched.ok) {
          setUpgradeHref(
            typeof launched.data.upgradeUrl === "string" ? launched.data.upgradeUrl : null
          );
          const followup = decisionFromRemediationPayload({
            mode: "review_incorrect",
            ok: false,
            requestedCount: decision.count,
            body: launched.data,
          });
          throw new Error(
            followup.status === "error"
              ? followup.message
              : "Could not build review-incorrect session"
          );
        }
        const launchedDecision = decisionFromRemediationPayload({
          mode: "review_incorrect",
          ok: true,
          requestedCount: decision.count,
          body: launched.data,
        });
        if (launchedDecision.status === "empty") {
          setRemediationEmpty("review_incorrect");
          rememberLaunchOutcome("review_incorrect");
          return;
        }
        const metaIds = (launched.data.bankItemIds as string[] | undefined) ?? [];
        const raw = ((launched.data.questions as ExamQuestion[] | undefined) ?? []).map((q, i) => ({
          ...q,
          id: i + 1,
          field,
          subjectId: (launched.data.subjectId as string | undefined) ?? effectiveSubjectId,
          bankItemId: metaIds[i] ?? `bank-${fieldId}-${i}`,
        }));
        if (raw.length === 0) {
          throw new Error("Review incorrect did not return any questions. Try again.");
        }
        const openQueueTotal = resolveReviewOpenQueueTotal({
          sittingSize: raw.length,
          boardOpenTotal: unscopedReviewSubject(reviewSubject) ? boardOpenRemediationCount : null,
          preflightAvailable: decision.status === "launch" ? decision.available : null,
          payloads: [preflight.data, launched.data],
          headerTotals: [preflight.openQueueTotal, launched.openQueueTotal],
        });
        const openLine = "Open remediation — a single correct does not clear this item.";
        setAdaptiveMeta({
          openQueueTotal,
          sessionRationale: reviewIncorrectSessionRationale({
            sittingSize: raw.length,
            openTotal: openQueueTotal,
          }),
          questionReasoning: Object.fromEntries(
            raw.flatMap((q) => {
              const pairs: [string, string][] = [[String(q.id), openLine]];
              if (q.bankItemId) pairs.push([q.bankItemId, openLine]);
              return pairs;
            })
          ),
        });
        if (isStale()) return;
        rememberLaunchOutcome(null);
        setQuestions(raw);
        return;
      }

      if (useAdaptive) {
        const studyMode = activeStyle === "weak_areas" ? "weak_area" : "adaptive";
        if (activeStyle === "weak_areas") {
          const preflight = await fetchJson(
            "/api/study/adaptive/next",
            {
              field,
              subjectId: effectiveSubjectId,
              count: limit,
              currentDifficulty: "medium",
              studyMode,
              preflight: true,
            },
            8000
          );
          const decision = decisionFromRemediationPayload({
            mode: "weak_areas",
            ok: preflight.ok,
            requestedCount: limit,
            body: preflight.data,
          });
          if (decision.status === "empty") {
            setRemediationEmpty("weak_areas");
            rememberLaunchOutcome("weak_areas");
            return;
          }
          if (decision.status === "error") {
            throw new Error(decision.message);
          }
        }
        const controller = new AbortController();
        const timer = window.setTimeout(
          () => controller.abort(),
          activeStyle === "weak_areas" ? 20_000 : 60_000
        );
        let res: Response;
        try {
          res = await fetch("/api/study/adaptive/next", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            field,
            subjectId: effectiveSubjectId,
            count: limit,
            currentDifficulty: "medium",
            studyMode,
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
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            throw new Error("This is taking too long. Check your connection and try again.");
          }
          throw error;
        } finally {
          window.clearTimeout(timer);
        }
        const data = await res.json();
        if (activeStyle === "weak_areas") {
          const followup = decisionFromRemediationPayload({
            mode: "weak_areas",
            ok: res.ok,
            requestedCount: limit,
            body: data as Record<string, unknown>,
          });
          if (followup.status === "empty") {
            setRemediationEmpty("weak_areas");
            rememberLaunchOutcome("weak_areas");
            return;
          }
          if (!res.ok && followup.status === "error") {
            setUpgradeHref(typeof data.upgradeUrl === "string" ? data.upgradeUrl : null);
            throw new Error(followup.message);
          }
        }
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
        if (activeStyle !== "weak_areas") {
          expectExactSessionCount(raw.length, limit);
        }
        rememberLaunchOutcome(null);
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
      if (blueprintAreaId) qs.set("blueprintArea", blueprintAreaId);
      else qs.set("subjectId", effectiveSubjectId);
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
      if (!isStale()) {
        setLoading(false);
        setCheckingRemediation(false);
      }
    }
  }

  useEffect(() => {
    autostartAttempted.current = false;
  }, [searchParams]);

  useEffect(() => {
    setRemediationEmpty(emptyModeFromLaunchQuery(searchParams.get("launch")));
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
    if (
      !shouldAutostartPractice({
        autostart: autostartRequested,
        launch: searchParams.get("launch"),
        hasQuestions: Boolean(questions),
        loading,
      })
    ) {
      return;
    }
    if (autostartAttempted.current) return;
    // A remembered Adaptive chip must not launch before the URL style is applied.
    const launchStyle = preferredQuestionBankStyleParam(
      searchParams.get("style"),
      readBrowserSearchParam("style")
    );
    if (!bankStyleHonorsLaunchStyle(effectiveBankStyle, launchStyle)) return;
    if (
      !isTimedExam &&
      !subjectId &&
      !blueprintAreaId &&
      effectiveBankStyle !== "today" &&
      effectiveBankStyle !== "daily_set"
    ) {
      return;
    }
    autostartAttempted.current = true;
    document.getElementById("practice-launcher")?.scrollIntoView({ behavior: "smooth", block: "start" });
    void start();
  }, [
    autostartRequested,
    isTimedExam,
    subjectId,
    blueprintAreaId,
    bankStyle,
    effectiveBankStyle,
    questions,
    loading,
    searchParams,
  ]);

  const launchFormat = deliberateFormatForLaunch(effectiveBankStyle, practiceFormat);

  const bankSessionValidation = useMemo(
    () =>
      isTimedExam
        ? { ok: true as const }
        : launchFormat && !blueprintAreaId
          ? validatePracticeFormatSession({
              format: launchFormat,
              questionCount,
              formats: scopeFormats,
              bankStyle: "standard",
              ngnLabel,
              subjectId,
            })
          : validateQuestionBankSession({
              subjectId: sessionSubjectId,
              questionCount,
              subjectCounts: sessionCounts,
              bankStyle: blueprintAreaId ? "standard" : effectiveBankStyle,
              taskCategory: isPance ? taskCategory : null,
            }),
    [
      isTimedExam,
      launchFormat,
      blueprintAreaId,
      sessionSubjectId,
      subjectId,
      questionCount,
      sessionCounts,
      effectiveBankStyle,
      isPance,
      taskCategory,
      scopeFormats,
      ngnLabel,
    ]
  );

  const previewTopicLabel = useMemo(() => {
    if (isTimedExam) return `${field} · Timed exam simulation`;
    if (launchFormat) {
      const topic = isMixedSubjectId(subjectId)
        ? MIXED_SUBJECT_LABEL
        : subjects.find((s) => s.id === subjectId)?.label ?? "Choose a topic";
      return `${practiceFormatTitle(launchFormat, ngnLabel)} · ${topic}`;
    }
    const areaLabel = blueprintAreaId ? blueprintAreaLabel(fieldId, blueprintAreaId) : null;
    const base = areaLabel
      ? areaLabel
      : isMixedSubjectId(subjectId)
        ? MIXED_SUBJECT_LABEL
        : subjectId === OTHER_OPEN_SUBJECT_ID
          ? "Other"
          : subjects.find((s) => s.id === subjectId)?.label ?? "Question bank";
    return isPance ? sessionLabelWithTask(base, taskCategory) : base;
  }, [blueprintAreaId, field, fieldId, isTimedExam, launchFormat, ngnLabel, subjectId, subjects, isPance, taskCategory]);

  const previewAvailableCount = useMemo(() => {
    if (isTimedExam) return null;
    if (launchFormat) {
      return practiceFormatPoolCount(launchFormat, scopeFormats);
    }
    return availableQuestionCount(sessionSubjectId, sessionCounts);
  }, [isTimedExam, launchFormat, scopeFormats, sessionCounts, sessionSubjectId]);

  const previewEstimatedMinutes = useMemo(
    () => estimateQuestionBankSessionMinutes(questionCount, bankPace),
    [questionCount, bankPace]
  );

  const remediationStyle =
    effectiveBankStyle === "review_incorrect" || effectiveBankStyle === "weak_areas";
  const blockSessionSkeleton = reviewIncorrectBlocksSessionSkeleton({
    bankStyle: effectiveBankStyle,
    styleParam: searchParams.get("style"),
  });
  if (
    !questions &&
    !blockSessionSkeleton &&
    ((loading && !remediationStyle) || examSwitching)
  ) {
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
    const formatTitle = launchFormat ? practiceFormatTitle(launchFormat, ngnLabel) : null;
    const title =
      effectiveBankStyle === "daily_set"
        ? "Today's set"
        : isTimedExam
      ? `${field}${mpjeScope} · Timed exam · ${questions.length} questions`
      : `${field}${mpjeScope} · ${
          formatTitle ? `${formatTitle} · ${scopedTopicLabel}` : scopedTopicLabel
        } · ${questions.length} questions · ${
          effectiveBankStyle === "adaptive"
            ? "Adaptive practice"
            : effectiveBankStyle === "weak_areas"
              ? "Weak areas"
              : effectiveBankStyle === "review_incorrect"
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
          practiceFormat={launchFormat ?? undefined}
          reviewQueue={effectiveBankStyle === "review_incorrect"}
          title={title}
          adaptiveMeta={adaptiveMeta ?? undefined}
          timedSessionSeconds={timedSessionSeconds}
          returnTo={topicReturnTo ?? undefined}
        />
      </div>
    );
  }

  function applyFormatEmptyAction(action: PracticeFormatEmptyGuidance["action"]) {
    if (action === "mixed") {
      explicitSubjectRef.current = MIXED_SUBJECT_ID;
      setBlueprintAreaId(null);
      setSubjectId(MIXED_SUBJECT_ID);
      if (bankStyle !== "standard") setBankStyle("standard");
      syncPracticeUrl({
        subjectId: MIXED_SUBJECT_ID,
        blueprintAreaId: null,
        style: "standard",
      });
      return;
    }
    setPracticeFormat("all");
    syncPracticeUrl({ format: "all" });
  }

  const formatEmptyGuidance =
    !isTimedExam && launchFormat && !blueprintAreaId && !countsLoading
      ? (() => {
          const scopeCount = practiceFormatPoolCount(launchFormat, scopeFormats);
          const boardCount = practiceFormatPoolCount(launchFormat, activeFormats);
          if (scopeCount == null || boardCount == null || scopeCount > 0) return null;
          return practiceFormatEmptyGuidance({
            format: launchFormat,
            subjectId,
            scopeCount,
            boardCount,
            ngnLabel,
            fieldId,
          });
        })()
      : null;

  function launchPracticeMode(modeId: PracticeModeId) {
    const href = practiceModeLaunchHref(fieldId as PracticeFieldId, modeId, practiceBase);
    router.push(href);
  }

  const activeMode = EXAM_MODES.find((m) => m.id === practiceMode);
  const activeExamOption = EXAM_FIELD_OPTIONS.find((opt) => opt.id === fieldId);
  const pageExamSlug = examSlugFromFieldId(fieldId) ?? effectiveExamSlug ?? null;
  const pageExam = pageExamSlug ? EXAM_CATALOG[pageExamSlug] : null;

  const previewTimedMinutes =
    typeof timedSessionSeconds === "number" ? Math.ceil(timedSessionSeconds / 60) : undefined;

  const canStartBank =
    !isTimedExam &&
    (launchFormat != null || !!subjectId) &&
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

      {onQuestionBank && examLocked && pageExam ? (
        <QuestionBankHeader
          examName={pageExam.shortName}
          usmleStepLabel={usmleStepLabel}
          practiceMode={practiceMode}
          topicCount={activeTopicCount}
          totalQuestions={activeTotal}
          formats={activeFormats}
          categories={activeCategories}
          categoryLabel={activeCategoryLabel}
          activeDefinition={activeDefinition}
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

          {examLocked && pageExamSlug === "usmle" ? (
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
                disabled={effectiveBankStyle !== "standard"}
                onTaskCategoryChange={(next) => {
                  if (effectiveBankStyle !== "standard") {
                    setBankStyle("standard");
                  }
                  setTaskCategory(next);
                  syncPracticeUrl({ taskCategory: next, style: "standard" });
                }}
                onFeaturedSelect={(next, count) => {
                  const max = availableQuestionCount(subjectId, subjectCounts);
                  const options =
                    max != null && max > 0
                      ? questionBankCountOptionsForAvailable(max, fieldId)
                      : questionBankCountOptions(fieldId);
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
              {effectiveBankStyle !== "standard" ? (
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
              fieldId={fieldId}
              examLabel={pageExam?.shortName ?? activeExamOption?.label}
              onSubjectChange={(id) => {
                explicitSubjectRef.current = id;
                setBlueprintAreaId(null);
                setSubjectId(id);
                if (
                  isMixedSubjectId(id) &&
                  effectiveBankStyle !== "standard" &&
                  effectiveBankStyle !== "review_incorrect"
                ) {
                  setBankStyle("standard");
                  syncPracticeUrl({ subjectId: id, blueprintAreaId: null, style: "standard" });
                  return;
                }
                syncPracticeUrl({ subjectId: id, blueprintAreaId: null });
              }}
              blueprintAreaId={blueprintAreaId}
              onBlueprintAreaSelect={(areaId) => {
                explicitSubjectRef.current = null;
                setBlueprintAreaId(areaId);
                setSubjectId("");
                if (bankStyle !== "standard") setBankStyle("standard");
                if (practiceFormat !== "all") setPracticeFormat("all");
                syncPracticeUrl({
                  subjectId: null,
                  blueprintAreaId: areaId,
                  style: "standard",
                  format: "all",
                });
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
              bankStyle={effectiveBankStyle}
              onBankStyleChange={(s) => {
                setBankStyle(s);
                syncPracticeUrl({ style: s });
              }}
              weakSubjectIds={weakSubjectIds}
              coverageChips={coverageChips}
              coverageLabel={coverage?.domainsLabel ?? "Blueprint topics"}
              coverageLoaded={coverage != null}
              countsLoading={countsLoading}
              practiceFormat={practiceFormat}
              formats={scopeFormats}
              boardFormats={activeFormats}
              totalActive={activeTotal}
              ngnLabel={ngnLabel}
              onPracticeAllQuestions={() => applyFormatEmptyAction("all")}
              onPracticeMixedTopics={() => applyFormatEmptyAction("mixed")}
              onPracticeFormatChange={(next) => {
                const pool = practiceFormatPoolCount(next, scopeFormats);
                const options = practiceFormatCountOptions(pool);
                const resolved =
                  next === "all" || options.length === 0
                    ? questionCount
                    : resolveWheelCountValue(questionCount, options);
                const style = next === "all" ? effectiveBankStyle : "standard";
                setPracticeFormat(next);
                setQuestionCount(resolved);
                if (style !== bankStyle) setBankStyle(style);
                writePersistedQuestionBankSetup(fieldId, {
                  subjectId,
                  count: resolved,
                  pace: bankPace,
                  style,
                  taskCategory: isPance ? taskCategory : null,
                  format: next,
                });
                syncPracticeUrl({
                  format: next,
                  count: resolved,
                  style,
                });
              }}
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

          {checkingRemediation && !remediationEmpty ? (
            <p role="status" className="text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
              Checking {effectiveBankStyle === "review_incorrect" ? "incorrect items" : "weak areas"}…
            </p>
          ) : null}

          {remediationEmpty ? (
            <RemediationLaunchNotice
              mode={remediationEmpty}
              fieldId={fieldId}
              subjectId={subjectId}
              onStartStandard={() => {
                setRemediationEmpty(null);
                setBankStyle("standard");
                rememberLaunchOutcome(null);
                syncPracticeUrl({ style: "standard" });
              }}
              onPracticeMixed={() => {
                setRemediationEmpty(null);
                setBankStyle("standard");
                setSubjectId(MIXED_SUBJECT_ID);
                rememberLaunchOutcome(null);
                syncPracticeUrl({ subjectId: MIXED_SUBJECT_ID, style: "standard" });
              }}
            />
          ) : null}

          {error ? (
            <div className="space-y-3">
              <InlineError>{error}</InlineError>
              {remediationStyle ? (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="secondary"
                    className="!rounded-full"
                    onClick={() => void start()}
                  >
                    Try again
                  </Button>
                </div>
              ) : null}
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
            bankStyle={effectiveBankStyle}
            estimatedMinutes={previewEstimatedMinutes}
            availableCount={previewAvailableCount}
            validationMessage={bankSessionValidation.ok ? undefined : bankSessionValidation.message}
            suggestMixed={Boolean(
              !bankSessionValidation.ok &&
                "suggestMixed" in bankSessionValidation &&
                bankSessionValidation.suggestMixed
            )}
            onTryMixed={() => {
              setSubjectId(MIXED_SUBJECT_ID);
              if (effectiveBankStyle !== "standard" && effectiveBankStyle !== "review_incorrect") {
                setBankStyle("standard");
              }
              syncPracticeUrl({ subjectId: MIXED_SUBJECT_ID, style: "standard" });
            }}
            loading={loading || countsLoading}
            disabled={!(canStartBank || canStartTimed)}
            onStart={() => void start()}
            emptyNotice={
              formatEmptyGuidance
                ? {
                    title: formatEmptyGuidance.title,
                    actionLabel: formatEmptyGuidance.actionLabel,
                    onAction: () => applyFormatEmptyAction(formatEmptyGuidance.action),
                  }
                : null
            }
            isTimedExam={isTimedExam}
            timedCount={timedCount}
            timedMinutes={previewTimedMinutes}
          />
    </div>
  );
}
