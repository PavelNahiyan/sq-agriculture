'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProducts } from '@/hooks/use-products';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Tractor, Cog, Settings, Phone, Mail, MapPin } from 'lucide-react';

export default function FieldMachineryPage() {
  const { data: products, isLoading } = useProducts({ categoryType: 'MACHINERY', limit: 200 });
  const { data: lubricants } = useProducts({ categoryType: 'LUBRICANTS', limit: 50 });

  const fieldMachinery = products || [];

  const tractors = fieldMachinery.filter(p => 
    p.category?.slug === 'tractors' ||
    p.name.toLowerCase().includes('tractor')
  );

  const harvestors = fieldMachinery.filter(p => 
    p.category?.slug === 'harvesting-machinery' ||
    p.name.toLowerCase().includes('harvester') || 
    p.name.toLowerCase().includes('combine') ||
    p.name.toLowerCase().includes('reaper') ||
    p.name.toLowerCase().includes('3037') ||
    p.name.toLowerCase().includes('zoomlion')
  );

  const rotavators = fieldMachinery.filter(p => 
    p.category?.slug === 'rotavators' ||
    p.name.toLowerCase().includes('rotavator')
  );

  const sprayMachines = fieldMachinery.filter(p => 
    p.category?.slug === 'spray-machines' ||
    p.name.toLowerCase().includes('sprayer') ||
    p.name.toLowerCase().includes('spray')
  );

  const replacementParts = fieldMachinery.filter(p => 
    p.category?.slug === 'replacement-parts' ||
    p.name.toLowerCase().includes('part') ||
    p.name.toLowerCase().includes('spare') ||
    p.name.toLowerCase().includes('blade') ||
    p.name.toLowerCase().includes('belt')
  );

  const onCallService = fieldMachinery.filter(p => 
    p.category?.slug === 'on-call-service' ||
    p.name.toLowerCase().includes('service') ||
    p.name.toLowerCase().includes('maintenance') ||
    p.name.toLowerCase().includes('repair')
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-900 to-green-700 text-white py-20">
          <div className="absolute inset-0 opacity-20">
            <Image 
              src="/uploads/products/TT70.png" 
              alt="Field Machinery"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Field Machineries
              </h1>
              <p className="text-xl text-green-100 mb-6">
                High-performance tractors, harvesters, and rotavators for efficient farming operations.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-white text-green-800 hover:bg-green-100">
                  <Link href="#tractors">Tractors</Link>
                </Button>
                <Button asChild size="lg" className="bg-white text-amber-800 hover:bg-amber-100">
                  <Link href="#harvestors">Harvestors</Link>
                </Button>
                <Button asChild size="lg" className="bg-white text-green-800 hover:bg-green-100">
                  <Link href="#rotavators">Rotavators</Link>
                </Button>
                <Button asChild size="lg" className="bg-white text-blue-800 hover:bg-blue-100">
                  <Link href="#spray-machines">Spray Machines</Link>
                </Button>
                <Button asChild size="lg" className="bg-white text-yellow-800 hover:bg-yellow-100">
                  <Link href="#lubricants">SQ Lubricants</Link>
                </Button>
                <Button asChild size="lg" className="bg-white text-red-800 hover:bg-red-100">
                  <Link href="#replacement-parts">Replacement Parts</Link>
                </Button>
                <Button asChild size="lg" className="bg-white text-purple-800 hover:bg-purple-100">
                  <Link href="#on-call-service">On Call Service</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tractors Section - First */}
        <section id="tractors" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Tractor className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold">Tractors</h2>
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Powerful and reliable tractors from SQ Etian. 
              From compact 32HP to heavy-duty 70HP models.
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tractors.length > 0 ? tractors.map(product => (
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
                          <Tractor className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      {product.featured && (
                        <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-green-600 font-bold text-xl mb-3">
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
                      <Button asChild className="w-full">
                        <Link href={`/products/${product.slug}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )) : (
                  <p className="col-span-full text-gray-500">No tractors available</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Harvestors Section - Second */}
        <section id="harvestors" className="py-16 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Cog className="w-8 h-8 text-amber-600" />
              <h2 className="text-3xl font-bold">Harvestors & Combine Machines</h2>
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl">
              High-efficiency harvestors for fast and safe crop harvesting. 
              Advanced technology for minimum grain loss.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {harvestors.length > 0 ? harvestors.map(product => (
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
                        <Cog className="w-16 h-16 text-gray-400" />
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
                <p className="col-span-full text-gray-500">No harvestors available</p>
              )}
            </div>
          </div>
        </section>

        {/* Rotavators Section - Third */}
        <section id="rotavators" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Settings className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold">Rotavators & Tillage Equipment</h2>
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Quality rotavators for efficient soil preparation. 
              Compatible with all major tractor brands.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {rotavators.length > 0 ? rotavators.map(product => (
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
                        <Cog className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-green-600 font-bold text-xl mb-3">
                      ৳{product.price?.toLocaleString()}
                    </p>
                    <Button asChild className="w-full">
                      <Link href={`/products/${product.slug}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              )) : (
                <p className="col-span-full text-gray-500">No rotavators available</p>
              )}
            </div>
          </div>
        </section>

        {/* Spray Machines Section - Fourth */}
        <section id="spray-machines" className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Cog className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Spray Machines & Equipment</h2>
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Professional spray equipment for effective crop protection. 
              Available in various capacities for different farm sizes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sprayMachines.length > 0 ? sprayMachines.map(product => (
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
                        <Cog className="w-16 h-16 text-gray-400" />
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
                <p className="col-span-full text-gray-500">No spray machines available</p>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose SQ Field Machinery?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Genuine Parts</h3>
                <p className="text-gray-600 text-sm">All spare parts available</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Service Support</h3>
                <p className="text-gray-600 text-sm">Trained technicians across Bangladesh</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tractor className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Easy Finance</h3>
                <p className="text-gray-600 text-sm">Flexible payment options</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cog className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Training Provided</h3>
                <p className="text-gray-600 text-sm">Free operator training</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-green-800 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Our Machinery Experts</h2>
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

        {/* SQ Lubricants Section */}
        <section className="py-20 bg-gradient-to-r from-[#2D5A27] via-[#2D5A27] to-[#1a3d16] text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#85BF35]/20 border border-[#85BF35]/30 mb-4">
                  <Cog className="w-4 h-4 text-[#85BF35]" />
                  <span className="text-[#85BF35] text-sm font-medium">Premium Quality</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">SQ Lubricants</h2>
                <p className="text-white/80 mb-6">
                  Keep your machinery running smoothly with our premium lubricants. Specially formulated for 
                  agricultural equipment in Bangladesh's climate conditions.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#85BF35]" />
                    <span className="text-sm">Engine Oils</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#85BF35]" />
                    <span className="text-sm">Hydraulic Fluids</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#85BF35]" />
                    <span className="text-sm">Gear Oils</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#85BF35]" />
                    <span className="text-sm">Greases</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="secondary" size="lg">
                    <Link href="/products/lubricants">
                      View Lubricants <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#2D5A27]">
                    <Phone className="w-5 h-5 mr-2" /> Enquire Now
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden flex items-center justify-center">
                  <Cog className="w-24 h-24 text-white/30" />
                </div>
                <div className="absolute -bottom-4 -right-4 px-6 py-3 bg-[#FFD700] text-[#333333] font-bold rounded-lg shadow-lg">
                  +50 Products
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
