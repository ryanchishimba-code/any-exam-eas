import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT ?? "3100");
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

/**
 * Signed-in student smoke. One mobile browser, one worker.
 * Set PLAYWRIGHT_SKIP_WEBSERVER=1 and PLAYWRIGHT_BASE_URL to hit a deployment.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: /student-smoke\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 180_000,
  expect: { timeout: 20_000 },
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    ...devices["Pixel 7"],
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 20_000,
    navigationTimeout: 90_000,
    ...(bypass
      ? {
          extraHTTPHeaders: {
            "x-vercel-protection-bypass": bypass,
            "x-vercel-set-bypass-cookie": "true",
          },
        }
      : {}),
  },
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: `npx next start -p ${port}`,
        url: `${baseURL}/login`,
        timeout: 180_000,
        reuseExistingServer: !process.env.CI,
        env: {
          ...process.env,
          PORT: String(port),
          NEXTAUTH_URL: baseURL,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "playwright-smoke-secret-min-16",
          AUTH_SECRET:
            process.env.AUTH_SECRET ??
            process.env.NEXTAUTH_SECRET ??
            "playwright-smoke-secret-min-16",
        },
      },
});
