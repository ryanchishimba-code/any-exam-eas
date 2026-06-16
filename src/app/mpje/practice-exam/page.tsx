import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

/** Legacy MPJE URLs → PANCE (MPJE removed from product). */
export default function MpjeLegacyRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  void searchParams;
  redirect("/exams/pance");
}
