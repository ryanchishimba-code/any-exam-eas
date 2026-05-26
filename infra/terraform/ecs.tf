locals {
  ecr_image = "${aws_ecr_repository.app.repository_url}:latest"
  secret_arn = aws_secretsmanager_secret.app.arn
}

resource "aws_ecs_task_definition" "app" {
  family                   = var.app_name
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = "web"
      image     = local.ecr_image
      essential = true
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "PORT", value = tostring(var.container_port) },
        { name = "HOSTNAME", value = "0.0.0.0" },
        { name = "RUN_MIGRATIONS", value = "true" }
      ]
      secrets = [
        { name = "DATABASE_URL", valueFrom = "${local.secret_arn}:DATABASE_URL::" },
        { name = "NEXTAUTH_URL", valueFrom = "${local.secret_arn}:NEXTAUTH_URL::" },
        { name = "NEXTAUTH_SECRET", valueFrom = "${local.secret_arn}:NEXTAUTH_SECRET::" },
        { name = "CRON_SECRET", valueFrom = "${local.secret_arn}:CRON_SECRET::" },
        { name = "OPENAI_API_KEY", valueFrom = "${local.secret_arn}:OPENAI_API_KEY::" },
        { name = "TAVILY_API_KEY", valueFrom = "${local.secret_arn}:TAVILY_API_KEY::" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "web"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "app" {
  name            = "${var.app_name}-web"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "web"
    container_port   = var.container_port
  }

  depends_on = [aws_lb_listener.http]

  lifecycle {
    ignore_changes = [task_definition]
  }
}
