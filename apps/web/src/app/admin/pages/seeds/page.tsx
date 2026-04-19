'use client';

import * as React from 'react';
import { Loader2, Save, Leaf, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { usePageConfig, useUpdatePageConfig, AVAILABLE_PAGES } from '@/hooks/use-page-config';

interface Props {
  params: { pageName: string };
}

export default function SeedsPageConfig({ params }: Props) {
  const pageName = 'seeds';
  const pageTitle = 'Seeds';
  const { data: config, isLoading, error } = usePageConfig(pageName);
  const updateConfig = useUpdatePageConfig();
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
                <Label>Hero Image URL</Label>
                <Input
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  placeholder="Enter image URL or leave empty for default"
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
      </div>
    </AdminLayout>
  );
}