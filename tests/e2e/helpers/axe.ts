import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

/** Rules commonly noisy on marketing / auth shells (animations, third-party embeds). */
export const A11Y_BASELINE_DISABLED = [
  "color-contrast",
  "region",
  "landmark-one-main",
  "landmark-unique",
  "scrollable-region-focusable",
  "nested-interactive",
  "aria-hidden-focus",
  "target-size",
  "link-in-text-block",
  "heading-order",
  "duplicate-id",
] as const;

export async function expectNoA11yViolations(
  page: Page,
  options?: {
    disabledRules?: string[];
    selector?: string;
    /** Only fail on serious/critical impacts (default). Set false to assert zero violations. */
    seriousOnly?: boolean;
  }
) {
  const seriousOnly = options?.seriousOnly ?? true;

  let builder = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]);

  const disabled = [...A11Y_BASELINE_DISABLED, ...(options?.disabledRules ?? [])];
  if (disabled.length) {
    builder = builder.disableRules(disabled);
  }

  if (options?.selector) {
    const target = page.locator(options.selector).first();
    await target.waitFor({ state: "visible", timeout: 15_000 });
    builder = builder.include(options.selector);
  }

  const results = await builder.analyze();
  const violations = seriousOnly
    ? results.violations.filter((v) => v.impact === "critical" || v.impact === "serious")
    : results.violations;

  expect(violations, formatViolations(violations)).toEqual([]);
}

function formatViolations(
  violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"]
): string {
  if (violations.length === 0) return "";
  return violations
    .map(
      (v) =>
        `${v.id} (${v.impact}): ${v.description}\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`
    )
    .join("\n\n");
}
