output "alb_url" {
  description = "Open this URL after the first image is pushed and ECS is healthy"
  value       = "http://${aws_lb.app.dns_name}"
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}

output "rds_endpoint" {
  value = aws_db_instance.main.address
}

output "secrets_manager_arn" {
  value = aws_secretsmanager_secret.app.arn
}

output "ecs_cluster" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service" {
  value = aws_ecs_service.app.name
}

output "cron_secret_hint" {
  description = "Retrieve CRON_SECRET from Secrets Manager for EventBridge / manual sync"
  value       = "aws secretsmanager get-secret-value --secret-id ${aws_secretsmanager_secret.app.name} --query SecretString --output text"
  sensitive   = false
}

output "next_steps" {
  value = <<-EOT
    1. Push Docker image: npm run aws:deploy -- --region ${var.aws_region} --account ${data.aws_caller_identity.current.account_id} --cluster ${aws_ecs_cluster.main.name} --service ${aws_ecs_service.app.name}
    2. Open ${local.alb_url}/api/health
    3. Add OPENAI_API_KEY and STRIPE_* to Secrets Manager, then redeploy ECS
    4. Sync questions: curl -H "Authorization: Bearer <CRON_SECRET>" "${local.alb_url}/api/cron/sync-question-bank"
  EOT
}
