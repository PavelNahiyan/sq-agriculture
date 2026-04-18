'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProducts } from '@/hooks/use-products';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tag, 
  Sparkles, 
  Gift, 
  Percent, 
  ArrowRight,
  Wheat,
  Bug,
  Leaf,
  Tractor,
  Droplets,
  Beaker,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react';

interface PromoSection {
  id: string;
  title: string;
  description: string;
  categorySlug: string;
  categoryType: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  offerText: string;
}

const promoSections: PromoSection[] = [
  {
    id: 'fertilizers',
    title: 'Fertilizers',
    description: 'Premium quality fertilizers for optimal crop yield',
    categorySlug: 'fertilizer',
    categoryType: 'FERTILIZERS',
    icon: <Beaker className="w-10 h-10" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    offerText: 'Flat 15% Off on Bulk Orders',
  },
  {
    id: 'pesticides',
    title: 'Pesticides',
    description: 'Effective crop protection solutions',
    categorySlug: 'pesticide',
    categoryType: 'PESTICIDES',
    icon: <Bug className="w-10 h-10" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    offerText: 'Buy 2 Get 1 Free on Selected Items',
  },
  {
    id: 'seeds',
    title: 'Seeds',
    description: 'High-quality hybrid and organic seeds',
    categorySlug: 'seeds',
    categoryType: 'SEEDS',
    icon: <Wheat className="w-10 h-10" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    offerText: '20% Off on All Seeds',
  },
  {
    id: 'micronutrients',
    title: 'Micronutrients',
    description: 'Essential nutrients for healthy growth',
    categorySlug: 'micronutrients',
    categoryType: 'MICRONUTRIENTS',
    icon: <Leaf className="w-10 h-10" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    offerText: 'Free Delivery on Orders Above ৳5000',
  },
  {
    id: 'machinery',
    title: 'Farm Machinery',
    description: 'Modern tractors and agricultural equipment',
    categorySlug: 'field-machinery',
    categoryType: 'MACHINERY',
    icon: <Tractor className="w-10 h-10" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    offerText: 'Special Financing Available',
  },
];

function PromoBanner() {
  return (
    <section className="relative bg-gradient-to-r from-green-600 to-emerald-700 text-white py-12 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-repeat" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <span className="text-yellow-300 font-semibold uppercase tracking-wider">Limited Time Offer</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Promotional Offers
            </h1>
            <p className="text-xl text-green-100 max-w-2xl">
              Discover exclusive deals, discounts, and special offers on agricultural products. 
              Save big on quality farming essentials!
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Percent className="w-12 h-12 mx-auto mb-2 text-yellow-300" />
              <div className="text-4xl font-bold">Up to 30%</div>
              <div className="text-green-100">Discount Available</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
            <Clock className="w-5 h-5" />
            <span>Offer Valid Until: December 31, 2026</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
            <TrendingUp className="w-5 h-5" />
            <span>New Offers Added Weekly</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PromoCard({ section, products }: { section: PromoSection; products: any[] }) {
  const categoryProducts = (products || []).slice(0, 4);
  const hasProducts = categoryProducts.length > 0;

  return (
    <section id={section.id} className="py-16">
      <div className="container mx-auto px-4">
        <div className={`${section.bgColor} rounded-2xl p-8 mb-8`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`${section.color} bg-white rounded-xl p-4 shadow-lg`}>
                {section.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold">{section.title}</h2>
                <p className="text-gray-600">{section.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-red-500 text-white rounded-xl px-6 py-3 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                <span className="font-bold">{section.offerText}</span>
              </div>
              <Button asChild variant="outline" className="gap-2">
                <Link href={`/products/${section.categorySlug}`}>
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {hasProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="relative h-48 bg-gray-100">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {section.icon}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    OFFER
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.price > 0 ? (
                        <p className="text-lg font-bold text-green-600">
                          ৳{product.price.toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">Contact for price</p>
                      )}
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/products/${product.slug}`}>
                        Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 mb-4">No products available in this category yet.</p>
            <Button asChild>
              <Link href={`/products/${section.categorySlug}`}>
                Browse {section.title}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <Tag className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Stay Updated with Latest Offers</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about new promotions, 
          discounts, and exclusive offers!
        </p>
        <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
            Subscribe
          </Button>
        </form>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-200">
          <Star className="w-4 h-4" />
          <span>Join 10,000+ subscribers getting exclusive deals</span>
        </div>
      </div>
    </section>
  );
}

export default function PromotionalOffersPage() {
  const { data: fertilizers } = useProducts({ categoryType: 'FERTILIZERS', limit: 10 });
  const { data: pesticides } = useProducts({ categoryType: 'PESTICIDES', limit: 10 });
  const { data: seeds } = useProducts({ categoryType: 'SEEDS', limit: 10 });
  const { data: micronutrients } = useProducts({ categoryType: 'MICRONUTRIENTS', limit: 10 });
  const { data: machinery } = useProducts({ categoryType: 'MACHINERY', limit: 10 });

  const productsMap: Record<string, any[]> = {
    fertilizers: fertilizers || [],
    pesticides: pesticides || [],
    seeds: seeds || [],
    micronutrients: micronutrients || [],
    machinery: machinery || [],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        <PromoBanner />
        
        {promoSections.map((section) => (
          <PromoCard 
            key={section.id} 
            section={section} 
            products={productsMap[section.id] || []} 
          />
        ))}
        
        <NewsletterSection />
      </main>
      
      <Footer />
    </div>
  );
}