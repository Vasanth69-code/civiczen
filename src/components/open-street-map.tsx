
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Type for geolocation props
type Geolocation = {
  latitude: number;
  longitude: number;
};

// Props for the map component
type OpenStreetMapProps = {
  location: Geolocation | null;
};

// Default icon setup for Leaflet markers
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const OpenStreetMap = ({ location }: OpenStreetMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerInstance = useRef<L.Marker | null>(null);

  // Default center of the map (India) if no location is provided
  const defaultCenter: Geolocation = { latitude: 20.5937, longitude: 78.9629 };
  const defaultZoom = 5;

  // Initialize the map
  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined' && mapRef.current && !mapInstance.current) {
      const initialLocation = location || defaultCenter;
      
      mapInstance.current = L.map(mapRef.current).setView(
        [initialLocation.latitude, initialLocation.longitude],
        location ? 16 : defaultZoom
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

      if (location) {
        markerInstance.current = L.marker([location.latitude, location.longitude], { icon: defaultIcon }).addTo(mapInstance.current);
      }
    }

    // Cleanup function to remove the map instance when the component unmounts
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only ONCE

  // Update map view and marker when location prop changes
  useEffect(() => {
    if (mapInstance.current && location) {
      const newLatLng = L.latLng(location.latitude, location.longitude);
      mapInstance.current.setView(newLatLng, 16);

      if (markerInstance.current) {
        markerInstance.current.setLatLng(newLatLng);
      } else {
        markerInstance.current = L.marker(newLatLng, { icon: defaultIcon }).addTo(mapInstance.current);
      }
    }
  }, [location]);

  return <div ref={mapRef} className="h-full w-full" />;
};

export default OpenStreetMap;
