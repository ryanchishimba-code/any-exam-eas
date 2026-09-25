import { NextResponse } from "next/server";
import { FIRST_LOGIN_TOUR_ID, markTourStatus, readTourGate } from "@/lib/onboarding/tour-preference";
import type { TourDevice, TourStatus } from "@/lib/onboarding/tour-record";
import { requireSessionGuard } from "@/lib/session-guard";

export const runtime = "nodejs";

const STATUSES = new Set<TourStatus>(["shown", "completed", "skipped"]);

/**
 * Tour state lives in `UserPreference.metadata` (`tours.firstLogin.v1`).
 * No schema migration. If that column or table is missing, responses stay
 * 200 with `persisted: false` and `eligible: false` so the tour does not loop.
 */
export async function GET(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  const gate = await readTourGate(guard.userId);
  return NextResponse.json({ tourId: FIRST_LOGIN_TOUR_ID, ...gate });
}

export async function PATCH(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const record = (body ?? {}) as {
    tour?: unknown;
    status?: unknown;
    step?: unknown;
    device?: unknown;
  };

  if (record.tour !== FIRST_LOGIN_TOUR_ID) {
    return NextResponse.json({ ok: false, error: "Unknown tour" }, { status: 400 });
  }
  if (typeof record.status !== "string" || !STATUSES.has(record.status as TourStatus)) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }
  const step = typeof record.step === "number" && Number.isFinite(record.step) ? record.step : 0;
  const device: TourDevice | undefined =
    record.device === "mobile" || record.device === "desktop" ? record.device : undefined;

  const result = await markTourStatus(guard.userId, {
    status: record.status as TourStatus,
    step,
    device,
  });

  return NextResponse.json({
    ok: result.ok,
    persisted: result.persisted,
    tourId: FIRST_LOGIN_TOUR_ID,
  });
}
