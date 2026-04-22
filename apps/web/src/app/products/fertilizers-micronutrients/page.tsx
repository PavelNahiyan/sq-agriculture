'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProducts } from '@/hooks/use-products';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Droplets, Phone, Mail, MapPin, Beaker, Leaf } from 'lucide-react';
import { LicenseInfo } from '@/components/features/license-info';

export default function FertilizersMicronutrientsPage() {
  const { data: products, isLoading } = useProducts({ limit: 500 });

  const fertilizers = products?.filter(p => p.category?.type === 'FERTILIZERS') || [];
  const micronutrients = products?.filter(p => p.category?.type === 'MICRONUTRIENTS') || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-[#2D5A27] via-[#2D5A27] to-[#1a3d16] text-white py-20">
          <div className="absolute inset-0 opacity-10">
            <Image 
              src="/uploads/covers/cover.jpg" 
              alt="Fertilizers and Micronutrients"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="https://res.cloudinary.com/dzdnayf9q/image/upload/v1776865293/sq-agriculture/logos/SQ-NAFIS-LOGO.jpg" 
                alt="SQ NAfis Crop Care" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#85BF35]/20 border border-[#85BF35]/30 mb-4">
                <Leaf className="w-4 h-4 text-[#85BF35]" />
                <span className="text-[#85BF35] text-sm font-medium">Plant Nutrition</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Fertilizers & Micronutrients
              </h1>
              <p className="text-xl text-white/80 mb-6">
                Complete plant nutrition solutions. Quality fertilizers and essential micronutrients 
                for optimal crop growth and maximum yield.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-[#85BF35] text-[#2D5A27] hover:bg-[#9AD44D] font-semibold">
                  <Link href="#fertilizers">Fertilizers</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  <Link href="#micronutrients">Micronutrients</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D5A27]/10 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-[#2D5A27]" />
                </div>
                <span className="text-sm font-medium text-gray-700">High Yield</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D5A27]/10 flex items-center justify-center">
                  <Beaker className="w-5 h-5 text-[#2D5A27]" />
                </div>
                <span className="text-sm font-medium text-gray-700">Research Based</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D5A27]/10 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-[#2D5A27]" />
                </div>
                <span className="text-sm font-medium text-gray-700">Water Soluble</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D5A27]/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#2D5A27]" />
                </div>
                <span className="text-sm font-medium text-gray-700">Certified Quality</span>
              </div>
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Beaker className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Fertilizers</h3>
                      <p className="text-gray-600 text-sm">
                        NPK, Urea, TSP, MoP and more for complete plant nutrition.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Micronutrients</h3>
                      <p className="text-gray-600 text-sm">
                        Essential trace elements: Zinc, Iron, Boron, Magnesium and more.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Government Approved</h3>
                      <p className="text-gray-600 text-sm">
                        BFDC certified quality products for better yields.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Fertilizers Section */}
        <section id="fertilizers" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Beaker className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Fertilizers</h2>
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Complete nutrition solutions for every crop. Government approved quality fertilizers.
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

        {/* NPK Information */}
        <section className="py-12 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Types of Fertilizers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-blue-800">Nitrogen (N)</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Promotes leaf growth and green color. Essential for rice, wheat, and maize.
                  </p>
                  <p className="text-sm font-medium">Sources: Urea, Ammonium Sulfate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-blue-800">Phosphorus (P)</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Essential for root development and flowering. Important for seedlings.
                  </p>
                  <p className="text-sm font-medium">Sources: TSP (Triple Super Phosphate)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-blue-800">Potassium (K)</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Improves crop quality and disease resistance. Important for fruit development.
                  </p>
                  <p className="text-sm font-medium">Sources: MoP (Muriate of Potash)</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Micronutrients Section */}
        <section id="micronutrients" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Leaf className="w-8 h-8 text-amber-600" />
              <h2 className="text-3xl font-bold">Micronutrients</h2>
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Essential micronutrients for optimal plant growth. Zinc, Iron, Boron, Magnesium, 
              and other trace elements for better crop quality.
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {micronutrients.length > 0 ? micronutrients.map(product => (
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
                        <span className="absolute top-2 right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                          Popular
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
                            {Object.entries(product.specs as Record<string, string>).slice(0, 2).map(([key, value]) => (
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
                  <div className="col-span-full text-center py-12">
                    <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Micronutrient products coming soon</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Micronutrient Benefits */}
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Why Micronutrients Matter</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Leaf className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Plant Growth</h3>
                  <p className="text-gray-600 text-sm">Essential for healthy crop development</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Check className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Soil Health</h3>
                  <p className="text-gray-600 text-sm">Replenishes soil nutrients</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Droplets className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Water Soluble</h3>
                  <p className="text-gray-600 text-sm">Easy to apply with foliar spray</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Beaker className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">High Purity</h3>
                  <p className="text-gray-600 text-sm">Premium quality ingredients</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose SQ Fertilizers & Micronutrients?</h2>
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
                <p className="text-gray-600 text-sm">Premium ingredients</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Complete Nutrition</h3>
                <p className="text-gray-600 text-sm">NPK & trace elements</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Affordable Prices</h3>
                <p className="text-gray-600 text-sm">Subsidized rates</p>
              </div>
            </div>
          </div>
        </section>

        {/* License Information */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <LicenseInfo />
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-green-800 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Our Crop Nutrition Experts</h2>
                <p className="text-green-100 mb-6">
                  Get expert advice on fertilizer and micronutrient application for optimal crop yield.
                </p>
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