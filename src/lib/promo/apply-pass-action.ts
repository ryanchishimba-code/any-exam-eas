"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { normalizePassCode } from "@/lib/promo/free-pass";
import { redeemPassForExistingUser } from "@/lib/promo/redeem-free-pass";

export async function applyPassAction(formData: FormData): Promise<void> {
  const code = normalizePassCode(String(formData.get("code") ?? ""));
  const session = await auth();
  if (!session?.user?.id || !code) {
    redirect(code ? `/signup?code=${encodeURIComponent(code)}&pass=invalid` : "/signup");
  }
  const result = await redeemPassForExistingUser(session.user.id, code);
  const status = result.ok ? "applied" : result.reason;
  redirect(`/signup?code=${encodeURIComponent(code)}&pass=${status}`);
}
