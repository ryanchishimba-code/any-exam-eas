/** TEMPORARY. Remove after the Medical Math private upload is verified. */

import { head, BlobNotFoundError } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isMedmathUploadSecret } from "@/lib/quick-bites/medmath-upload-auth";
import {
  contentTypeForMedmathPath,
  medmathClientTokenConstraints,
} from "@/lib/quick-bites/medmath-upload-plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET_HEADER = "x-qb-upload-secret";

export async function POST(request: Request) {
  if (!isMedmathUploadSecret(request.headers.get(SECRET_HEADER))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body || body.type !== "blob.generate-client-token") {
    return NextResponse.json({ error: "Unsupported request" }, { status: 400 });
  }
  const pathname = body.payload?.pathname;
  if (typeof pathname !== "string" || !contentTypeForMedmathPath(pathname)) {
    return NextResponse.json({ error: "Path is not in the Medical Math upload plan" }, { status: 400 });
  }
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (requestedPath) => medmathClientTokenConstraints(requestedPath),
    });
    return NextResponse.json(jsonResponse);
  } catch {
    return NextResponse.json({ error: "Upload request failed" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  if (!isMedmathUploadSecret(request.headers.get(SECRET_HEADER))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pathname = new URL(request.url).searchParams.get("pathname");
  if (!pathname || !contentTypeForMedmathPath(pathname)) {
    return NextResponse.json({ error: "Unknown pathname" }, { status: 400 });
  }
  try {
    const info = await head(pathname);
    const url = typeof info.url === "string" ? info.url : "";
    return NextResponse.json({
      size: info.size,
      contentType: info.contentType,
      privateHost: url.includes(".private.blob.vercel-storage.com"),
    });
  } catch (error) {
    if (error instanceof BlobNotFoundError || (error instanceof Error && error.name === "BlobNotFoundError")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Metadata lookup failed" }, { status: 502 });
  }
}
