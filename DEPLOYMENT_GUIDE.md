# AWS Deployment Guide - SQ Agriculture

## Prerequisites
- AWS Account
- Cloudinary Account (cloud_name, api_key, api_secret)
- Domain: sqagriculture.com
- SSH key pair for EC2

---

## Phase 1: Cloudinary Setup

### 1.1 Get Cloudinary Credentials
1. Go to https://cloudinary.com/console
2. Navigate to **Settings → API Keys**
3. Note down:
   - **Cloud Name**: (shown at top of dashboard)
   - **API Key**: (shown in API Keys section)
   - **API Secret**: (click "reveal" to see)

### 1.2 Create Upload Preset
1. Go to **Settings → Upload**
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Configure:
   - Name: `sq-agriculture-unsigned`
   - Signing Mode: **Unsigned**
   - Folder: `sq-agriculture`
5. Save

---

## Phase 2: AWS RDS PostgreSQL Setup

### 2.1 Create VPC
1. Go to AWS Console → VPC
2. Click **Create VPC**
3. Resources to create: **VPC only**
4. Name tag: `sq-agriculture-vpc`
5. IPv4 CIDR: `10.0.0.0/16`
6. Click **Create VPC**

### 2.2 Create Subnet Group
1. VPC Dashboard → **Subnet Groups** → **Create subnet group**
2. Name: `sq-agriculture-db-subnet-group`
3. VPC: Select `sq-agriculture-vpc`
4. Add subnets:
   - Availability Zone: ap-southeast-1a → Subnet: `10.0.1.0/24`
   - Availability Zone: ap-southeast-1b → Subnet: `10.0.2.0/24`
5. Click **Create**

### 2.3 Create RDS Instance
1. Go to RDS → **Create database**
2. Choose a database creation method: **Standard create**
3. Engine type: **PostgreSQL**
4. Version: **PostgreSQL 15.6** (or latest 15.x)
5. Templates: **Free tier**
6. Settings:
   - DB instance identifier: `sq-agriculture-db`
   - Master username: `postgres`
   - Master password: (set a strong password, **SAVE IT**)
7. Instance class: `db.t3.micro`
8. Storage:
   - Allocated storage: `20` GB
   - Storage autoscaling: **Uncheck** (free tier)
9. Connectivity:
   - Compute resource: **Don't connect to EC2 compute resource**
   - VPC: `sq-agriculture-vpc`
   - Subnet group: `sq-agriculture-db-subnet-group`
   - Public access: **No**
   - VPC security groups: **Create new**
     - Name: `sq-agriculture-rds-sg`
     - Remove default rule, add rule:
       - Type: PostgreSQL
       - Source: Custom → Search for `sq-agriculture-vpc` → select it
10. Additional configuration:
    - Initial database name: `sqagriculture`
    - Backup: Enable (free tier allows this)
11. Click **Create database**

**Wait 5-10 minutes for the instance to be available.**

### 2.4 Note Your RDS Endpoint
1. Click on your RDS instance
2. Copy the **Endpoint** (e.g., `sq-agriculture-db.xxxxx.ap-southeast-1.rds.amazonaws.com`)

---

## Phase 3: AWS EC2 Setup

### 3.1 Launch EC2 Instance
1. Go to EC2 → **Instances** → **Launch instances**
2. Name: `sq-agriculture-api`
3. Amazon Machine Image: **Amazon Linux 2023** (free tier)
4. Instance type: **t3.micro** (free tier)
5. Key pair: Create new or use existing
6. Network settings:
   - VPC: `sq-agriculture-vpc`
   - Subnet: `10.0.1.0/24` (ap-southeast-1a)
   - Auto-assign public IP: **Enable**
   - Firewall (security groups): **Create security group**
     - Name: `sq-agriculture-ec2-sg`
     - Description: Security group for API server
     - Add rules:
       | Type | Port | Source |
       |------|------|--------|
       | SSH | 22 | My IP |
       | HTTP | 80 | 0.0.0.0/0 |
       | HTTPS | 443 | 0.0.0.0/0 |
       | Custom TCP | 3001 | 0.0.0.0/0 |
7. Configure storage: 8 GB
8. Click **Launch instance**

### 3.2 SSH into EC2
```bash
ssh -i "your-key.pem" ec2-user@YOUR_EC2_PUBLIC_IP
```

To find your EC2 Public IP:
1. Go to EC2 → Instances
2. Select your instance
3. Copy the **Public IPv4 address**

### 3.3 Install Required Software
```bash
# Update packages
sudo dnf update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo dnf install -y nginx

# Install Git
sudo dnf install -y git

# Verify installations
node --version
npm --version
pm2 --version
nginx -v
```

### 3.4 Configure Nginx
```bash
sudo nano /etc/nginx/conf.d/api.conf
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name api.sqagriculture.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart Nginx:
```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
```

### 3.5 Setup SSL with Let's Encrypt
```bash
# Install Certbot
sudo dnf install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.sqagriculture.com

# Follow prompts (enter email, agree terms, etc.)

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## Phase 4: Route 53 DNS Setup

### 4.1 Create Hosted Zone
1. Go to Route 53 → **Hosted zones** → **Create hosted zone**
2. Domain name: `sqagriculture.com`
3. Type: **Public hosted zone**
4. Click **Create**

### 4.2 Create DNS Record for API
1. Click on your hosted zone
2. Click **Create record**
3. Record name: `api`
4. Record type: **A**
5. Value: (Your EC2 Public IPv4 address)
6. Routing policy: **Simple routing**
7. Click **Create**

### 4.3 Update Your Domain Registrar (if needed)
If your domain is registered elsewhere (GoDaddy, Namecheap, etc.):
1. Go to your registrar's DNS settings
2. Add NS records pointing to AWS Route 53 nameservers:
   - Copy the 4 NS records from your Route 53 hosted zone
   - Paste them as custom nameservers at your registrar

### 4.4 Verify DNS
```bash
nslookup api.sqagriculture.com
```
Should return your EC2 IP address.

---

## Phase 5: Prepare Your Code

### 5.1 Update API .env File
On your local machine, copy `.env.production` to `.env` and fill in:
```bash
cd apps/api
cp .env.production .env
nano .env
```

Fill in these values:
- `DATABASE_URL` - Your RDS endpoint
- `JWT_SECRET` - Generate a secure random string (32+ chars)
- `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
- `CLOUDINARY_API_KEY` - From Cloudinary settings
- `CLOUDINARY_API_SECRET` - From Cloudinary settings

### 5.2 Commit and Push
```bash
cd sq-agriculture
git add .
git commit -m "feat: Add Cloudinary integration and PostgreSQL support"
git push
```

---

## Phase 6: Deploy API to EC2

### 6.1 Clone Repository on EC2
```bash
cd /var/www
sudo git clone https://github.com/PavelNahiyan/sq-agriculture.git
cd sq-agriculture/apps/api
```

### 6.2 Setup Environment
```bash
# Create .env file
sudo nano .env
```

Paste your filled `.env` content (from step 5.1).

### 6.3 Install Dependencies
```bash
sudo npm install
```

### 6.4 Build
```bash
sudo npm run build
```

### 6.5 Run with PM2
```bash
# Setup PM2 startup
pm2 startup

# Start the API
pm2 start dist/main.js --name sq-api

# Save PM2 state
pm2 save

# Check status
pm2 status
```

### 6.6 Verify API is Running
```bash
curl http://localhost:3001/api/health
```

Should return a health response.

### 6.7 Test HTTPS
```bash
curl https://api.sqagriculture.com/api/health
```

---

## Phase 7: Update Vercel

### 7.1 Update Web Environment Variables
1. Go to Vercel Dashboard → Your project → Settings → Environment Variables
2. Update or add:
   - `NEXT_PUBLIC_API_URL` = `https://api.sqagriculture.com`

### 7.2 Redeploy
1. Go to Vercel → Deployments
2. Click "Redeploy" on the latest deployment

---

## Phase 8: Update RDS Security Group

After confirming everything works, tighten RDS security:

1. Go to RDS → Databases → Your instance
2. Click on the security group (`sq-agriculture-rds-sg`)
3. Edit inbound rules:
   - Type: PostgreSQL
   - Source: Custom → Search for `sq-agriculture-ec2-sg`
4. Save

---

## Troubleshooting

### API not responding
```bash
# Check PM2 logs
pm2 logs sq-api

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart sq-api
sudo systemctl restart nginx
```

### Database connection failed
- Verify RDS is in same VPC
- Check security group allows port 5432 from EC2
- Verify DATABASE_URL is correct

### SSL certificate issues
```bash
sudo certbot --nginx -d api.sqagriculture.com --force-reload
```

---

## Useful Commands

```bash
# SSH into EC2
ssh -i "key.pem" ec2-user@ec2-x-x-x-x.compute.amazonaws.com

# Check API status
pm2 status

# View API logs
pm2 logs sq-api --lines 50

# Restart API
pm2 restart sq-api

# Check SSL certificate expiry
sudo certbot certificates

# View Nginx config
sudo nginx -t
```

---

## Cost Estimation (Monthly)

| Service | Instance | Cost |
|---------|----------|------|
| RDS PostgreSQL | db.t3.micro | Free (750 hrs/month) |
| EC2 | t3.micro | Free (750 hours/month) |
| Cloudinary | Free tier | Free (25GB storage) |
| Route 53 | 1 hosted zone | $0.50/month |

**Total: ~$0.50/month**