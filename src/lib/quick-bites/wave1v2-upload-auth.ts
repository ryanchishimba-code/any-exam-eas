import { createHash, timingSafeEqual } from "node:crypto";

/**
 * SHA-256 of the trimmed `x-qb-upload-secret` header.
 * The secret itself is not stored in the repo.
 */
export const QB_WAVE1V2_UPLOAD_SECRET_SHA256 =
  "90ccab7b7e06aa02c0285e300dba62334c62f2490fbe4920ce7aa6fb85ab88a6";

const EXPECTED_DIGEST = Buffer.from(QB_WAVE1V2_UPLOAD_SECRET_SHA256, "hex");

export function isQbWave1V2UploadSecret(headerValue: string | null | undefined): boolean {
  const digest = createHash("sha256")
    .update((headerValue ?? "").trim(), "utf8")
    .digest();
  return timingSafeEqual(digest, EXPECTED_DIGEST);
}
