'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, ArrowLeft, Upload } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminProduct, useUpdateProduct } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  nameBn: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  descriptionBn: z.string().optional(),
  price: z.number().optional(),
  priceUnit: z.enum(['KG', 'TON', 'LITRE', 'ML', 'PIECE', 'UNIT', 'BAG', 'BOX', 'GRAM']).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  inStock: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const { data: product, isLoading } = useAdminProduct(productId);
  const updateProduct = useUpdateProduct();
  const { data: categories } = useCategories();
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      featured: false,
      inStock: true,
      isActive: true,
      images: [],
    },
  });

  React.useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        nameBn: product.nameBn,
        slug: product.slug,
        description: product.description,
        descriptionBn: product.descriptionBn,
        price: product.price,
        priceUnit: product.priceUnit,
        categoryId: product.categoryId,
        images: product.images || [],
        featured: product.featured,
        inStock: product.inStock,
        isActive: product.isActive,
      });
      setImageUrls(product.images || []);
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      await updateProduct.mutateAsync({
        id: productId,
        data: {
          ...data,
          images: imageUrls.length > 0 ? imageUrls : product?.images,
        },
      });
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleAddImageUrl = (url: string) => {
    if (url && url.trim()) {
      const newImages = [...imageUrls, url.trim()];
      setImageUrls(newImages);
      setValue('images', newImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImages);
    setValue('images', newImages);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Product not found</h2>
          <Button onClick={() => router.push('/admin/products')} className="mt-4">
            Back to Products
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-gray-500">{product.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input {...register('name')} placeholder="Product name" />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Name (Bengali)</Label>
                      <Input {...register('nameBn')} placeholder="পণ্যের নাম" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Slug *</Label>
                    <Input {...register('slug')} placeholder="product-slug" />
                    {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea 
                      {...register('description')} 
                      placeholder="Product description"
                      rows={4}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Description (Bengali)</Label>
                    <Textarea 
                      {...register('descriptionBn')} 
                      placeholder="বিবরণ"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input 
                        type="number" 
                        {...register('price', { valueAsNumber: true })} 
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <select
                        {...register('priceUnit')}
                        className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                      >
                        <option value="">Select unit</option>
                        <option value="KG">Kilogram (KG)</option>
                        <option value="GRAM">Gram</option>
                        <option value="TON">Ton</option>
                        <option value="LITRE">Litre</option>
                        <option value="ML">Millilitre (ML)</option>
                        <option value="PIECE">Piece</option>
                        <option value="UNIT">Unit</option>
                        <option value="BAG">Bag</option>
                        <option value="BOX">Box</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <select
                      {...register('categoryId')}
                      className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                    >
                      <option value="">Select category</option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.type})
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add Image URL</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        id="imageUrl"
                        className="flex-1"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById('imageUrl') as HTMLInputElement;
                          if (input?.value) {
                            handleAddImageUrl(input.value);
                            input.value = '';
                          }
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={url} 
                            alt={`Image ${index + 1}`} 
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="inStock"
                      {...register('inStock')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      {...register('featured')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="featured">Featured Product</Label>
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
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={updateProduct.isPending}
                >
                  {updateProduct.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Update Product
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
