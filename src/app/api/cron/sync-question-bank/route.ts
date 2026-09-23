import { NextResponse } from "next/server";
import { revalidateActiveQuestionInventory } from "@/lib/inventory/revalidate-active-inventory";
import { syncQuestionBank } from "@/lib/sync-question-bank";

export const maxDuration = 300;

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  // Vercel Cron sends this header on scheduled invocations
  const cronHeader = req.headers.get("x-vercel-cron");
  return cronHeader === "1" && Boolean(process.env.VERCEL);
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncQuestionBank();

  let inventoryRevalidated = false;
  if (result.status === "success") {
    inventoryRevalidated = revalidateActiveQuestionInventory().ok;
  }

  return NextResponse.json(
    { ...result, inventoryRevalidated },
    { status: result.status === "success" ? 200 : 500 }
  );
}
