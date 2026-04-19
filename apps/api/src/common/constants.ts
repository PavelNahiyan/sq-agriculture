// SQ Agriculture - Shared Constants
// Using string constants for SQLite compatibility

import { PrismaClient } from '@prisma/client';

// Enum values as string constants
export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  PAGE_EDITOR: 'PAGE_EDITOR',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CUSTOMER: 'CUSTOMER',
  USER: 'USER',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

export const ADMIN_ROLES: RoleType[] = [Role.SUPER_ADMIN, Role.PAGE_EDITOR, Role.ADMIN, Role.MANAGER];

export const CategoryType = {
  SEEDS: 'SEEDS',
  PESTICIDES: 'PESTICIDES',
  FERTILIZERS: 'FERTILIZERS',
  MACHINERY: 'MACHINERY',
  MICRONUTRIENTS: 'MICRONUTRIENTS',
  LUBRICANTS: 'LUBRICANTS',
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
