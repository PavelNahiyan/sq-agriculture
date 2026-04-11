import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { BlogPost } from '@sq-agriculture/shared';

function extractArrayData<T>(response: any): T[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.items)) return response.items;
  return [];
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export function useBlogPosts(params?: { category?: string; featured?: boolean; search?: string }) {
  return useQuery({
    queryKey: ['blog', 'posts', params],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};
      if (params?.category) queryParams.category = params.category;
      if (params?.featured) queryParams.featured = 'true';
      if (params?.search) queryParams.search = params.search;
      
      const response = await api.get<any>('/api/v1/blog', queryParams);
      return extractArrayData<BlogPost>(response);
    },
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog', 'post', slug],
    queryFn: async () => {
      return api.get<BlogPost>(`/api/v1/blog/${slug}`);
    },
    enabled: !!slug,
  });
}

export function useFeaturedBlogPosts() {
  return useQuery({
    queryKey: ['blog', 'posts', 'featured'],
    queryFn: async () => {
      const response = await api.get<any>('/api/v1/blog/featured');
      return extractArrayData<BlogPost>(response);
    },
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ['blog', 'categories'],
    queryFn: async () => {
      const response = await api.get<any>('/api/v1/blog/categories');
      return extractArrayData<BlogCategory>(response);
    },
  });
}
