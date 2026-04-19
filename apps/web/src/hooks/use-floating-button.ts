import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiEndpoints } from '@/lib/api';

interface FloatingButtonSettings {
  id: string;
  whatsapp: string | null;
  facebook: string | null;
  email: string | null;
  isEnabled: boolean;
  showWhatsapp: boolean;
  showFacebook: boolean;
  showEmail: boolean;
  position: string;
}

export function useFloatingButtonSettings() {
  return useQuery<FloatingButtonSettings>({
    queryKey: ['floating-button'],
    queryFn: async () => {
      return api.get<FloatingButtonSettings>(apiEndpoints.settings.floatingButton);
    },
  });
}

export function useUpdateFloatingButton() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<FloatingButtonSettings>) => {
      return api.patch<any>(apiEndpoints.settings.floatingButton, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floating-button'] });
    },
  });
}