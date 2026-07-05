import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import {
  getUserConsentSnapshot,
  renderConsentDocument,
} from "@/lib/legal/consent-record";

type Params = { params: Promise<{ userId: string }> };

export async function GET(req: Request, { params }: Params) {
  const auth = await requireInternalPermission("admin.actions");
  if (auth instanceof NextResponse) return auth;

  const { userId } = await params;
  const snapshot = await getUserConsentSnapshot(userId);
  if (!snapshot) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  if (searchParams.get("format") === "html") {
    return new NextResponse(renderConsentDocument(snapshot), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return NextResponse.json({ consent: snapshot });
}
