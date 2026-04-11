'use client';

import * as React from 'react';
import { Plus, Edit, Trash2, Loader2, Search } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/use-users';
import type { User, Role } from '@sq-agriculture/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'USER', 'CUSTOMER']),
  password: z.string().min(6).optional(),
  isActive: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userSchema>;

export default function AdminUsersPage() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'USER',
      isActive: true,
    },
  });

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             user.email.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [users, searchQuery]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        const { password, ...updateData } = data;
        await updateUser.mutateAsync({ 
          id: editingUser.id, 
          data: updateData 
        });
      } else {
        await createUser.mutateAsync({ ...data, password: data.password! });
      }
      setIsDialogOpen(false);
      setEditingUser(null);
      reset();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const roleColors: Record<Role, string> = {
    ADMIN: 'bg-purple-100 text-purple-700',
    MANAGER: 'bg-blue-100 text-blue-700',
    USER: 'bg-green-100 text-green-700',
    CUSTOMER: 'bg-gray-100 text-gray-700',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-gray-500">Manage system users</p>
          </div>
          <Button onClick={() => { setEditingUser(null); reset(); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Phone</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Created</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="py-3 px-4 font-medium">{user.name}</td>
                        <td className="py-3 px-4 text-gray-500">{user.email}</td>
                        <td className="py-3 px-4 text-gray-500">{user.phone || '-'}</td>
                        <td className="py-3 px-4">
                          <Badge className={roleColors[user.role]}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeleteConfirmId(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No users found.
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input {...register('name')} placeholder="Full name" />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" {...register('email')} placeholder="email@example.com" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input {...register('phone')} placeholder="+880 1XXX-XXXXXX" />
              </div>

              <div className="space-y-2">
                <Label>Role *</Label>
                <select
                  {...register('role')}
                  className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="USER">User</option>
                  <option value="CUSTOMER">Customer</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>{editingUser ? 'New Password (leave blank to keep)' : 'Password *'}</Label>
                <Input type="password" {...register('password')} placeholder="********" />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createUser.isPending || updateUser.isPending}>
                  {createUser.isPending || updateUser.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {editingUser ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                disabled={deleteUser.isPending}
              >
                {deleteUser.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
