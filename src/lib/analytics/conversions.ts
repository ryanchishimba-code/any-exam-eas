import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  CONVERSION_EVENTS,
  type ConversionEventName,
  type ConversionProperties,
  type ConversionSource,
  type ConversionsDashboardData,
} from "./conversion-types";

export type SaveConversionInput = {
  eventName: ConversionEventName;
  properties?: Record<string, unknown>;
  userId?: string | null;
  sessionId?: string | null;
  source?: ConversionSource;
  req?: Request;
};

/** Persist a conversion to Neon (non-blocking when called without await). */
export async function saveConversionEvent(input: SaveConversionInput): Promise<void> {
  try {
    await prisma.conversionEvent.create({
      data: {
        eventName: input.eventName,
        properties: (input.properties ?? {}) as Prisma.InputJsonValue,
        userId: input.userId ?? null,
        sessionId: input.sessionId ?? null,
        source: input.source ?? "web",
      },
    });
  } catch {
    /* analytics must not break product flows */
  }
}

export function trackConversionServer(input: SaveConversionInput): void {
  void saveConversionEvent({ ...input, source: input.source ?? "server" });
}

function parseDateRange(from?: string | null, to?: string | null): { from: Date; to: Date; fromKey: string; toKey: string } {
  const toKey = to && /^\d{4}-\d{2}-\d{2}$/.test(to) ? to : new Date().toISOString().slice(0, 10);
  const fromKey =
    from && /^\d{4}-\d{2}-\d{2}$/.test(from)
      ? from
      : (() => {
          const d = new Date();
          d.setUTCDate(d.getUTCDate() - 30);
          return d.toISOString().slice(0, 10);
        })();

  return {
    from: new Date(`${fromKey}T00:00:00.000Z`),
    to: new Date(`${toKey}T23:59:59.999Z`),
    fromKey,
    toKey,
  };
}

export async function getConversionsDashboard(
  from?: string | null,
  to?: string | null
): Promise<ConversionsDashboardData> {
  const range = parseDateRange(from, to);

  const rows = await prisma.conversionEvent.findMany({
    where: { createdAt: { gte: range.from, lte: range.to } },
    orderBy: { createdAt: "desc" },
    take: 5000,
    include: {
      user: { select: { email: true } },
    },
  });

  const totals = Object.values(CONVERSION_EVENTS).reduce(
    (acc, name) => {
      acc[name] = 0;
      return acc;
    },
    {} as Record<ConversionEventName, number>
  );

  const dailyMap = new Map<string, number>();
  const eventsByDay: ConversionsDashboardData["eventsByDay"] = [];
  const ctaMap = new Map<string, { cta_name: string; location: string; count: number }>();
  const planMap = new Map<string, number>();

  for (const row of rows) {
    const name = row.eventName as ConversionEventName;
    if (name in totals) totals[name] += 1;

    const day = row.createdAt.toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
    eventsByDay.push({ date: day, count: 1, eventName: row.eventName });

    const props = (row.properties ?? {}) as Record<string, unknown>;
    if (row.eventName === CONVERSION_EVENTS.CTA_CLICKED) {
      const cta_name = String(props.cta_name ?? "unknown");
      const location = String(props.location ?? "unknown");
      const key = `${cta_name}::${location}`;
      const existing = ctaMap.get(key);
      if (existing) existing.count += 1;
      else ctaMap.set(key, { cta_name, location, count: 1 });
    }
    if (row.eventName === CONVERSION_EVENTS.PLAN_SELECTED) {
      const plan_type = String(props.plan_type ?? "unknown");
      planMap.set(plan_type, (planMap.get(plan_type) ?? 0) + 1);
    }
  }

  const dailyTotals = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({ date, total }));

  const recent = rows.slice(0, 100).map((row) => ({
    id: row.id,
    userId: row.userId,
    eventName: row.eventName as ConversionEventName,
    properties: (row.properties ?? {}) as Record<string, unknown>,
    sessionId: row.sessionId,
    source: row.source as ConversionSource,
    createdAt: row.createdAt.toISOString(),
    userEmail: row.user?.email ?? null,
  }));

  return {
    range: { from: range.fromKey, to: range.toKey },
    totals,
    eventsByDay,
    dailyTotals,
    ctaBreakdown: [...ctaMap.values()].sort((a, b) => b.count - a.count).slice(0, 20),
    planBreakdown: [...planMap.entries()]
      .map(([plan_type, count]) => ({ plan_type, count }))
      .sort((a, b) => b.count - a.count),
    recent,
  };
}

/** Type-safe server helper for known conversion payloads. */
export function saveTypedConversion<E extends ConversionEventName>(
  eventName: E,
  properties: ConversionProperties[E],
  opts?: Omit<SaveConversionInput, "eventName" | "properties">
): void {
  trackConversionServer({ eventName, properties: properties as Record<string, unknown>, ...opts });
}
