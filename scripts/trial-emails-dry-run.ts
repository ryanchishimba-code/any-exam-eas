/**
 * Lists trial reminder and trial-ended recipients. Does not send email and does not write the send log.
 *
 *   npx tsx scripts/trial-emails-dry-run.ts
 *
 * Uses DATABASE_URL. Point it at the dev branch, not production.
 */
import { planTrialLifecycleEmails } from "../src/lib/billing/trial-lifecycle-mail";

const plan = await planTrialLifecycleEmails(new Date());
console.log(
  JSON.stringify(
    {
      dryRun: true,
      now: plan.now,
      reminderCount: plan.reminder.length,
      endedCount: plan.ended.length,
      skippedTestAccounts: plan.skippedTestAccounts,
      reminder: plan.reminder,
      ended: plan.ended,
    },
    null,
    2
  )
);
