import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface PageConfig {
  id: string;
  pageName: string;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroImage: string | null;
  features: any[];
  customConfig: any;
  isActive: boolean;
}

export function usePageConfig(pageName: string) {
  return useQuery<PageConfig>({
    queryKey: ['page-config', pageName],
    queryFn: async () => {
      return api.get<PageConfig>(`/api/pages/${pageName}`);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdatePageConfig() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pageName, data }: { pageName: string; data: any }) => {
      return api.patch<any>(`/api/pages/${pageName}`, data);
    },
    onSuccess: (_, { pageName }) => {
      queryClient.invalidateQueries({ queryKey: ['page-config', pageName] });
    },
  });
}

export const AVAILABLE_PAGES = [
  { name: 'homepage', label: 'Homepage', path: '/admin/homepage' },
  { name: 'seeds', label: 'Seeds', path: '/admin/pages/seeds' },
  { name: 'pesticides', label: 'Pesticides', path: '/admin/pages/pesticides' },
  { name: 'fertilizers', label: 'Fertilizers', path: '/admin/pages/fertilizers' },
  { name: 'machinery', label: 'Machinery', path: '/admin/pages/machinery' },
  { name: 'gallery', label: 'Gallery', path: '/admin/pages/gallery' },
];