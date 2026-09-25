/**
 * Board-generic week countdown.
 *
 * One plan for every exam. Callers pass days-to-exam, the blueprint gap, and
 * open incorrect items. Nothing here branches on NCLEX. Today's block stays
 * the daily projection: outside the final 14 days it still follows the largest
 * proof gap; inside that window the week adds exam-simulation and incorrect-drill
 * days and Today's rows follow that day's kind.
 *
 * Progress ticks from saved work today only. Earlier days this week are not
 * reconstructed. Exam simulation is done today only after at least 50 answers
 * from that simulation are saved. Ending a shorter set does not tick it.
 * None of this is a licensure prediction.
 */

/** Same size as Today's Qbank row. Local so this module does not import the day plan. */
const COVERAGE_QUESTION_TARGET = 25;

export const FINAL_STRETCH_DAYS = 14;

export type TodayBlockId = "qbank" | "incorrect" | "guide" | "drugs" | "exam_sim";

export type WeekGoalId = "coverage" | "remediation" | "exam_sim";

export type WeekGoalStatus = "done_today" | "clear" | "today" | "later";

export type WeekPlanIntensity = "unset" | "passed" | "building" | "final";

export type WeekGoal = {
  id: WeekGoalId;
  title: string;
  detail: string;
  /** Days of this kind in the current 7-day contract. */
  dayCount: number;
  /** 0–1. Today's slice only. */
  progress: number;
  status: WeekGoalStatus;
  statusLabel: string;
};

export type WeekCountdownPlan = {
  active: boolean;
  weeksOut: number | null;
  daysUntilExam: number | null;
  intensity: WeekPlanIntensity;
  title: string;
  summary: string;
  /** Short range pill. Empty when there is nothing to count. */
  rangeLabel: string;
  /** Goal Today's block projects. Null until a date is on the calendar. */
  todayKind: WeekGoalId | null;
  todayLine: string;
  goals: WeekGoal[];
};

/**
 * Final-stretch week, indexed by UTC day. Two exam-simulation days, four
 * incorrect-drill days, one coverage day.
 */
export const FINAL_WEEK_PATTERN: readonly WeekGoalId[] = [
  "exam_sim",
  "remediation",
  "remediation",
  "exam_sim",
  "remediation",
  "coverage",
  "remediation",
];

const PROJECTION_ORDER: Record<WeekGoalId, readonly TodayBlockId[]> = {
  exam_sim: ["exam_sim", "incorrect", "qbank", "guide", "drugs"],
  remediation: ["incorrect", "exam_sim", "qbank", "guide", "drugs"],
  coverage: ["qbank", "guide", "incorrect", "exam_sim", "drugs"],
};

export type WeekCountdownInput = {
  examName: string;
  daysUntilExam: number | null;
  now: Date;
  /** Largest blueprint gap, when categories loaded. */
  gapLabel: string | null;
  openKnown: boolean;
  openIncorrect: number;
  /** Review-incorrect row size for today, already capped. */
  incorrectTarget: number;
  questionsToday: number;
  /** Open incorrect outranks the blueprint gap. */
  remediationHeavy: boolean;
  /** At least 50 exam-sim answers saved on today's UTC date. */
  examSimCompletedToday: boolean;
};

export type WeekProjection = {
  weekPlan: WeekCountdownPlan;
  /** True when Today's rows should include exam sim and follow projectionKind. */
  intensify: boolean;
  projectionKind: WeekGoalId;
  qbankDone: boolean;
  incorrectDone: boolean;
  examSimDone: boolean;
};

export function finalStretchProjection(now: Date): WeekGoalId {
  const index = utcDayIndex(now) % FINAL_WEEK_PATTERN.length;
  return FINAL_WEEK_PATTERN[index] ?? "coverage";
}

export function projectionOrder(kind: WeekGoalId): readonly TodayBlockId[] {
  return PROJECTION_ORDER[kind];
}

export function buildWeekCountdown(input: WeekCountdownInput): WeekProjection {
  const days = input.daysUntilExam;
  const dated = days != null && days >= 0;
  const intensify = dated && days <= FINAL_STRETCH_DAYS;
  const gapKind: WeekGoalId = input.remediationHeavy ? "remediation" : "coverage";
  const projectionKind = intensify
    ? finalProjectionKind(input, finalStretchProjection(input.now))
    : gapKind;
  const split = splitTodayAnswers(projectionKind, input.questionsToday, input.incorrectTarget);
  const examSimDone = input.examSimCompletedToday;

  return {
    weekPlan: dated
      ? activePlan(input, {
          days,
          intensify,
          projectionKind,
          qbankDone: split.qbankDone,
          incorrectDone: split.incorrectDone,
          examSimDone,
          coverageCounted: split.coverageCounted,
          incorrectCounted: split.incorrectCounted,
        })
      : inactivePlan(input.examName, days),
    intensify,
    projectionKind,
    qbankDone: split.qbankDone,
    incorrectDone: split.incorrectDone,
    examSimDone,
  };
}

function finalProjectionKind(input: WeekCountdownInput, kind: WeekGoalId): WeekGoalId {
  const queueClear = input.openKnown && input.openIncorrect <= 0;
  if (kind === "exam_sim" && input.examSimCompletedToday) {
    return queueClear ? "coverage" : "remediation";
  }
  if (kind === "remediation" && queueClear) {
    return input.examSimCompletedToday ? "coverage" : "exam_sim";
  }
  return kind;
}

function splitTodayAnswers(
  todayKind: WeekGoalId,
  questionsToday: number,
  incorrectTarget: number
): {
  qbankDone: boolean;
  incorrectDone: boolean;
  coverageCounted: number;
  incorrectCounted: number;
} {
  const saved = Math.max(0, Math.round(questionsToday) || 0);
  const incorrectTargetCount = Math.max(0, Math.round(incorrectTarget) || 0);

  if (todayKind === "remediation" && incorrectTargetCount > 0) {
    const coverageCounted = Math.max(0, saved - incorrectTargetCount);
    return {
      incorrectCounted: Math.min(saved, incorrectTargetCount),
      coverageCounted,
      incorrectDone: saved >= incorrectTargetCount,
      qbankDone: coverageCounted >= COVERAGE_QUESTION_TARGET,
    };
  }

  if (todayKind === "exam_sim") {
    const reserved = incorrectTargetCount > 0 ? incorrectTargetCount : 0;
    const coverageCounted = Math.max(0, saved - reserved);
    return {
      incorrectCounted: reserved > 0 ? Math.min(saved, reserved) : 0,
      coverageCounted,
      incorrectDone: reserved > 0 && saved >= reserved,
      qbankDone: coverageCounted >= COVERAGE_QUESTION_TARGET,
    };
  }

  const coverageCounted = Math.min(saved, COVERAGE_QUESTION_TARGET);
  const overflow = Math.max(0, saved - COVERAGE_QUESTION_TARGET);
  return {
    coverageCounted,
    incorrectCounted:
      incorrectTargetCount > 0 ? Math.min(overflow, incorrectTargetCount) : 0,
    qbankDone: saved >= COVERAGE_QUESTION_TARGET,
    incorrectDone:
      incorrectTargetCount > 0 && saved >= COVERAGE_QUESTION_TARGET + incorrectTargetCount,
  };
}

function inactivePlan(examName: string, days: number | null): WeekCountdownPlan {
  if (days != null && days < 0) {
    return {
      active: false,
      weeksOut: null,
      daysUntilExam: days,
      intensity: "passed",
      title: "Exam date passed",
      summary: `That ${examName} date has passed. Update it and this week's plan rebuilds from the new countdown.`,
      rangeLabel: "Update date",
      todayKind: null,
      todayLine: "",
      goals: [],
    };
  }
  return {
    active: false,
    weeksOut: null,
    daysUntilExam: null,
    intensity: "unset",
    title: "Set an exam date",
    summary: `Set a target exam date for ${examName}. This week's plan appears once a date is saved.`,
    rangeLabel: "",
    todayKind: null,
    todayLine: "",
    goals: [],
  };
}

function activePlan(
  input: WeekCountdownInput,
  ctx: {
    days: number;
    intensify: boolean;
    projectionKind: WeekGoalId;
    qbankDone: boolean;
    incorrectDone: boolean;
    examSimDone: boolean;
    coverageCounted: number;
    incorrectCounted: number;
  }
): WeekCountdownPlan {
  const weeksOut = ctx.days <= 0 ? 1 : Math.ceil(ctx.days / 7);
  const mix = ctx.intensify
    ? { coverage: 1, remediation: 4, exam_sim: 2 }
    : input.remediationHeavy
      ? { coverage: 3, remediation: 4, exam_sim: 0 }
      : { coverage: 5, remediation: 2, exam_sim: 0 };
  const gap = input.gapLabel ?? "mixed topics";
  const order: WeekGoalId[] = ctx.intensify
    ? ["exam_sim", "remediation", "coverage"]
    : input.remediationHeavy
      ? ["remediation", "coverage"]
      : ["coverage", "remediation"];
  const goalOrder = [
    ctx.projectionKind,
    ...order.filter((id) => id !== ctx.projectionKind && mix[id] > 0),
  ].filter((id) => mix[id] > 0);

  const goals = goalOrder.map((id) =>
    goalFor(id, {
      ...ctx,
      gap,
      dayCount: mix[id],
      openKnown: input.openKnown,
      openIncorrect: input.openIncorrect,
      incorrectTarget: input.incorrectTarget,
    })
  );

  const rangeLabel =
    ctx.days === 0
      ? "Exam day"
      : ctx.days === 1
        ? "1 day out"
        : ctx.intensify
          ? `${ctx.days} days out`
          : weeksOut === 1
            ? "1 week out"
            : `${weeksOut} weeks out`;

  const title =
    ctx.days === 0
      ? "Exam day"
      : ctx.intensify
        ? "Practice exam and review"
        : input.remediationHeavy
          ? "Questions to review"
          : "Topics to practice";

  const runway =
    ctx.days === 0
      ? `${input.examName} is today`
      : ctx.days === 1
        ? `1 day until ${input.examName}`
        : `${ctx.days} days until ${input.examName}`;

  const summary = ctx.intensify
    ? `${runway}. ${countNoun(mix.exam_sim, "practice exam")} and ${daysOn(mix.remediation, "questions you missed")}, plus ${daysOn(mix.coverage, "topics you haven't practiced yet")}. A practice-exam score is practice feedback, not a licensure result.`
    : `${runway}. ${daysOn(mix.coverage, "topics you haven't practiced yet")}, and ${daysOn(mix.remediation, "questions you missed")}. A practice exam joins in the last ${FINAL_STRETCH_DAYS} days.`;

  return {
    active: true,
    weeksOut,
    daysUntilExam: ctx.days,
    intensity: ctx.intensify ? "final" : "building",
    title,
    summary,
    rangeLabel,
    todayKind: ctx.projectionKind,
    todayLine: todayLine(ctx.projectionKind, gap, {
      qbankDone: ctx.qbankDone,
      incorrectDone: ctx.incorrectDone,
      examSimDone: ctx.examSimDone,
    }),
    goals,
  };
}

function goalFor(
  id: WeekGoalId,
  ctx: {
    projectionKind: WeekGoalId;
    qbankDone: boolean;
    incorrectDone: boolean;
    examSimDone: boolean;
    coverageCounted: number;
    incorrectCounted: number;
    gap: string;
    dayCount: number;
    openKnown: boolean;
    openIncorrect: number;
    incorrectTarget: number;
  }
): WeekGoal {
  if (id === "exam_sim") {
    const status: WeekGoalStatus = ctx.examSimDone
      ? "done_today"
      : ctx.projectionKind === "exam_sim"
        ? "today"
        : "later";
    return {
      id,
      title: "Practice exam",
      detail: `${countNoun(ctx.dayCount, "practice exam")} this week. The score is practice feedback, not a licensure result.`,
      dayCount: ctx.dayCount,
      progress: status === "done_today" ? 1 : 0,
      status,
      statusLabel: status === "done_today" ? "Done today" : status === "today" ? "Today" : "Later this week",
    };
  }

  if (id === "remediation") {
    const clear = ctx.openKnown && ctx.openIncorrect <= 0;
    const status: WeekGoalStatus = clear
      ? "clear"
      : ctx.incorrectDone
        ? "done_today"
        : ctx.projectionKind === "remediation"
          ? "today"
          : "later";
    const detail = !ctx.openKnown
      ? "Questions you missed could not be counted on this load."
      : clear
        ? "No questions to review. If you miss one, it shows up here."
        : `${questionsToReview(ctx.openIncorrect)}. ${daysOn(ctx.dayCount, "questions you missed")}.`;
    const progress = clear || ctx.incorrectDone
      ? 1
      : status === "today" && ctx.incorrectTarget > 0
        ? Math.min(1, ctx.incorrectCounted / ctx.incorrectTarget)
        : 0;
    const statusLabel = clear
      ? "Clear"
      : status === "done_today"
        ? "Done today"
        : status === "today"
          ? `${ctx.incorrectCounted} of ${ctx.incorrectTarget} today`
          : "Later this week";
    return {
      id,
      title: "Questions to review",
      detail,
      dayCount: ctx.dayCount,
      progress,
      status,
      statusLabel,
    };
  }

  const status: WeekGoalStatus = ctx.qbankDone
    ? "done_today"
    : ctx.projectionKind === "coverage"
      ? "today"
      : "later";
  const namedTopic = ctx.gap !== "mixed topics";
  return {
    id,
    title: namedTopic ? `Practice ${ctx.gap}` : "Topics you haven't practiced yet",
    detail: namedTopic
      ? `${daysOn(ctx.dayCount, ctx.gap)}. That's a topic you haven't practiced yet. Today's set is ${COVERAGE_QUESTION_TARGET} questions.`
      : `${daysOn(ctx.dayCount, "topics you haven't practiced yet")}. Today's set is ${COVERAGE_QUESTION_TARGET} questions.`,
    dayCount: ctx.dayCount,
    progress:
      status === "done_today"
        ? 1
        : status === "today"
          ? Math.min(1, ctx.coverageCounted / COVERAGE_QUESTION_TARGET)
          : 0,
    status,
    statusLabel:
      status === "done_today"
        ? "Done today"
        : status === "today"
          ? `${ctx.coverageCounted} of ${COVERAGE_QUESTION_TARGET} today`
          : "Later this week",
  };
}

function todayLine(
  kind: WeekGoalId,
  gap: string,
  done: { qbankDone: boolean; incorrectDone: boolean; examSimDone: boolean }
): string {
  if (kind === "exam_sim") {
    return done.examSimDone
      ? "Today's practice exam is done."
      : "Today: a practice exam, then questions you missed.";
  }
  if (kind === "remediation") {
    return done.incorrectDone
      ? "Today's review is done."
      : "Today: questions you missed.";
  }
  return done.qbankDone
    ? `Today's practice on ${gap} is done.`
    : `Today: practice ${gap}, a topic you haven't practiced yet.`;
}

function daysOn(count: number, what: string): string {
  return `${count} ${count === 1 ? "day" : "days"} on ${what}`;
}

function countNoun(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function questionsToReview(count: number): string {
  return count === 1 ? "1 question to review" : `${count} questions to review`;
}

function utcDayIndex(now: Date): number {
  const MS_DAY = 86_400_000;
  return Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / MS_DAY);
}
