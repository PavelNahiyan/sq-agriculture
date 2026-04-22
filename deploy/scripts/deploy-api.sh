#!/bin/bash
# ===========================================
# API Deployment Script - Run on EC2
# ===========================================
# This script:
# 1. Clones the repository
# 2. Installs dependencies
# 3. Builds the API
# 4. Configures environment variables
# 5. Starts the API with PM2
# 6. Configures SSL certificate

set -e

# ===========================================
# Configuration
# ===========================================

PROJECT_NAME="sq-agriculture"
API_DIR="/var/www/${PROJECT_NAME}"
REPO_URL="https://github.com/PavelNahiyan/sq-agriculture.git"
API_PORT=3001

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ===========================================
# Load Environment Variables
# ===========================================

load_env() {
    log_info "Loading environment variables from .env file..."

    if [ ! -f "${API_DIR}/apps/api/.env" ]; then
        log_error ".env file not found at ${API_DIR}/apps/api/.env"
        log_info "Please create the .env file with your configuration"
        exit 1
    fi

    export $(grep -v '^#' ${API_DIR}/apps/api/.env | xargs)
    log_info "Environment variables loaded"
}

# ===========================================
# Clone Repository
# ===========================================

clone_repo() {
    log_info "Cloning repository..."

    if [ -d "${API_DIR}" ]; then
        log_warn "Directory ${API_DIR} already exists"
        read -p "Do you want to update existing code? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cd ${API_DIR}
            git pull origin main
            log_info "Repository updated"
        fi
    else
        sudo mkdir -p /var/www
        sudo chown -R ec2-user:ec2-user /var/www
        git clone ${REPO_URL} ${API_DIR}
        log_info "Repository cloned"
    fi
}

# ===========================================
# Install Dependencies
# ===========================================

install_deps() {
    log_info "Installing dependencies..."

    cd ${API_DIR}/apps/api
    npm install
    log_info "Dependencies installed"
}

# ===========================================
# Build API
# ===========================================

build_api() {
    log_info "Building API..."

    cd ${API_DIR}/apps/api
    npm run build
    log_info "API built successfully"
}

# ===========================================
# Database Migration
# ===========================================

migrate_db() {
    log_info "Running database migrations..."

    cd ${API_DIR}/apps/api

    # Generate Prisma client
    npx prisma generate

    # Push schema to database (creates tables if they don't exist)
    npx prisma db push

    log_info "Database migrations complete"
}

# ===========================================
# Configure PM2
# ===========================================

configure_pm2() {
    log_info "Configuring PM2..."

    cd ${API_DIR}/apps/api

    # Stop existing process if running
    pm2 stop sq-api 2>/dev/null || true

    # Delete existing process if exists
    pm2 delete sq-api 2>/dev/null || true

    # Start the API
    pm2 start dist/main.js --name sq-api

    # Save PM2 state
    pm2 save

    # Setup PM2 startup
    pm2 startup

    log_info "PM2 configured"
}

# ===========================================
# Configure SSL
# ===========================================

configure_ssl() {
    log_info "Configuring SSL certificate..."

    # Get the domain from environment or use default
    API_DOMAIN="${API_DOMAIN:-api.sqagriculture.com}"

    # Check if certificate already exists
    if sudo certbot certificates 2>/dev/null | grep -q "${API_DOMAIN}"; then
        log_info "SSL certificate already exists for ${API_DOMAIN}"
        return 0
    fi

    # Request new certificate
    sudo certbot --nginx -d ${API_DOMAIN} --noninteractive --agree-tos -m admin@${API_DOMAIN}

    # Setup auto-renewal
    sudo systemctl enable certbot-renew.timer
    sudo systemctl start certbot-renew.timer

    log_info "SSL certificate configured"
}

# ===========================================
# Verify Deployment
# ===========================================

verify_deployment() {
    log_info "Verifying deployment..."

    # Wait for API to start
    sleep 5

    # Check if API is responding
    if curl -sf http://localhost:${API_PORT}/api/health > /dev/null; then
        log_info "API is responding on port ${API_PORT}"
    else
        log_warn "API health check failed. Checking logs..."
        pm2 logs sq-api --lines 20
    fi

    # Check HTTPS if domain is configured
    API_DOMAIN="${API_DOMAIN:-api.sqagriculture.com}"
    if curl -sf https://${API_DOMAIN}/api/health > /dev/null; then
        log_info "HTTPS API is responding"
    else
        log_warn "HTTPS not configured yet. Run 'sudo certbot --nginx -d ${API_DOMAIN}' to configure SSL."
    fi

    # Show PM2 status
    pm2 status
}

# ===========================================
# Show Status
# ===========================================

show_status() {
    echo ""
    echo "============================================="
    echo "Deployment Summary"
    echo "============================================="
    echo "API Directory: ${API_DIR}/apps/api"
    echo "API Port: ${API_PORT}"
    echo ""
    echo "Useful Commands:"
    echo "  pm2 status          - Check API status"
    echo "  pm2 logs sq-api     - View API logs"
    echo "  pm2 restart sq-api  - Restart API"
    echo "  pm2 monit           - Monitor resources"
    echo ""
    echo "============================================="
}

# ===========================================
# Main
# ===========================================

main() {
    echo ""
    echo "============================================="
    echo "SQ Agriculture API Deployment"
    echo "============================================="

    load_env
    clone_repo
    install_deps
    build_api
    migrate_db
    configure_pm2
    configure_ssl
    verify_deployment
    show_status

    log_info "Deployment complete!"
}

# Run main function
main "$@"