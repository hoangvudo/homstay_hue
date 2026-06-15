"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
// Import CSS cho leaflet
import 'leaflet/dist/leaflet.css';
// Fix lỗi icon mặc định của leaflet khi dùng với Webpack/Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
// Toạ độ trung tâm Huế
const center: [number, number] = [16.4637, 107.5909];
const locations = [
  { id: 1, name: 'An Hien Garden Homestay', pos: [16.4600, 107.5800] as [number, number], price: '450K' },
  { id: 2, name: 'Imperial Citadel View', pos: [16.4700, 107.5850] as [number, number], price: '650K' },
  { id: 3, name: 'Perfume River Boutique', pos: [16.4650, 107.5950] as [number, number], price: '850K' },
];
export default function Map() {
  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 z-0">
      <MapContainer center={center} zoom={14} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc) => (
          <Marker key={loc.id} position={loc.pos} icon={icon}>
            <Popup>
              <div className="font-bold">{loc.name}</div>
              <div className="text-hue-red">{loc.price}/đêm</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
