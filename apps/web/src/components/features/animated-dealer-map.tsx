'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Dealer } from '@/lib/shared-types';
import { Phone, MapPin, Navigation, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnimatedDealerMapProps {
  dealers: Dealer[];
  selectedDealer: Dealer | null;
  onSelectDealer: (dealer: Dealer) => void;
}

const createCustomIcon = (isSelected: boolean = false) => {
  const color = isSelected ? '#2D5016' : '#16a34a';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative">
        <div class="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center animate-pulse-slow">
          <div class="w-8 h-8 rounded-full" style="background-color: ${color}; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent" style="border-top-color: ${color};"></div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

const createPulseIcon = () => {
  return L.divIcon({
    className: 'pulse-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: rgba(22, 163, 74, 0.3);
        border-radius: 50%;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

function MapController({ selectedDealer }: { selectedDealer: Dealer | null }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (selectedDealer?.latitude != null && selectedDealer?.longitude != null && 
        !isNaN(selectedDealer.latitude) && !isNaN(selectedDealer.longitude)) {
      map.flyTo([selectedDealer.latitude, selectedDealer.longitude], 14, {
        duration: 1,
      });
    }
  }, [selectedDealer, map]);
  
  return null;
}

export default function AnimatedDealerMap({
  dealers,
  selectedDealer,
  onSelectDealer,
}: AnimatedDealerMapProps) {
  const defaultCenter: LatLngTuple = [23.8103, 90.4125]; // Dhaka
  
  const hasValidCoords = (lat: number | null | undefined, lng: number | null | undefined) => {
    return lat != null && lng != null && !isNaN(lat as number) && !isNaN(lng as number);
  };

  const center: LatLngTuple = selectedDealer && hasValidCoords(selectedDealer.latitude, selectedDealer.longitude)
    ? [selectedDealer.latitude!, selectedDealer.longitude!]
    : defaultCenter;

  const validDealers = (dealers || []).filter(
    (d: Dealer) => hasValidCoords(d.latitude, d.longitude)
  );

  return (
    <>
      <style jsx global>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .7;
          }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .leaflet-popup-content {
          margin: 0;
          min-width: 200px;
        }
      `}</style>
      
      <MapContainer
        center={center}
        zoom={selectedDealer ? 14 : 7}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController selectedDealer={selectedDealer} />
        
        {validDealers.map((dealer: Dealer) => (
          <Marker
            key={dealer.id}
            position={[dealer.latitude as number, dealer.longitude as number]}
            icon={createCustomIcon(selectedDealer?.id === dealer.id)}
            eventHandlers={{
              click: () => onSelectDealer(dealer),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-base mb-2">{dealer.name}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{dealer.address}, {dealer.district}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    <a href={`tel:${dealer.phone}`} className="hover:text-green-600">
                      {dealer.phone}
                    </a>
                  </div>
                  {dealer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      <a href={`mailto:${dealer.email}`} className="hover:text-green-600">
                        {dealer.email}
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${dealer.latitude},${dealer.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button size="sm" className="w-full gap-1 text-xs">
                      <Navigation className="w-3 h-3" />
                      Directions
                    </Button>
                  </a>
                  <a href={`tel:${dealer.phone}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full gap-1 text-xs">
                      <Phone className="w-3 h-3" />
                      Call
                    </Button>
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {validDealers.length === 0 && (
          <Marker position={defaultCenter} icon={createCustomIcon(false)}>
            <Popup>
              <div className="p-2 text-center">
                <p className="font-medium">No mapped dealers in this area</p>
                <p className="text-sm text-gray-500 mt-1">Try selecting a different division</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
}
