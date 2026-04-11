import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiEndpoints } from '@/lib/api';
import type { Lead } from '@/lib/shared-types';

function extractArrayData<T>(response: any): T[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.items)) return response.items;
  return [];
}

export function useLeads(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};
      if (params?.status) queryParams.status = params.status;
      if (params?.search) queryParams.search = params.search;
      
      const response = await api.get<any>(apiEndpoints.leads.list, queryParams);
      return extractArrayData<Lead>(response);
    },
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      return api.get<Lead>(apiEndpoints.leads.byId(id));
    },
    enabled: !!id,
  });
}

export function useLeadStats() {
  return useQuery({
    queryKey: ['leads', 'stats'],
    queryFn: async () => {
      return api.get<{
        total: number;
        new: number;
        contacted: number;
        qualified: number;
        converted: number;
        lost: number;
      }>(apiEndpoints.leads.stats);
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Lead> }) => {
      return api.patch<Lead>(apiEndpoints.leads.byId(id), data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['leads', 'stats'] });
    },
  });
}

export function useAssignLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ leadId, userId }: { leadId: string; userId: string }) => {
      return api.patch<Lead>(`/api/v1/leads/${leadId}/assign/${userId}`, {});
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', variables.leadId] });
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      return api.post<Lead>('/api/v1/leads', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads', 'stats'] });
    },
  });
}
