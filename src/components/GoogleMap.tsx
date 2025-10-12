import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface GoogleMapProps {
  language: 'en' | 'es';
}

export function GoogleMap({ language }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([-51.592324626389164, -72.6646527857463], 10);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add marker
    const marker = L.marker([-51.592324626389164, -72.6646527857463]).addTo(map);
    
    marker.bindPopup(
      `<div style="text-align: center;">
        <strong>Puerto Fjord</strong><br/>
        ${language === 'en' ? 'Luxury Patagonian Retreat' : 'Refugio de Lujo en la Patagonia'}
      </div>`
    );

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [language]);

  return (
    <div 
      ref={mapRef} 
      className="h-80 w-full rounded-lg"
      style={{ zIndex: 0 }}
    />
  );
}
