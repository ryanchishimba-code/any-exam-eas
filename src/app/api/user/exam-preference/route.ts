import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ examSlug: null });
  }

  const pref = await getUserExamPreference(session.user.id);
  return NextResponse.json({ examSlug: pref?.examSlug ?? null });
}
