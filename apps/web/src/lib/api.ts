export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}

interface ApiError {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        success: false,
        statusCode: response.status,
        message: data.message || 'An error occurred',
        error: data.error || 'Error',
      };
      throw error;
    }

    return data.data || data;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers: HeadersInit = {};
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient(API_BASE_URL);

// API endpoint helpers
export const apiEndpoints = {
  // Auth
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
  },
  // Products
  products: {
    list: '/api/products',
    public: '/api/products',
    featured: '/api/products?featured=true',
    bySlug: (slug: string) => `/api/products/${slug}`,
    byId: (id: string) => `/api/products/${id}`,
    related: (id: string) => `/api/products/${id}/related`,
  },
  // Categories
  categories: {
    list: '/api/categories',
    public: '/api/categories',
    bySlug: (slug: string) => `/api/categories/${slug}`,
    byId: (id: string) => `/api/categories/${id}`,
  },
  // Leads
  leads: {
    list: '/api/leads',
    byId: (id: string) => `/api/leads/${id}`,
    stats: '/api/leads/stats',
  },
  // Users
  users: {
    list: '/api/users',
    byId: (id: string) => `/api/users/${id}`,
  },
  // Uploads
  uploads: {
    single: '/api/uploads/single',
    multiple: '/api/uploads/multiple',
  },
  // Wishlist
  wishlist: {
    list: '/api/wishlist',
    add: '/api/wishlist',
    remove: (productId: string) => `/api/wishlist/${productId}`,
  },
};
