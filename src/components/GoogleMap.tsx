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

    // Define base layers
    const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    });

    const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19,
    });

    // Create hybrid layer (satellite + labels)
    const satelliteBase = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    });

    const labelsLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
      pane: 'shadowPane'
    });

    const hybridMap = L.layerGroup([satelliteBase, labelsLayer]);

    // Add default layer (street map)
    streetMap.addTo(map);

    // Add layer control to switch between street, satellite and hybrid
    const baseMaps = {
      [language === 'en' ? 'Map' : 'Mapa']: streetMap,
      [language === 'en' ? 'Satellite' : 'Satélite']: satelliteMap,
      [language === 'en' ? 'Hybrid' : 'Híbrido']: hybridMap,
    };

    L.control.layers(baseMaps).addTo(map);

    // Add scale control (coordinates display)
    L.control.scale({
      metric: true,
      imperial: false,
      position: 'topright'
    }).addTo(map);

    // Add marker
    const marker = L.marker([-51.592324626389164, -72.6646527857463]).addTo(map);
    
    marker.bindPopup(
      `<div style="text-align: center;">
        <strong>Puerto Fjord</strong>
      </div>`
    ).openPopup();

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
