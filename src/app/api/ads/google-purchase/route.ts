import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { claimGoogleAdsCheckout, claimGoogleAdsSubscription } from "@/lib/analytics/google-ads-claim";
import { isStripeCheckoutSessionId, isStripeSubscriptionId } from "@/lib/analytics/google-ads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Confirm a paid Stripe subscription with Stripe, then return the conversion
 * payload once per transaction id. The body never accepts an email.
 */
export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ purchase: null }, { status: 401 });

  let body: { sessionId?: unknown; subscriptionId?: unknown };
  try {
    body = (await request.json()) as { sessionId?: unknown; subscriptionId?: unknown };
  } catch {
    return NextResponse.json({ purchase: null }, { status: 400 });
  }

  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
  const subscriptionId = typeof body.subscriptionId === "string" ? body.subscriptionId : null;
  if (!isStripeCheckoutSessionId(sessionId) && !isStripeSubscriptionId(subscriptionId)) {
    return NextResponse.json({ purchase: null }, { status: 400 });
  }

  try {
    const purchase = isStripeCheckoutSessionId(sessionId)
      ? await claimGoogleAdsCheckout(userId, sessionId)
      : await claimGoogleAdsSubscription(userId, subscriptionId as string);
    return NextResponse.json({ purchase });
  } catch (error) {
    console.error("[ads] purchase claim failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ purchase: null }, { status: 500 });
  }
}
