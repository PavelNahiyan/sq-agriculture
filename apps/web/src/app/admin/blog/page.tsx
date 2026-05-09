'use client';

import * as React from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from '@/hooks/use-blog';
import type { BlogPost } from '@/lib/shared-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const blogSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  featuredImage: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function AdminBlogPage() {
  const { data: posts, isLoading } = useBlogPosts();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      published: false,
      featured: false,
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    try {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
      };
      if (editingPost) {
        await updatePost.mutateAsync({ id: editingPost.id, data: payload });
      } else {
        await createPost.mutateAsync(payload);
      }
      setIsDialogOpen(false);
      setEditingPost(null);
      reset();
    } catch (error) {
      console.error('Failed to save blog post:', error);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      featuredImage: post.featuredImage,
      author: post.author,
      category: post.category,
      tags: post.tags?.join(', ') || '',
      published: post.published,
      featured: post.featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePost.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete blog post:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Blog Posts</h1>
            <p className="text-gray-500">Manage blog posts and articles</p>
          </div>
          <Button onClick={() => { setEditingPost(null); reset(); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Post
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Posts ({posts?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Title</th>
                      <th className="text-left py-3 px-4 font-medium">Author</th>
                      <th className="text-left py-3 px-4 font-medium">Category</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-b last:border-0">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{post.title}</p>
                            <p className="text-sm text-gray-500">{post.slug}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{post.author || '-'}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{post.category || 'Uncategorized'}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            {post.published && (
                              <Badge className="bg-green-100 text-green-700">Published</Badge>
                            )}
                            {post.featured && (
                              <Badge className="bg-yellow-100 text-yellow-700">Featured</Badge>
                            )}
                            {!post.published && (
                              <Badge variant="secondary">Draft</Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeleteConfirmId(post.id)}
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
                No blog posts found. Create your first post.
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit Post' : 'Add Post'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input {...register('title')} placeholder="Post title" />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input {...register('slug')} placeholder="post-slug" />
                  {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea {...register('excerpt')} placeholder="Brief excerpt..." rows={2} />
              </div>

              <div className="space-y-2">
                <Label>Content (HTML)</Label>
                <Textarea {...register('content')} placeholder="Post content..." rows={6} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input {...register('image')} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label>Featured Image URL</Label>
                  <Input {...register('featuredImage')} placeholder="https://..." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input {...register('author')} placeholder="Author name" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input {...register('category')} placeholder="Category" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input {...register('tags')} placeholder="tag1, tag2, tag3" />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="published" {...register('published')} className="rounded border-gray-300" />
                  <Label htmlFor="published">Published</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" {...register('featured')} className="rounded border-gray-300" />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createPost.isPending || updatePost.isPending}>
                  {createPost.isPending || updatePost.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {editingPost ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Post</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this blog post? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                disabled={deletePost.isPending}
              >
                {deletePost.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
