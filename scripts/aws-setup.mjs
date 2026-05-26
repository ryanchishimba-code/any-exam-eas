#!/usr/bin/env node
/**
 * AWS production setup checklist + generated secrets.
 * Usage: npm run aws:setup
 */
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

function secret() {
  return randomBytes(32).toString("base64");
}

const nextauthSecret = secret();
const cronSecret = secret();

let template = "{}";
try {
  template = readFileSync("aws/secrets.template.json", "utf8");
} catch {
  /* ignore */
}

console.log(`
=== Any Exam Easy — AWS production setup ===

Hosting: ECS Fargate + ALB + RDS PostgreSQL (not Vercel)

1) RDS — docs/AWS_RDS.md
   npm run db:rds -- --sync --seed-admin

2) Secrets Manager — create secret "any-exam-easy/production"
   Use aws/secrets.template.json as a guide. Generated values:

   NEXTAUTH_SECRET  = ${nextauthSecret}
   CRON_SECRET      = ${cronSecret}
   NEXTAUTH_URL     = https://app.YOUR_DOMAIN.com
   DATABASE_URL     = postgresql://...@your-rds.../anyexameasy?sslmode=require

   Upload:
   aws secretsmanager create-secret \\
     --name any-exam-easy/production \\
     --secret-string file://your-filled-secrets.json

3) ECR + deploy
   npm run aws:deploy -- --region us-east-1 --account YOUR_ACCOUNT_ID

4) ECS — register task definition from aws/ecs-task-definition.json
   (replace ACCOUNT_ID, REGION, secret ARNs)

5) ALB health check: GET /api/health

6) EventBridge cron — aws/eventbridge-cron.md

7) Stripe webhook → https://app.YOUR_DOMAIN.com/api/stripe/webhook

Full migration: docs/MIGRATE_VERCEL_TO_AWS.md
`);
