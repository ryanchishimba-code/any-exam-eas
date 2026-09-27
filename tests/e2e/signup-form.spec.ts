import { test, expect, type Page } from "@playwright/test";
import { fillControlledInput, fillDateOfBirth } from "./helpers/forms";

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
  expect(overflow, "page should not scroll horizontally").toBeLessThanOrEqual(1);
}

/**
 * Controls that sit on top of each other (not a parent containing a child,
 * and not the show-password button sitting in the password field).
 */
async function expectControlsDoNotCollide(page: Page) {
  const collisions = await page.evaluate(() => {
    const nodes = [
      ...document.querySelectorAll<HTMLElement>("input, button, [role='radio']"),
    ].filter((node) => {
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") return false;
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    const offscreen = nodes.filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.left < -1 || rect.right > window.innerWidth + 1;
    });
    if (offscreen.length) {
      return offscreen.map((node) => `offscreen:${node.id || node.getAttribute("aria-label") || node.innerText}`);
    }

    const hits: string[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]!;
        const b = nodes[j]!;
        if (a.contains(b) || b.contains(a)) continue;
        if (a.dataset.overlay === "password-toggle" || b.dataset.overlay === "password-toggle") {
          continue;
        }
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        const overlapW = Math.min(ar.right, br.right) - Math.max(ar.left, br.left);
        const overlapH = Math.min(ar.bottom, br.bottom) - Math.max(ar.top, br.top);
        if (overlapW > 4 && overlapH > 4) {
          const name = (node: HTMLElement) =>
            `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""}:${(node.innerText || node.getAttribute("aria-label") || "").trim().slice(0, 32)}`;
          hits.push(`${name(a)} ∩ ${name(b)}`);
        }
      }
    }
    return hits.slice(0, 8);
  });
  expect(collisions, collisions.join("\n")).toEqual([]);
}

test.describe("Signup form", () => {
  test("shows inline validation, the 18+ check, and the consent links", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/signup?plan=trial", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Start your 5-day free trial" })).toBeVisible();
    await expect(
      page.getByText("5-day free trial · no payment method required · then $27.99/mo")
    ).toBeVisible();
    await expect(
      page.getByText(
        "Your trial includes 500 practice questions across all six boards, plus Roadmaps and Deep Dives."
      )
    ).toBeVisible();
    await expect(page.getByRole("navigation", { name: /main navigation/i })).toHaveCount(0);
    await expect(page.getByRole("checkbox")).toHaveCount(0);
    const continueButton = page.getByRole("button", { name: "Continue" });
    await expect(continueButton).toBeEnabled();

    await continueButton.click();
    await expect(page.getByText("Enter your email.")).toBeVisible();

    await page.getByLabel("Email").fill("not-an-email");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();

    await page.getByLabel("Email").fill("student@example.com");
    await page.getByRole("textbox", { name: "Password", exact: true }).fill("short");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Password must be at least 10 characters.")).toBeVisible();

    await page.getByRole("textbox", { name: "Password", exact: true }).fill("TestPassword1");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(page.getByRole("textbox", { name: "Password", exact: true })).toHaveAttribute("type", "text");

    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByTestId("signup-step-profile")).toBeVisible();

    await page.getByRole("button", { name: /start your free trial/i }).click();
    await expect(page.getByText("Enter your first and last name.")).toBeVisible();
    await expect(page.getByText("Choose the exam you're preparing for.")).toBeVisible();
    await expect(page.getByText(/you must be 18 or older/i).first()).toBeVisible();
    await expect(page.getByText("Accept the terms to continue.")).toBeVisible();

    await page.getByLabel("First name").fill("Ava");
    await page.getByLabel("Last name").fill("Lee");
    await page.getByRole("radio", { name: /NCLEX/i }).click();
    await expect(page.getByRole("radio", { name: /NCLEX/i })).toBeChecked();

    const dob = page.locator("#signup-dob");
    await dob.click();
    await dob.fill("");
    await dob.pressSequentially("01012010", { delay: 20 });
    await expect(dob).toHaveValue("01/01/2010");
    await expect(page.getByText("You must be at least 18 years old")).toBeVisible();

    await fillDateOfBirth(page, "1992-03-20");
    await expect(page.getByText("You must be at least 18 years old")).toHaveCount(0);

    const terms = page.getByRole("checkbox");
    await expect(terms).not.toBeChecked();
    await expect(page.getByRole("link", { name: "Terms of Service" })).toHaveAttribute("href", "/legal/terms");
    await expect(page.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/legal/privacy");
    await expect(page.getByRole("link", { name: "Educational Disclaimers" })).toHaveAttribute(
      "href",
      "/legal/disclaimer"
    );

    await page.getByRole("button", { name: /start your free trial/i }).click();
    await expect(page.getByText("Accept the terms to continue.")).toBeVisible();
    await terms.check();
    await expect(terms).toBeChecked();
    await expect(page.getByText("Accept the terms to continue.")).toHaveCount(0);
  });

  for (const width of [320, 375, 390, 440]) {
    test(`form does not overlap at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/signup?plan=trial", { waitUntil: "domcontentloaded" });
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.locator(".aee-auth-visual")).toBeHidden();
      const continueButton = page.getByRole("button", { name: "Continue" });
      await expect(continueButton).toBeEnabled();
      await expectNoHorizontalOverflow(page);
      await expectControlsDoNotCollide(page);

      await fillControlledInput(page.getByLabel("Email"), "student@example.com");
      await fillControlledInput(
        page.getByRole("textbox", { name: "Password", exact: true }),
        "TestPassword1"
      );
      await continueButton.click();
      await expect(page.getByRole("radio", { name: /NCLEX/i })).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await expectControlsDoNotCollide(page);
    });
  }

  test("desktop signup keeps the product panel beside the form", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/signup?plan=trial", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".aee-auth-visual")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    const form = await page.locator(".aee-auth-main").boundingBox();
    const visual = await page.locator(".aee-auth-visual").boundingBox();
    expect(form).toBeTruthy();
    expect(visual).toBeTruthy();
    expect(visual!.x).toBeGreaterThan(form!.x + form!.width - 2);
  });
});
