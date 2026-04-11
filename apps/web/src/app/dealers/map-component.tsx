'use client';

import * as React from 'react';
import type { Dealer } from '@/components/features/dealer-card';

// This component is loaded dynamically with ssr: false
interface MapComponentProps {
  dealers: Dealer[];
  selectedDealer: Dealer | null;
  onSelectDealer: (dealer: Dealer) => void;
}

export default function MapComponent({ dealers, selectedDealer, onSelectDealer }: MapComponentProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<any>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || map) return;

    // Dynamically import leaflet
    const initMap = async () => {
      const L = (await import('leaflet')).default;
      
      // Import leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      if (mapRef.current) {
        const mapInstance = L.map(mapRef.current).setView([23.685, 90.356], 7);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(mapInstance);

        setMap(mapInstance);
        setIsLoaded(true);
      }
    };

    initMap();
  }, []);

  // Add markers when dealers change
  React.useEffect(() => {
    if (!map || !isLoaded) return;

    const initMarkers = async () => {
      const L = (await import('leaflet')).default;

      // Clear existing markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Custom icon
      const customIcon = L.divIcon({
        html: `<div style="
          background: #2D5016;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3" fill="#2D5016"/>
          </svg>
        </div>`,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      // Add markers for each dealer with coordinates
      dealers.forEach((dealer) => {
        if (dealer.latitude && dealer.longitude) {
          const marker = L.marker([dealer.latitude, dealer.longitude], { icon: customIcon })
            .addTo(map)
            .bindPopup(`
              <div style="min-width: 200px;">
                <h4 style="font-weight: bold; margin-bottom: 4px;">${dealer.name}</h4>
                <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${dealer.district}, ${dealer.division}</p>
                <p style="font-size: 12px;">${dealer.phone}</p>
              </div>
            `);

          marker.on('click', () => {
            onSelectDealer(dealer);
          });
        }
      });

      // Fit bounds if there are markers
      const validDealers = dealers.filter(d => d.latitude && d.longitude);
      if (validDealers.length > 0) {
        const bounds = L.latLngBounds(validDealers.map(d => [d.latitude!, d.longitude!]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    };

    initMarkers();
  }, [map, dealers, isLoaded, onSelectDealer]);

  // Center on selected dealer
  React.useEffect(() => {
    if (!map || !selectedDealer || !selectedDealer.latitude || !selectedDealer.longitude) return;

    map.setView([selectedDealer.latitude, selectedDealer.longitude], 12);
  }, [map, selectedDealer]);

  return (
    <div ref={mapRef} className="h-full w-full" />
  );
}
