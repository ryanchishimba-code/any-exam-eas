import { NextResponse } from "next/server";
import { getDueDrugCards } from "@/lib/drugs300";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const auth = await requirePremiumApi();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);
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
