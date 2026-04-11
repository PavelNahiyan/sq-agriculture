'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProducts } from '@/hooks/use-products';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Droplets, Phone, Mail, MapPin, Beaker } from 'lucide-react';

export default function FertilizerPage() {
  const { data: products, isLoading } = useProducts();

  const fertilizers = products?.filter(p => 
    p.name.toLowerCase().includes('urea') ||
    p.name.toLowerCase().includes('tsp') ||
    p.name.toLowerCase().includes('mop') ||
    p.name.toLowerCase().includes('fertilizer') ||
    p.name.toLowerCase().includes('npk') ||
    p.name.toLowerCase().includes('potash') ||
    p.name.toLowerCase().includes('nitrogen') ||
    p.name.toLowerCase().includes('phosphorus') ||
    p.category?.slug === 'fertilizers'
  ) || [];

  const npkFertilizers = fertilizers.filter(p => 
    p.name.toLowerCase().includes('npk') ||
    p.name.toLowerCase().includes('compound')
  );

  const singleNutrient = fertilizers.filter(p => 
    p.name.toLowerCase().includes('urea') ||
    p.name.toLowerCase().includes('tsp') ||
    p.name.toLowerCase().includes('mop')
  );

  const organicFertilizers = fertilizers.filter(p => 
    p.name.toLowerCase().includes('organic') ||
    p.name.toLowerCase().includes('compost')
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20">
          <div className="absolute inset-0 opacity-20">
            <Image 
              src="/uploads/products/SQ Fertilizer.png" 
              alt="Fertilizers"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Fertilizers
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Quality fertilizers for optimal crop nutrition. 
                NPK, Urea, TSP, MoP and more.
              </p>
              <Button asChild size="lg" className="bg-white text-blue-800 hover:bg-blue-100">
                <Link href="#fertilizers">View Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* NPK Fertilizers */}
        <section id="fertilizers" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Beaker className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Fertilizers</h2>
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Complete nutrition solutions for every crop. 
              Government approved quality fertilizers.
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {fertilizers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {fertilizers.map(product => (
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
                              <Droplets className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                          {product.featured && (
                            <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Popular
                            </span>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                          <p className="text-blue-600 font-bold text-xl mb-3">
                            ৳{product.price?.toLocaleString()}/{product.priceUnit}
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
                          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                            <Link href={`/products/${product.slug}`}>View Details</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Fertilizer products coming soon</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Information */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Types of Fertilizers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-blue-800">Nitrogen (N)</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Promotes leaf growth and green color. Essential for rice, wheat, and maize.
                  </p>
                  <p className="text-sm font-medium">Sources: Urea, Ammonium Sulfate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-blue-800">Phosphorus (P)</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Essential for root development and flowering. Important for seedlings.
                  </p>
                  <p className="text-sm font-medium">Sources: TSP (Triple Super Phosphate)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-blue-800">Potassium (K)</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Improves crop quality and disease resistance. Important for fruit development.
                  </p>
                  <p className="text-sm font-medium">Sources: MoP (Muriate of Potash)</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose SQ Fertilizers?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Government Approved</h3>
                <p className="text-gray-600 text-sm">BFDC certified quality</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Beaker className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">High Purity</h3>
                <p className="text-gray-600 text-sm">46% nitrogen content in urea</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Balanced Nutrition</h3>
                <p className="text-gray-600 text-sm">Complete NPK formulations</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Affordable Prices</h3>
                <p className="text-gray-600 text-sm">Subsidized government rates</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-green-800 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Our Fertilizer Experts</h2>
                <p className="text-green-100 mb-6">
                  Get advice on fertilizer application and crop nutrition.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-400" />
                    <span>+880 1700-000000</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-400" />
                    <span>fertilizer@sqagriculture.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-green-400" />
                    <span>Dhaka, Bangladesh</span>
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
