'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, Shield, Truck, Sprout, Tractor, Cog, Play, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ImageSlider, heroSlides } from '@/components/features/image-slider';
import { ProductCard, ProductCardSkeleton } from '@/components/features/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFeaturedProducts, useProducts } from '@/hooks/use-products';
import { useHomepageConfig } from '@/hooks/use-homepage';
import { useCategories } from '@/hooks/use-categories';
import { VideoPlayer } from '@/components/features/video-player';
import { StatsCounter } from '@/components/features/stats-counter';

const DEFAULT_FEATURES = [
  { icon: Leaf, title: 'Premium Quality Seeds', description: 'High-yielding varieties developed for Bangladesh climate' },
  { icon: Shield, title: 'Crop Protection', description: 'Effective solutions for pest and disease management' },
  { icon: Truck, title: 'Nationwide Delivery', description: 'Products available across all 64 districts' },
  { icon: Sprout, title: 'Expert Support', description: 'Agricultural specialists ready to assist farmers' },
];

const DEFAULT_STATS = [
  { value: 500, label: 'Products', suffix: '+' },
  { value: 10000, label: 'Happy Farmers', suffix: '+' },
  { value: 64, label: 'Districts', suffix: '' },
  { value: 15, label: 'Years Experience', suffix: '+' },
];

export default function HomePage() {
  const { data: homepageConfig, isLoading: configLoading } = useHomepageConfig();
  const { data: featuredProducts, isLoading } = useFeaturedProducts();
  const { data: allProducts } = useProducts();
  const { data: categories } = useCategories();

  const machineryProducts = allProducts?.filter(p => 
    p.category?.type === 'MACHINERY' || 
    p.name.toLowerCase().includes('tractor')
  ).slice(0, 4) || [];

  const features = homepageConfig?.features?.length ? homepageConfig.features : DEFAULT_FEATURES;
  const stats = homepageConfig?.stats?.length ? homepageConfig.stats : DEFAULT_STATS;
  const videoEnabled = homepageConfig?.videoEnabled ?? true;
  const videoTitle = homepageConfig?.videoTitle || 'Watch Our Video';
  const videoSubtitle = homepageConfig?.videoSubtitle || 'Learn more about SQ Agriculture';
  const videoPlaylistId = homepageConfig?.videoPlaylistId;
  const videoUrls = homepageConfig?.videoUrls || [];

  const getCategoryImage = (categoryId: string) => {
    const category = categories?.find(c => c.id === categoryId);
    return category?.image || '';
  };

  const getSliderCategories = (): { id: string; name: string; image: string; slug: string }[] => {
    if (!homepageConfig?.sliderCategories?.length && !categories) {
      return [
        { id: 'seeds', name: 'Seeds', image: '/uploads/products/Seeds.png', slug: 'seeds' },
        { id: 'fertilizers', name: 'Fertilizers & Micronutrients', image: '/uploads/products/SQ Fertilizer.png', slug: 'fertilizers-micronutrients' },
        { id: 'pesticides', name: 'Pesticides', image: '/uploads/products/pesticide/Dtuch.png', slug: 'pesticide' },
        { id: 'machinery', name: 'Field Machinery', image: '/uploads/products/machinery/TT47.png', slug: 'field-machinery' },
        { id: 'preowned', name: 'Pre-Owned Machines', image: '/uploads/products/machinery/TT47.png', slug: 'pre-owned-machines' },
        { id: 'all', name: 'All Products', image: '/uploads/products/Seeds.png', slug: 'products' },
      ];
    }
    
    if (homepageConfig?.heroUseCategories && categories) {
      return homepageConfig.sliderCategories
        .sort((a, b) => a.order - b.order)
        .map(sc => {
          const cat = categories.find(c => c.id === sc.categoryId);
          return cat ? { id: cat.id, name: cat.name, image: cat.image || '', slug: cat.slug } : null;
        })
        .filter((c): c is { id: string; name: string; image: string; slug: string } => c !== null);
    }

    return categories?.slice(0, 6).map(cat => ({
      id: cat.id,
      name: cat.name,
      image: cat.image || '',
      slug: cat.slug,
    })) || [];
  };

  const sliderCategories = getSliderCategories();

  const getHeroSlides = () => {
    if (homepageConfig?.heroSlides?.length) {
      return homepageConfig.heroSlides.map(slide => ({
        image: slide.categoryId && !slide.image ? getCategoryImage(slide.categoryId) : slide.image || '',
        title: slide.title,
        subtitle: slide.subtitle,
        ctaText: slide.ctaText,
        ctaLink: slide.ctaLink,
      }));
    }
    return heroSlides;
  };

  if (configLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Banner - Clean corporate style */}
        <div className="h-2 w-full bg-green-800 border-b-2 border-green-600" />

        {/* Hero Section */}
        <div className="relative">
          <ImageSlider
            slides={getHeroSlides()}
            autoPlay={true}
            interval={5000}
            height="h-[55vh] sm:h-[60vh] md:h-[70vh] min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
            showArrows={true}
            showDots={true}
          />
        </div>

        {/* Video Section - Clean solid background */}
        {videoEnabled && (
          <section className="py-16 bg-green-50 relative overflow-hidden border-b border-green-200">
            <div className="container mx-auto px-4 relative">
              <VideoPlayer
                videos={videoUrls}
                playlistId={videoPlaylistId || undefined}
                title={videoTitle}
                subtitle={videoSubtitle}
              />
            </div>
          </section>
        )}

{/* Product Slider Section - Modern cards */}
        <section className="py-16 bg-gradient-to-b from-green-50 to-white relative border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-2">Explore Our Products</h2>
                <p className="text-gray-600">Quality agricultural solutions for every need</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/products">
                  View All Products <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            {/* Horizontal scroll product slider - Wider cards */}
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {sliderCategories.slice(0, 6).map((category, index) => (
                <div 
                  key={category.id} 
                  className="flex-shrink-0 w-80 md:w-96 snap-start"
                >
                  <Link href={`/products/${category.slug}`}>
                    <div className="relative h-64 rounded-xl overflow-hidden group border border-green-200 bg-gradient-to-br from-white to-green-50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-green-500">
                      <img 
                        src={category.image || '/placeholder.svg'} 
                        alt={category.name} 
                        className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                        <h3 className="text-lg md:text-xl font-semibold text-white tracking-tight">{category.name}</h3>
                        <p className="text-xs text-white/80">Click to explore</p>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Better contrast */}
        <section className="py-16 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon === 'Shield' ? Shield : 
                                   feature.icon === 'Truck' ? Truck : 
                                   feature.icon === 'Sprout' ? Sprout : Leaf;
                return (
                  <Card 
                    key={index} 
                    className="border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-500"
                  >
                    <CardContent className="pt-6 text-center">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-green-700" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products - Better styling */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-2">Featured Products</h2>
                <p className="text-gray-600">Discover our most popular products</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/products">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : featuredProducts && featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product, index) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <p className="col-span-full text-center text-gray-500">No featured products available.</p>
              </div>
            )}
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-16 bg-green-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold mb-3">Our Product Categories</h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Comprehensive solutions for every farming need
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories?.slice(0, 6).map((category, index) => (
                <Link key={category.id} href={`/products/${category.slug}`}>
                  <Card className="bg-green-800 border-green-700 text-white hover:bg-green-700 hover:scale-105 transition-all cursor-pointer h-full">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-700 flex items-center justify-center">
                        <Sprout className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-semibold mb-1">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Machinery */}
        {machineryProducts.length > 0 && (
          <section className="py-16 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Tractor className="w-7 h-7 text-green-600" />
                  <div>
                    <h2 className="text-2xl font-semibold">Featured Machinery</h2>
                    <p className="text-gray-600 text-sm">Premium tractors and farm equipment</p>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link href="/products/field-machinery">
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {machineryProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stats Section - Clean minimal */}
        <section className="py-16 bg-white border-t border-b border-gray-200">
          <div className="container mx-auto px-4">
            <StatsCounter stats={stats} />
          </div>
        </section>

        {/* CTA Section - Clean corporate */}
        <section className="py-16 bg-green-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-white">
              {homepageConfig?.ctaTitle || 'Ready to Transform Your Farm?'}
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-6">
              {homepageConfig?.ctaSubtitle || 'Get in touch with our agricultural experts today and discover the best solutions for your farming needs.'}
            </p>
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
            >
              <Link href={homepageConfig?.ctaButtonLink || '/contact'}>
                {homepageConfig?.ctaButtonText || 'Contact Us'} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}