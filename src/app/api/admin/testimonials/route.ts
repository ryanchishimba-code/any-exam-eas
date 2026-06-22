import { NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/admin/auth";
import { createTestimonialSchema } from "@/lib/admin/testimonials-validators";
import { createTestimonial, listTestimonials } from "@/lib/admin/testimonials-admin";

export const dynamic = "force-dynamic";

/** GET /api/admin/testimonials?includeDeleted=&status= — list for the admin GUI. */
export async function GET(req: Request) {
  const auth = await requireAdminPermission("admin.actions");
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const includeDeleted = url.searchParams.get("includeDeleted") === "true";
  const status = url.searchParams.get("status") ?? undefined;

  try {
    const items = await listTestimonials({ includeDeleted, status });
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[admin/testimonials] list failed", err);
    return NextResponse.json({ error: "Failed to load testimonials." }, { status: 500 });
  }
}

/** POST /api/admin/testimonials — create a new testimonial (starts as pending). */
export async function POST(req: Request) {
  const auth = await requireAdminPermission("admin.actions");
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = createTestimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid testimonial." },
      { status: 400 }
    );
  }

  try {
    const item = await createTestimonial(parsed.data, auth.userId);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("[admin/testimonials] create failed", err);
    return NextResponse.json({ error: "Failed to create testimonial." }, { status: 500 });
  }
}
