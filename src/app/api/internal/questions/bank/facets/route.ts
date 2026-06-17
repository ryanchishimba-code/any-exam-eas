import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { getQuestionFacets } from "@/lib/admin/question-bank-admin";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireInternalPermission("questions.view");
  if (auth instanceof NextResponse) return auth;

  const facets = await getQuestionFacets();
  return NextResponse.json(facets);
}
