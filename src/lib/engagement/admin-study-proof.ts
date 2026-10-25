import { EXAM_CATALOG, examSlugFromFieldId } from "@/lib/edtech/exams";
import { prisma } from "@/lib/prisma";
import { computeAdminStudyCompletionBreakdown } from "@/lib/learning/study-completion/compute-study-completion";
import { COMPLETION_RULES_V2 } from "@/lib/learning/study-completion/completion-rules-v2";
import { centralDateKey, formatCentralTimestamp } from "./central-date";
import { ENGAGEMENT_SURFACES, QUESTION_ATTEMPT_MAX_DURATION_MS } from "./config";
import { buildIntegrityFlags } from "./integrity";

export type StudyProofTimelineEvent = {
  at: string;
  atIso: string;
  type: string;
  detail: string;
  board: string;
};

export type StudyProofDailyBar = {
  date: string;
  totalSeconds: number;
};

export type AdminStudyProof = {
  generatedAt: string;
  ruleVersion: string;
  totals: {
    activeHoursOverall: number;
    activeDays: number;
    hoursBySurface: Record<string, number>;
    questionAttemptHoursCapped: number;
  };
  dailyActivity: StudyProofDailyBar[];
  timeline: StudyProofTimelineEvent[];
  integrity: ReturnType<typeof buildIntegrityFlags>;
  completionBoards: Awaited<ReturnType<typeof computeAdminStudyCompletionBreakdown>>;
};

function hoursFromSeconds(seconds: number): number {
  return Math.round((seconds / 3600) * 10) / 10;
}

function boardLabel(fieldOrSlug: string | null | undefined): string {
  if (!fieldOrSlug) return "—";
  if (fieldOrSlug in EXAM_CATALOG) {
    return EXAM_CATALOG[fieldOrSlug as keyof typeof EXAM_CATALOG].shortName;
  }
  const slug = examSlugFromFieldId(fieldOrSlug);
  if (slug) return EXAM_CATALOG[slug].shortName;
  return fieldOrSlug;
}

function daysAgoKey(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return centralDateKey(d);
}

export async function loadAdminStudyProof(userId: string): Promise<AdminStudyProof> {
  const since90 = daysAgoKey(90);
  const since90Date = new Date(`${since90}T00:00:00.000Z`);

  const [
    dailyRows,
    heartbeatMeta,
    attempts,
    examSessions,
    quickBites,
    chapters,
    readinessChecks,
    drugCards,
    completionBoards,
  ] = await Promise.all([
    prisma.studyEngagementDaily.findMany({
      where: { userId, date: { gte: since90Date } },
      orderBy: { date: "asc" },
    }),
    prisma.studyEngagementHeartbeatMeta.findUnique({ where: { userId } }),
    prisma.questionAttempt.findMany({
      where: { userId, createdAt: { gte: since90Date } },
      orderBy: { createdAt: "desc" },
      take: 500,
      select: {
        createdAt: true,
        durationMs: true,
        correct: true,
        fieldId: true,
      },
    }),
    prisma.examSession.findMany({
      where: { userId, updatedAt: { gte: since90Date } },
      orderBy: { updatedAt: "desc" },
      take: 80,
      select: {
        examType: true,
        status: true,
        score: true,
        questionCount: true,
        startedAt: true,
        completedAt: true,
        updatedAt: true,
      },
    }),
    prisma.quickBiteProgress.findMany({
      where: { userId, updatedAt: { gte: since90Date } },
      orderBy: { updatedAt: "desc" },
      take: 80,
      select: { slug: true, watchPct: true, updatedAt: true },
    }),
    prisma.sgChapterProgress.findMany({
      where: { userId, lastReadAt: { gte: since90Date } },
      orderBy: { lastReadAt: "desc" },
      take: 80,
      select: {
        scrollPct: true,
        verifiedSeconds: true,
        lastReadAt: true,
        chapter: { select: { guide: { select: { examSlug: true } } } },
      },
    }),
    prisma.readinessCheck.findMany({
      where: { userId, updatedAt: { gte: since90Date } },
      orderBy: { updatedAt: "desc" },
      take: 40,
      select: {
        examSlug: true,
        status: true,
        overallLevel: true,
        correctCount: true,
        itemCount: true,
        completedAt: true,
        updatedAt: true,
      },
    }),
    prisma.drugCardProgress.findMany({
      where: { userId, updatedAt: { gte: since90Date } },
      orderBy: { updatedAt: "desc" },
      take: 40,
      select: { updatedAt: true },
    }),
    computeAdminStudyCompletionBreakdown(userId),
  ]);

  const secondsBySurface: Record<string, number> = {};
  for (const surface of ENGAGEMENT_SURFACES) {
    secondsBySurface[surface] = 0;
  }
  const dayTotals = new Map<string, number>();
  const activeDaySet = new Set<string>();

  for (const row of dailyRows) {
    const key = centralDateKey(row.date);
    activeDaySet.add(key);
    secondsBySurface[row.surface] = (secondsBySurface[row.surface] ?? 0) + row.activeSeconds;
    dayTotals.set(key, (dayTotals.get(key) ?? 0) + row.activeSeconds);
  }

  const overallSeconds = Object.values(secondsBySurface).reduce((a, b) => a + b, 0);

  let questionAttemptMs = 0;
  for (const row of attempts) {
    const ms = Math.min(row.durationMs ?? 0, QUESTION_ATTEMPT_MAX_DURATION_MS);
    questionAttemptMs += ms;
  }

  const examsEndedEarly = examSessions.filter((session) => {
    const expected = EXAM_CATALOG[session.examType as keyof typeof EXAM_CATALOG]?.simulatedQuestionCount;
    if (!expected) return session.status === "abandoned";
    return (
      session.status === "abandoned" ||
      (session.status === "completed" && session.questionCount < expected)
    );
  }).length;

  const integrity = buildIntegrityFlags({
    attempts,
    heartbeatsIgnoredTooFast: heartbeatMeta?.ignoredTooFastCount ?? 0,
    examsEndedEarly,
  });

  const timelineRaw: { at: Date; event: StudyProofTimelineEvent }[] = [];

  for (const row of attempts) {
    const seconds = row.durationMs != null ? Math.round(row.durationMs / 1000) : 0;
    timelineRaw.push({
      at: row.createdAt,
      event: {
        at: formatCentralTimestamp(row.createdAt),
        atIso: row.createdAt.toISOString(),
        type: row.correct ? "question_correct" : "question_wrong",
        detail: `Question answered (${seconds}s)`,
        board: boardLabel(row.fieldId),
      },
    });
  }

  for (const session of examSessions) {
    const at = session.completedAt ?? session.startedAt ?? session.updatedAt;
    const expected = EXAM_CATALOG[session.examType as keyof typeof EXAM_CATALOG]?.simulatedQuestionCount;
    const early =
      session.status === "abandoned" ||
      (expected && session.status === "completed" && session.questionCount < expected);
    timelineRaw.push({
      at,
      event: {
        at: formatCentralTimestamp(at),
        atIso: at.toISOString(),
        type:
          session.status === "completed"
            ? early
              ? "exam_completed_early"
              : "exam_completed"
            : session.status === "in_progress"
              ? "exam_started"
              : "exam_abandoned",
        detail:
          session.status === "completed"
            ? `Exam completed · score ${session.score ?? "—"} · ${session.questionCount} Q`
            : session.status === "in_progress"
              ? `Exam started · ${session.questionCount} Q`
              : `Exam abandoned · ${session.questionCount} Q`,
        board: boardLabel(session.examType),
      },
    });
  }

  for (const row of quickBites) {
    timelineRaw.push({
      at: row.updatedAt,
      event: {
        at: formatCentralTimestamp(row.updatedAt),
        atIso: row.updatedAt.toISOString(),
        type: "quick_bite_progress",
        detail: `Quick Bite watched ${Math.round(row.watchPct)}% · ${row.slug}`,
        board: "—",
      },
    });
  }

  for (const row of chapters) {
    timelineRaw.push({
      at: row.lastReadAt,
      event: {
        at: formatCentralTimestamp(row.lastReadAt),
        atIso: row.lastReadAt.toISOString(),
        type: "study_guide_chapter",
        detail: `Chapter read ${Math.round(row.scrollPct)}% · ${row.verifiedSeconds}s verified`,
        board: boardLabel(row.chapter.guide.examSlug),
      },
    });
  }

  for (const row of readinessChecks) {
    const at = row.completedAt ?? row.updatedAt;
    timelineRaw.push({
      at,
      event: {
        at: formatCentralTimestamp(at),
        atIso: at.toISOString(),
        type: row.status === "completed" ? "readiness_check_completed" : "readiness_check",
        detail:
          row.status === "completed"
            ? `Readiness check · ${row.correctCount ?? 0}/${row.itemCount} · ${row.overallLevel ?? "—"}`
            : `Readiness check ${row.status}`,
        board: boardLabel(row.examSlug),
      },
    });
  }

  for (const row of drugCards) {
    timelineRaw.push({
      at: row.updatedAt,
      event: {
        at: formatCentralTimestamp(row.updatedAt),
        atIso: row.updatedAt.toISOString(),
        type: "drug_cards_reviewed",
        detail: "Drug cards reviewed",
        board: "NAPLEX",
      },
    });
  }

  timelineRaw.sort((a, b) => b.at.getTime() - a.at.getTime());
  const timeline = timelineRaw.slice(0, 200).map((row) => row.event);

  const dailyActivity: StudyProofDailyBar[] = [];
  for (let i = 89; i >= 0; i--) {
    const key = daysAgoKey(i);
    dailyActivity.push({
      date: key,
      totalSeconds: dayTotals.get(key) ?? 0,
    });
  }

  const last30 = dailyActivity.slice(-30);

  return {
    generatedAt: new Date().toISOString(),
    ruleVersion: COMPLETION_RULES_V2.version,
    totals: {
      activeHoursOverall: hoursFromSeconds(overallSeconds),
      activeDays: activeDaySet.size,
      hoursBySurface: Object.fromEntries(
        Object.entries(secondsBySurface).map(([k, v]) => [k, hoursFromSeconds(v)])
      ),
      questionAttemptHoursCapped: hoursFromSeconds(Math.round(questionAttemptMs / 1000)),
    },
    dailyActivity: last30,
    timeline,
    integrity,
    completionBoards,
  };
}

export function studyProofExportSummary(proof: AdminStudyProof) {
  return {
    generatedAt: proof.generatedAt,
    ruleVersion: proof.ruleVersion,
    totals: proof.totals,
    integrity: proof.integrity,
    completionBoards: proof.completionBoards.map((board) => ({
      examSlug: board.examSlug,
      overallPercent: board.overallPercent,
      pillars: board.pillars,
      readinessEstimate: board.readinessEstimate,
    })),
  };
}
