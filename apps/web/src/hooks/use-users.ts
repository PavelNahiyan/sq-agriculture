import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiEndpoints } from '@/lib/api';
import type { User } from '@sq-agriculture/shared';

function extractArrayData<T>(response: any): T[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.items)) return response.items;
  return [];
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get<any>(apiEndpoints.users.list);
      return extractArrayData<User>(response);
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      return api.get<User>(apiEndpoints.users.byId(id));
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<User> & { password: string }) => {
      return api.post<User>(apiEndpoints.users.list, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      return api.patch<User>(apiEndpoints.users.byId(id), data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete<User>(apiEndpoints.users.byId(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
