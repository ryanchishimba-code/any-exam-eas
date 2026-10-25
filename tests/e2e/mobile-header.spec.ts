import { test, expect, type Page } from "@playwright/test";

const WIDTHS = [320, 360, 375, 390, 393, 402, 414, 428, 430, 440];

type Box = { left: number; right: number; top: number; bottom: number; width: number; height: number };

function overlaps(a: Box, b: Box) {
  return a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
}

async function headerBoxes(page: Page) {
  return page.locator("header").first().evaluate((header) => {
    const read = (selector: string) => {
      const el = header.querySelector(selector);
      if (!el) return null;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        display: style.display,
        text: (el as HTMLElement).innerText.replace(/\s+/g, " ").trim(),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    };
    return {
      viewport: window.innerWidth,
      wordmark: read(".aee-nav-wordmark__text"),
      logo: read(".aee-nav-brand"),
      signIn: read(".aee-nav-login"),
      cta: read(".aee-nav-cta"),
      menu: read(".aee-nav-menu-btn"),
    };
  });
}

function assertHeaderParts(
  parts: readonly (readonly [string, { display: string; height: number; width: number; left: number; right: number; scrollWidth: number; clientWidth: number } | null])[],
  width: number
) {
  for (const [name, box] of parts) {
    expect(box, `${name} is in the header`).not.toBeNull();
    const item = box!;
    expect(item.display, `${name} is visible`).not.toBe("none");
    expect(item.height, `${name} tap target`).toBeGreaterThanOrEqual(44);
    expect(item.width, `${name} tap target`).toBeGreaterThanOrEqual(44);
    expect(item.left, `${name} stays on screen`).toBeGreaterThanOrEqual(-1);
    expect(item.right, `${name} stays on screen`).toBeLessThanOrEqual(width + 1);
    expect(item.scrollWidth, `${name} is not truncated`).toBeLessThanOrEqual(item.clientWidth + 1);
  }

  const ordered = parts.map(([, box]) => box!);
  for (let i = 0; i < ordered.length; i += 1) {
    for (let j = i + 1; j < ordered.length; j += 1) {
      expect(overlaps(ordered[i], ordered[j]), `${parts[i][0]} overlaps ${parts[j][0]}`).toBe(false);
    }
  }
  for (let i = 0; i < ordered.length - 1; i += 1) {
    const gap = ordered[i + 1].left - ordered[i].right;
    expect(gap, `gap after ${parts[i][0]}`).toBeGreaterThanOrEqual(6);
  }
}

test.describe("mobile header does not overlap", () => {
  for (const width of WIDTHS) {
    test(`home: logo, Log in, and menu stay apart at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await expect(page.locator("header .aee-nav-login").first()).toBeVisible();

      const boxes = await headerBoxes(page);
      expect(boxes.wordmark?.display, "wordmark stays hidden under 768px").toBe("none");
      expect(boxes.signIn?.text).toContain("Log in");
      // Homepage keeps the hero trial CTA primary; nav trial is hidden on phones.
      expect(boxes.cta?.display).toBe("none");

      assertHeaderParts(
        [
          ["logo", boxes.logo],
          ["Log in", boxes.signIn],
          ["menu", boxes.menu],
        ],
        width
      );
    });

    test(`board landing: logo, Log in, trial, and menu stay apart at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/nclex", { waitUntil: "domcontentloaded" });
      await expect(page.locator("header .aee-nav-login").first()).toBeVisible();
      await expect(page.locator("header .aee-nav-cta").first()).toBeVisible();

      const boxes = await headerBoxes(page);
      expect(boxes.wordmark?.display, "wordmark stays hidden under 768px").toBe("none");
      expect(boxes.signIn?.text).toContain("Log in");
      expect(boxes.cta?.text).toBe("Free trial");

      assertHeaderParts(
        [
          ["logo", boxes.logo],
          ["Log in", boxes.signIn],
          ["trial", boxes.cta],
          ["menu", boxes.menu],
        ],
        width
      );
    });
  }
});
