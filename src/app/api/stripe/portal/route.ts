import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBillingPortalSession } from "@/lib/stripe";
import { requireSessionGuard } from "@/lib/session-guard";

export async function POST(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  const sub = await prisma.subscription.findUnique({
    where: { userId: guard.userId },
  });

  if (!sub?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account yet. Add a payment method from checkout or pricing first." },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const intent = body?.intent === "payment_method" ? "payment_method" : "manage";

  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  try {
    const portal = await createBillingPortalSession({
      stripeCustomerId: sub.stripeCustomerId,
      returnUrl: `${origin}/settings`,
      intent,
    });
    return NextResponse.json({ url: portal.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Billing portal failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
