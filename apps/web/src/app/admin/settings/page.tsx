'use client';

import * as React from 'react';
import { Loader2, Save } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const settingsSchema = z.object({
  siteName: z.string().min(2, 'Site name must be at least 2 characters'),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  facebookUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  youtubeUrl: z.string().url().optional().or(z.literal('')),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: 'SQ Agriculture',
      siteDescription: 'Your trusted partner for quality agricultural products',
      contactEmail: 'agriculture@sq-bd.com',
      contactPhone: '+880 1321-219223',
      contactAddress: '9th Floor, Suvastu Suraiya Trade Center, 57 Kemal Ataturk Avenue, Banani, Dhaka-1213',
      facebookUrl: '',
      twitterUrl: '',
      youtubeUrl: '',
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your application settings</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic information about your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Site Name *</Label>
                <Input {...register('siteName')} placeholder="Your site name" />
                {errors.siteName && <p className="text-red-500 text-sm">{errors.siteName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Site Description</Label>
                <Input {...register('siteDescription')} placeholder="Brief description" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How customers can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" {...register('contactEmail')} placeholder="email@example.com" />
                  {errors.contactEmail && <p className="text-red-500 text-sm">{errors.contactEmail.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input {...register('contactPhone')} placeholder="+880 1XXX-XXXXXX" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input {...register('contactAddress')} placeholder="Your address" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Your social media profile links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input {...register('facebookUrl')} placeholder="https://facebook.com/..." />
                {errors.facebookUrl && <p className="text-red-500 text-sm">{errors.facebookUrl.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Twitter URL</Label>
                <Input {...register('twitterUrl')} placeholder="https://twitter.com/..." />
                {errors.twitterUrl && <p className="text-red-500 text-sm">{errors.twitterUrl.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input {...register('youtubeUrl')} placeholder="https://youtube.com/..." />
                {errors.youtubeUrl && <p className="text-red-500 text-sm">{errors.youtubeUrl.message}</p>}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : saved ? (
                <span className="text-green-600">Saved!</span>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
