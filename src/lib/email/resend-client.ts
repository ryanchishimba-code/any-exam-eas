import {
  getEmailFromAddress,
  type EmailDeliveryResult,
} from "@/lib/email/config";

export type TransactionalEmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Resend tags for observability (optional). */
  tags?: { name: string; value: string }[];
};

export async function sendTransactionalEmail(
  params: TransactionalEmailPayload
): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = getEmailFromAddress();

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[email] RESEND_API_KEY missing — email not sent.", {
        subject: params.subject,
        toDomain: params.to.split("@")[1] ?? "unknown",
      });
    }
    return { ok: false, reason: "not_configured" };
  }

  try {
    const body: Record<string, unknown> = {
      from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
    };
    if (params.tags?.length) {
      body.tags = params.tags;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const bodyText = await res.text();
    if (!res.ok) {
      console.error("[email] Send failed:", params.subject, res.status, bodyText);
      return { ok: false, reason: "send_failed", detail: bodyText.slice(0, 200) };
    }

    let messageId: string | undefined;
    try {
      const parsed = JSON.parse(bodyText) as { id?: string };
      messageId = parsed.id;
    } catch {
      /* ignore */
    }

    return { ok: true, provider: "resend", messageId };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: "send_failed", detail };
  }
}
