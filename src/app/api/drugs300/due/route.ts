import { NextResponse } from "next/server";
import { isExamSlug } from "@/lib/edtech/exams";
import { getDueDrugCards, getSafetyPathCards } from "@/lib/drugs300";
import { DRUG_SAFETY_PATH_ID } from "@/lib/drugs300/safety-path";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const auth = await requirePremiumApi();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(req.url);
  if (searchParams.get("path") === DRUG_SAFETY_PATH_ID) {
    const examParam = searchParams.get("exam") ?? "nclex";
    const examSlug = isExamSlug(examParam) ? examParam : "nclex";
    try {
      const path = await getSafetyPathCards(auth.userId, examSlug);
      return NextResponse.json({
        cards: path.cards,
        classId: "all",
        path: {
          id: DRUG_SAFETY_PATH_ID,
          exam: examSlug,
          reviewedToday: path.reviewedToday,
          complete: path.complete,
        },
      });
    } catch (error) {
      const { respondDbUnavailable } = await import("@/lib/api-db-error");
      const dbResponse = respondDbUnavailable(error);
      if (dbResponse) return dbResponse;
      const message = error instanceof Error ? error.message : "Unable to load the safety path";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const classParam = searchParams.get("class") ?? "all";
  const validClasses = [
    "all",
    "cardiovascular",
    "endocrine",
    "antibiotics",
    "cns-psych",
    "respiratory",
    "gastrointestinal",
    "pain-inflammation",
    "immunologic-other",
  ] as const;
  const classId = validClasses.includes(classParam as (typeof validClasses)[number])
    ? (classParam as (typeof validClasses)[number])
    : "all";

  const limitParam = searchParams.get("limit");
  const poolMax = classId === "all" ? 50 : 200;
  const limit =
    limitParam != null && limitParam !== ""
      ? Math.min(Math.max(Number(limitParam) || poolMax, 1), poolMax)
      : classId === "all"
        ? 30
        : poolMax;

  try {
    const cards = await getDueDrugCards(auth.userId, limit, classId);
    return NextResponse.json({ cards, classId });
  } catch (error) {
    const { respondDbUnavailable } = await import("@/lib/api-db-error");
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    const message = error instanceof Error ? error.message : "Unable to load due cards";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
