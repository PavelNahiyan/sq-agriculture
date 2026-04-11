# SQ Agriculture - Admin Guide

Complete guide for managing the SQ Agriculture website admin panel.

---

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@sq-agriculture.com | admin123 |
| **Manager** | manager@sqagriculture.com | manager123 |
| **Customer** | customer@test.com | customer123 |

### How to Login
1. Visit: `https://sqagriculture.com/admin/login`
2. Enter email and password
3. Click "Sign In"
4. You will be redirected to admin dashboard

---

## 📊 Admin Dashboard

After login, you'll see the admin dashboard with:
- Quick stats (Total Products, Categories, Leads, Inquiries)
- Recent activity
- Quick action buttons

---

## 🛒 Products Management

### View All Products
1. Go to **Products** in the sidebar
2. You'll see a table with all products
3. Use search box to find specific products
4. Use category dropdown to filter by category

### Add New Product
1. Go to **Products** > Click **Add New** button
2. Fill in the form:
   - **Name** (required): Product name in English
   - **Name (Bengali)**: Product name in Bengali
   - **Slug** (required): URL-friendly name (e.g., "sq-etian-tt47")
   - **Description** (required): Product description
   - **Description (Bengali)**: Bengali description
   - **Price**: Leave empty for "Call for price" display
   - **Unit**: KG, GRAM, BAG, UNIT, LITER, PIECE
   - **Category** (required): Select from dropdown
   - **Images**: Enter image URLs (one per line)
   - **Featured**: Check to show on homepage
   - **In Stock**: Check if available
   - **Active**: Check to publish
3. Click **Create Product**

### Edit Product
1. Go to **Products**
2. Click **Edit** (pencil icon) on the product row
3. Modify any fields
4. Click **Update Product**

### Delete Product
1. Go to **Products**
2. Click **Delete** (trash icon) on the product row
3. Confirm deletion in the popup
4. Product will be permanently removed

---

## 📁 Categories Management

### View All Categories
1. Go to **Categories** in the sidebar
2. See all categories with their types

### Add New Category
1. Go to **Categories** > Click **Add New** button
2. Fill in:
   - **Name** (required): Category name
   - **Name (Bengali)**: Bengali name
   - **Slug** (required): URL-friendly name
   - **Description**: Category description
   - **Type**: SEEDS, PESTICIDES, FERTILIZERS, MACHINERY, MICRONUTRIENTS, LUBRICANTS
   - **Sort Order**: Display priority (lower = first)
   - **Active**: Check to show on website
3. Click **Create Category**

### Edit Category
1. Go to **Categories**
2. Click **Edit** on the category
3. Modify fields as needed
4. Click **Update Category**

### Delete Category
1. Go to **Categories**
2. Click **Delete** on the category
3. Note: Deleting a category will also delete all its products!

---

## 📬 Leads Management

### View Leads
1. Go to **Leads** in the sidebar
2. See all customer inquiries

### Update Lead Status
1. Click on a lead row
2. Change status: NEW → CONTACTED → QUALIFIED → CONVERTED or LOST
3. Add notes in the notes field

---

## 💬 Inquiries Management

### View Inquiries
1. Go to **Inquiries** in the sidebar
2. See all contact form submissions

### Update Inquiry Status
1. Click on an inquiry
2. Change status: NEW → READ → REPLIED → CLOSED

---

## 👥 User Management

### View Users
1. Go to **Users** in the sidebar
2. See all registered users

### Add New User
1. Click **Add New User**
2. Fill: Name, Email, Phone, Role (ADMIN, MANAGER, CUSTOMER, USER)
3. Set initial password

### Edit User
1. Click **Edit** on user row
2. Modify details
3. Click **Update**

---

## ⚙️ Settings

### Update Site Settings
1. Go to **Settings**
2. Update:
   - Site name
   - Contact email
   - Contact phone
   - Address
3. Changes apply immediately

---

## 📱 Key Features

### Price Display
- **With Price**: Shows formatted price (e.g., "৳850,000")
- **Without Price**: Shows "Call for +880 1711 111111" with clickable phone link

### Product Images
- Add image URLs in the product form
- Supports multiple images (displayed in product gallery)
- Recommended size: 800x800px or larger

### Featured Products
- Check "Featured" when creating/editing a product
- Featured products appear on homepage

---

## 🔧 Troubleshooting

### Can't login?
- Check email/password is correct
- Clear browser cache and try again
- Contact admin if account is locked

### Images not showing?
- Verify image URL is correct and public
- Use absolute URLs (starting with http/https or /)

### Changes not appearing?
- Clear browser cache
- Check if product is set to "Active"

---

## 📞 Support

For technical support or questions:
- Email: admin@sq-agriculture.com
- Phone: +880 1711 111111

---

*Last updated: April 11, 2026*