import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminPermission } from "@/lib/admin/auth";
import { getFeedbackById, setFeedbackResolved } from "@/lib/feedback/service";
import { sendSupportEmail } from "@/lib/email";
import { enforceRateLimit, enforceUserRateLimit } from "@/lib/api-rate-limit";
import { logAdminAction } from "@/lib/audit";

export const runtime = "nodejs";

const bodySchema = z.object({
  message: z.string().min(1).max(5000),
  markResolved: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, context: RouteContext) {
  const limited = enforceRateLimit(req, "admin-feedback-reply", 20, 60_000);
  if (limited) return limited;

  const auth = await requireAdminPermission("feedback.manage");
  if (auth instanceof NextResponse) return auth;

  const userLimited = enforceUserRateLimit(auth.userId, "admin-feedback-reply", 40, 60_000);
  if (userLimited) return userLimited;

  const { id } = await context.params;

  try {
    const body = bodySchema.parse(await req.json());
    const item = await getFeedbackById(id);

    if (!item) {
      return NextResponse.json({ error: "Feedback not found." }, { status: 404 });
    }

    const to = item.email;
    if (!to) {
      return NextResponse.json(
        { error: "This feedback has no email address to reply to." },
        { status: 400 }
      );
    }

    const subject = `Re: Your Any Exam Easy feedback`;
    const emailBody = [
      `Hi${item.name ? ` ${item.name}` : ""},`,
      "",
      "Thank you for your feedback. Here is our response:",
      "",
      body.message,
      "",
      "---",
      "Your original message:",
      item.message,
    ].join("\n");

    const delivery = await sendSupportEmail({
      to,
      subject,
      body: emailBody,
      replyTo: auth.email,
    });

    if (!delivery.ok) {
      return NextResponse.json(
        { error: "Reply could not be sent. Check Resend configuration." },
        { status: 502 }
      );
    }

    if (body.markResolved) {
      await setFeedbackResolved(id, true, auth.userId);
    }

    void logAdminAction({
      actorId: auth.userId,
      action: "ADMIN_FEEDBACK_REPLY",
      targetType: "feedback",
      targetId: id,
      req,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    console.error("[admin/feedback/reply]", e);
    return NextResponse.json({ error: "Could not send reply." }, { status: 500 });
  }
}
