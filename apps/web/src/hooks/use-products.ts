import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiEndpoints } from '@/lib/api';
import type { Product, Category } from '@sq-agriculture/shared';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

function extractArrayData<T>(response: any): T[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.items)) return response.items;
  return [];
}

export function useProducts(params?: { category?: string; featured?: boolean; search?: string }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};
      if (params?.category) queryParams.category = params.category;
      if (params?.featured) queryParams.featured = 'true';
      if (params?.search) queryParams.search = params.search;
      
      const response = await api.get<any>(apiEndpoints.products.public, queryParams);
      return extractArrayData<Product>(response);
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      return api.get<Product>(apiEndpoints.products.bySlug(slug));
    },
    enabled: !!slug,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await api.get<any>(apiEndpoints.products.featured);
      return extractArrayData<Product>(response);
    },
  });
}

export function useRelatedProducts(productId: string) {
  return useQuery({
    queryKey: ['product', productId, 'related'],
    queryFn: async () => {
      const response = await api.get<any>(apiEndpoints.products.related(productId));
      return extractArrayData<Product>(response);
    },
    enabled: !!productId,
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const response = await api.get<any>(apiEndpoints.products.list);
      return extractArrayData<Product>(response);
    },
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: async () => {
      return api.get<Product>(apiEndpoints.products.byId(id));
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Product>) => {
      return api.post<Product>(apiEndpoints.products.list, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      return api.patch<Product>(apiEndpoints.products.byId(id), data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete<Product>(apiEndpoints.products.byId(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}
