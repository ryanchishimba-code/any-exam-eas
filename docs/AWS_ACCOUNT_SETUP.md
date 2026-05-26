# AWS account setup — Any Exam Easy

You already have an AWS account. Follow these steps once, then deploy with `npm run aws:bootstrap`.

## 1. Create a deploy user (recommended)

Do **not** use your root account for daily deploys.

1. **IAM** → **Users** → **Create user** → name: `any-exam-easy-deploy`
2. **Attach policies directly** → **Create policy** → JSON → paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:*",
        "ecs:*",
        "ecr:*",
        "elasticloadbalancing:*",
        "rds:*",
        "secretsmanager:*",
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:GetRole",
        "iam:PassRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:GetRolePolicy",
        "iam:ListRolePolicies",
        "iam:ListAttachedRolePolicies",
        "iam:CreatePolicy",
        "iam:TagRole",
        "iam:TagPolicy",
        "logs:*"
      ],
      "Resource": "*"
    }
  ]
}
```

Name the policy `AnyExamEasyDeploy` and attach it to the user.

3. **Security credentials** → **Create access key** → **CLI** → save **Access key ID** and **Secret access key**.

## 2. Install tools on your Mac

```bash
brew install awscli terraform docker
```

Open **Docker Desktop** and wait until it says “Running”.

## 3. Configure the CLI

```bash
aws configure
```

| Prompt | Example |
|--------|---------|
| AWS Access Key ID | From step 1 |
| AWS Secret Access Key | From step 1 |
| Default region | `us-east-1` |
| Default output format | `json` |

Test:

```bash
aws sts get-caller-identity
```

You should see your account ID.

## 4. Deploy the app

```bash
cd /Users/ryanchishimba/Desktop/cursor
npm run aws:bootstrap
```

Wait **15–20 minutes** (RDS creation is slow). When it finishes, open the printed URL:

```text
http://xxxxx.us-east-1.elb.amazonaws.com/api/health
```

Expect `"ok": true`.

## 5. Add API keys

**AWS Console** → **Secrets Manager** → `any-exam-easy/production` → **Retrieve** → **Edit**

Add real values for:

- `OPENAI_API_KEY`
- `TAVILY_API_KEY` (optional)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (if your build needs it at runtime)

Redeploy:

```bash
aws ecs update-service \
  --cluster any-exam-easy \
  --service any-exam-easy-web \
  --force-new-deployment \
  --region us-east-1
```

## 6. Sync question bank (once)

Get `CRON_SECRET` from Secrets Manager, then:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  "http://YOUR-ALB-URL/api/cron/sync-question-bank"
```

## Rough monthly cost

| Resource | ~USD/month |
|----------|------------|
| RDS db.t4g.micro | $15 |
| ECS Fargate (1 task) | $15–25 |
| ALB | $18 |
| **Total** | **~$50–60** |

Use **AWS Budgets** → alert at $50.

## Tear down (stop charges)

```bash
cd infra/terraform
terraform destroy
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `aws: command not found` | Run `brew install awscli` |
| `Cannot connect to Docker` | Start Docker Desktop |
| ECS tasks keep stopping | Check CloudWatch logs `/ecs/any-exam-easy`; often missing image — re-run `npm run aws:deploy` |
| Health 503 | Wait 2–3 min after RDS is up; check Secrets Manager has `DATABASE_URL` |

## Next

- Custom domain: Route 53 + ACM HTTPS on ALB
- [MIGRATE_VERCEL_TO_AWS.md](./MIGRATE_VERCEL_TO_AWS.md) — turn off Vercel after cutover
