# AWS Deployment Guide for SQ Agriculture

This guide covers deploying the SQ Agriculture application to AWS EC2 with PostgreSQL on RDS.

## Architecture Overview

```
                    ┌─────────────────┐
                    │   Route 53      │
                    │   (DNS)         │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    ALB (HTTPS)   │
                    │   (SSL/TLS)      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Nginx (EC2)    │
                    │   Reverse Proxy  │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
┌────────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│   API (NestJS)   │  │  Web (Next) │  │   PostgreSQL    │
│   Port 3001      │  │  Port 3000  │  │   (RDS)         │
└─────────────────┘  └─────────────┘  └─────────────────┘
```

## Prerequisites

- AWS Account
- Domain name (sqagriculture.com)
- SSH key pair for EC2

---

## Step 1: AWS RDS PostgreSQL Setup

### 1.1 Create Subnet Group

1. Go to **RDS > Subnet Groups**
2. Create subnet group:
   - Name: `sq-agriculture-db-subnet`
   - Description: Subnet group for SQ Agriculture database
   - Add both public and private subnets

### 1.2 Create RDS Instance

1. Go to **RDS > Create database**
2. Choose:
   - **Engine**: PostgreSQL
   - **Version**: 15.x or latest
   - **Template**: Production (or Free Tier for testing)
3. Settings:
   - **DB Instance Identifier**: `sq-agriculture-db`
   - **Master Username**: `sqadmin`
   - **Master Password**: `YourSecurePassword123!`
4. Configuration:
   - **Instance Class**: db.t3.micro (free tier) or db.t3.small (production)
   - **Storage**: 20 GB (gp3)
   - Enable auto-scaling if needed
5. Connectivity:
   - **VPC**: Default or dedicated VPC
   - **Public Access**: NO (private database)
   - **Security Group**: Create new sg-postgres-sq-agriculture
6. Database Options:
   - **Initial Database Name**: `sq_agriculture`

### 1.3 Configure Security Group

1. Go to **EC2 > Security Groups**
2. Create/Edit `sg-postgres-sq-agriculture`:
   - **Inbound**: PostgreSQL (5432) from EC2 security group only
   - **Outbound**: Allow all

---

## Step 2: EC2 Instance Setup

### 2.1 Launch EC2 Instance

1. Go to **EC2 > Launch Instance**
2. Choose:
   - **AMI**: Amazon Linux 2023 or Ubuntu 22.04 LTS
   - **Instance Type**: t3.small (production) or t3.micro (testing)
   - **Key Pair**: Create or select existing
3. Network Settings:
   - **VPC**: Default
   - **Subnet**: Public subnet
   - **Auto-assign Public IP**: Enable
   - **Security Group**: Create new or use existing
4. Storage: 30 GB gp3

### 2.2 Configure Security Group

1. Create `sg-sq-agriculture` security group:
   - **Inbound**:
     - HTTP (80) from anywhere
     - HTTPS (443) from anywhere
     - SSH (22) from your IP only
   - **Outbound**: Allow all

### 2.3 Connect to EC2

```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

---

## Step 3: Install Dependencies on EC2

### 3.1 Update and Install Packages

```bash
# Update system
sudo yum update -y   # Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y   # Ubuntu

# Install Docker
sudo yum install -y docker   # Amazon Linux
# OR
sudo apt install -y docker.io   # Ubuntu

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt install -y git   # Ubuntu
```

### 3.2 Clone Repository

```bash
cd /opt
sudo git clone https://github.com/your-repo/sq-agriculture.git
cd sq-agriculture
sudo chown -R $USER:$USER /opt/sq-agriculture
```

---

## Step 4: Environment Configuration

### 4.1 Create Production Environment File

```bash
cd /opt/sq-agriculture
cp .env.example .env
nano .env
```

Update with production values:

```env
# Database - Use your RDS endpoint
DATABASE_URL="postgresql://sqadmin:YourSecurePassword123!@sq-agriculture-db.xxxx.us-east-1.rds.amazonaws.com:5432/sq_agriculture"

# JWT - Generate strong secrets
JWT_SECRET="generate-random-64-character-string-here"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="generate-random-64-character-string-here"
JWT_REFRESH_EXPIRES_IN="30d"
JWT_RESET_SECRET="generate-random-string-here"
JWT_VERIFY_SECRET="generate-random-string-here"

# SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-specific-password"
SMTP_FROM="SQ Agriculture <noreply@sqagriculture.com>"

# URLs - Use your domain
FRONTEND_URL="https://www.sqagriculture.com"
API_URL="https://api.sqagriculture.com"

NODE_ENV="production"
```

### 4.2 Generate JWT Secrets

```bash
openssl rand -base64 32
```

Use the output for each JWT secret.

---

## Step 5: Configure Nginx

### 5.1 Install Nginx

```bash
sudo apt install -y nginx   # Ubuntu
# OR
sudo yum install -y nginx   # Amazon Linux
```

### 5.2 Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/sq-agriculture
```

Add the following configuration:

```nginx
upstream api_backend {
    server 127.0.0.1:3001;
}

upstream web_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name sqagriculture.com www.sqagriculture.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name sqagriculture.com www.sqagriculture.com;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/sqagriculture.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sqagriculture.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend (Next.js)
    location / {
        proxy_pass http://web_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API (NestJS)
    location /api {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5.3 Enable Configuration

```bash
sudo ln -s /etc/nginx/sites-available/sq-agriculture /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 6: SSL Certificate (Let's Encrypt)

### 6.1 Install Certbot

```bash
# Ubuntu
sudo apt install -y certbot python3-certbot-nginx

# Amazon Linux
sudo yum install -y certbot
```

### 6.2 Obtain SSL Certificate

```bash
sudo certbot --nginx -d sqagriculture.com -d www.sqagriculture.com
```

Follow the prompts to enter email and agree to terms.

### 6.3 Auto-Renewal

```bash
sudo certbot renew --dry-run
```

Certbot automatically adds a cron job for renewal. Verify with:

```bash
sudo systemctl list-timers
```

---

## Step 7: Deploy Application

### 7.1 Build and Start Services

```bash
cd /opt/sq-agriculture

# Build Docker images
docker-compose build

# Start services
docker-compose up -d
```

### 7.2 Verify Services

```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs -f api
docker-compose logs -f web
```

### 7.3 Run Database Migrations

```bash
docker-compose exec api npx prisma migrate deploy
```

---

## Step 8: Domain Configuration (Route 53)

### 8.1 Create Hosted Zone

1. Go to **Route 53 > Hosted Zones**
2. Create hosted zone:
   - Domain name: `sqagriculture.com`
   - Type: Public hosted zone

### 8.2 Create Records

1. **A Record for Root**:
   - Name: `sqagriculture.com`
   - Type: A
   - Value: Your EC2 Elastic IP

2. **A Record for WWW**:
   - Name: `www.sqagriculture.com`
   - Type: A
   - Value: Your EC2 Elastic IP

3. **CNAME for API** (optional):
   - Name: `api.sqagriculture.com`
   - Type: CNAME
   - Value: `sqagriculture.com`

### 8.3 Update Nameservers

Update your domain registrar's nameservers to match the Route 53 NS records.

---

## Step 9: Monitoring and Maintenance

### 9.1 Set Up CloudWatch Logs

```bash
# Install CloudWatch agent
sudo yum install -y amazon-cloudwatch-agent
```

Configure `/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`:

```json
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/lib/docker/containers/*.log",
            "log_group_name": "/sq-agriculture/containers"
          }
        ]
      }
    }
  }
}
```

### 9.2 Automated Backups

1. Configure RDS automated backups in AWS Console
2. Set retention period (7 days recommended)

### 9.3 Health Checks

```bash
# Add to crontab
*/5 * * * * curl -f https://api.sqagriculture.com/health || echo "API down" | mail admin@example.com
```

---

## Step 10: Troubleshooting

### Check Container Logs
```bash
docker-compose logs api
docker-compose logs web
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild After Updates
```bash
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Issues
1. Verify security group allows connection from EC2 to RDS
2. Check RDS is in same VPC or peered
3. Test connection: `psql -h <rds-endpoint> -U sqadmin -d sq_agriculture`

---

## Security Checklist

- [ ] Use strong passwords for RDS
- [ ] Restrict SSH access to your IP only
- [ ] Enable SSL/TLS
- [ ] Keep software updated
- [ ] Use IAM roles instead of access keys
- [ ] Enable RDS encryption
- [ ] Configure proper security groups
- [ ] Regular backups enabled