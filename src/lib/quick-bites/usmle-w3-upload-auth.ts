import { createHash, timingSafeEqual } from "node:crypto";

/** SHA-256 of the trimmed upload header. The secret is not stored in the repo. */
export const USMLE_W3_UPLOAD_SECRET_SHA256 =
  "584461c61a571125ee3ad6b412c69095dad2d84a16695d55528eae6096905362";

const EXPECTED = Buffer.from(USMLE_W3_UPLOAD_SECRET_SHA256, "hex");

export function isUsmleW3UploadSecret(headerValue: string | null | undefined): boolean {
  const digest = createHash("sha256")
    .update((headerValue ?? "").trim(), "utf8")
    .digest();
  return timingSafeEqual(digest, EXPECTED);
}
