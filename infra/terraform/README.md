# Terraform — Any Exam Easy on AWS

Provisions in your AWS account (default VPC):

- RDS PostgreSQL 16 (`db.t4g.micro`)
- ECR repository
- ECS Fargate + ALB
- Secrets Manager (`DATABASE_URL`, `NEXTAUTH_*`, `CRON_SECRET`)

## One command (from repo root)

```bash
aws configure   # once
chmod +x scripts/bootstrap-aws.sh
./scripts/bootstrap-aws.sh
```

## Manual

```bash
cd infra/terraform
terraform init
terraform apply -var="aws_region=us-east-1"
cd ../..
npm run aws:deploy -- --region us-east-1 --account YOUR_ACCOUNT_ID
```

## Destroy

```bash
cd infra/terraform && terraform destroy
```
