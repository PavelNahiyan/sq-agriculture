'use client';

import * as React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export interface ProductFilters {
  search?: string;
  category?: string;
  categoryType?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  sortBy?: string;
}

interface ProductFilterSidebarProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  categories?: { id: string; name: string; slug: string }[];
  categoryTypes?: { value: string; label: string }[];
  className?: string;
}

export function ProductFilterSidebar({
  filters,
  onFilterChange,
  categories = [],
  categoryTypes = [
    { value: 'SEEDS', label: 'Seeds' },
    { value: 'PESTICIDES', label: 'Crop Protection' },
    { value: 'MACHINERY', label: 'Machinery' },
  ],
  className,
}: ProductFilterSidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      sortBy: filters.sortBy || 'featured',
    });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy') return false;
    if (key === 'inStock' || key === 'featured') return value === true;
    return value !== undefined && value !== '' && value !== 'all';
  }).length;

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsOpen(true)}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </span>
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className={cn(
        'bg-white rounded-xl border p-6 space-y-6',
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Filters</h3>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-primary"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search products..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        {/* Category Type */}
        <div className="space-y-3">
          <Label>Category Type</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.categoryType === 'SEEDS'}
                onCheckedChange={(checked) => 
                  updateFilter('categoryType', checked ? 'SEEDS' : undefined)
                }
              />
              <span className="text-sm">Seeds</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.categoryType === 'PESTICIDES'}
                onCheckedChange={(checked) => 
                  updateFilter('categoryType', checked ? 'PESTICIDES' : undefined)
                }
              />
              <span className="text-sm">Crop Protection</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.categoryType === 'MACHINERY'}
                onCheckedChange={(checked) => 
                  updateFilter('categoryType', checked ? 'MACHINERY' : undefined)
                }
              />
              <span className="text-sm">Machinery</span>
            </label>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full"
            />
            <span className="text-gray-400">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={filters.sortBy || 'featured'}
            onValueChange={(value) => updateFilter('sortBy', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Availability */}
        <div className="space-y-3">
          <Label>Availability</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.inStock === true}
                onCheckedChange={(checked) => updateFilter('inStock', checked || undefined)}
              />
              <span className="text-sm">In Stock Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.featured === true}
                onCheckedChange={(checked) => updateFilter('featured', checked || undefined)}
              />
              <span className="text-sm">Featured Only</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 lg:hidden overflow-y-auto animate-slide-in-left">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Filters</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-4">
              {/* Same filters as desktop */}
              <div className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="mobile-search">Search</Label>
                  <Input
                    id="mobile-search"
                    placeholder="Search products..."
                    value={filters.search || ''}
                    onChange={(e) => updateFilter('search', e.target.value)}
                  />
                </div>

                {/* Category Type */}
                <div className="space-y-3">
                  <Label>Category Type</Label>
                  <Select
                    value={filters.categoryType || 'all'}
                    onValueChange={(value) => updateFilter('categoryType', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <Label>Price Range</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select
                    value={filters.sortBy || 'featured'}
                    onValueChange={(value) => updateFilter('sortBy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div className="space-y-3">
                  <Label>Availability</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.inStock === true}
                        onCheckedChange={(checked) => updateFilter('inStock', checked || undefined)}
                      />
                      <span className="text-sm">In Stock Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.featured === true}
                        onCheckedChange={(checked) => updateFilter('featured', checked || undefined)}
                      />
                      <span className="text-sm">Featured Only</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t p-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={clearFilters}>
                Clear All
              </Button>
              <Button className="flex-1" onClick={() => setIsOpen(false)}>
                Show Results
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
