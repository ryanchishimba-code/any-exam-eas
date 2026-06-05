import { NextResponse } from "next/server";
import { verifyEmailWithToken } from "@/lib/email-verification";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(
      new URL("/login?verify=missing", process.env.NEXTAUTH_URL ?? "http://localhost:3000")
    );
  }

  const ok = await verifyEmailWithToken(token);
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return NextResponse.redirect(
    new URL(ok ? "/studygub?verified=1" : "/login?verify=invalid", base)
  );
}
