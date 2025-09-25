
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Skeleton } from './ui/skeleton';

// Fix for default icon issue with webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

type Geolocation = {
  latitude: number;
  longitude: number;
};

type OpenStreetMapProps = {
  location: Geolocation;
  popupText?: string;
  zoom?: number;
};

const OpenStreetMapComponent = ({ location, popupText, zoom = 16 }: OpenStreetMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
        // This is the correct way to fix the icon issue in Next.js/Webpack
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: markerIcon2x.src,
            iconUrl: markerIcon.src,
            shadowUrl: markerShadow.src,
        });

      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: zoom,
        zoomControl: true,
        maxZoom: 18,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const marker = L.marker([location.latitude, location.longitude]).addTo(map);
      if (popupText) {
        marker.bindPopup(popupText).openPopup();
      }
    }
  }, []); // Empty dependency array to run only once

  if (!location) {
      return <Skeleton className="h-full w-full" />;
  }

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default OpenStreetMapComponent;
