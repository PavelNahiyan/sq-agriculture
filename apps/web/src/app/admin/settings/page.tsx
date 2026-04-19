'use client';

import * as React from 'react';
import { Loader2, Save, MessageCircle, Facebook, Mail, MessageSquare } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useFloatingButtonSettings, useUpdateFloatingButton } from '@/hooks/use-floating-button';

export default function AdminSettingsPage() {
  const { data: floatingSettings, isLoading: loadingFloating } = useFloatingButtonSettings();
  const updateFloatingButton = useUpdateFloatingButton();
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const [floatingData, setFloatingData] = React.useState({
    whatsapp: '',
    facebook: '',
    email: '',
    isEnabled: true,
    showWhatsapp: true,
    showFacebook: true,
    showEmail: true,
    position: 'bottom-right',
  });

  React.useEffect(() => {
    if (floatingSettings) {
      setFloatingData({
        whatsapp: floatingSettings.whatsapp || '',
        facebook: floatingSettings.facebook || '',
        email: floatingSettings.email || '',
        isEnabled: floatingSettings.isEnabled ?? true,
        showWhatsapp: floatingSettings.showWhatsapp ?? true,
        showFacebook: floatingSettings.showFacebook ?? true,
        showEmail: floatingSettings.showEmail ?? true,
        position: floatingSettings.position || 'bottom-right',
      });
    }
  }, [floatingSettings]);

  const handleSaveFloating = async () => {
    setIsSaving(true);
    try {
      await updateFloatingButton.mutateAsync(floatingData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingFloating) {
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
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your application settings</p>
        </div>

        {/* Floating Contact Button Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Floating Contact Button
            </CardTitle>
            <CardDescription>Configure the floating contact button that appears on all pages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Enable Floating Button</Label>
                <p className="text-sm text-gray-500">Show the floating contact button on your website</p>
              </div>
              <Switch
                checked={floatingData.isEnabled}
                onCheckedChange={(checked) => setFloatingData({ ...floatingData, isEnabled: checked })}
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label>Button Position</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={floatingData.position}
                onChange={(e) => setFloatingData({ ...floatingData, position: e.target.value })}
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>

            {/* WhatsApp */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <Label className="text-base">WhatsApp</Label>
                </div>
                <Switch
                  checked={floatingData.showWhatsapp}
                  onCheckedChange={(checked) => setFloatingData({ ...floatingData, showWhatsapp: checked })}
                />
              </div>
              {floatingData.showWhatsapp && (
                <Input
                  placeholder="WhatsApp number (e.g., +8801321219223)"
                  value={floatingData.whatsapp}
                  onChange={(e) => setFloatingData({ ...floatingData, whatsapp: e.target.value })}
                />
              )}
            </div>

            {/* Facebook */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Facebook className="w-5 h-5 text-[#1877F2]" />
                  <Label className="text-base">Facebook</Label>
                </div>
                <Switch
                  checked={floatingData.showFacebook}
                  onCheckedChange={(checked) => setFloatingData({ ...floatingData, showFacebook: checked })}
                />
              </div>
              {floatingData.showFacebook && (
                <Input
                  placeholder="Facebook page URL"
                  value={floatingData.facebook}
                  onChange={(e) => setFloatingData({ ...floatingData, facebook: e.target.value })}
                />
              )}
            </div>

            {/* Email */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#2D5A27]" />
                  <Label className="text-base">Email</Label>
                </div>
                <Switch
                  checked={floatingData.showEmail}
                  onCheckedChange={(checked) => setFloatingData({ ...floatingData, showEmail: checked })}
                />
              </div>
              {floatingData.showEmail && (
                <Input
                  type="email"
                  placeholder="Email address"
                  value={floatingData.email}
                  onChange={(e) => setFloatingData({ ...floatingData, email: e.target.value })}
                />
              )}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSaveFloating} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <span className="text-green-600 mr-2">✓</span>
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Floating Button Settings
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}