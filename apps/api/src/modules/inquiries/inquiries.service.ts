import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { CreateInquiryDto, UpdateInquiryDto, InquiryQueryDto } from './dto';
import { Prisma } from '@prisma/client';
import { InquiryStatusType, UserTypeType } from '@/common/constants';

@Injectable()
export class InquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInquiryDto, ipAddress?: string, userAgent?: string): Promise<any> {
    const inquiry = await this.prisma.inquiry.create({
      data: {
        ...dto,
        status: 'NEW',
        ipAddress,
        userAgent,
      },
    });
    return inquiry;
  }

  async findAll(query: InquiryQueryDto): Promise<{ data: any[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 20, status, userType, search, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.InquiryWhereInput = {
      ...(status && { status: status as InquiryStatusType }),
      ...(userType && { userType: userType as UserTypeType }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
          { company: { contains: search } },
        ],
      }),
      ...(startDate && { createdAt: { gte: new Date(startDate) } }),
      ...(endDate && { createdAt: { lte: new Date(endDate) } }),
    };

    const [inquiries, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inquiry.count({ where }),
    ]);

    return {
      data: inquiries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<any> {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }

    return inquiry;
  }

  async update(id: string, dto: UpdateInquiryDto): Promise<any> {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }

    return this.prisma.inquiry.update({
      where: { id },
      data: dto,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async assignToUser(inquiryId: string, userId: string): Promise<any> {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.inquiry.update({
      where: { id: inquiryId },
      data: { assignedToId: userId },
    });
  }

  async getStats(): Promise<any> {
    const [total, newCount, repliedCount, archivedCount] = await Promise.all([
      this.prisma.inquiry.count(),
      this.prisma.inquiry.count({ where: { status: 'NEW' } }),
      this.prisma.inquiry.count({ where: { status: 'REPLIED' } }),
      this.prisma.inquiry.count({ where: { status: 'ARCHIVED' } }),
    ]);

    const byUserType = await this.prisma.inquiry.groupBy({
      by: ['userType'],
      _count: true,
    });

    return {
      total,
      byStatus: {
        new: newCount,
        replied: repliedCount,
        archived: archivedCount,
      },
      byUserType: byUserType.reduce((acc, item) => {
        acc[item.userType] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
