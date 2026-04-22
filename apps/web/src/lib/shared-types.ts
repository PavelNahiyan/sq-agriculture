export type Role = 
  | 'SUPER_ADMIN' 
  | 'PAGE_EDITOR' 
  | 'SEED_ADMIN' 
  | 'PESTICIDE_ADMIN' 
  | 'FERTILIZER_ADMIN' 
  | 'MACHINERY_ADMIN' 
  | 'SERVICE_ADMIN' 
  | 'ADMIN' 
  | 'MANAGER' 
  | 'USER' 
  | 'CUSTOMER';

export type CategoryType = 'SEEDS' | 'PESTICIDES' | 'FERTILIZERS' | 'MICRONUTRIENTS' | 'MACHINERY' | 'LUBRICANTS' | 'SPARE_PARTS';

// Page to Role mapping for section-based access control
export const PAGE_ROLE_MAP: Record<string, Role> = {
  'seeds': 'SEED_ADMIN',
  'pesticides': 'PESTICIDE_ADMIN',
  'fertilizers': 'FERTILIZER_ADMIN',
  'machinery': 'MACHINERY_ADMIN',
  'service-spare-parts': 'SERVICE_ADMIN',
};

// Role display names
export const ROLE_DISPLAY_NAMES: Record<Role, string> = {
  'SUPER_ADMIN': 'Super Admin',
  'PAGE_EDITOR': 'Page Editor',
  'SEED_ADMIN': 'Seed Admin',
  'PESTICIDE_ADMIN': 'Pesticide Admin',
  'FERTILIZER_ADMIN': 'Fertilizer Admin',
  'MACHINERY_ADMIN': 'Machinery Admin',
  'SERVICE_ADMIN': 'Service Admin',
  'ADMIN': 'Admin',
  'MANAGER': 'Manager',
  'USER': 'User',
  'CUSTOMER': 'Customer',
};

// Role to page mapping for redirect after login
export const ROLE_DEFAULT_PAGES: Record<Role, string> = {
  'SUPER_ADMIN': '/admin',
  'SEED_ADMIN': '/admin/pages/seeds',
  'PESTICIDE_ADMIN': '/admin/pages/pesticides',
  'FERTILIZER_ADMIN': '/admin/pages/fertilizers',
  'MACHINERY_ADMIN': '/admin/pages/machinery',
  'SERVICE_ADMIN': '/admin/products',
  'PAGE_EDITOR': '/admin',
  'ADMIN': '/admin',
  'MANAGER': '/admin',
  'CUSTOMER': '/',
  'USER': '/',
};
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
  isPreOwned?: boolean;
  preOwnedDetails?: PreOwnedDetails;
  categoryId: string;
  category?: Category;
  brochure?: string;
  hidePrice?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  createdAt: string;
  updatedAt: string;
  productLocations?: ProductLocation[];
}

export interface ProductLocation {
  id: string;
  productId: string;
  dealerId: string;
  dealer?: Dealer;
  isActive: boolean;
  createdAt: string;
}

export interface PreOwnedDetails {
  year?: number;
  hours?: number;
  condition?: string;
  previousOwner?: string;
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