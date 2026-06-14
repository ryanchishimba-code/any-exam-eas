import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { validateDiscount } from "@/lib/discount";
import { sanitizeDiscountForPublic } from "@/lib/discount/public-response";
import type { SignupPlan } from "@/lib/validators/auth";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { z } from "zod";

export const runtime = "nodejs";

const DISCOUNT_VALIDATE_LIMIT = 20;
const DISCOUNT_VALIDATE_WINDOW_MS = 60_000;

const querySchema = z.object({
  code: z.string().max(32),
  plan: z.enum(["trial", "subscribe"]).optional(),
});

const bodySchema = z.object({
  code: z.string().max(32),
  plan: z.enum(["trial", "subscribe"]).optional(),
});

function parsePlan(value: unknown): SignupPlan | undefined {
  if (value === "trial" || value === "subscribe") return value;
  return undefined;
}

/**
 * GET /api/discount/validate?code=WELCOME10&plan=subscribe
 * Real-time validation (debounced from client). Optional auth for already-redeemed check.
 */
export async function GET(req: Request) {
  const limited = enforceRateLimit(req, "discount-validate", DISCOUNT_VALIDATE_LIMIT, DISCOUNT_VALIDATE_WINDOW_MS);
  if (limited) return limited;

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    code: url.searchParams.get("code") ?? "",
    plan: url.searchParams.get("plan") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        valid: false,
        code: "",
        errorCode: "empty",
        message: "Enter a discount code.",
        fullAccessIncluded: true,
      },
      { status: 400 }
    );
  }

  const session = await auth();
  try {
    const result = await validateDiscount({
      code: parsed.data.code,
      plan: parsePlan(parsed.data.plan),
      userId: session?.user?.id,
    });
    return NextResponse.json(sanitizeDiscountForPublic(result));
  } catch {
    return NextResponse.json(
      {
        valid: false,
        code: parsed.data.code.toUpperCase(),
        errorCode: "server_error",
        message: "We couldn't verify this code right now. Try again or continue without it — full access is unchanged.",
        plan: parsePlan(parsed.data.plan),
        fullAccessIncluded: true,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/discount/validate
 * Body: { code: string, plan?: "trial" | "subscribe" }
 * Explicit apply from UI; includes per-user redemption check when signed in.
 */
export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "discount-validate", DISCOUNT_VALIDATE_LIMIT, DISCOUNT_VALIDATE_WINDOW_MS);
  if (limited) return limited;

  const session = await auth();
  const body = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        valid: false,
        code: "",
        errorCode: "empty",
        message: "Enter a discount code.",
        fullAccessIncluded: true,
      },
      { status: 400 }
    );
  }

  try {
    const result = await validateDiscount({
      code: parsed.data.code,
      plan: parsePlan(parsed.data.plan),
      userId: session?.user?.id,
    });
    return NextResponse.json(sanitizeDiscountForPublic(result));
  } catch {
    return NextResponse.json(
      {
        valid: false,
        code: String(parsed.data.code).toUpperCase(),
        errorCode: "server_error",
        message: "We couldn't verify this code right now. Try again or continue without it — full access is unchanged.",
        plan: parsePlan(parsed.data.plan),
        fullAccessIncluded: true,
      },
      { status: 500 }
    );
  }
}
