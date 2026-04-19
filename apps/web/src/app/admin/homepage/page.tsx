'use client';

import * as React from 'react';
import { Save, Loader2, Upload, X, Plus, GripVertical, Play, Youtube } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useHomepageConfig, useUpdateHomepageConfig, type HeroSlide, type Feature, type VideoUrl, type Stat, type SliderCategory } from '@/hooks/use-homepage';
import { useCategories } from '@/hooks/use-categories';
import { api } from '@/lib/api';

const DEFAULT_FEATURES: Feature[] = [
  { icon: 'Leaf', title: 'Premium Quality Seeds', description: 'High-yielding varieties developed for Bangladesh climate' },
  { icon: 'Shield', title: 'Crop Protection', description: 'Effective solutions for pest and disease management' },
  { icon: 'Truck', title: 'Nationwide Delivery', description: 'Products available across all 64 districts' },
  { icon: 'Sprout', title: 'Expert Support', description: 'Agricultural specialists ready to assist farmers' },
];

const DEFAULT_STATS: Stat[] = [
  { value: 500, label: 'Products', suffix: '+' },
  { value: 10000, label: 'Happy Farmers', suffix: '+' },
  { value: 64, label: 'Districts', suffix: '' },
  { value: 15, label: 'Years Experience', suffix: '+' },
];

export default function AdminHomepagePage() {
  const { data: config, isLoading, refetch } = useHomepageConfig();
  const { data: categories } = useCategories();
  const updateConfig = useUpdateHomepageConfig();

  const [activeTab, setActiveTab] = React.useState('hero');

  const [formData, setFormData] = React.useState({
    heroTitle: '',
    heroSubtitle: '',
    heroSlides: [] as HeroSlide[],
    heroUseCategories: false,
    sliderCategories: [] as SliderCategory[],
    features: DEFAULT_FEATURES,
    videoEnabled: true,
    videoTitle: '',
    videoSubtitle: '',
    videoPlaylistId: '',
    videoUrls: [] as VideoUrl[],
    stats: DEFAULT_STATS,
    ctaTitle: '',
    ctaSubtitle: '',
    ctaButtonText: '',
    ctaButtonLink: '',
  });

  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (config) {
      setFormData({
        heroTitle: config.heroTitle || '',
        heroSubtitle: config.heroSubtitle || '',
        heroSlides: config.heroSlides || [],
        heroUseCategories: config.heroUseCategories || false,
        sliderCategories: config.sliderCategories || [],
        features: config.features?.length ? config.features : DEFAULT_FEATURES,
        videoEnabled: config.videoEnabled ?? true,
        videoTitle: config.videoTitle || '',
        videoSubtitle: config.videoSubtitle || '',
        videoPlaylistId: config.videoPlaylistId || '',
        videoUrls: config.videoUrls || [],
        stats: config.stats?.length ? config.stats : DEFAULT_STATS,
        ctaTitle: config.ctaTitle || '',
        ctaSubtitle: config.ctaSubtitle || '',
        ctaButtonText: config.ctaButtonText || '',
        ctaButtonLink: config.ctaButtonLink || '',
      });
    }
  }, [config]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateConfig.mutateAsync(formData as any);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      refetch();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addHeroSlide = () => {
    setFormData(prev => ({
      ...prev,
      heroSlides: [...prev.heroSlides, { image: '', title: '', subtitle: '', ctaText: '', ctaLink: '' }]
    }));
  };

  const updateHeroSlide = (index: number, field: keyof HeroSlide, value: string) => {
    setFormData(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.map((slide, i) => 
        i === index ? { ...slide, [field]: value } : slide
      )
    }));
  };

  const removeHeroSlide = (index: number) => {
    setFormData(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((_, i) => i !== index)
    }));
  };

  const addVideoUrl = () => {
    setFormData(prev => ({
      ...prev,
      videoUrls: [...prev.videoUrls, { url: '', title: '' }]
    }));
  };

  const updateVideoUrl = (index: number, field: keyof VideoUrl, value: string) => {
    setFormData(prev => ({
      ...prev,
      videoUrls: prev.videoUrls.map((video, i) => 
        i === index ? { ...video, [field]: value } : video
      )
    }));
  };

  const removeVideoUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videoUrls: prev.videoUrls.filter((_, i) => i !== index)
    }));
  };

  const addSliderCategory = (categoryId: string) => {
    if (formData.sliderCategories.find(c => c.categoryId === categoryId)) return;
    setFormData(prev => ({
      ...prev,
      sliderCategories: [...prev.sliderCategories, { categoryId, order: prev.sliderCategories.length }]
    }));
  };

  const removeSliderCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      sliderCategories: prev.sliderCategories.filter(c => c.categoryId !== categoryId)
    }));
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.map((stat, i) => 
        i === index ? { ...stat, [field]: field === 'value' ? parseInt(value) || 0 : value } : stat
      )
    }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const availableCategories = categories?.filter(c => 
    !formData.sliderCategories.find(sc => sc.categoryId === c.id)
  ) || [];

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Homepage Configuration</h1>
            <p className="text-gray-600">Manage your homepage content and settings</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="slider">Product Slider</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="cta">CTA</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Configure the hero section at the top of your homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Hero Title</Label>
                    <Input 
                      value={formData.heroTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, heroTitle: e.target.value }))}
                      placeholder="Transform Your Farm with Quality Seeds"
                    />
                  </div>
                  <div>
                    <Label>Hero Subtitle</Label>
                    <Input 
                      value={formData.heroSubtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                      placeholder="Your trusted partner for agricultural excellence"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch 
                    checked={formData.heroUseCategories}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, heroUseCategories: checked }))}
                  />
                  <Label>Use category images instead of uploaded images</Label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Hero Slides</Label>
                    <Button variant="outline" size="sm" onClick={addHeroSlide}>
                      <Plus className="w-4 h-4 mr-1" /> Add Slide
                    </Button>
                  </div>
                  
                  {formData.heroSlides.length === 0 ? (
                    <p className="text-gray-500 text-sm">No slides added. Click "Add Slide" to create one.</p>
                  ) : (
                    <div className="space-y-4">
                      {formData.heroSlides.map((slide, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">Image URL</Label>
                                <Input 
                                  value={slide.image}
                                  onChange={(e) => updateHeroSlide(index, 'image', e.target.value)}
                                  placeholder="/uploads/hero1.jpg"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Or Select Category</Label>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                  value={slide.categoryId || ''}
                                  onChange={(e) => updateHeroSlide(index, 'categoryId', e.target.value)}
                                >
                                  <option value="">Select category image...</option>
                                  {categories?.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Label className="text-xs">Title</Label>
                                <Input 
                                  value={slide.title}
                                  onChange={(e) => updateHeroSlide(index, 'title', e.target.value)}
                                  placeholder="Premium Seeds"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Subtitle</Label>
                                <Input 
                                  value={slide.subtitle}
                                  onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                                  placeholder="High yielding varieties"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Button Text</Label>
                                <Input 
                                  value={slide.ctaText}
                                  onChange={(e) => updateHeroSlide(index, 'ctaText', e.target.value)}
                                  placeholder="Shop Now"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Button Link</Label>
                                <Input 
                                  value={slide.ctaLink}
                                  onChange={(e) => updateHeroSlide(index, 'ctaLink', e.target.value)}
                                  placeholder="/products"
                                />
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeHeroSlide(index)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="slider" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Slider</CardTitle>
                <CardDescription>Select categories to display in the product slider section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Add Category to Slider</Label>
                  <div className="flex gap-2 mt-2">
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value=""
                      onChange={(e) => addSliderCategory(e.target.value)}
                    >
                      <option value="">Select a category...</option>
                      {availableCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Selected Categories ({formData.sliderCategories.length})</Label>
                  <div className="mt-2 space-y-2">
                    {formData.sliderCategories.length === 0 ? (
                      <p className="text-gray-500 text-sm">No categories selected. Add some above.</p>
                    ) : (
                      formData.sliderCategories.map((sc, index) => {
                        const category = categories?.find(c => c.id === sc.categoryId);
                        return (
                          <Card key={sc.categoryId} className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{index + 1}. {category?.name || 'Unknown'}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeSliderCategory(sc.categoryId)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Features Section</CardTitle>
                <CardDescription>Configure the four feature cards below the product slider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.features.map((feature, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs">Icon Name</Label>
                        <Input 
                          value={feature.icon}
                          onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                          placeholder="Leaf"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Title</Label>
                        <Input 
                          value={feature.title}
                          onChange={(e) => updateFeature(index, 'title', e.target.value)}
                          placeholder="Premium Quality Seeds"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Input 
                          value={feature.description}
                          onChange={(e) => updateFeature(index, 'description', e.target.value)}
                          placeholder="High-yielding varieties"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Section</CardTitle>
                <CardDescription>Configure the video section (YouTube playlist or custom videos)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={formData.videoEnabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, videoEnabled: checked }))}
                  />
                  <Label>Enable video section</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Section Title</Label>
                    <Input 
                      value={formData.videoTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, videoTitle: e.target.value }))}
                      placeholder="Watch Our Video"
                    />
                  </div>
                  <div>
                    <Label>Section Subtitle</Label>
                    <Input 
                      value={formData.videoSubtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, videoSubtitle: e.target.value }))}
                      placeholder="Learn more about SQ Agriculture"
                    />
                  </div>
                </div>

                <div>
                  <Label>YouTube Playlist ID (optional)</Label>
                  <Input 
                    value={formData.videoPlaylistId}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoPlaylistId: e.target.value }))}
                    placeholder="PL..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter a YouTube playlist ID to automatically pull videos</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Custom Video URLs</Label>
                    <Button variant="outline" size="sm" onClick={addVideoUrl}>
                      <Plus className="w-4 h-4 mr-1" /> Add Video
                    </Button>
                  </div>
                  
                  {formData.videoUrls.length === 0 && !formData.videoPlaylistId ? (
                    <p className="text-gray-500 text-sm">Add a YouTube playlist ID above or add custom videos below.</p>
                  ) : (
                    <div className="space-y-4">
                      {formData.videoUrls.map((video, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">Video URL (YouTube embed)</Label>
                                <Input 
                                  value={video.url}
                                  onChange={(e) => updateVideoUrl(index, 'url', e.target.value)}
                                  placeholder="https://www.youtube.com/embed/..."
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Title</Label>
                                <Input 
                                  value={video.title}
                                  onChange={(e) => updateVideoUrl(index, 'title', e.target.value)}
                                  placeholder="Product Introduction"
                                />
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeVideoUrl(index)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistics Section</CardTitle>
                <CardDescription>Configure the numbers displayed on your homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.stats.map((stat, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs">Value</Label>
                        <Input 
                          type="number"
                          value={stat.value}
                          onChange={(e) => updateStat(index, 'value', e.target.value)}
                          placeholder="500"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Label</Label>
                        <Input 
                          value={stat.label}
                          onChange={(e) => updateStat(index, 'label', e.target.value)}
                          placeholder="Products"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Suffix (optional)</Label>
                        <Input 
                          value={stat.suffix}
                          onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                          placeholder="+"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cta" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Call to Action Section</CardTitle>
                <CardDescription>Configure the final CTA section before the footer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>CTA Title</Label>
                  <Input 
                    value={formData.ctaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, ctaTitle: e.target.value }))}
                    placeholder="Ready to Transform Your Farm?"
                  />
                </div>
                <div>
                  <Label>CTA Subtitle</Label>
                  <Input 
                    value={formData.ctaSubtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, ctaSubtitle: e.target.value }))}
                    placeholder="Get in touch with our agricultural experts today"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Button Text</Label>
                    <Input 
                      value={formData.ctaButtonText}
                      onChange={(e) => setFormData(prev => ({ ...prev, ctaButtonText: e.target.value }))}
                      placeholder="Contact Us"
                    />
                  </div>
                  <div>
                    <Label>Button Link</Label>
                    <Input 
                      value={formData.ctaButtonLink}
                      onChange={(e) => setFormData(prev => ({ ...prev, ctaButtonLink: e.target.value }))}
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}