import { expect, type Locator, type Page } from "@playwright/test";

/** Reliable fill for React controlled inputs (plain .fill() can leave state empty). */
export async function fillControlledInput(locator: Locator, value: string) {
  await locator.click();
  await locator.fill("");
  await locator.pressSequentially(value, { delay: 15 });
  await expect(locator).toHaveValue(value);
}

export async function fillDateOfBirth(page: Page, isoDate: string) {
  await page.locator('input[type="date"]').fill(isoDate);
}

export async function acceptSignupTerms(page: Page) {
  const checkbox = page.getByRole("checkbox");
  if (await checkbox.isVisible()) {
    await checkbox.check();
  }
}
