data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "random_password" "db" {
  length  = 24
  special = false
}

resource "random_password" "nextauth" {
  length  = 48
  special = false
}

resource "random_password" "cron" {
  length  = 48
  special = false
}

locals {
  account_id   = data.aws_caller_identity.current.account_id
  name_prefix  = var.app_name
  alb_url      = "http://${aws_lb.app.dns_name}"
  nextauth_url = var.nextauth_url != "" ? var.nextauth_url : local.alb_url
  database_url = "postgresql://${var.db_username}:${random_password.db.result}@${aws_db_instance.main.address}:5432/${var.db_name}?sslmode=require"
}

resource "aws_secretsmanager_secret" "app" {
  name = "${local.name_prefix}/production"
}

resource "aws_secretsmanager_secret_version" "app" {
  secret_id = aws_secretsmanager_secret.app.id
  secret_string = jsonencode({
    DATABASE_URL     = local.database_url
    NEXTAUTH_URL     = local.nextauth_url
    NEXTAUTH_SECRET  = random_password.nextauth.result
    CRON_SECRET      = random_password.cron.result
    OPENAI_API_KEY   = ""
    TAVILY_API_KEY   = ""
    STRIPE_SECRET_KEY = ""
    STRIPE_WEBHOOK_SECRET = ""
  })
}

resource "aws_ecr_repository" "app" {
  name                 = var.app_name
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.app_name}"
  retention_in_days = 14
}

resource "aws_ecs_cluster" "main" {
  name = var.app_name
}
