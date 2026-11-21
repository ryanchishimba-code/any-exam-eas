import { createHash, timingSafeEqual } from "node:crypto";

export const MEDMATH_UPLOAD_SECRET_SHA256 =
  "a4f403e30c67aeb974a78fc8d524ad83c6f4cf8b98cb9fe75b08ebb54e690746";

const EXPECTED = Buffer.from(MEDMATH_UPLOAD_SECRET_SHA256, "hex");

export function isMedmathUploadSecret(headerValue: string | null | undefined): boolean {
  const digest = createHash("sha256").update((headerValue ?? "").trim(), "utf8").digest();
  return timingSafeEqual(digest, EXPECTED);
}
