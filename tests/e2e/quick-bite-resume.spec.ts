import { expect, test } from "./fixtures/auth";

const SLUG = "quick-bites-ep02-nclex-works";
const API = "/api/quick-bites";
const LOCAL_VIDEO = "/videos/landing/how-to-pass.mp4";

test.describe("Quick Bite resume", () => {
  test("pause position survives reload and resume seek", async ({ authenticatedPage: page }) => {
    let savedPosition = 0;

    await page.route(`${API}/progress`, async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            progress: savedPosition > 0
              ? {
                  [SLUG]: {
                    watchPct: 78,
                    playbackPositionSec: savedPosition,
                    watchSeconds: 120,
                    completedAt: null,
                  },
                }
              : {},
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.route(`${API}/${SLUG}/progress`, async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }
      const body = route.request().postDataJSON() as { playbackPositionSec?: number };
      if (typeof body.playbackPositionSec === "number" && body.playbackPositionSec > 0.5) {
        savedPosition = body.playbackPositionSec;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          progress: {
            watchPct: 78,
            playbackPositionSec: savedPosition,
            watchSeconds: 120,
            completedAt: null,
          },
        }),
      });
    });

    await page.route(`${API}/${SLUG}/media`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ videoUrl: LOCAL_VIDEO }),
      });
    });

    await page.goto("/dev/quick-bites-preview?access=premium");
    await page.getByRole("button", { name: /Play 1\. How the Nursing Boards Work/i }).click();
    const video = page.getByLabel("How the Nursing Boards Work video");
    await expect(video).toBeVisible();

    await video.evaluate((element) => {
      const media = element as HTMLVideoElement;
      return new Promise<void>((resolve) => {
        const done = () => resolve();
        if (media.readyState >= 1) {
          done();
          return;
        }
        media.addEventListener("loadedmetadata", done, { once: true });
      });
    });

    await video.evaluate((element) => {
      const media = element as HTMLVideoElement;
      media.currentTime = 58;
      media.dispatchEvent(new Event("pause"));
    });

    await expect.poll(() => savedPosition).toBeGreaterThan(50);

    await page.reload();
    await page.getByRole("button", { name: /Play 1\. How the Nursing Boards Work/i }).click();
    const resumed = page.getByLabel("How the Nursing Boards Work video");
    await expect(resumed).toBeVisible();

    await expect
      .poll(async () => resumed.evaluate((element) => (element as HTMLVideoElement).currentTime))
      .toBeGreaterThan(50);
  });
});
