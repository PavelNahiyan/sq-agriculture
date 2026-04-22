'use client';

import * as React from 'react';
import { Loader2, Save, Leaf, ArrowLeft, Plus, Trash2, Edit2, Upload, Pencil, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePageConfig, useUpdatePageConfig } from '@/hooks/use-page-config';
import { SingleImageUpload } from '@/components/ui/image-upload';
import { useSeedPartners, useCreateSeedPartner, useUpdateSeedPartner, useDeleteSeedPartner } from '@/hooks/use-seed-partners';
import { useProducts, useDeleteProduct } from '@/hooks/use-products';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/use-categories';

interface SeedPartner {
  id: string;
  name: string;
  nameBn: string | null;
  logo: string | null;
  description: string | null;
  website: string | null;
  sortOrder: number;
  isActive: boolean;
}

export default function SeedsPageConfig() {
  const pageName = 'seeds';
  const pageTitle = 'Seeds';
  const { data: config, isLoading: configLoading } = usePageConfig(pageName);
  const updateConfig = useUpdatePageConfig();
  const { data: seedPartners, isLoading: partnersLoading } = useSeedPartners();
  const createPartner = useCreateSeedPartner();
  const updatePartner = useUpdateSeedPartner();
  const deletePartner = useDeleteSeedPartner();
  const { data: allProducts } = useProducts({ categoryType: 'SEEDS', limit: 100 });
  const deleteProduct = useDeleteProduct();
  const { data: allCategories } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [productSearch, setProductSearch] = React.useState('');
  const [categoryDialogOpen, setCategoryDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<any>(null);
  const [categoryForm, setCategoryForm] = React.useState({ name: '', nameBn: '', description: '', slug: '' });
  
  const seedCategories = React.useMemo(() => {
    if (!allCategories) return [];
    return allCategories.filter((c: any) => c.type === 'SEEDS');
  }, [allCategories]);
  
  const seedProducts = React.useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
  }, [allProducts, productSearch]);
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingPartner, setEditingPartner] = React.useState<SeedPartner | null>(null);

  const [formData, setFormData] = React.useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    isActive: true,
  });

  const [partnerForm, setPartnerForm] = React.useState({
    name: '',
    nameBn: '',
    logo: '',
    description: '',
    website: '',
    sortOrder: 0,
    isActive: true,
  });

  React.useEffect(() => {
    if (config) {
      setFormData({
        heroTitle: config.heroTitle || '',
        heroSubtitle: config.heroSubtitle || '',
        heroImage: config.heroImage || '',
        isActive: config.isActive ?? true,
      });
    }
  }, [config]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateConfig.mutateAsync({
        pageName,
        data: formData,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const openPartnerDialog = (partner?: SeedPartner) => {
    if (partner) {
      setEditingPartner(partner);
      setPartnerForm({
        name: partner.name,
        nameBn: partner.nameBn || '',
        logo: partner.logo || '',
        description: partner.description || '',
        website: partner.website || '',
        sortOrder: partner.sortOrder,
        isActive: partner.isActive,
      });
    } else {
      setEditingPartner(null);
      setPartnerForm({
        name: '',
        nameBn: '',
        logo: '',
        description: '',
        website: '',
        sortOrder: (seedPartners?.length || 0) + 1,
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const savePartner = async () => {
    try {
      if (editingPartner) {
        await updatePartner.mutateAsync({
          id: editingPartner.id,
          data: partnerForm,
        });
      } else {
        await createPartner.mutateAsync(partnerForm);
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to save partner:', error);
    }
  };

  const removePartner = async (id: string) => {
    if (confirm('Are you sure you want to delete this partner?')) {
      try {
        await deletePartner.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete partner:', error);
      }
    }
  };

  if (configLoading || partnersLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-bold">{pageTitle} Configuration</h1>
            <p className="text-gray-500">Manage {pageName} page content</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Page Active</span>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Configure the hero section at the top of the page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Hero Title</Label>
                <Input
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="Enter hero title"
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Textarea
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  placeholder="Enter hero subtitle"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Image</Label>
                <SingleImageUpload
                  value={formData.heroImage}
                  onChange={(url) => setFormData({ ...formData, heroImage: url })}
                  placeholder="Upload or select hero image"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Seed Categories Section */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Seed Categories</CardTitle>
              <CardDescription>Manage seed categories</CardDescription>
            </div>
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', nameBn: '', description: '', slug: '' }); }}>
                  <Plus className="w-4 h-4 mr-2" />Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCategory ? 'Edit' : 'Add'} Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-3">
                  <Input placeholder="Category Name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
                  <Input placeholder="Name (Bengali)" value={categoryForm.nameBn} onChange={(e) => setCategoryForm({ ...categoryForm, nameBn: e.target.value })} />
                  <Textarea placeholder="Description" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
                  <Button className="w-full" onClick={async () => {
                    try {
                      if (editingCategory) {
                        await updateCategory.mutateAsync({ id: editingCategory.id, data: { ...categoryForm, type: 'SEEDS' } });
                      } else {
                        await createCategory.mutateAsync({ ...categoryForm, type: 'SEEDS' });
                      }
                      setCategoryDialogOpen(false);
                    } catch (e) { console.error(e); }
                  }}>{editingCategory ? 'Update' : 'Create'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {seedCategories.map((cat: any) => (
                <Card key={cat.id} className="p-3">
                  <h4 className="font-medium text-sm">{cat.name}</h4>
                  <p className="text-xs text-gray-500">{cat.slug}</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingCategory(cat); setCategoryForm({ name: cat.name || '', nameBn: cat.nameBn || '', description: cat.description || '', slug: cat.slug || '' }); setCategoryDialogOpen(true); }}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={async () => { if (confirm('Delete category?')) { await deleteCategory.mutateAsync(cat.id); } }}>
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seed Products Section */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Seed Products</CardTitle>
              <CardDescription>Manage seed products in this category</CardDescription>
            </div>
            <Link href="/admin/products/new?category=SEEDS">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seedProducts.slice(0, 12).map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative h-32 bg-gray-100">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-contain p-2" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Leaf className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      <p className="text-green-600 font-bold text-sm">
                        {product.price ? `৳${product.price.toLocaleString()}/${product.priceUnit}` : 'Price on request'}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Products Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>All Seed Products</CardTitle>
            <CardDescription>Complete list of all products in this category</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seedProducts.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.price ? `৳${product.price.toLocaleString()}/${product.priceUnit}` : '-'}</TableCell>
                    <TableCell>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm"><Pencil className="w-3 h-3" /></Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Seed Partners Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Seed Partners</CardTitle>
              <CardDescription>Manage your seed partner organizations</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openPartnerDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Partner
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingPartner ? 'Edit' : 'Add'} Seed Partner</DialogTitle>
                  <DialogDescription>Add or edit a seed partner organization</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={partnerForm.name}
                      onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                      placeholder="Partner name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Name (Bengali)</Label>
                    <Input
                      value={partnerForm.nameBn}
                      onChange={(e) => setPartnerForm({ ...partnerForm, nameBn: e.target.value })}
                      placeholder="বাংলায় নাম"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input
                      value={partnerForm.logo}
                      onChange={(e) => setPartnerForm({ ...partnerForm, logo: e.target.value })}
                      placeholder="Logo image URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={partnerForm.description}
                      onChange={(e) => setPartnerForm({ ...partnerForm, description: e.target.value })}
                      placeholder="Description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      value={partnerForm.website}
                      onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      value={partnerForm.sortOrder}
                      onChange={(e) => setPartnerForm({ ...partnerForm, sortOrder: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={partnerForm.isActive}
                      onCheckedChange={(checked) => setPartnerForm({ ...partnerForm, isActive: checked })}
                    />
                    <span className="text-sm">Active</span>
                  </div>
                  <Button onClick={savePartner} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Partner
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Sort</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seedPartners && seedPartners.length > 0 ? (
                  seedPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="w-10 h-10 relative bg-gray-100 rounded flex items-center justify-center">
                          {partner.logo ? (
                            <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-xs font-bold text-green-700">{partner.name.substring(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{partner.name}</TableCell>
                      <TableCell className="text-gray-500">{partner.description}</TableCell>
                      <TableCell>{partner.sortOrder}</TableCell>
                      <TableCell>
                        <Badge variant={partner.isActive ? 'default' : 'secondary'}>
                          {partner.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openPartnerDialog(partner)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removePartner(partner.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No seed partners found. Add one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}