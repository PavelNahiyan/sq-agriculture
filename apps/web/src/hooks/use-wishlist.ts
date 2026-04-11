import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiEndpoints } from '@/lib/api';
import type { WishlistItem } from '@sq-agriculture/shared';

function extractArrayData<T>(response: any): T[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.items)) return response.items;
  return [];
}

export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await api.get<any>(apiEndpoints.wishlist.list);
      return extractArrayData<WishlistItem>(response);
    },
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      return api.post<WishlistItem>(apiEndpoints.wishlist.add, { productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      return api.delete<void>(apiEndpoints.wishlist.remove(productId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useIsInWishlist(productId: string) {
  const { data: wishlist } = useWishlist();
  return wishlist?.some(item => item.productId === productId) ?? false;
}
