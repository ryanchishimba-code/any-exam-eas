import { NextResponse } from "next/server";
import { isExamSlug } from "@/lib/edtech/exams";
import {
  PASS_CHECK_IN_RESULT,
  isPassCheckInResult,
  quoteToStore,
  type PassCheckInResult,
} from "@/lib/learning/pass-check-in";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { requireAuthenticatedApi } = await import("@/lib/api-access");
  const authResult = await requireAuthenticatedApi();
  if (!authResult.ok) return authResult.response;

  let result: PassCheckInResult;
  let quote: string | null = null;
  let consent = false;
  let examSlug: string | null = null;
  try {
    const body = (await req.json()) as {
      result?: unknown;
      quote?: unknown;
      shareQuoteConsent?: unknown;
      examSlug?: unknown;
    };
    if (!isPassCheckInResult(body.result)) {
      return NextResponse.json({ error: "Choose how the exam went." }, { status: 400 });
    }
    result = body.result;
    consent = body.shareQuoteConsent === true;
    quote = typeof body.quote === "string" ? body.quote : null;
    examSlug = typeof body.examSlug === "string" && isExamSlug(body.examSlug) ? body.examSlug : null;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const stored = quoteToStore(quote, consent && result !== PASS_CHECK_IN_RESULT.dismissed && result !== PASS_CHECK_IN_RESULT.not_taken);

  try {
    await prisma.examPassCheckIn.create({
      data: {
        userId: authResult.userId,
        examSlug,
        result,
        quote: stored.quote,
        shareQuoteConsent: stored.shareQuoteConsent,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[pass-check-in] save", error);
    return NextResponse.json({ error: "Could not save that." }, { status: 500 });
  }
}
