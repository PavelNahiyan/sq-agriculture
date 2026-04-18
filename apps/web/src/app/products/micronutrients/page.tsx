'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProducts } from '@/hooks/use-products';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Phone, Mail, MapPin, Leaf } from 'lucide-react';
import { LicenseInfo } from '@/components/features/license-info';

export default function MicronutrientsPage() {
  const { data: products, isLoading } = useProducts({ categoryType: 'MICRONUTRIENTS', limit: 200 });

  const micronutrientProducts = products || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-amber-600 to-orange-500 text-white py-20">
          <div className="absolute inset-0 opacity-20">
            <Image 
              src="/uploads/products/SQ Agriculture Logo.png" 
              alt="Micronutrients"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Micronutrients
              </h1>
              <p className="text-xl text-amber-100 mb-6">
                Essential micronutrients for plant growth and development. 
                Boost your crop yields with quality micronutrients.
              </p>
              <Button asChild size="lg" className="bg-white text-amber-700 hover:bg-amber-100">
                <Link href="#products">View Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Plant Growth</h3>
                      <p className="text-gray-600 text-sm">
                        Essential micronutrients that ensure healthy crop development, 
                        improved photosynthesis, and higher yields.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Soil Health</h3>
                      <p className="text-gray-600 text-sm">
                        Balanced micronutrient formulations that replenish soil nutrients 
                        and improve long-term fertility.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Quality Yield</h3>
                      <p className="text-gray-600 text-sm">
                        Premium quality micronutrients for better crop quality, 
                        improved resistance, and superior harvest results.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Leaf className="w-8 h-8 text-amber-600" />
              <h2 className="text-3xl font-bold">Micronutrient Products</h2>
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Quality micronutrients for optimal plant growth. Zinc, Iron, Boron, Magnesium, 
              and other essential trace elements.
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {micronutrientProducts.length > 0 ? micronutrientProducts.map(product => (
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
                    <p className="text-gray-500 mb-2">Micronutrient products coming soon</p>
                    <p className="text-sm text-gray-400">Contact us for product inquiries</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose SQ Micronutrients?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2">Water Soluble</h3>
                <p className="text-gray-600 text-sm">Easy to apply with foliar spray</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2">High Purity</h3>
                <p className="text-gray-600 text-sm">Premium quality ingredients</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2">Fast Absorption</h3>
                <p className="text-gray-600 text-sm">Quick uptake by plants</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2">Cost Effective</h3>
                <p className="text-gray-600 text-sm">Optimal results at low cost</p>
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
                  Get expert advice on micronutrient application and crop nutrition.
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
