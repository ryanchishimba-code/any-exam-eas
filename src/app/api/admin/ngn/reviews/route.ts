import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminPermission } from "@/lib/admin/auth";
import { isNgnPilotEnabled } from "@/lib/assessment/pilot-flag";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const rubricScore = z.number().int().min(1).max(4);
const bodySchema = z.object({
  itemId: z.string().trim().min(1).max(80),
  itemVersion: z.number().int().positive(),
  reviewerName: z.string().trim().min(1).max(120),
  licenseType: z.string().trim().min(1).max(40),
  licenseNumber: z.string().trim().min(1).max(40),
  licenseState: z.string().trim().min(1).max(40),
  multistateNlc: z.boolean(),
  nursysVerifiedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nursysResult: z.string().trim().min(1).max(500),
  decision: z.enum(["approve", "revise", "reject"]),
  rubric: z.object({
    A: rubricScore,
    B: rubricScore,
    C: rubricScore,
    D: rubricScore,
    E: rubricScore,
    F: rubricScore,
    G: rubricScore,
    H: rubricScore,
    I: rubricScore,
    J: rubricScore,
  }),
  flagResolutions: z.record(z.string(), z.string().trim().min(1).max(2000)),
  comments: z.string().max(8000).optional().default(""),
  minutesSpent: z.number().int().min(1).max(600),
});

export async function POST(req: Request) {
  if (!isNgnPilotEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const admin = await requireAdminPermission("questions.edit");
  if (admin instanceof NextResponse) return admin;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the review form and try again." }, { status: 400 });
  }
  const body = parsed.data;

  try {
    const item = await prisma.ngnItem.findUnique({
      where: { id_version: { id: body.itemId, version: body.itemVersion } },
      select: { id: true, rnFlags: true },
    });
    if (!item) return NextResponse.json({ error: "Item not found." }, { status: 404 });
    const flags = Array.isArray(item.rnFlags)
      ? item.rnFlags.filter((flag): flag is string => typeof flag === "string")
      : [];
    const missing = flags.filter((flag) => !body.flagResolutions[flag]?.trim());
    if (missing.length > 0) {
      return NextResponse.json({ error: "Write one resolution for each RN flag." }, { status: 400 });
    }

    const review = await prisma.ngnItemReview.create({
      data: {
        itemId: body.itemId,
        itemVersion: body.itemVersion,
        reviewerUserId: admin.userId,
        reviewerName: body.reviewerName,
        licenseType: body.licenseType,
        licenseNumber: body.licenseNumber,
        licenseState: body.licenseState,
        multistateNlc: body.multistateNlc,
        nursysVerifiedOn: new Date(`${body.nursysVerifiedOn}T00:00:00.000Z`),
        nursysResult: body.nursysResult,
        decision: body.decision,
        rubric: body.rubric,
        flagResolutions: body.flagResolutions,
        comments: body.comments,
        minutesSpent: body.minutesSpent,
      },
      select: { id: true },
    });
    return NextResponse.json({ id: review.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/append-only/i.test(message)) {
      return NextResponse.json({ error: "Reviews cannot be changed." }, { status: 409 });
    }
    return NextResponse.json({ error: "The review could not be saved." }, { status: 500 });
  }
}
