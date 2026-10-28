import { NextResponse } from "next/server";
import {
  BOARD_INTENT_COOKIE,
  BOARD_INTENT_MAX_AGE_SEC,
  parseBoardSlug,
} from "@/lib/auth/board-intent";
import { captureBoardForUser, readServerBoardIntent } from "@/lib/auth/board-intent-server";
import {
  dashboardVerifiedUrl,
  loginWithVerifyQuery,
} from "@/lib/auth/verify-email-urls";
import { appBaseUrl } from "@/lib/email/config";
import { verifyEmailWithToken } from "@/lib/email-verification";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const base = appBaseUrl();
  if (!token) {
    return NextResponse.redirect(new URL(loginWithVerifyQuery("missing"), base));
  }

  const result = await verifyEmailWithToken(token);
  const board =
    parseBoardSlug(url.searchParams.get("board")) ?? (await readServerBoardIntent(req));
  if (result.ok && board) {
    await captureBoardForUser(result.userId, board);
  }

  const dest = result.ok ? dashboardVerifiedUrl() : loginWithVerifyQuery("invalid");
  const response = NextResponse.redirect(new URL(dest, base));
  if (result.ok && board) {
    response.cookies.set(BOARD_INTENT_COOKIE, board, {
      path: "/",
      maxAge: BOARD_INTENT_MAX_AGE_SEC,
      sameSite: "lax",
    });
  }
  return response;
}
