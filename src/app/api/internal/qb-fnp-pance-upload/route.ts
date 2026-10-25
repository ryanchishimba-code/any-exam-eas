/**
 * TEMPORARY upload helper for Quick Bites FNP + PANCE private media.
 * Remove this route before merge. It only mints client tokens and reads
 * metadata for the 76 private blobs. The server read-write token stays
 * in the deployment environment and is never logged or returned.
 *
 * The upload-completed callback is not registered and is not accepted.
 */

import { head, BlobNotFoundError } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isQbFnpPanceUploadSecret } from "@/lib/quick-bites/fnp-pance-upload-auth";
import {
  contentTypeForFnpPancePath,
  fnpPanceClientTokenConstraints,
} from "@/lib/quick-bites/fnp-pance-upload-plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET_HEADER = "x-qb-upload-secret";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function isNotFound(error: unknown): boolean {
  return (
    error instanceof BlobNotFoundError ||
    (error instanceof Error && error.name === "BlobNotFoundError")
  );
}

export async function POST(request: Request) {
  if (!isQbFnpPanceUploadSecret(request.headers.get(SECRET_HEADER))) {
    return unauthorized();
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || body.type !== "blob.generate-client-token") {
    return NextResponse.json({ error: "Unsupported request" }, { status: 400 });
  }

  const pathname = body.payload?.pathname;
  if (typeof pathname !== "string" || !contentTypeForFnpPancePath(pathname)) {
    return NextResponse.json({ error: "Path is not in the FNP/PANCE upload plan" }, { status: 400 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (requestedPath) => fnpPanceClientTokenConstraints(requestedPath),
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    if (error instanceof Error && error.message === "Path is not in the FNP/PANCE upload plan") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Upload request failed" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  if (!isQbFnpPanceUploadSecret(request.headers.get(SECRET_HEADER))) {
    return unauthorized();
  }

  const pathname = new URL(request.url).searchParams.get("pathname");
  if (!pathname || !contentTypeForFnpPancePath(pathname)) {
    return NextResponse.json({ error: "Unknown pathname" }, { status: 400 });
  }

  try {
    const info = await head(pathname);
    const access = (info as { access?: unknown }).access;
    return NextResponse.json({
      size: info.size,
      contentType: info.contentType,
      ...(typeof access === "string" ? { access } : {}),
    });
  } catch (error) {
    if (isNotFound(error)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Metadata lookup failed" }, { status: 502 });
  }
}
