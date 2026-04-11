import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Inquiry, InquiryStatus } from '@/lib/shared-types';

function extractArrayData<T>(response: any): T[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.items)) return response.items;
  return [];
}

export function useInquiries(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['inquiries', params],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};
      if (params?.status) queryParams.status = params.status;
      if (params?.search) queryParams.search = params.search;
      
      const response = await api.get<any>('/api/v1/inquiries', queryParams);
      return extractArrayData<Inquiry>(response);
    },
  });
}

export function useInquiry(id: string) {
  return useQuery({
    queryKey: ['inquiry', id],
    queryFn: async () => {
      return api.get<Inquiry>(`/api/v1/inquiries/${id}`);
    },
    enabled: !!id,
  });
}

export function useUpdateInquiry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Inquiry> }) => {
      return api.patch<Inquiry>(`/api/v1/inquiries/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['inquiry', variables.id] });
    },
  });
}

export function useCreateInquiry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; email: string; phone?: string; subject?: string; message: string; source?: string; productInterest?: string; userType?: string; company?: string }) => {
      return api.post<Inquiry>('/api/v1/inquiries', {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        message: data.message,
        productInterest: data.productInterest,
        userType: data.userType as any || 'FARMER',
        company: data.company,
        source: data.source,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}
