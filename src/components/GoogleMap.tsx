import { useState, useRef, useEffect, useMemo } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/// <reference types="google.maps" />

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  className?: string;
  onReady?: () => void;
}

function MapComponent({ center, zoom, className, onReady }: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapId: 'puerto-fjord-map', // Add mapId for Advanced Markers
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#a8c4d4' }],
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#e8e8e8' }],
          },
        ],
      });
      
      // Add marker using regular Marker as fallback
      new window.google.maps.Marker({
        position: center,
        map: newMap,
        title: 'Puerto Fjord - Luxury Patagonian Retreat',
      });
      
      setMap(newMap);
      onReady?.();
    }
  }, [ref, map, center, zoom]);

  return <div ref={ref} className={className} />;
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="h-80 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="h-80 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <p className="text-muted-foreground">Error loading map</p>
        </div>
      );
    default:
      return null;
  }
};

interface GoogleMapProps {
  language: 'en' | 'es';
}

export function GoogleMap({ language }: GoogleMapProps) {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('googleMapsApiKey') || '');
  const [tempApiKey, setTempApiKey] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!isReady) setUseFallback(true);
    }, 9000);
    return () => clearTimeout(id);
  }, [isReady]);

  // Memoize libraries and center to avoid re-initialization loops
  const libraries = useMemo(() => ['marker'] as any, []);
  const center = useMemo(() => ({
    lat: -51.592324626389164,
    lng: -72.6646527857463,
  }), []);

  const handleSaveApiKey = () => {
    localStorage.setItem('googleMapsApiKey', tempApiKey);
    setApiKey(tempApiKey);
    setTempApiKey('');
  };

  if (!apiKey) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">
            {language === 'en' ? 'Google Maps Configuration' : 'Configuración de Google Maps'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {language === 'en' 
              ? 'To display the map, please enter your Google Maps API key. You can get one from the Google Cloud Console.'
              : 'Para mostrar el mapa, ingresa tu clave de API de Google Maps. Puedes obtener una desde Google Cloud Console.'
            }
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder={language === 'en' ? 'Enter Google Maps API Key' : 'Ingresa la clave de API de Google Maps'}
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />
            <Button onClick={handleSaveApiKey} disabled={!tempApiKey.trim()}>
              {language === 'en' ? 'Save' : 'Guardar'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {language === 'en' 
              ? 'Your API key will be stored locally in your browser.'
              : 'Tu clave de API se guardará localmente en tu navegador.'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  if (useFallback) {
    return (
      <div className="h-80 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            {language === 'en' ? 'Map temporarily unavailable' : 'Mapa temporalmente no disponible'}
          </p>
          <p className="text-xs text-muted-foreground/80">-51.592°, -72.665°</p>
        </div>
      </div>
    );
  }

  return (
    <Wrapper apiKey={apiKey} render={render} libraries={libraries} language={language === 'es' ? 'es-419' : 'en'}>
      <MapComponent
        center={center}
        zoom={14}
        className="h-80 w-full rounded-lg"
        onReady={() => setIsReady(true)}
      />
    </Wrapper>
  );
}