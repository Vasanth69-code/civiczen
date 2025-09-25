'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icon issue with webpack
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

type Geolocation = {
  latitude: number;
  longitude: number;
};

type OpenStreetMapProps = {
  location: Geolocation;
  popupText?: string;
  zoom?: number;
};

const OpenStreetMap = ({ location, popupText, zoom = 16 }: OpenStreetMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    // Set up default icon paths
    const DefaultIcon = L.icon({
        iconRetinaUrl: iconRetinaUrl.src,
        iconUrl: iconUrl.src,
        shadowUrl: shadowUrl.src,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Initialize map only once
      const map = L.map(mapContainerRef.current).setView([location.latitude, location.longitude], zoom);
      mapInstanceRef.current = map;

      // Add tile layers
      const standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
         maxZoom: 18,
      });
      
      const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	        maxZoom: 17,
	        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });
      
      const baseMaps = {
          "Standard": standardLayer,
          "Satellite": satelliteLayer,
          "Terrain": terrainLayer,
      };

      L.control.layers(baseMaps).addTo(map);

      // Add initial marker
      markerRef.current = L.marker([location.latitude, location.longitude]).addTo(map);
      if (popupText) {
        markerRef.current.bindPopup(popupText).openPopup();
      }
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    // Update map view and marker when location changes
    if (mapInstanceRef.current) {
      const newLatLng = new L.LatLng(location.latitude, location.longitude);
      mapInstanceRef.current.setView(newLatLng, zoom);
      
      if (markerRef.current) {
        markerRef.current.setLatLng(newLatLng);
        if (popupText) {
            markerRef.current.setPopupContent(popupText);
        }
      }
    }
  }, [location, popupText, zoom]);


  return <div ref={mapContainerRef} className="h-full w-full z-0" />;
};

export default OpenStreetMap;
