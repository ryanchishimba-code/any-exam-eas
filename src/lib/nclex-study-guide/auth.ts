/**
 * NCLEX Study Guide — auth adapter.
 *
 * Reads: optional session (anonymous gets empty annotations).
 * Writes: require a real signed-in user (FK to User).
 *
 * STUDY_GUIDE_AUTH_ADAPTER — swap resolve helpers if Auth changes.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";

export type StudyGuideAuth = {
  userId: string;
};

export async function getOptionalStudyGuideUser(): Promise<StudyGuideAuth | null> {
  try {
    const session = await auth();
    if (session?.user?.id) return { userId: session.user.id };
  } catch {
    /* ignore */
  }
  return null;
}

export async function requireStudyGuideUser(): Promise<
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse }
> {
  const user = await getOptionalStudyGuideUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Sign in required to save Study Guide highlights, bookmarks, and notes.",
          code: "STUDY_GUIDE_AUTH_REQUIRED",
        },
        { status: 401 }
      ),
    };
  }
  return { ok: true, userId: user.userId };
}
