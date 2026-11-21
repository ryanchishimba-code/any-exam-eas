import { permanentRedirect } from "next/navigation";
import { USMLE_QUICK_BITES_PATH } from "@/lib/quick-bites/usmle-flags";

export const dynamic = "force-dynamic";

/** Old URL. Permanent redirect so existing links still open the text library. */
export default async function UsmleQuickBitesRedirect({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const { step } = await searchParams;
  const query = step ? `?step=${encodeURIComponent(step)}` : "";
  permanentRedirect(`${USMLE_QUICK_BITES_PATH}${query}`);
}
