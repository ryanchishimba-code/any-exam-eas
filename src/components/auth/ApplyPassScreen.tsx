import Link from "next/link";
import { AuthFocusLayout } from "@/components/auth/AuthFocusLayout";
import { applyPassAction } from "@/lib/promo/apply-pass-action";
import { passCodeHelp, isFacultyAccessCode, FACULTY_ACCESS_DAYS } from "@/lib/promo/faculty-access";

const RESULT_COPY: Record<string, string> = {
  applied:
    "Your free access is on this account. No card was taken, and this access will not charge you.",
  paid: "This account already has a paid plan. The code was not used, and nothing was charged.",
  already: "This account already used this code. Nothing else was applied.",
  used: "This code has reached its limit. Nothing was applied.",
  expired: "This code has expired. Nothing was applied.",
  inactive: "This code is not active. Nothing was applied.",
  missing: "This account has no plan to update. Nothing was applied.",
  invalid: "Enter a valid pass code.",
  not_found: "That code was not found. Nothing was applied.",
  not_a_pass: "That code is not an access pass. Nothing was applied.",
};

export function ApplyPassScreen({ code, result }: { code: string; result?: string }) {
  const faculty = isFacultyAccessCode(code);
  const message = result ? RESULT_COPY[result] : undefined;
  const applied = result === "applied";

  return (
    <AuthFocusLayout
      title={faculty ? "Faculty access" : "Apply a pass code"}
      offer={
        faculty
          ? `${FACULTY_ACCESS_DAYS} days of Pro. No card.`
          : "No card. No charge."
      }
    >
      <div className="aee-auth-fields">
        {message ? (
          <p className="text-sm text-[#334155]" role="status">
            {message}
          </p>
        ) : null}
        {applied ? (
          <Link href="/dashboard" className="aee-auth-submit">
            Go to your dashboard
          </Link>
        ) : (
          <form action={applyPassAction} className="aee-auth-fields">
            <input type="hidden" name="code" value={code} />
            <p className="text-sm text-[#334155]">{passCodeHelp(code)}</p>
            <p className="text-sm font-semibold tracking-wide text-[#0f172a]">{code}</p>
            <button type="submit" className="aee-auth-submit">
              {faculty ? "Apply 30 days free" : "Apply pass"}
            </button>
          </form>
        )}
      </div>
    </AuthFocusLayout>
  );
}
