'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, List, Map } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DealerCard, DealerListItem, type Dealer } from '@/components/features/dealer-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDealers, useDistricts, useDivisions } from '@/hooks/use-dealers';
import { Loader2 } from 'lucide-react';

const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
    </div>
  ),
});

export default function DealersPage() {
  const [viewMode, setViewMode] = React.useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDivision, setSelectedDivision] = React.useState<string>('all');
  const [selectedDealer, setSelectedDealer] = React.useState<Dealer | null>(null);

  const { data: dealers, isLoading } = useDealers({
    division: selectedDivision !== 'all' ? selectedDivision : undefined,
    search: searchQuery || undefined,
  });

  const { data: divisions = [] } = useDivisions();

  const filteredDealers = React.useMemo(() => {
    if (!dealers) return [];
    
    return dealers.filter((dealer) => {
      const matchesSearch = 
        dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dealer.district.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDivision = 
        selectedDivision === 'all' || 
        dealer.division === selectedDivision;
      return matchesSearch && matchesDivision;
    });
  }, [dealers, searchQuery, selectedDivision]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <section className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Find a Dealer</h1>
            <p className="text-white/80">
              Locate authorized dealers and distributors across Bangladesh
            </p>
          </div>
        </section>

        <section className="py-6 bg-white border-b sticky top-16 md:top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-4 items-center w-full md:w-auto">
                <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Divisions</SelectItem>
                    {divisions.map((div) => (
                      <SelectItem key={div} value={div}>{div}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-4 py-2 ${viewMode === 'map' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                  >
                    <Map className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 flex-1">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDealers.map((dealer) => (
                  <DealerCard
                    key={dealer.id}
                    dealer={dealer}
                    onSelect={setSelectedDealer}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[500px] rounded-xl overflow-hidden border">
                  <MapComponent
                    dealers={filteredDealers}
                    selectedDealer={selectedDealer}
                    onSelectDealer={setSelectedDealer}
                  />
                </div>

                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">
                      {filteredDealers.length} Dealer{filteredDealers.length !== 1 ? 's' : ''} Found
                    </h3>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {filteredDealers.map((dealer) => (
                      <DealerListItem
                        key={dealer.id}
                        dealer={dealer}
                        onSelect={setSelectedDealer}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!isLoading && filteredDealers.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No dealers found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <Card className="bg-primary text-white border-0">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Become an Authorized Dealer</h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Interested in becoming a distributor for SQ Agriculture products? 
                  Contact our sales team to learn more about partnership opportunities.
                </p>
                <Button asChild variant="secondary" size="lg">
                  <a href="/contact">Contact Sales Team</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
