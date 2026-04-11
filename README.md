# SQ Agriculture Ltd. - Enterprise Web Application

A production-ready, scalable, modular enterprise web application for agricultural business in Bangladesh.

## 🏗️ Architecture

This monorepo uses **Turborepo** for build orchestration and contains:

```
sq-agriculture/
├── apps/
│   ├── web/          # Next.js 14 Frontend
│   └── api/          # NestJS Backend
├── packages/
│   └── shared/       # Shared types & utilities
├── docker-compose.yml
├── turbo.json
└── package.json
```

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend** | NestJS, Prisma ORM, PostgreSQL |
| **Auth** | JWT with refresh tokens |
| **Storage** | S3-compatible (local for MVP) |
| **i18n** | English + Bangla (বাংলা) |

## 📋 Features

### Public Site
- [x] Responsive Homepage with Hero section
- [x] Product Catalog with filtering & search
- [x] Product Detail pages
- [x] Contact form with lead capture
- [x] Full bilingual support (EN/BN)

### Admin Dashboard
- [x] Secure authentication
- [x] Dashboard with statistics
- [x] Product Management (CRUD)
- [x] Category Management
- [x] Lead Management
- [x] User Management

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 16+ (via Docker)
- npm 10+

### Installation

```bash
# Clone and install
cd sq-agriculture
npm install

# Start PostgreSQL with Docker
docker-compose up -d

# Generate Prisma client and push schema
npm run db:push

# Seed database with sample data
npm run db:seed

# Start development servers
npm run dev
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `NEXT_PUBLIC_API_URL` - API base URL

## 📁 Project Structure

### Backend (NestJS)
```
apps/api/src/
├── modules/
│   ├── auth/          # JWT authentication
│   ├── users/        # User management
│   ├── products/     # Product CRUD
│   ├── categories/   # Categories
│   ├── leads/        # Lead generation
│   └── uploads/      # File handling
├── prisma/
│   └── schema.prisma  # Database schema
└── common/           # Guards, decorators
```

### Frontend (Next.js)
```
apps/web/src/
├── app/              # App Router pages
│   ├── page.tsx      # Homepage
│   ├── products/     # Product pages
│   ├── contact/      # Contact page
│   └── admin/        # Admin dashboard
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Header, Footer
│   └── features/    # Feature components
└── i18n/            # Translations
```

## 🔐 API Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh` |
| Products | `GET /products`, `POST /products`, `PATCH /products/:id`, `DELETE /products/:id` |
| Categories | `GET /categories`, `POST /categories`, `PATCH /categories/:id` |
| Leads | `GET /leads`, `POST /leads` (public), `PATCH /leads/:id` (admin) |
| Uploads | `POST /uploads/single`, `POST /uploads/multiple` |

## 📦 Products

### Seed Data
The database is seeded with:
- 2 Admin users (admin@sqagriculture.com / admin123)
- 9 Categories (Seeds, Pesticides, Machinery)
- 8 Sample Products
- 3 Sample Leads

## 🌐 Bilingual Support

Switch between English and Bangla using the language toggle. All content is translatable via `src/i18n/messages/`.

## 📝 License

Private - All rights reserved.
