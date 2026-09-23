import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";
import { revalidateActiveQuestionInventory } from "@/lib/inventory/revalidate-active-inventory";
import { syncQuestionBank } from "@/lib/sync-question-bank";

export const maxDuration = 300;

export async function GET(req: Request) {
  if (!isCronAuthorized(req)) {
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
