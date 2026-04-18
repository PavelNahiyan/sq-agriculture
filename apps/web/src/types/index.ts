// Re-export all shared types
export * from './index';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User types
export type Role = 'ADMIN' | 'MANAGER' | 'USER';
export type CategoryType = 'SEEDS' | 'PESTICIDES' | 'FERTILIZERS' | 'MICRONUTRIENTS' | 'MACHINERY' | 'LUBRICANTS';
export type UserType = 'FARMER' | 'DEALER' | 'CORPORATE' | 'OTHER';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type InquiryStatus = 'NEW' | 'READ' | 'REPLIED' | 'CONVERTED' | 'ARCHIVED';
export type ProductUnit = 'KG' | 'TON' | 'LITRE' | 'ML' | 'PIECE' | 'UNIT' | 'BAG' | 'BOX';

export interface User {
  id: string;
  email: string;
  name: string;
  nameBn?: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  description?: string;
  descriptionBn?: string;
  image?: string;
  type: CategoryType;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  description: string;
  descriptionBn?: string;
  price?: number;
  priceUnit?: ProductUnit;
  images: string[];
  brochure?: string;
  specs?: Record<string, string>;
  featured: boolean;
  inStock: boolean;
  isActive: boolean;
  isPreOwned?: boolean;
  preOwnedDetails?: PreOwnedDetails;
  categoryId: string;
  category?: Category;
  hidePrice?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PreOwnedDetails {
  year?: number;
  hours?: number;
  condition?: string;
  previousOwner?: string;
}

export interface Dealer {
  id: string;
  name: string;
  nameBn?: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  division: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  titleBn?: string;
  slug: string;
  excerpt: string;
  excerptBn?: string;
  content: string;
  contentBn?: string;
  image?: string;
  author: string;
  authorImage?: string;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  userType: UserType;
  productInterest?: string;
  message: string;
  status: LeadStatus;
  notes?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  userType: UserType;
  productInterest?: string;
  message: string;
  status: InquiryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: Pick<User, 'id' | 'name' | 'email'>;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  nameBn?: string;
  phone?: string;
  role?: Role;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Form validation schemas
export const loginSchema = {
  email: (v: string) => !v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Invalid email' : undefined,
  password: (v: string) => !v || v.length < 6 ? 'Password must be at least 6 characters' : undefined,
};

export const inquirySchema = {
  name: (v: string) => !v || v.length < 2 ? 'Name must be at least 2 characters' : undefined,
  email: (v: string) => !v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Invalid email' : undefined,
  phone: (v: string) => !v || v.length < 10 ? 'Invalid phone number' : undefined,
  message: (v: string) => !v || v.length < 10 ? 'Message must be at least 10 characters' : undefined,
};
