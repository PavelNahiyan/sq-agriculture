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
        {/* Banner - New gradient style */}
        <div className="h-3 w-full bg-gradient-to-r from-green-900 via-green-600 to-green-900 shadow-lg border-b-4 border-green-500" />

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
          {/* Bottom gradient transition from slider */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
        </div>

        {/* Video Section */}
        {videoEnabled && (
          <section className="py-16 bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden border-b border-green-200">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
            </div>
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

        {/* Product Slider Section with animations */}
        <section className="py-20 bg-white relative border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
<h2 className="text-3xl md:text-4xl font-bold mb-2 animate-fade-in-up">Explore Our Products</h2>
                  <p className="text-gray-600 animate-fade-in-up delay-100">Quality agricultural solutions for every need</p>
              </div>
              <Button asChild variant="outline" className="hover-glow animate-fade-in-up">
                <Link href="/products">
                  View All Products <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            {/* Horizontal scroll product slider with animated cards */}
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {sliderCategories.slice(0, 6).map((category, index) => (
                <div 
                  key={category.id} 
                  className="flex-shrink-0 w-72 snap-start animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={`/products/${category.slug}`}>
                    <div className="relative h-80 rounded-xl overflow-hidden group category-card border-2 border-gray-200 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all">
                      <img 
                        src={category.image || '/placeholder.svg'} 
                        alt={category.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:translate-x-2 transition-transform">{category.name}</h3>
                        <p className="text-white/80 text-sm">Click to explore</p>
                      </div>
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section with animated borders */}
        <section className="py-20 bg-gradient-to-br from-green-50 via-white to-green-100 relative border-b border-green-200">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon === 'Shield' ? Shield : 
                                   feature.icon === 'Truck' ? Truck : 
                                   feature.icon === 'Sprout' ? Sprout : Leaf;
                return (
                  <Card 
                    key={index} 
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group gradient-border"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="pt-6 text-center relative">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                          <IconComponent className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 animate-fade-in-up">Featured Products</h2>
                <p className="text-gray-600 animate-fade-in-up delay-100">Discover our most popular products</p>
              </div>
              <Button asChild variant="outline" className="hover-glow animate-fade-in-up">
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
                  <div 
                    key={product.id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
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
        <section className="py-20 bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">Our Product Categories</h2>
              <p className="text-white/80 max-w-2xl mx-auto animate-fade-in-up delay-100">
                Comprehensive solutions for every farming need
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories?.slice(0, 6).map((category, index) => (
                <Link key={category.id} href={`/products/${category.slug}`}>
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all cursor-pointer h-full group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Sprout className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-bold mb-1">{category.name}</h3>
                      <p className="text-white/70 text-xs">Click to view</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Machinery */}
        {machineryProducts.length > 0 && (
          <section className="py-20 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 animate-slide-in-left">
                  <Tractor className="w-8 h-8 text-green-600" />
                  <div>
                    <h2 className="text-3xl font-bold">Featured Machinery</h2>
                    <p className="text-gray-600">Premium tractors and farm equipment</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="animate-slide-in-right">
                  <Link href="/products/field-machinery">
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {machineryProducts.map((product, index) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stats Section with animated counters */}
        <section className="py-20 bg-white relative overflow-hidden border-t border-b border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
          <div className="container mx-auto px-4 relative">
            <StatsCounter stats={stats} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary-light relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          </div>
          <div className="container mx-auto px-4 text-center relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white animate-fade-in-up">
              {homepageConfig?.ctaTitle || 'Ready to Transform Your Farm?'}
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 animate-fade-in-up delay-100">
              {homepageConfig?.ctaSubtitle || 'Get in touch with our agricultural experts today and discover the best solutions for your farming needs.'}
            </p>
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="cta-button animate-scale-in delay-200"
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