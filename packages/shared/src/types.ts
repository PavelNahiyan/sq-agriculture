export type Role = 'ADMIN' | 'MANAGER' | 'USER' | 'CUSTOMER';
export type CategoryType = 'SEEDS' | 'PESTICIDES' | 'FERTILIZERS' | 'MICRONUTRIENTS' | 'MACHINERY' | 'LUBRICANTS';
export type UserType = 'FARMER' | 'DEALER' | 'CORPORATE' | 'OTHER';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type ProductUnit = 'KG' | 'TON' | 'LITRE' | 'ML' | 'PIECE' | 'UNIT' | 'BAG' | 'BOX' | 'GRAM';
export type InquiryStatus = 'NEW' | 'READ' | 'REPLIED' | 'CONVERTED' | 'ARCHIVED';
export type DealerStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  email: string;
  name: string;
  nameBn?: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  emailVerified: boolean;
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
  specs?: Record<string, string>;
  featured: boolean;
  inStock: boolean;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  brochure?: string;
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
  assignedToId?: string;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Dealer {
  id: string;
  name: string;
  nameBn?: string;
  phone: string;
  email?: string;
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
  content?: string;
  contentBn?: string;
  image?: string;
  featuredImage?: string;
  author: string;
  authorImage?: string;
  category: string;
  tags?: string[];
  published: boolean;
  featured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
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
  assignedToId?: string;
  assignedTo?: User;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  addedAt: string;
}

export interface Upload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  entityType?: string;
  entityId?: string;
  uploadedById?: string;
  createdAt: string;
}
