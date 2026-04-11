// SQ Agriculture - Shared Constants
// Using string constants for SQLite compatibility

import { PrismaClient } from '@prisma/client';

// Enum values as string constants
export const Role = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CUSTOMER: 'CUSTOMER',
  USER: 'USER',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

export const CategoryType = {
  SEEDS: 'SEEDS',
  PESTICIDES: 'PESTICIDES',
  FERTILIZERS: 'FERTILIZERS',
  MACHINERY: 'MACHINERY',
} as const;

export type CategoryTypeType = typeof CategoryType[keyof typeof CategoryType];

export const UserType = {
  FARMER: 'FARMER',
  DEALER: 'DEALER',
  CORPORATE: 'CORPORATE',
} as const;

export type UserTypeType = typeof UserType[keyof typeof UserType];

export const LeadStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  CONVERTED: 'CONVERTED',
  LOST: 'LOST',
} as const;

export type LeadStatusType = typeof LeadStatus[keyof typeof LeadStatus];

export const InquiryStatus = {
  NEW: 'NEW',
  READ: 'READ',
  REPLIED: 'REPLIED',
  CLOSED: 'CLOSED',
} as const;

export type InquiryStatusType = typeof InquiryStatus[keyof typeof InquiryStatus];

export const ProductUnit = {
  KG: 'KG',
  GRAM: 'GRAM',
  BAG: 'BAG',
  UNIT: 'UNIT',
} as const;

export type ProductUnitType = typeof ProductUnit[keyof typeof ProductUnit];

// Auth constants
export const JWT_DEFAULT_EXPIRES_IN = '7d';
export const JWT_REFRESH_EXPIRES_IN = '30d';
export const PASSWORD_RESET_EXPIRES_MINUTES = 60;
export const EMAIL_VERIFICATION_EXPIRES_HOURS = 24;

// Pagination defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// User roles for guards
export const ADMIN_ROLES: RoleType[] = [Role.ADMIN, Role.MANAGER];

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];

// Re-export PrismaClient
export { PrismaClient };
