'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

const DealerMapContent = dynamic(
  () => import('./dealer-map-content').then((mod) => mod.DealerMapContent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Loading map...</span>
      </div>
    ),
  }
);

export interface Dealer {
  id: string;
  name: string;
  nameBn?: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  division: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  description?: string;
}

interface DealerMapProps {
  dealers: Dealer[];
  selectedDealer?: Dealer | null;
  onSelectDealer?: (dealer: Dealer | null) => void;
  className?: string;
}

const DIVISIONS = [
  'All Divisions',
  'Dhaka',
  'Chittagong',
  'Khulna',
  'Barisal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
  'Rajshahi',
];

export function DealerMap({
  dealers,
  selectedDealer,
  onSelectDealer,
  className,
}: DealerMapProps) {
  const [selectedDivision, setSelectedDivision] = React.useState('All Divisions');

  const filteredDealers =
    selectedDivision === 'All Divisions'
      ? dealers
      : dealers.filter((d) => d.division === selectedDivision);

  return (
    <DealerMapContent
      dealers={filteredDealers}
      selectedDealer={selectedDealer}
      onSelectDealer={onSelectDealer}
      selectedDivision={selectedDivision}
      setSelectedDivision={setSelectedDivision}
      divisions={DIVISIONS}
      className={className}
    />
  );
}
