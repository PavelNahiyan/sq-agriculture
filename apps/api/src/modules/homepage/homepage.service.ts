import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateHomepageDto } from '../dto';

@Injectable()
export class HomepageService {
  constructor(private readonly prisma: PrismaService) {}

  async getConfig() {
    let config = await this.prisma.homepageConfig.findFirst({
      where: { isActive: true },
    });

    if (!config) {
      config = await this.prisma.homepageConfig.create({
        data: {
          heroSlides: '[]',
          sliderCategories: '[]',
          features: '[]',
          videoEnabled: true,
          videoUrls: '[]',
          stats: '[]',
        },
      });
    }

    return {
      ...config,
      heroSlides: JSON.parse(config.heroSlides || '[]'),
      sliderCategories: JSON.parse(config.sliderCategories || '[]'),
      features: JSON.parse(config.features || '[]'),
      videoUrls: JSON.parse(config.videoUrls || '[]'),
      stats: JSON.parse(config.stats || '[]'),
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
      heroSlides: JSON.parse(config.heroSlides || '[]'),
      sliderCategories: JSON.parse(config.sliderCategories || '[]'),
      features: JSON.parse(config.features || '[]'),
      videoUrls: JSON.parse(config.videoUrls || '[]'),
      stats: JSON.parse(config.stats || '[]'),
    };
  }
}