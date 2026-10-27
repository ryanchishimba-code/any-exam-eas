import { describe, expect, it } from "vitest";
import { loginCompleteUrl } from "@/lib/client/auth-routes";
import { resolvePostLoginDestination } from "@/lib/client/post-login-routing";
import { landingTrialHrefForExam, LANDING_TRIAL_HREF } from "@/lib/landing/trial-href";
import { freeQuizSignupHref } from "@/lib/marketing/free-quiz";
import { studyGuideOfferCards } from "@/lib/marketing/study-guide-offer";
import { resolveSignupIntent, signupTrialDestination } from "@/lib/auth/signup-intent";
import {
  BOARD_INTENT_COOKIE,
  boardFromCallbackUrl,
  boardFromCookieHeader,
  boardFromPathname,
  boardFromSearchParams,
  boardIntentPathAction,
  emailVerificationPath,
  hrefWithBoard,
  parseBoardSlug,
  resolveCarriedBoard,
  shouldPersistIncomingBoard,
  writeBoardIntentCookie,
} from "@/lib/auth/board-intent";

const BOARDS = ["nclex", "usmle", "naplex", "pance", "aanp-fnp", "npte-pt"] as const;

describe("signup from a board page", () => {
  it.each(BOARDS)("puts ?board=%s on the trial CTA and locks signup to that exam", (board) => {
    const href = landingTrialHrefForExam(board);
    expect(href).toContain("/signup?plan=trial");
    expect(href).toContain(`exam=${board}`);
    expect(href).toContain(`board=${board}`);
    expect(resolveSignupIntent({ board, plan: "trial" }).exam).toBe(board);
    expect(
      shouldPersistIncomingBoard(null, board, "capture")
    ).toEqual({ persist: true, examSlug: board });
    expect(signupTrialDestination(board)).toBe("/dashboard?welcome=trial&verify=1");
  });

  it("reads the board from a landing, study guide, quiz, or pricing-with-board URL", () => {
    expect(boardFromPathname("/nclex")).toBe("nclex");
    expect(boardFromPathname("/naplex/study-guide/calculations")).toBe("naplex");
    expect(boardFromPathname("/aanp-fnp/study-guide")).toBe("aanp-fnp");
    expect(boardFromPathname("/pance")).toBe("pance");
    expect(boardFromPathname("/practice/usmle")).toBe("usmle");
    expect(freeQuizSignupHref("npte-pt")).toContain("board=npte-pt");
    expect(boardFromSearchParams(new URLSearchParams("field=pharmacy"))).toBe("naplex");
    expect(boardFromSearchParams(new URLSearchParams("field=nursing"))).toBe("nclex");
    expect(hrefWithBoard("/signup?plan=trial&interval=monthly&tier=pro", "usmle")).toContain(
      "board=usmle"
    );
  });

  it("stores a short-lived first-party cookie the OAuth return can read", () => {
    const cookie = writeBoardIntentCookie("pance");
    expect(cookie.startsWith(`${BOARD_INTENT_COOKIE}=pance`)).toBe(true);
    expect(cookie).toContain("Max-Age=3600");
    expect(cookie).toContain("SameSite=Lax");
    expect(boardFromCookieHeader(cookie)).toBe("pance");
  });

  it("keeps the board on the email verification link", () => {
    const path = emailVerificationPath("raw-token", "aanp-fnp");
    expect(path).toContain("token=raw-token");
    expect(boardFromSearchParams(new URLSearchParams(path.split("?")[1]))).toBe("aanp-fnp");
  });
});

describe("OAuth carries the board", () => {
  it("reads the board from the login-complete callback and the cookie", () => {
    const callback = loginCompleteUrl("/dashboard", "npte-pt");
    expect(callback).toContain("board=npte-pt");
    expect(boardFromCallbackUrl(callback)).toBe("npte-pt");
    expect(
      boardFromCallbackUrl(
        "https://www.anyexameasy.com/login/complete?callbackUrl=%2Fdashboard&board=usmle"
      )
    ).toBe("usmle");
    expect(
      resolveCarriedBoard({
        cookieHeader: `${BOARD_INTENT_COOKIE}=naplex`,
        callbackUrl: "/login/complete?callbackUrl=%2Fdashboard",
      })
    ).toBe("naplex");
    expect(
      resolveCarriedBoard({
        cookieHeader: `authjs.callback-url=${encodeURIComponent(callback)}`,
      })
    ).toBe("npte-pt");
  });

  it("saves the carried board only when the account has none", () => {
    expect(shouldPersistIncomingBoard(null, "nclex", "capture")).toEqual({
      persist: true,
      examSlug: "nclex",
    });
    expect(shouldPersistIncomingBoard("pance", "nclex", "capture")).toEqual({
      persist: false,
      examSlug: "pance",
    });
  });
});

describe("returning user visiting another board", () => {
  it("does not replace a saved board from a page visit, login, or email link", () => {
    expect(shouldPersistIncomingBoard("nclex", "naplex", "page")).toEqual({
      persist: false,
      examSlug: "nclex",
    });
    expect(shouldPersistIncomingBoard("nclex", "usmle", "capture")).toEqual({
      persist: false,
      examSlug: "nclex",
    });
    expect(boardFromPathname("/naplex")).toBe("naplex");
    expect(
      resolvePostLoginDestination("/question-bank?field=pharmacy", { hasAccess: true }, "nclex")
    ).toBe("/dashboard");
    expect(
      resolvePostLoginDestination("/naplex/study-guide", { hasAccess: true }, "nclex")
    ).toBe("/dashboard");
  });
});

describe("Settings change persists", () => {
  it("replaces the saved board only from Settings", () => {
    expect(shouldPersistIncomingBoard("nclex", "naplex", "settings")).toEqual({
      persist: true,
      examSlug: "naplex",
    });
    expect(shouldPersistIncomingBoard("naplex", null, "settings")).toEqual({
      persist: false,
      examSlug: "naplex",
    });
    expect(
      resolvePostLoginDestination("/select-exam?switch=1", { hasAccess: true }, "naplex")
    ).toBe("/select-exam?switch=1");
  });
});

describe("generic signup", () => {
  it("keeps today's home-page path when no board is present", () => {
    expect(landingTrialHrefForExam()).toBe(LANDING_TRIAL_HREF);
    expect(landingTrialHrefForExam()).not.toContain("board=");
    expect(resolveSignupIntent({}).exam).toBe("");
    expect(signupTrialDestination("")).toBe("/select-exam?welcome=trial&verify=1");
    expect(shouldPersistIncomingBoard(null, null, "capture")).toEqual({
      persist: false,
      examSlug: null,
    });
    expect(boardFromPathname("/")).toBeNull();
    expect(boardFromPathname("/about")).toBeNull();
    expect(boardIntentPathAction("/")).toBe("clear");
    expect(boardIntentPathAction("/signup")).toBe("keep");
    expect(boardIntentPathAction("/login/complete")).toBe("keep");
    expect(
      resolvePostLoginDestination("/question-bank", { hasAccess: true }, null)
    ).toBe("/question-bank");
    expect(resolvePostLoginDestination("/dashboard", { hasAccess: true }, null)).toBe(
      "/dashboard"
    );
  });

  it("drops an unknown board instead of inventing one", () => {
    expect(parseBoardSlug("not-a-board")).toBeNull();
    expect(parseBoardSlug("")).toBeNull();
    expect(resolveSignupIntent({ board: "nope", exam: "usmle" }).exam).toBe("usmle");
  });
});

describe("study guide and legacy MPJE", () => {
  it("adds the board to each study-guide sign-in link", () => {
    for (const card of studyGuideOfferCards()) {
      expect(card.signInHref).toContain(`board=${card.exam}`);
      expect(card.trialHref).toContain(`board=${card.exam}`);
    }
  });

  it("maps a legacy MPJE field to PANCE and does not overwrite a saved board", () => {
    expect(parseBoardSlug("mpje")).toBe("pance");
    expect(shouldPersistIncomingBoard("nclex", parseBoardSlug("mpje"), "capture")).toEqual({
      persist: false,
      examSlug: "nclex",
    });
  });
});
