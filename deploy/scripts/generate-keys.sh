#!/bin/bash
# ===========================================
# Generate SSH Key Pair
# ===========================================

KEY_PATH="./keys/sq-agriculture-key"

echo "Generating SSH key pair..."

# Check if key already exists
if [ -f "${KEY_PATH}.pem" ]; then
    echo "SSH key already exists at ${KEY_PATH}.pem"
    echo "Public key:"
    cat "${KEY_PATH}.pub"
    exit 0
fi

# Generate new key pair
ssh-keygen -t rsa -b 4096 -f "${KEY_PATH}" -N "" -C "sq-agriculture-ec2-key"

# Set correct permissions
chmod 400 "${KEY_PATH}.pem"

echo ""
echo "SSH key pair generated successfully!"
echo "Private key: ${KEY_PATH}.pem"
echo "Public key: ${KEY_PATH}.pub"
echo ""
echo "Contents of public key (add this to Terraform or AWS):"
cat "${KEY_PATH}.pub"