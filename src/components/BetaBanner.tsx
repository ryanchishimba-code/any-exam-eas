import { BETA_MESSAGE, SITE_IN_BETA } from "@/lib/site";

export function BetaBanner() {
  if (!SITE_IN_BETA) return null;

  return (
    <div
      className="border-b border-violet-200/70 bg-violet-50/95 text-center backdrop-blur-sm"
      role="status"
    >
      <p className="mx-auto max-w-3xl px-4 py-2 text-[0.8125rem] leading-snug text-violet-950">
        <span className="mr-2 inline-flex rounded-full bg-violet-600 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-white">
          Beta
        </span>
        {BETA_MESSAGE}
      </p>
    </div>
  );
}
