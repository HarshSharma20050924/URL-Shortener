provider "aws" {
  region = "eu-central-1" # Your target region (e.g., Germany)
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Variable definitions for customization
variable "app_name" {
  default = "url-shortener"
}
