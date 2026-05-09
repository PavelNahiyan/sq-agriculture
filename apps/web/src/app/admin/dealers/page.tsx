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
import { useDealers, useCreateDealer, useUpdateDealer, useDeleteDealer } from '@/hooks/use-dealers';
import type { Dealer } from '@/lib/shared-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const dealerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  nameBn: z.string().optional(),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  district: z.string().min(1, 'District is required'),
  division: z.string().min(1, 'Division is required'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type DealerFormData = z.infer<typeof dealerSchema>;

export default function AdminDealersPage() {
  const { data: dealers, isLoading } = useDealers();
  const createDealer = useCreateDealer();
  const updateDealer = useUpdateDealer();
  const deleteDealer = useDeleteDealer();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingDealer, setEditingDealer] = React.useState<Dealer | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DealerFormData>({
    resolver: zodResolver(dealerSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const filteredDealers = React.useMemo(() => {
    if (!dealers) return [];
    return dealers.filter((dealer) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        dealer.name.toLowerCase().includes(q) ||
        dealer.district.toLowerCase().includes(q) ||
        dealer.division.toLowerCase().includes(q) ||
        dealer.phone.includes(q)
      );
    });
  }, [dealers, searchQuery]);

  const onSubmit = async (data: DealerFormData) => {
    try {
      const payload = {
        ...data,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
      };
      if (editingDealer) {
        await updateDealer.mutateAsync({ id: editingDealer.id, data: payload });
      } else {
        await createDealer.mutateAsync(payload);
      }
      setIsDialogOpen(false);
      setEditingDealer(null);
      reset();
    } catch (error) {
      console.error('Failed to save dealer:', error);
    }
  };

  const handleEdit = (dealer: Dealer) => {
    setEditingDealer(dealer);
    reset({
      name: dealer.name,
      nameBn: dealer.nameBn,
      phone: dealer.phone,
      email: dealer.email,
      address: dealer.address,
      district: dealer.district,
      division: dealer.division,
      latitude: dealer.latitude?.toString() || '',
      longitude: dealer.longitude?.toString() || '',
      image: dealer.image,
      description: dealer.description,
      isActive: dealer.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDealer.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete dealer:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dealers</h1>
            <p className="text-gray-500">Manage dealer network</p>
          </div>
          <Button onClick={() => { setEditingDealer(null); reset(); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Dealer
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>All Dealers ({filteredDealers.length})</CardTitle>
              <Input
                placeholder="Search dealers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredDealers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 font-medium">Location</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Since</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDealers.map((dealer) => (
                      <tr key={dealer.id} className="border-b last:border-0">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{dealer.name}</p>
                            {dealer.nameBn && (
                              <p className="text-sm text-gray-500">{dealer.nameBn}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{dealer.phone}</p>
                          {dealer.email && (
                            <p className="text-sm text-gray-500">{dealer.email}</p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{dealer.district}</p>
                          <p className="text-sm text-gray-500">{dealer.division}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={dealer.isActive ? 'default' : 'secondary'}>
                            {dealer.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(dealer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(dealer)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeleteConfirmId(dealer.id)}
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
                {searchQuery ? 'No dealers matching your search.' : 'No dealers found. Add your first dealer.'}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDealer ? 'Edit Dealer' : 'Add Dealer'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input {...register('name')} placeholder="Dealer name" />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Name (Bengali)</Label>
                  <Input {...register('nameBn')} placeholder="বাংলা নাম" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input {...register('phone')} placeholder="Phone number" />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input {...register('email')} placeholder="Email address" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address *</Label>
                <Input {...register('address')} placeholder="Full address" />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>District *</Label>
                  <Input {...register('district')} placeholder="District" />
                  {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Division *</Label>
                  <Input {...register('division')} placeholder="Division" />
                  {errors.division && <p className="text-red-500 text-sm">{errors.division.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input {...register('latitude')} placeholder="23.8103" />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input {...register('longitude')} placeholder="90.4125" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input {...register('image')} placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input {...register('description')} placeholder="Additional details..." />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" {...register('isActive')} className="rounded border-gray-300" />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createDealer.isPending || updateDealer.isPending}>
                  {createDealer.isPending || updateDealer.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {editingDealer ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Dealer</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this dealer? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                disabled={deleteDealer.isPending}
              >
                {deleteDealer.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
