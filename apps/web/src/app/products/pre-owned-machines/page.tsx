'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tractor, Cog, ArrowLeft, ArrowRight, Settings, Phone } from 'lucide-react';

interface PreOwnedDetails {
  year: number;
  hours: number;
  condition: string;
  previousOwner?: string;
}

interface Product {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  description: string;
  price: number;
  priceUnit: string;
  images: string[];
  isPreOwned: boolean;
  preOwnedDetails: PreOwnedDetails | null;
  category: {
    id: string;
    name: string;
    slug: string;
    type: string;
  };
}

export default function PreOwnedMachinesPage() {
  const [tractors, setTractors] = useState<Product[]>([]);
  const [harvesters, setHarvesters] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPreOwnedProducts() {
      try {
        const response = await fetch('/api/v1/products/public?isPreOwned=true&limit=100');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        
        const tractorsData = data.data.filter(
          (p: Product) => p.category?.type === 'MACHINERY' && 
          (p.category?.slug === 'tractors' || p.name.toLowerCase().includes('tractor'))
        );
        const harvestersData = data.data.filter(
          (p: Product) => p.category?.type === 'MACHINERY' && 
          (p.category?.slug === 'harvesting-machinery' || 
           p.name.toLowerCase().includes('harvester') ||
           p.name.toLowerCase().includes('transplanter') ||
           p.name.toLowerCase().includes('power tiller'))
        );
        
        setTractors(tractorsData);
        setHarvesters(harvestersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchPreOwnedProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD').format(price);
  };

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'excellent':
      case 'like new':
        return 'bg-green-600';
      case 'good':
        return 'bg-amber-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pre-owned machines...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white py-20">
          <div className="absolute inset-0 opacity-10">
            <Image 
              src="/uploads/products/Tractor Specs.png" 
              alt="Pre Owned Machines"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Pre-Owned Machines
              </h1>
              <p className="text-xl text-green-100 mb-6">
                Quality certified pre-owned tractors and harvesters at the best prices. 
                All machines inspected and backed by SQ Agriculture warranty.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-green-800 hover:bg-green-100">
                  <Link href="#tractors">
                    <Tractor className="w-5 h-5 mr-2" />
                    View Tractors
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="#harvesters">
                    <Settings className="w-5 h-5 mr-2" />
                    View Harvesters
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-8 bg-green-50 border-b border-green-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Tractor className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">Certified Quality</p>
                  <p className="text-sm text-gray-600">All machines inspected</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Cog className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">6-Month Warranty</p>
                  <p className="text-sm text-gray-600">On all pre-owned machines</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">After-Sales Support</p>
                  <p className="text-sm text-gray-600">Parts & service available</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pre-Owned Tractors Section */}
        <section id="tractors" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                <Tractor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Pre-Owned Tractors</h2>
                <p className="text-gray-600">Quality tested tractors at affordable prices</p>
              </div>
            </div>

            {tractors.length === 0 ? (
              <div className="text-center py-12">
                <Tractor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No pre-owned tractors available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {tractors.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Tractor className="w-20 h-20 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`${getConditionColor(product.preOwnedDetails?.condition || 'Good')} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                          {product.preOwnedDetails?.condition || 'Good'}
                        </span>
                        <span className="bg-gray-800/80 text-white text-xs px-3 py-1 rounded-full">
                          {product.preOwnedDetails?.year || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Cog className="w-4 h-4" />
                          <span>{product.preOwnedDetails?.hours?.toLocaleString() || 0} hours</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Tractor className="w-4 h-4" />
                          <span>{product.preOwnedDetails?.year || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Starting from</p>
                          <p className="text-2xl font-bold text-green-600">৳{formatPrice(product.price)}</p>
                        </div>
                        <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                          <Link href={`/products/${product.slug}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="bg-gray-100 py-1">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="h-px w-20 bg-gray-300"></div>
                <span className="text-gray-400 text-sm">More machines coming soon</span>
                <div className="h-px w-20 bg-gray-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pre-Owned Harvesters Section */}
        <section id="harvesters" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Pre-Owned Harvesters</h2>
                <p className="text-gray-600">Combine harvesters & rice transplanters</p>
              </div>
            </div>

            {harvesters.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No pre-owned harvesters available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {harvesters.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-56 bg-gradient-to-br from-amber-50 to-amber-100">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Settings className="w-20 h-20 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`${getConditionColor(product.preOwnedDetails?.condition || 'Good')} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                          {product.preOwnedDetails?.condition || 'Good'}
                        </span>
                        <span className="bg-gray-800/80 text-white text-xs px-3 py-1 rounded-full">
                          {product.preOwnedDetails?.year || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Cog className="w-4 h-4" />
                          <span>{product.preOwnedDetails?.hours?.toLocaleString() || 0} hours</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Settings className="w-4 h-4" />
                          <span>{product.preOwnedDetails?.year || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Starting from</p>
                          <p className="text-2xl font-bold text-amber-600">৳{formatPrice(product.price)}</p>
                        </div>
                        <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700">
                          <Link href={`/products/${product.slug}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Looking for Something Specific?</h2>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Contact our sales team to find the perfect pre-owned machine for your needs. 
              We also accept exchange of old machines.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-green-700 hover:bg-green-100">
                <Link href="/contact">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Sales
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/products/field-machinery">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  View New Machines
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
