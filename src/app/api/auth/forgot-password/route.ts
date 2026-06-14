import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import {
  appBaseUrl,
  getEmailSetupWarnings,
  isEmailConfigured,
  isPasswordResetEmailReady,
  PASSWORD_RESET_UNAVAILABLE_MESSAGE,
} from "@/lib/email/config";
import { requestPasswordReset } from "@/lib/password-reset";
import {
  FORGOT_PASSWORD_SUCCESS_MESSAGE,
  forgotPasswordSchema,
} from "@/lib/validators/password-reset";

export const runtime = "nodejs";

let loggedEmailSetup = false;

/** Log Resend / URL misconfiguration once per server instance (visible in Vercel/AWS logs). */
function logEmailSetupOnce(): void {
  if (loggedEmailSetup) return;
  loggedEmailSetup = true;
  const warnings = getEmailSetupWarnings();
  if (warnings.length > 0) {
    console.warn("[forgot-password] Email setup issues:\n- " + warnings.join("\n- "));
  }
}

// Rate limit: 10 requests per IP per minute — mitigates email enumeration / spam.
export async function POST(req: Request) {
  const limited = await enforceRateLimit(req, "forgot-password", 10, 60_000);
  if (limited) return limited;

  logEmailSetupOnce();

  // Fail fast in production when Resend is not configured — avoids false "check your inbox" UX.
  if (process.env.NODE_ENV === "production" && !isPasswordResetEmailReady()) {
    console.error("[forgot-password] Blocked — email not configured for production", {
      resendConfigured: isEmailConfigured(),
      setupWarnings: getEmailSetupWarnings(),
    });
    return NextResponse.json({ error: PASSWORD_RESET_UNAVAILABLE_MESSAGE }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);
    const outcome = await requestPasswordReset(email);

    // Structured audit log — never expose userFound to the client (anti-enumeration).
    console.info("[forgot-password] Request handled", {
      resendConfigured: isEmailConfigured(),
      resetBaseUrl: appBaseUrl(),
      userFound: outcome.userFound,
      emailAttempted: outcome.attempted,
      emailDelivered: outcome.emailDelivered ?? false,
    });

    if (outcome.attempted && !outcome.emailDelivered) {
      console.error(
        "[forgot-password] Reset email was NOT delivered — check RESEND_API_KEY, EMAIL_FROM domain, and server logs above."
      );
    }

    const payload: {
      ok: true;
      message: string;
      devResetUrl?: string;
    } = {
      ok: true,
      message: FORGOT_PASSWORD_SUCCESS_MESSAGE,
    };

    // Dev-only: surface reset link when Resend is not configured (local testing).
    if (process.env.NODE_ENV === "development" && outcome.devResetUrl) {
      payload.devResetUrl = outcome.devResetUrl;
    }

    return NextResponse.json(payload);
  } catch (e) {
    if (e instanceof ZodError) {
      const message = e.errors[0]?.message ?? "Invalid email.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error("[forgot-password] Unexpected error:", e);
    return NextResponse.json(
      { error: "Could not process request. Please try again." },
      { status: 500 }
    );
  }
}
