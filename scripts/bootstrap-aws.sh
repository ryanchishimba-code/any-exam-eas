#!/bin/bash
# One-command AWS deploy: Terraform (RDS + ECS + ALB + ECR) + Docker push
# Prerequisites: aws cli, terraform, docker — and `aws configure` done
set -euo pipefail
cd "$(dirname "$0")/.."

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo -e "${RED}Missing: $1${NC}"
    echo "  Install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    echo "  Install Terraform: https://developer.hashicorp.com/terraform/install"
    echo "  Install Docker: https://docs.docker.com/get-docker/"
    exit 1
  fi
}

need aws
need terraform
need docker

echo "Checking AWS credentials…"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION="${AWS_REGION:-us-east-1}"
echo -e "${GREEN}Account: $ACCOUNT  Region: $REGION${NC}"

TF_DIR="infra/terraform"
cd "$TF_DIR"

if [ ! -d .terraform ]; then
  terraform init
fi

echo ""
echo "Creating RDS, ECR, ECS, ALB (5–15 minutes)…"
terraform apply -auto-approve \
  -var="aws_region=$REGION" \
  -var="nextauth_url=${NEXTAUTH_URL:-}"

ECR_URL=$(terraform output -raw ecr_repository_url)
ALB_URL=$(terraform output -raw alb_url)
CLUSTER=$(terraform output -raw ecs_cluster)
SERVICE=$(terraform output -raw ecs_service)

cd ../..

echo ""
echo "Building and pushing Docker image…"
npm run aws:deploy -- --region "$REGION" --account "$ACCOUNT" --cluster "$CLUSTER" --service "$SERVICE"

echo ""
echo -e "${GREEN}=== Deploy complete ===${NC}"
echo "App URL:    $ALB_URL"
echo "Health:     $ALB_URL/api/health"
echo "Secrets:    AWS Console → Secrets Manager → any-exam-easy/production"
echo ""
echo "Add OPENAI_API_KEY and STRIPE keys in Secrets Manager, then:"
echo "  aws ecs update-service --cluster $CLUSTER --service $SERVICE --force-new-deployment --region $REGION"
terraform -chdir=infra/terraform output next_steps
