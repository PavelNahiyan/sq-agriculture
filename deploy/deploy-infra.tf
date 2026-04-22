# ===========================================
# SQ Agriculture - AWS Infrastructure Terraform
# ===========================================
# This script creates:
# - VPC with 2 subnets in different availability zones
# - RDS PostgreSQL instance
# - EC2 instance for API server
# - Security groups
# - Route 53 DNS records
# - SSL certificate (via Let's Encrypt)

terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "local" {}
}

# ===========================================
# Variables
# ===========================================

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "sq-agriculture"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1" # Singapore/Mumbai region
}

variable "availability_zones" {
  description = "Availability zones for subnets"
  type        = list(string)
  default     = ["ap-southeast-1a", "ap-southeast-1b"]
}

variable "db_master_password" {
  description = "PostgreSQL master password"
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "Domain name"
  type        = string
  default     = "sqagriculture.com"
}

variable "api_subdomain" {
  description = "API subdomain"
  type        = string
  default     = "api.sqagriculture.com"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_storage_gb" {
  description = "RDS storage in GB"
  type        = number
  default     = 20
}

variable "ec2_instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ec2_disk_size_gb" {
  description = "EC2 disk size in GB"
  type        = number
  default     = 8
}

variable "allowed_ssh_cidr" {
  description = "CIDR block for SSH access (change to your IP for security)"
  type        = string
  default     = "0.0.0.0/0"
}

variable "cloudinary_cloud_name" {
  description = "Cloudinary cloud name"
  type        = string
  default     = "dzdnayf9q"
}

variable "cloudinary_api_key" {
  description = "Cloudinary API key"
  type        = string
  default     = "161524266999316"
}

variable "cloudinary_api_secret" {
  description = "Cloudinary API secret"
  type        = string
  sensitive   = true
  default     = "xdZxF2ujfVvV2WcvfjZoqo6jqNU"
}

# ===========================================
# Provider
# ===========================================

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = "production"
      ManagedBy   = "Terraform"
    }
  }
}

# ===========================================
# Data Sources
# ===========================================

data "aws_caller_identity" "current" {}

# ===========================================
# VPC
# ===========================================

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# ===========================================
# Subnets
# ===========================================

resource "aws_subnet" "subnet_1a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone        = var.availability_zones[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-subnet-1a"
  }
}

resource "aws_subnet" "subnet_1b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone        = var.availability_zones[1]
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.project_name}-subnet-1b"
  }
}

# Subnet Group for RDS
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = [aws_subnet.subnet_1a.id, aws_subnet.subnet_1b.id]

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

# ===========================================
# Route Table
# ===========================================

resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-route-table"
  }
}

resource "aws_route_table_association" "subnet_1a" {
  subnet_id      = aws_subnet.subnet_1a.id
  route_table_id = aws_route_table.main.id
}

resource "aws_route_table_association" "subnet_1b" {
  subnet_id      = aws_subnet.subnet_1b.id
  route_table_id = aws_route_table.main.id
}

# ===========================================
# Security Groups
# ===========================================

# EC2 Security Group
resource "aws_security_group" "ec2_sg" {
  name        = "${var.project_name}-ec2-sg"
  description = "Security group for API server"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "API Server"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ec2-sg"
  }
}

# RDS Security Group
resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group for PostgreSQL RDS"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

# ===========================================
# Key Pair
# ===========================================

resource "aws_key_pair" "api_key" {
  key_name   = "${var.project_name}-key"
  public_key = file("${path.module}/keys/${var.project_name}-key.pub")

  tags = {
    Name = "${var.project_name}-key"
  }
}

# ===========================================
# RDS PostgreSQL
# ===========================================

resource "aws_db_instance" "main" {
  identifier           = "${var.project_name}-db"
  engine               = "postgres"
  engine_version       = "15.6"
  instance_class       = var.db_instance_class
  allocated_storage   = var.db_storage_gb
  max_allocated_storage = var.db_storage_gb

  db_name  = "sqagriculture"
  username = "postgres"
  password = var.db_master_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  backup_retention_period = 1
  backup_window           = "03:00-04:00"
  maintenance_window      = "mon:04:00-mon:05:00"

  skip_final_snapshot = true

  enabled_cloudwatch_logs_exports = ["postgresql"]

  tags = {
    Name = "${var.project_name}-db"
  }
}

# ===========================================
# EC2 Instance
# ===========================================

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "api_server" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = var.ec2_instance_type

  subnet_id              = aws_subnet.subnet_1a.id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  key_name               = aws_key_pair.api_key.key_name

  root_block_device {
    volume_size = var.ec2_disk_size_gb
    volume_type = "gp3"
  }

  user_data = templatefile("${path.module}/scripts/userdata.sh", {
    project_name = var.project_name
    api_domain   = var.api_subdomain
  })

  tags = {
    Name = "${var.project_name}-api"
  }
}

# ===========================================
# Elastic IP (optional - for static IP)
# ===========================================

resource "aws_eip" "api_server" {
  domain = "vpc"
  instance = aws_instance.api_server.id

  tags = {
    Name = "${var.project_name}-eip"
  }
}

# ===========================================
# Route 53 DNS (requires hosted zone to exist)
# ===========================================

# Note: This requires a Route 53 Hosted Zone to exist for the domain
# If the hosted zone doesn't exist, create it manually in AWS Console first

data "aws_route53_zone" "main" {
  name         = var.domain_name
  private_zone = false
}

resource "aws_route53_record" "api" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "api"
  type    = "A"

  alias {
    name                   = aws_eip.api_server.public_dns
    zone_id                = aws_eip.api_server.public_dns
    evaluate_target_health = false
  }
}

# ===========================================
# Outputs
# ===========================================

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "rds_database_name" {
  description = "RDS database name"
  value       = aws_db_instance.main.db_name
}

output "ec2_public_ip" {
  description = "EC2 public IP address"
  value       = aws_instance.api_server.public_ip
}

output "ec2_public_dns" {
  description = "EC2 public DNS"
  value       = aws_instance.api_server.public_dns
}

output "ssh_command" {
  description = "SSH command to connect to EC2"
  value       = "ssh -i keys/${var.project_name}-key.pem ec2-user@${aws_instance.api_server.public_ip}"
}

output "api_url" {
  description = "API URL"
  value       = "https://${var.api_subdomain}"
}

output "database_url" {
  description = "PostgreSQL connection string"
  value       = "postgresql://postgres:${var.db_master_password}@${aws_db_instance.main.endpoint}/${aws_db_instance.main.db_name}"
  sensitive   = true
}