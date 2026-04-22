'use client';

import * as React from 'react';
import { Loader2, Save, Plus, Trash2, ChevronDown, ChevronUp, Eye, Wrench, Package, Clock, MapPin, Phone, MessageCircle, Mail, Check, X } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useServiceSettings, useUpdateServiceSettings, ServiceFeature, ServiceCenter } from '@/hooks/use-service-settings';

export default function AdminServiceSparePartsPage() {
  const { data: settings, isLoading } = useServiceSettings();
  const updateSettings = useUpdateServiceSettings();
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);

  const [formData, setFormData] = React.useState({
    hotlinePhone: '',
    whatsapp: '',
    email: '',
    isActive: true,
    heroTitle: '',
    heroTitleBn: '',
    heroSubtitle: '',
    heroSubtitleBn: '',
    lubricantsTitle: '',
    lubricantsTitleBn: '',
    lubricantsDescription: '',
    lubricantsDescriptionBn: '',
    lubricantsEnabled: true,
    sparePartsTitle: '',
    sparePartsTitleBn: '',
    sparePartsDescription: '',
    sparePartsDescriptionBn: '',
    sparePartsEnabled: true,
    serviceTitle: '',
    serviceTitleBn: '',
    serviceDescription: '',
    serviceDescriptionBn: '',
    serviceEnabled: true,
    serviceFeatures: [] as ServiceFeature[],
    serviceCenters: [] as ServiceCenter[],
  });

  React.useEffect(() => {
    if (settings) {
      setFormData({
        hotlinePhone: settings.hotlinePhone || '',
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        isActive: settings.isActive ?? true,
        heroTitle: settings.heroTitle || '',
        heroTitleBn: settings.heroTitleBn || '',
        heroSubtitle: settings.heroSubtitle || '',
        heroSubtitleBn: settings.heroSubtitleBn || '',
        lubricantsTitle: settings.lubricantsTitle || '',
        lubricantsTitleBn: settings.lubricantsTitleBn || '',
        lubricantsDescription: settings.lubricantsDescription || '',
        lubricantsDescriptionBn: settings.lubricantsDescriptionBn || '',
        lubricantsEnabled: settings.lubricantsEnabled ?? true,
        sparePartsTitle: settings.sparePartsTitle || '',
        sparePartsTitleBn: settings.sparePartsTitleBn || '',
        sparePartsDescription: settings.sparePartsDescription || '',
        sparePartsDescriptionBn: settings.sparePartsDescriptionBn || '',
        sparePartsEnabled: settings.sparePartsEnabled ?? true,
        serviceTitle: settings.serviceTitle || '',
        serviceTitleBn: settings.serviceTitleBn || '',
        serviceDescription: settings.serviceDescription || '',
        serviceDescriptionBn: settings.serviceDescriptionBn || '',
        serviceEnabled: settings.serviceEnabled ?? true,
        serviceFeatures: settings.serviceFeatures || [],
        serviceCenters: settings.serviceCenters || [],
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings.mutateAsync(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      serviceFeatures: [
        ...formData.serviceFeatures,
        { title: '', titleBn: '', enabled: true }
      ]
    });
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      serviceFeatures: formData.serviceFeatures.filter((_, i) => i !== index)
    });
  };

  const handleUpdateFeature = (index: number, field: keyof ServiceFeature, value: any) => {
    const updated = [...formData.serviceFeatures];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, serviceFeatures: updated });
  };

  const handleAddCenter = () => {
    setFormData({
      ...formData,
      serviceCenters: [
        ...formData.serviceCenters,
        { city: '', cityBn: '', area: '', areaBn: '', description: '', descriptionBn: '', enabled: true }
      ]
    });
  };

  const handleRemoveCenter = (index: number) => {
    setFormData({
      ...formData,
      serviceCenters: formData.serviceCenters.filter((_, i) => i !== index)
    });
  };

  const handleUpdateCenter = (index: number, field: keyof ServiceCenter, value: any) => {
    const updated = [...formData.serviceCenters];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, serviceCenters: updated });
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
            <h1 className="text-2xl font-bold">Service & Spare Parts Content</h1>
            <p className="text-gray-500">Manage content for the Service & Spare Parts page</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? <Eye className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : saved ? (
                <><Check className="w-4 h-4 mr-2" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save All Settings</>
              )}
            </Button>
          </div>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold">{formData.heroTitle || 'Hero Title'}</h2>
                <p className="text-slate-200 mt-2">{formData.heroSubtitle || 'Hero subtitle...'}</p>
              </div>
              <div className="grid grid-cols-3 mt-4">
                <div className="bg-yellow-500 text-white p-4 text-center font-semibold rounded-t">
                  <Wrench className="w-6 h-6 mx-auto mb-2" />
                  {formData.lubricantsTitle || 'SQ Lubricants'}
                </div>
                <div className="bg-orange-500 text-white p-4 text-center font-semibold rounded-t">
                  <Package className="w-6 h-6 mx-auto mb-2" />
                  {formData.sparePartsTitle || 'Spare Parts'}
                </div>
                <div className="bg-purple-700 text-white p-4 text-center font-semibold rounded-t">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  {formData.serviceTitle || 'Service 24X7'}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              Hero Section
            </CardTitle>
            <CardDescription>Configure the hero banner at the top of the page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hero Title (English)</Label>
                <Input
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="Service & Spare Parts"
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Title (Bengali)</Label>
                <Input
                  value={formData.heroTitleBn}
                  onChange={(e) => setFormData({ ...formData, heroTitleBn: e.target.value })}
                  placeholder="সেবা ও খুঁটি"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hero Subtitle (English)</Label>
                <Textarea
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  placeholder="Comprehensive after-sales support..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Subtitle (Bengali)</Label>
                <Textarea
                  value={formData.heroSubtitleBn}
                  onChange={(e) => setFormData({ ...formData, heroSubtitleBn: e.target.value })}
                  placeholder="আপনার কৃষি যন্ত্রপাতির জন্য..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SQ Lubricants Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              SQ Lubricants Section
            </CardTitle>
            <CardDescription>Configure the SQ Lubricants tab content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Enable Section</Label>
                <p className="text-sm text-gray-500">Show this section on the website</p>
              </div>
              <Switch
                checked={formData.lubricantsEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, lubricantsEnabled: checked })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Section Title (English)</Label>
                <Input
                  value={formData.lubricantsTitle}
                  onChange={(e) => setFormData({ ...formData, lubricantsTitle: e.target.value })}
                  placeholder="SQ Lubricants"
                />
              </div>
              <div className="space-y-2">
                <Label>Section Title (Bengali)</Label>
                <Input
                  value={formData.lubricantsTitleBn}
                  onChange={(e) => setFormData({ ...formData, lubricantsTitleBn: e.target.value })}
                  placeholder="এসকিউ লুব্রিকেন্টস"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Description (English)</Label>
                <Textarea
                  value={formData.lubricantsDescription}
                  onChange={(e) => setFormData({ ...formData, lubricantsDescription: e.target.value })}
                  placeholder="Premium quality lubricants..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Bengali)</Label>
                <Textarea
                  value={formData.lubricantsDescriptionBn}
                  onChange={(e) => setFormData({ ...formData, lubricantsDescriptionBn: e.target.value })}
                  placeholder="কৃষি যন্ত্রপাতির জন্য বিশেষভাবে তৈরি..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spare Parts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              Genuine Spare Parts Section
            </CardTitle>
            <CardDescription>Configure the Spare Parts tab content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Enable Section</Label>
                <p className="text-sm text-gray-500">Show this section on the website</p>
              </div>
              <Switch
                checked={formData.sparePartsEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, sparePartsEnabled: checked })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Section Title (English)</Label>
                <Input
                  value={formData.sparePartsTitle}
                  onChange={(e) => setFormData({ ...formData, sparePartsTitle: e.target.value })}
                  placeholder="Genuine Spare Parts"
                />
              </div>
              <div className="space-y-2">
                <Label>Section Title (Bengali)</Label>
                <Input
                  value={formData.sparePartsTitleBn}
                  onChange={(e) => setFormData({ ...formData, sparePartsTitleBn: e.target.value })}
                  placeholder="অরিজিনাল খুঁটি"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Description (English)</Label>
                <Textarea
                  value={formData.sparePartsDescription}
                  onChange={(e) => setFormData({ ...formData, sparePartsDescription: e.target.value })}
                  placeholder="Original equipment manufacturer spare parts..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Bengali)</Label>
                <Textarea
                  value={formData.sparePartsDescriptionBn}
                  onChange={(e) => setFormData({ ...formData, sparePartsDescriptionBn: e.target.value })}
                  placeholder="সমস্ত এসকিউ কৃষি যন্ত্রপাতির জন্য..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service 24X7 Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              On Call Service 24X7 Section
            </CardTitle>
            <CardDescription>Configure the Service 24X7 tab content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Enable Section</Label>
                <p className="text-sm text-gray-500">Show this section on the website</p>
              </div>
              <Switch
                checked={formData.serviceEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, serviceEnabled: checked })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Section Title (English)</Label>
                <Input
                  value={formData.serviceTitle}
                  onChange={(e) => setFormData({ ...formData, serviceTitle: e.target.value })}
                  placeholder="On Call Service 24X7"
                />
              </div>
              <div className="space-y-2">
                <Label>Section Title (Bengali)</Label>
                <Input
                  value={formData.serviceTitleBn}
                  onChange={(e) => setFormData({ ...formData, serviceTitleBn: e.target.value })}
                  placeholder="যেকোনো সময় সেবা ২৪X৭"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Description (English)</Label>
                <Textarea
                  value={formData.serviceDescription}
                  onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                  placeholder="Round-the-clock technical support..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Bengali)</Label>
                <Textarea
                  value={formData.serviceDescriptionBn}
                  onChange={(e) => setFormData({ ...formData, serviceDescriptionBn: e.target.value })}
                  placeholder="আপনার যন্ত্রপাতির জন্য ঘড়ি-বেজা প্রযুক্তিগত সহায়তা..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              Service Features List
            </CardTitle>
            <CardDescription>Manage the list of services offered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.serviceFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center h-10">
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={(checked) => handleUpdateFeature(index, 'enabled', checked)}
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={feature.title}
                      onChange={(e) => handleUpdateFeature(index, 'title', e.target.value)}
                      placeholder="Feature title (English)"
                    />
                    <Input
                      value={feature.titleBn}
                      onChange={(e) => handleUpdateFeature(index, 'titleBn', e.target.value)}
                      placeholder="Feature title (Bengali)"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddFeature} className="mt-3">
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Service Centers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              Service Centers
            </CardTitle>
            <CardDescription>Manage service center locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.serviceCenters.map((center, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">Service Center #{index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={center.enabled}
                        onCheckedChange={(checked) => handleUpdateCenter(index, 'enabled', checked)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleRemoveCenter(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">City (English)</Label>
                      <Input
                        value={center.city}
                        onChange={(e) => handleUpdateCenter(index, 'city', e.target.value)}
                        placeholder="Dhaka Service Center"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">City (Bengali)</Label>
                      <Input
                        value={center.cityBn}
                        onChange={(e) => handleUpdateCenter(index, 'cityBn', e.target.value)}
                        placeholder="ঢাকা সার্ভিস সেন্টার"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Area/Address (English)</Label>
                      <Input
                        value={center.area}
                        onChange={(e) => handleUpdateCenter(index, 'area', e.target.value)}
                        placeholder="Banani, Dhaka-1213"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Area/Address (Bengali)</Label>
                      <Input
                        value={center.areaBn}
                        onChange={(e) => handleUpdateCenter(index, 'areaBn', e.target.value)}
                        placeholder="বনানী, ঢাকা-১২১৩"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Description (English)</Label>
                      <Input
                        value={center.description}
                        onChange={(e) => handleUpdateCenter(index, 'description', e.target.value)}
                        placeholder="Primary service hub"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Description (Bengali)</Label>
                      <Input
                        value={center.descriptionBn}
                        onChange={(e) => handleUpdateCenter(index, 'descriptionBn', e.target.value)}
                        placeholder="প্রাথমিক সার্ভিস হাব"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddCenter}>
                <Plus className="w-4 h-4 mr-2" />
                Add Service Center
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              Contact Information
            </CardTitle>
            <CardDescription>Configure the 24/7 hotline contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Enable Service 24X7</Label>
                <p className="text-sm text-gray-500">Show service hotline on website</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-600" />
                  Hotline Phone
                </Label>
                <Input
                  value={formData.hotlinePhone}
                  onChange={(e) => setFormData({ ...formData, hotlinePhone: e.target.value })}
                  placeholder="+880 1321-219223"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  WhatsApp Number
                </Label>
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+8801321219223"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Service Email
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="service@sq-agriculture.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : saved ? (
              <><Check className="w-5 h-5 mr-2" /> Settings Saved!</>
            ) : (
              <><Save className="w-5 h-5 mr-2" /> Save All Settings</>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}