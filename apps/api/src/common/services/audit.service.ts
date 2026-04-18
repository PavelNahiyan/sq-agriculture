import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';

export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'LOGIN' | 'LOGOUT' | 'STATUS_CHANGE';
export type ActivityEntityType = 'Product' | 'Category' | 'User' | 'Lead' | 'Inquiry' | 'Dealer' | 'BlogPost' | 'Order';

export interface LogActivityParams {
  userId: string;
  action: ActivityAction;
  entityType: ActivityEntityType;
  entityId?: string;
  entityName?: string;
  description?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: LogActivityParams): Promise<void> {
    try {
      await this.prisma.activityLog.create({
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
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  async logProductActivity(
    userId: string,
    action: ActivityAction,
    product: any,
    oldProduct?: any,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const productSummary = {
      id: product.id || product.slug,
      name: product.name,
      category: product.category?.name || product.categoryId,
    };

    let description: string;
    switch (action) {
      case 'CREATE':
        description = `Created product "${product.name}" in ${product.category?.name || product.categoryId}`;
        break;
      case 'UPDATE':
        description = `Updated product "${product.name}"`;
        break;
      case 'DELETE':
        description = `Deleted product "${product.name}"`;
        break;
      case 'STATUS_CHANGE':
        description = `Changed status of "${product.name}" to ${product.isActive ? 'Active' : 'Inactive'}`;
        break;
      default:
        description = `${action} on product "${product.name}"`;
    }

    await this.log({
      userId,
      action,
      entityType: 'Product',
      entityId: product.id || product.slug,
      entityName: product.name,
      description,
      oldValue: oldProduct ? { ...oldProduct, category: oldProduct.category?.name || oldProduct.categoryId } : undefined,
      newValue: { ...productSummary },
      ipAddress,
      userAgent,
    });
  }

  async getRecentActivities(limit: number = 50): Promise<any[]> {
    return this.prisma.activityLog.findMany({
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
  }

  async getActivitiesByEntity(entityType: ActivityEntityType, entityId: string): Promise<any[]> {
    return this.prisma.activityLog.findMany({
      where: {
        entityType,
        entityId,
      },
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
  }

  async getActivitiesByUser(userId: string, limit: number = 50): Promise<any[]> {
    return this.prisma.activityLog.findMany({
      where: { userId },
      take: limit,
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
  }

  async getActivitiesByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    return this.prisma.activityLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
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
  }
}
