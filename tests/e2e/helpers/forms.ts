import { expect, type Locator, type Page } from "@playwright/test";

/** Reliable fill for React controlled inputs (plain .fill() can leave state empty). */
export async function fillControlledInput(locator: Locator, value: string) {
  await locator.click();
  await locator.fill("");
  await locator.pressSequentially(value, { delay: 15 });
  await expect(locator).toHaveValue(value);
}

/** Fill signup DOB using US typed format (mm/dd/yyyy). Accepts ISO `YYYY-MM-DD`. */
export async function fillDateOfBirth(page: Page, isoDate: string) {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const display = match ? `${match[2]}/${match[3]}/${match[1]}` : isoDate;
  const dob = page.locator("#signup-dob");
  await fillControlledInput(dob, display);
}

export async function acceptSignupTerms(page: Page) {
  const checkbox = page.getByRole("checkbox");
  if (await checkbox.isVisible()) {
    await checkbox.check();
  }
}
