import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export interface UploadResponse {
  url: string;
  filename: string;
}

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadSingle = useCallback(async (file: File): Promise<UploadResponse | null> => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      const promise = new Promise<UploadResponse>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve({
              url: response.url || response.data?.url,
              filename: response.filename || file.name,
            });
          } else {
            reject(new Error(xhr.responseText || 'Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });
      });

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      
      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/uploads/single`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);

      const result = await promise;
      return result;
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const uploadMultiple = useCallback(async (files: File[]): Promise<UploadResponse[]> => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const results: UploadResponse[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/uploads/single`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        results.push({
          url: data.url || data.data?.url,
          filename: data.filename || file.name,
        });

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      return results;
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      return [];
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const uploadFromUrl = useCallback(async (url: string): Promise<UploadResponse | null> => {
    if (!url || !url.trim()) return null;
    
    try {
      const response = await api.post<any>('/api/v1/uploads/from-url', { url: url.trim() });
      return {
        url: response.url || response.data?.url || url.trim(),
        filename: url.split('/').pop() || 'image',
      };
    } catch (err) {
      return {
        url: url.trim(),
        filename: url.split('/').pop() || 'image',
      };
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadSingle,
    uploadMultiple,
    uploadFromUrl,
    isUploading,
    uploadProgress,
    error,
    resetError,
  };
}
