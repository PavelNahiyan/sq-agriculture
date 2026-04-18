'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, List, Map, Package, Navigation, Phone, Mail } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProducts } from '@/hooks/use-products';
import { useDealers } from '@/hooks/use-dealers';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { Dealer } from '@/lib/shared-types';

const AnimatedMap = dynamic(() => import('@/components/features/animated-dealer-map'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
    </div>
  ),
});

export default function StoreLocatorPage() {
  const [viewMode, setViewMode] = React.useState<'list' | 'map'>('map');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDivision, setSelectedDivision] = React.useState<string>('all');
  const [selectedProduct, setSelectedProduct] = React.useState<string>('all');
  const [selectedDealer, setSelectedDealer] = React.useState<Dealer | null>(null);

  const { data: products } = useProducts({ limit: 200 });
  const { data: dealers } = useDealers({
    division: selectedDivision !== 'all' ? selectedDivision : undefined,
  });

  const selectedProductData = React.useMemo(() => {
    if (!products || selectedProduct === 'all') return null;
    return products.find((p) => p.id === selectedProduct);
  }, [products, selectedProduct]);

  const availableDealerIds = React.useMemo(() => {
    if (!selectedProductData?.productLocations) return new Set<string>();
    return new Set(selectedProductData.productLocations.map((pl) => pl.dealerId));
  }, [selectedProductData]);

  const divisions = React.useMemo(() => {
    if (!dealers) return [];
    const divs = [...new Set(dealers.map((d: Dealer) => d.division))];
    return divs.sort();
  }, [dealers]);

  const filteredDealers = React.useMemo(() => {
    if (!dealers) return [];
    
    return dealers.filter((dealer: Dealer) => {
      if (selectedProduct !== 'all' && availableDealerIds.size > 0) {
        if (!availableDealerIds.has(dealer.id)) return false;
      }
      const matchesSearch = 
        searchQuery === '' ||
        dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dealer.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dealer.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [dealers, searchQuery, selectedProduct, availableDealerIds]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-900 to-green-700 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Where to Buy
            </h1>
            <p className="text-xl text-green-100 mb-6">
              Find SQ Agriculture products at authorized dealers near you
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 bg-gray-50 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search location or dealer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Divisions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Divisions</SelectItem>
                  {divisions.map((div) => (
                    <SelectItem key={div} value={div}>{div}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  onClick={() => setViewMode('map')}
                  className="gap-2"
                >
                  <Map className="w-4 h-4" />
                  Map
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  className="gap-2"
                >
                  <List className="w-4 h-4" />
                  List
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {filteredDealers.length} Authorized Dealers Found
              </h2>
              {selectedProduct !== 'all' && (
                <Badge variant="outline" className="gap-1">
                  <Package className="w-3 h-3" />
                  Filtered by product
                </Badge>
              )}
            </div>

            {viewMode === 'map' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="h-[600px] rounded-lg overflow-hidden border">
                    <AnimatedMap
                      dealers={filteredDealers}
                      selectedDealer={selectedDealer}
                      onSelectDealer={setSelectedDealer}
                    />
                  </div>
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredDealers.map((dealer: Dealer) => (
                    <DealerLocationCard
                      key={dealer.id}
                      dealer={dealer}
                      isSelected={selectedDealer?.id === dealer.id}
                      onClick={() => setSelectedDealer(dealer)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDealers.map((dealer: Dealer) => (
                  <DealerLocationCard
                    key={dealer.id}
                    dealer={dealer}
                    isSelected={false}
                    onClick={() => setSelectedDealer(dealer)}
                    expanded
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-green-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Become an Authorized Dealer</h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Interested in partnering with SQ Agriculture? Contact us to become an authorized dealer in your area.
            </p>
            <Button asChild size="lg" className="bg-white text-green-800 hover:bg-green-100">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

interface DealerLocationCardProps {
  dealer: Dealer;
  isSelected: boolean;
  onClick: () => void;
  expanded?: boolean;
}

function DealerLocationCard({ dealer, isSelected, onClick, expanded }: DealerLocationCardProps) {
  const directionsUrl = dealer.latitude && dealer.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${dealer.latitude},${dealer.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.address + ' ' + dealer.district)}`;

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary border-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{dealer.name}</h3>
          {dealer.latitude && dealer.longitude && (
            <Badge className="bg-green-100 text-green-700">Mapped</Badge>
          )}
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{dealer.address}, {dealer.district}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <a href={`tel:${dealer.phone}`} className="hover:text-primary">
              {dealer.phone}
            </a>
          </div>
          {dealer.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <a href={`mailto:${dealer.email}`} className="hover:text-primary">
                {dealer.email}
              </a>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Navigation className="w-3 h-3" />
              Directions
            </Button>
          </a>
          <a
            href={`tel:${dealer.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Phone className="w-3 h-3" />
              Call
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
