import { useQuery } from '@tanstack/react-query';
import { api, apiEndpoints } from '@/lib/api';

export interface ActivityLog {
  id: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'LOGIN' | 'LOGOUT' | 'STATUS_CHANGE';
  entityType: 'Product' | 'Category' | 'User' | 'Lead' | 'Inquiry' | 'Dealer' | 'BlogPost' | 'Order';
  entityId?: string;
  entityName?: string;
  description?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ActivityStats {
  total: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  actionStats: Record<string, number>;
}

export function useActivityLogs(limit: number = 50) {
  return useQuery({
    queryKey: ['activity', 'logs', limit],
    queryFn: async () => {
      return api.get<ActivityLog[]>(apiEndpoints.activity.list, { limit: limit.toString() });
    },
  });
}

export function useActivityStats() {
  return useQuery({
    queryKey: ['activity', 'stats'],
    queryFn: async () => {
      return api.get<ActivityStats>(apiEndpoints.activity.stats);
    },
  });
}

export function useEntityActivities(entityType: string, entityId: string) {
  return useQuery({
    queryKey: ['activity', 'entity', entityType, entityId],
    queryFn: async () => {
      return api.get<ActivityLog[]>(apiEndpoints.activity.byEntity(entityType, entityId));
    },
    enabled: !!entityType && !!entityId,
  });
}

export function useUserActivities(userId: string, limit: number = 50) {
  return useQuery({
    queryKey: ['activity', 'user', userId, limit],
    queryFn: async () => {
      return api.get<ActivityLog[]>(apiEndpoints.activity.byUser(userId), { limit: limit.toString() });
    },
    enabled: !!userId,
  });
}
