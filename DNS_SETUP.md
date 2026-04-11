# Domain DNS Setup Guide for Namecheap

## Quick Summary

Your domain `sqagriculture.com` has been added to Vercel. Now you need to add DNS records at Namecheap to make it work.

---

## Step-by-Step Instructions

### 1. Login to Namecheap
Go to: https://www.namecheap.com/login

### 2. Access Domain Settings
- Click **"Dashboard"** in the top menu
- Find **"Domain List"** 
- Click **"Manage"** next to `sqagriculture.com`

### 3. Find DNS Settings
Scroll down to the **"DNS"** section (usually near the bottom)

### 4. Add These Records

Delete any existing A records and CNAME records, then add:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| **A Record** | @ | 76.76.21.21 | Automatic |
| **CNAME** | www | cname.vercel-dns.com | Automatic |

### 5. Save Changes
Click **"Save Changes"** button at the bottom

---

## How to Add Each Record

### For A Record:
1. Click **"Add New Record"**
2. Type: **A Record**
3. Host: **@**
4. Value: **76.76.21.21**
5. TTL: **Automatic**

### For CNAME Record:
1. Click **"Add New Record"**
2. Type: **CNAME Record**
3. Host: **www**
4. Value: **cname.vercel-dns.com**
5. TTL: **Automatic**

---

## After Saving

1. **Wait 5-30 minutes** for DNS to propagate
2. Test at: https://sqagriculture.com

---

## Troubleshooting

If it doesn't work after 30 minutes:
- Make sure you saved the changes
- Check that records are exactly as shown
- Try clearing your browser cache

---

## Need Help?

Take a screenshot of your Namecheap DNS page and share it if you need assistance!