# Changelog

All notable changes to the SQ Agriculture project will be documented in this file.

---

## [Version 1.0.0] - 2026-04-11

### 🚀 Features Added

#### Logo & Branding
- Updated header logo with SQ Agriculture branded logo
- Updated footer logo with SQ Agriculture branded logo  
- Updated admin panel logo with SQ Agriculture branded logo

#### Price Display
- Updated price placeholder to "Call for +880 1711 111111 for more information"
- Added clickable phone link on product cards
- Added clickable phone link on product detail pages
- Updated footer contact phone number

#### Product Categories
- Added new categories to database seed:
  - Tractors (ট্র্যাক্টর)
  - Rotavators (রোটাভেটর)
  - Lubricants & Oils (লুব্রিকেন্ট ও তেল)
  - Micronutrients (মাইক্রোনিউট্রিয়েন্টস)

#### Product Images
- Copied all product images from source materials folder:
  - Logo images to `/public/uploads/logo/`
  - Seed product images to `/public/uploads/products/seed/`
  - Pesticide product images to `/public/uploads/products/pesticide/`
  - Machinery product images to `/public/uploads/products/machinery/`
  - Lube & SP product images to `/public/uploads/products/lube/`

#### Admin Panel
- Full CRUD functionality for products already in place
- Full CRUD functionality for categories already in place
- Image upload support in product creation/editing

### 🐛 Bug Fixes
- Fixed TypeScript path alias issue for `@sq-agriculture/shared` module
- Updated tsconfig.json to include shared package paths

### ⚙️ Configuration Updates
- Updated API seed to include new category types:
  - MICRONUTRIENTS
  - LUBRICANTS
- Updated ProductUnit to include:
  - LITER
  - PIECE

---

## [Previous Versions]

### Version 0.9.0 - Initial Setup
- Project structure created with Turborepo
- Next.js 14 frontend with App Router
- NestJS backend with Prisma ORM
- SQLite database for development
- Full admin panel with authentication
- Public pages: Home, Products, Services, About, Contact, Blog
- Admin pages: Dashboard, Products, Categories, Leads, Inquiries, Users, Settings

---

## 📝 Notes

- Database seeded with sample data including admin user
- Admin credentials: admin@sq-agriculture.com / admin123
- All products currently have "Call for price" as placeholder
- Phone number used: +880 1711 111111

---

## 🔄 Future Updates

To add more products via admin panel:
1. Login to admin panel at /admin
2. Navigate to Products > Add New
3. Fill in product details and upload images
4. Save to publish on website

To update product prices:
1. Login to admin panel at /admin
2. Navigate to Products
3. Edit existing product or add new
4. Update price field

---

*Last updated: April 11, 2026*