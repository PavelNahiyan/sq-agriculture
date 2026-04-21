import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface HeroSlide {
  image?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  categoryId?: string;
}

export interface SliderCategory {
  categoryId: string;
  order: number;
}

export interface Feature {
  icon?: string;
  title?: string;
  description?: string;
}

export interface VideoUrl {
  url: string;
  title?: string;
}

export interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

export interface HomepageConfig {
  id: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroSlides: HeroSlide[];
  heroUseCategories: boolean;
  sliderCategories: SliderCategory[];
  features: Feature[];
  videoEnabled: boolean;
  videoTitle?: string;
  videoSubtitle?: string;
  videoPlaylistId?: string;
  videoUrls: VideoUrl[];
  stats: Stat[];
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useHomepageConfig() {
  return useQuery({
    queryKey: ['homepage'],
    queryFn: async () => {
      const response = await api.get<HomepageConfig>('/homepage');
      return response;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useUpdateHomepageConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<HomepageConfig>) => {
      const response = await api.patch<HomepageConfig>('/homepage', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage'] });
    },
  });
}