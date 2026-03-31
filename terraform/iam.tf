resource "aws_iam_role" "ecs_execution" {
  name = "url-shortener-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_standard" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Add CloudWatch logging permission
resource "aws_iam_role_policy" "ecs_logging" {
  name = "url-shortener-ecs-logging"
  role = aws_iam_role.ecs_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:CreateLogGroup"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# CloudWatch Log Group for the app
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/url-shortener"
  retention_in_days = 7
}

output "execution_role_arn" {
  value = aws_iam_role.ecs_execution.arn
}
