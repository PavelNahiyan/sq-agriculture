'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductCard, ProductCardSkeleton } from '@/components/features/product-card';
import { useProducts } from '@/hooks/use-products';

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'SEEDS', label: 'Seeds' },
  { value: 'PESTICIDES', label: 'Crop Protection' },
  { value: 'MACHINERY', label: 'Machinery' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category')?.toUpperCase() || 'all';
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [category, setCategory] = React.useState(initialCategory);
  const [sortBy, setSortBy] = React.useState('featured');

  const { data: products, isLoading, error } = useProducts({
    category: category !== 'all' ? category : undefined,
  });

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    
    let filtered = products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.nameBn?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });

    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    return filtered;
  }, [products, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <section className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Products</h1>
            <p className="text-white/80">Explore our comprehensive range of agricultural products</p>
          </div>
        </section>

        <section className="py-6 border-b bg-white sticky top-16 md:top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {category !== 'all' && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-gray-500">Active filters:</span>
                <Badge variant="secondary" className="gap-1">
                  {categoryOptions.find(c => c.value === category)?.label}
                  <button onClick={() => setCategory('all')} className="ml-1 hover:text-white">×</button>
                </Badge>
              </div>
            )}
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <p className="text-sm text-gray-500 mb-6">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                  <Search className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load products</h3>
                <p className="text-gray-500 mb-4">Please try again later</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setCategory('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-gray-600 mb-6">Contact us and we&apos;ll help you find the right product for your needs.</p>
            <Button asChild size="lg">
              <a href="/contact">
                Contact Us <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
