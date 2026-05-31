type PasswordResetEmailParams = {
  to: string;
  resetUrl: string;
};

/**
 * Sends password reset email via Resend when RESEND_API_KEY is set.
 * In development without Resend, logs the link (see password-reset.ts).
 */
export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: PasswordResetEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[email] RESEND_API_KEY is not set — password reset email was not sent."
      );
    }
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Reset your Any Exam Easy password",
      html: `
        <p>You requested a password reset for your Any Exam Easy account.</p>
        <p><a href="${resetUrl}">Reset your password</a></p>
        <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
        <p style="color:#666;font-size:12px">Or copy this URL: ${resetUrl}</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to send email (${res.status}): ${body}`);
  }
}

type MagicLinkEmailParams = {
  to: string;
  signInUrl: string;
  name?: string | null;
};

export async function sendMagicLinkEmail({
  to,
  signInUrl,
  name,
}: MagicLinkEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
  const greeting = name?.trim() ? `Hi ${name.split(/\s+/)[0]},` : "Hi there,";

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[email] RESEND_API_KEY missing — magic link email not sent.");
    }
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Your secure sign-in link — Any Exam Easy",
      html: `
        <p>${greeting}</p>
        <p>Click below to sign in to Any Exam Easy. This link expires in 15 minutes and works once.</p>
        <p><a href="${signInUrl}">Sign in securely</a></p>
        <p>If you did not request this, you can ignore this email.</p>
        <p style="color:#666;font-size:12px">${signInUrl}</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to send magic link email (${res.status}): ${body}`);
  }
}

type VerificationEmailParams = {
  to: string;
  verifyUrl: string;
};

export async function sendVerificationEmail({
  to,
  verifyUrl,
}: VerificationEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[email] RESEND_API_KEY missing — verification email not sent.");
    }
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Verify your Any Exam Easy email",
      html: `
        <p>Thanks for signing up. Please verify your email to unlock full access.</p>
        <p><a href="${verifyUrl}">Verify email address</a></p>
        <p>This link expires in 48 hours.</p>
        <p style="color:#666;font-size:12px">${verifyUrl}</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to send verification email (${res.status}): ${body}`);
  }
}
