import type { Metadata } from "next";
import { confirmDailyLeadAction } from "@/lib/marketing/daily-question-lead-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confirm daily question email",
  robots: { index: false, follow: false },
};

export default async function DailyConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; done?: string }>;
}) {
  const params = await searchParams;
  const done = params.done;
  const token = params.token?.trim() ?? "";

  return (
    <main className="aee-daily-mail">
      <h1>{done === "1" ? "Email confirmed" : done === "0" ? "Link not valid" : "Confirm your email"}</h1>
      {done === "1" ? (
        <p>This address is confirmed. The daily question stays on the site. We do not email one.</p>
      ) : done === "0" ? (
        <p>That confirmation link is missing or no longer valid. Request a new one from a daily question page.</p>
      ) : token ? (
        <>
          <p>Confirm this address. We do not email a question each day.</p>
          <form action={confirmDailyLeadAction}>
            <input type="hidden" name="token" value={token} />
            <button type="submit">Confirm email</button>
          </form>
        </>
      ) : (
        <p>Open the confirmation link from your email.</p>
      )}
    </main>
  );
}
