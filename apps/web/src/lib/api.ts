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

  async put<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
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
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    refresh: '/api/v1/auth/refresh',
    logout: '/api/v1/auth/logout',
    profile: '/api/v1/auth/profile',
    forgotPassword: '/api/v1/auth/forgot-password',
    resetPassword: '/api/v1/auth/reset-password',
  },
  // Products
 products: {
    list: '/api/v1/products',
    public: '/api/v1/products',
    featured: '/api/v1/products?featured=true',
    bySlug: (slug: string) => `/api/v1/products/${slug}`,
    byId: (id: string) => `/api/v1/products/${id}`,
    related: (id: string) => `/api/v1/products/${id}/related`,
  },
  categories: {
    list: '/api/v1/categories',
    public: '/api/v1/categories',
    bySlug: (slug: string) => `/api/v1/categories/${slug}`,
    byId: (id: string) => `/api/v1/categories/${id}`,
  },
  leads: {
    list: '/api/v1/leads',
    byId: (id: string) => `/api/v1/leads/${id}`,
    stats: '/api/v1/leads/stats',
  },
  users: {
    list: '/api/v1/users',
    byId: (id: string) => `/api/v1/users/${id}`,
  },
  // Uploads
  uploads: {
    single: '/api/v1/uploads/single',
    multiple: '/api/v1/uploads/multiple',
  },
  wishlist: {
    list: '/api/v1/wishlist',
    add: '/api/v1/wishlist',
    remove: (productId: string) => `/api/v1/wishlist/${productId}`,
  },
  activity: {
    list: '/api/v1/activity',
    stats: '/api/v1/activity/stats',
    byEntity: (type: string, id: string) => `/api/v1/activity/entity/${type}/${id}`,
    byUser: (userId: string) => `/api/v1/activity/user/${userId}`,
  },
  // Settings
  settings: {
    floatingButton: '/api/v1/settings/floating-button',
  },
  pages: {
    byName: (pageName: string) => `/api/v1/pages/${pageName}`,
  },
};
