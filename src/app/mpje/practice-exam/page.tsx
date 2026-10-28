import { redirect } from "next/navigation";

/** Legacy MPJE URLs → PANCE (MPJE removed from product). */
export default function MpjeLegacyRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  void searchParams;
  redirect("/exams/pance");
}
