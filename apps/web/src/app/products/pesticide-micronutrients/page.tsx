'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProducts } from '@/hooks/use-products';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Shield, Phone, Mail, MapPin, Bug, Leaf } from 'lucide-react';

export default function PesticideMicronutrientsPage() {
  const { data: products, isLoading } = useProducts();

  const pestControlProducts = products?.filter(p => 
    p.category?.type === 'PESTICIDES' || 
    p.name.toLowerCase().includes('pesticide') ||
    p.name.toLowerCase().includes('insecticide') ||
    p.name.toLowerCase().includes('fungicide') ||
    p.name.toLowerCase().includes('herbicide') ||
    p.name.toLowerCase().includes('carbaryl') ||
    p.name.toLowerCase().includes('imidacloprid')
  ) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-800 to-purple-600 text-white py-20">
          <div className="absolute inset-0 opacity-20">
            <Image 
              src="/uploads/products/Fieldking.png" 
              alt="Pesticides & Micronutrients"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Pesticides & Micronutrients
              </h1>
              <p className="text-xl text-purple-100 mb-6">
                Complete crop protection and nutrition solutions. 
                Protect your crops and boost yields.
              </p>
              <Button asChild size="lg" className="bg-white text-purple-800 hover:bg-purple-100">
                <Link href="#products">View Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-l-4 border-l-purple-600">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Pesticides</h3>
                      <p className="text-gray-600 text-sm">
                        Effective pest control solutions including insecticides, fungicides, and herbicides. 
                        Protect your crops from harmful pests and diseases with our range of government-approved pesticides.
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
                        Essential micronutrients for optimal plant growth. Zinc, Iron, Boron, and other 
                        trace elements that ensure healthy crop development and higher yields.
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
              <Bug className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold">Crop Protection Products</h2>
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Quality pesticides for effective pest management. 
              Safe when used as directed.
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pestControlProducts.length > 0 ? pestControlProducts.map(product => (
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
                          <Bug className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      {product.featured && (
                        <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-purple-600 font-bold text-xl mb-3">
                        ৳{product.price?.toLocaleString()}/{product.priceUnit}
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
                      <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                        <Link href={`/products/${product.slug}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <Bug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Pesticide products coming soon</p>
                    <p className="text-sm text-gray-400">Contact us for product inquiries</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-purple-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose SQ Crop Protection?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Effective Protection</h3>
                <p className="text-gray-600 text-sm">Proven to control major pests</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Safe Formulation</h3>
                <p className="text-gray-600 text-sm">Government approved products</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Micronutrient Rich</h3>
                <p className="text-gray-600 text-sm">Complete plant nutrition</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bug className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Wide Coverage</h3>
                <p className="text-gray-600 text-sm">Solutions for all crops</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-green-800 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Our Experts</h2>
                <p className="text-green-100 mb-6">
                  Get expert advice on pest management and crop nutrition.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-400" />
                    <span>+880 1700-000000</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-400" />
                    <span>crops@sqagriculture.com</span>
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
