import { cookies } from "next/headers";
import { assignBoardIfUnset } from "@/lib/edtech/exam-preference";
import type { ExamSlug } from "@/types/edtech";
import {
  BOARD_INTENT_COOKIE,
  OAUTH_CALLBACK_COOKIES,
  boardFromCallbackUrl,
  boardFromCookieHeader,
  parseBoardSlug,
} from "@/lib/auth/board-intent";

/** Board carried on this request. Never throws when cookies are unavailable. */
export async function readServerBoardIntent(req?: Request): Promise<ExamSlug | null> {
  const fromHeader = boardFromCookieHeader(req?.headers?.get("cookie"));
  if (fromHeader) return fromHeader;

  try {
    const jar = await cookies();
    const direct = parseBoardSlug(jar.get(BOARD_INTENT_COOKIE)?.value);
    if (direct) return direct;
    for (const name of OAUTH_CALLBACK_COOKIES) {
      const carried = boardFromCallbackUrl(jar.get(name)?.value);
      if (carried) return carried;
    }
  } catch (error) {
    console.warn(
      "[board-intent] cookie read skipped:",
      error instanceof Error ? error.message : error
    );
  }
  return null;
}

/**
 * Save a board only when the account has none. A page visit, OAuth return,
 * email link, or login must not replace a board the user already saved.
 */
export async function captureBoardForUser(
  userId: string,
  incoming: ExamSlug | null
): Promise<boolean> {
  if (!incoming) return false;
  try {
    return await assignBoardIfUnset(userId, incoming);
  } catch (error) {
    console.warn(
      "[board-intent] save skipped:",
      error instanceof Error ? error.message : error
    );
    return false;
  }
}
