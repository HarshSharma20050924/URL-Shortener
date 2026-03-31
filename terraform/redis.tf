# ElastiCache Redis Subnet Group
resource "aws_elasticache_subnet_group" "redis_group" {
  name       = "url-shortener-redis-group"
  subnet_ids = aws_subnet.private[*].id
}

# Redis Cluster
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "url-shortener-cache"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.redis_group.name
}
