import { NextResponse } from "next/server";
import { isExamSlug } from "@/lib/edtech/exams";
import { markTrialStartHereStatus } from "@/lib/trial/trial-start-here-preference";
import type { TrialStartHereStatus } from "@/lib/trial/trial-start-here";
import { requireSessionGuard } from "@/lib/session-guard";

const STATUSES = new Set<TrialStartHereStatus>([
  "active",
  "practice_done",
  "completed",
  "dismissed",
]);

export async function POST(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const record = (body ?? {}) as { status?: unknown; step?: unknown; examSlug?: unknown };
  if (typeof record.status !== "string" || !STATUSES.has(record.status as TrialStartHereStatus)) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }
  if (typeof record.examSlug !== "string" || !isExamSlug(record.examSlug)) {
    return NextResponse.json({ ok: false, error: "Invalid exam" }, { status: 400 });
  }
  const step =
    typeof record.step === "number" && Number.isFinite(record.step) ? record.step : 0;

  const result = await markTrialStartHereStatus(
    guard.userId,
    record.examSlug,
    record.status as TrialStartHereStatus,
    step
  );

  return NextResponse.json(result);
}
