import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface SeedPartner {
  id: string;
  name: string;
  nameBn: string | null;
  logo: string | null;
  description: string | null;
  website: string | null;
  sortOrder: number;
  isActive: boolean;
}

const SEED_PARTNERS_API = '/seed-partners';

export function useSeedPartners() {
  return useQuery<SeedPartner[]>({
    queryKey: ['seed-partners'],
    queryFn: async () => {
      return api.get<SeedPartner[]>(SEED_PARTNERS_API);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSeedPartner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<SeedPartner>) => {
      return api.post<SeedPartner>(SEED_PARTNERS_API, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seed-partners'] });
    },
  });
}

export function useUpdateSeedPartner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SeedPartner> }) => {
      return api.put<SeedPartner>(`${SEED_PARTNERS_API}/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seed-partners'] });
    },
  });
}

export function useDeleteSeedPartner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete<void>(`${SEED_PARTNERS_API}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seed-partners'] });
    },
  });
}