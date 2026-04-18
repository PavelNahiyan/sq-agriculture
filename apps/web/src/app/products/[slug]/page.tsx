'use client';

import * as React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Phone, 
  Mail, 
  Share2, 
  Heart, 
  CheckCircle,
  ChevronRight,
  Minus,
  Plus,
  Loader2
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard, ProductCardSkeleton } from '@/components/features/product-card';
import { InquiryForm } from '@/components/features/inquiry-form';
import { InquireModal } from '@/components/features/inquire-modal';
import { LicenseInfo } from '@/components/features/license-info';
import { useProduct, useRelatedProducts } from '@/hooks/use-products';

interface ProductDetailPageProps {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { data: product, isLoading, error } = useProduct(params.slug);
  const { data: relatedProducts, isLoading: isRelatedLoading } = useRelatedProducts(product?.id || '');
  
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [showInquireModal, setShowInquireModal] = React.useState(false);

  const formatPrice = (price: number, unit?: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return unit ? `${formatted}/${unit}` : formatted;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  const defaultImages = ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'];
  const images = product.images?.length > 0 ? product.images : defaultImages;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link href="/products" className="text-gray-500 hover:text-primary">Products</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {product.category && (
                <>
                  <Link href={`/products?category=${product.category.type.toLowerCase()}`} className="text-gray-500 hover:text-primary">
                    {product.category.name}
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </>
              )}
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {product.featured && (
                    <Badge className="absolute top-4 left-4" variant="secondary">Featured</Badge>
                  )}
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === idx ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  {product.category && (
                    <Badge variant="outline" className="mb-2">{product.category.name}</Badge>
                  )}
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  {product.nameBn && (
                    <p className="text-lg text-gray-500 mt-1">{product.nameBn}</p>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  {product.hidePrice ? (
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary-dark"
                      onClick={() => setShowInquireModal(true)}
                    >
                      Inquire Now
                    </Button>
                  ) : product.price ? (
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(product.price, product.priceUnit)}
                    </span>
                  ) : (
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary-dark"
                      onClick={() => setShowInquireModal(true)}
                    >
                      Inquire Now
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {product.inStock ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-700 font-medium">In Stock</span>
                    </>
                  ) : (
                    <span className="text-red-500 font-medium">Out of Stock</span>
                  )}
                </div>

                <p className="text-gray-600 leading-relaxed">{product.description}</p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button size="lg" disabled={!product.inStock}>
                    Add to Inquiry
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {product.brochure && (
                  <Button variant="outline" className="gap-2" asChild>
                    <a href={product.brochure} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" />
                      Download Brochure (PDF)
                    </a>
                  </Button>
                )}

                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500 mb-3">Have questions? Contact us directly:</p>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm" className="gap-1" asChild>
                        <a href="tel:+8801711111111">
                          <Phone className="w-4 h-4" />
                          Call Now
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1" asChild>
                        <a href="mailto:agriculture@sq-bd.com">
                          <Mail className="w-4 h-4" />
                          Email
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="inquiry">Send Inquiry</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specs" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.specs && Object.keys(product.specs).length > 0 ? (
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(product.specs).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b">
                            <dt className="text-gray-500">{key}</dt>
                            <dd className="font-medium text-gray-900">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="text-gray-500">No specifications available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p>{product.description}</p>
                      {product.descriptionBn && (
                        <p className="text-gray-600 mt-4">{product.descriptionBn}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inquiry" className="mt-6">
                <div className="max-w-xl">
                  <InquiryForm
                    productId={product.id}
                    productName={product.name}
                    variant="standalone"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* License Information */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <LicenseInfo />
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            {isRelatedLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : relatedProducts && relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No related products found.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <InquireModal
        open={showInquireModal}
        onOpenChange={setShowInquireModal}
        productName={product?.name || ''}
        contactEmail={product?.contactEmail}
        contactPhone={product?.contactPhone}
        contactWhatsApp={product?.contactWhatsApp}
      />
    </div>
  );
}
