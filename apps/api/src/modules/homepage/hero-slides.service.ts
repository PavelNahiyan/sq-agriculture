import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateHeroSlideDto, UpdateHeroSlideDto } from './dto/hero-slide.dto';

@Injectable()
export class HeroSlidesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(activeOnly = false) {
    return this.prisma.heroSlide.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const slide = await this.prisma.heroSlide.findUnique({
      where: { id },
    });
    if (!slide) {
      throw new NotFoundException(`Hero slide with ID ${id} not found`);
    }
    return slide;
  }

  async create(dto: CreateHeroSlideDto) {
    return this.prisma.heroSlide.create({
      data: {
        title: dto.title,
        titleBn: dto.titleBn,
        subtitle: dto.subtitle,
        subtitleBn: dto.subtitleBn,
        image: dto.image,
        mobileImage: dto.mobileImage,
        ctaText: dto.ctaText,
        ctaLink: dto.ctaLink,
        order: dto.order ?? 0,
        isActive: dto.isActive ?? true,
        backgroundColor: dto.backgroundColor,
        textColor: dto.textColor,
        overlayOpacity: dto.overlayOpacity,
      },
    });
  }

  async update(id: string, dto: UpdateHeroSlideDto) {
    await this.findOne(id);
    return this.prisma.heroSlide.update({
      where: { id },
      data: {
        title: dto.title,
        titleBn: dto.titleBn,
        subtitle: dto.subtitle,
        subtitleBn: dto.subtitleBn,
        image: dto.image,
        mobileImage: dto.mobileImage,
        ctaText: dto.ctaText,
        ctaLink: dto.ctaLink,
        order: dto.order,
        isActive: dto.isActive,
        backgroundColor: dto.backgroundColor,
        textColor: dto.textColor,
        overlayOpacity: dto.overlayOpacity,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.heroSlide.delete({
      where: { id },
    });
  }

  async reorder(ids: string[]) {
    const updates = ids.map((id, index) =>
      this.prisma.heroSlide.update({
        where: { id },
        data: { order: index },
      }),
    );
    return Promise.all(updates);
  }
}
