import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  private safeJsonParse(str: string | null, defaultValue: any): any {
    try {
      return typeof str === 'string' ? JSON.parse(str) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  async getRecentActivities(limit: number = 50) {
    const activities = await this.prisma.activityLog.findMany({
      take: limit,
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return activities.map(activity => ({
      ...activity,
      oldValue: this.safeJsonParse(activity.oldValue, null),
      newValue: this.safeJsonParse(activity.newValue, null),
    }));
  }

  async getActivityStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [total, todayCount, weekCount, monthCount, byAction] = await Promise.all([
      this.prisma.activityLog.count(),
      this.prisma.activityLog.count({
        where: { timestamp: { gte: today } },
      }),
      this.prisma.activityLog.count({
        where: { timestamp: { gte: weekAgo } },
      }),
      this.prisma.activityLog.count({
        where: { timestamp: { gte: monthAgo } },
      }),
      this.prisma.activityLog.groupBy({
        by: ['action'],
        _count: { action: true },
      }),
    ]);

    const actionStats = byAction.reduce((acc, item) => {
      acc[item.action] = item._count.action;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      todayCount,
      weekCount,
      monthCount,
      actionStats,
    };
  }

  async getActivitiesByEntity(entityType: string, entityId: string) {
    const activities = await this.prisma.activityLog.findMany({
      where: { entityType, entityId },
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return activities.map(activity => ({
      ...activity,
      oldValue: this.safeJsonParse(activity.oldValue, null),
      newValue: this.safeJsonParse(activity.newValue, null),
    }));
  }

  async getActivitiesByUser(userId: string, limit: number = 50) {
    const activities = await this.prisma.activityLog.findMany({
      where: { userId },
      take: limit,
      orderBy: { timestamp: 'desc' },
    });

    return activities.map(activity => ({
      ...activity,
      oldValue: this.safeJsonParse(activity.oldValue, null),
      newValue: this.safeJsonParse(activity.newValue, null),
    }));
  }

  async logActivity(params: {
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    entityName?: string;
    description?: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.activityLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        entityName: params.entityName,
        description: params.description,
        oldValue: params.oldValue ? JSON.stringify(params.oldValue) : null,
        newValue: params.newValue ? JSON.stringify(params.newValue) : null,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  }
}
