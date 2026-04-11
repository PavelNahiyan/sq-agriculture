import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { SubscribeDto } from './dto';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(dto: SubscribeDto): Promise<{ message: string }> {
    const existing = await this.prisma.newsletterSubscription.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      if (existing.isActive) {
        return { message: 'Email already subscribed' };
      }
      await this.prisma.newsletterSubscription.update({
        where: { email: dto.email },
        data: { isActive: true, unsubscribedAt: null },
      });
      return { message: 'Newsletter subscription reactivated' };
    }

    await this.prisma.newsletterSubscription.create({
      data: {
        email: dto.email,
        isActive: true,
      },
    });

    return { message: 'Successfully subscribed to newsletter' };
  }

  async unsubscribe(email: string): Promise<{ message: string }> {
    const existing = await this.prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (!existing) {
      throw new NotFoundException('Email not found in newsletter');
    }

    await this.prisma.newsletterSubscription.update({
      where: { email },
      data: { isActive: false, unsubscribedAt: new Date() },
    });

    return { message: 'Successfully unsubscribed from newsletter' };
  }

  async findAll(): Promise<{ email: string; isActive: boolean; subscribedAt: Date }[]> {
    return this.prisma.newsletterSubscription.findMany({
      select: {
        email: true,
        isActive: true,
        subscribedAt: true,
      },
      orderBy: { subscribedAt: 'desc' },
    });
  }

  async getStats(): Promise<{ total: number; active: number }> {
    const [total, active] = await Promise.all([
      this.prisma.newsletterSubscription.count(),
      this.prisma.newsletterSubscription.count({ where: { isActive: true } }),
    ]);
    return { total, active };
  }
}
