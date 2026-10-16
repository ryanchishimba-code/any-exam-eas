/** Host of the private Blob store. Unsigned URLs on this host are rejected. */
export const QUICK_BITES_PRIVATE_BLOB_ORIGIN =
  "https://iiuq2awk7g8oulze.private.blob.vercel-storage.com";

export function unsignedQuickBiteUrl(pathname: string): string {
  return `${QUICK_BITES_PRIVATE_BLOB_ORIGIN}/${pathname}`;
}
