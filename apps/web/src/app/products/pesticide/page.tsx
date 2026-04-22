'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProducts } from '@/hooks/use-products';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Shield, Phone, Mail, MapPin, Bug } from 'lucide-react';
import { LicenseInfo } from '@/components/features/license-info';

export default function PesticidePage() {
  const { data: products, isLoading } = useProducts({ categoryType: 'PESTICIDES', limit: 200 });

  const pesticides = products || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-[#2D5A27] via-[#2D5A27] to-[#1a3d16] text-white py-20">
          <div className="absolute inset-0 opacity-10">
            <Image 
              src="/uploads/covers/cover.jpg" 
              alt="Pesticides"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="/uploads/logo/SQ-NAfis-Crop-CAre.jpeg" 
                alt="SQ NAfis Crop Care" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#85BF35]/20 border border-[#85BF35]/30 mb-4">
                <Bug className="w-4 h-4 text-[#85BF35]" />
                <span className="text-[#85BF35] text-sm font-medium">Crop Protection</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Pesticides
              </h1>
              <p className="text-xl text-white/80 mb-6">
                Effective pest control solutions for protecting your crops. 
                Advanced insecticides, fungicides, and herbicides for maximum yield protection.
              </p>
              <Button asChild size="lg" className="bg-[#85BF35] text-[#2D5A27] hover:bg-[#9AD44D] font-semibold">
                <Link href="#insecticides">View Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D5A27]/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#2D5A27]" />
                </div>
                <span className="text-sm font-medium text-gray-700">Expert Formulated</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D5A27]/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#2D5A27]" />
                </div>
                <span className="text-sm font-medium text-gray-700">Quality Assured</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D5A27]/10 flex items-center justify-center">
                  <Bug className="w-5 h-5 text-[#2D5A27]" />
                </div>
                <span className="text-sm font-medium text-gray-700">Effective Control</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D5A27]/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#2D5A27]" />
                </div>
                <span className="text-sm font-medium text-gray-700">Technical Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="insecticides" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-red-600" />
              <h2 className="text-3xl font-bold">Pest Control Products</h2>
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
                {pesticides.length > 0 ? pesticides.map(product => (
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
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-red-600 font-bold text-xl mb-3">
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
                      <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                        <Link href={`/products/${product.slug}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <Bug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Pesticide products coming soon</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose SQ Crop Protection?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Effective Protection</h3>
                <p className="text-gray-600 text-sm">Proven to control major pests</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Safe Use</h3>
                <p className="text-gray-600 text-sm">Government approved formulations</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bug className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Wide Coverage</h3>
                <p className="text-gray-600 text-sm">Solutions for all crop types</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Expert Advice</h3>
                <p className="text-gray-600 text-sm">Technical support available</p>
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
                <h2 className="text-3xl font-bold mb-6">Contact Our Crop Protection Experts</h2>
                <p className="text-green-100 mb-6">
                  Get expert advice on pest management and crop protection solutions.
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
