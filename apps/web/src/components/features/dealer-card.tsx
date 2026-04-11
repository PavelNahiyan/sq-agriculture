'use client';

import * as React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface Dealer {
  id: string;
  name: string;
  nameBn?: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  division: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  description?: string;
}

interface DealerCardProps {
  dealer: Dealer;
  variant?: 'grid' | 'list' | 'compact';
  onSelect?: (dealer: Dealer) => void;
  className?: string;
  locale?: string;
}

export function DealerCard({ dealer, variant = 'grid', onSelect, className, locale = 'en' }: DealerCardProps) {
  const isCompact = variant === 'compact';

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`tel:${dealer.phone}`, '_self');
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`mailto:${dealer.email}`, '_self');
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.preventDefault();
    if (dealer.latitude && dealer.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${dealer.latitude},${dealer.longitude}`,
        '_blank'
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${dealer.name}, ${dealer.district}, Bangladesh`)}`,
        '_blank'
      );
    }
  };

  return (
    <Card
      className={cn(
        'group transition-all duration-300 hover:shadow-lg hover:border-primary/30',
        className
      )}
    >
      <CardContent className={cn('p-0', isCompact ? 'p-4' : 'p-6')}>
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {dealer.image ? (
              <img
                src={dealer.image}
                alt={dealer.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-primary">
                {dealer.name.charAt(0)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-primary transition-colors">
              {locale === 'bn' && dealer.nameBn ? dealer.nameBn : dealer.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{dealer.district}, {dealer.division}</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className={cn('space-y-2 mt-4', isCompact && 'mt-3')}>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-400" />
            <a
              href={`tel:${dealer.phone}`}
              className="text-sm text-gray-700 hover:text-primary transition-colors"
              onClick={handleCall}
            >
              {dealer.phone}
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400" />
            <a
              href={`mailto:${dealer.email}`}
              className="text-sm text-gray-700 hover:text-primary transition-colors truncate"
              onClick={handleEmail}
            >
              {dealer.email}
            </a>
          </div>

          {!isCompact && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <span className="text-sm text-gray-600">{dealer.address}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {dealer.description && !isCompact && (
          <p className="text-sm text-gray-600 mt-4 line-clamp-2">
            {dealer.description}
          </p>
        )}

        {/* Actions */}
        <div className={cn('flex gap-2 mt-4', isCompact ? 'mt-3' : '')}>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleCall}
          >
            <Phone className="w-4 h-4 mr-1" />
            Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleDirections}
          >
            <MapPin className="w-4 h-4 mr-1" />
            Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact list item variant
export function DealerListItem({ dealer, onSelect, locale = 'en' }: DealerCardProps) {
  return (
    <button
      onClick={() => onSelect?.(dealer)}
      className="w-full flex items-center gap-4 p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="font-semibold text-primary">
          {dealer.name.charAt(0)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">
          {dealer.name}
        </h4>
        <p className="text-sm text-gray-500 truncate">
          {dealer.district}, {dealer.division}
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
}
