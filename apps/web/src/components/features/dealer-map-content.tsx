'use client';

import * as React from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Dealer {
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

interface DealerMapContentProps {
  dealers: Dealer[];
  selectedDealer?: Dealer | null;
  onSelectDealer?: (dealer: Dealer | null) => void;
  selectedDivision: string;
  setSelectedDivision: (division: string) => void;
  divisions: string[];
  className?: string;
}

export function DealerMapContent({
  dealers,
  selectedDealer,
  onSelectDealer,
  selectedDivision,
  setSelectedDivision,
  divisions,
  className,
}: DealerMapContentProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const markersRef = React.useRef<any[]>([]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const initMap = async () => {
      const L = await import('leaflet');

      if (mapInstanceRef.current) return;

      const defaultCenter: [number, number] = [23.685, 90.3563];
      const map = L.map(mapRef.current!).setView(defaultCenter, 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;

      updateMarkers(map, L);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  React.useEffect(() => {
    if (mapInstanceRef.current) {
      import('leaflet').then((L) => {
        updateMarkers(mapInstanceRef.current, L);
      });
    }
  }, [dealers, selectedDealer]);

  const updateMarkers = (map: any, L: any) => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const selectedIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [30, 48],
      iconAnchor: [15, 48],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      className: 'hue-rotate-90',
    });

    dealers.forEach((dealer) => {
      const coords = getCoordinatesForDistrict(dealer.district);
      const lat = dealer.latitude ?? coords?.[0];
      const lng = dealer.longitude ?? coords?.[1];

      if (!lat || !lng) return;

      const isSelected = selectedDealer?.id === dealer.id;
      const marker = L.marker([lat, lng], {
        icon: isSelected ? selectedIcon : defaultIcon,
      })
        .addTo(map)
        .bindPopup(`
          <div class="p-2 min-w-[200px]">
            <h3 class="font-semibold text-gray-900">${dealer.name}</h3>
            <p class="text-sm text-gray-600 mt-1">${dealer.district}, ${dealer.division}</p>
            <p class="text-sm text-gray-600">${dealer.address}</p>
            <div class="mt-2 flex gap-2">
              <a href="tel:${dealer.phone}" class="text-primary text-sm hover:underline">Call</a>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" class="text-primary text-sm hover:underline">Directions</a>
            </div>
          </div>
        `);

      marker.on('click', () => {
        onSelectDealer?.(dealer);
      });

      markersRef.current.push(marker);
    });

    if (dealers.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  };

  const getCoordinatesForDistrict = (district: string): [number, number] | null => {
    const districtCoords: Record<string, [number, number]> = {
      Dhaka: [23.8103, 90.4125],
      Chittagong: [22.3569, 91.7832],
      Khulna: [22.8456, 89.5403],
      Barisal: [22.701, 90.3535],
      Sylhet: [24.8949, 91.9614],
      Rangpur: [25.7439, 89.2752],
      Mymensingh: [24.7471, 90.4073],
      Rajshahi: [24.3745, 88.6042],
      Gazipur: [24.002, 90.4265],
      Narayanganj: [23.6237, 90.503],
      Cumilla: [23.4683, 91.1868],
      Bogura: [24.846, 89.377],
      Jessore: [23.1694, 89.2278],
    };
    return districtCoords[district] || [23.685, 90.3563];
  };

  const handleGetDirections = (dealer: Dealer) => {
    const coords = getCoordinatesForDistrict(dealer.district);
    const lat = dealer.latitude ?? coords?.[0];
    const lng = dealer.longitude ?? coords?.[1];
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank'
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap gap-2">
        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <div ref={mapRef} className="w-full h-[500px] rounded-lg overflow-hidden" />

        {selectedDealer && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-[1000]">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedDealer.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedDealer.address}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedDealer.district}, {selectedDealer.division}
                </p>
              </div>
              <button
                onClick={() => onSelectDealer?.(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <a
                href={`tel:${selectedDealer.phone}`}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Call
              </a>
              <button
                onClick={() => handleGetDirections(selectedDealer)}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Directions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
