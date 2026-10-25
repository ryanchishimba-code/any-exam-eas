#!/usr/bin/env node
/**
 * Upload FNP + PANCE Quick Bites private media via the temporary preview route.
 *
 *   BASE_URL=https://<preview-host> \
 *   QB_UPLOAD_SECRET='<plaintext secret>' \
 *   VERCEL_PROTECTION_BYPASS_SECRET='<optional automation bypass>' \
 *   node scripts/upload-qb-fnp-pance.mjs
 *
 * Local inputs (repo root):
 *   quick-bites-fnp/out/   — flat mp4 + vtt (not out/old-ep17/)
 *   quick-bites-pance/out/ — flat mp4 + vtt
 *
 * Uses @vercel/blob/client upload() with access: private. Never logs secrets.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { upload } from "@vercel/blob/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MEDIA_VERSION = "v1-20261025";
const FNP_OUT = path.join(ROOT, "quick-bites-fnp", "out");
const PANCE_OUT = path.join(ROOT, "quick-bites-pance", "out");
const UPLOAD_ROUTE = "/api/internal/qb-fnp-pance-upload";

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing required env: ${name}`);
    process.exit(1);
  }
  return value;
}

function uploadHeaders(secret) {
  const headers = { "x-qb-upload-secret": secret };
  const bypass = process.env.VERCEL_PROTECTION_BYPASS_SECRET?.trim();
  if (bypass) {
    headers["x-vercel-protection-bypass"] = bypass;
  }
  return headers;
}

function slugsFromCatalog(relativePath) {
  const text = readFileSync(path.join(ROOT, relativePath), "utf8");
  return [...text.matchAll(/slug: "(quick-bites-(?:fnp|pance)-[^"]+)"/g)].map((match) => match[1]);
}

function expectedPathnames() {
  const fnp = slugsFromCatalog("src/lib/quick-bites/fnp-catalog.ts").flatMap((slug) => [
    `quick-bites-fnp/${MEDIA_VERSION}/${slug}-web.mp4`,
    `quick-bites-fnp/${MEDIA_VERSION}/${slug}.vtt`,
  ]);
  const pance = slugsFromCatalog("src/lib/quick-bites/pance-catalog.ts").flatMap((slug) => [
    `quick-bites-pance/${MEDIA_VERSION}/${slug}-web.mp4`,
    `quick-bites-pance/${MEDIA_VERSION}/${slug}.vtt`,
  ]);
  const all = [...fnp, ...pance];
  if (all.length !== 76) {
    throw new Error(`Expected 76 upload pathnames, got ${all.length}`);
  }
  return all;
}

function listFlatMediaFiles(dir) {
  return readdirSync(dir).filter((name) => name.endsWith("-web.mp4") || name.endsWith(".vtt"));
}

function localPathForPathname(pathname) {
  const basename = pathname.split("/").pop();
  if (!basename) throw new Error(`Bad pathname: ${pathname}`);
  const baseDir = pathname.startsWith("quick-bites-fnp/") ? FNP_OUT : PANCE_OUT;
  return path.join(baseDir, basename);
}

function contentTypeForPathname(pathname) {
  if (pathname.endsWith("-web.mp4")) return "video/mp4";
  if (pathname.endsWith(".vtt")) return "text/vtt";
  return null;
}

async function verifyUpload(baseUrl, secret, pathname, expectedSize) {
  const url = new URL(UPLOAD_ROUTE, baseUrl);
  url.searchParams.set("pathname", pathname);
  const response = await fetch(url, { headers: uploadHeaders(secret) });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GET check failed for ${pathname}: ${response.status} ${body}`);
  }
  const meta = await response.json();
  const expectedType = contentTypeForPathname(pathname);
  if (meta.size !== expectedSize) {
    throw new Error(`Size mismatch for ${pathname}: expected ${expectedSize}, got ${meta.size}`);
  }
  if (meta.contentType !== expectedType) {
    throw new Error(
      `Type mismatch for ${pathname}: expected ${expectedType}, got ${meta.contentType}`
    );
  }
  if (meta.access && meta.access !== "private") {
    throw new Error(`Access mismatch for ${pathname}: expected private, got ${meta.access}`);
  }
}

async function main() {
  const baseUrl = requireEnv("BASE_URL").replace(/\/$/, "");
  const secret = requireEnv("QB_UPLOAD_SECRET");
  const handleUploadUrl = `${baseUrl}${UPLOAD_ROUTE}`;
  const headers = uploadHeaders(secret);

  for (const dir of [FNP_OUT, PANCE_OUT]) {
    if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) {
      console.error(`Missing directory: ${dir}`);
      process.exit(1);
    }
  }

  const pathnames = expectedPathnames();
  console.log(`Uploading ${pathnames.length} objects to ${handleUploadUrl}`);

  for (const pathname of pathnames) {
    const localFile = localPathForPathname(pathname);
    const size = statSync(localFile, { throwIfNoEntry: false })?.size;
    if (size == null) {
      throw new Error(`Missing local file: ${localFile}`);
    }
    if (size > 60 * 1024 * 1024) {
      throw new Error(`File exceeds 60 MB cap: ${localFile} (${size} bytes)`);
    }

    const body = readFileSync(localFile);
    const contentType = contentTypeForPathname(pathname);
    console.log(`→ ${pathname} (${size} bytes)`);

    await upload(pathname, body, {
      access: "private",
      handleUploadUrl,
      contentType,
      headers,
      multipart: size > 4.5 * 1024 * 1024,
    });

    await verifyUpload(baseUrl, secret, pathname, size);
  }

  console.log("All uploads verified.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
