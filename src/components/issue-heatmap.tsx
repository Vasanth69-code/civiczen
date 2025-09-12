
"use client";

import { useMap, MapContainer, TileLayer } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet.heat';
import { LatLngExpression, LatLngTuple } from 'leaflet';
import { Issue } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

// We have to create a custom component to use leaflet.heat, as it's a leaflet plugin
const HeatmapLayer = ({ points }: { points: (LatLngExpression | number[])[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;
    
    // The type for leaflet.heat is not perfectly compatible with leaflet, so we cast to any
    const heat = (L as any).heatLayer(points, { 
        radius: 25,
        blur: 20,
        maxZoom: 18,
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
};


interface IssueHeatmapProps {
    issues: Issue[];
}

export function IssueHeatmap({ issues }: IssueHeatmapProps) {
  
  useEffect(() => {
      require('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css');
      require("leaflet-defaulticon-compatibility");
  }, []);

  if (!issues || issues.length === 0) {
    return <div>No issue data available for the heatmap.</div>;
  }

  const center: LatLngTuple = [20.5937, 78.9629]; // Center of India

  const points = issues.map(issue => [issue.location.lat, issue.location.lng, 1]); // latitude, longitude, intensity

  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden z-0">
        <MapContainer center={center} zoom={5} className="h-full w-full">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <HeatmapLayer points={points} />
        </MapContainer>
    </div>
  );
}

    