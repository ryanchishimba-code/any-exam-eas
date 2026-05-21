import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  try {
    const checkout = await createCheckoutSession({
      customerEmail: session.user.email,
      userId: session.user.id,
      successUrl: `${origin}/dashboard?checkout=success`,
      cancelUrl: `${origin}/pricing?checkout=cancelled`,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
