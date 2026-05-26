# Migrate from Vercel to AWS

Move **Any Exam Easy** from Vercel serverless to **AWS ECS Fargate + RDS PostgreSQL**.

## Target architecture

| Was (Vercel) | Becomes (AWS) |
|--------------|---------------|
| Vercel hosting | **ECS Fargate** + ALB |
| Neon / Vercel Postgres | **RDS PostgreSQL 16** |
| Vercel env vars | **Secrets Manager** |
| Vercel Cron | **EventBridge** → `GET /api/cron/sync-question-bank` |
| `vercel-build` | **Docker** image → **ECR** |

## Fastest path (automated)

On your Mac, after [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) is installed:

```bash
aws configure
chmod +x scripts/bootstrap-aws.sh
npm run aws:bootstrap
```

This runs Terraform (RDS + ECS + ALB + ECR + Secrets) and pushes the Docker image. Open the printed ALB URL.

Details: [infra/terraform/README.md](../infra/terraform/README.md)

---

## Manual checklist

### 1. RDS database

Follow [AWS_RDS.md](./AWS_RDS.md):

- Create PostgreSQL 16 in a **private subnet**
- Security group: port **5432** from ECS tasks only
- Run locally once:

```bash
cp .env.rds.example .env
# DATABASE_URL = RDS connection string
npm run db:rds -- --sync --seed-admin
```

### 2. Secrets Manager

Create secret `any-exam-easy/production` (JSON):

```json
{
  "DATABASE_URL": "postgresql://...@rds.../anyexameasy?sslmode=require",
  "NEXTAUTH_URL": "https://app.yourdomain.com",
  "NEXTAUTH_SECRET": "...",
  "CRON_SECRET": "...",
  "OPENAI_API_KEY": "...",
  "TAVILY_API_KEY": "...",
  "STRIPE_SECRET_KEY": "...",
  "STRIPE_WEBHOOK_SECRET": "...",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "...",
  "STRIPE_PRICE_ID": "..."
}
```

Generate secrets: `npm run aws:setup`

### 3. ECR + Docker image

```bash
aws ecr create-repository --repository-name any-exam-easy --region us-east-1
npm run aws:deploy -- --region us-east-1 --account YOUR_ACCOUNT_ID
```

Or build manually:

```bash
docker build -t any-exam-easy .
docker tag any-exam-easy:latest ACCOUNT.dkr.ecr.REGION.amazonaws.com/any-exam-easy:latest
aws ecr get-login-password --region REGION | docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.REGION.amazonaws.com
docker push ACCOUNT.dkr.ecr.REGION.amazonaws.com/any-exam-easy:latest
```

### 4. ECS Fargate service

Use template: [aws/ecs-task-definition.json](../aws/ecs-task-definition.json)

- Cluster: `any-exam-easy`
- Task CPU 512 / Memory 1024
- **RUN_MIGRATIONS=true** on first deploy only
- Load balancer health check: `/api/health`
- Environment from Secrets Manager (see task definition)

### 5. DNS & TLS

- **Route 53** → ALB alias `app.yourdomain.com`
- **ACM** certificate on ALB (HTTPS 443)

### 6. Stripe webhook

Update endpoint to:

```text
https://app.yourdomain.com/api/stripe/webhook
```

### 7. Question bank cron

EventBridge rule (weekly), target: your ALB URL:

```text
GET https://app.yourdomain.com/api/cron/sync-question-bank
Header: Authorization: Bearer <CRON_SECRET>
```

See [aws/eventbridge-cron.md](../aws/eventbridge-cron.md).

### 8. Turn off Vercel (optional)

- Remove custom domain from Vercel project
- Pause or delete Vercel project after AWS is verified
- Keep GitHub repo; point CI to AWS (`.github/workflows/deploy-aws.yml`)

## Verify

```bash
curl https://app.yourdomain.com/api/health
```

Expect `"ok": true`, `"databaseUrl": "postgresql"`.

## Local dev against RDS

Use `.env` with RDS URL (or VPN/bastion if RDS is private). Do **not** use Vercel env for production traffic after cutover.

## Related

- [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)
- [AWS_RDS.md](./AWS_RDS.md)
