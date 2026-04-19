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

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];

// Re-export PrismaClient
export { PrismaClient };
