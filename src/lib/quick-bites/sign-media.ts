import { issueSignedToken, presignUrl } from "@vercel/blob";
import { QUICK_BITES_URL_TTL_MS } from "@/lib/quick-bites/catalog";

/** Short-lived GET URL for one private blob. The signing key never leaves the server. */
export async function signPrivateQuickBiteGet(pathname: string): Promise<string> {
  const validUntil = Date.now() + QUICK_BITES_URL_TTL_MS;
  const issued = await issueSignedToken({
    pathname,
    operations: ["get"],
    validUntil,
  });
  const { presignedUrl } = await presignUrl(issued, {
    operation: "get",
    pathname,
    access: "private",
    validUntil,
  });
  return presignedUrl;
}
