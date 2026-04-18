'use client';

import * as React from 'react';
import { useDealers } from '@/hooks/use-dealers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, MapPin, Search } from 'lucide-react';
import type { Dealer } from '@/lib/shared-types';

interface ProductLocationSelectorProps {
  selectedDealerIds: string[];
  onSelectionChange: (dealerIds: string[]) => void;
}

export function ProductLocationSelector({
  selectedDealerIds,
  onSelectionChange,
}: ProductLocationSelectorProps) {
  const { data: dealers, isLoading } = useDealers();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDivision, setSelectedDivision] = React.useState<string>('');

  const divisions = React.useMemo(() => {
    if (!dealers) return [];
    const divs = [...new Set(dealers.map((d: Dealer) => d.division))];
    return divs.sort();
  }, [dealers]);

  const filteredDealers = React.useMemo(() => {
    if (!dealers) return [];
    return dealers.filter((dealer: Dealer) => {
      const matchesSearch = searchTerm === '' || 
        dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDivision = selectedDivision === '' || dealer.division === selectedDivision;
      return matchesSearch && matchesDivision;
    });
  }, [dealers, searchTerm, selectedDivision]);

  const handleToggle = (dealerId: string) => {
    if (selectedDealerIds.includes(dealerId)) {
      onSelectionChange(selectedDealerIds.filter(id => id !== dealerId));
    } else {
      onSelectionChange([...selectedDealerIds, dealerId]);
    }
  };

  const handleSelectAll = () => {
    onSelectionChange(filteredDealers.map((d: Dealer) => d.id));
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2">Loading dealers...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Product Availability Locations
        </CardTitle>
        <CardDescription>
          Select where this product is available. These locations will be shown on the store locator page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search dealers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-white text-sm min-w-[150px]"
          >
            <option value="">All Divisions</option>
            {divisions.map((div) => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-primary hover:underline"
          >
            Select All ({filteredDealers.length})
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-gray-500 hover:underline"
          >
            Clear All
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-gray-600">
            Selected: {selectedDealerIds.length}
          </span>
        </div>

        <div className="border rounded-lg max-h-[400px] overflow-y-auto">
          {filteredDealers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No dealers found matching your criteria.
            </div>
          ) : (
            <div className="divide-y">
              {filteredDealers.map((dealer: Dealer) => (
                <div
                  key={dealer.id}
                  className={`p-4 flex items-start gap-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedDealerIds.includes(dealer.id) ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => handleToggle(dealer.id)}
                >
                  <Checkbox
                    checked={selectedDealerIds.includes(dealer.id)}
                    onCheckedChange={() => handleToggle(dealer.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{dealer.name}</span>
                      {dealer.latitude && dealer.longitude && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          Mapped
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {dealer.address}, {dealer.district}
                    </p>
                    <p className="text-xs text-gray-400">
                      {dealer.division} • {dealer.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedDealerIds.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-800">
              Product will be available at {selectedDealerIds.length} location(s)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
