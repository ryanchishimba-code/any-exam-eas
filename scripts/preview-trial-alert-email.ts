#!/usr/bin/env node
/**
 * Render a sample NAPLEX trial celebration email and save HTML + screenshots.
 *
 *   ./node_modules/.bin/tsx scripts/preview-trial-alert-email.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { formatTrialAlertEmail } from "../src/lib/billing/trial-alert-content";

const outDir = process.env.TRIAL_ALERT_PREVIEW_DIR?.trim() || "/opt/cursor/artifacts";
const logoPath = path.join(process.cwd(), "public/images/brand/anyexameasy-logo.png");
const logoData = `data:image/png;base64,${readFileSync(logoPath).toString("base64")}`;

const content = formatTrialAlertEmail({
  examName: "NAPLEX",
  identity: "Jordan",
  startedAt: new Date("2026-10-08T18:47:00.000Z"),
  planLabel: "Pro · Annual · $235.12",
  source: "google · naplex",
  trialsToday: 4,
  trialsWeek: 12,
  todayByExam: [
    { name: "NAPLEX", count: 3 },
    { name: "NCLEX-RN", count: 1 },
  ],
  analyticsUrl: "https://www.anyexameasy.com/admin/analytics",
  logoUrl: logoData,
});

async function main(): Promise<void> {
  mkdirSync(outDir, { recursive: true });
  const htmlPath = path.join(outDir, "trial-alert-naplex.html");
  writeFileSync(htmlPath, content.html);

  const browser = await chromium.launch();
  try {
    const shots: { file: string; width: number }[] = [
      { file: "trial-alert-naplex-desktop.png", width: 640 },
      { file: "trial-alert-naplex-mobile.png", width: 390 },
    ];
    for (const shot of shots) {
      const page = await browser.newPage({
        viewport: { width: shot.width, height: 900 },
        deviceScaleFactor: 2,
      });
      await page.setContent(content.html, { waitUntil: "load" });
      const pngPath = path.join(outDir, shot.file);
      await page.screenshot({ path: pngPath, fullPage: true });
      await page.close();
      console.log(pngPath);
    }
  } finally {
    await browser.close();
  }

  console.log(htmlPath);
  console.log(content.subject);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
