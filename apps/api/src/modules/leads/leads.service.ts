import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto, LeadQueryDto } from './dto';
import { Prisma } from '@prisma/client';
import { LeadStatus, LeadStatusType, UserType, UserTypeType } from '@/common/constants';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto): Promise<any> {
    const lead = await this.prisma.lead.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        company: dto.company,
        userType: dto.userType,
        productInterest: dto.productInterest,
        message: dto.message,
        source: dto.source || 'web',
        status: 'NEW',
      },
    });

    return lead;
  }

  async findAll(query: LeadQueryDto): Promise<{ data: any[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      userType,
      assignedToId,
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.LeadWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
          { company: { contains: search } },
        ],
      }),
      ...(status && { status: status as LeadStatusType }),
      ...(userType && { userType: userType as UserTypeType }),
      ...(assignedToId && { assignedToId }),
      ...(startDate && { createdAt: { gte: new Date(startDate) } }),
      ...(endDate && { createdAt: { lte: new Date(endDate) } }),
    };

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return { data: leads, total };
  }

  async findOne(id: string): Promise<any> {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async update(id: string, dto: UpdateLeadDto): Promise<any> {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: dto,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedLead;
  }

  async assignToUser(leadId: string, userId: string): Promise<any> {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.lead.update({
      where: { id: leadId },
      data: { assignedToId: userId },
    });
  }

  async getStats(): Promise<any> {
    const [total, newLeads, contacted, qualified, converted] = await Promise.all([
      this.prisma.lead.count(),
      this.prisma.lead.count({ where: { status: 'NEW' } }),
      this.prisma.lead.count({ where: { status: 'CONTACTED' } }),
      this.prisma.lead.count({ where: { status: 'QUALIFIED' } }),
      this.prisma.lead.count({ where: { status: 'CONVERTED' } }),
    ]);

    // Get leads by user type
    const byUserType = await this.prisma.lead.groupBy({
      by: ['userType'],
      _count: true,
    });

    // Get recent leads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentLeads = await this.prisma.lead.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    });

    return {
      total,
      byStatus: {
        new: newLeads,
        contacted,
        qualified,
        converted,
      },
      byUserType: byUserType.reduce((acc, item) => {
        acc[item.userType] = item._count;
        return acc;
      }, {} as Record<string, number>),
      recentLeads,
    };
  }
}
