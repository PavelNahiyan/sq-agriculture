'use client';

import * as React from 'react';
import { Upload, Trash2, Folder } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function MediaManagerPage() {
  const queryClient = useQueryClient();
  const [selectedFolder, setSelectedFolder] = React.useState('images');
  const [uploading, setUploading] = React.useState(false);
  const [uploadResult, setUploadResult] = React.useState<string | null>(null);

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['media', selectedFolder],
    queryFn: async () => {
      const response: any = await api.get(`/uploads/media/browse?folder=${selectedFolder}`);
      return response.data as Array<{ name: string; path: string; fullPath: string }>;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      setUploading(true);
      const response: any = await api.upload('/uploads/single', formData);
      return response.data;
    },
    onSuccess: (data) => {
      setUploadResult(data.url);
      refetch();
      setUploading(false);
    },
    onError: () => setUploading(false),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', 'manual');
    uploadMutation.mutate(formData);
  };

  const handleDelete = async (filePath: string) => {
    if (!confirm('Delete this file?')) return;
    try {
      await api.delete(`/uploads/media?path=${encodeURIComponent(filePath)}`);
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const folders = ['images', 'images/covers', 'images/products/tractor', 'images/products/harvester', 'images/products/seed', 'images/services', 'images/gallery', 'images/blog'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Media Manager</h1>
            <p className="text-gray-500">Browse and manage all images</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">Upload New Image</h2>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="flex-1"
            />
            {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
          </div>
          {uploadResult && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <p className="text-sm text-green-800">Uploaded: {uploadResult}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {folders.map((folder) => (
            <Button
              key={folder}
              variant={selectedFolder === folder ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFolder(folder)}
            >
              <Folder className="w-4 h-4 mr-2" />
              {folder.replace('images/', '')}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files?.map((file) => (
              <div key={file.name} className="relative group border rounded-lg overflow-hidden">
                <img
                  src={file.path}
                  alt={file.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(file.fullPath)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-2 text-xs text-gray-600 truncate">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        )}

        {(!files || files.length === 0) && !isLoading && (
          <div className="text-center py-12 text-gray-500">
            No images found in this folder.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
