import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { UpdatePageConfigDto } from './dto';

@Injectable()
export class PageConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async getConfig(pageName: string) {
    let config = await this.prisma.pageConfig.findUnique({
      where: { pageName },
    });

    if (!config) {
      config = await this.prisma.pageConfig.create({
        data: {
          pageName,
          features: '[]',
          customConfig: '{}',
        },
      });
    }

    return {
      ...config,
      features: JSON.parse(config.features || '[]'),
      customConfig: JSON.parse(config.customConfig || '{}'),
    };
  }

  async getAllConfigs() {
    const configs = await this.prisma.pageConfig.findMany({
      orderBy: { pageName: 'asc' },
    });

    return configs.map(config => ({
      ...config,
      features: JSON.parse(config.features || '[]'),
      customConfig: JSON.parse(config.customConfig || '{}'),
    }));
  }

  async updateConfig(pageName: string, dto: UpdatePageConfigDto, userId?: string) {
    const existingConfig = await this.prisma.pageConfig.findUnique({
      where: { pageName },
    });

    if (!existingConfig) {
      return this.prisma.pageConfig.create({
        data: {
          pageName,
          heroTitle: dto.heroTitle,
          heroSubtitle: dto.heroSubtitle,
          heroImage: dto.heroImage,
          features: dto.features || '[]',
          customConfig: dto.customConfig || '{}',
          isActive: dto.isActive ?? true,
          createdById: userId,
        },
      });
    }

    return this.prisma.pageConfig.update({
      where: { pageName },
      data: {
        heroTitle: dto.heroTitle ?? existingConfig.heroTitle,
        heroSubtitle: dto.heroSubtitle ?? existingConfig.heroSubtitle,
        heroImage: dto.heroImage ?? existingConfig.heroImage,
        features: dto.features ?? existingConfig.features,
        customConfig: dto.customConfig ?? existingConfig.customConfig,
        isActive: dto.isActive ?? existingConfig.isActive,
      },
    });
  }

  async deleteConfig(pageName: string) {
    await this.prisma.pageConfig.delete({
      where: { pageName },
    });
    return { success: true };
  }
}