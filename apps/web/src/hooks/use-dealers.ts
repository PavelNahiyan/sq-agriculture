import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Dealer } from '@sq-agriculture/shared';

function extractArrayData<T>(response: any): T[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.items)) return response.items;
  return [];
}

interface DealerFilters {
  district?: string;
  division?: string;
  search?: string;
}

export function useDealers(filters?: DealerFilters) {
  return useQuery({
    queryKey: ['dealers', filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters?.district) params.district = filters.district;
      if (filters?.division) params.division = filters.division;
      if (filters?.search) params.search = filters.search;
      
      const response = await api.get<any>('/api/v1/dealers', params);
      return extractArrayData<Dealer>(response);
    },
  });
}

export function useDealer(id: string) {
  return useQuery({
    queryKey: ['dealer', id],
    queryFn: async () => {
      return api.get<Dealer>(`/api/v1/dealers/${id}`);
    },
    enabled: !!id,
  });
}

export function useDealerGeoJSON() {
  return useQuery({
    queryKey: ['dealers', 'geojson'],
    queryFn: async () => {
      return api.get<GeoJSON.FeatureCollection>('/api/v1/dealers/geojson');
    },
  });
}

export function useDistricts() {
  return useQuery({
    queryKey: ['dealers', 'districts'],
    queryFn: async () => {
      const response = await api.get<any>('/api/v1/dealers/districts');
      return extractArrayData<string>(response);
    },
  });
}

export function useDivisions() {
  return useQuery({
    queryKey: ['dealers', 'divisions'],
    queryFn: async () => {
      const response = await api.get<any>('/api/v1/dealers/divisions');
      return extractArrayData<string>(response);
    },
  });
}
