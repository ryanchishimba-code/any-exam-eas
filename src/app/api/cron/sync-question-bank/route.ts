import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";
import { refreshActiveInventoryCounts } from "@/lib/inventory/stored-active-inventory";
import { revalidateActiveQuestionInventory } from "@/lib/inventory/revalidate-active-inventory";
import { syncQuestionBank } from "@/lib/sync-question-bank";

export const maxDuration = 300;

export async function GET(req: Request) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncQuestionBank();

  let countsRefreshed = false;
  let countsPublished: number | null = null;
  let countsError: string | undefined;
  try {
    const refresh = await refreshActiveInventoryCounts();
    countsRefreshed = refresh.ok;
    countsPublished = refresh.published;
    countsError = refresh.error;
  } catch (error) {
    countsError = error instanceof Error ? error.message : "active inventory refresh failed";
    console.error("[cron/sync-question-bank] count refresh failed:", error);
  }

  let inventoryRevalidated = false;
  if (result.status === "success" || countsRefreshed) {
    inventoryRevalidated = revalidateActiveQuestionInventory().ok;
  }

  return NextResponse.json(
    { ...result, inventoryRevalidated, countsRefreshed, countsPublished, countsError },
    { status: result.status === "success" ? 200 : 500 }
  );
}
