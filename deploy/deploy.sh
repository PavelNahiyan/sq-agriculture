#!/bin/bash
# ===========================================
# SQ Agriculture - Complete Deployment Script
# ===========================================
# This script orchestrates the entire deployment:
# 1. Generate SSH keys
# 2. Initialize Terraform
# 3. Apply Terraform (creates AWS infrastructure)
# 4. Deploy API to EC2
# 5. Configure SSL
# 6. Verify deployment

set -e

# ===========================================
# Configuration
# ===========================================

PROJECT_NAME="sq-agriculture"
DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd ${DEPLOY_DIR}

# AWS Configuration
AWS_REGION="ap-southeast-1"
TF_VAR_FILE="${DEPLOY_DIR}/terraform.tfvars"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[DEPLOY]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# ===========================================
# Check Prerequisites
# ===========================================

check_prerequisites() {
    log "Checking prerequisites..."

    # Check if Terraform is installed
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform is not installed"
        echo ""
        echo "Please install Terraform:"
        echo "  macOS: brew install terraform"
        echo "  Linux: sudo apt install terraform"
        echo "  Windows: Download from https://www.terraform.io/downloads"
        exit 1
    fi

    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed"
        echo ""
        echo "Please install AWS CLI:"
        echo "  macOS: brew install awscli"
        echo "  Linux: sudo apt install awscli"
        echo "  Windows: Download from https://aws.amazon.com/cli/"
        exit 1
    fi

    # Check if AWS credentials are configured
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured"
        echo ""
        echo "Please configure AWS credentials:"
        echo "  aws configure"
        echo ""
        echo "Or set environment variables:"
        echo "  export AWS_ACCESS_KEY_ID=your_key_id"
        echo "  export AWS_SECRET_ACCESS_KEY=your_secret_key"
        echo "  export AWS_DEFAULT_REGION=ap-southeast-1"
        exit 1
    fi

    log "All prerequisites met"
}

# ===========================================
# Generate SSH Keys
# ===========================================

generate_ssh_keys() {
    log "Generating SSH key pair..."

    KEY_PATH="${DEPLOY_DIR}/keys/${PROJECT_NAME}-key"

    if [ -f "${KEY_PATH}.pem" ]; then
        log_warn "SSH key already exists, skipping generation"
    else
        bash "${DEPLOY_DIR}/scripts/generate-keys.sh"
    fi

    log "SSH keys ready"
}

# ===========================================
# Create Terraform Variables File
# ===========================================

create_tfvars() {
    log "Creating Terraform variables file..."

    if [ -f "${TF_VAR_FILE}" ]; then
        log_warn "terraform.tfvars already exists"
        return 0
    fi

    # Prompt for required variables
    echo ""
    echo "============================================="
    echo "Configuration Required"
    echo "============================================="
    echo ""

    read -p "Database Master Password (for PostgreSQL): " -s DB_PASSWORD
    echo ""
    read -p "Cloudinary API Secret: " -s CLOUDINARY_SECRET
    echo ""

    # Create terraform.tfvars
    cat > ${TF_VAR_FILE} <<EOF
# ===========================================
# SQ Agriculture - Terraform Variables
# ===========================================

# AWS
aws_region = "ap-southeast-1"

# Database
db_master_password = "${DB_PASSWORD}"
db_instance_class = "db.t3.micro"
db_storage_gb = 20

# EC2
ec2_instance_type = "t3.micro"
ec2_disk_size_gb = 8
allowed_ssh_cidr = "0.0.0.0/0"

# Domain
domain_name = "sqagriculture.com"
api_subdomain = "api.sqagriculture.com"

# Cloudinary
cloudinary_cloud_name = "dzdnayf9q"
cloudinary_api_key = "161524266999316"
cloudinary_api_secret = "${CLOUDINARY_SECRET}"

# Project
project_name = "sq-agriculture"
EOF

    log "terraform.tfvars created"
}

# ===========================================
# Initialize Terraform
# ===========================================

init_terraform() {
    log "Initializing Terraform..."

    cd ${DEPLOY_DIR}
    terraform init

    log "Terraform initialized"
}

# ===========================================
# Plan Infrastructure
# ===========================================

plan_infrastructure() {
    log "Planning infrastructure..."

    cd ${DEPLOY_DIR}
    terraform plan -out=tfplan

    log "Infrastructure plan created"
}

# ===========================================
# Apply Infrastructure
# ===========================================

apply_infrastructure() {
    log "Applying infrastructure (this may take 10-15 minutes)..."

    cd ${DEPLOY_DIR}

    # Apply with auto-approve
    terraform apply -auto-approve tfplan

    log "Infrastructure created"
}

# ===========================================
# Get Outputs
# ===========================================

get_outputs() {
    log "Getting deployment outputs..."

    cd ${DEPLOY_DIR}

    # Get EC2 public IP
    EC2_IP=$(terraform output -raw ec2_public_ip)

    # Get RDS endpoint
    RDS_ENDPOINT=$(terraform output -raw rds_endpoint)

    # Get database URL
    DB_URL=$(terraform output -raw database_url)

    # Export for later use
    export EC2_IP
    export RDS_ENDPOINT
    export DB_URL

    echo ""
    echo "============================================="
    echo "Infrastructure Outputs"
    echo "============================================="
    echo "EC2 Public IP: ${EC2_IP}"
    echo "RDS Endpoint: ${RDS_ENDPOINT}"
    echo "SSH Command: ssh -i keys/${PROJECT_NAME}-key.pem ec2-user@${EC2_IP}"
    echo "============================================="
    echo ""

    log "Outputs saved"
}

# ===========================================
# Wait for EC2 to be Ready
# ===========================================

wait_for_ec2() {
    log "Waiting for EC2 to be ready (this may take 2-3 minutes)..."

    EC2_IP=$(terraform output -raw ec2_public_ip)

    # Wait for SSH to be available
    for i in {1..30}; do
        if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i "${DEPLOY_DIR}/keys/${PROJECT_NAME}-key.pem" ec2-user@${EC2_IP} "echo 'connected'" &> /dev/null; then
            log "EC2 is ready!"
            return 0
        fi
        echo -n "."
        sleep 10
    done

    log_error "EC2 did not become ready in time"
    log "Please check AWS console and try again"
    exit 1
}

# ===========================================
# Deploy API to EC2
# ===========================================

deploy_api() {
    log "Deploying API to EC2..."

    EC2_IP=$(terraform output -raw ec2_public_ip)
    RDS_ENDPOINT=$(terraform output -raw rds_endpoint)

    # Copy deployment script to EC2
    scp -o StrictHostKeyChecking=no -i "${DEPLOY_DIR}/keys/${PROJECT_NAME}-key.pem" \
        ${DEPLOY_DIR}/scripts/deploy-api.sh \
        ec2-user@${EC2_IP}:/tmp/deploy-api.sh

    # Copy environment file template
    cat > /tmp/env.template <<EOF
NODE_ENV=production
APP_PORT=3001
APP_URL=https://api.sqagriculture.com
DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@${RDS_ENDPOINT}/sqagriculture
JWT_SECRET=generate-a-secure-random-string-at-least-32-characters-long
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=another-secure-random-string-for-refresh-tokens
JWT_REFRESH_EXPIRES_IN=30d
JWT_RESET_SECRET=secure-reset-token-secret
JWT_VERIFY_SECRET=secure-verify-token-secret
NEXT_PUBLIC_API_URL=https://api.sqagriculture.com
NEXT_PUBLIC_APP_URL=https://www.sqagriculture.com
FRONTEND_URL=https://www.sqagriculture.com
API_URL=https://api.sqagriculture.com
CLOUDINARY_CLOUD_NAME=dzdnayf9q
CLOUDINARY_API_KEY=161524266999316
CLOUDINARY_API_SECRET=${CLOUDINARY_SECRET}
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,image/gif,application/pdf
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=SQ Agriculture <noreply@sqagriculture.com>
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
CORS_ORIGIN=https://www.sqagriculture.com,https://sqagriculture.com
EOF

    scp -o StrictHostKeyChecking=no -i "${DEPLOY_DIR}/keys/${PROJECT_NAME}-key.pem" \
        /tmp/env.template \
        ec2-user@${EC2_IP}:/tmp/.env

    # Run deployment script on EC2
    ssh -o StrictHostKeyChecking=no -i "${DEPLOY_DIR}/keys/${PROJECT_NAME}-key.pem" \
        ec2-user@${EC2_IP} "chmod +x /tmp/deploy-api.sh && bash /tmp/deploy-api.sh"

    log "API deployed"
}

# ===========================================
# Configure SSL
# ===========================================

configure_ssl() {
    log "Configuring SSL certificate..."

    EC2_IP=$(terraform output -raw ec2_public_ip)

    ssh -o StrictHostKeyChecking=no -i "${DEPLOY_DIR}/keys/${PROJECT_NAME}-key.pem" \
        ec2-user@${EC2_IP} "sudo certbot --nginx -d api.sqagriculture.com --noninteractive --agree-tos -m admin@sqagriculture.com"

    log "SSL configured"
}

# ===========================================
# Verify Deployment
# ===========================================

verify_deployment() {
    log "Verifying deployment..."

    API_URL="https://api.sqagriculture.com"

    # Wait for SSL to be ready
    sleep 10

    # Test API
    if curl -sf ${API_URL}/api/health &> /dev/null; then
        log "API is responding at ${API_URL}/api/health"
    else
        log_warn "API health check failed. Checking with HTTP..."
        if curl -sf http://${EC2_IP}:3001/api/health &> /dev/null; then
            log_warn "HTTP works but HTTPS may need more time to propagate"
        else
            log_error "API is not responding"
        fi
    fi

    log "Verification complete"
}

# ===========================================
# Show Final Summary
# ===========================================

show_summary() {
    EC2_IP=$(terraform output -raw ec2_public_ip)

    echo ""
    echo "============================================="
    echo "Deployment Complete!"
    echo "============================================="
    echo ""
    echo "Infrastructure:"
    echo "  - VPC with 2 subnets"
    echo "  - RDS PostgreSQL (db.t3.micro)"
    echo "  - EC2 API Server (t3.micro)"
    echo "  - Security Groups configured"
    echo ""
    echo "API Endpoints:"
    echo "  - HTTP:  http://${EC2_IP}:3001"
    echo "  - HTTPS: https://api.sqagriculture.com"
    echo ""
    echo "Useful Commands:"
    echo "  ssh -i keys/${PROJECT_NAME}-key.pem ec2-user@${EC2_IP}"
    echo "  pm2 status"
    echo "  pm2 logs sq-api"
    echo ""
    echo "Next Steps:"
    echo "  1. Update Namecheap DNS nameservers to Route 53"
    echo "  2. Update Vercel environment variables:"
    echo "     NEXT_PUBLIC_API_URL=https://api.sqagriculture.com"
    echo "  3. Redeploy Vercel frontend"
    echo ""
    echo "============================================="
}

# ===========================================
# Main
# ===========================================

main() {
    echo ""
    echo "============================================="
    echo "SQ Agriculture - Complete Deployment"
    echo "============================================="
    echo ""

    check_prerequisites
    generate_ssh_keys
    create_tfvars
    init_terraform
    plan_infrastructure
    apply_infrastructure
    get_outputs
    wait_for_ec2
    deploy_api
    configure_ssl
    verify_deployment
    show_summary

    log "All done!"
}

# Run main
main "$@"