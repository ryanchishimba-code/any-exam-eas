import { describe, expect, it } from "vitest";
import {
  resolveSignedInSignup,
  resolveSignupIntent,
  signedInSignupRedirect,
  signupStepStatus,
  signupSubscribeCheckoutPath,
  signupTrialDestination,
} from "@/lib/auth/signup-intent";

const intervals = ["monthly", "quarterly", "semiannual", "yearly"] as const;

describe("signup query intent", () => {
  it("keeps a valid trial or subscribe plan and drops anything else onto the trial", () => {
    expect(resolveSignupIntent({ plan: "trial" }).plan).toBe("trial");
    expect(resolveSignupIntent({ plan: "subscribe" }).plan).toBe("subscribe");
    for (const plan of ["", "pro", "free", "TRIAL", null, undefined]) {
      expect(resolveSignupIntent({ plan }).plan).toBe("trial");
    }
  });

  it("accepts every billing interval and sends an unknown interval to monthly", () => {
    for (const interval of intervals) {
      expect(resolveSignupIntent({ interval }).interval).toBe(interval);
    }
    for (const interval of ["weekly", "annual", "MONTHLY", "", null]) {
      expect(resolveSignupIntent({ interval }).interval).toBe("monthly");
    }
  });

  it("resolves every tier value to pro", () => {
    for (const tier of ["pro", "basic", "enterprise", "", null, "PRO"]) {
      expect(resolveSignupIntent({ tier }).tier).toBe("pro");
    }
  });

  it("keeps a real exam slug and drops an unknown exam", () => {
    expect(resolveSignupIntent({ exam: "nclex" }).exam).toBe("nclex");
    expect(resolveSignupIntent({ exam: "usmle" }).exam).toBe("usmle");
    expect(resolveSignupIntent({ exam: "not-a-board" }).exam).toBe("");
    expect(resolveSignupIntent({}).exam).toBe("");
    expect(resolveSignupIntent({ code: " rn-7k4q-2m " }).passCode).toBe("RN-7K4Q-2M");
    expect(resolveSignupIntent({}).passCode).toBe("");
  });

  it("routes trial and skip-trial checkout without mixing the two paths", () => {
    const trial = resolveSignupIntent({
      plan: "trial",
      interval: "yearly",
      tier: "nope",
      promo: " SAVE ",
    });
    expect(trial.plan).toBe("trial");
    expect(signupTrialDestination("nclex")).toBe("/dashboard?welcome=trial&verify=1");
    expect(signupTrialDestination("")).toBe("/select-exam?welcome=trial&verify=1");
    expect(signupSubscribeCheckoutPath(trial)).toBe(
      "/checkout?plan=subscribe&interval=yearly&tier=pro&promo=SAVE"
    );

    const skipped = resolveSignupIntent({
      plan: "subscribe",
      interval: "quarterly",
      tier: "pro",
    });
    expect(signupSubscribeCheckoutPath(skipped)).toBe(
      "/checkout?plan=subscribe&interval=quarterly&tier=pro"
    );

    const invalid = resolveSignupIntent({
      plan: "lifetime",
      interval: "weekly",
      tier: "enterprise",
    });
    expect(invalid.plan).toBe("trial");
    expect(signupSubscribeCheckoutPath(invalid)).toBe(
      "/checkout?plan=subscribe&interval=monthly&tier=pro"
    );
  });

  it("sends a signed-in trial visit to the dashboard and a subscribe visit to paid checkout", () => {
    expect(signedInSignupRedirect({})).toBe("/dashboard");
    expect(
      signedInSignupRedirect({ plan: "trial", interval: "yearly", tier: "pro" })
    ).toBe("/dashboard");
    expect(signedInSignupRedirect({ plan: "trial" })).not.toContain("/checkout");
    expect(
      signedInSignupRedirect({ plan: "subscribe", interval: "yearly", tier: "pro", promo: "SAVE" })
    ).toBe("/checkout?plan=subscribe&interval=yearly&tier=pro&promo=SAVE");
  });

  it("starts a card-free trial for an eligible signed-in visitor and never opens checkout", () => {
    expect(
      resolveSignedInSignup({
        plan: "trial",
        interval: "monthly",
        tier: "pro",
        accessStatus: "none",
        trialAvailable: true,
      })
    ).toEqual({ action: "start-trial", href: "/dashboard?welcome=trial" });

    expect(
      resolveSignedInSignup({
        plan: "trial",
        accessStatus: "inactive",
        trialAvailable: true,
      }).action
    ).toBe("start-trial");

    for (const accessStatus of ["active", "trialing", "trial_expired", "canceled"]) {
      const decision = resolveSignedInSignup({
        plan: "trial",
        interval: "monthly",
        tier: "pro",
        accessStatus,
        trialAvailable: accessStatus === "active" || accessStatus === "trialing",
      });
      expect(decision.action, accessStatus).not.toBe("checkout");
      expect(decision.href, accessStatus).not.toContain("/checkout");
    }

    expect(
      resolveSignedInSignup({
        plan: "trial",
        accessStatus: "inactive",
        trialAvailable: false,
      })
    ).toEqual({ action: "dashboard", href: "/dashboard" });
  });

  it("names only the step that is on screen", () => {
    expect(signupStepStatus(1)).toEqual({ count: "Step 1 of 2", name: "Create your account" });
    expect(signupStepStatus(2)).toEqual({ count: "Step 2 of 2", name: "Choose your exam" });
    expect(signupStepStatus(1).name).not.toMatch(/step 2/i);
  });
});
