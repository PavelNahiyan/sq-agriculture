import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface ServiceFeature {
  title: string;
  titleBn: string;
  enabled: boolean;
}

export interface ServiceCenter {
  city: string;
  cityBn: string;
  area: string;
  areaBn: string;
  description: string;
  descriptionBn: string;
  enabled: boolean;
}

export interface ServiceSettings {
  id: string;
  
  // Contact Info
  hotlinePhone: string | null;
  whatsapp: string | null;
  email: string | null;
  isActive: boolean;
  
  // Hero Section
  heroTitle: string | null;
  heroTitleBn: string | null;
  heroSubtitle: string | null;
  heroSubtitleBn: string | null;
  
  // SQ Lubricants Section
  lubricantsTitle: string | null;
  lubricantsTitleBn: string | null;
  lubricantsDescription: string | null;
  lubricantsDescriptionBn: string | null;
  lubricantsEnabled: boolean;
  
  // Spare Parts Section
  sparePartsTitle: string | null;
  sparePartsTitleBn: string | null;
  sparePartsDescription: string | null;
  sparePartsDescriptionBn: string | null;
  sparePartsEnabled: boolean;
  
  // Service 24X7 Section
  serviceTitle: string | null;
  serviceTitleBn: string | null;
  serviceDescription: string | null;
  serviceDescriptionBn: string | null;
  serviceEnabled: boolean;
  
  // JSON Fields
  serviceFeatures: ServiceFeature[];
  serviceCenters: ServiceCenter[];
}

const serviceSettingsEndpoint = '/api/v1/service-settings';

export function useServiceSettings() {
  return useQuery<ServiceSettings>({
    queryKey: ['service-settings'],
    queryFn: async () => {
      const data = await api.get<any>(serviceSettingsEndpoint);
      
      // Parse JSON fields
      return {
        ...data,
        serviceFeatures: data.serviceFeatures ? JSON.parse(data.serviceFeatures) : [],
        serviceCenters: data.serviceCenters ? JSON.parse(data.serviceCenters) : [],
      };
    },
  });
}

export function useUpdateServiceSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<ServiceSettings>) => {
      // Prepare data for API - stringify JSON fields
      const apiData: any = { ...data };
      
      if (data.serviceFeatures !== undefined) {
        apiData.serviceFeatures = JSON.stringify(data.serviceFeatures);
      }
      if (data.serviceCenters !== undefined) {
        apiData.serviceCenters = JSON.stringify(data.serviceCenters);
      }
      
      return api.put<any>(serviceSettingsEndpoint, apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-settings'] });
    },
  });
}