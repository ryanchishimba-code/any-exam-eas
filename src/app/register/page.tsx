import { redirect } from "next/navigation";

/** Alias for signup with promo support. */
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; promo?: string }>;
}) {
  const { plan, promo } = await searchParams;
  const qs = new URLSearchParams();
  if (plan) qs.set("plan", plan);
  if (promo) qs.set("promo", promo);
  const q = qs.toString();
  redirect(q ? `/signup?${q}` : "/signup?plan=trial");
}
