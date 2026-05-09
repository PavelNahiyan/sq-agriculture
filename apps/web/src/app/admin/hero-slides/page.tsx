'use client';

import * as React from 'react';
import { Plus, Edit, Trash2, Loader2, GripVertical, ImageOff, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { SingleImageUpload } from '@/components/ui/image-upload';
import { useAdminHeroSlides, useCreateHeroSlide, useUpdateHeroSlide, useDeleteHeroSlide, useReorderHeroSlides } from '@/hooks/use-hero-slides';
import type { HeroSlide } from '@/lib/shared-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const heroSlideSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  titleBn: z.string().optional(),
  subtitle: z.string().optional(),
  subtitleBn: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  mobileImage: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  overlayOpacity: z.number().min(0).max(1).default(0.4),
});

type HeroSlideFormData = z.infer<typeof heroSlideSchema>;

export default function AdminHeroSlidesPage() {
  const { data: slides, isLoading } = useAdminHeroSlides();
  const createSlide = useCreateHeroSlide();
  const updateSlide = useUpdateHeroSlide();
  const deleteSlide = useDeleteHeroSlide();
  const reorderSlides = useReorderHeroSlides();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingSlide, setEditingSlide] = React.useState<HeroSlide | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<HeroSlideFormData>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      order: 0,
      isActive: true,
      overlayOpacity: 0.4,
      backgroundColor: '#2D5016',
      textColor: '#FFFFFF',
    },
  });

  const watchImage = watch('image');

  const onSubmit = async (data: HeroSlideFormData) => {
    try {
      if (editingSlide) {
        await updateSlide.mutateAsync({ id: editingSlide.id, data });
      } else {
        await createSlide.mutateAsync(data);
      }
      setIsDialogOpen(false);
      setEditingSlide(null);
      reset();
    } catch (error) {
      console.error('Failed to save slide:', error);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    reset({
      title: slide.title,
      titleBn: slide.titleBn || '',
      subtitle: slide.subtitle || '',
      subtitleBn: slide.subtitleBn || '',
      image: slide.image,
      mobileImage: slide.mobileImage || '',
      ctaText: slide.ctaText || '',
      ctaLink: slide.ctaLink || '',
      order: slide.order,
      isActive: slide.isActive,
      backgroundColor: slide.backgroundColor || '#2D5016',
      textColor: slide.textColor || '#FFFFFF',
      overlayOpacity: slide.overlayOpacity ?? 0.4,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSlide.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete slide:', error);
    }
  };

  const moveSlide = (fromIndex: number, toIndex: number) => {
    if (!slides) return;
    const reordered = [...slides];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    reorderSlides.mutate(reordered.map(s => s.id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hero Slides</h1>
            <p className="text-gray-500">Manage homepage hero slider slides and CTAs</p>
          </div>
          <Button onClick={() => { setEditingSlide(null); reset({ order: slides?.length || 0, isActive: true, overlayOpacity: 0.4, backgroundColor: '#2D5016', textColor: '#FFFFFF' }); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Slide
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Slides ({slides?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : slides && slides.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="w-10" />
                      <th className="w-20" />
                      <th className="text-left py-3 px-4 font-medium">Title</th>
                      <th className="text-left py-3 px-4 font-medium">Subtitle / CTA</th>
                      <th className="text-left py-3 px-4 font-medium">Order</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slides.map((slide, index) => (
                      <tr key={slide.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-2 px-2">
                          <button
                            className="cursor-grab text-gray-400 hover:text-gray-600"
                            onDragStart={() => setDragIndex(index)}
                            onDragOver={(e) => { e.preventDefault(); }}
                            onDrop={(e) => { e.preventDefault(); if (dragIndex !== null && dragIndex !== index) { moveSlide(dragIndex, index); setDragIndex(null); } }}
                            draggable
                          >
                            <GripVertical className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="py-2 px-2">
                          {slide.image ? (
                            <img
                              src={slide.image}
                              alt={slide.title}
                              className="w-14 h-10 rounded object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-14 h-10 rounded bg-gray-100 flex items-center justify-center">
                              <ImageOff className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{slide.title}</p>
                            {slide.titleBn && <p className="text-sm text-gray-500">{slide.titleBn}</p>}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            {slide.subtitle && <p className="text-gray-600 truncate max-w-xs">{slide.subtitle}</p>}
                            {slide.ctaText && (
                              <p className="text-primary text-xs mt-0.5">
                                CTA: {slide.ctaText} → {slide.ctaLink}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{slide.order}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          {slide.isActive ? (
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(slide)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeleteConfirmId(slide.id)}
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
                No hero slides found. Create your first slide.
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSlide ? 'Edit Slide' : 'Add Slide'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input {...register('title')} placeholder="Slide title" />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Title (Bengali)</Label>
                  <Input {...register('titleBn')} placeholder="শিরোনাম" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input {...register('subtitle')} placeholder="Slide subtitle" />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle (Bengali)</Label>
                  <Input {...register('subtitleBn')} placeholder="উপশিরোনাম" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image *</Label>
                <SingleImageUpload
                  value={watchImage}
                  onChange={(url) => setValue('image', url, { shouldValidate: true })}
                />
                {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Mobile Image (optional)</Label>
                <SingleImageUpload
                  value={watch('mobileImage')}
                  onChange={(url) => setValue('mobileImage', url)}
                  placeholder="Optional mobile-specific image"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Input {...register('ctaText')} placeholder="e.g. Explore Products" />
                </div>
                <div className="space-y-2">
                  <Label>CTA Link</Label>
                  <Input {...register('ctaLink')} placeholder="e.g. /products" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Order</Label>
                  <Input type="number" {...register('order', { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Overlay Opacity</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    {...register('overlayOpacity', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2 flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={watch('backgroundColor') || '#2D5016'}
                      onChange={(e) => setValue('backgroundColor', e.target.value)}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input {...register('backgroundColor')} placeholder="#2D5016" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={watch('textColor') || '#FFFFFF'}
                      onChange={(e) => setValue('textColor', e.target.value)}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input {...register('textColor')} placeholder="#FFFFFF" />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createSlide.isPending || updateSlide.isPending}>
                  {createSlide.isPending || updateSlide.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {editingSlide ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Slide</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this hero slide? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                disabled={deleteSlide.isPending}
              >
                {deleteSlide.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
