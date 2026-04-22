#!/bin/bash
# ===========================================
# EC2 User Data Script - Runs on First Boot
# ===========================================
# This script installs and configures:
# - Node.js 18
# - PM2 (Process Manager)
# - Nginx (Reverse Proxy)
# - SSL Certificate (Let's Encrypt)
# - Git

set -e

PROJECT_NAME="${project_name}"
API_DOMAIN="${api_domain}"

echo "============================================="
echo "Starting EC2 Setup for ${PROJECT_NAME}"
echo "============================================="

# ===========================================
# Update System
# ===========================================
echo "[1/8] Updating system packages..."
sudo dnf update -y

# ===========================================
# Install Node.js 18
# ===========================================
echo "[2/8] Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Verify Node.js installation
node --version
npm --version

# ===========================================
# Install PM2
# ===========================================
echo "[3/8] Installing PM2..."
sudo npm install -g pm2
pm2 --version

# Setup PM2 startup
pm2 startup
pm2 save

# ===========================================
# Install Nginx
# ===========================================
echo "[4/8] Installing Nginx..."
sudo dnf install -y nginx

# Configure Nginx
sudo tee /etc/nginx/conf.d/api.conf > /dev/null <<EOF
server {
    listen 80;
    server_name ${API_DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable and start Nginx
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "Nginx configured and started"

# ===========================================
# Install Git
# ===========================================
echo "[5/8] Installing Git..."
sudo dnf install -y git

# ===========================================
# Install Certbot (SSL)
# ===========================================
echo "[6/8] Installing Certbot for SSL..."
sudo dnf install -y certbot python3-certbot-nginx

# ===========================================
# Create Application Directory
# ===========================================
echo "[7/8] Creating application directory..."
sudo mkdir -p /var/www/${PROJECT_NAME}
sudo chown -R ec2-user:ec2-user /var/www/${PROJECT_NAME}

# ===========================================
# Setup Firewall (if needed)
# ===========================================
echo "[8/8] Configuring firewall..."
# Amazon Linux 2023 uses firewalld
sudo systemctl start firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

echo "============================================="
echo "EC2 Setup Complete!"
echo "============================================="
echo "Next steps:"
echo "1. SSH into the instance"
echo "2. Clone the repository"
echo "3. Run deployment script"
echo "4. Configure SSL certificate"
echo "============================================="

exit 0