'use client';

import * as React from 'react';
import { Plus, Edit, Trash2, Loader2, Search, Shield, Bug, Droplet, Leaf, Tractor, Wrench, Copy, Check, UserPlus } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/use-users';
import type { User, Role } from '@/lib/shared-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.enum(['SUPER_ADMIN', 'PAGE_EDITOR', 'SEED_ADMIN', 'PESTICIDE_ADMIN', 'FERTILIZER_ADMIN', 'MACHINERY_ADMIN', 'SERVICE_ADMIN', 'ADMIN', 'MANAGER', 'USER', 'CUSTOMER']),
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
  
  // Section Admin Dialog
  const [isSectionAdminDialogOpen, setIsSectionAdminDialogOpen] = React.useState(false);
  const [sectionAdminRole, setSectionAdminRole] = React.useState<Role>('' as Role);
  const [isCreatingSectionAdmin, setIsCreatingSectionAdmin] = React.useState(false);
  const [createdCredentials, setCreatedCredentials] = React.useState<{email: string; password: string} | null>(null);

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

  // Section Admin Creation
  const [sectionAdminForm, setSectionAdminForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSectionAdminForm({ ...sectionAdminForm, password });
  };

  const handleCreateSectionAdmin = async () => {
    if (!sectionAdminForm.name || !sectionAdminForm.email || !sectionAdminForm.password || !sectionAdminRole) {
      return;
    }

    setIsCreatingSectionAdmin(true);
    try {
      await createUser.mutateAsync({
        name: sectionAdminForm.name,
        email: sectionAdminForm.email,
        phone: sectionAdminForm.phone,
        password: sectionAdminForm.password,
        role: sectionAdminRole,
        isActive: true,
      });
      setCreatedCredentials({
        email: sectionAdminForm.email,
        password: sectionAdminForm.password,
      });
    } catch (error) {
      console.error('Failed to create section admin:', error);
    } finally {
      setIsCreatingSectionAdmin(false);
    }
  };

  const resetSectionAdminForm = () => {
    setSectionAdminForm({ name: '', email: '', phone: '', password: '' });
    setSectionAdminRole('' as Role);
    setCreatedCredentials(null);
  };

  const roleColors: Record<Role, string> = {
    SUPER_ADMIN: 'bg-purple-100 text-purple-700',
    PAGE_EDITOR: 'bg-gray-100 text-gray-700',
    SEED_ADMIN: 'bg-green-100 text-green-700',
    PESTICIDE_ADMIN: 'bg-orange-100 text-orange-700',
    FERTILIZER_ADMIN: 'bg-amber-100 text-amber-700',
    MACHINERY_ADMIN: 'bg-blue-100 text-blue-700',
    SERVICE_ADMIN: 'bg-teal-100 text-teal-700',
    ADMIN: 'bg-red-100 text-red-700',
    MANAGER: 'bg-cyan-100 text-cyan-700',
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
          <div className="flex gap-2">
            {/* Quick Section Admin Buttons */}
            <Button 
              variant="outline" 
              className="border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => { resetSectionAdminForm(); setSectionAdminRole('SEED_ADMIN' as Role); setIsSectionAdminDialogOpen(true); }}
            >
              <Bug className="w-4 h-4 mr-2" />
              Add Seed Admin
            </Button>
            <Button 
              variant="outline" 
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
              onClick={() => { resetSectionAdminForm(); setSectionAdminRole('PESTICIDE_ADMIN' as Role); setIsSectionAdminDialogOpen(true); }}
            >
              <Droplet className="w-4 h-4 mr-2" />
              Add Pesticide Admin
            </Button>
            <Button 
              variant="outline" 
              className="border-amber-600 text-amber-600 hover:bg-amber-50"
              onClick={() => { resetSectionAdminForm(); setSectionAdminRole('FERTILIZER_ADMIN' as Role); setIsSectionAdminDialogOpen(true); }}
            >
              <Leaf className="w-4 h-4 mr-2" />
              Add Fertilizer Admin
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => { resetSectionAdminForm(); setSectionAdminRole('MACHINERY_ADMIN' as Role); setIsSectionAdminDialogOpen(true); }}
            >
              <Tractor className="w-4 h-4 mr-2" />
              Add Machinery Admin
            </Button>
            <Button 
              variant="outline" 
              className="border-teal-600 text-teal-600 hover:bg-teal-50"
              onClick={() => { resetSectionAdminForm(); setSectionAdminRole('SERVICE_ADMIN' as Role); setIsSectionAdminDialogOpen(true); }}
            >
              <Wrench className="w-4 h-4 mr-2" />
              Add Service Admin
            </Button>
            <Button onClick={() => { setEditingUser(null); reset(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
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

        {/* Section Admin Creation Dialog */}
        <Dialog open={isSectionAdminDialogOpen} onOpenChange={setIsSectionAdminDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Add Section Admin
              </DialogTitle>
            </DialogHeader>
            
            {createdCredentials ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Account Created Successfully!</h4>
                  <p className="text-sm text-green-700 mb-4">Share these credentials with the admin:</p>
                  
                  <div className="bg-white rounded p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Email:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{createdCredentials.email}</code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Password:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{createdCredentials.password}</code>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setIsSectionAdminDialogOpen(false);
                    resetSectionAdminForm();
                  }}
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-700">
                    Creating: <strong>{sectionAdminRole === 'SEED_ADMIN' ? 'Seed Admin' : sectionAdminRole === 'PESTICIDE_ADMIN' ? 'Pesticide Admin' : sectionAdminRole === 'FERTILIZER_ADMIN' ? 'Fertilizer Admin' : sectionAdminRole === 'MACHINERY_ADMIN' ? 'Machinery Admin' : sectionAdminRole === 'SERVICE_ADMIN' ? 'Service Admin' : ''}</strong>
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Full Name *</Label>
                    <Input 
                      value={sectionAdminForm.name}
                      onChange={(e) => setSectionAdminForm({...sectionAdminForm, name: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <Label>Email *</Label>
                    <Input 
                      type="email"
                      value={sectionAdminForm.email}
                      onChange={(e) => setSectionAdminForm({...sectionAdminForm, email: e.target.value})}
                      placeholder="admin@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label>Phone</Label>
                    <Input 
                      value={sectionAdminForm.phone}
                      onChange={(e) => setSectionAdminForm({...sectionAdminForm, phone: e.target.value})}
                      placeholder="+880 1XXX-XXXXXX"
                    />
                  </div>
                  
                  <div>
                    <Label>Password *</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="password"
                        value={sectionAdminForm.password}
                        onChange={(e) => setSectionAdminForm({...sectionAdminForm, password: e.target.value})}
                        placeholder="Enter password"
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={generatePassword}>
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1" 
                    disabled={!sectionAdminForm.name || !sectionAdminForm.email || !sectionAdminForm.password || isCreatingSectionAdmin}
                    onClick={handleCreateSectionAdmin}
                  >
                    {isCreatingSectionAdmin ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                    ) : (
                      <><UserPlus className="w-4 h-4 mr-2" /> Create Admin</>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsSectionAdminDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
