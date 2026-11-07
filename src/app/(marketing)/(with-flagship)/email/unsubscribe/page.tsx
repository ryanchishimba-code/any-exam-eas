import type { Metadata } from "next";
import { unsubscribeMarketingAction } from "@/lib/email/marketing-unsubscribe-action";
import { readMarketingUnsubscribeToken } from "@/lib/email/marketing-preference";
import { LEGAL_ENTITY } from "@/lib/legal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unsubscribe — AnyExamEasy",
  robots: { index: false, follow: false },
};

export default async function MarketingUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; done?: string }>;
}) {
  const params = await searchParams;
  const done = params.done;
  const token = params.token?.trim() ?? "";
  const userId = token ? safeUserId(token) : null;

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-5 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0f766e]">AnyExamEasy</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0f172a]">
        {done === "1" ? "You are unsubscribed" : done === "0" || (token && !userId) ? "Link not valid" : "Unsubscribe"}
      </h1>
      {done === "1" ? (
        <p className="mt-4 text-[15px] leading-relaxed text-[#3f4a5a]">
          Trial reminders and the welcome note will stop. Password, verification, payment, and cancellation emails still send.
        </p>
      ) : done === "0" || (token && !userId) ? (
        <p className="mt-4 text-[15px] leading-relaxed text-[#3f4a5a]">
          That unsubscribe link is missing or no longer valid. Reply to {LEGAL_ENTITY.supportEmail} and we will stop the extra mail.
        </p>
      ) : userId ? (
        <>
          <p className="mt-4 text-[15px] leading-relaxed text-[#3f4a5a]">
            Stop trial reminders and the welcome note. Account and billing emails are not affected.
          </p>
          <form action={unsubscribeMarketingAction} className="mt-6">
            <input type="hidden" name="token" value={token} />
            <button
              type="submit"
              className="inline-flex rounded-xl bg-[#111827] px-5 py-3.5 text-sm font-semibold text-white"
            >
              Unsubscribe
            </button>
          </form>
        </>
      ) : (
        <p className="mt-4 text-[15px] leading-relaxed text-[#3f4a5a]">
          Open the unsubscribe link from your email.
        </p>
      )}
    </main>
  );
}

function safeUserId(token: string): string | null {
  try {
    return readMarketingUnsubscribeToken(token);
  } catch {
    return null;
  }
}
