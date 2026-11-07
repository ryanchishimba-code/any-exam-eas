import { NextResponse } from "next/server";
import {
  optOutOfMarketingEmail,
  readMarketingUnsubscribeToken,
} from "@/lib/email/marketing-preference";

export const dynamic = "force-dynamic";

/** One-click List-Unsubscribe POST. Does not require a session. */
export async function POST(req: Request) {
  const url = new URL(req.url);
  let token = url.searchParams.get("token")?.trim() ?? "";
  if (!token) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    token = params.get("token")?.trim() ?? "";
  }
  const userId = token ? readMarketingUnsubscribeToken(token) : null;
  if (!userId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await optOutOfMarketingEmail(userId);
  return NextResponse.json({ ok: true });
}
