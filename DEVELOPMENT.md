# SQ Agriculture Website - Development History

## Development Timeline

---

### Phase 1: Initial Setup & Bug Fixes

**Date:** April 2026

#### 1.1 - Fix API URL Bug
- Fixed frontend API URL configuration in `next.config.js`
- Changed from hardcoded localhost to environment variable

#### 1.2 - Fix TypeScript Errors
- Added `isPreOwned` and `preOwnedDetails` fields to Product types
- Updated `shared-types.ts` and `types/index.ts`

#### 1.3 - Fix Fertilizer Category Type
- Changed category type from PESTICIDES to FERTILIZERS in seed data

---

### Phase 2: Product Pages Fix

**Date:** April 2026

#### 2.1 - Add Category Type Support
- Added MICRONUTRIENTS and LUBRICANTS to CategoryType constants
- Added `categoryType` filter support to products service
- Added `isPreOwned` filter support
- Added index on Category.type field

#### 2.2 - Fix All Product Pages
- Seeds page: Use categoryType: 'SEEDS'
- Pesticide page: Use categoryType: 'PESTICIDES'
- Fertilizer page: Use categoryType: 'FERTILIZERS' (was incorrectly including PESTICIDES)
- Micronutrients page: Complete rewrite
- Machinery page: Use categoryType: 'MACHINERY', added sprayers section
- Field-machinery page: Use categoryType: 'MACHINERY'
- Pre-owned-machines page: Fix API endpoint to use isPreOwned=true

#### 2.3 - Add useProducts Hook Updates
- Added isPreOwned parameter support

---

### Phase 3: Contact Information Update

**Date:** April 2026

#### 3.1 - Update Footer
- Address: 9th Floor, Suvastu Suraiya Trade Center, 57 Kemal Ataturk Avenue, Banani, Dhaka-1213
- Phone: +880 1321-219223
- Email: agriculture@sq-bd.com

#### 3.2 - Update All Product Pages
- Updated contact info on Seeds, Pesticide, Fertilizer, Micronutrients, Machinery, Field-machinery pages
- Updated Contact page
- Updated Admin settings page

---

### Phase 4: Inquire System

**Date:** April 2026

#### 4.1 - Database Schema Updates
- Added `hidePrice` Boolean field to Product model
- Added `contactEmail` String field
- Added `contactPhone` String field
- Added `contactWhatsApp` String field

#### 4.2 - Create InquireModal Component
- New component showing product-specific contacts
- Email with mailto link
- Phone with tel link
- WhatsApp with direct link

#### 4.3 - Update Frontend Components
- Product Card: Show price OR inquire button (based on hidePrice)
- Product Detail page: Show price OR inquire button with modal

#### 4.4 - Admin Panel Updates
- New Product form: Added hidePrice checkbox and contact fields
- Edit Product form: Added schema fields

---

### Phase 5: Factory License Information

**Date:** April 2026

#### 5.1 - Create LicenseInfo Component
- Company: SQ Nafis Crop Care Limited
- Factory Address: Gazaria, Gabtali, Gabtali, Bogura, Rajshahi
- License Number: 10-40-1-048-00001
- Registration Number: 10-40-1-048-00001
- Category: B (Factory)

#### 5.2 - Add to Product Pages
- Pesticide page: Added before Contact section
- Fertilizer page: Added before Contact section
- Micronutrients page: Added before Contact section
- Product Detail page: Added in tabs section

---

### Phase 6: Product Data & Images

**Date:** April 2026

#### 6.1 - Add Vegetable Seeds
- Added 145+ seed varieties from Excel file
- 19 crop types including Bitter Gourd, Cabbage, Cauliflower, Chilli, etc.

#### 6.2 - Add Pesticide Products
- Herbicides: Faclor, Emulin, Eros Gold, Orin
- Fungicides: Keatav, Thot, Oriter, Nikizeb, Manconil, Trichoderma
- Insecticides: Enithrin, Keatin, Evic Plus, Keratin, Manthasha, etc.
- Total: 37+ products

#### 6.3 - Add Fertilizer Products
- Urea 46% N, TSP 46%, MOP 60%, DAP, Gypsum
- 5 products

#### 6.4 - Add Micronutrients Products
- Boron Max, Magnus, Turbo Gypsum, Tiger Zinc, Spray Potash, etc.
- 9 products

#### 6.5 - Add Sprayer Products
- SQ Professional Sprayer 20L
- SQ Heavy Duty Sprayer 16L
- SQ Battery Powered Sprayer 18L
- SQ Mini Hand Sprayer 2L
- SQ Garden Sprayer 5L
- SQ Agricultural Sprayer 12L
- 6 products

#### 6.6 - Add Pre-Owned Machines
- 4 Tractors
- 3 Harvesters
- 7 products

#### 6.7 - Copy Product Images
- Copied images from Materials folder to public/uploads
- Pesticide images: 35 images
- Machinery images: Including sprayers
- Seeds images: 18 images
- Lubricants images: 6 images

---

### Phase 7: Homepage & UI Improvements

**Date:** April 2026

#### 7.1 - Add ImageSlider Component
- Created 5-slide homepage slider
- Added slider images to public/uploads/sliders/

#### 7.2 - Audit Trail System
- Added ActivityLog model
- Added audit fields to Product model
- Created AuditService and ActivityService
- Updated ProductsService to log CREATE, UPDATE, DELETE

---

### Phase 8: Production Readiness

**Date:** April 2026

#### 8.1 - Environment Configuration
- Fixed next.config.js to use NEXT_PUBLIC_API_URL environment variable
- Created .env.production.local template
- Ready for Vercel + Railway deployment

---

## File Changes Summary

### Backend (API)
- `apps/api/src/common/constants.ts` - Category types
- `apps/api/src/modules/products/products.service.ts` - Filters
- `apps/api/src/modules/products/dto/products.dto.ts` - Query DTO
- `apps/api/prisma/schema.prisma` - Database schema
- `apps/api/prisma/seed.ts` - Product data

### Frontend (Web)
- All product pages (seeds, pesticide, fertilizer, micronutrients, machinery, field-machinery, pre-owned-machines)
- `apps/web/src/components/features/product-card.tsx` - Inquire button
- `apps/web/src/components/features/inquire-modal.tsx` - Contact modal
- `apps/web/src/components/features/license-info.tsx` - Factory info
- `apps/web/src/components/features/image-slider.tsx` - Homepage slider
- `apps/web/src/hooks/use-products.ts` - Hook updates
- `apps/web/src/lib/shared-types.ts` - Type definitions
- `apps/web/src/types/index.ts` - Type definitions
- `apps/web/next.config.js` - Environment variable

### Admin Panel
- `apps/web/src/app/admin/products/new/page.tsx` - New fields
- `apps/web/src/app/admin/products/[id]/edit/page.tsx` - New fields

---

## Commands Used

```bash
# Install dependencies
npm install

# Run API
cd apps/api && npm run dev

# Run Web
cd apps/web && npm run dev

# Database
cd apps/api && npx prisma db push
cd apps/api && npx prisma db seed
```

---

## Login Credentials

- **Admin:** admin@sq-agriculture.com / admin123
- **Manager:** manager@sqagriculture.com / manager123
- **Customer:** customer@test.com / customer123

---

## URLs (Local)

- Website: http://localhost:3000
- API: http://localhost:3001
- Swagger: http://localhost:3001/api/docs
- Admin: http://localhost:3000/admin
