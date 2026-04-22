// SQ Agriculture - Shared Constants
// Using string constants for SQLite compatibility

import { PrismaClient } from '@prisma/client';

// Enum values as string constants
export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  PAGE_EDITOR: 'PAGE_EDITOR',
  SEED_ADMIN: 'SEED_ADMIN',
  PESTICIDE_ADMIN: 'PESTICIDE_ADMIN',
  FERTILIZER_ADMIN: 'FERTILIZER_ADMIN',
  MACHINERY_ADMIN: 'MACHINERY_ADMIN',
  SERVICE_ADMIN: 'SERVICE_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CUSTOMER: 'CUSTOMER',
  USER: 'USER',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

export const ADMIN_ROLES: RoleType[] = [
  Role.SUPER_ADMIN, 
  Role.PAGE_EDITOR, 
  Role.SEED_ADMIN,
  Role.PESTICIDE_ADMIN,
  Role.FERTILIZER_ADMIN,
  Role.MACHINERY_ADMIN,
  Role.SERVICE_ADMIN,
  Role.ADMIN, 
  Role.MANAGER
];

// Page to Role mapping for section-based access control
export const PAGE_ROLE_MAP: Record<string, RoleType> = {
  'seeds': Role.SEED_ADMIN,
  'pesticides': Role.PESTICIDE_ADMIN,
  'fertilizers': Role.FERTILIZER_ADMIN,
  'machinery': Role.MACHINERY_ADMIN,
  'service-spare-parts': Role.SERVICE_ADMIN,
};

// Section admin roles (excluding SUPER_ADMIN)
export const SECTION_ADMIN_ROLES: RoleType[] = [
  Role.SEED_ADMIN,
  Role.PESTICIDE_ADMIN,
  Role.FERTILIZER_ADMIN,
  Role.MACHINERY_ADMIN,
  Role.SERVICE_ADMIN,
];

// Role display names
export const ROLE_DISPLAY_NAMES: Record<RoleType, string> = {
  [Role.SUPER_ADMIN]: 'Super Admin',
  [Role.PAGE_EDITOR]: 'Page Editor',
  [Role.SEED_ADMIN]: 'Seed Admin',
  [Role.PESTICIDE_ADMIN]: 'Pesticide Admin',
  [Role.FERTILIZER_ADMIN]: 'Fertilizer Admin',
  [Role.MACHINERY_ADMIN]: 'Machinery Admin',
  [Role.SERVICE_ADMIN]: 'Service Admin',
  [Role.ADMIN]: 'Admin',
  [Role.MANAGER]: 'Manager',
  [Role.CUSTOMER]: 'Customer',
  [Role.USER]: 'User',
};

// Role to page mapping
export const ROLE_DEFAULT_PAGES: Record<RoleType, string> = {
  [Role.SUPER_ADMIN]: '/admin',
  [Role.SEED_ADMIN]: '/admin/pages/seeds',
  [Role.PESTICIDE_ADMIN]: '/admin/pages/pesticides',
  [Role.FERTILIZER_ADMIN]: '/admin/pages/fertilizers',
  [Role.MACHINERY_ADMIN]: '/admin/pages/machinery',
  [Role.SERVICE_ADMIN]: '/admin/products',
  [Role.PAGE_EDITOR]: '/admin',
  [Role.ADMIN]: '/admin',
  [Role.MANAGER]: '/admin',
  [Role.CUSTOMER]: '/',
  [Role.USER]: '/',
};

export const CategoryType = {
  SEEDS: 'SEEDS',
  PESTICIDES: 'PESTICIDES',
  FERTILIZERS: 'FERTILIZERS',
  MACHINERY: 'MACHINERY',
  MICRONUTRIENTS: 'MICRONUTRIENTS',
  LUBRICANTS: 'LUBRICANTS',
  SPARE_PARTS: 'SPARE_PARTS',
} as const;

export type CategoryTypeType = typeof CategoryType[keyof typeof CategoryType];

export const UserType = {
  FARMER: 'FARMER',
  DEALER: 'DEALER',
  CORPORATE: 'CORPORATE',
} as const;

export type UserTypeType = typeof UserType[keyof typeof UserType];

export const ProductUnit = {
  KG: 'KG',
  TON: 'TON',
  LITRE: 'LITRE',
  ML: 'ML',
  PIECE: 'PIECE',
  UNIT: 'UNIT',
  BAG: 'BAG',
  BOX: 'BOX',
  GRAM: 'GRAM',
} as const;

export type ProductUnitType = typeof ProductUnit[keyof typeof ProductUnit];

export const InquiryStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  PROPOSAL: 'PROPOSAL',
  REPLIED: 'REPLIED',
  ARCHIVED: 'ARCHIVED',
  WON: 'WON',
  LOST: 'LOST',
} as const;

export type InquiryStatusType = typeof InquiryStatus[keyof typeof InquiryStatus];

export const LeadStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  CONVERTED: 'CONVERTED',
  LOST: 'LOST',
} as const;

export type LeadStatusType = typeof LeadStatus[keyof typeof LeadStatus];

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];

// Re-export PrismaClient
export { PrismaClient };
