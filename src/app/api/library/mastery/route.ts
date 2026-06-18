import { NextResponse } from "next/server";
import { z } from "zod";
import {
  isCardMasteryStatus,
  listMemoryCardMastery,
  syncMemoryCardMastery,
  upsertMemoryCardMastery,
} from "@/lib/library/card-mastery-service";
import type { ExamSlug } from "@/types/edtech";

export const runtime = "nodejs";

const examSchema = z.enum(["nclex", "usmle", "naplex", "pance", "aanp-fnp", "npte-pt"]);

const upsertSchema = z.object({
  examSlug: examSchema,
  cardId: z.string().min(1).max(120),
  status: z.enum(["got-it", "need-review"]),
});

const syncSchema = z.object({
  examSlug: examSchema,
  entries: z
    .array(
      z.object({
        cardId: z.string().min(1).max(120),
        status: z.enum(["got-it", "need-review"]),
        updatedAt: z.string().datetime(),
      })
    )
    .max(200),
});

export async function GET(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const auth = await requirePremiumApi();
  if (!auth.ok) return auth.response;

  const examSlug = examSchema.safeParse(new URL(req.url).searchParams.get("exam"));
  if (!examSlug.success) {
    return NextResponse.json({ error: "Invalid exam" }, { status: 400 });
  }

  try {
    const mastery = await listMemoryCardMastery(auth.userId, examSlug.data as ExamSlug);
    return NextResponse.json({ mastery });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unable to load mastery";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const auth = await requirePremiumApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const parsed = upsertSchema.safeParse(body);
    if (parsed.success) {
      const row = await upsertMemoryCardMastery(
        auth.userId,
        parsed.data.examSlug as ExamSlug,
        parsed.data.cardId,
        parsed.data.status
      );
      return NextResponse.json({ mastery: row });
    }

    const syncParsed = syncSchema.safeParse(body);
    if (!syncParsed.success) {
      return NextResponse.json(
        { error: parsed.error?.errors[0]?.message ?? syncParsed.error.errors[0]?.message ?? "Invalid body" },
        { status: 400 }
      );
    }

    const mastery = await syncMemoryCardMastery(
      auth.userId,
      syncParsed.data.examSlug as ExamSlug,
      syncParsed.data.entries.filter((e) => isCardMasteryStatus(e.status))
    );
    return NextResponse.json({ mastery });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Mastery update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
