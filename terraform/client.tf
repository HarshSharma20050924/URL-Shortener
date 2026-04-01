# S3 Bucket for static website hosting
resource "aws_s3_bucket" "client" {
  bucket = "url-shortener-client-${random_string.bucket_suffix.result}"
  force_destroy = true
}

# Ownership controls
resource "aws_s3_bucket_ownership_controls" "client" {
  bucket = aws_s3_bucket.client.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# Public access block configuration
resource "aws_s3_bucket_public_access_block" "client" {
  bucket = aws_s3_bucket.client.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# ACL set to public-read (depends on ownership and public access setup)
resource "aws_s3_bucket_acl" "client" {
  depends_on = [
    aws_s3_bucket_ownership_controls.client,
    aws_s3_bucket_public_access_block.client,
  ]

  bucket = aws_s3_bucket.client.id
  acl    = "public-read"
}

# S3 Website Hosting
resource "aws_s3_bucket_website_configuration" "client" {
  bucket = aws_s3_bucket.client.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html" # Standard for React/Vite SPAs
  }
}

# Bucket Policy to allow public read to all objects
resource "aws_s3_bucket_policy" "allow_public_read" {
  depends_on = [aws_s3_bucket_public_access_block.client]
  bucket = aws_s3_bucket.client.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.client.arn}/*"
      },
    ]
  })
}
