'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { NewsletterSubscription } from '@/lib/shared-types';

function extractArrayData<T>(response: any): T[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.items)) return response.items;
  return [];
}

export function useNewsletterSubscriptions() {
  return useQuery({
    queryKey: ['newsletter', 'subscriptions'],
    queryFn: async () => {
      const response = await api.get<any>('/api/v1/newsletter');
      return extractArrayData<NewsletterSubscription>(response);
    },
  });
}

export function useNewsletterStats() {
  return useQuery({
    queryKey: ['newsletter', 'stats'],
    queryFn: async () => {
      return api.get<{ total: number; active: number }>('/api/v1/newsletter/stats');
    },
  });
}

export function useUnsubscribeNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete<{ message: string }>(`/api/v1/newsletter/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter'] });
    },
  });
}
