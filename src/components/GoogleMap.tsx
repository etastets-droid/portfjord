import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with Leaflet in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface GoogleMapProps {
  language: 'en' | 'es';
}

export function GoogleMap({ language }: GoogleMapProps) {
  const center: [number, number] = [-51.592324626389164, -72.6646527857463];
  const zoom = 14;

  return (
    <div className="h-80 w-full rounded-lg overflow-hidden shadow-card">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
            <div className="text-sm">
              <strong>Puerto Fjord</strong>
              <br />
              {language === 'en' 
                ? 'Luxury Patagonian Retreat'
                : 'Refugio de Lujo en la Patagonia'
              }
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
