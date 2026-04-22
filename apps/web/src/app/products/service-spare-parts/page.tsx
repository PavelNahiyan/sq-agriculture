'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProducts } from '@/hooks/use-products';
import { useServiceSettings } from '@/hooks/use-service-settings';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { ArrowLeft, Phone, MessageCircle, Wrench, Package, Clock, MapPin, Check } from 'lucide-react';

const TabsRoot = TabsPrimitive.Root;
const TabsList = TabsPrimitive.List;
const TabsTrigger = TabsPrimitive.Trigger;
const TabsContent = TabsPrimitive.Content;

export default function ServiceSparePartsPage() {
  const { data: lubricants, isLoading: lubricantsLoading } = useProducts({ categoryType: 'LUBRICANTS', limit: 50 });
  const { data: spareParts, isLoading: sparePartsLoading } = useProducts({ categoryType: 'SPARE_PARTS', limit: 50 });
  const { data: serviceSettings } = useServiceSettings();

  const lubricantsProducts = lubricants || [];
  const sparePartsProducts = spareParts || [];
  
  const hotlinePhone = serviceSettings?.hotlinePhone || '+880 1321-219223';
  const whatsappNumber = serviceSettings?.whatsapp || '8801321219223';
  const serviceEmail = serviceSettings?.email || 'service@sq-agriculture.com';
  const isServiceActive = serviceSettings?.isActive ?? true;

  // Hero Section
  const heroTitle = serviceSettings?.heroTitle || 'Service & Spare Parts';
  const heroSubtitle = serviceSettings?.heroSubtitle || 'Comprehensive after-sales support for your agricultural machinery. Genuine parts, expert service, 24/7 support.';

  // Lubricants Section
  const lubricantsTitle = serviceSettings?.lubricantsTitle || 'SQ Lubricants';
  const lubricantsDescription = serviceSettings?.lubricantsDescription || 'Premium quality lubricants specially formulated for agricultural machinery.';
  const lubricantsEnabled = serviceSettings?.lubricantsEnabled ?? true;

  // Spare Parts Section
  const sparePartsTitle = serviceSettings?.sparePartsTitle || 'Genuine Spare Parts';
  const sparePartsDescription = serviceSettings?.sparePartsDescription || 'Original equipment manufacturer (OEM) spare parts for all SQ agricultural machinery.';
  const sparePartsEnabled = serviceSettings?.sparePartsEnabled ?? true;

  // Service Section
  const serviceTitle = serviceSettings?.serviceTitle || 'On Call Service 24X7';
  const serviceDescription = serviceSettings?.serviceDescription || 'Round-the-clock technical support and service for your machinery. Our expert team is always ready to assist you.';
  const serviceEnabled = serviceSettings?.serviceEnabled ?? true;

  // Service Features & Centers from settings
  const serviceFeatures = serviceSettings?.serviceFeatures || [
    { title: 'On-site repair and maintenance', titleBn: 'অন সাইট মেরামত ও রক্ষণাবেক্ষণ', enabled: true },
    { title: 'Regular service schedules', titleBn: 'নিয়মিত সার্ভিস সময়সূচী', enabled: true },
    { title: 'Technical troubleshooting', titleBn: 'প্রযুক্তিগত সমস্যা সমাধান', enabled: true },
    { title: 'Operator training support', titleBn: 'অপারেটর প্রশিক্ষণ সহায়তা', enabled: true },
    { title: 'Genuine parts replacement', titleBn: 'অরিজিনাল পার্টস প্রতিস্থাপন', enabled: true },
  ];

  const serviceCenters = serviceSettings?.serviceCenters || [
    { city: 'Dhaka Service Center', cityBn: 'ঢাকা সার্ভিস সেন্টার', area: 'Banani, Dhaka-1213', areaBn: 'বনানী, ঢাকা-১২১৩', description: 'Primary service hub', descriptionBn: 'প্রাথমিক সার্ভিস হাব', enabled: true },
    { city: 'Chittagong Service Center', cityBn: 'চট্টগ্রাম সার্ভিস সেন্টার', area: 'Agrabad, Chittagong', areaBn: 'আগ্রাবাদ, চট্টগ্রাম', description: 'Eastern region support', descriptionBn: 'পূর্বাঞ্চলীয় অঞ্চল সহায়তা', enabled: true },
    { city: 'Khulna Service Center', cityBn: 'খুলনা সার্ভিস সেন্টার', area: 'Khulna Sadar', areaBn: 'খুলনা সদর', description: 'Southwest region support', descriptionBn: 'দক্ষিণ-পশ্চিম অঞ্চল সহায়তা', enabled: true },
  ];

  const enabledFeatures = serviceFeatures.filter(f => f.enabled);
  const enabledCenters = serviceCenters.filter(c => c.enabled);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <Image 
              src="/uploads/covers/tractor covers.jpg" 
              alt="SQ Service & Spare Parts"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-700/80" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-slate-200 mb-6">
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                {lubricantsEnabled && (
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold" onClick={() => {
                    document.getElementById('lubricants-tab')?.click();
                  }}>
                    <Wrench className="w-5 h-5 mr-2" />
                    {lubricantsTitle}
                  </Button>
                )}
                {sparePartsEnabled && (
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold" onClick={() => {
                    document.getElementById('spare-parts-tab')?.click();
                  }}>
                    <Package className="w-5 h-5 mr-2" />
                    {sparePartsTitle}
                  </Button>
                )}
                {serviceEnabled && (
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold" onClick={() => {
                    document.getElementById('service-tab')?.click();
                  }}>
                    <Clock className="w-5 h-5 mr-2" />
                    {serviceTitle}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <TabsRoot defaultValue="lubricants" className="w-full" onValueChange={(value) => {
          const el = document.getElementById(value);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}>
          {/* Tab Navigation */}
          <div className="sticky top-16 md:top-20 z-40 bg-gray-50 border-b">
            <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full">
              {lubricantsEnabled && (
                <TabsTrigger 
                  id="lubricants-tab"
                  value="lubricants" 
                  className="data-[state=active]:!bg-yellow-600 data-[state=active]:!text-white px-6 py-4 text-base md:text-lg font-semibold flex items-center justify-center gap-2 bg-yellow-500 text-white hover:bg-yellow-600 transition-colors rounded-none"
                >
                  <Wrench className="w-6 h-6" />
                  {lubricantsTitle}
                </TabsTrigger>
              )}
              {sparePartsEnabled && (
                <TabsTrigger 
                  id="spare-parts-tab"
                  value="spare-parts" 
                  className="data-[state=active]:!bg-orange-600 data-[state=active]:!text-white px-6 py-4 text-base md:text-lg font-semibold flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors rounded-none"
                >
                  <Package className="w-6 h-6" />
                  {sparePartsTitle}
                </TabsTrigger>
              )}
              {serviceEnabled && (
                <TabsTrigger 
                  id="service-tab"
                  value="service" 
                  className="data-[state=active]:!bg-purple-700 data-[state=active]:!text-white px-6 py-4 text-base md:text-lg font-semibold flex items-center justify-center gap-2 bg-purple-800 text-white hover:bg-purple-700 transition-colors rounded-none"
                >
                  <Clock className="w-6 h-6" />
                  {serviceTitle}
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <div className="container mx-auto px-4 py-12">
            {/* SQ Lubricants Section */}
            {lubricantsEnabled && (
              <TabsContent value="lubricants" className="mt-0 outline-none">
                <section id="lubricants" className="py-8">
                  <div className="flex items-center gap-3 mb-8">
                    <Wrench className="w-10 h-10 text-yellow-600" />
                    <h2 className="text-3xl font-bold">{lubricantsTitle}</h2>
                  </div>
                  <p className="text-gray-600 mb-8 max-w-2xl">
                    {lubricantsDescription}
                  </p>

                  {lubricantsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
                      ))}
                    </div>
                  ) : lubricantsProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {lubricantsProducts.map(product => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                          <div className="relative h-48 bg-gray-100">
                            {product.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Wrench className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                            {product.featured && (
                              <span className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                            <p className="text-yellow-600 font-bold text-xl mb-3">
                              Price On Request
                            </p>
                            <Button asChild className="w-full">
                              <Link href={`/products/${product.slug}`}>View Details</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-yellow-50 rounded-lg border border-yellow-100">
                      <Wrench className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No lubricants available</h3>
                      <p className="text-gray-500">Check back soon for our product listings.</p>
                    </div>
                  )}
                </section>
              </TabsContent>
            )}

            {/* Spare Parts Section */}
            {sparePartsEnabled && (
              <TabsContent value="spare-parts" className="mt-0">
                <section id="spare-parts" className="py-8">
                  <div className="flex items-center gap-3 mb-8">
                    <Package className="w-10 h-10 text-orange-600" />
                    <h2 className="text-3xl font-bold">{sparePartsTitle}</h2>
                  </div>
                  <p className="text-gray-600 mb-8 max-w-2xl">
                    {sparePartsDescription}
                  </p>

                  {sparePartsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
                      ))}
                    </div>
                  ) : sparePartsProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {sparePartsProducts.map(product => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                          <div className="relative h-48 bg-gray-100">
                            {product.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                            {product.featured && (
                              <span className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                            <p className="text-orange-600 font-bold text-xl mb-3">
                              Price On Request
                            </p>
                            <Button asChild className="w-full">
                              <Link href={`/products/${product.slug}`}>View Details</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-orange-50 rounded-lg border border-orange-100">
                      <Package className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No spare parts available</h3>
                      <p className="text-gray-500">Check back soon for our spare parts listings.</p>
                    </div>
                  )}
                </section>
              </TabsContent>
            )}

            {/* Service 24X7 Section */}
            {serviceEnabled && (
              <TabsContent value="service" className="mt-0">
                <section id="service" className="py-8">
                  <div className="flex items-center gap-3 mb-8">
                    <Clock className="w-10 h-10 text-purple-700" />
                    <h2 className="text-3xl font-bold">{serviceTitle}</h2>
                  </div>
                  <p className="text-gray-600 mb-8 max-w-2xl">
                    {serviceDescription}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Card */}
                    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-900 to-purple-800 text-white">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                            <Phone className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">24/7 Hotline</h3>
                            <p className="text-purple-200 text-sm">Always available for emergencies</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <a href={`tel:${hotlinePhone.replace(/\D/g, '')}`} className="flex items-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                            <Phone className="w-6 h-6" />
                            <div>
                              <p className="font-medium">Phone</p>
                              <p className="text-purple-100">{hotlinePhone}</p>
                            </div>
                          </a>
                          <a href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-green-500/90 rounded-lg hover:bg-green-500 transition-colors">
                            <MessageCircle className="w-6 h-6" />
                            <div>
                              <p className="font-medium">WhatsApp</p>
                              <p className="text-white/90">{whatsappNumber}</p>
                            </div>
                          </a>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Service Features Card */}
                    <Card className="border-2 border-purple-200">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                            <Wrench className="w-7 h-7 text-purple-700" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">Service Features</h3>
                            <p className="text-gray-500 text-sm">What we offer</p>
                          </div>
                        </div>
                        <ul className="space-y-3">
                          {enabledFeatures.map((feature) => (
                            <li key={feature.title} className="flex items-center gap-3">
                              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                              <span>{feature.title}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Service Centers Card */}
                    {enabledCenters.length > 0 && (
                      <Card className="border-2 border-purple-200 md:col-span-2">
                        <CardContent className="p-8">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                              <MapPin className="w-7 h-7 text-purple-700" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">Service Centers</h3>
                              <p className="text-gray-500 text-sm">Authorized service points across Bangladesh</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {enabledCenters.map((center) => (
                              <div key={center.city} className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold mb-2">{center.city}</h4>
                                <p className="text-gray-600 text-sm">{center.area}</p>
                                <p className="text-gray-500 text-sm">{center.description}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-12 text-center">
                    <h3 className="text-2xl font-bold mb-6">Need Immediate Assistance?</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 px-8">
                        <a href={`tel:${hotlinePhone.replace(/\D/g, '')}`}>
                          <Phone className="w-5 h-5 mr-2" />
                          Call Now
                        </a>
                      </Button>
                      <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 px-8">
                        <a href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="w-5 h-5 mr-2" />
                          WhatsApp
                        </a>
                      </Button>
                      <Button asChild size="lg" variant="outline" className="px-8">
                        <Link href="/contact">
                          Contact Us
                        </Link>
                      </Button>
                    </div>
                  </div>
                </section>
              </TabsContent>
            )}
          </div>
        </TabsRoot>

        {/* Back to Products */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <Button asChild variant="outline">
              <Link href="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Products
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}