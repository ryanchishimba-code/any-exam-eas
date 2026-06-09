import { CreditCard } from "lucide-react";

const badges = [
  { id: "cards", label: "Cards", detail: "Visa · MC · Amex" },
  { id: "apple_pay", label: "Apple Pay" },
  { id: "google_pay", label: "Google Pay" },
] as const;

function GooglePayWordmark() {
  return (
    <span className="text-[0.75rem] font-semibold leading-none" aria-hidden>
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
      <span className="text-slate-700"> Pay</span>
    </span>
  );
}

/** Compact payment-method trust row for landing, pricing, and checkout. */
export function PaymentMethodBadges({
  className = "",
  size = "default",
}: {
  className?: string;
  size?: "default" | "sm";
}) {
  const pad = size === "sm" ? "px-2.5 py-1.5" : "px-3 py-2";
  const text = size === "sm" ? "text-[0.6875rem]" : "text-xs";

  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-2 lg:justify-start ${className}`}
      aria-label="Accepted payment methods: credit cards, Apple Pay, and Google Pay"
    >
      {badges.map((badge) => (
        <li
          key={badge.id}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/90 ${pad} shadow-sm`}
        >
          {badge.id === "cards" ? (
            <>
              <CreditCard className="h-4 w-4 text-slate-600" aria-hidden />
              <span className={`${text} font-medium text-slate-700`}>{badge.label}</span>
              {"detail" in badge && badge.detail ? (
                <span className="hidden text-[0.625rem] text-slate-400 sm:inline">
                  {badge.detail}
                </span>
              ) : null}
            </>
          ) : badge.id === "google_pay" ? (
            <GooglePayWordmark />
          ) : (
            <span className={`${text} font-semibold text-slate-900`}>{badge.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
