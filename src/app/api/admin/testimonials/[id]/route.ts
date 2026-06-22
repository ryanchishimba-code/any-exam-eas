import { NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/admin/auth";
import { updateTestimonialSchema } from "@/lib/admin/testimonials-validators";
import {
  softDeleteTestimonial,
  updateTestimonial,
} from "@/lib/admin/testimonials-admin";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/testimonials/:id — update fields, change moderation status,
 * toggle featured, reorder, or soft-delete / restore via `{ deleted: boolean }`.
 */
export async function PATCH(req: Request, { params }: RouteContext) {
  const auth = await requireAdminPermission("admin.actions");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateTestimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid update." },
      { status: 400 }
    );
  }

  try {
    const item = await updateTestimonial(id, parsed.data);
    if (!item) {
      return NextResponse.json({ error: "Testimonial not found." }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (err) {
    console.error("[admin/testimonials] update failed", err);
    return NextResponse.json({ error: "Failed to update testimonial." }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/testimonials/:id — soft delete (recoverable). The client
 * surfaces an "Undo" that re-PATCHes `{ deleted: false }`.
 */
export async function DELETE(_req: Request, { params }: RouteContext) {
  const auth = await requireAdminPermission("admin.actions");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  try {
    const ok = await softDeleteTestimonial(id);
    if (!ok) {
      return NextResponse.json({ error: "Testimonial not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[admin/testimonials] delete failed", err);
    return NextResponse.json({ error: "Failed to delete testimonial." }, { status: 500 });
  }
}
