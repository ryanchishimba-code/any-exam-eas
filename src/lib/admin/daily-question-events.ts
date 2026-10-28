import { CONVERSION_EVENTS } from "@/lib/analytics/conversion-types";
import { prisma } from "@/lib/prisma";

export const DAILY_QUESTION_EVENT_NAMES = [
  CONVERSION_EVENTS.DAILY_ANSWER,
  CONVERSION_EVENTS.DAILY_TRIAL_CTA_CLICK,
  CONVERSION_EVENTS.SIGNUP_FROM_DAILY,
] as const;

export type DailyQuestionEventCounts = Record<(typeof DAILY_QUESTION_EVENT_NAMES)[number], number>;

export function tallyDailyQuestionEvents(
  rows: { eventName: string; count: number }[]
): DailyQuestionEventCounts {
  const totals: DailyQuestionEventCounts = {
    daily_answer: 0,
    daily_trial_cta_click: 0,
    signup_from_daily: 0,
  };
  for (const row of rows) {
    if (row.eventName in totals) {
      totals[row.eventName as keyof DailyQuestionEventCounts] = row.count;
    }
  }
  return totals;
}

/** One indexed group-by. Safe to render beside the pass report. */
export async function countDailyQuestionEvents(): Promise<DailyQuestionEventCounts> {
  const rows = await prisma.conversionEvent.groupBy({
    by: ["eventName"],
    where: { eventName: { in: [...DAILY_QUESTION_EVENT_NAMES] } },
    _count: { _all: true },
  });
  return tallyDailyQuestionEvents(
    rows.map((row) => ({ eventName: row.eventName, count: row._count._all }))
  );
}
