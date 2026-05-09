import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { HeroSlide } from '@/lib/shared-types';

function extractArrayData<T>(response: any): T[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.items)) return response.items;
  return [];
}

const BASE = '/api/v1/hero-slides';

export function useHeroSlides(activeOnly = true) {
  return useQuery({
    queryKey: ['heroSlides', activeOnly],
    queryFn: async () => {
      const response: any = await api.get(`${BASE}?activeOnly=${activeOnly}`);
      return extractArrayData<HeroSlide>(response);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminHeroSlides() {
  return useQuery({
    queryKey: ['admin', 'heroSlides'],
    queryFn: async () => {
      const response: any = await api.get(`${BASE}?activeOnly=false`);
      return extractArrayData<HeroSlide>(response);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateHeroSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<HeroSlide>) => {
      return api.post<HeroSlide>(BASE, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'heroSlides'] });
    },
  });
}

export function useUpdateHeroSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HeroSlide> }) => {
      return api.patch<HeroSlide>(`${BASE}/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'heroSlides'] });
    },
  });
}

export function useDeleteHeroSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`${BASE}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'heroSlides'] });
    },
  });
}

export function useReorderHeroSlides() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      return api.post(`${BASE}/reorder`, { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'heroSlides'] });
    },
  });
}
