'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProducts } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Heart, MessageCircle, Share2, Instagram, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  productName: string;
  productSlug: string;
  category: string;
}

export default function GalleryPage() {
  const { data: products, isLoading } = useProducts({ limit: 200 });
  const [galleryImages, setGalleryImages] = React.useState<GalleryImage[]>([]);
  const [displayImages, setDisplayImages] = React.useState<GalleryImage[]>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Initialize gallery images from products
  React.useEffect(() => {
    if (products && products.length > 0) {
      const images: GalleryImage[] = products
        .filter(p => p.images && p.images.length > 0)
        .map(product => ({
          id: product.id,
          src: product.images?.[0] || '',
          alt: product.name,
          productName: product.name,
          productSlug: product.slug,
          category: product.category?.name || 'Products',
        }));
      
      setGalleryImages(images);
    }
  }, [products]);

  // Shuffle and refresh images
  const shuffleImages = React.useCallback(() => {
    if (galleryImages.length === 0) return;
    
    setIsRefreshing(true);
    
    // Shuffle array and pick random 9-12 images
    const shuffled = [...galleryImages].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(12, shuffled.length));
    
    // Add random heights for masonry effect
    const withHeights = selected.map((img, idx) => ({
      ...img,
      height: [280, 320, 260, 300, 340, 290][idx % 6],
    }));
    
    setDisplayImages(withHeights);
    
    setTimeout(() => setIsRefreshing(false), 500);
  }, [galleryImages]);

  // Initial load and auto-refresh
  React.useEffect(() => {
    if (galleryImages.length > 0) {
      shuffleImages();
    }
  }, [galleryImages.length]);

  // Auto-refresh every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      shuffleImages();
    }, 5000);

    return () => clearInterval(interval);
  }, [shuffleImages]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-[#2D5A27] via-[#2D5A27] to-[#1a3d16] text-white py-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#85BF35]/20 border border-[#85BF35]/30 mb-4">
                  <Instagram className="w-4 h-4 text-[#85BF35]" />
                  <span className="text-[#85BF35] text-sm font-medium">Photo Gallery</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Gallery</h1>
                <p className="text-white/80 max-w-xl">
                  Explore our collection of agricultural products. Fresh visuals of seeds, machinery, fertilizers, and more.
                </p>
              </div>
              <Button 
                onClick={shuffleImages}
                disabled={isRefreshing}
                className="bg-[#85BF35] text-[#2D5A27] hover:bg-[#9AD44D] font-semibold"
              >
                {isRefreshing ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className={cn("w-5 h-5 mr-2", isRefreshing && "animate-spin")} />
                )}
                Refresh
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-6 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2D5A27]/10 flex items-center justify-center">
                  <span className="text-[#2D5A27] font-bold">{galleryImages.length}</span>
                </div>
                <span className="text-gray-600">Photos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2D5A27]/10 flex items-center justify-center">
                  <span className="text-[#2D5A27] font-bold">{products?.length || 0}</span>
                </div>
                <span className="text-gray-600">Products</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2D5A27]/10 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-[#2D5A27]" />
                </div>
                <span className="text-gray-600">Auto-refresh: 5s</span>
              </div>
            </div>
          </div>
        </section>

        {/* Instagram-style Gallery Grid */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#2D5A27] animate-spin" />
              </div>
            ) : displayImages.length === 0 ? (
              <div className="text-center py-20">
                <Instagram className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No images available yet</p>
                <Button asChild className="mt-4 bg-[#2D5A27] hover:bg-[#3d7a34]">
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                {displayImages.map((image, index) => (
                  <Link 
                    key={`${image.id}-${index}`} 
                    href={`/products/${image.productSlug}`}
                    className={cn(
                      "group relative overflow-hidden rounded-lg",
                      "transition-all duration-300 hover:shadow-xl",
                      "animate-fade-in"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div 
                      className="relative w-full"
                      style={{ height: `${image.height}px` }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Content on hover */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white font-semibold text-sm truncate">{image.productName}</p>
                        <p className="text-white/70 text-xs">{image.category}</p>
                        
                        {/* Instagram-style action buttons */}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-white">
                            <Heart className="w-4 h-4" />
                            <span className="text-xs">Like</span>
                          </div>
                          <div className="flex items-center gap-1 text-white">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs">Comment</span>
                          </div>
                          <div className="flex items-center gap-1 text-white">
                            <Share2 className="w-4 h-4" />
                            <span className="text-xs">Share</span>
                          </div>
                        </div>
                      </div>

                      {/* Always visible category badge */}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-[#2D5A27]/80 text-white text-xs rounded-full">
                        {image.category}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Load More */}
            {displayImages.length > 0 && (
              <div className="text-center mt-8">
                <Button 
                  onClick={shuffleImages}
                  disabled={isRefreshing}
                  variant="outline"
                  className="border-[#2D5A27] text-[#2D5A27] hover:bg-[#2D5A27] hover:text-white"
                >
                  {isRefreshing ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-5 h-5 mr-2" />
                  )}
                  Load More Photos
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 bg-gradient-to-r from-[#2D5A27] to-[#3d7a34] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Want to see more?</h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Browse our complete product catalog or contact us for more information about our agricultural solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-[#85BF35] text-[#2D5A27] hover:bg-[#9AD44D] font-semibold">
                <Link href="/products">All Products</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-[#2D5A27]">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Back Button */}
        <section className="py-8 bg-white text-center">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
