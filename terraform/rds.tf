# Database Subnet Group
resource "aws_db_subnet_group" "db_group" {
  name       = "url-shortener-db-group"
  subnet_ids = aws_subnet.private[*].id
}

# RDS Postgres Instance
resource "aws_db_instance" "postgres" {
  identifier           = "url-shortener-db"
  allocated_storage    = 20
  engine               = "postgres"
  instance_class       = "db.t3.micro" # Free tier eligible
  db_name              = "urlshortener"
  username             = "dbuser"
  password             = "securepassword123" # Use AWS Secrets Manager in real production
  db_subnet_group_name    = aws_db_subnet_group.db_group.name
  vpc_security_group_ids  = [aws_security_group.db_sg.id]
  skip_final_snapshot     = true
  multi_az                = false 
}

resource "aws_security_group" "db_sg" {
  name   = "url-shortener-db-sg"
  vpc_id = aws_vpc.main.id
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }
}
