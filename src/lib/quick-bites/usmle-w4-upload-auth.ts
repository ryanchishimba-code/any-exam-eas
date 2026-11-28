import { createHash, timingSafeEqual } from "node:crypto";

/** SHA-256 of the trimmed upload header. The secret is not stored in the repo. */
export const USMLE_W4_UPLOAD_SECRET_SHA256 =
  "a19befd51b77cd86582d7bbc4dd7d775ca2ad7af7b5b1050a17a76eb9cff5f0e";

const EXPECTED = Buffer.from(USMLE_W4_UPLOAD_SECRET_SHA256, "hex");

export function isUsmleW4UploadSecret(headerValue: string | null | undefined): boolean {
  const digest = createHash("sha256")
    .update((headerValue ?? "").trim(), "utf8")
    .digest();
  return timingSafeEqual(digest, EXPECTED);
}
