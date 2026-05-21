import { NextResponse } from "next/server";
import { registerUser } from "@/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await registerUser(body);
    return NextResponse.json({ ok: true, userId: user.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
