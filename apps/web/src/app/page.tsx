'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, Shield, Truck, Sprout } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFeaturedProducts, useProducts } from '@/hooks/use-products';
import { useHeroSlides, HeroSlide } from '@/hooks/use-hero-slides';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Image from 'next/image';
import { StatsCounter } from '@/components/features/stats-counter';

const DEFAULT_FEATURES = [
  { icon: Leaf, title: 'Premium Quality Seeds', description: 'High-yielding varieties developed for Bangladesh climate' },
  { icon: Shield, title: 'Crop Protection', description: 'Effective solutions for pest and disease management' },
  { icon: Truck, title: 'Nationwide Delivery', description: 'Products available across all 64 districts' },
  { icon: Sprout, title: 'Expert Support', description: 'Agricultural specialists ready to assist farmers' },
];

export default function HomePage() {
  const { data: heroSlides, isLoading: slidesLoading } = useHeroSlides(true);
  const { data: featuredProducts, isLoading } = useFeaturedProducts();
  const { data: allProducts } = useProducts();
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response: any = await api.get('/categories');
      return response.data;
    },
  });

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (!heroSlides?.length || slidesLoading || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides?.length, slidesLoading, isPaused]);

  if (slidesLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 h-[60vh] w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  const currentSlideData = heroSlides?.[currentSlide];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Slider */}
        <div 
          className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {heroSlides?.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title || `Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              <div 
                className="absolute inset-0" 
                style={{ backgroundColor: slide.backgroundColor || '#2D5016', opacity: slide.overlayOpacity || 0.4 }} 
              />
            </div>
          ))}

          {/* Content */}
          {currentSlideData && (
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl">
                  <h1 
                    className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4"
                    style={{ color: currentSlideData.textColor || '#FFFFFF' }}
                  >
                    {currentSlideData.title}
                  </h1>
                  {currentSlideData.subtitle && (
                    <p 
                      className="text-base md:text-lg mb-6 opacity-90"
                      style={{ color: currentSlideData.textColor || '#FFFFFF' }}
                    >
                      {currentSlideData.subtitle}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {currentSlideData.ctaText && currentSlideData.ctaLink && (
                      <Link href={currentSlideData.ctaLink}>
                        <Button size="lg" className="bg-green-700 hover:bg-green-800 text-white shadow-md">
                          {currentSlideData.ctaText}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Dots */}
          {heroSlides && heroSlides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Golden Border */}
        <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DEFAULT_FEATURES.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-500">
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

        {/* Featured Products */}
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
                  <div key={i} className="bg-gray-200 animate-pulse h-64 rounded-lg" />
                ))}
              </div>
            ) : featuredProducts && featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product: any) => (
                  <div key={product.id} className="bg-gray-200 animate-pulse h-64 rounded-lg" />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No featured products available.</p>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-white">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-6">
              Get in touch with our agricultural experts today and discover the best solutions for your farming needs.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">
                Contact Us <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
