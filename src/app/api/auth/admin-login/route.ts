import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyUserPassword } from "@/lib/user-auth";
import { loginSchema } from "@/lib/validators/auth";
import { hasMinRole } from "@/lib/permissions";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { logAdminAction } from "@/lib/audit";

export const runtime = "nodejs";

const bodySchema = loginSchema.extend({
  callbackUrl: z.string().optional(),
});

/**
 * Pre-validates admin credentials before client completes NextAuth signIn.
 * Does not create a session — client must call signIn("credentials") on success.
 */
export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "admin-login", 8, 60_000);
  if (limited) return limited;

  try {
    const body = bodySchema.parse(await req.json());
    const user = await verifyUserPassword(body.email, body.password);

    if (!user || user.accountStatus === "suspended") {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!hasMinRole(user.role, "admin")) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    void logAdminAction({
      actorId: user.id,
      action: "ADMIN_LOGIN_ATTEMPT_OK",
      req,
      metadata: { method: "admin-login-api" },
    });

    return NextResponse.json({
      ok: true,
      email: user.email,
      role: user.role,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Invalid request." },
        { status: 400 }
      );
    }
    console.error("[admin-login]", e);
    return NextResponse.json({ error: "Could not sign in." }, { status: 500 });
  }
}
