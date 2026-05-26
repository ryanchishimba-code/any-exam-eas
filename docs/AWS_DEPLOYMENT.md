# AWS deployment architecture — Any Exam Easy

**Primary production target** (replacing Vercel). See [MIGRATE_VERCEL_TO_AWS.md](./MIGRATE_VERCEL_TO_AWS.md) for cutover steps.

Quick start:

```bash
npm run aws:setup
npm run db:rds -- --sync --seed-admin   # after RDS is created
npm run aws:deploy -- --region us-east-1 --account YOUR_ACCOUNT_ID
```

This document describes a **production-grade AWS layout** for the Next.js app (standalone Docker image).

## Recommended architecture

```mermaid
flowchart TB
  Users[Users] --> CF[CloudFront]
  CF --> ALB[Application Load Balancer]
  ALB --> ECS[ECS Fargate Service]
  ECS --> RDS[(RDS PostgreSQL)]
  ECS --> SM[Secrets Manager]
  ECS --> OAI[OpenAI API]
  ECS --> Tavily[Tavily API]
  Stripe[Stripe] --> ECS
  Cron[EventBridge Cron] --> ECS
```

### Components

| Service | Role |
|---------|------|
| **Amazon ECS Fargate** | Runs the Docker image from `Dockerfile` (Next.js standalone) |
| **Application Load Balancer** | HTTPS termination, health checks on `/api/health` |
| **Amazon RDS (PostgreSQL 16)** | Primary database; same schema as Neon/Vercel |
| **AWS Secrets Manager** | `DATABASE_URL`, `NEXTAUTH_SECRET`, API keys |
| **Amazon ECR** | Container registry for CI-built images |
| **Amazon CloudFront** (optional) | CDN for static assets; origin = ALB |
| **Amazon EventBridge** | Weekly cron → `GET /api/cron/sync-question-bank` |
| **Amazon Route 53** | DNS for `app.yourdomain.com` |
| **AWS Certificate Manager** | TLS cert on ALB |

### Why not Lambda-only?

Next.js App Router with Prisma, long-running OpenAI calls, and large question-bank sync fits **long-lived containers** better than Lambda@Edge. Fargate matches the existing `standalone` output.

## Deployment flow

1. **Build image** (GitHub Actions or CodeBuild):
   ```bash
   docker build -t any-exam-easy .
   docker tag any-exam-easy:latest <account>.dkr.ecr.<region>.amazonaws.com/any-exam-easy:latest
   docker push ...
   ```

2. **Database**
   - Create RDS PostgreSQL 16 — **full guide: [AWS_RDS.md](./AWS_RDS.md)**
   - Set `DATABASE_URL=postgresql://user:pass@host:5432/anyexameasy?sslmode=require`
   - Local setup: `cp .env.rds.example .env` then `npm run db:rds -- --sync --seed-admin`
   - Run migrations from CI or a one-off ECS task: `npx prisma migrate deploy`

3. **ECS task definition**
   - CPU: 512–1024, Memory: 1024–2048 MB (scale with load tests).
   - Port mapping: 3000.
   - Environment from Secrets Manager.
   - Health check: `CMD-SHELL curl -f http://localhost:3000/api/health || exit 1`.

4. **Post-deploy**
   - Call question-bank sync once with `Authorization: Bearer $CRON_SECRET`.
   - Configure Stripe webhook URL to `https://app.yourdomain.com/api/stripe/webhook`.

## Environment variables (AWS)

Mirror `.env.example` in Secrets Manager (JSON secret or individual keys):

| Secret | Required |
|--------|----------|
| `DATABASE_URL` | Yes |
| `NEXTAUTH_URL` | Yes (public URL) |
| `NEXTAUTH_SECRET` | Yes |
| `OPENAI_API_KEY` | Yes (generation) |
| `TAVILY_API_KEY` | Recommended |
| `STRIPE_*` | Yes (billing) |
| `CRON_SECRET` | Yes (cron routes) |
| `RESEND_API_KEY` | Optional |

## Cost estimate (rough, us-east-1)

| Resource | Dev/month | Prod/month |
|----------|-----------|------------|
| Fargate (1 task, 0.5 vCPU) | ~$15 | ~$40–80 (2+ tasks) |
| RDS db.t4g.micro | ~$15 | ~$50+ (larger + Multi-AZ) |
| ALB | ~$18 | ~$18 |
| CloudFront | ~$0–5 | ~$5–20 |
| **Total** | **~$50** | **~$120–200+** |

Use [AWS Pricing Calculator](https://calculator.aws/) for your region and traffic.

## Alternatives

| Option | When to use |
|--------|-------------|
| **AWS App Runner** | Simpler than ECS; less VPC control |
| **Elastic Beanstalk** | Familiar PaaS; Docker or Node platform |
| **Amplify Hosting** | Closer to Vercel; limited for custom Prisma cron |
| **Keep Vercel + Neon** | Lowest ops; already documented in README |

## Local parity

```bash
cp .env.docker.example .env.docker
# Edit secrets
docker compose up --build
```

Open http://localhost:3000 — Postgres on `localhost:5432`, app on `3000`.

## IAM (minimum)

- ECS task execution role: pull from ECR, read Secrets Manager.
- ECS task role: optional S3 for exports, SES for email.
- No broad `*` policies on production tasks.

## Monitoring

- ALB target group unhealthy → scale or rollback.
- CloudWatch alarms: 5xx rate, RDS CPU, ECS memory.
- Log driver: `awslogs` for container stdout.

## Related docs

- [APPLICATION_AUDIT.md](./APPLICATION_AUDIT.md)
- [AWS_RDS.md](./AWS_RDS.md) — RDS setup, connection strings, migration from SQLite
- [QUESTION_SYSTEM.md](./QUESTION_SYSTEM.md)
- [README.md](../README.md)
