import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { UpdateHomepageDto } from './dto';

const DEFAULT_HERO_SLIDES = [
  {
    image: '/uploads/sliders/slider-1.jpg',
    title: "Empowering Bangladesh's Agricultural Future",
    subtitle: 'Your trusted partner for quality seeds, crop protection, and modern farming machinery',
    ctaText: 'Explore Products',
    ctaLink: '/products',
  },
  {
    image: '/uploads/sliders/slider-2.jpg',
    title: 'Premium Quality Seeds',
    subtitle: 'High-yielding hybrid varieties developed for Bangladesh climate and soil conditions',
    ctaText: 'View Seeds',
    ctaLink: '/products/seeds',
  },
  {
    image: '/uploads/sliders/slider-3.jpg',
    title: 'Modern Farming Machinery',
    subtitle: 'SQ Etian tractors and equipment for efficient agricultural operations',
    ctaText: 'View Machinery',
    ctaLink: '/products/field-machinery',
  },
  {
    image: '/uploads/sliders/slider-4.jpg',
    title: 'High-Efficiency Harvesting Solutions',
    subtitle: 'Advanced combine harvesters for fast and safe crop harvesting',
    ctaText: 'View Products',
    ctaLink: '/products/field-machinery',
  },
  {
    image: '/uploads/sliders/slider-5.jpg',
    title: 'Expert Agricultural Support',
    subtitle: 'Our team of agronomists is ready to help farmers across all 64 districts',
    ctaText: 'Get Support',
    ctaLink: '/contact',
  },
];

const DEFAULT_FEATURES = [
  { icon: 'Leaf', title: 'Premium Quality Seeds', description: 'High-yielding varieties developed for Bangladesh climate' },
  { icon: 'Shield', title: 'Crop Protection', description: 'Effective solutions for pest and disease management' },
  { icon: 'Truck', title: 'Nationwide Delivery', description: 'Products available across all 64 districts' },
  { icon: 'Sprout', title: 'Expert Support', description: 'Agricultural specialists ready to assist farmers' },
];

const DEFAULT_STATS = [
  { value: 500, label: 'Products', suffix: '+' },
  { value: 10000, label: 'Happy Farmers', suffix: '+' },
  { value: 64, label: 'Districts', suffix: '' },
  { value: 15, label: 'Years Experience', suffix: '+' },
];

@Injectable()
export class HomepageService {
  constructor(private readonly prisma: PrismaService) {}

  private safeJsonParse(str: string, defaultValue: any): any {
    try {
      return typeof str === 'string' ? JSON.parse(str) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  async getConfig() {
    let config = await this.prisma.homepageConfig.findFirst({
      where: { isActive: true },
    });

    if (!config) {
      config = await this.prisma.homepageConfig.create({
        data: {
          heroTitle: "Empowering Bangladesh's Agricultural Future",
          heroSubtitle: 'Your trusted partner for quality seeds, crop protection, and modern farming machinery',
          heroSlides: JSON.stringify(DEFAULT_HERO_SLIDES),
          sliderCategories: '[]',
          features: JSON.stringify(DEFAULT_FEATURES),
          videoEnabled: true,
          videoUrls: '[]',
          stats: JSON.stringify(DEFAULT_STATS),
          ctaTitle: 'Ready to Transform Your Farm?',
          ctaSubtitle: 'Get in touch with our agricultural experts today and discover the best solutions for your farming needs.',
          ctaButtonText: 'Contact Us',
          ctaButtonLink: '/contact',
        },
      });
    }

    return {
      ...config,
      heroSlides: this.safeJsonParse(config.heroSlides, DEFAULT_HERO_SLIDES),
      sliderCategories: this.safeJsonParse(config.sliderCategories, []),
      features: this.safeJsonParse(config.features, DEFAULT_FEATURES),
      videoUrls: this.safeJsonParse(config.videoUrls, []),
      stats: this.safeJsonParse(config.stats, DEFAULT_STATS),
    };
  }

  async updateConfig(dto: UpdateHomepageDto) {
    const data: any = {};

    if (dto.heroTitle !== undefined) data.heroTitle = dto.heroTitle;
    if (dto.heroSubtitle !== undefined) data.heroSubtitle = dto.heroSubtitle;
    if (dto.heroSlides !== undefined) data.heroSlides = JSON.stringify(dto.heroSlides);
    if (dto.heroUseCategories !== undefined) data.heroUseCategories = dto.heroUseCategories;
    if (dto.sliderCategories !== undefined) data.sliderCategories = JSON.stringify(dto.sliderCategories);
    if (dto.features !== undefined) data.features = JSON.stringify(dto.features);
    if (dto.videoEnabled !== undefined) data.videoEnabled = dto.videoEnabled;
    if (dto.videoTitle !== undefined) data.videoTitle = dto.videoTitle;
    if (dto.videoSubtitle !== undefined) data.videoSubtitle = dto.videoSubtitle;
    if (dto.videoPlaylistId !== undefined) data.videoPlaylistId = dto.videoPlaylistId;
    if (dto.videoUrls !== undefined) data.videoUrls = JSON.stringify(dto.videoUrls);
    if (dto.stats !== undefined) data.stats = JSON.stringify(dto.stats);
    if (dto.ctaTitle !== undefined) data.ctaTitle = dto.ctaTitle;
    if (dto.ctaSubtitle !== undefined) data.ctaSubtitle = dto.ctaSubtitle;
    if (dto.ctaButtonText !== undefined) data.ctaButtonText = dto.ctaButtonText;
    if (dto.ctaButtonLink !== undefined) data.ctaButtonLink = dto.ctaButtonLink;

    let config = await this.prisma.homepageConfig.findFirst({
      where: { isActive: true },
    });

    if (!config) {
      config = await this.prisma.homepageConfig.create({
        data: { ...data, isActive: true },
      });
    } else {
      config = await this.prisma.homepageConfig.update({
        where: { id: config.id },
        data,
      });
    }

    return {
      ...config,
      heroSlides: this.safeJsonParse(config.heroSlides, []),
      sliderCategories: this.safeJsonParse(config.sliderCategories, []),
      features: this.safeJsonParse(config.features, []),
      videoUrls: this.safeJsonParse(config.videoUrls, []),
      stats: this.safeJsonParse(config.stats, []),
    };
  }
}