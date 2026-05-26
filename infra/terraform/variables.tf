variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "app_name" {
  type    = string
  default = "any-exam-easy"
}

variable "db_name" {
  type    = string
  default = "anyexameasy"
}

variable "db_username" {
  type    = string
  default = "aee_admin"
}

variable "container_port" {
  type    = number
  default = 3000
}

variable "task_cpu" {
  type    = string
  default = "512"
}

variable "task_memory" {
  type    = string
  default = "1024"
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "nextauth_url" {
  type        = string
  description = "Public app URL after deploy (ALB DNS or custom domain). Can update later."
  default     = ""
}
