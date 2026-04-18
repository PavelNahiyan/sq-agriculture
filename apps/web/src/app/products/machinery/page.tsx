'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProducts } from '@/hooks/use-products';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, MapPin, Phone, Mail, Tractor, Cog, Settings } from 'lucide-react';

export default function MachineryPage() {
  const { data: products, isLoading } = useProducts({ categoryType: 'MACHINERY', limit: 200 });

  const machineryProducts = products || [];

  const tractors = machineryProducts.filter(p => 
    p.name.toLowerCase().includes('tractor')
  );

  const rotavators = machineryProducts.filter(p => 
    p.name.toLowerCase().includes('rotavator') ||
    p.name.toLowerCase().includes('rotavt')
  );

  const implements_ = machineryProducts.filter(p => 
    p.name.toLowerCase().includes('fieldking') ||
    p.name.toLowerCase().includes('zoomlion') ||
    p.name.toLowerCase().includes('implement')
  );

  const sprayers = machineryProducts.filter(p => 
    p.name.toLowerCase().includes('sprayer') ||
    p.name.toLowerCase().includes('spray') ||
    p.name.toLowerCase().includes('spraying')
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-900 to-green-700 text-white py-20">
          <div className="absolute inset-0 opacity-10">
            <Image 
              src="/uploads/products/Etian.png" 
              alt="SQ Machinery"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                SQ Agriculture Machinery
              </h1>
              <p className="text-xl text-green-100 mb-6">
                Premium agricultural machinery from trusted brands. 
                Designed for Bangladesh farming conditions.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-white text-green-800 hover:bg-green-100">
                  <Link href="#tractors">View Tractors</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="#rotavators">View Implements</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Partners */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Our Trusted Partners</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center p-2">
                  <Image 
                    src="/uploads/products/Etian.png" 
                    alt="Etian" 
                    width={80} 
                    height={80} 
                    className="object-contain"
                  />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600">Etian</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center p-2">
                  <Image 
                    src="/uploads/products/Daedong.png" 
                    alt="Daedong" 
                    width={80} 
                    height={80} 
                    className="object-contain"
                  />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600">Daedong</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center p-2">
                  <Image 
                    src="/uploads/products/Zoomlion.png" 
                    alt="Zoomlion" 
                    width={80} 
                    height={80} 
                    className="object-contain"
                  />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600">Zoomlion</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center p-2">
                  <Image 
                    src="/uploads/products/Fieldking.png" 
                    alt="Fieldking" 
                    width={80} 
                    height={80} 
                    className="object-contain"
                  />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600">Fieldking</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tractors Section */}
        <section id="tractors" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Tractor className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold">Tractors</h2>
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Powerful and reliable tractors designed for Bangladesh farming conditions. 
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

        {/* Rotavators Section */}
        <section id="rotavators" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Settings className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold">Rotavators & Implements</h2>
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Quality rotavators and farm implements for efficient soil preparation. 
              Compatible with all major tractor brands.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              )) : <p className="col-span-full text-gray-500">No rotavators available</p>}
              {implements_.length > 0 ? implements_.map(product => (
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
              )) : null}
            </div>
          </div>
        </section>

        {/* Sprayers Section */}
        {sprayers.length > 0 && (
          <section id="sprayers" className="py-16 bg-blue-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 mb-8">
                <Settings className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold">Sprayers & Spray Equipment</h2>
              </div>
              <p className="text-gray-600 mb-8 max-w-2xl">
                Professional spray equipment for effective crop protection. 
                Available in various capacities for different farm sizes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sprayers.map(product => (
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
                          <Settings className="w-16 h-16 text-gray-400" />
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

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose SQ Machinery?</h2>
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

        {/* Contact Section */}
        <section className="py-16 bg-green-800 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Our Machinery Experts</h2>
                <p className="text-green-100 mb-8">
                  Get expert advice on choosing the right machinery for your farm. 
                  Our team is ready to help you.
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

        {/* Back to Products */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <Button asChild variant="outline">
              <Link href="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Products
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
