"use client";

import {
  createContext,
  Suspense,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence } from "framer-motion";
import { TrialWelcomeScreen } from "@/components/auth/TrialWelcomeScreen";
import {
  clearTrialWelcomePending,
  peekTrialWelcomePending,
} from "@/lib/client/trial-welcome";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { resolveDisplayedTrial } from "@/lib/auth/trial-welcome-math";
import { fetchSubscriptionStatus } from "@/lib/client/post-login";
import { analytics } from "@/lib/analytics";

type TrialWelcomeGate = {
  active: boolean;
  /** False until the client has checked the session flag after mount. */
  resolved: boolean;
};

const TrialWelcomeContext = createContext<TrialWelcomeGate>({ active: false, resolved: false });

export function useTrialWelcome(): TrialWelcomeGate {
  return useContext(TrialWelcomeContext);
}

export function useTrialWelcomeActive() {
  return useTrialWelcome().active;
}

type TrialWelcomeHostProps = {
  onActiveChange?: (gate: TrialWelcomeGate) => void;
};

/** Inline dashboard welcome after login — renders instantly from session flag. */
export function TrialWelcomeHost({ onActiveChange }: TrialWelcomeHostProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const validated = useRef(false);

  // Do not read window/sessionStorage in the initial state. Server HTML and
  // the first client render must match; the layout effect below opens the
  // welcome before paint when the flag is actually set.
  const [visible, setVisible] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(TRIAL_DAYS);
  const [trialDays, setTrialDays] = useState(TRIAL_DAYS);
  const [showVerifyPrompt, setShowVerifyPrompt] = useState(false);
  const [verifyRequired, setVerifyRequired] = useState(false);
  const [resolved, setResolved] = useState(false);

  useLayoutEffect(() => {
    onActiveChange?.({ active: visible, resolved });
  }, [onActiveChange, resolved, visible]);

  useLayoutEffect(() => {
    setResolved(true);
  }, []);

  useLayoutEffect(() => {
    if (validated.current) return;

    const welcomeParam = searchParams.get("welcome") === "trial";
    const verifyParam = searchParams.get("verify") === "1";
    const pending = peekTrialWelcomePending();

    if (!welcomeParam && !pending && !verifyParam) return;

    setVisible(true);
    if (verifyParam) setShowVerifyPrompt(true);
    if (pending) {
      const shown = resolveDisplayedTrial({
        pendingDays: pending.daysRemaining,
        statusTrialDays: TRIAL_DAYS,
      });
      setDaysRemaining(shown.daysRemaining);
      setTrialDays(shown.trialDays);
    }
  }, [searchParams]);

  useLayoutEffect(() => {
    if (status !== "authenticated" || validated.current) return;

    const welcomeParam = searchParams.get("welcome") === "trial";
    const verifyParam = searchParams.get("verify") === "1";
    const pending = peekTrialWelcomePending();
    if (!welcomeParam && !pending && !verifyParam && !visible) return;

    validated.current = true;

    void (async () => {
      const sub = await fetchSubscriptionStatus();
      clearTrialWelcomePending();

      if (welcomeParam || verifyParam) {
        router.replace(pathname, { scroll: false });
      }

      const unverified =
        sub?.emailVerified === false ||
        sub?.blockReason === "email_unverified" ||
        verifyParam;

      if (unverified) {
        setShowVerifyPrompt(true);
        setVerifyRequired(sub?.blockReason === "email_unverified");
        setVisible(true);
        if (sub?.blockReason === "email_unverified") return;
      }

      if (sub?.status !== "trialing" || !sub.hasAccess) {
        if (!unverified) setVisible(false);
        return;
      }

      const shown = resolveDisplayedTrial({
        statusDays: sub?.daysRemaining,
        pendingDays: pending?.daysRemaining,
        statusTrialDays: typeof sub?.trialDays === "number" ? sub.trialDays : TRIAL_DAYS,
      });
      setDaysRemaining(shown.daysRemaining);
      setTrialDays(shown.trialDays);
      if (!unverified) setVisible(true);

      if (welcomeParam) {
        analytics.trialStarted({ plan_type: "trial" }, { persist: false });
      }
    })();
  }, [pathname, router, searchParams, status, visible]);

  function dismiss() {
    setVisible(false);
    clearTrialWelcomePending();
  }

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <TrialWelcomeScreen
          daysRemaining={daysRemaining}
          trialDays={trialDays}
          userName={session?.user?.name}
          userEmail={session?.user?.email}
          showVerifyPrompt={showVerifyPrompt}
          verifyRequired={verifyRequired}
          onDismiss={dismiss}
        />
      )}
    </AnimatePresence>
  );
}

export function TrialWelcomeProvider({ children }: { children: ReactNode }) {
  const [gate, setGate] = useState<TrialWelcomeGate>({ active: false, resolved: false });

  return (
    <TrialWelcomeContext.Provider value={gate}>
      <Suspense fallback={null}>
        <TrialWelcomeHost onActiveChange={setGate} />
      </Suspense>
      {children}
    </TrialWelcomeContext.Provider>
  );
}
