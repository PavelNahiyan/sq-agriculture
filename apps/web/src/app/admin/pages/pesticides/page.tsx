'use client';

import * as React from 'react';
import { Loader2, Save, Leaf, ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { usePageConfig, useUpdatePageConfig } from '@/hooks/use-page-config';
import { SingleImageUpload } from '@/components/ui/image-upload';
import { useProducts } from '@/hooks/use-products';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/use-categories';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function PesticidesPageConfig() {
  const pageName = 'pesticides';
  const pageTitle = 'Pesticides';
  
  const { data: config, isLoading } = usePageConfig(pageName);
  const updateConfig = useUpdatePageConfig();
  const { data: allProducts } = useProducts({ categoryType: 'PESTICIDES', limit: 100 });
  const { data: allCategories } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [productSearch, setProductSearch] = React.useState('');
  const [categoryDialogOpen, setCategoryDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<any>(null);
  const [categoryForm, setCategoryForm] = React.useState({ name: '', nameBn: '', description: '', slug: '' });
  
  const pesticideCategories = React.useMemo(() => {
    if (!allCategories) return [];
    return allCategories.filter((c: any) => c.type === 'PESTICIDES');
  }, [allCategories]);
  
  const pesticideProducts = React.useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
  }, [allProducts, productSearch]);
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const [formData, setFormData] = React.useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
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
      await updateConfig.mutateAsync({ pageName, data: formData });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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
            <h1 className="text-2xl font-bold">{pageTitle} Page Configuration</h1>
            <p className="text-gray-500">Manage {pageName} page content</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Page Active</span>
            <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Configure the hero section at the top of the page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Hero Title</Label>
                <Input value={formData.heroTitle} onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })} placeholder="Enter hero title" />
              </div>
              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Textarea value={formData.heroSubtitle} onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })} placeholder="Enter hero subtitle" rows={3} />
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
              {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : saved ? <><Save className="w-4 h-4 mr-2" /> Saved!</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </Button>
          </div>
        </form>

        {/* Pesticide Categories Section */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pesticide Categories</CardTitle>
              <CardDescription>Manage pesticide categories</CardDescription>
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
                        await updateCategory.mutateAsync({ id: editingCategory.id, data: { ...categoryForm, type: 'PESTICIDES' } });
                      } else {
                        await createCategory.mutateAsync({ ...categoryForm, type: 'PESTICIDES' });
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
              {pesticideCategories.map((cat: any) => (
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

        {/* Pesticide Products Section */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pesticide Products</CardTitle>
              <CardDescription>Manage pesticide products in this category</CardDescription>
            </div>
            <Link href="/admin/products/new?category=PESTICIDES">
              <Button><Plus className="w-4 h-4 mr-2" />Add Product</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input placeholder="Search products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="max-w-sm" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pesticideProducts.slice(0, 12).map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative h-32 bg-gray-100">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-contain p-2" />
                      ) : (
                        <div className="flex items-center justify-center h-full"><Leaf className="w-8 h-8 text-gray-400" /></div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      <p className="text-orange-600 font-bold text-sm">{product.price ? `৳${product.price.toLocaleString()}/${product.priceUnit}` : 'Price on request'}</p>
                      <Link href={`/admin/products/${product.id}/edit`}><Button variant="outline" size="sm" className="mt-2"><Pencil className="w-3 h-3" /></Button></Link>
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
            <CardTitle>All Pesticide Products</CardTitle>
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
                {pesticideProducts.map((product: any) => (
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
      </div>
    </AdminLayout>
  );
}