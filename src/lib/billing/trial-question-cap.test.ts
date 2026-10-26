import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { BILLING_GUARANTEE_POINTS, BILLING_TRIAL_DISCLOSURE } from "@/lib/billing-plans";
import { naplexPost } from "@/lib/blog/upgrades/posts/okay";
import { subscriptionPost } from "@/lib/blog/upgrades/posts/subscription";
import { whyPost } from "@/lib/blog/upgrades/posts/why";
import {
  isTrialQuestionCapReached,
  redirectToUpgradeIfTrialCapReached,
} from "@/lib/study/usage-limit-messages";
import { STUDY_USAGE_LIMITS } from "@/lib/study/usage-limits-config";
import {
  seoResourcesCtaLine,
  seoSixBoardTrialParagraph,
  seoTrialIncludedFaq,
  seoTrialLengthFaq,
  seoTrialNaplexStudyTip,
  seoTrialResourceParagraph,
  seoTrialTryBeforePayFaq,
  SEO_TRIAL_META_SUFFIX,
} from "@/lib/seo/trial-copy";
import { buildHomeJsonLd } from "@/lib/seo";
import {
  formatLandingHeroTrialLine,
  formatLandingTrialFaqAnswer,
  formatLandingTrialScopeSentence,
  formatSignupTrialScope,
  formatTrialPlanDetail,
  formatTrialQuestionLimit,
  NO_PAYMENT_TRIAL_SUBLINE,
  SIGNUP_PAYMENT_REQUIRED_NOTE,
} from "@/lib/site";

/**
 * Phrases that would advertise a different trial question cap than the one enforced.
 * Clinical doses, Top 500 drugs, and HTTP 500s do not match.
 */
/** Built so this file does not itself contain the retired trial-cap phrases. */
const RETIRED_COUNT = "5" + "00";
const TRIAL_CAP_DRIFT = [
  new RegExp(`${RETIRED_COUNT} practice questions`, "i"),
  new RegExp("five " + "hundred", "i"),
  new RegExp(`${RETIRED_COUNT} during the trial`, "i"),
  new RegExp(`${RETIRED_COUNT}-question trial`, "i"),
  new RegExp(`${RETIRED_COUNT} questions run out`, "i"),
  new RegExp(`includes ${RETIRED_COUNT} practice`, "i"),
  new RegExp(`of ${RETIRED_COUNT} questions`, "i"),
  new RegExp(`up to ${RETIRED_COUNT}(?:\\s+practice)? questions`, "i"),
  new RegExp(`${RETIRED_COUNT}\\+ practice questions`, "i"),
  new RegExp(`TRIAL_LIFETIME_QUESTIONS\\s*=\\s*${RETIRED_COUNT}\\b`),
  new RegExp(`TRIAL_LIFETIME_QUESTIONS:\\s*"${RETIRED_COUNT}"`),
  new RegExp(`\\?\\?\\s*"${RETIRED_COUNT}"`),
  new RegExp(`trialLifetimeQuestions:\\s*${RETIRED_COUNT}\\b`),
];

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  "exam-prep",
  "edtech",
  "data",
  "prisma",
  "dist",
  "coverage",
]);

function collectSourceFiles(dir: string, out: string[]): void {
  let entries: ReturnType<typeof readdirSync>;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const info = statSync(full);
    if (info.isDirectory()) {
      collectSourceFiles(full, out);
      continue;
    }
    if (/\.(tsx?|md|mdx|mjs|html|example)$/.test(name) || name === ".env.example") {
      out.push(full);
    }
  }
}

describe("trial question cap", () => {
  it("enforces 100 questions for 5 days", () => {
    expect(TRIAL_DAYS).toBe(5);
    expect(TRIAL_LIFETIME_QUESTIONS).toBe(100);
    expect(STUDY_USAGE_LIMITS.trial.trialLifetimeQuestions).toBe(TRIAL_LIFETIME_QUESTIONS);
  });

  it("keeps public trial copy on the same cap as enforcement", () => {
    const cap = String(TRIAL_LIFETIME_QUESTIONS);
    const copies = [
      formatTrialQuestionLimit(),
      formatLandingHeroTrialLine(),
      formatLandingTrialScopeSentence(),
      formatLandingTrialFaqAnswer(),
      formatSignupTrialScope(),
      formatTrialPlanDetail(),
      NO_PAYMENT_TRIAL_SUBLINE,
      SIGNUP_PAYMENT_REQUIRED_NOTE,
      BILLING_TRIAL_DISCLOSURE,
      BILLING_GUARANTEE_POINTS.join("\n"),
      SEO_TRIAL_META_SUFFIX,
      seoTrialTryBeforePayFaq(),
      seoTrialLengthFaq(),
      seoTrialIncludedFaq(),
      seoTrialResourceParagraph(),
      seoTrialNaplexStudyTip(),
      seoResourcesCtaLine(),
      seoSixBoardTrialParagraph(),
      subscriptionPost.content,
      subscriptionPost.excerpt,
      whyPost.content,
      naplexPost.content,
      JSON.stringify(buildHomeJsonLd()),
    ];
    for (const copy of copies) {
      expect(copy).toContain(cap);
      for (const pattern of TRIAL_CAP_DRIFT) {
        expect(copy).not.toMatch(pattern);
      }
    }
  });

  it("fails when a source file still advertises the old trial cap", () => {
    const root = process.cwd();
    const files: string[] = [];
    for (const dir of ["src", "tests", "content"]) {
      collectSourceFiles(path.join(root, dir), files);
    }
    files.push(path.join(root, "README.md"), path.join(root, ".env.example"));
    files.push(path.join(root, "scripts", "vercel-pricing-env.mjs"));

    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      const lines = text.split("\n");
      lines.forEach((line, index) => {
        for (const pattern of TRIAL_CAP_DRIFT) {
          if (pattern.test(line)) {
            hits.push(`${path.relative(root, file)}:${index + 1}: ${line.trim()}`);
          }
        }
      });
    }
    expect(hits).toEqual([]);
  });

  it("treats a trial user already past the cap as an upgrade, not an error", () => {
    const exhausted = {
      code: "TRIAL_LIFETIME_LIMIT",
      remainingTrialTotal: 0,
      upgradeScreen: true,
      upgradeUrl: "/upgrade?reason=trial_total",
      error: "You've used your 100 practice questions.",
    };
    expect(isTrialQuestionCapReached(exhausted)).toBe(true);
    expect(redirectToUpgradeIfTrialCapReached(exhausted)).toBe(true);
    expect(
      isTrialQuestionCapReached({
        code: "TRIAL_LIFETIME_LIMIT",
        remainingTrialTotal: 8,
        error: "Trial allowance: 8 questions left. Upgrade to keep studying.",
      })
    ).toBe(false);
    expect(isTrialQuestionCapReached({ code: "DAILY_QUESTION_LIMIT", remainingTrialTotal: 0 })).toBe(
      false
    );
  });
});
