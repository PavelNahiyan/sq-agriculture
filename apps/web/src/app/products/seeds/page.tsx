'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProducts } from '@/hooks/use-products';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Leaf, Sprout, Phone, Mail, MapPin } from 'lucide-react';

export default function SeedsPage() {
  const { data: products, isLoading } = useProducts({ categoryType: 'SEEDS', limit: 200 });

  const seeds = products || [];

  const riceSeeds = seeds.filter(p => 
    p.name.toLowerCase().includes('rice') ||
    p.name.toLowerCase().includes('dhan') ||
    p.name.toLowerCase().includes('paddy')
  );

  const vegetableSeeds = seeds.filter(p => 
    p.name.toLowerCase().includes('tomato') ||
    p.name.toLowerCase().includes('cucumber') ||
    p.name.toLowerCase().includes('chilli') ||
    p.name.toLowerCase().includes('brinjal') ||
    p.name.toLowerCase().includes('eggplant') ||
    p.name.toLowerCase().includes('cabbage') ||
    p.name.toLowerCase().includes('cauliflower') ||
    p.name.toLowerCase().includes('maize') ||
    p.name.toLowerCase().includes('corn') ||
    p.name.toLowerCase().includes('okra') ||
    p.name.toLowerCase().includes('bottle gourd') ||
    p.name.toLowerCase().includes('bitter gourd') ||
    p.name.toLowerCase().includes('ridge gourd') ||
    p.name.toLowerCase().includes('sponge gourd') ||
    p.name.toLowerCase().includes('pumpkin') ||
    p.name.toLowerCase().includes('watermelon') ||
    p.name.toLowerCase().includes('capsicum') ||
    p.name.toLowerCase().includes('ladys finger')
  );

  const otherSeeds = seeds.filter(p => 
    !riceSeeds.includes(p) &&
    !vegetableSeeds.includes(p)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-amber-700 to-amber-600 text-white py-20">
          <div className="absolute inset-0 opacity-20">
            <Image 
              src="/uploads/products/Seeds.png" 
              alt="Seeds"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Quality Seeds
              </h1>
              <p className="text-xl text-amber-100 mb-6">
                High-yielding seeds for optimal harvest. BARI, BRRI approved varieties and hybrid seeds.
              </p>
              <Button asChild size="lg" className="bg-white text-amber-800 hover:bg-amber-100">
                <Link href="#rice-seeds">View Rice Seeds</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Brand Partners */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-lg font-semibold text-center mb-4">Our Seed Partners</h2>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="text-center">
                <span className="text-xl font-bold text-green-700">BARI</span>
                <p className="text-sm text-gray-500">Bangladesh Agricultural Research Institute</p>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-green-700">BRRI</span>
                <p className="text-sm text-gray-500">Bangladesh Rice Research Institute</p>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-green-700">SQ Seeds</span>
                <p className="text-sm text-gray-500">Premium Quality Seeds</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rice Seeds */}
        <section id="rice-seeds" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Leaf className="w-8 h-8 text-amber-600" />
              <h2 className="text-3xl font-bold">Rice Seeds</h2>
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Premium quality rice seeds for Boro, Aman, and Aus seasons. 
              High germination rate and disease resistant varieties.
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {riceSeeds.length > 0 ? riceSeeds.map(product => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
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
                          <Leaf className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      {product.featured && (
                        <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-amber-600 font-bold text-xl mb-3">
                        Price On Request
                      </p>
                      <div className="text-sm text-gray-600 mb-4">
                        {product.specs && (
                          <div className="space-y-1">
                            {Object.entries(product.specs as Record<string, string>).slice(0, 3).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key.replace('_', ' ')}:</span>
                                <span className="font-medium">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                        <Link href={`/products/${product.slug}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )) : (
                  <p className="col-span-full text-gray-500">No rice seeds available</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Vegetable Seeds */}
        <section id="vegetable-seeds" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Sprout className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold">Vegetable Seeds</h2>
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl">
              High-quality vegetable seeds for commercial and home farming. 
              Tomatoes, cucumbers, and more.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vegetableSeeds.length > 0 ? vegetableSeeds.map(product => (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
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
                        <Sprout className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-green-600 font-bold text-xl mb-3">
                      Price On Request
                    </p>
                    <Button asChild className="w-full">
                      <Link href={`/products/${product.slug}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              )) : (
                <p className="col-span-full text-gray-500">No vegetable seeds available</p>
              )}
            </div>
          </div>
        </section>

        {/* Other Seeds */}
        {otherSeeds.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8">Other Seeds</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {otherSeeds.map(product => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
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
                          <Leaf className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-green-600 font-bold text-xl mb-3">
                        Price On Request
                      </p>
                      <Button asChild className="w-full">
                        <Link href={`/products/${product.slug}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose SQ Seeds?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2">High Germination</h3>
                <p className="text-gray-600 text-sm">85%+ germination rate guaranteed</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2">Disease Resistant</h3>
                <p className="text-gray-600 text-sm">Resistant to major crop diseases</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2">High Yield</h3>
                <p className="text-gray-600 text-sm">Proven to increase yield by 20-30%</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2">Government Approved</h3>
                <p className="text-gray-600 text-sm">BARI/BRRI certified varieties</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-green-800 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Our Seed Experts</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-400" />
                    <span>+880 1321-219223</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-400" />
                    <span>agriculture@sq-bd.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-green-400" />
                    <span>Banani, Dhaka-1213</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Button asChild size="lg" className="bg-white text-green-800 hover:bg-green-100">
                  <Link href="/contact">
                    Contact Us <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-gray-50 text-center">
          <Button asChild variant="outline">
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Products
            </Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
