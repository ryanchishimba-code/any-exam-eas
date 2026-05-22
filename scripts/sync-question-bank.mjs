/**
 * Populate or refresh QuestionBankItem rows from repo seed sources.
 * Usage: npm run db:sync-questions
 */
import { spawnSync } from "node:child_process";

const result = spawnSync(
  "npx",
  ["tsx", "scripts/run-sync-question-bank.ts"],
  { stdio: "inherit", shell: true, env: process.env }
);

process.exit(result.status ?? 1);
