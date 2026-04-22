# SQ Agriculture - AWS Deployment Guide

## Overview

This directory contains everything needed to deploy SQ Agriculture to AWS with:
- **Terraform** for infrastructure provisioning
- **EC2** for the API server
- **RDS PostgreSQL** for the database
- **Cloudinary** for image storage
- **Route 53** for DNS
- **Let's Encrypt** for SSL certificates

---

## Prerequisites

### Required Software

| Software | Version | Install Guide |
|----------|---------|---------------|
| Terraform | ≥ 1.0.0 | [terraform.io/downloads](https://www.terraform.io/downloads) |
| AWS CLI | v2 | [docs.aws.amazon.com/cli](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) |

### Required Accounts

- [x] AWS Account
- [x] Cloudinary Account (credentials ready)
- [ ] Namecheap account (for DNS)
- [ ] GitHub account (repo access)

### AWS Setup

1. **Create AWS Access Keys:**
   - Go to AWS Console → IAM → Users → Create User
   - Attach permissions: `AdministratorAccess`
   - Create Access Key
   - Save Access Key ID and Secret Access Key

2. **Configure AWS CLI:**
   ```bash
   aws configure
   # Enter your Access Key ID
   # Enter your Secret Access Key
   # Default region: ap-southeast-1
   # Output format: json
   ```

---

## Quick Start

### Option 1: One-Command Deployment

```bash
# Navigate to deploy directory
cd sq-agriculture/deploy

# Run the deployment script
./deploy.sh
```

The script will:
1. Generate SSH keys
2. Create Terraform configuration
3. Provision AWS infrastructure
4. Deploy API to EC2
5. Configure SSL certificate

### Option 2: Step-by-Step

#### Step 1: Generate SSH Keys
```bash
cd deploy
bash scripts/generate-keys.sh
```

#### Step 2: Create Terraform Variables
Create `terraform.tfvars` in the `deploy` directory:

```hcl
db_master_password = "your-secure-db-password"
cloudinary_api_secret = "xdZxF2ujfVvV2WcvfjZoqo6jqNU"
```

#### Step 3: Initialize and Apply Terraform
```bash
cd deploy
terraform init
terraform plan
terraform apply
```

#### Step 4: Deploy API
```bash
# SSH into EC2
ssh -i keys/sq-agriculture-key.pem ec2-user@<EC2_IP>

# Run deployment script
bash /tmp/deploy-api.sh
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      sqagriculture.com                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐         ┌─────────────────────────────┐│
│  │   Vercel        │         │   AWS (ap-southeast-1)      ││
│  │   Frontend      │         │                             ││
│  │                 │         │  ┌─────────────────────┐   ││
│  │ www.sqagri...   │────┐    │  │  VPC (10.0.0.0/16)   │   ││
│  │                 │    │    │  │                      │   ││
│  │ admin panel     │    │    │  │  ┌─────────────┐     │   ││
│  │ products        │────┼───▶│  │  │  EC2         │     │   ││
│  │ image upload    │    │    │  │  │  API Server  │     │   ││
│  └─────────────────┘    │    │  │  │  (t3.micro)  │     │   ││
│                         │    │  │  └──────┬──────┘     │   ││
│                         │    │  │         │            │   ││
│                         │    │  │  ┌──────▼──────┐     │   ││
│                         │    │  │  │  RDS         │     │   ││
│                         │    │  │  │  PostgreSQL  │     │   ││
│                         │    │  │  │  (db.t3.mi)  │     │   ││
│                         │    │  │  └─────────────┘     │   ││
│                         │    │  └─────────────────────┘   ││
│                         │    │                             ││
│                         │    │  ┌─────────────────────┐   ││
│                         │    │  │  Cloudinary         │   ││
│                         │    │  │  Image Storage      │   ││
│                         │    │  └─────────────────────┘   ││
│                         │    └─────────────────────────────┘│
│                         │                                    │
│                         ▼                                    │
│              ┌──────────────────────┐                      │
│              │  api.sqagriculture.com│                      │
│              │  (Route 53 DNS)       │                      │
│              └──────────────────────┘                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
deploy/
├── deploy.sh                  # Main deployment orchestrator
├── deploy-infra.tf            # Terraform infrastructure code
├── terraform.tfvars           # Terraform variables (create this)
├── scripts/
│   ├── generate-keys.sh       # SSH key generation
│   ├── userdata.sh            # EC2 initial setup (runs on boot)
│   └── deploy-api.sh          # API deployment script (runs on EC2)
├── keys/
│   ├── sq-agriculture-key.pem # Private key (generated)
│   └── sq-agriculture-key.pub # Public key (generated)
└── README.md                  # This file
```

---

## DNS Configuration

After deployment, you need to configure DNS:

### Option 1: Route 53 (Recommended)

1. Go to AWS Route 53 → Create Hosted Zone
2. Domain: `sqagriculture.com`
3. Create an A record:
   - Name: `api`
   - Type: A
   - Value: EC2 Public IP

### Option 2: Namecheap

1. Go to Namecheap → Domain → Advanced DNS
2. Delete existing NS records
3. Add custom nameservers pointing to Route 53 NS servers

---

## Environment Variables

The following variables are needed in `terraform.tfvars`:

| Variable | Description | Example |
|----------|-------------|---------|
| `db_master_password` | PostgreSQL master password | `SecurePass123!` |
| `cloudinary_api_secret` | Cloudinary API secret | `xdZxF2ujfVvV2WcvfjZoqo6jqNU` |
| `aws_region` | AWS region | `ap-southeast-1` |
| `domain_name` | Your domain | `sqagriculture.com` |
| `api_subdomain` | API subdomain | `api.sqagriculture.com` |

---

## Useful Commands

### AWS CLI
```bash
# Check AWS credentials
aws sts get-caller-identity

# List EC2 instances
aws ec2 describe-instances --region ap-southeast-1

# List RDS instances
aws rds describe-db-instances --region ap-southeast-1
```

### Terraform
```bash
# Initialize
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply

# Show outputs
terraform output

# Destroy infrastructure
terraform destroy
```

### EC2 SSH
```bash
# Connect to EC2
ssh -i keys/sq-agriculture-key.pem ec2-user@<EC2_IP>

# Copy file to EC2
scp -i keys/sq-agriculture-key.pem file.txt ec2-user@<EC2_IP>:~/

# Run command on EC2
ssh -i keys/sq-agriculture-key.pem ec2-user@<EC2_IP> "pm2 status"
```

### PM2 (on EC2)
```bash
# Check status
pm2 status

# View logs
pm2 logs sq-api

# Restart API
pm2 restart sq-api

# Monitor resources
pm2 monit
```

### SSL Certificate
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

---

## Troubleshooting

### Terraform Issues

**"Error: No valid credential sources found"**
```bash
aws configure
```

**"Error: VPC not found"**
```bash
terraform apply  # Re-run after VPC is created
```

### EC2 Issues

**"Connection refused"**
- Wait 2-3 minutes for EC2 to fully initialize
- Check security groups allow SSH (port 22)

**"Permission denied (publickey)"**
```bash
chmod 400 keys/sq-agriculture-key.pem
```

### API Issues

**"Database connection failed"**
- Check RDS security group allows EC2
- Verify DATABASE_URL is correct

**"Upload failed"**
- Check Cloudinary credentials
- Verify CLOUDINARY_API_SECRET is correct

### SSL Issues

**"Certificate not found"**
```bash
sudo certbot --nginx -d api.sqagriculture.com
```

---

## Cost Estimation

| Resource | Type | Monthly Cost |
|----------|------|--------------|
| EC2 | t3.micro | Free (750h) |
| RDS | db.t3.micro | Free (750h) |
| Route 53 | 1 hosted zone | $0.50 |
| Cloudinary | Free tier | Free |
| **Total** | | **~$0.50/month** |

---

## Cleanup

To destroy all AWS resources:

```bash
cd deploy
terraform destroy
```

**Warning:** This will delete all data in the database!

---

## Support

For issues or questions:
- Check Terraform outputs: `terraform output`
- Check EC2 logs: `pm2 logs sq-api`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`