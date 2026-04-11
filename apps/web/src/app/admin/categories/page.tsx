'use client';

import * as React from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/use-categories';
import type { Category, CategoryType } from '@sq-agriculture/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  nameBn: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  descriptionBn: z.string().optional(),
  type: z.enum(['SEEDS', 'PESTICIDES', 'FERTILIZERS', 'MICRONUTRIENTS', 'MACHINERY', 'LUBRICANTS']),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: 'SEEDS',
      sortOrder: 0,
      isActive: true,
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, data });
      } else {
        await createCategory.mutateAsync(data);
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      reset();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      nameBn: category.nameBn,
      slug: category.slug,
      description: category.description,
      descriptionBn: category.descriptionBn,
      type: category.type,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const typeColors: Record<CategoryType, string> = {
    SEEDS: 'bg-green-100 text-green-700',
    PESTICIDES: 'bg-red-100 text-red-700',
    FERTILIZERS: 'bg-blue-100 text-blue-700',
    MICRONUTRIENTS: 'bg-purple-100 text-purple-700',
    MACHINERY: 'bg-amber-100 text-amber-700',
    LUBRICANTS: 'bg-gray-100 text-gray-700',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-gray-500">Manage product categories</p>
          </div>
          <Button onClick={() => { setEditingCategory(null); reset(); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Categories ({categories?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Slug</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b last:border-0">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{category.name}</p>
                            {category.nameBn && (
                              <p className="text-sm text-gray-500">{category.nameBn}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{category.slug}</td>
                        <td className="py-3 px-4">
                          <Badge className={typeColors[category.type]}>
                            {category.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={category.isActive ? 'default' : 'secondary'}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeleteConfirmId(category.id)}
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
                No categories found. Create your first category.
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input {...register('name')} placeholder="Category name" />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Name (Bengali)</Label>
                  <Input {...register('nameBn')} placeholder="বাংলা নাম" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input {...register('slug')} placeholder="category-slug" />
                  {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <select
                    {...register('type')}
                    className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                  >
                    <option value="SEEDS">Seeds</option>
                    <option value="PESTICIDES">Pesticides</option>
                    <option value="FERTILIZERS">Fertilizers</option>
                    <option value="MICRONUTRIENTS">Micronutrients</option>
                    <option value="MACHINERY">Machinery</option>
                    <option value="LUBRICANTS">Lubricants</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input {...register('description')} placeholder="Category description" />
              </div>

              <div className="space-y-2">
                <Label>Description (Bengali)</Label>
                <Input {...register('descriptionBn')} placeholder="বিবরণ" />
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
                <Button type="submit" disabled={createCategory.isPending || updateCategory.isPending}>
                  {createCategory.isPending || updateCategory.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this category? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                disabled={deleteCategory.isPending}
              >
                {deleteCategory.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
