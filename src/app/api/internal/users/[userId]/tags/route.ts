import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { addInternalTag, removeInternalTag } from "@/lib/crm/notes";
import { logAdminAction } from "@/lib/audit";

type Params = { params: Promise<{ userId: string }> };

export async function POST(req: Request, { params }: Params) {
  const auth = await requireInternalPermission("crm.edit_tags");
  if (auth instanceof NextResponse) return auth;

  const { userId } = await params;
  const { tag } = await req.json();
  if (!tag?.trim()) {
    return NextResponse.json({ error: "Tag required" }, { status: 400 });
  }

  const created = await addInternalTag({
    userId,
    tag,
    createdById: auth.userId,
  });

  void logAdminAction({
    actorId: auth.userId,
    action: "ADD_USER_TAG",
    targetType: "user",
    targetId: userId,
    metadata: { tag },
    req,
  });

  return NextResponse.json({ tag: created });
}

export async function DELETE(req: Request, { params }: Params) {
  const auth = await requireInternalPermission("crm.edit_tags");
  if (auth instanceof NextResponse) return auth;

  const { userId } = await params;
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  if (!tag) {
    return NextResponse.json({ error: "Tag query param required" }, { status: 400 });
  }

  await removeInternalTag(userId, tag);

  void logAdminAction({
    actorId: auth.userId,
    action: "REMOVE_USER_TAG",
    targetType: "user",
    targetId: userId,
    metadata: { tag },
    req,
  });

  return NextResponse.json({ ok: true });
}
