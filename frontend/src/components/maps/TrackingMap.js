'use client';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

export default function TrackingMap({ driverPosition, pickup, drop }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const driverMarker = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || mapInstance.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Ensure the container is clean
      if (mapRef.current && mapRef.current._leaflet_id) return;
      if (mapInstance.current) return;

      // Fix Leaflet default icon
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current).setView([driverPosition.lat, driverPosition.lng], 7);
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Pickup marker (green)
      const pickupIcon = L.divIcon({
        html: '<div style="background:#10b981;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
        iconSize: [24, 24], iconAnchor: [12, 12], className: ''
      });
      L.marker([pickup.lat, pickup.lng], { icon: pickupIcon }).addTo(map)
        .bindPopup(`<b>Pickup</b><br/>${pickup.city}`);

      // Drop marker (red)
      const dropIcon = L.divIcon({
        html: '<div style="background:#ef4444;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
        iconSize: [24, 24], iconAnchor: [12, 12], className: ''
      });
      L.marker([drop.lat, drop.lng], { icon: dropIcon }).addTo(map)
        .bindPopup(`<b>Drop</b><br/>${drop.city}`);

      // Driver marker (blue pulsing)
      const driverIcon = L.divIcon({
        html: '<div style="position:relative"><div style="background:#6366f1;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(99,102,241,0.5)"></div><div style="position:absolute;top:-6px;left:-6px;width:32px;height:32px;border-radius:50%;border:2px solid #6366f1;opacity:0.4;animation:pulse-ring 2s infinite"></div></div>',
        iconSize: [20, 20], iconAnchor: [10, 10], className: ''
      });
      driverMarker.current = L.marker([driverPosition.lat, driverPosition.lng], { icon: driverIcon }).addTo(map)
        .bindPopup('<b>Driver</b><br/>Live Position');

      // Route line
      const routeCoords = [
        [pickup.lat, pickup.lng],
        [19.8, 73.5], [20.5, 74.8], [21.1, 76.0], [22.0, 77.5],
        [23.2, 77.4], [25.4, 78.5], [27.0, 77.5],
        [drop.lat, drop.lng]
      ];
      L.polyline(routeCoords, { color: '#6366f1', weight: 3, opacity: 0.7, dashArray: '10 5' }).addTo(map);

      // Fit bounds
      const bounds = L.latLngBounds([[pickup.lat, pickup.lng], [drop.lat, drop.lng]]);
      map.fitBounds(bounds, { padding: [50, 50] });

      setLoaded(true);
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update driver marker position
  useEffect(() => {
    if (driverMarker.current && loaded) {
      driverMarker.current.setLatLng([driverPosition.lat, driverPosition.lng]);
    }
  }, [driverPosition, loaded]);

  return <div ref={mapRef} className="h-[500px] w-full rounded-xl" />;
}
