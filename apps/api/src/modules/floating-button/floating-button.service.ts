import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { UpdateFloatingButtonDto } from './dto';

@Injectable()
export class FloatingButtonService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.floatingButtonSettings.findFirst({});

    if (!settings) {
      settings = await this.prisma.floatingButtonSettings.create({
        data: {
          isEnabled: true,
          showWhatsapp: true,
          showFacebook: true,
          showEmail: true,
          position: 'bottom-right',
        },
      });
    }

    return settings;
  }

  async updateSettings(dto: UpdateFloatingButtonDto) {
    const existing = await this.prisma.floatingButtonSettings.findFirst({});

    if (!existing) {
      return this.prisma.floatingButtonSettings.create({
        data: {
          whatsapp: dto.whatsapp,
          facebook: dto.facebook,
          email: dto.email,
          isEnabled: dto.isEnabled ?? true,
          showWhatsapp: dto.showWhatsapp ?? true,
          showFacebook: dto.showFacebook ?? true,
          showEmail: dto.showEmail ?? true,
          position: dto.position ?? 'bottom-right',
        },
      });
    }

    return this.prisma.floatingButtonSettings.update({
      where: { id: existing.id },
      data: {
        whatsapp: dto.whatsapp ?? existing.whatsapp,
        facebook: dto.facebook ?? existing.facebook,
        email: dto.email ?? existing.email,
        isEnabled: dto.isEnabled ?? existing.isEnabled,
        showWhatsapp: dto.showWhatsapp ?? existing.showWhatsapp,
        showFacebook: dto.showFacebook ?? existing.showFacebook,
        showEmail: dto.showEmail ?? existing.showEmail,
        position: dto.position ?? existing.position,
      },
    });
  }
}