import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ slug: string }> };

/**
 * Serve blog cover bytes from the DB so index/detail HTML does not inline
 * multi-megabyte data: URLs (which balloons /blog to ~3MB).
 */
export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;
  if (!slug?.trim()) {
    return new NextResponse(null, { status: 404 });
  }

  const row = await prisma.blogPost.findFirst({
    where: { slug, published: true, deletedAt: null },
    select: { coverImage: true },
  });

  const cover = row?.coverImage?.trim();
  if (!cover) {
    return new NextResponse(null, { status: 404 });
  }

  if (/^https?:\/\//i.test(cover)) {
    return NextResponse.redirect(cover, 302);
  }

  const match = /^data:([^;,]+);base64,([\s\S]+)$/i.exec(cover);
  if (!match) {
    return new NextResponse(null, { status: 404 });
  }

  const contentType = match[1].trim() || "application/octet-stream";
  let bytes: Buffer;
  try {
    bytes = Buffer.from(match[2], "base64");
  } catch {
    return new NextResponse(null, { status: 404 });
  }

  if (bytes.length === 0) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "Content-Length": String(bytes.length),
    },
  });
}
