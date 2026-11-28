import { redirect } from "next/navigation";

/** Legacy MPJE practice URL. Same canonical as /mpje. */
export default function MpjeLegacyRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  void searchParams;
  redirect("/naplex");
}
