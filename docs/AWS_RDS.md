# AWS RDS PostgreSQL — Any Exam Easy

Use **Amazon RDS PostgreSQL 16** as the primary database instead of local SQLite (`dev.db`). The app already uses Prisma; switching is mostly `DATABASE_URL` + migrations.

## Architecture

```
ECS Fargate / App Runner / EC2
        │
        │ 5432 (VPC security group)
        ▼
  RDS PostgreSQL 16
  (optional: RDS Proxy for connection pooling)
        │
  Secrets Manager → DATABASE_URL
```

All app data lives in RDS:

- Users, auth, subscriptions (Stripe)
- Exams, quilts, progress
- Question bank (`QuestionBankItem`)
- Study sessions & analytics

Browser `localStorage` is only a client cache; server state is in RDS.

---

## Step 1 — Create RDS instance (AWS Console)

1. **RDS → Create database**
2. **Engine:** PostgreSQL **16.x**
3. **Template:** Dev/Test (cheap) or Production (Multi-AZ)
4. **DB identifier:** `anyexameasy`
5. **Master username:** `aee_admin` (example)
6. **Master password:** store in Secrets Manager
7. **Instance class:** `db.t4g.micro` (dev) or `db.t4g.small`+ (prod)
8. **Storage:** 20 GB gp3 (autoscaling optional)
9. **VPC:** same VPC as your app (ECS/EC2)
10. **Public access:** **No** (recommended) — connect via VPN/bastion or from ECS in same VPC
11. **VPC security group:** allow inbound **5432** only from app security group
12. **Database name:** `anyexameasy`
13. **Encryption:** enabled (default)

Note the **endpoint**, e.g. `anyexameasy.xxxx.us-east-1.rds.amazonaws.com`.

---

## Step 2 — Connection string

Prisma format:

```text
postgresql://USER:PASSWORD@ENDPOINT:5432/anyexameasy?sslmode=require
```

Example `.env`:

```env
DATABASE_URL="postgresql://aee_admin:YOUR_PASSWORD@anyexameasy.xxxx.us-east-1.rds.amazonaws.com:5432/anyexameasy?sslmode=require"
```

### ECS / production (recommended)

Store the full URL in **AWS Secrets Manager**:

```json
{
  "DATABASE_URL": "postgresql://...",
  "NEXTAUTH_SECRET": "...",
  "OPENAI_API_KEY": "..."
}
```

Inject into the task definition as secrets (not plain env in the image).

### Connection pooling (optional)

For many concurrent ECS tasks, add **RDS Proxy** in front of RDS and point `DATABASE_URL` at the proxy endpoint. You can also append Prisma limits:

```text
?sslmode=require&connection_limit=10&pool_timeout=20
```

---

## Step 3 — Point the app at RDS

Copy the example env file and edit:

```bash
cp .env.rds.example .env
# Paste your RDS DATABASE_URL
```

Run the setup script (migrations + optional seed):

```bash
npm run db:rds
```

Options:

```bash
npm run db:rds -- --sync          # also sync ~78k question bank (10–30 min)
npm run db:rds -- --seed-admin    # create dev admin user after migrate
```

Manual equivalent:

```bash
node scripts/set-prisma-provider.mjs postgresql
npx prisma generate
npx prisma migrate deploy
npm run db:sync-questions        # first deploy only
npm run db:seed-admin            # optional local admin
```

---

## Step 4 — Verify

```bash
npm run dev
curl http://localhost:3000/api/health
```

Expected:

```json
{
  "ok": true,
  "checks": {
    "databaseUrl": "postgresql",
    "prisma": "ok"
  }
}
```

---

## Step 5 — Deploy app on AWS

See [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) for ECS Fargate + ALB. On each deploy:

1. **Build** — `DATABASE_URL` can be a build placeholder; runtime uses Secrets Manager.
2. **Migrate** — run once per release (CI job or ECS one-off task):

   ```bash
   npx prisma migrate deploy
   ```

3. **Question bank** — after first RDS setup:

   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" \
     https://your-domain.com/api/cron/sync-question-bank
   ```

---

## Migrating from SQLite (`dev.db`)

SQLite data does **not** auto-transfer. For a fresh RDS database:

| Data | Action |
|------|--------|
| Schema | `npm run db:rds` (migrate deploy) |
| Question bank | `npm run db:sync-questions` or cron |
| Admin user | `npm run db:seed-admin` |
| Real users/exams | Re-signup or export/import manually if needed |

For production cutover from an existing Postgres (Neon), use `pg_dump` / `pg_restore` into RDS instead.

---

## Security checklist

- [ ] RDS in **private subnets**, no public access
- [ ] Security group: 5432 **only** from app SG
- [ ] `sslmode=require` on `DATABASE_URL`
- [ ] Credentials in **Secrets Manager**, rotated periodically
- [ ] Automated backups (7–35 days) + optional cross-region snapshot
- [ ] CloudWatch alarms: CPU, storage, connections

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Can't reach database server` | SG rules, wrong VPC, app not in same VPC |
| `SSL connection required` | Add `?sslmode=require` |
| `password authentication failed` | Reset master password in RDS console |
| `Too many connections` | RDS Proxy or lower `connection_limit` per task |
| Question bank empty | Run sync cron or `npm run db:sync-questions` |

---

## Related

- [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) — full AWS stack
- [.env.rds.example](../.env.rds.example) — env template
- [README.md](../README.md) — local dev
