import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserAccess } from "@/lib/access-control";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";

export const runtime = "nodejs";

/** Personalized welcome payload for returning users (session required). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access = await getUserAccess(session.user.id);

  let headline: {
    readinessScore: number;
    studyStreakDays: number;
    overallAccuracy: number | null;
    totalAttempts: number;
  } | null = null;

  if (access.hasPremiumAccess) {
    try {
      const dashboard = await getStudentDashboardData(session.user.id);
      headline = {
        readinessScore: dashboard.headline.readinessScore,
        studyStreakDays: dashboard.headline.studyStreakDays,
        overallAccuracy: dashboard.headline.overallAccuracy,
        totalAttempts: dashboard.headline.totalAttempts,
      };
    } catch {
      /* optional */
    }
  }

  return NextResponse.json({
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
    hasAccess: access.hasPremiumAccess,
    headline,
  });
}
