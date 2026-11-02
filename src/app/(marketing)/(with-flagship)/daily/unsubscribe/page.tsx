import type { Metadata } from "next";
import { unsubscribeDailyLeadAction } from "@/lib/marketing/daily-question-lead-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unsubscribe from the daily question",
  robots: { index: false, follow: false },
};

export default async function DailyUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; done?: string }>;
}) {
  const params = await searchParams;
  const done = params.done;
  const token = params.token?.trim() ?? "";

  return (
    <main className="aee-daily-mail">
      <h1>{done === "1" ? "Unsubscribed" : done === "0" ? "Link not valid" : "Unsubscribe"}</h1>
      {done === "1" ? (
        <p>This address will not receive the daily question. You can sign up again later from a question page.</p>
      ) : done === "0" ? (
        <p>That unsubscribe link is missing or no longer valid.</p>
      ) : token ? (
        <>
          <p>Stop the daily question email for this address.</p>
          <form action={unsubscribeDailyLeadAction}>
            <input type="hidden" name="token" value={token} />
            <button type="submit">Unsubscribe</button>
          </form>
        </>
      ) : (
        <p>Open the unsubscribe link from your email.</p>
      )}
    </main>
  );
}
