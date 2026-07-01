import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { runHealthChecks } from "../src/lib/health-check";

const report = await runHealthChecks();
console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 1);
