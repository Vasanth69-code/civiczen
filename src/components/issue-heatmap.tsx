
"use client";

import { MapContainer, TileLayer } from 'react-leaflet';
import { useIssues } from '@/context/issue-context';
import { LatLngTuple } from 'leaflet';
import HeatmapLayer from 'react-leaflet-heatmap';
import 'leaflet/dist/leaflet.css';

// This is a workaround for a known issue with react-leaflet and Next.js
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";
import { Issue } from '@/lib/types';


interface IssueHeatmapProps {
    issues: Issue[];
}

export function IssueHeatmap({ issues }: IssueHeatmapProps) {
  
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
        <HeatmapLayer
            points={points}
            longitudeExtractor={(m: any) => m[1]}
            latitudeExtractor={(m: any) => m[0]}
            intensityExtractor={(m: any) => parseFloat(m[2])}
            radius={20}
            blur={20}
            max={1.0}
        />
        </MapContainer>
    </div>
  );
}
