'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Leaf, Shield, Truck, Sprout, Tractor, Cog } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/features/hero-section';
import { ProductCard, ProductCardSkeleton } from '@/components/features/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFeaturedProducts, useProducts } from '@/hooks/use-products';

export default function HomePage() {
  const t = useTranslations();
  const { data: featuredProducts, isLoading } = useFeaturedProducts();
  const { data: allProducts } = useProducts();

  const machineryProducts = allProducts?.filter(p => 
    p.category?.type === 'MACHINERY' || 
    p.name.toLowerCase().includes('tractor')
  ).slice(0, 4) || [];

  const features = [
    { icon: Leaf, title: 'Premium Quality Seeds', description: 'High-yielding varieties developed for Bangladesh climate' },
    { icon: Shield, title: 'Crop Protection', description: 'Effective solutions for pest and disease management' },
    { icon: Truck, title: 'Nationwide Delivery', description: 'Products available across all 64 districts' },
    { icon: Sprout, title: 'Expert Support', description: 'Agricultural specialists ready to assist farmers' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection
          title="Empowering Bangladesh's Agricultural Future"
          subtitle="Your trusted partner for quality seeds, crop protection, and modern farming machinery"
          ctaText="Explore Products"
          ctaLink="/products"
          secondaryCtaText="Contact Us"
          secondaryCtaLink="/contact"
          height="large"
        />

        {/* YouTube Video Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Watch Our Video</h2>
              <p className="text-gray-600">Learn more about SQ Agriculture</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="SQ Agriculture Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* Product Slider Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div></div>
              <Button asChild variant="outline">
                <Link href="/products">
                  View All Products <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            {/* Horizontal scroll product slider */}
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              <div className="flex-shrink-0 w-72 snap-start">
                <Link href="/products/seeds">
                  <div className="relative h-80 rounded-xl overflow-hidden group">
                    <img 
                      src="/uploads/products/Seeds.png" 
                      alt="Seeds" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">Seeds</h3>
                      <p className="text-white/80">Premium quality seeds for better harvest</p>
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="flex-shrink-0 w-72 snap-start">
                <Link href="/products/fertilizer">
                  <div className="relative h-80 rounded-xl overflow-hidden group">
                    <img 
                      src="/uploads/products/SQ Fertilizer.png" 
                      alt="Fertilizers" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">Fertilizers</h3>
                      <p className="text-white/80">Plant nutrition for maximum yield</p>
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="flex-shrink-0 w-72 snap-start">
                <Link href="/products/pesticide">
                  <div className="relative h-80 rounded-xl overflow-hidden group">
                    <img 
                      src="/uploads/products/pesticide/Dtuch.png" 
                      alt="Pesticides" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">Pesticides</h3>
                      <p className="text-white/80">Crop protection solutions</p>
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="flex-shrink-0 w-72 snap-start">
                <Link href="/products/field-machinery">
                  <div className="relative h-80 rounded-xl overflow-hidden group">
                    <img 
                      src="/uploads/products/machinery/TT47.png" 
                      alt="Machinery" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">Machinery</h3>
                      <p className="text-white/80">Modern tractors and equipment</p>
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="flex-shrink-0 w-72 snap-start">
                <Link href="/products/field-machinery">
                  <div className="relative h-80 rounded-xl overflow-hidden group">
                    <img 
                      src="/uploads/products/machinery/Rotavator.png" 
                      alt="Rotavator" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">Rotavators</h3>
                      <p className="text-white/80">Soil preparation equipment</p>
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="flex-shrink-0 w-72 snap-start">
                <Link href="/products">
                  <div className="relative h-80 rounded-xl overflow-hidden group">
                    <img 
                      src="/uploads/products/lube/Tractor Pro Engine Oil.png" 
                      alt="Lubricants" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">Lubricants</h3>
                      <p className="text-white/80">Quality oils for your machinery</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="pt-6 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
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
                {featuredProducts.slice(0, 4).map((product) => (
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

        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Product Categories</h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Comprehensive solutions for every farming need
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/products/seeds">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-2xl">🌾</span>
                    </div>
                    <h3 className="text-base font-bold mb-1">Seeds</h3>
                    <p className="text-white/70 text-xs">Premium quality seeds</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/products/fertilizer">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-2xl">🧪</span>
                    </div>
                    <h3 className="text-base font-bold mb-1">Fertilizers</h3>
                    <p className="text-white/70 text-xs">Plant nutrition</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/products/pesticide">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <h3 className="text-base font-bold mb-1">Pesticides</h3>
                    <p className="text-white/70 text-xs">Crop protection</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/products/micronutrients">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <h3 className="text-base font-bold mb-1">Micronutrients</h3>
                    <p className="text-white/70 text-xs">Essential nutrients</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/products/field-machinery">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-2xl">🚜</span>
                    </div>
                    <h3 className="text-base font-bold mb-1">Machinery</h3>
                    <p className="text-white/70 text-xs">Tractors & equipment</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/products">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <h3 className="text-base font-bold mb-1">All Products</h3>
                    <p className="text-white/70 text-xs">View all items</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Machinery */}
        {machineryProducts.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Tractor className="w-8 h-8 text-green-600" />
                  <div>
                    <h2 className="text-3xl font-bold">Featured Machinery</h2>
                    <p className="text-gray-600">Premium tractors and farm equipment</p>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link href="/products/field-machinery">
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {machineryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-600">Products</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
                <div className="text-gray-600">Happy Farmers</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">64</div>
                <div className="text-gray-600">Districts</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">15+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Farm?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Get in touch with our agricultural experts today and discover the best solutions for your farming needs.
            </p>
            <Button asChild size="lg">
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
